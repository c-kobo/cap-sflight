"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/common/result", "ux/eng/fioriai/reuse/common/util", "ux/eng/fioriai/reuse/service/fioriAIAction"], function (__ux_eng_fioriai_reuse_common_result, __ux_eng_fioriai_reuse_common_util, __ux_eng_fioriai_reuse_service_fioriAIAction) {
  "use strict";

  const success = __ux_eng_fioriai_reuse_common_result["success"];
  const objectToNameValueObject = __ux_eng_fioriai_reuse_common_util["objectToNameValueObject"];
  const callFioriAiAction = __ux_eng_fioriai_reuse_service_fioriAIAction["callFioriAiAction"];
  /**
   * A prompt message.
   */
  /**
   * The parameters of the "Complete" action.
   */
  /**
   * The result of the "Complete" action.
   */
  /**
   * Converts a prompt message to the type expected by the OData complete action.
   *
   * @param message The prompt message to convert.
   * @returns The converted message.
   */
  function promptMessageToODataPromptMessage(message) {
    const result = {
      role: message.role,
      template: message.template
    };
    if (message.parameters) {
      if (Object.keys(message.parameters).length > 0) {
        result.parameters = objectToNameValueObject(message.parameters);
      }
    }
    return result;
  }

  /**
   * Creates a function that completes a prompt by calling the "Complete" action of the OData service.
   *
   * @param entitySet The entity set to create the function for.
   * @returns A function that takes a prompt and returns a completion result.
   */
  function createODataCompletionFunction(entitySet) {
    return async function runODataCompletion(messages) {
      const parameters = {
        prompts: messages.map(promptMessageToODataPromptMessage)
      };
      const result = await callFioriAiAction(`${entitySet}/com.sap.gateway.srvd.aiu_ui_prompt.v0001.Complete`, parameters);
      if (!result.success) {
        return result;
      }
      return success(result.data.message);
    };
  }
  var __exports = {
    __esModule: true
  };
  __exports.promptMessageToODataPromptMessage = promptMessageToODataPromptMessage;
  __exports.createODataCompletionFunction = createODataCompletionFunction;
  return __exports;
});
//# sourceMappingURL=ODataCompletion-dbg.js.map
