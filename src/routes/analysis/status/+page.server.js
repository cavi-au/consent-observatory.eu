import _ from "lodash";
import { env, isEmailOnWhitelist, jobExecutor } from "../../../server-state.js";
import { Job } from "$lib/server/job/job.js";
import { invalid } from "@sveltejs/kit";

export const actions = {
    default: async ({ request }) => {
        let formData = await request.formData();

        let errors = {};

        let jobId = formData.get('jobId')?.trim();

        if (!jobId) {
            errors.jobId = 'Id cannot be empty';
        }

        let job = jobExecutor.getJobById(jobId);

        if (!job) {
            errors.jobId = 'No analysis for this id. Maybe it has expired?'
        }

        if (_.isEmpty(errors)) {
            let publicJobInfo = jobExecutor.getPublicJobInfo(job.id);
            return { status: "success", job: publicJobInfo };
        } else {
            return invalid(400, { errors, data: { jobId } });
        }
    }
};