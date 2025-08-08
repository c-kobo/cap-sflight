"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/common/format", "ux/eng/fioriai/reuse/common/result"], function (__ux_eng_fioriai_reuse_common_format, __ux_eng_fioriai_reuse_common_result) {
  "use strict";

  const extractFromMarkdown = __ux_eng_fioriai_reuse_common_format["extractFromMarkdown"];
  const error = __ux_eng_fioriai_reuse_common_result["error"];
  const success = __ux_eng_fioriai_reuse_common_result["success"];
  /**
   * A function that validates a JSON object.
   *
   * @param json The JSON object to validate.
   * @returns A promise that resolves to the result of the validation.
   * @template T The expected type of the JSON object.
   */
  /**
   * Parse a JSON string and return the result.
   *
   * @param jsonString The JSON string to parse.
   * @returns A result containing the parsed JSON object or an error message if parsing fails.
   */
  function parseJson(jsonString) {
    try {
      return success(JSON.parse(jsonString));
    } catch {
      return error(`Failed to parse JSON: ${jsonString}`);
    }
  }

  /**
   * Parse a string into a JSON object and validate it.
   *
   * @param data The string to parse.
   * @param validate The validator for the JSON object. By default, validation is a no-op that always succeeds.
   * @returns The result of the translation.
   */
  async function parseAndValidate(data, validate) {
    const jsonString = extractFromMarkdown(data);
    const result = parseJson(jsonString);
    if (!result.success) {
      return result;
    }
    return validate(result.data);
  }
  var __exports = {
    __esModule: true
  };
  __exports.parseAndValidate = parseAndValidate;
  return __exports;
});
//# sourceMappingURL=JsonValidator-dbg.js.map
