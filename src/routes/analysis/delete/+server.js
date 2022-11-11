import * as responseUtils from '$lib/server/utils/response-utils.js';
import { jobExecutor } from "../../../app.server.js";
import { JobExecutor } from "$lib/server/analysis/job-executor.js";

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

    let job = jobExecutor.getJobById(jsonObj.jobId);
    if (!job) {
        return responseUtils.apiError(404, `Job with id: "${jsonObj.jobId}" does not exist`);
    }
    if (jobExecutor.getJobStatus(job) === JobExecutor.jobStatus.PROCESSING) {
        return responseUtils.apiError(400,'Cannot delete job while the job is being processed');
    }

    try {
        await jobExecutor.removeJob(job.id);
    } catch (e) {
        return responseUtils.apiError(500, e.message);
    }

    return responseUtils.apiSuccess({ status: "success"} );
}