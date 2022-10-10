import _ from "lodash";
import { env, isEmailOnWhitelist, jobService } from "../../../server-state.js";
import { Job } from "$lib/server/analysis/job.js";
import { invalid } from "@sveltejs/kit";

export const actions = {
    default: async ({ request }) => {
        let formData = await request.formData();

        let errors = {};

        let jobId = formData.get('jobId')?.trim();

        if (!jobId) {
            errors.jobId = 'Id cannot be empty';
        }

        let job = jobService.getJobById(jobId);

        if (!job) {
            errors.jobId = 'No analysis for this id. Maybe it has expired?'
        }

        if (_.isEmpty(errors)) {
            let publicJobInfo = jobService.getPublicJobInfo(job.id);
            return { status: "success", job: publicJobInfo };
        } else {
            return invalid(400, { errors, data: { jobId } });
        }
    }
};