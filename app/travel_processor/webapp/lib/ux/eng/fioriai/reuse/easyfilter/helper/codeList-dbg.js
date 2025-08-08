"use strict";

sap.ui.define([], function () {
  "use strict";

  async function getCodeList(property) {
    if (typeof property.codeList === "function") {
      property.codeList = await property.codeList();
    }
    return property.codeList;
  }

  /**
   * Get the code lists for properties.
   *
   * This function requests code lists if they are not available yet.
   *
   * @param properties The properties to get the code lists for
   * @returns The code lists for the properties
   */
  async function getCodeLists(properties) {
    return Promise.all(properties.map(getCodeList));
  }

  /**
   * Check if a code list is initialized.
   *
   * A code list can either be an array, in which case it is considered initialized, or a function that can be
   * called to initialize it.
   *
   * @param codeList The code list to check
   * @returns True if the code list is initialized, false otherwise
   */
  function isCodeListInitialized(codeList) {
    return codeList !== undefined && typeof codeList !== "function";
  }
  /**
   * Get a map of code list entries for a property.
   *
   * @param codeList The code list or a function that returns the code list for the property.
   * @returns A record mapping code list values to their descriptions, or "PENDING" if the code list is not loaded yet.
   */
  function getCodeListMap(codeList) {
    if (!codeList) {
      return undefined;
    }
    if (typeof codeList === "function") {
      return "PENDING";
    }
    return Object.fromEntries(codeList.map(entry => [entry.value, entry.description || ""]));
  }
  var __exports = {
    __esModule: true
  };
  __exports.getCodeLists = getCodeLists;
  __exports.isCodeListInitialized = isCodeListInitialized;
  __exports.getCodeListMap = getCodeListMap;
  __exports.getCodeListMap = getCodeListMap;
  __exports.getCodeListMap = getCodeListMap;
  __exports.getCodeListMap = getCodeListMap;
  return __exports;
});
//# sourceMappingURL=codeList-dbg.js.map
