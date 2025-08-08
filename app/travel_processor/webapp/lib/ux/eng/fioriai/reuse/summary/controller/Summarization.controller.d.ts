declare module "ux/eng/fioriai/reuse/summary/controller/Summarization.controller" {
    import { $InputEvent } from "@sap/ui/richtexteditor/RichTextEditor";
    import TreeItemBase from "sap/m/TreeItemBase";
    import Event from "sap/ui/base/Event";
    import View from "sap/ui/core/mvc/View";
    import { default as RichTextEditor, RichTextEditor$ChangeEvent, RichTextEditor$ReadyRecurringEvent } from "sap/ui/richtexteditor/RichTextEditor";
    export default class SummarizationController {
        private model;
        private readonly resourceModel;
        private readonly deviceModel;
        private summarizeDialog;
        private sectionSelectDialog;
        private richTextEditor;
        private getSummary;
        private getTargetLanguage;
        /**
         * Initializes the local JSON model.
         *
         * @param view to summarize.
         */
        private initModel;
        /**
         * Public function to start summarization.
         *
         * @param view to summarize.
         */
        startSummarization(view: View): Promise<void>;
        /**
         * Handles the selection change event.
         *
         * @param event The selection change event.
         */
        onSelectionChange: (event: Event<{
            listItems: TreeItemBase[];
        }>) => void;
        /**
         * Handles the event when all sections are selected or deselected.
         *
         * @param event The UI5 event object containing the selected state.
         */
        onSelectAllSections: (event: Event<{
            selected: boolean;
        }>) => void;
        /**
         * Handle for section selection dialog.
         * Sending the actual button press event is defined in SectionSelect.fragment.xml
         */
        onSectionSelectContinue: () => Promise<void>;
        /**
         * Custom Options for MessageToast.
         * Position on RichTextEditor Center Bottom
         *
         * @returns Parameters<typeof MessageToast.show>[1]
         */
        private getMsgToastOptions;
        /**
         * For RichTextEditor, button groups 'styleselect' and 'table' can only be added after the editor is ready,
         * thus we handle ready event of RichTextEditor here and add the button groups.
         *
         * @param event object containing the reference to RichTextEditor.
         */
        onRichTextEditorReady(event: Event<object, RichTextEditor>): void;
        /**
         * Handle once change event of RichTextEditor, can catch "Clear all"
         *
         * @param event of {RichTextEditor$ChangeEvent}.
         */
        onRichTextEditorChanged: (event: RichTextEditor$ChangeEvent) => void;
        /**
         * Handle input event for RTE.
         * NOTE: From SAPUI5 Doc: getNativeApi(): @object - The native editor object (here: The TinyMCE editor instance)
         *
         * @param event of {RichTextEditor$ReadyRecurringEvent}
         */
        onReadyRecurring(event: RichTextEditor$ReadyRecurringEvent): void;
        /**
         * Handle "input" Event
         *
         * @param textContent of RTE
         * @param inputEvent input event data
         */
        checkRTEContent(textContent: string, inputEvent?: $InputEvent): void;
        /**
         * Logic when need to enabled/disabled 'Copy All' and 'Share' buttons
         *
         * @param action enabled/disabled
         */
        allowInteractWithSummaryContent: (action: boolean) => void;
        /**
         * Summarize the text.
         */
        private summarize;
        /**
         * Handle for button press for copy to clipboard.
         */
        onPressCopyToClipboard(): void;
        /**
         * Handler for close button press on dialog.
         */
        onClose(): void;
    }
}
//# sourceMappingURL=Summarization.controller.d.ts.map