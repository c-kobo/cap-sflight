import Localization from "sap/base/i18n/Localization";
import { extractFromMarkdown } from "ux/eng/fioriai/reuse/common/format";
import Log from "ux/eng/fioriai/reuse/common/log";
import { error, Error, Result, success } from "ux/eng/fioriai/reuse/common/result";
import { getText } from "ux/eng/fioriai/reuse/common/text";
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
function createUserError(internalError: Error<ODataErrorCode>): Error<never> {
    // Log the technical details for debugging
    Log.error(`OData Error: ${internalError.message}`, internalError.code);

    let userMessageKey: string;
    switch (internalError.code) {
        case ODataErrorCode.temporaryError:
            userMessageKey = "EASYFILL_TEMPORARY_ERROR";
            break;
        case ODataErrorCode.unauthorized:
        case ODataErrorCode.configurationError:
        case ODataErrorCode.featureUnavailable:
            userMessageKey = "EASYFILL_PERMANENT_ERROR";
            break;
        default: // Includes undefined code or other unexpected codes
            if (internalError.code !== undefined) {
                Log.warning(`Unhandled ODataErrorCode encountered: ${String(internalError.code)}`);
            }
            userMessageKey = "EASYFILL_UNEXPECTED_ERROR";
            break;
    }
    // Return an Error using the localized text, with a fallback message
    return error(getText(userMessageKey) || "An unexpected error occurred.");
}

/**
 * Parses and validates the raw string data from the AI response.
 * Assumes input string might contain JSON within Markdown.
 *
 * @param responseData The raw string payload from a successful AI response.
 * @returns A Result object: Success<FieldValues> or Error if extraction, parsing, or validation fails.
 */
function parseAndValidateResponseData(responseData: string): Result<FieldValues> {
    try {
        // Extract potentially JSON string from Markdown
        const jsonString = extractFromMarkdown(responseData);

        // Check if the extraction resulted in an empty string
        if (!jsonString) {
            Log.warning("AI response content is empty after Markdown extraction");
            return error(getText("EASYFILL_INVALID_RESPONSE"));
        }

        // Parse the extracted string. JSON.parse returns 'any'
        const parsedJson: unknown = JSON.parse(jsonString);

        // Validate the structure - must be a non-null object, not an array.
        if (typeof parsedJson === "object" && parsedJson !== null && !Array.isArray(parsedJson)) {
            return success(parsedJson as FieldValues);
        } else {
            // Parsed correctly, but wasn't an object (e.g., "null", "[1,2]", "123")
            Log.error(
                `Parsed AI response is not a valid object. Parsed type: ${typeof parsedJson}, isArray: ${Array.isArray(parsedJson)}`
            );
            return error(getText("EASYFILL_INVALID_RESPONSE"));
        }
    } catch (e) {
        // Handle JSON.parse syntax errors or errors potentially thrown by extractFromMarkdown.
        const errorMessage =
            e && typeof e === "object" && "message" in e ? String((e as { message: string }).message) : String(e);
        Log.error(`Failed to parse JSON from AI model response`, errorMessage);
        return error(getText("EASYFILL_INVALID_RESPONSE"));
    }
}

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
export async function processFieldExtraction(
    completionFn: PromptCompletionFunction,
    userInput: string,
    fieldMetadata: FieldMetadata
): Promise<Result<FieldValues>> {
    // Invoke the AI Model's completion API
    const response = await completionFn([
        {
            role: "system",
            template: "EASY_FILL",
            parameters: {
                ISLM_Current_Date_Time: new Date().toISOString(),
                ISLM_Target_Language: Localization.getLanguage(),
                ISLM_User_Input: userInput,
                ISLM_Field_Metadata: JSON.stringify(fieldMetadata, null, 2)
            }
        }
    ]);

    // Handle errors reported by the completion function itself
    if (!response.success) {
        return createUserError(response as Error<ODataErrorCode>);
    }

    // Handle successful response by parsing and validating its data payload
    return parseAndValidateResponseData(response.data);
}
