import { Result, success } from "ux/eng/fioriai/reuse/common/result";
import { EasyFilterMetadata } from "ux/eng/fioriai/reuse/easyfilter/EasyFilter";
import { getCodeListMap } from "ux/eng/fioriai/reuse/easyfilter/helper/codeList";
import { getCollectionName } from "ux/eng/fioriai/reuse/easyfilter/helper/collection";
import { createFieldMappingWithSimplifiedKeys } from "ux/eng/fioriai/reuse/easyfilter/helper/fieldMapping";
import { runEasyFilterAction } from "ux/eng/fioriai/reuse/easyfilter/helper/runEasyFilterAction";
import { parseAndValidate } from "ux/eng/fioriai/reuse/languagemodel/JsonValidator";
import { validateWithZodSchema } from "ux/eng/fioriai/reuse/languagemodel/zod/validator";
import { z } from "zod";

/** Schema for validating the object returned by the OData action */
const ODataResponseSchema = z.object({
    result: z.union([z.literal("NOT_A_FILTER"), z.literal("SHOW_ALL"), z.string().array()])
});

const odataResponseValidator = validateWithZodSchema(ODataResponseSchema);

export type RelevantFieldsResult =
    | { type: "FIELDS"; fields: Set<string> }
    | { type: "NOT_A_FILTER" }
    | { type: "SHOW_ALL" };

/**
 * Get the relevant fields for an easy filter query based on the user input and filter metadata.
 *
 * @param userInput The input string from the user.
 * @param filterMetadata The metadata of the entity set to filter.
 * @returns The set of relevant fields, or "ASK_TO_REPHRASE" if the input is not clear.
 */
export async function getRelevantFields(
    userInput: string,
    filterMetadata: EasyFilterMetadata
): Promise<Result<RelevantFieldsResult>> {
    try {
        const query = userInput.trim();

        if (!query) {
            // Empty input: not a filter
            return success({ type: "NOT_A_FILTER" });
        }

        if (filterMetadata.fields.length === 0) {
            // No fields available: show all data
            return success({ type: "SHOW_ALL" });
        }

        // prepare the field dictionary for prompting, and the reverse mapping from simplified keys to original field names
        const { fieldsByKey: fields, originalFieldNames } = createFieldMappingWithSimplifiedKeys(
            filterMetadata,
            (field) => {
                const details: { description?: string; codeList?: Record<string | number, string> | "PENDING" } = {};
                if (field.label) details.description = field.label;
                if (field.codeList) details.codeList = getCodeListMap(field.codeList);
                return details;
            }
        );

        // Run the filter scope action
        const actionResult = await runEasyFilterAction("FILTER_SCOPE", {
            ISLM_Collection: getCollectionName(filterMetadata),
            ISLM_Fields: JSON.stringify(fields),
            ISLM_Input: query
        });

        if (!actionResult.success) {
            // Propagate error result
            return actionResult;
        }

        // Validate and parse the response
        const validationResult = await parseAndValidate(actionResult.data, odataResponseValidator);
        if (!validationResult.success) {
            // Propagate validation error
            return validationResult;
        }

        // Service says it's not a filter
        if (validationResult.data.result === "NOT_A_FILTER") {
            return success({ type: "NOT_A_FILTER" });
        }
        // Service says to show all data
        if (validationResult.data.result === "SHOW_ALL") {
            return success({ type: "SHOW_ALL" });
        }

        // Ensure that the response is valid: filter the fields to only those that exist in the metadata
        // Map the returned field keys back to the original field names from metadata
        const relevantFields = new Set(
            validationResult.data.result
                .map((field) => originalFieldNames[field])
                .filter((field): field is string => field !== undefined)
        );

        return success({ type: "FIELDS", fields: relevantFields });
    } catch (error) {
        // Catch unexpected errors
        return {
            success: false,
            message: error instanceof Error ? error.message : String(error)
        };
    }
}
