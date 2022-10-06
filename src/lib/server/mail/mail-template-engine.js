import { Mail } from "$lib/server/mail/mail.js";
import path from 'path';
import { pathToFileURL } from 'url';

class MailTemplateEngine {

    #from;
    #mailTemplateDir;
    #mailSubmittedTemplate;
    #mailCompletedTemplate;

    constructor(mailTemplateDir, from) {
        this.#mailTemplateDir = mailTemplateDir;
        this.#from = from;
    }

    async init() {
        // we need to extract the pathname from the URL at vite import() expects a string not an URL object
        let submittedFileUrl = pathToFileURL(path.join(this.#mailTemplateDir, 'analysis-submitted.js')).pathname;
        this.#mailSubmittedTemplate = (await import(/* @vite-ignore */ submittedFileUrl)).default;
        let completedFileUrl = pathToFileURL(path.join(this.#mailTemplateDir, 'analysis-completed.js')).pathname;
        this.#mailCompletedTemplate = (await import(/* @vite-ignore */ completedFileUrl)).default;
    }

    createJobSubmittedMail(job) {
        let vars = {
            '$ANALYSIS_ID': job.id,
        };
        let text = this.#replaceMailVars(this.#mailSubmittedTemplate.text, vars);
        let html = this.#replaceMailVars(this.#mailSubmittedTemplate.html, vars);

        return new Mail(this.#from, job.userEmail, this.#mailSubmittedTemplate.subject, text, html);
    }

    createJobCompletedMail(job) {
        let vars = {
            '$ANALYSIS_ID': job.id,
        };
        let text = this.#replaceMailVars(this.#mailCompletedTemplate.text, vars);
        let html = this.#replaceMailVars(this.#mailCompletedTemplate.html, vars);

        return new Mail(this.#from, job.userEmail, this.#mailCompletedTemplate.subject, text, html);
    }

    #replaceMailVars(mailStr, vars) {
        for (let key of Object.keys(vars)) {
            mailStr = mailStr.replaceAll(key, vars[key]);
        }
        return mailStr;
    }
}

export { MailTemplateEngine };