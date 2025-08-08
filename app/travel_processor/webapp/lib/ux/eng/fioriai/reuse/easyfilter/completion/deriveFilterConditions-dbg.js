"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/common/result", "ux/eng/fioriai/reuse/easyfilter/helper/codeList", "ux/eng/fioriai/reuse/easyfilter/helper/collection", "ux/eng/fioriai/reuse/easyfilter/helper/fieldMapping", "ux/eng/fioriai/reuse/easyfilter/helper/runEasyFilterAction", "ux/eng/fioriai/reuse/easyfilter/schemas/FilterSchema", "ux/eng/fioriai/reuse/languagemodel/JsonValidator", "ux/eng/fioriai/reuse/languagemodel/zod/validator", "ux/eng/fioriai/reuse/thirdparty/zod"], function (__ux_eng_fioriai_reuse_common_result, __ux_eng_fioriai_reuse_easyfilter_helper_codeList, __ux_eng_fioriai_reuse_easyfilter_helper_collection, __ux_eng_fioriai_reuse_easyfilter_helper_fieldMapping, __ux_eng_fioriai_reuse_easyfilter_helper_runEasyFilterAction, __ux_eng_fioriai_reuse_easyfilter_schemas_FilterSchema, __ux_eng_fioriai_reuse_languagemodel_JsonValidator, __ux_eng_fioriai_reuse_languagemodel_zod_validator, __zod) {
  "use strict";

  const success = __ux_eng_fioriai_reuse_common_result["success"];
  const getCodeListMap = __ux_eng_fioriai_reuse_easyfilter_helper_codeList["getCodeListMap"];
  const getCodeLists = __ux_eng_fioriai_reuse_easyfilter_helper_codeList["getCodeLists"];
  const isCodeListInitialized = __ux_eng_fioriai_reuse_easyfilter_helper_codeList["isCodeListInitialized"];
  const getCollectionName = __ux_eng_fioriai_reuse_easyfilter_helper_collection["getCollectionName"];
  const createFieldMappingWithSimplifiedKeys = __ux_eng_fioriai_reuse_easyfilter_helper_fieldMapping["createFieldMappingWithSimplifiedKeys"];
  const runEasyFilterAction = __ux_eng_fioriai_reuse_easyfilter_helper_runEasyFilterAction["runEasyFilterAction"];
  const CollectionFilter = __ux_eng_fioriai_reuse_easyfilter_schemas_FilterSchema["CollectionFilter"];
  const parseAndValidate = __ux_eng_fioriai_reuse_languagemodel_JsonValidator["parseAndValidate"];
  const validateWithZodSchema = __ux_eng_fioriai_reuse_languagemodel_zod_validator["validateWithZodSchema"];
  const z = __zod["z"];
  /** Schema for validating the object returned by the OData action */
  const ODataResponseSchema = z.object({
    result: z.union([z.literal("NOT_A_FILTER"), CollectionFilter])
  });
  const odataResponseValidator = validateWithZodSchema(ODataResponseSchema);
  /**
   * Derives the filter conditions based on the user input.
   *
   * @param userInput The input string from the user.
   * @param filterMetadata The metadata of the entity set to filter.
   * @returns The filter conditions based on the user input.
   */
  async function deriveFilterConditions(userInput, filterMetadata) {
    const now = new Date();
    try {
      const query = userInput.trim();
      if (!query) {
        // Empty input: not a filter
        return success({
          type: "NOT_A_FILTER"
        });
      }

      // Ensure code lists are available for the fields
      await getCodeLists(filterMetadata.fields);

      // prepare the field dictionary for prompting, and the reverse mapping from simplified keys to original field names
      const {
        fieldsByKey: fields,
        originalFieldNames
      } = createFieldMappingWithSimplifiedKeys(filterMetadata, field => {
        const details = {};
        if (field.label) details.description = field.label;
        if (field.dataType) details.type = field.dataType;
        if (isCodeListInitialized(field.codeList)) details.codeList = getCodeListMap(field.codeList);
        return details;
      });

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
        return success({
          type: "NOT_A_FILTER"
        });
      }

      // translate the property names back to the original names
      const actualConditions = Object.fromEntries(Object.entries(validationResult.data.result.filter).filter(([fieldName]) => originalFieldNames[fieldName]) // ensure the field exists
      .map(([fieldName, conditions]) => [originalFieldNames[fieldName], conditions]));
      return success({
        type: "FILTER",
        filter: actualConditions
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
  __exports.deriveFilterConditions = deriveFilterConditions;
  return __exports;
});
//# sourceMappingURL=deriveFilterConditions-dbg.js.map
