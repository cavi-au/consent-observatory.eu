import { error as svelteError } from '@sveltejs/kit';
import { redirect as svelteRedirect } from '@sveltejs/kit';

const errorNames = new Map([
    [400, 'BadRequest'],
    [401, 'Unauthorized'],
    [403, 'Forbidden'],
    [404, 'NotFound'],
    [405, 'MethodNotAllowed'],
    // SOME MORE https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
    [500, 'InternalServerError'],
    [501, 'NotImplemented'],
    [502, 'BadGateway'],
    [503, 'ServiceUnavailable'],
    // Some more...
]);

/**
 * @param body
 * @returns {{status, statusText, body}}
 */
export function success(body) {
    return response(200, 'OK', body);
}

/**
 * @param status
 * @param message
 * @returns {{body, status, statusText}}
 */
export function error(status, message) {
    let statusText = errorNames.get(status) ?? 'UNKNOWN ERROR NAME';
    return response(status, statusText, {
        error: {
            status,
            statusText,
            message
        }
    });
}

/**
 * @param status
 * @param statusText
 * @param body
 * @returns {{status, statusText, body}}
 */
export function response(status, statusText, body) {
    return {
        status,
        statusText,
        body
    }
}

/**
 * @param {string|object} [body=null]
 * @returns {Response}
 */
export function apiSuccess(body = null) {
    return toApiResponse(success(body));
}

/**
 *
 * @param {number} status
 * @param {string} message
 * @returns {Response}
 */
export function apiError(status, message) {
    return toApiResponse(error(status, message));
}

/**
 * @param {object} response
 * @param {object} response.body
 * @param {number} response.status
 * @param {string} response.statusText
 * @returns {Response}
 */
export function toApiResponse(response) {
    let body = response.body;
    if (body !== null && typeof body !== 'string') {
        body = JSON.stringify(body);
    }
    return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
