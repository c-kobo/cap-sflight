"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/common/log", "ux/eng/fioriai/reuse/common/result", "ux/eng/fioriai/reuse/easyfilter/completion/deriveFilterConditions", "ux/eng/fioriai/reuse/easyfilter/completion/getRelevantFields", "ux/eng/fioriai/reuse/easyfilter/helper/FilterExpressionConverter", "ux/eng/fioriai/reuse/easyfilter/helper/filterMetadata"], function (__Log, __ux_eng_fioriai_reuse_common_result, __ux_eng_fioriai_reuse_easyfilter_completion_deriveFilterConditions, __ux_eng_fioriai_reuse_easyfilter_completion_getRelevantFields, __ux_eng_fioriai_reuse_easyfilter_helper_FilterExpressionConverter, __filterMetadata) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Log = _interopRequireDefault(__Log);
  const success = __ux_eng_fioriai_reuse_common_result["success"];
  const deriveFilterConditions = __ux_eng_fioriai_reuse_easyfilter_completion_deriveFilterConditions["deriveFilterConditions"];
  const getRelevantFields = __ux_eng_fioriai_reuse_easyfilter_completion_getRelevantFields["getRelevantFields"];
  const convertFilter = __ux_eng_fioriai_reuse_easyfilter_helper_FilterExpressionConverter["convertFilter"];
  const filterMetadata = _interopRequireDefault(__filterMetadata);
  /**
   * Apply a filter.
   */
  /**
   * Processes an EasyFilter query end-to-end.
   *
   * @param userInput The easy filter query.
   * @param metadata The metadata of the easy filter.
   * @returns The processed easy filter result.
   */
  async function processEasyFilterQuery(userInput, metadata) {
    const trimmedInput = userInput.trim();
    if (!trimmedInput) {
      return success({
        action: "APPLY_FILTER",
        filter: []
      });
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Step 1: Determine what to do with the query
    // -----------------------------------------------------------------------------------------------------------------
    if (metadata.fields.length === 0) {
      return success({
        action: "APPLY_FILTER",
        filter: []
      });
    }
    const relevantFieldsResult = await getRelevantFields(trimmedInput, metadata);
    if (!relevantFieldsResult.success) {
      Log.error("Failed in step 1 (get relevant fields)", relevantFieldsResult.message);
      return relevantFieldsResult;
    }
    if (relevantFieldsResult.data.type === "NOT_A_FILTER") {
      return success({
        action: "ASK_TO_REPHRASE"
      }); // ask the user to rephrase
    }
    if (relevantFieldsResult.data.type === "SHOW_ALL") {
      return success({
        action: "APPLY_FILTER",
        filter: []
      }); // show all data
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Step 2: Determine the filter conditions based on the relevant fields
    // -----------------------------------------------------------------------------------------------------------------
    const relevantFields = relevantFieldsResult.data.fields;
    const relevantMetadata = filterMetadata(metadata, field => relevantFields.has(field.name));
    if (relevantMetadata.fields.length === 0) {
      return success({
        action: "APPLY_FILTER",
        filter: []
      });
    }
    const filterConditionsResult = await deriveFilterConditions(trimmedInput, relevantMetadata);
    if (!filterConditionsResult.success) {
      Log.error("Failed in step 2 (create filter conditions)", filterConditionsResult.message);
      return filterConditionsResult;
    }
    if (filterConditionsResult.data.type === "NOT_A_FILTER") {
      return success({
        action: "ASK_TO_REPHRASE"
      }); // ask the user to rephrase
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Post-processing: Convert to return type
    // -----------------------------------------------------------------------------------------------------------------
    const filterConditions = await convertFilter(filterConditionsResult.data.filter, metadata.fields);
    return success({
      action: "APPLY_FILTER",
      filter: filterConditions
    });
  }
  var __exports = {
    __esModule: true
  };
  __exports.processEasyFilterQuery = processEasyFilterQuery;
  return __exports;
});
//# sourceMappingURL=ProcessEasyFilter-dbg.js.map
