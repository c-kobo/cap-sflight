"use strict";

sap.ui.define(["sap/ui/core/Lib", "./summary/SmartSummary"], function (Lib, ___summary_SmartSummary) {
  "use strict";

  const _summarize = ___summary_SmartSummary["summarize"];
  /**
   * Fiori AI reuse library.
   */
  Lib.init({
    name: "ux.eng.fioriai.reuse",
    version: "${project.version}",
    dependencies: [
    // keep in sync with the ui5.yaml and .library files. Do not list lazy dependencies here, else they will be loaded eagerly
    "sap.ui.core", "sap.m"],
    noLibraryCSS: false // if no CSS is provided, you can disable the library.css load here
  });

  /**
   * Start smart summarize.
   *
   * @param options options for summarize, e.g. the view.
   * @deprecated Use `summarize` from `ux/eng/fioriai/reuse/summary/SmartSummary` instead.
   */
  async function summarize(options) {
    return _summarize(options);
  }
  var __exports = {
    __esModule: true
  };
  __exports.summarize = summarize;
  return __exports;
});
//# sourceMappingURL=library-dbg.js.map
