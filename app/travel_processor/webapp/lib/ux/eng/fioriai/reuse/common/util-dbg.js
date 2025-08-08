"use strict";

sap.ui.define([], function () {
  "use strict";

  /**
   * Converts an object into an array of `{ name, value }` objects.
   *
   * @template T The type of the input object.
   * @param obj The object to convert.
   * @returns An array where each element represents a property of the original object as a `{ name, value }` object.
   */
  function objectToNameValueObject(obj) {
    return Object.entries(obj).map(([name, value]) => ({
      name,
      value
    }));
  }
  var __exports = {
    __esModule: true
  };
  __exports.objectToNameValueObject = objectToNameValueObject;
  return __exports;
});
//# sourceMappingURL=util-dbg.js.map
