declare module "ux/eng/fioriai/reuse/summary/controller/config/model" {
    import { SummarizationModel } from "ux/eng/fioriai/reuse/summary/types";
    /**
     * Contain the rich text edit config for button groups and buttons. Some groups can not
     * be set initially and need to be added after the editor is ready. See function
     * onRichTextEditorReady()
     *
     * See also https://sapui5.hana.ondemand.com/sdk/#/topic/d4f3f1598373452bb73f2120930c133c
     */
    const richTextEditConfig: object[];
    const summaryValuesTemplate: SummarizationModel["summaryValues"];
    const sectionsTemplate: SummarizationModel["sections"];
}
//# sourceMappingURL=model.d.ts.map