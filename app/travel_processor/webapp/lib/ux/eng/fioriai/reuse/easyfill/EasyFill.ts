import { Result } from "ux/eng/fioriai/reuse/common/result";
import { processFieldExtraction } from "ux/eng/fioriai/reuse/easyfill/ProcessFieldExtraction";
import { createODataCompletionFunction } from "ux/eng/fioriai/reuse/languagemodel/ODataCompletion";

/**
 * Field metadata for extraction configuration.
 */
export type FieldMetadata = {
    [fieldId: string]: {
        /** Human-readable field description */
        description: string;
        /** Data type (e.g., "string", "number", "boolean") */
        dataType: string;
    };
};

/**
 * Extracted field values requiring runtime type validation.
 */
export type FieldValues = {
    [fieldId: string]: unknown;
};

// Initialize the AI completion function specific to EasyFill
const complete = createODataCompletionFunction("EasyFill");

/**
 * Extracts structured field values from natural language input using AI.
 *
 * @param userInput Natural language text to process
 * @param fieldMetadata Field definitions for extraction
 * @returns Result containing extracted values or error message
 * @example
 * const metadata: FieldMetadata = {
 *   "orderQuantity": { "description": "Quantity of items", "dataType": "number" },
 *   "priority": { "description": "Order priority", "dataType": "string" }
 * };
 *
 * const result = await extractFieldValuesFromText("Set quantity to 100 and make it urgent", metadata);
 * if (result.success) {
 *   // Type validation required for result.data values
 *   console.log("Extracted:", result.data);
 * }
 */
export async function extractFieldValuesFromText(
    userInput: string,
    fieldMetadata: FieldMetadata
): Promise<Result<FieldValues>> {
    return processFieldExtraction(complete, userInput, fieldMetadata);
}
