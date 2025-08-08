"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/common/result"], function (__ux_eng_fioriai_reuse_common_result) {
  "use strict";

  const error = __ux_eng_fioriai_reuse_common_result["error"];
  const success = __ux_eng_fioriai_reuse_common_result["success"];
  /**
   * Validates a JSON object using a Zod schema.
   *
   * @template T The expected type of the JSON object.
   * @param schema The Zod schema to use for validation.
   * @returns The validation function.
   */
  function validateWithZodSchema(schema) {
    return async function validate(json) {
      const result = await schema.safeParseAsync(json);
      if (!result.success) {
        return error(result.error.issues.map(({
          path,
          message
        }) => {
          const pathString = path.map(key => `[${JSON.stringify(key)}]`).join("");
          return `${pathString}: ${message}`;
        }).join(", "));
      }
      return success(result.data);
    };
  }
  var __exports = {
    __esModule: true
  };
  __exports.validateWithZodSchema = validateWithZodSchema;
  return __exports;
});
//# sourceMappingURL=validator-dbg.js.map
