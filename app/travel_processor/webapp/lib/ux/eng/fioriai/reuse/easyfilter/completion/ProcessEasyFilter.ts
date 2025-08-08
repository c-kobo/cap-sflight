import Log from "ux/eng/fioriai/reuse/common/log";
import { Result, success } from "ux/eng/fioriai/reuse/common/result";
import { EasyFilterExpression, EasyFilterMetadata } from "ux/eng/fioriai/reuse/easyfilter/EasyFilter";
import { deriveFilterConditions } from "ux/eng/fioriai/reuse/easyfilter/completion/deriveFilterConditions";
import { getRelevantFields } from "ux/eng/fioriai/reuse/easyfilter/completion/getRelevantFields";
import { convertFilter } from "ux/eng/fioriai/reuse/easyfilter/helper/FilterExpressionConverter";
import filterMetadata from "ux/eng/fioriai/reuse/easyfilter/helper/filterMetadata";

/**
 * Apply a filter.
 */
export type ApplyFilter = {
    action: "APPLY_FILTER";
    filter: EasyFilterExpression[];
};

type AskToRephrase = {
    action: "ASK_TO_REPHRASE";
};

/**
 * Processes an EasyFilter query end-to-end.
 *
 * @param userInput The easy filter query.
 * @param metadata The metadata of the easy filter.
 * @returns The processed easy filter result.
 */
export async function processEasyFilterQuery(
    userInput: string,
    metadata: EasyFilterMetadata
): Promise<Result<ApplyFilter | AskToRephrase>> {
    const trimmedInput = userInput.trim();

    if (!trimmedInput) {
        return success({ action: "APPLY_FILTER", filter: [] });
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Step 1: Determine what to do with the query
    // -----------------------------------------------------------------------------------------------------------------
    if (metadata.fields.length === 0) {
        return success({ action: "APPLY_FILTER", filter: [] });
    }

    const relevantFieldsResult = await getRelevantFields(trimmedInput, metadata);
    if (!relevantFieldsResult.success) {
        Log.error("Failed in step 1 (get relevant fields)", relevantFieldsResult.message);
        return relevantFieldsResult;
    }

    if (relevantFieldsResult.data.type === "NOT_A_FILTER") {
        return success({ action: "ASK_TO_REPHRASE" }); // ask the user to rephrase
    }

    if (relevantFieldsResult.data.type === "SHOW_ALL") {
        return success({ action: "APPLY_FILTER", filter: [] }); // show all data
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Step 2: Determine the filter conditions based on the relevant fields
    // -----------------------------------------------------------------------------------------------------------------
    const relevantFields = relevantFieldsResult.data.fields;
    const relevantMetadata = filterMetadata(metadata, (field) => relevantFields.has(field.name));
    if (relevantMetadata.fields.length === 0) {
        return success({ action: "APPLY_FILTER", filter: [] });
    }

    const filterConditionsResult = await deriveFilterConditions(trimmedInput, relevantMetadata);
    if (!filterConditionsResult.success) {
        Log.error("Failed in step 2 (create filter conditions)", filterConditionsResult.message);
        return filterConditionsResult;
    }

    if (filterConditionsResult.data.type === "NOT_A_FILTER") {
        return success({ action: "ASK_TO_REPHRASE" }); // ask the user to rephrase
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Post-processing: Convert to return type
    // -----------------------------------------------------------------------------------------------------------------
    const filterConditions = await convertFilter(filterConditionsResult.data.filter, metadata.fields);

    return success({ action: "APPLY_FILTER", filter: filterConditions });
}
