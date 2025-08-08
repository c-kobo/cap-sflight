"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/common/log", "ux/eng/fioriai/reuse/summary/controller/Summarization.controller"], function (__Log, __SummarizationController) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Log = _interopRequireDefault(__Log);
  const SummarizationController = _interopRequireDefault(__SummarizationController);
  const summarizer = new SummarizationController();

  /**
   * Configuration options for the summarize function.
   */

  /**
   * Initiates smart summarization of a UI5 view.
   *
   * @param options Configuration containing the view to summarize
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
//# sourceMappingURL=SmartSummary-dbg.js.map
