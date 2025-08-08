import Localization from "sap/base/i18n/Localization";
import { error, Result, success } from "ux/eng/fioriai/reuse/common/result";
import { fetchCSRFToken, hasCSRFTokenError } from "ux/eng/fioriai/reuse/service/csrfToken";

export type Value = string | number | boolean | null | Value[] | { [name: string]: Value };

/**
 * Error codes returned by the OData service
 */
export const enum ODataErrorCode {
    /** "You are not authorized to perform this action." */
    unauthorized = "AIU_PROMPT/001",
    /** "The connection to SAP Business AI failed. Please check the configuration." */
    configurationError = "AIU_PROMPT/002",
    /** "The request to SAP Business AI failed." */
    temporaryError = "AIU_PROMPT/003",
    /** "The feature is no longer available for you." */
    featureUnavailable = "AIU_PROMPT/004"
}

/** OData error response */
export type ErrorResponse = { error: { code: ODataErrorCode; message: string } };

/**
 * Calls an OData action on the given service.
 *
 * @param service The service base URL.
 * @param action The action to call. This must be a fully-qualified OData action name.
 * @param parameters Action parameters.
 * @param csrfToken csrf Token for the request, if required. If not provided, it will be fetched automatically.
 * @returns The result of the action.
 */
export async function callAction<ReturnType extends Value>(
    service: `/${string}`,
    action: string,
    parameters?: { [name: string]: Value },
    csrfToken?: string
): Promise<Result<ReturnType>> {
    const header: HeadersInit = {
        "Accept": "application/json;odata.metadata=minimal;IEEE754Compatible=true",
        "Accept-Language": Localization.getLanguage(),
        "Content-Type": "application/json;charset=UTF-8;IEEE754Compatible=true"
    };
    if (csrfToken) {
        header["x-CSRF-Token"] = csrfToken;
    }
    const request: RequestInit = {
        method: "POST",
        headers: header,
        body: parameters ? JSON.stringify(parameters) : undefined
    };

    let response: Response;

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

        let errorDetails: ErrorResponse | undefined;
        try {
            errorDetails = (await response.json()) as ErrorResponse;
            return error(
                `Request failed: ${response.status} - ${response.statusText}: ${errorDetails.error.message}`,
                errorDetails.error.code
            );
        } catch {
            return error(`Request failed: ${response.status} - ${response.statusText}`);
        }
    }

    return success(await response.json());
}
