"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/thirdparty/marked", "sap/base/Log", "sap/base/i18n/Localization", "sap/m/HBox", "sap/m/MessageBox", "sap/m/MessageToast", "sap/ui/Device", "sap/ui/core/Element", "sap/ui/core/Fragment", "sap/ui/core/Lib", "sap/ui/model/json/JSONModel", "sap/ui/model/resource/ResourceModel", "ux/eng/fioriai/reuse/common/FeedbackRow", "ux/eng/fioriai/reuse/common/result", "ux/eng/fioriai/reuse/common/text", "ux/eng/fioriai/reuse/service/fioriAIAction", "../extraction/index", "../section/index", "../share/index", "./config/model"], function (__marked, Log, Localization, HBox, MessageBox, MessageToast, Device, Element, Fragment, Lib, JSONModel, ResourceModel, __ux_eng_fioriai_reuse_common_FeedbackRow, __ux_eng_fioriai_reuse_common_result, __ux_eng_fioriai_reuse_common_text, __ux_eng_fioriai_reuse_service_fioriAIAction, ___extraction_index, ___section_index, ___share_index, ___config_model) {
  "use strict";

  const marked = __marked["marked"];
  const createFeedbackRow = __ux_eng_fioriai_reuse_common_FeedbackRow["createFeedbackRow"];
  const success = __ux_eng_fioriai_reuse_common_result["success"];
  const getLibraryResourceBundle = __ux_eng_fioriai_reuse_common_text["getLibraryResourceBundle"];
  const getText = __ux_eng_fioriai_reuse_common_text["getText"];
  const callFioriAiSummarizeAction = __ux_eng_fioriai_reuse_service_fioriAIAction["callFioriAiSummarizeAction"];
  const getTextToSummarize = ___extraction_index["getTextToSummarize"];
  const createSectionTree = ___section_index["createSectionTree"];
  const getSelectedSections = ___section_index["getSelectedSections"];
  const selectAllSections = ___section_index["selectAllSections"];
  const selectionChange = ___section_index["selectionChange"];
  const unstashSections = ___section_index["unstashSections"];
  const isShareAvailable = ___share_index["isShareAvailable"];
  const shareViaClipboard = ___share_index["shareViaClipboard"];
  const sectionsTemplate = ___config_model["sectionsTemplate"];
  const summaryValuesTemplate = ___config_model["summaryValuesTemplate"];
  class SummarizationController {
    resourceModel = new ResourceModel({
      bundle: getLibraryResourceBundle()
    });
    deviceModel = new JSONModel(Device).setDefaultBindingMode("OneWay");
    async getSummary(content, languageCode) {
      //determine service URL prefix dynamically
      const view = this.model?.getProperty("/view");
      const appComponent = view.getParent().getAppComponent();
      const manifest = appComponent.getManifestObject();
      let serviceUrl = manifest.resolveUri("sap/opu/odata4/sap/aiu_ui_prompt/srvd/sap/aiu_ui_prompt/0001/");
      //remove leading slash
      if (serviceUrl.startsWith("/")) {
        serviceUrl = serviceUrl.substring(1);
      }
      const response = await callFioriAiSummarizeAction(serviceUrl, "Summarization/com.sap.gateway.srvd.aiu_ui_prompt.v0001.summarize", {
        content,
        languageCode
      });
      return response.success ? success(response.data.value) : response;
    }
    getTargetLanguage() {
      const checkLengthLimit = (current, next) => current.length + next.length + 1 < 12;
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
    initModel(view) {
      const summaryValues = JSON.parse(JSON.stringify(summaryValuesTemplate));
      const sections = JSON.parse(JSON.stringify(sectionsTemplate));
      const modelData = {
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
    async startSummarization(view) {
      this.initModel(view);
      this.model?.setProperty("/summaryValues/isShareAvailable", await isShareAvailable());
      if (!this.sectionSelectDialog) {
        this.sectionSelectDialog = await Fragment.load({
          name: "ux.eng.fioriai.reuse.summary.fragment.SectionSelectDialog",
          controller: this
        });
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
      Element.getElementById("SectionsTree").collapseAll();
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
          Log.info("Error during summarization: ", error);
          this.sectionSelectDialog?.close();
        }
      }
    }

    /**
     * Handles the selection change event.
     *
     * @param event The selection change event.
     */
    onSelectionChange = event => {
      const selectedItems = event.getParameter("listItems");
      selectionChange(selectedItems, this.model);
    };

    /**
     * Handles the event when all sections are selected or deselected.
     *
     * @param event The UI5 event object containing the selected state.
     */
    onSelectAllSections = event => {
      selectAllSections(event, this.model);
    };

    /**
     * Handle for section selection dialog.
     * Sending the actual button press event is defined in SectionSelect.fragment.xml
     */
    onSectionSelectContinue = async () => {
      //allSelected is also set in case of only partially selected sections
      if (!this.model?.getProperty("/sections/allSelected")) {
        MessageBox.error(getText("MISSING_SECTION_SELECTION_ERROR"), {
          styleClass: "custom-messagebox-width"
        });
      } else {
        this.summarize().catch(error => Log.error("Error during summarization", error));
        if (!this.summarizeDialog) {
          // lazy-load the required libraries
          await Promise.all([Lib.load({
            name: "sap.ui.richtexteditor"
          }), Lib.load({
            name: "sap.suite.ui.commons"
          })]);
          this.summarizeDialog = await Fragment.load({
            name: "ux.eng.fioriai.reuse.summary.fragment.SummarizeDialog",
            controller: this
          });
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
    getMsgToastOptions() {
      return {
        of: this.richTextEditor,
        offset: "0 -16"
      };
    }

    /**
     * For RichTextEditor, button groups 'styleselect' and 'table' can only be added after the editor is ready,
     * thus we handle ready event of RichTextEditor here and add the button groups.
     *
     * @param event object containing the reference to RichTextEditor.
     */
    onRichTextEditorReady(event) {
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
    onRichTextEditorChanged = event => {
      this.checkRTEContent(event.getSource().getNativeApi().getBody().textContent ?? "");
    };

    /**
     * Handle input event for RTE.
     * NOTE: From SAPUI5 Doc: getNativeApi(): @object - The native editor object (here: The TinyMCE editor instance)
     *
     * @param event of {RichTextEditor$ReadyRecurringEvent}
     */
    onReadyRecurring(event) {
      const RteNativeAPI = event.getSource().getNativeApi();
      RteNativeAPI.on("input", inputEvent => this.checkRTEContent(RteNativeAPI.getBody().textContent ?? "", inputEvent));
      RteNativeAPI.on("undo", inputEvent => this.checkRTEContent(RteNativeAPI.getBody().textContent ?? "", inputEvent));
      RteNativeAPI.on("redo", inputEvent => this.checkRTEContent(RteNativeAPI.getBody().textContent ?? "", inputEvent));
    }

    /**
     * Handle "input" Event
     *
     * @param textContent of RTE
     * @param inputEvent input event data
     */
    checkRTEContent(textContent, inputEvent) {
      const lengthTextContent = textContent.trim().length;

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
    allowInteractWithSummaryContent = action => {
      if (this.model?.getProperty("/summaryValues/allowSummaryInteraction") !== action) {
        this.model?.setProperty("/summaryValues/allowSummaryInteraction", action);
      }
    };

    /**
     * Summarize the text.
     */
    async summarize() {
      this.model?.setProperty("/summaryValues/showLoading", true);
      this.model?.setProperty("/summaryValues/isFailed", false);
      this.model?.setProperty("/summaryValues/summaryValue", "");
      this.model?.setProperty("/summaryValues/showAiNotice", false);
      this.allowInteractWithSummaryContent(false);
      const view = this.model?.getProperty("/view");
      try {
        const excludedNodes = getSelectedSections(this.model, false, true).map(member => member.sectionID);
        const response = await this.getSummary(await getTextToSummarize(view, new Set(excludedNodes)), this.getTargetLanguage());
        if (!response.success) {
          throw new Error(response.message);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        this.model?.setProperty("/summaryValues/summaryValue", marked.parse(response.data));
        const feedbackRowPlaceholder = Element.getElementById("feedbackRowPlaceholder");
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
      const summaryHtml = this.model?.getProperty("/summaryValues/summaryValue") ?? "";
      shareViaClipboard(summaryHtml).then(() => {
        MessageToast.show(getText("COPY_TO_CLIPBOARD_SUCCESS"), this.getMsgToastOptions());
      }).catch(error => {
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
  return SummarizationController;
});
//# sourceMappingURL=Summarization-dbg.controller.js.map
