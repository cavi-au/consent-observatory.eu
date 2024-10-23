import _ from "lodash";
import { env, jobExecutor } from "../../../app.server.js";
import { fail } from "@sveltejs/kit";

export const actions = {
    default: async ({ request }) => {
        let formData = await request.formData();

        let errors = {};

        let adminAccessSecret = formData.get('adminAccessSecret')?.trim();

        if (!adminAccessSecret) {
            errors.adminAccessSecret = 'Access Secret cannot be empty';
        } else if (adminAccessSecret !== env.ADMIN_ACCESS_SECRET) {
            errors.adminAccessSecret = 'Access Secret is invalid';
        }

        if (_.isEmpty(errors)) {
            let jobs = [];
            for (let jobId of jobExecutor.getJobIds()) {
                jobs.push(jobExecutor.getPublicJobInfo(jobId));
            }
            return { status: "success", jobs };
        } else {
            return fail(400, { errors, data: { adminAccessSecret } });
        }
    }
};
