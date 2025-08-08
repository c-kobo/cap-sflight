"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/common/format", "ux/eng/fioriai/reuse/common/result", "ux/eng/fioriai/reuse/common/util", "ux/eng/fioriai/reuse/service/fioriAIAction"], function (__ux_eng_fioriai_reuse_common_format, __ux_eng_fioriai_reuse_common_result, __ux_eng_fioriai_reuse_common_util, __ux_eng_fioriai_reuse_service_fioriAIAction) {
  "use strict";

  const extractFromMarkdown = __ux_eng_fioriai_reuse_common_format["extractFromMarkdown"];
  const success = __ux_eng_fioriai_reuse_common_result["success"];
  const objectToNameValueObject = __ux_eng_fioriai_reuse_common_util["objectToNameValueObject"];
  const callFioriAiAction = __ux_eng_fioriai_reuse_service_fioriAIAction["callFioriAiAction"];
  /**
   * Parameters for the OData action to process the easy filter.
   */
  /**
   * Runs the error explanation processing action with the given template and parameters.
   *
   * @param template The template to use for the action.
   * @param parameters The parameters to pass to the action.
   * @returns A promise that resolves with the result of the action.
   */
  async function processErrorExplanation(template, parameters) {
    const odataParameters = {
      template,
      parameters: objectToNameValueObject(parameters)
    };
    const response = await callFioriAiAction(`Explanation/com.sap.gateway.srvd.aiu_ui_prompt.v0001.process`, odataParameters);
    if (!response.success) {
      return response;
    }
    return success(extractFromMarkdown(response.data.value));
  }
  var __exports = {
    __esModule: true
  };
  __exports.processErrorExplanation = processErrorExplanation;
  return __exports;
});
//# sourceMappingURL=ProcessErrorExplanation-dbg.js.map
