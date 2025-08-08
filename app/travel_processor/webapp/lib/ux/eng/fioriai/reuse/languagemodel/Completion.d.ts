declare module "ux/eng/fioriai/reuse/languagemodel/Completion" {
    import { PromptMessage } from "ux/eng/fioriai/reuse/common/prompt";
    import { Result } from "ux/eng/fioriai/reuse/common/result";
    /**
     * A function that completes a prompt.
     *
     * @param messages The messages to complete.
     * @returns A promise that resolves to the result of the completion.
     */
    type PromptCompletionFunction = (messages: PromptMessage[]) => Promise<Result<string>>;
}
//# sourceMappingURL=Completion.d.ts.map