declare module "ux/eng/fioriai/reuse/summary/SmartSummary" {
    import View from "sap/ui/core/mvc/View";
    import SummarizationController from "ux/eng/fioriai/reuse/summary/controller/Summarization.controller";
    const summarizer: SummarizationController;
    /**
     * Configuration options for the summarize function.
     */
    interface SummarizeOptions {
        /** UI5 view to summarize */
        view: View;
    }
    /**
     * Initiates smart summarization of a UI5 view.
     *
     * @param options Configuration containing the view to summarize
     */
    function summarize(options: SummarizeOptions): Promise<void>;
}
//# sourceMappingURL=SmartSummary.d.ts.map