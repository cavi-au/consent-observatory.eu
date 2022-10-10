import * as responseUtils from '$lib/server/utils/response-utils.js';
import { jobService } from "../../../server-state.js";
import { JobService } from "$lib/server/analysis/job-service.js";

export async function POST({ request }) {
    let jsonObj;

    try {
        jsonObj = await request.json();
    } catch (e) {
        return responseUtils.apiError(400, 'Invalid json request, could not parse');
    }

    if (!jsonObj.jobId) {
        return responseUtils.apiError(400, '"jobId" must be defined and cannot be empty');
    }

    let job = jobService.getJobById(jsonObj.jobId);
    if (!job) {
        return responseUtils.apiError(404, `Job with id: "${jsonObj.jobId}" does not exist`);
    }
    if (jobService.getJobStatus(job) === JobService.jobStatus.PROCESSING) {
        return responseUtils.apiError(400,'Cannot delete job while the job is being processed');
    }

    try {
        await jobService.removeJob(job.id);
    } catch (e) {
        return responseUtils.apiError(500, e.message);
    }

    return responseUtils.apiSuccess({ status: "success"} );
}