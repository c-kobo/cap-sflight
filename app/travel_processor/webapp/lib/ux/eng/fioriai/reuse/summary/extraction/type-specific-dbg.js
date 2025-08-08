"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/common/log", "./table"], function (__Log, tableExtraction) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Log = _interopRequireDefault(__Log);
  /**
   * Map to handle UI5 type specific texts that are added to the summarization.
   * Access is done through a map UI5 metadata name -> type specific text function with:
   *
   * @param element The UI5 element.
   * @returns - Additional text to be added to the summarization, undefined if no additional text exists.
   */
  const typeSpecificTextMap = new Map([
  // Higher level table types mdc and smart table contain lower level table types.
  // Complete handling of the table content depends on the export column schema availability, and child nodes are skipped only then.
  ["sap.ui.mdc.Table", element => tableExtraction.mdcTableText(element)], ["sap.ui.comp.smarttable.SmartTable", element => tableExtraction.smartTableText(element)], ["sap.m.Table", element => tableExtraction.mTableText(element)], ["sap.ui.table.Table", element => tableExtraction.uiTableText(element)], ["sap.m.Switch", element => ({
    text: element.getState() ? element.getCustomTextOn() : element.getCustomTextOff(),
    elementProcessed: true
  })]]);

  /**
   * Returns the type specific text handler for the given UI5 element if exists.
   *
   * @param element UI5 element
   * @returns type specific text handler if exists, otherwise undefined
   */
  function getTypeSpecificTextHandler(element) {
    const metadataName = element?.getMetadata()?.getName();
    const typeSpecificTextHandler = typeSpecificTextMap.get(metadataName);
    if (typeof typeSpecificTextHandler === "function") {
      return element => {
        try {
          return typeSpecificTextHandler(element);
        } catch (error) {
          Log.warning(`Error in when handling specific text for ${element.getId()} (${metadataName})`, error);
        }
      };
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.getTypeSpecificTextHandler = getTypeSpecificTextHandler;
  return __exports;
});
//# sourceMappingURL=type-specific-dbg.js.map
