import fs from 'fs';
import chokidar from 'chokidar';
import appRootPath from 'app-root-path';
import { JobExecutor } from "$lib/server/analysis/job-executor.js";
import { env as privateEnvVars } from '$env/dynamic/private';
import { WebExtractorExecutor } from "$lib/server/analysis/web-extractor-executor.js";
import { RulesetRepository } from "$lib/server/analysis/ruleset-repository.js";
import { MailTemplateEngine } from "$lib/server/mail/mail-template-engine.js";
import path from "path";
import { setTimeout } from 'timers/promises';
import { fileURLToPath } from 'url';
import { MailService } from "$lib/server/mail/mail-service.js";

const REQUIRED_ENV_VARS = [
    'JOBS_ROOT_DIR',
    'RULES_DIR',
    'MAIL_SMTP_HOST',
    'MAIL_SMTP_PORT',
    'MAIL_SMTP_USER',
    'MAIL_SMTP_PASS',
    'MAIL_MESSAGE_FROM'
];

const MAIL_TIME_DISTRIBUTION_THRESHOLD = 60_000;
const APP_BASE_PATH = appRootPath.toString();

let env = {};
checkRequiredEnvVars();
loadEnvVars();

let jobExecutor;
let webExtractorExecutor;
let rulesetRepository;
let mailService;
let mailTemplateEngine;
let emailWhitelist; // may be use this to it's own util if more files needs watching


async function init() {

    let executorOpts = {
        completedExpirationTime: env.JOBS_COMPLETED_EXPIRATION_TIME_MS
    };

    rulesetRepository = new RulesetRepository(env.RULES_DIR);
    await initService('Error creating ruleset-repository', () => rulesetRepository.init());

    webExtractorExecutor = new WebExtractorExecutor(rulesetRepository);
    await initService('Error creating web-extractor-executor', () => webExtractorExecutor.init());

    let mailOptions = {
        host: env.MAIL_SMTP_HOST,
        port: env.MAIL_SMTP_PORT,
        user: env.MAIL_SMTP_USER,
        pass: env.MAIL_SMTP_PASS
    };

    mailService = new MailService(mailOptions);
    let disableVerification = env.MAIL_SMTP_DISABLE_VERIFICATION === 'true';
    await initService('Error creating mail-service', () => mailService.init(!disableVerification));

    mailTemplateEngine = new MailTemplateEngine(path.join(APP_BASE_PATH, '/src/lib/server/assets/mail'), env.MAIL_MESSAGE_FROM);
    await initService('Error creating mail-template-engine', () => mailTemplateEngine.init());

    jobExecutor = new JobExecutor(env.JOBS_ROOT_DIR, webExtractorExecutor, mailService, mailTemplateEngine, executorOpts);
    await initService('Error creating job-executor', () => jobExecutor.init());

    loadAndWatchEmailWhitelist();

    jobExecutor.onJobCompleted(async ({ job }) => {
        try {
            let mail = mailTemplateEngine.createJobCompletedMail(job);
            let now = Date.now();
            let elapsed = now - job.submittedTime;
            if (elapsed < MAIL_TIME_DISTRIBUTION_THRESHOLD) { // do not fire mails to rapidly (wait at least a minute)
                await setTimeout(MAIL_TIME_DISTRIBUTION_THRESHOLD - elapsed);
            }
            await mailService.sendMail(mail);
        } catch (e) {
            console.error(`Could not send completed mail to: "${job.userEmail}"`);
            console.error(e);
        }
    })
}

async function initService(debugMessage, initializer) {
    try {
        await initializer();
    } catch (e) {
        console.error(debugMessage);
        throw e;
    }
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
    env.MAIL_SMTP_HOST = privateEnvVars.MAIL_SMTP_HOST;
    env.MAIL_SMTP_PORT = Number.parseInt(privateEnvVars.MAIL_SMTP_PORT);
    env.MAIL_SMTP_USER = privateEnvVars.MAIL_SMTP_USER;
    env.MAIL_SMTP_PASS = privateEnvVars.MAIL_SMTP_PASS;
    env.MAIL_MESSAGE_FROM = privateEnvVars.MAIL_MESSAGE_FROM;

    // optional, set defaults
    env.JOBS_COMPLETED_EXPIRATION_TIME_MS = Number.parseInt(privateEnvVars.JOBS_COMPLETED_EXPIRATION_TIME_MS ?? 7 * 24 * 60 * 60 * 1000);
    env.USER_DEFAULT_MAX_URLS = Number.parseInt(privateEnvVars.USER_DEFAULT_MAX_URLS ?? 10);
    env.USER_DEFAULT_MAX_JOBS = Number.parseInt(privateEnvVars.USER_DEFAULT_MAX_JOBS ?? 1);
    env.USER_WHITELIST_MAX_URLS = Number.parseInt(privateEnvVars.USER_WHITELIST_MAX_URLS ?? 100);
    env.USER_WHITELIST_MAX_JOBS = Number.parseInt(privateEnvVars.USER_WHITELIST_MAX_JOBS ?? 1);
    env.USER_EMAIL_WHITELIST_FILE_PATH = privateEnvVars.USER_EMAIL_WHITELIST_FILE_PATH; // no default
    env.MAIL_SMTP_DISABLE_VERIFICATION = privateEnvVars.MAIL_SMTP_DISABLE_VERIFICATION;

    env = Object.freeze(env);
}

export { init, env, jobExecutor, rulesetRepository, webExtractorExecutor, mailService, mailTemplateEngine, isEmailOnWhitelist };

