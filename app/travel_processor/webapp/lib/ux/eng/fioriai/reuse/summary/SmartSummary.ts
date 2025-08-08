import View from "sap/ui/core/mvc/View";
import Log from "ux/eng/fioriai/reuse/common/log";
import SummarizationController from "ux/eng/fioriai/reuse/summary/controller/Summarization.controller";

const summarizer = new SummarizationController();

/**
 * Configuration options for the summarize function.
 */
export interface SummarizeOptions {
    /** UI5 view to summarize */
    view: View;
}

/**
 * Initiates smart summarization of a UI5 view.
 *
 * @param options Configuration containing the view to summarize
 */
export async function summarize(options: SummarizeOptions): Promise<void> {
    Log.debug(`Starting summarization of view ${options.view.getId()}`);
    try {
        await summarizer.startSummarization(options.view);
    } catch (error) {
        Log.error("Error performing summarization", error as Error);
    }
}
