import { invalid } from '@sveltejs/kit';
import _ from 'lodash';
import { Job } from "$lib/job/job.js";
import { env, isEmailOnWhitelist, jobExecutor } from '../../../server-state.js';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const actions = {
    default: async ({ request }) => {
        let formData = await request.formData();

        let email = formData.get('email')?.trim().toLowerCase();
        let urlsStr = formData.get('urls')?.trim();
        let includeScreenshots = !!formData.get('includeScreenshots');

        let errors = {};

        validateEmail(email, errors);
        let urls = validateAndParseUrls(urlsStr, email, errors);

        if (_.isEmpty(errors)) {
            let currentJobs = jobExecutor.getJobsByEmail(email);
            let errorMessage = `The maximum number of analyses has been reached for the current user. If you \
            have one or more analyses which is completed you can download the result and then delete the analysis to be able to submit a new one.`
            if (isEmailOnWhitelist(email)) {
                if (currentJobs > env.USER_WHITELIST_MAX_JOBS) {
                    errors.global = errorMessage;
                }
            } else {
                if (currentJobs > env.USER_DEFAULT_MAX_JOBS) {
                    errors.global = errorMessage;
                }
            }
        }

        if (_.isEmpty(errors)) {
            let job = Job.create(email, urls, { includeScreenshots });
            let queueSize = jobExecutor.queueSize;
            // TODO submit the job,
            // TODO send email to user, ...make a emailService class which can do that and put todo into that... with info about job-id and link to status
            // TODO make ENV vars for config of emailService and use nodemailer, we probably need to setup email at some host...
            return { success: true, jobId: job.id, queueSize };
        } else {
            return invalid(400, { errors, data: { email, urls: urlsStr } });
        }
    }
};

function validateEmail(email, errors) {
    if (!email || email === '') {
        errors.email = 'Email cannot be empty';
        return;
    }
    if (!EMAIL_REGEX.test(email)) {
        errors.email = 'Is not a valid email';
        return;
    }
}

function validateAndParseUrls(urlsStr, email, errors) {
    if (!urlsStr) {
        errors.urls = 'Urls cannot be empty';
        return;
    }
    let urls = urlsStr.split(/\r?\n/);
    urls = urls.filter(url => url.trim() !== '');
    for (let url of urls) {
        try {
            let urlObj = new URL(url);
            if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                errors.urls = `"${url}" is not a valid url. Urls must start with "http://" or "https://"`;
                return;
            }
        } catch (e) {
            errors.urls = `"${url}" is not a valid url`;
            return;
        }
    }

    if (isEmailOnWhitelist(email)) {
        if (urls.length > env.USER_WHITELIST_MAX_URLS) {
            errors.urls = `Limit of max urls="${env.USER_DEFAULT_MAX_URLS}" exceeded`;
            return;
        }
    } else {
        if (urls.length > env.USER_DEFAULT_MAX_URLS) {
            errors.urls = `Limit of max urls="${env.USER_DEFAULT_MAX_URLS}" exceeded`;
            return;
        }
    }


    return urls;
}