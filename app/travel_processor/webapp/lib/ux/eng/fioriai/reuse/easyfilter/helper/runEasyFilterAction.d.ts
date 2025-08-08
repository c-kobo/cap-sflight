declare module "ux/eng/fioriai/reuse/easyfilter/helper/runEasyFilterAction" {
    import { TemplateParameterName } from "ux/eng/fioriai/reuse/common/prompt";
    import { Result } from "ux/eng/fioriai/reuse/common/result";
    /**
     * Parameters for the OData action to process the easy filter.
     */
    type ODataActionParameters = {
        template: "FILTER_SCOPE" | "FILTER_CONDITIONS";
        parameters: {
            name: TemplateParameterName;
            value: string;
        }[];
    };
    /**
     * Runs the easy filter processing action with the given template and parameters.
     *
     * @param template The template to use for the action.
     * @param parameters The parameters to pass to the action
     * @returns A promise that resolves to the result of the action.
     */
    function runEasyFilterAction(template: "FILTER_SCOPE" | "FILTER_CONDITIONS", parameters: Record<TemplateParameterName, string>): Promise<Result<string>>;
}
//# sourceMappingURL=runEasyFilterAction.d.ts.map