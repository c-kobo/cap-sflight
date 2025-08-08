declare module "ux/eng/fioriai/reuse/service/csrfToken" {
    const csrfTokenCache: Map<string, Promise<string>>;
    /**
     * Invalidates the CSRF token for the given endpoint.
     *
     * @param endpoint The endpoint URL to invalidate the CSRF token for.
     */
    function invalidateCSRFToken(endpoint: string): void;
    /**
     * Fetches the CSRF token from the given endpoint.
     *
     * @param endpoint The endpoint URL to fetch the CSRF token from.
     * @returns The CSRF token.
     * @throws Error Will throw an error if the token cannot be fetched.
     */
    function fetchCSRFToken(endpoint: string): Promise<string>;
    /**
     * Checks if the given response indicates a CSRF token error.
     *
     * @param response The response to check.
     * @returns `true` if the response indicates a CSRF token error, otherwise `false`.
     */
    function hasCSRFTokenError(response: Response): boolean;
}
//# sourceMappingURL=csrfToken.d.ts.map