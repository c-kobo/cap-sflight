"use strict";

sap.ui.define(["sap/ui/core/Lib", "ux/eng/fioriai/reuse/common/log", "ux/eng/fioriai/reuse/summary/controller/Summarization.controller"], function (Lib, __Log, __SummarizationController) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Log = _interopRequireDefault(__Log);
  const SummarizationController = _interopRequireDefault(__SummarizationController);
  /**
   * Fiori AI reuse library.
   */
  Lib.init({
    name: "ux.eng.fioriai.reuse",
    version: "1.0.0",
    dependencies: [
    // keep in sync with the ui5.yaml and .library files. Do not list lazy dependencies here, else they will be loaded eagerly
    "sap.ui.core", "sap.m"],
    noLibraryCSS: false // if no CSS is provided, you can disable the library.css load here
  });
  const summarizer = new SummarizationController();

  /**
   * Start smart summarize.
   *
   * @param options options for summarize, e.g. the view.
   */
  async function summarize(options) {
    Log.debug(`Starting summarization of view ${options.view.getId()}`);
    try {
      await summarizer.startSummarization(options.view);
    } catch (error) {
      Log.error("Error performing summarization", error);
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.summarize = summarize;
  return __exports;
});
