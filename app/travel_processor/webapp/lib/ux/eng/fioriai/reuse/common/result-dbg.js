"use strict";

sap.ui.define([], function () {
  "use strict";

  /**
   * Successful result with data.
   *
   * @template T Data type
   */

  /**
   * Error result with message and optional code.
   *
   * @template ErrorCode Error code type
   */

  /**
   * Union type representing either success or error.
   *
   * @template T Data type for success case
   * @template ErrorCode Error code type for error case
   */

  /**
   * Creates a success result.
   *
   * @template T Data type
   * @param data The success data
   * @returns Success result
   */
  function success(data) {
    return {
      success: true,
      data
    };
  }

  /**
   * Creates an error result.
   *
   * @template ErrorCode Error code type
   * @param message Error message
   * @param code Optional error code
   * @returns Error result
   */
  function error(message, code) {
    return code !== undefined ? {
      success: false,
      message,
      code
    } : {
      success: false,
      message
    };
  }
  var __exports = {
    __esModule: true
  };
  __exports.success = success;
  __exports.error = error;
  return __exports;
});
//# sourceMappingURL=result-dbg.js.map
