/**
 * Errors thrown by the `WixClient` API from the `@wix/sdk` package.
 */
type WixClientError = WixClientApplicationError | WixClientValidationError | WixClientSystemError;

type WixClientApplicationError = Error & {
    details: { applicationError: { code: number | string } };
};

type WixClientValidationError = Error & {
    details: { validationError: object };
};

type WixClientSystemError = Error & {
    runtimeError: { message: string; cause?: unknown };
};

const isString = (value: unknown): value is string => typeof value === 'string';

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const isWixClientApplicationError = (error: unknown): error is WixClientApplicationError =>
    isObject(error) &&
    isString(error.message) &&
    isObject(error.details) &&
    isObject(error.details.applicationError);

const isWixClientValidationError = (error: unknown): error is WixClientValidationError =>
    isObject(error) &&
    isString(error.message) &&
    isObject(error.details) &&
    isObject(error.details.validationError);

const isWixClientSystemError = (error: unknown): error is WixClientSystemError =>
    isObject(error) &&
    isString(error.message) &&
    isObject(error.runtimeError) &&
    isString(error.runtimeError.message);

const isWixClientError = (error: unknown): error is WixClientError =>
    isWixClientApplicationError(error) ||
    isWixClientValidationError(error) ||
    isWixClientSystemError(error);

/**
 * When the Wix SDK creates an error object, in certain cases it replaces the
 * error message with the entire error object serialized to a JSON string.
 * This function attempts to extract the original error message.
 */
const getWixClientErrorMessage = (error: WixClientError): string => {
    if (isWixClientSystemError(error)) {
        // System errors use a fixed message: "System error occurred". The
        // actual HTTP error and message (e.g., "Failed to fetch") are in the
        // `runtimeError` property. And an even more specific message (e.g.
        // "getaddrinfo ENOTFOUND wixapis.com") in the `runtimeError.cause`
        // property.
        const { runtimeError } = error;
        const { cause } = runtimeError;
        return isObject(cause) && isString(cause.message) ? cause.message : runtimeError.message;
    }

    try {
        const parsedMessage: unknown = JSON.parse(error.message);
        if (isObject(parsedMessage) && isString(parsedMessage.message)) {
            return parsedMessage.message;
        }
    } catch {}

    return error.message;
};

const getWixClientErrorCode = (error: WixClientError): number | string | undefined =>
    isWixClientApplicationError(error) ? error.details.applicationError.code : undefined;

export const isNotFoundWixClientError = (error: unknown): boolean => {
    const code = isWixClientError(error) ? getWixClientErrorCode(error) : undefined;
    return code === 404 || (isString(code) && code.includes('NOT_FOUND'));
};

/**
 * Fixes the broken error message in a `WixClient` error. If it is not a
 * `WixClient` error, returns it unchanged.
 * @see {@link getWixClientErrorMessage} for details.
 */
export const normalizeWixClientError = (error: unknown): unknown => {
    if (isWixClientError(error)) {
        error.message = getWixClientErrorMessage(error);
    }
    return error;
};
