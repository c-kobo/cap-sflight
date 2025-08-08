declare module "ux/eng/fioriai/reuse/easyfilter/completion/ProcessEasyFilter" {
    import { Result } from "ux/eng/fioriai/reuse/common/result";
    import { EasyFilterExpression, EasyFilterMetadata } from "ux/eng/fioriai/reuse/easyfilter/EasyFilter";
    /**
     * Apply a filter.
     */
    type ApplyFilter = {
        action: "APPLY_FILTER";
        filter: EasyFilterExpression[];
    };
    type AskToRephrase = {
        action: "ASK_TO_REPHRASE";
    };
    /**
     * Processes an EasyFilter query end-to-end.
     *
     * @param userInput The easy filter query.
     * @param metadata The metadata of the easy filter.
     * @returns The processed easy filter result.
     */
    function processEasyFilterQuery(userInput: string, metadata: EasyFilterMetadata): Promise<Result<ApplyFilter | AskToRephrase>>;
}
//# sourceMappingURL=ProcessEasyFilter.d.ts.map