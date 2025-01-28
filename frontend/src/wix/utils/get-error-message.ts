import { isRouteErrorResponse } from '@remix-run/react';

/*
 * Retrieves the message from a thrown error.
 * - Supports Remix ErrorResponse, returned by `useRouteError()` when a loader
 *   throws `new Response(...)` or `json(...)`.
 * - Supports `Error` instances and plain objects with a `message` property.
 * - Converts objects without a `message` property to a JSON string to provide
 *   some information about the error.
 * - Falls back to converting the value to a string.
 */
export function getErrorMessage(error: unknown): string {
    // Remix ErrorResponse thrown from an action or loader:
    // - throw new Response('Oops', { status: 404 })
    // - throw json({message: 'Oops'}, { status: 404 })
    if (isRouteErrorResponse(error)) {
        if (error.data) {
            return getErrorMessage(error.data);
        } else if (error.statusText) {
            return error.statusText;
        } else {
            return String(error.status);
        }
    }

    if (typeof error == 'object' && error !== null) {
        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }

        try {
            return JSON.stringify(error);
        } catch {
            // Fall through.
        }
    }

    return String(error);
}
