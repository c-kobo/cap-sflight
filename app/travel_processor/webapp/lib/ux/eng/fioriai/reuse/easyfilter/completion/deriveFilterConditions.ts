import { Result, success } from "ux/eng/fioriai/reuse/common/result";
import { EasyFilterMetadata } from "ux/eng/fioriai/reuse/easyfilter/EasyFilter";
import { getCodeListMap, getCodeLists, isCodeListInitialized } from "ux/eng/fioriai/reuse/easyfilter/helper/codeList";
import { getCollectionName } from "ux/eng/fioriai/reuse/easyfilter/helper/collection";
import { createFieldMappingWithSimplifiedKeys } from "ux/eng/fioriai/reuse/easyfilter/helper/fieldMapping";
import { runEasyFilterAction } from "ux/eng/fioriai/reuse/easyfilter/helper/runEasyFilterAction";
import { CollectionFilter, Filter } from "ux/eng/fioriai/reuse/easyfilter/schemas/FilterSchema";
import { parseAndValidate } from "ux/eng/fioriai/reuse/languagemodel/JsonValidator";
import { validateWithZodSchema } from "ux/eng/fioriai/reuse/languagemodel/zod/validator";
import { z } from "zod";

/** Schema for validating the object returned by the OData action */
const ODataResponseSchema = z.object({
    result: z.union([z.literal("NOT_A_FILTER"), CollectionFilter])
});

const odataResponseValidator = validateWithZodSchema(ODataResponseSchema);

export type FilterConditionResult = { type: "FILTER"; filter: Filter } | { type: "NOT_A_FILTER" };

/**
 * Derives the filter conditions based on the user input.
 *
 * @param userInput The input string from the user.
 * @param filterMetadata The metadata of the entity set to filter.
 * @returns The filter conditions based on the user input.
 */
export async function deriveFilterConditions(
    userInput: string,
    filterMetadata: EasyFilterMetadata
): Promise<Result<FilterConditionResult>> {
    const now = new Date();

    try {
        const query = userInput.trim();

        if (!query) {
            // Empty input: not a filter
            return success({ type: "NOT_A_FILTER" });
        }

        // Ensure code lists are available for the fields
        await getCodeLists(filterMetadata.fields);

        // prepare the field dictionary for prompting, and the reverse mapping from simplified keys to original field names
        const { fieldsByKey: fields, originalFieldNames } = createFieldMappingWithSimplifiedKeys(
            filterMetadata,
            (field) => {
                const details: { description?: string; type?: string; codeList?: Record<string | number, string> } = {};
                if (field.label) details.description = field.label;
                if (field.dataType) details.type = field.dataType;
                if (isCodeListInitialized(field.codeList)) details.codeList = getCodeListMap(field.codeList);
                return details;
            }
        );

        // Run the filter action
        const actionResult = await runEasyFilterAction("FILTER_CONDITIONS", {
            ISLM_Now: now.toISOString(),
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

        // translate the property names back to the original names
        const actualConditions: Filter = Object.fromEntries(
            Object.entries(validationResult.data.result.filter)
                .filter(([fieldName]) => originalFieldNames[fieldName]) // ensure the field exists
                .map(([fieldName, conditions]) => [originalFieldNames[fieldName], conditions])
        );

        return success({ type: "FILTER", filter: actualConditions });
    } catch (error) {
        // Catch unexpected errors
        return {
            success: false,
            message: error instanceof Error ? error.message : String(error)
        };
    }
}
