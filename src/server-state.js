import { JobExecutor } from "$lib/job/job-executor.js";
import { env as privateEnvVars } from '$env/dynamic/private';

let jobExecutor;

async function init() {
    // TODO read env vars and set executor
    jobExecutor = new JobExecutor(privateEnvVars.JOBS_ROOT_DIR);
    jobExecutor.init();
}

export { init, jobExecutor };

