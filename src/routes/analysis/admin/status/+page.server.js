import _ from "lodash";
import { env, isEmailOnWhitelist, jobExecutor } from "../../../server-state.js";
import { Job } from "$lib/server/analysis/job.js";
import { invalid } from "@sveltejs/kit";

// TODO make this work with admin access secret, when init if not set or empty throw error, must at least be 8 chracters long
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