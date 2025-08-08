declare module "ux/eng/fioriai/reuse/common/result" {
    /**
     * Successful result with data.
     *
     * @template T Data type
     */
    type Success<T> = {
        success: true;
        data: T;
    };
    /**
     * Error result with message and optional code.
     *
     * @template ErrorCode Error code type
     */
    type Error<ErrorCode = string> = {
        success: false;
        message: string;
        code?: ErrorCode;
    };
    /**
     * Union type representing either success or error.
     *
     * @template T Data type for success case
     * @template ErrorCode Error code type for error case
     */
    type Result<T, ErrorCode = string> = Success<T> | Error<ErrorCode>;
    /**
     * Creates a success result.
     *
     * @template T Data type
     * @param data The success data
     * @returns Success result
     */
    function success<T>(data: T): Success<T>;
    /**
     * Creates an error result.
     *
     * @template ErrorCode Error code type
     * @param message Error message
     * @param code Optional error code
     * @returns Error result
     */
    function error<ErrorCode = string>(message: string, code?: ErrorCode): Error<ErrorCode>;
}
//# sourceMappingURL=result.d.ts.map