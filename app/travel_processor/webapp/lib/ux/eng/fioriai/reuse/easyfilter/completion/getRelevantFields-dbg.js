"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/common/result", "ux/eng/fioriai/reuse/easyfilter/helper/codeList", "ux/eng/fioriai/reuse/easyfilter/helper/collection", "ux/eng/fioriai/reuse/easyfilter/helper/fieldMapping", "ux/eng/fioriai/reuse/easyfilter/helper/runEasyFilterAction", "ux/eng/fioriai/reuse/languagemodel/JsonValidator", "ux/eng/fioriai/reuse/languagemodel/zod/validator", "ux/eng/fioriai/reuse/thirdparty/zod"], function (__ux_eng_fioriai_reuse_common_result, __ux_eng_fioriai_reuse_easyfilter_helper_codeList, __ux_eng_fioriai_reuse_easyfilter_helper_collection, __ux_eng_fioriai_reuse_easyfilter_helper_fieldMapping, __ux_eng_fioriai_reuse_easyfilter_helper_runEasyFilterAction, __ux_eng_fioriai_reuse_languagemodel_JsonValidator, __ux_eng_fioriai_reuse_languagemodel_zod_validator, __zod) {
  "use strict";

  const success = __ux_eng_fioriai_reuse_common_result["success"];
  const getCodeListMap = __ux_eng_fioriai_reuse_easyfilter_helper_codeList["getCodeListMap"];
  const getCollectionName = __ux_eng_fioriai_reuse_easyfilter_helper_collection["getCollectionName"];
  const createFieldMappingWithSimplifiedKeys = __ux_eng_fioriai_reuse_easyfilter_helper_fieldMapping["createFieldMappingWithSimplifiedKeys"];
  const runEasyFilterAction = __ux_eng_fioriai_reuse_easyfilter_helper_runEasyFilterAction["runEasyFilterAction"];
  const parseAndValidate = __ux_eng_fioriai_reuse_languagemodel_JsonValidator["parseAndValidate"];
  const validateWithZodSchema = __ux_eng_fioriai_reuse_languagemodel_zod_validator["validateWithZodSchema"];
  const z = __zod["z"];
  /** Schema for validating the object returned by the OData action */
  const ODataResponseSchema = z.object({
    result: z.union([z.literal("NOT_A_FILTER"), z.literal("SHOW_ALL"), z.string().array()])
  });
  const odataResponseValidator = validateWithZodSchema(ODataResponseSchema);
  /**
   * Get the relevant fields for an easy filter query based on the user input and filter metadata.
   *
   * @param userInput The input string from the user.
   * @param filterMetadata The metadata of the entity set to filter.
   * @returns The set of relevant fields, or "ASK_TO_REPHRASE" if the input is not clear.
   */
  async function getRelevantFields(userInput, filterMetadata) {
    try {
      const query = userInput.trim();
      if (!query) {
        // Empty input: not a filter
        return success({
          type: "NOT_A_FILTER"
        });
      }
      if (filterMetadata.fields.length === 0) {
        // No fields available: show all data
        return success({
          type: "SHOW_ALL"
        });
      }

      // prepare the field dictionary for prompting, and the reverse mapping from simplified keys to original field names
      const {
        fieldsByKey: fields,
        originalFieldNames
      } = createFieldMappingWithSimplifiedKeys(filterMetadata, field => {
        const details = {};
        if (field.label) details.description = field.label;
        if (field.codeList) details.codeList = getCodeListMap(field.codeList);
        return details;
      });

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
        return success({
          type: "NOT_A_FILTER"
        });
      }
      // Service says to show all data
      if (validationResult.data.result === "SHOW_ALL") {
        return success({
          type: "SHOW_ALL"
        });
      }

      // Ensure that the response is valid: filter the fields to only those that exist in the metadata
      // Map the returned field keys back to the original field names from metadata
      const relevantFields = new Set(validationResult.data.result.map(field => originalFieldNames[field]).filter(field => field !== undefined));
      return success({
        type: "FIELDS",
        fields: relevantFields
      });
    } catch (error) {
      // Catch unexpected errors
      return {
        success: false,
        message: error instanceof Error ? error.message : String(error)
      };
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.getRelevantFields = getRelevantFields;
  return __exports;
});
//# sourceMappingURL=getRelevantFields-dbg.js.map
