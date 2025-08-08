declare module "ux/eng/fioriai/reuse/languagemodel/ODataCompletion" {
    import { PromptMessage, TemplateParameterName } from "ux/eng/fioriai/reuse/common/prompt";
    import type { PromptCompletionFunction } from "ux/eng/fioriai/reuse/languagemodel/Completion";
    /**
     * A prompt message.
     */
    type ODataCompleteActionPromptMessage = {
        role: "system" | "user" | "assistant";
        template: string;
        parameters?: {
            name: TemplateParameterName;
            value: string;
        }[];
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
    function promptMessageToODataPromptMessage(message: PromptMessage): ODataCompleteActionPromptMessage;
    /**
     * Creates a function that completes a prompt by calling the "Complete" action of the OData service.
     *
     * @param entitySet The entity set to create the function for.
     * @returns A function that takes a prompt and returns a completion result.
     */
    function createODataCompletionFunction(entitySet: "Explanation" | "EasyFill"): PromptCompletionFunction;
}
//# sourceMappingURL=ODataCompletion.d.ts.map