declare module "ux/eng/fioriai/reuse/easyfill/ProcessFieldExtraction" {
    import { Error, Result } from "ux/eng/fioriai/reuse/common/result";
    import { FieldMetadata, FieldValues } from "ux/eng/fioriai/reuse/easyfill/EasyFill";
    import { PromptCompletionFunction } from "ux/eng/fioriai/reuse/languagemodel/Completion";
    import { ODataErrorCode } from "ux/eng/fioriai/reuse/service/action";
    /**
     * Creates a user-facing error object from an internal OData error, logging the original.
     * It maps specific OData error codes to localized text keys for user messages.
     *
     * @param internalError The internal error object, potentially with an ODataErrorCode.
     * @returns An Error result object with a user-friendly message, suitable for display.
     */
    function createUserError(internalError: Error<ODataErrorCode>): Error<never>;
    /**
     * Parses and validates the raw string data from the AI response.
     * Assumes input string might contain JSON within Markdown.
     *
     * @param responseData The raw string payload from a successful AI response.
     * @returns A Result object: Success<FieldValues> or Error if extraction, parsing, or validation fails.
     */
    function parseAndValidateResponseData(responseData: string): Result<FieldValues>;
    /**
     * Processes field extraction using a provided completion function.
     * This function is exported for testing purposes.
     *
     * @async
     * @param completionFn The completion function to use.
     * @param userInput User's text input.
     * @param fieldMetadata Description of fields to extract.
     * @returns A Promise resolving to a Result object: Success<FieldValues> or Error.
     */
    function processFieldExtraction(completionFn: PromptCompletionFunction, userInput: string, fieldMetadata: FieldMetadata): Promise<Result<FieldValues>>;
}
//# sourceMappingURL=ProcessFieldExtraction.d.ts.map