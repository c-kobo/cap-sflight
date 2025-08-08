import { $InputEvent, $TinyMceEditorInstance } from "@sap/ui/richtexteditor/RichTextEditor";
import { marked } from "marked";
import Log from "sap/base/Log";
import Localization from "sap/base/i18n/Localization";
import type AppComponent from "sap/fe/core/AppComponent";
import Dialog from "sap/m/Dialog";
import HBox from "sap/m/HBox";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import Tree from "sap/m/Tree";
import TreeItemBase from "sap/m/TreeItemBase";
import Device from "sap/ui/Device";
import Event from "sap/ui/base/Event";
import Element from "sap/ui/core/Element";
import Fragment from "sap/ui/core/Fragment";
import Lib from "sap/ui/core/Lib";
import View from "sap/ui/core/mvc/View";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import {
    default as RichTextEditor,
    RichTextEditor$ChangeEvent,
    RichTextEditor$ReadyRecurringEvent
} from "sap/ui/richtexteditor/RichTextEditor";
import { createFeedbackRow } from "ux/eng/fioriai/reuse/common/FeedbackRow";
import { Result, success } from "ux/eng/fioriai/reuse/common/result";
import { getLibraryResourceBundle, getText } from "ux/eng/fioriai/reuse/common/text";
import { callFioriAiSummarizeAction } from "ux/eng/fioriai/reuse/service/fioriAIAction";
import { getTextToSummarize } from "../extraction/index";
import {
    createSectionTree,
    getSelectedSections,
    selectAllSections,
    selectionChange,
    unstashSections
} from "../section/index";
import { isShareAvailable, shareViaClipboard } from "../share/index";
import type { SummarizationModel } from "../types";
import { sectionsTemplate, summaryValuesTemplate } from "./config/model";

export default class SummarizationController {
    private model: JSONModel | undefined;
    private readonly resourceModel = new ResourceModel({ bundle: getLibraryResourceBundle() });
    private readonly deviceModel = new JSONModel(Device).setDefaultBindingMode("OneWay");

    private summarizeDialog: Dialog | undefined;
    private sectionSelectDialog: Dialog | undefined;
    private richTextEditor: RichTextEditor | undefined;

    private async getSummary(content: string, languageCode: string): Promise<Result<string>> {
        //determine service URL prefix dynamically
        const view = this.model?.getProperty("/view") as View;

        const appComponent = (view.getParent() as unknown as { getAppComponent(): AppComponent }).getAppComponent();
        const manifest = appComponent.getManifestObject();
        let serviceUrl = manifest.resolveUri("sap/opu/odata4/sap/aiu_ui_prompt/srvd/sap/aiu_ui_prompt/0001/");
        //remove leading slash
        if (serviceUrl.startsWith("/")) {
            serviceUrl = serviceUrl.substring(1);
        }
        const response = await callFioriAiSummarizeAction<{ value: string }>(
            serviceUrl,
            "Summarization/com.sap.gateway.srvd.aiu_ui_prompt.v0001.summarize",
            { content, languageCode }
        );

        return response.success ? success(response.data.value) : response;
    }

    private getTargetLanguage(): string {
        const checkLengthLimit = (current: string, next: string): boolean => current.length + next.length + 1 < 12;

        const languageTag = Localization.getLanguageTag();

        // only consider language, script and region
        let result = languageTag.language;
        if (languageTag.script && checkLengthLimit(result, languageTag.script)) {
            result += `-${languageTag.script}`;
        }
        if (languageTag.region && checkLengthLimit(result, languageTag.region)) {
            result += `-${languageTag.region}`;
        }

        return result;
    }

    /**
     * Initializes the local JSON model.
     *
     * @param view to summarize.
     */
    private initModel(view: View): void {
        const summaryValues = JSON.parse(JSON.stringify(summaryValuesTemplate)) as SummarizationModel["summaryValues"];
        const sections = JSON.parse(JSON.stringify(sectionsTemplate)) as SummarizationModel["sections"];
        const modelData: SummarizationModel = {
            summaryValues,
            sections,
            view
        };
        this.model = new JSONModel(modelData, true);
    }

    /**
     * Public function to start summarization.
     *
     * @param view to summarize.
     */
    async startSummarization(view: View) {
        this.initModel(view);
        this.model?.setProperty("/summaryValues/isShareAvailable", await isShareAvailable());
        if (!this.sectionSelectDialog) {
            this.sectionSelectDialog = (await Fragment.load({
                name: "ux.eng.fioriai.reuse.summary.fragment.SectionSelectDialog",
                controller: this
            })) as Dialog;
        }
        //Dialog Cancel button
        this.sectionSelectDialog.getEndButton().attachPress(() => {
            this.sectionSelectDialog?.close();
        });
        const fnOnAfterClose = () => {
            this.model?.setProperty("/sections/busyState", false);
            this.sectionSelectDialog?.detachAfterClose(fnOnAfterClose);
        };
        this.sectionSelectDialog.attachAfterClose(fnOnAfterClose);

        this.sectionSelectDialog.setModel(this.model, "local");
        this.sectionSelectDialog.setModel(this.resourceModel, "i18n");
        (Element.getElementById("SectionsTree") as Tree).collapseAll();
        this.model?.setProperty("/sections/busyState", true);
        this.sectionSelectDialog.open();
        if (this.model) {
            try {
                // unstash sections and create section tree afterwards
                // to consider dynamic section visiblitity changes
                await unstashSections(this.model);
                const result = createSectionTree(view);
                this.model?.setProperty("/sections/sectionTree", result.sectionTree);
                this.model?.setProperty("/sections/selectCount", result.selectCount);
                this.model?.setProperty("/sections/totalCount", result.totalCount);
            } catch (error) {
                Log.info("Error during summarization: ", error as Error);
                this.sectionSelectDialog?.close();
            }
        }
    }

    /**
     * Handles the selection change event.
     *
     * @param event The selection change event.
     */
    onSelectionChange = (event: Event<{ listItems: TreeItemBase[] }>) => {
        const selectedItems = event.getParameter("listItems");
        selectionChange(selectedItems, this.model as JSONModel);
    };

    /**
     * Handles the event when all sections are selected or deselected.
     *
     * @param event The UI5 event object containing the selected state.
     */
    onSelectAllSections = (event: Event<{ selected: boolean }>) => {
        selectAllSections(event, this.model as JSONModel);
    };

    /**
     * Handle for section selection dialog.
     * Sending the actual button press event is defined in SectionSelect.fragment.xml
     */
    onSectionSelectContinue = async () => {
        //allSelected is also set in case of only partially selected sections
        if (!this.model?.getProperty("/sections/allSelected")) {
            MessageBox.error(getText("MISSING_SECTION_SELECTION_ERROR"), { styleClass: "custom-messagebox-width" });
        } else {
            this.summarize().catch((error: Error) => Log.error("Error during summarization", error));
            if (!this.summarizeDialog) {
                // lazy-load the required libraries
                await Promise.all([
                    Lib.load({ name: "sap.ui.richtexteditor" }),
                    Lib.load({ name: "sap.suite.ui.commons" })
                ]);

                this.summarizeDialog = (await Fragment.load({
                    name: "ux.eng.fioriai.reuse.summary.fragment.SummarizeDialog",
                    controller: this
                })) as Dialog;

                this.summarizeDialog.attachAfterClose(this.onClose.bind(this));

                this.summarizeDialog.setModel(this.deviceModel, "device");
                this.summarizeDialog.setModel(this.resourceModel, "i18n");

                if (this.model.getProperty("/summaryValues/isFailed")) {
                    this.summarizeDialog.setState("Error");
                }
            }

            this.summarizeDialog.setModel(this.model, "local");
            this.summarizeDialog.setInitialFocus("summaryRichTextEditor");
            this.summarizeDialog.open();
            this.sectionSelectDialog?.close();
        }
    };

    /**
     * Custom Options for MessageToast.
     * Position on RichTextEditor Center Bottom
     *
     * @returns Parameters<typeof MessageToast.show>[1]
     */
    private getMsgToastOptions(): Parameters<typeof MessageToast.show>[1] {
        return { of: this.richTextEditor, offset: "0 -16" };
    }

    /**
     * For RichTextEditor, button groups 'styleselect' and 'table' can only be added after the editor is ready,
     * thus we handle ready event of RichTextEditor here and add the button groups.
     *
     * @param event object containing the reference to RichTextEditor.
     */
    onRichTextEditorReady(event: Event<object, RichTextEditor>) {
        this.richTextEditor = event.getSource();
        this.richTextEditor.addButtonGroup({
            "name": "styleselect",
            "visible": true,
            "priority": 20,
            "customToolbarPriority": 20,
            "buttons": ["styleselect"]
        });
        this.richTextEditor.addButtonGroup({
            "name": "table",
            "visible": true,
            "priority": 60,
            "customToolbarPriority": 60,
            "buttons": ["table"]
        });
    }

    /**
     * Handle once change event of RichTextEditor, can catch "Clear all"
     *
     * @param event of {RichTextEditor$ChangeEvent}.
     */
    onRichTextEditorChanged = (event: RichTextEditor$ChangeEvent) => {
        this.checkRTEContent((event.getSource().getNativeApi() as $TinyMceEditorInstance).getBody().textContent ?? "");
    };

    /**
     * Handle input event for RTE.
     * NOTE: From SAPUI5 Doc: getNativeApi(): @object - The native editor object (here: The TinyMCE editor instance)
     *
     * @param event of {RichTextEditor$ReadyRecurringEvent}
     */
    onReadyRecurring(event: RichTextEditor$ReadyRecurringEvent) {
        const RteNativeAPI = event.getSource().getNativeApi() as $TinyMceEditorInstance;

        RteNativeAPI.on("input", (inputEvent: $InputEvent) =>
            this.checkRTEContent(RteNativeAPI.getBody().textContent ?? "", inputEvent)
        );
        RteNativeAPI.on("undo", (inputEvent: $InputEvent) =>
            this.checkRTEContent(RteNativeAPI.getBody().textContent ?? "", inputEvent)
        );
        RteNativeAPI.on("redo", (inputEvent: $InputEvent) =>
            this.checkRTEContent(RteNativeAPI.getBody().textContent ?? "", inputEvent)
        );
    }

    /**
     * Handle "input" Event
     *
     * @param textContent of RTE
     * @param inputEvent input event data
     */
    checkRTEContent(textContent: string, inputEvent?: $InputEvent) {
        const lengthTextContent: number = textContent.trim().length;

        // NOTE: When we select all and start typing a text
        if (lengthTextContent === 1 && inputEvent?.data?.length === 1) {
            this.allowInteractWithSummaryContent(true);
        }

        // NOTE: When clear all and we paste a text
        if (lengthTextContent > 1) {
            this.allowInteractWithSummaryContent(true);
        }

        // NOTE: When we clear RTE
        if (lengthTextContent === 0) {
            this.allowInteractWithSummaryContent(false);
        }
    }

    /**
     * Logic when need to enabled/disabled 'Copy All' and 'Share' buttons
     *
     * @param action enabled/disabled
     */
    allowInteractWithSummaryContent = (action: boolean) => {
        if (this.model?.getProperty("/summaryValues/allowSummaryInteraction") !== action) {
            this.model?.setProperty("/summaryValues/allowSummaryInteraction", action);
        }
    };

    /**
     * Summarize the text.
     */
    private async summarize() {
        this.model?.setProperty("/summaryValues/showLoading", true);
        this.model?.setProperty("/summaryValues/isFailed", false);
        this.model?.setProperty("/summaryValues/summaryValue", "");
        this.model?.setProperty("/summaryValues/showAiNotice", false);
        this.allowInteractWithSummaryContent(false);

        const view = this.model?.getProperty("/view") as View;

        try {
            const excludedNodes = getSelectedSections(this.model!, false, true).map((member) => member.sectionID);

            const response = await this.getSummary(
                await getTextToSummarize(view, new Set(excludedNodes)),
                this.getTargetLanguage()
            );

            if (!response.success) {
                throw new Error(response.message);
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            this.model?.setProperty("/summaryValues/summaryValue", marked.parse(response.data));

            const feedbackRowPlaceholder = Element.getElementById("feedbackRowPlaceholder") as HBox;
            if (feedbackRowPlaceholder && feedbackRowPlaceholder instanceof HBox) {
                const feedbackRow = createFeedbackRow(feedbackRowPlaceholder);
                feedbackRowPlaceholder.addItem(feedbackRow);
            }
        } catch {
            this.summarizeDialog?.setState("Error");
            this.model?.setProperty("/summaryValues/isFailed", true);
        } finally {
            this.model?.setProperty("/summaryValues/showLoading", false);
            if (!this.model?.getProperty("/summaryValues/isFailed")) {
                this.allowInteractWithSummaryContent(true);
                this.model?.setProperty("/summaryValues/showAiNotice", true);
            }
        }
    }

    /**
     * Handle for button press for copy to clipboard.
     */
    onPressCopyToClipboard() {
        const summaryHtml = (this.model?.getProperty("/summaryValues/summaryValue") as string | undefined) ?? "";
        shareViaClipboard(summaryHtml)
            .then(() => {
                MessageToast.show(getText("COPY_TO_CLIPBOARD_SUCCESS"), this.getMsgToastOptions());
            })
            .catch((error: Error) => {
                MessageToast.show(`${getText("COPY_TO_CLIPBOARD_FAIL")} ${error.message}`, this.getMsgToastOptions());
            });
    }

    /**
     * Handler for close button press on dialog.
     */
    onClose() {
        this.summarizeDialog?.close();
        this.summarizeDialog?.destroy();
        delete this.summarizeDialog;
    }
}
