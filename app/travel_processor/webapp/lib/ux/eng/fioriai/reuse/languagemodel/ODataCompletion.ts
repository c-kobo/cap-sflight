import { PromptMessage, TemplateParameterName } from "ux/eng/fioriai/reuse/common/prompt";
import { success } from "ux/eng/fioriai/reuse/common/result";
import { objectToNameValueObject } from "ux/eng/fioriai/reuse/common/util";
import type { PromptCompletionFunction } from "ux/eng/fioriai/reuse/languagemodel/Completion";
import { callFioriAiAction } from "ux/eng/fioriai/reuse/service/fioriAIAction";

/**
 * A prompt message.
 */
type ODataCompleteActionPromptMessage = {
    role: "system" | "user" | "assistant";
    template: string;
    parameters?: { name: TemplateParameterName; value: string }[];
};

/**
 * The parameters of the "Complete" action.
 */
type ODataCompleteActionParameters = {
    prompts: ODataCompleteActionPromptMessage[];
};

/**
 * The result of the "Complete" action.
 */
type ODataCompleteActionResult = {
    message: string;
    usage: {
        completion_tokens: number;
        prompt_tokens: number;
    };
};

/**
 * Converts a prompt message to the type expected by the OData complete action.
 *
 * @param message The prompt message to convert.
 * @returns The converted message.
 */
export function promptMessageToODataPromptMessage(message: PromptMessage): ODataCompleteActionPromptMessage {
    const result: ODataCompleteActionPromptMessage = {
        role: message.role,
        template: message.template
    };

    if (message.parameters) {
        if (Object.keys(message.parameters).length > 0) {
            result.parameters = objectToNameValueObject(message.parameters);
        }
    }

    return result;
}

/**
 * Creates a function that completes a prompt by calling the "Complete" action of the OData service.
 *
 * @param entitySet The entity set to create the function for.
 * @returns A function that takes a prompt and returns a completion result.
 */
export function createODataCompletionFunction(entitySet: "Explanation" | "EasyFill"): PromptCompletionFunction {
    return async function runODataCompletion(messages) {
        const parameters: ODataCompleteActionParameters = {
            prompts: messages.map(promptMessageToODataPromptMessage)
        };

        const result = await callFioriAiAction<ODataCompleteActionResult>(
            `${entitySet}/com.sap.gateway.srvd.aiu_ui_prompt.v0001.Complete`,
            parameters
        );

        if (!result.success) {
            return result;
        }

        return success(result.data.message);
    };
}
