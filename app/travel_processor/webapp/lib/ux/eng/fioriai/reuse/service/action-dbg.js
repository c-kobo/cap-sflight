"use strict";

sap.ui.define(["sap/base/i18n/Localization", "ux/eng/fioriai/reuse/common/result", "ux/eng/fioriai/reuse/service/csrfToken"], function (Localization, __ux_eng_fioriai_reuse_common_result, __ux_eng_fioriai_reuse_service_csrfToken) {
  "use strict";

  const error = __ux_eng_fioriai_reuse_common_result["error"];
  const success = __ux_eng_fioriai_reuse_common_result["success"];
  const fetchCSRFToken = __ux_eng_fioriai_reuse_service_csrfToken["fetchCSRFToken"];
  const hasCSRFTokenError = __ux_eng_fioriai_reuse_service_csrfToken["hasCSRFTokenError"];
  /**
   * Error codes returned by the OData service
   */
  var ODataErrorCode = /*#__PURE__*/function (ODataErrorCode) {
    /** "You are not authorized to perform this action." */
    ODataErrorCode["unauthorized"] = "AIU_PROMPT/001";
    /** "The connection to SAP Business AI failed. Please check the configuration." */
    ODataErrorCode["configurationError"] = "AIU_PROMPT/002";
    /** "The request to SAP Business AI failed." */
    ODataErrorCode["temporaryError"] = "AIU_PROMPT/003";
    /** "The feature is no longer available for you." */
    ODataErrorCode["featureUnavailable"] = "AIU_PROMPT/004";
    return ODataErrorCode;
  }(ODataErrorCode || {});
  /** OData error response */
  /**
   * Calls an OData action on the given service.
   *
   * @param service The service base URL.
   * @param action The action to call. This must be a fully-qualified OData action name.
   * @param parameters Action parameters.
   * @param csrfToken csrf Token for the request, if required. If not provided, it will be fetched automatically.
   * @returns The result of the action.
   */
  async function callAction(service, action, parameters, csrfToken) {
    const header = {
      "Accept": "application/json;odata.metadata=minimal;IEEE754Compatible=true",
      "Accept-Language": Localization.getLanguage(),
      "Content-Type": "application/json;charset=UTF-8;IEEE754Compatible=true"
    };
    if (csrfToken) {
      header["x-CSRF-Token"] = csrfToken;
    }
    const request = {
      method: "POST",
      headers: header,
      body: parameters ? JSON.stringify(parameters) : undefined
    };
    let response;
    try {
      response = await fetch(`${service}${action}`, request);
    } catch (e) {
      return error(`Request failed: ${e instanceof Error ? e.message : "An unknown error occurred"}`);
    }
    if (!response.ok) {
      if ((response.status === 401 || response.status === 403) && hasCSRFTokenError(response)) {
        // repeat the request
        csrfToken = await fetchCSRFToken(service);
        return callAction(service, action, parameters, csrfToken);
      }
      let errorDetails;
      try {
        errorDetails = await response.json();
        return error(`Request failed: ${response.status} - ${response.statusText}: ${errorDetails.error.message}`, errorDetails.error.code);
      } catch {
        return error(`Request failed: ${response.status} - ${response.statusText}`);
      }
    }
    return success(await response.json());
  }
  var __exports = {
    __esModule: true
  };
  __exports.ODataErrorCode = ODataErrorCode;
  __exports.callAction = callAction;
  return __exports;
});
//# sourceMappingURL=action-dbg.js.map
