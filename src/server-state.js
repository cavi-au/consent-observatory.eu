import { JobExecutor } from "$lib/job/job-executor.js";
import { env as privateEnvVars } from '$env/dynamic/private';

const REQUIRED_ENV_VARS = [
    'JOBS_ROOT_DIR',
];

checkRequiredEnvVars();
loadEnvVars();

let jobExecutor;
let env = {};

async function init() {
    let executorOpts = {
        completedExpirationTime: env.JOBS_COMPLETED_EXPIRATION_TIME_MS
    };
    jobExecutor = new JobExecutor(env.JOBS_ROOT_DIR, executorOpts);
    await jobExecutor.init();
}

function checkRequiredEnvVars() {
    for (let envVar of REQUIRED_ENV_VARS) {
        if (!privateEnvVars[envVar]) {
            console.error(`required environment variable "${envVar}" not set`);
        }
    }
}

function loadEnvVars() {
    // required
    env.JOBS_ROOT_DIR = privateEnvVars.JOBS_ROOT_DIR;
    // optional, set defaults
    env.JOBS_COMPLETED_EXPIRATION_TIME_MS = Number.parseInt(privateEnvVars.JOBS_ROOT_DIR ?? 7 * 24 * 60 * 60 * 1000);
    env.USER_DEFAULT_MAX_URLS = Number.parseInt(privateEnvVars.USER_DEFAULT_MAX_URLS ?? 10);
    env.USER_DEFAULT_MAX_JOBS = Number.parseInt(privateEnvVars.USER_DEFAULT_MAX_JOBS ?? 1);
    env.USER_WHITELIST_MAX_URLS = Number.parseInt(privateEnvVars.USER_WHITELIST_MAX_URLS ?? 100);
    env.USER_WHITELIST_MAX_JOBS = Number.parseInt(privateEnvVars.USER_WHITELIST_MAX_JOBS ?? 1);
    env.USER_WHITELIST_FILE_PATH = privateEnvVars.USER_WHITELIST_MAX_JOBS; // no default

    env = Object.freeze(env);
}

export { init, env, jobExecutor };

