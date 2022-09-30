import * as responseUtils from '$lib/utils/response-utils.js';

export async function POST({ request }) {

    let jsonObj;

    try {
        jsonObj = await request.json();
    } catch (e) {
        responseUtils.apiError(400, 'Invalid json request, could not parse');
    }

    if (!jsonObj.jobId) {
        responseUtils.apiError(400, '"jobId" must be defined and cannot be empty');
    }

    // TODO lookup the job

    // if not exists return 404 error, which on the client just means remove as well as success


    return responseUtils.success({ status: 'success' });

}