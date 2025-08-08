declare module "ux/eng/fioriai/reuse/languagemodel/JsonValidator" {
    import { Result } from "ux/eng/fioriai/reuse/common/result";
    /**
     * A function that validates a JSON object.
     *
     * @param json The JSON object to validate.
     * @returns A promise that resolves to the result of the validation.
     * @template T The expected type of the JSON object.
     */
    type ValidationFunction<T> = (json: unknown) => Promise<Result<T>>;
    /**
     * Parse a JSON string and return the result.
     *
     * @param jsonString The JSON string to parse.
     * @returns A result containing the parsed JSON object or an error message if parsing fails.
     */
    function parseJson(jsonString: string): Result<unknown>;
    /**
     * Parse a string into a JSON object and validate it.
     *
     * @param data The string to parse.
     * @param validate The validator for the JSON object. By default, validation is a no-op that always succeeds.
     * @returns The result of the translation.
     */
    function parseAndValidate<T>(data: string, validate: ValidationFunction<T>): Promise<Result<T>>;
}
//# sourceMappingURL=JsonValidator.d.ts.map