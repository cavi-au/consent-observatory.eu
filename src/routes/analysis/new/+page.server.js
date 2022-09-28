import { invalid } from '@sveltejs/kit';
import _ from 'lodash';
import { Job } from "$lib/job/job.js";

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
            // TODO in validate test if within limit of allowed urls and don't have jobs registered in the executor (none at all) or is on whitelist of emails (whitelist should probably still have a limit, just higher)

        if (_.isEmpty(errors)) {
            let job = Job.create(email, urls);
            // TODO submit the job,
            // TODO send email to user with info about job-id and link to status
            return { success: true, jobId: job.id };
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
        if (!url) {
            errors.urls = `"${url}" is not a valid url`;
            return;
        }
    }

    if (isEmailOnWhiteList(email)) {
        // rules for whilelist
        // USER_DEFAULT_MAX_URLS
        // USER_DEFAULT_MAX_JOBS
        // USER_WHITELIST_MAX_URLS
        // USER_WHITELIST_MAX_JOBS
        // USER_WHITELIST_FILE_PATH
        // Todo lav så serverState laver object med defaults for alle env variable og exposer serverState.env.XXXX
    } else {
        // default rules
    }


    return urls;
}

function isEmailOnWhiteList(email) {
    // TODO implement this
    return false;
}