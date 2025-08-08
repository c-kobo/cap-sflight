"use strict";

sap.ui.define(["sap/ui/core/Lib"], function (Lib) {
  "use strict";

  /**
   * Get the library's resource bundle.
   *
   * @returns The resource bundle
   */
  function getLibraryResourceBundle() {
    return Lib.getResourceBundleFor("ux.eng.fioriai.reuse");
  }

  /**
   * Get a text from the library's resource bundle in the current locale.
   *
   * @param key The key of the text
   * @param args The arguments to replace in the text
   * @returns The text, or the key if the text is not found
   */
  function getText(key, args) {
    return getLibraryResourceBundle().getText(key, args);
  }
  var __exports = {
    __esModule: true
  };
  __exports.getLibraryResourceBundle = getLibraryResourceBundle;
  __exports.getText = getText;
  return __exports;
});
//# sourceMappingURL=text-dbg.js.map
