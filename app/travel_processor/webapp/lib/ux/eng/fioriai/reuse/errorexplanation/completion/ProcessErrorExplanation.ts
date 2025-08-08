import { extractFromMarkdown } from "ux/eng/fioriai/reuse/common/format";
import { TemplateParameterName } from "ux/eng/fioriai/reuse/common/prompt";
import { Result, success } from "ux/eng/fioriai/reuse/common/result";
import { objectToNameValueObject } from "ux/eng/fioriai/reuse/common/util";
import { callFioriAiAction } from "ux/eng/fioriai/reuse/service/fioriAIAction";

/**
 * Parameters for the OData action to process the easy filter.
 */
type ODataActionParameters = {
    template: "ERROR_EXPLANATION";
    parameters: { name: TemplateParameterName; value: string }[];
};

/**
 * Runs the error explanation processing action with the given template and parameters.
 *
 * @param template The template to use for the action.
 * @param parameters The parameters to pass to the action.
 * @returns A promise that resolves with the result of the action.
 */
export async function processErrorExplanation(
    template: "ERROR_EXPLANATION",
    parameters: Record<TemplateParameterName, string>
): Promise<Result<string>> {
    const odataParameters: ODataActionParameters = {
        template,
        parameters: objectToNameValueObject(parameters)
    };

    const response = await callFioriAiAction<{ value: string }>(
        `Explanation/com.sap.gateway.srvd.aiu_ui_prompt.v0001.process`,
        odataParameters
    );

    if (!response.success) {
        return response;
    }

    return success(extractFromMarkdown(response.data.value));
}
