"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/common/log", "ux/eng/fioriai/reuse/common/result", "ux/eng/fioriai/reuse/common/text", "ux/eng/fioriai/reuse/easyfilter/completion/ProcessEasyFilter", "ux/eng/fioriai/reuse/service/action"], function (__Log, __ux_eng_fioriai_reuse_common_result, __ux_eng_fioriai_reuse_common_text, __ux_eng_fioriai_reuse_easyfilter_completion_ProcessEasyFilter, __ux_eng_fioriai_reuse_service_action) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Log = _interopRequireDefault(__Log);
  const error = __ux_eng_fioriai_reuse_common_result["error"];
  const success = __ux_eng_fioriai_reuse_common_result["success"];
  const getText = __ux_eng_fioriai_reuse_common_text["getText"];
  const processEasyFilterQuery = __ux_eng_fioriai_reuse_easyfilter_completion_ProcessEasyFilter["processEasyFilterQuery"];
  const ODataErrorCode = __ux_eng_fioriai_reuse_service_action["ODataErrorCode"];
  /**
   * Code list entry with value and optional description.
   */
  /**
   * Collection of fixed values for a property.
   */
  /**
   * Metadata for a property.
   */
  /**
   * EasyFilter metadata configuration.
   */
  /**
   * Filter expression for comparison operations.
   */
  /**
   * Filter expression for substring matching.
   */
  /**
   * Filter expression for range operations.
   */
  /**
   * Union of all filter expression types.
   */
  /**
   * EasyFilter processing result.
   */
  /**
   * Creates a user-friendly error from an internal error.
   *
   * @param internalError Internal system error
   * @returns User-friendly error message
   */
  function createUserError(internalError) {
    Log.error(internalError.message, internalError.code);
    switch (internalError.code) {
      case ODataErrorCode.temporaryError:
        return error(getText("EASYFILTER_TEMPORARY_ERROR"));
      case ODataErrorCode.unauthorized:
      case ODataErrorCode.configurationError:
      case ODataErrorCode.featureUnavailable:
        return error(getText("EASYFILTER_PERMANENT_ERROR"));
      default:
        return error(getText("EASYFILTER_UNEXPECTED_ERROR"));
    }
  }

  /**
   * Processes natural language input to generate filter expressions.
   *
   * @param input Natural language filter query
   * @param metadata Field metadata for processing
   * @returns Filter expressions or error message
   */
  async function easyFilter(input, metadata) {
    const result = await processEasyFilterQuery(input, metadata);
    if (!result.success) {
      return createUserError(result);
    }
    switch (result.data.action) {
      case "APPLY_FILTER":
        return success({
          version: 1,
          filter: result.data.filter
        });
      case "ASK_TO_REPHRASE":
        // map to error as this is how the consumer expects it
        return error(getText("EASYFILTER_UNCLEAR_INPUT_ERROR"));
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.easyFilter = easyFilter;
  return __exports;
});
//# sourceMappingURL=EasyFilter-dbg.js.map
