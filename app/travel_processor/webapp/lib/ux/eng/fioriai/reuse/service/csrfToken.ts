const csrfTokenCache = new Map<string, Promise<string>>();

/**
 * Invalidates the CSRF token for the given endpoint.
 *
 * @param endpoint The endpoint URL to invalidate the CSRF token for.
 */
export function invalidateCSRFToken(endpoint: string): void {
    csrfTokenCache.delete(endpoint);
}

/**
 * Fetches the CSRF token from the given endpoint.
 *
 * @param endpoint The endpoint URL to fetch the CSRF token from.
 * @returns The CSRF token.
 * @throws Error Will throw an error if the token cannot be fetched.
 */
export async function fetchCSRFToken(endpoint: string): Promise<string> {
    /**
     * Throws an error and resets the CSRF token cache for the given endpoint.
     *
     * @param message The error message.
     * @param cause The optional cause of the error.
     * @throws Error The constructed error.
     */
    function handleError(message: string, cause?: unknown): never {
        invalidateCSRFToken(endpoint);
        throw new Error(message, { cause });
    }

    /**
     * Makes a request to fetch the CSRF token from the given endpoint.
     *
     * @returns The CSRF token.
     * @throws Error Will throw an error if the request fails or the token is not returned.
     */
    async function requestToken(): Promise<string> {
        let response: Response;
        try {
            response = await fetch(endpoint, {
                method: "HEAD",
                headers: {
                    "X-CSRF-Token": "Fetch"
                }
            });
        } catch (e) {
            handleError("Failed to fetch CSRF token", e);
        }

        if (!response.ok) {
            handleError(`Failed to fetch CSRF token: ${response.status} - ${response.statusText}`);
        }

        const token = response.headers.get("X-CSRF-Token");
        if (!token) {
            handleError("Failed to fetch CSRF token: Server did not return a token");
        }

        return token;
    }

    let cachedToken = csrfTokenCache.get(endpoint);
    if (!cachedToken) {
        cachedToken = requestToken();
        csrfTokenCache.set(endpoint, cachedToken);
    }
    return cachedToken;
}

/**
 * Checks if the given response indicates a CSRF token error.
 *
 * @param response The response to check.
 * @returns `true` if the response indicates a CSRF token error, otherwise `false`.
 */
export function hasCSRFTokenError(response: Response): boolean {
    return response.headers.get("X-CSRF-Token") === "Required";
}
