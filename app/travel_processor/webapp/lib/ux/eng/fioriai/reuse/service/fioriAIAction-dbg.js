"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/service/action"], function (__ux_eng_fioriai_reuse_service_action) {
  "use strict";

  const callAction = __ux_eng_fioriai_reuse_service_action["callAction"];
  const _callFioriAiAction = callAction.bind(null, "/sap/opu/odata4/sap/aiu_ui_prompt/srvd/sap/aiu_ui_prompt/0001/");

  /**
   * Calls the Fiori AI action with the given parameters.
   *
   * @param args The parameters to pass to the action.
   * @returns The result of the action call.
   */
  const callFioriAiAction = _callFioriAiAction;

  /**
   * Calls the Fiori AI action with the given parameters and a dynamic service URL prefix.
   *
   * @param serviceUrl The OData service URL prefix to use for the action call.
   * @param action The action to call. This must be a fully-qualified OData action name.
   * @param parameters Action parameters.
   * @returns The result of the action call.
   */
  function callFioriAiSummarizeAction(serviceUrl, action, parameters) {
    return callAction(`/${serviceUrl}`, action, parameters);
  }
  var __exports = {
    __esModule: true
  };
  __exports.callFioriAiAction = callFioriAiAction;
  __exports.callFioriAiSummarizeAction = callFioriAiSummarizeAction;
  return __exports;
});
//# sourceMappingURL=fioriAIAction-dbg.js.map
