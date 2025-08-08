import { TemplateParameterName } from "ux/eng/fioriai/reuse/common/prompt";
import { Result, success } from "ux/eng/fioriai/reuse/common/result";
import { objectToNameValueObject } from "ux/eng/fioriai/reuse/common/util";
import { callFioriAiAction } from "ux/eng/fioriai/reuse/service/fioriAIAction";

/**
 * Parameters for the OData action to process the easy filter.
 */
type ODataActionParameters = {
    template: "FILTER_SCOPE" | "FILTER_CONDITIONS";
    parameters: { name: TemplateParameterName; value: string }[];
};

/**
 * Runs the easy filter processing action with the given template and parameters.
 *
 * @param template The template to use for the action.
 * @param parameters The parameters to pass to the action
 * @returns A promise that resolves to the result of the action.
 */
export async function runEasyFilterAction(
    template: "FILTER_SCOPE" | "FILTER_CONDITIONS",
    parameters: Record<TemplateParameterName, string>
): Promise<Result<string>> {
    const odataParameters: ODataActionParameters = {
        template,
        parameters: objectToNameValueObject(parameters)
    };

    const result = await callFioriAiAction<{ value: string }>(
        `EasyFilter/com.sap.gateway.srvd.aiu_ui_prompt.v0001.process`,
        odataParameters
    );

    return result.success ? success(result.data.value) : result;
}
