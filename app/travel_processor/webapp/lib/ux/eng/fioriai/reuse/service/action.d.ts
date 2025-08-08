declare module "ux/eng/fioriai/reuse/service/action" {
    import { Result } from "ux/eng/fioriai/reuse/common/result";
    type Value = string | number | boolean | null | Value[] | {
        [name: string]: Value;
    };
    /**
     * Error codes returned by the OData service
     */
    const enum ODataErrorCode {
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
    type ErrorResponse = {
        error: {
            code: ODataErrorCode;
            message: string;
        };
    };
    /**
     * Calls an OData action on the given service.
     *
     * @param service The service base URL.
     * @param action The action to call. This must be a fully-qualified OData action name.
     * @param parameters Action parameters.
     * @param csrfToken csrf Token for the request, if required. If not provided, it will be fetched automatically.
     * @returns The result of the action.
     */
    function callAction<ReturnType extends Value>(service: `/${string}`, action: string, parameters?: {
        [name: string]: Value;
    }, csrfToken?: string): Promise<Result<ReturnType>>;
}
//# sourceMappingURL=action.d.ts.map