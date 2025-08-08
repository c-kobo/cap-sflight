declare module "ux/eng/fioriai/reuse/errorexplanation/completion/ProcessErrorExplanation" {
    import { TemplateParameterName } from "ux/eng/fioriai/reuse/common/prompt";
    import { Result } from "ux/eng/fioriai/reuse/common/result";
    /**
     * Parameters for the OData action to process the easy filter.
     */
    type ODataActionParameters = {
        template: "ERROR_EXPLANATION";
        parameters: {
            name: TemplateParameterName;
            value: string;
        }[];
    };
    /**
     * Runs the error explanation processing action with the given template and parameters.
     *
     * @param template The template to use for the action.
     * @param parameters The parameters to pass to the action.
     * @returns A promise that resolves with the result of the action.
     */
    function processErrorExplanation(template: "ERROR_EXPLANATION", parameters: Record<TemplateParameterName, string>): Promise<Result<string>>;
}
//# sourceMappingURL=ProcessErrorExplanation.d.ts.map