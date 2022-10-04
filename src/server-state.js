import fs from 'fs';
import chokidar from 'chokidar';
import { JobExecutor } from "$lib/job/job-executor.js";
import { env as privateEnvVars } from '$env/dynamic/private';
import { WebExtractorExecutor } from "$lib/job/web-extractor-executor.js";

const REQUIRED_ENV_VARS = [
    'JOBS_ROOT_DIR',
    'RULES_DIR'
];

let env = {};
checkRequiredEnvVars();
loadEnvVars();

let jobExecutor;
let webExtractorExecutor;
let emailWhitelist; // may be use this to it's own util if more files needs watching


async function init() {
    let executorOpts = {
        completedExpirationTime: env.JOBS_COMPLETED_EXPIRATION_TIME_MS
    };

    webExtractorExecutor = new WebExtractorExecutor(env.RULES_DIR);
    await webExtractorExecutor.init();

    jobExecutor = new JobExecutor(env.JOBS_ROOT_DIR, webExtractorExecutor, executorOpts);
    await jobExecutor.init();
    loadAndWatchEmailWhitelist();
}

function isEmailOnWhitelist(email) {
    return emailWhitelist.has(email);
}

function loadAndWatchEmailWhitelist() {
    let filePath = env.USER_EMAIL_WHITELIST_FILE_PATH;
    if (filePath && fs.existsSync(filePath)) {
        loadEmailWhitelist(filePath);
        let watcher = chokidar.watch(filePath, { ignoreInitial: true, awaitWriteFinish: true });
        watcher.on('change', () => loadEmailWhitelist(filePath));
        watcher.on('error', (e) => console.error(e));
    } else {
        emailWhitelist = new Set(); // just empty set, so isUserOnWhitelist works
    }
}

function loadEmailWhitelist(path) {
    let fileContent = fs.readFileSync(path, 'utf-8');
    let emails = fileContent.split(/\r?\n/).map(email => email.trim()).filter(email => email.length > 0);
    emailWhitelist = new Set(emails);
}

function checkRequiredEnvVars() {
    for (let envVar of REQUIRED_ENV_VARS) {
        if (!privateEnvVars[envVar]) {
            console.error(`required environment variable "${envVar}" not set, terminating process...`);
            process.exit(1);
        }
    }
}

function loadEnvVars() {
    // required
    env.JOBS_ROOT_DIR = privateEnvVars.JOBS_ROOT_DIR;
    env.RULES_DIR = privateEnvVars.RULES_DIR;
    // optional, set defaults
    env.JOBS_COMPLETED_EXPIRATION_TIME_MS = Number.parseInt(privateEnvVars.JOBS_COMPLETED_EXPIRATION_TIME_MS ?? 7 * 24 * 60 * 60 * 1000);
    env.USER_DEFAULT_MAX_URLS = Number.parseInt(privateEnvVars.USER_DEFAULT_MAX_URLS ?? 10);
    env.USER_DEFAULT_MAX_JOBS = Number.parseInt(privateEnvVars.USER_DEFAULT_MAX_JOBS ?? 1);
    env.USER_WHITELIST_MAX_URLS = Number.parseInt(privateEnvVars.USER_WHITELIST_MAX_URLS ?? 100);
    env.USER_WHITELIST_MAX_JOBS = Number.parseInt(privateEnvVars.USER_WHITELIST_MAX_JOBS ?? 1);
    env.USER_EMAIL_WHITELIST_FILE_PATH = privateEnvVars.USER_EMAIL_WHITELIST_FILE_PATH; // no default

    env = Object.freeze(env);
}

export { init, env, jobExecutor, isEmailOnWhitelist };

