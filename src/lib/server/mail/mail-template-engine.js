import { Mail } from "$lib/server/mail/mail.js";

class MailTemplateEngine {

    #from;
    #mailTemplateDir;
    #mailSubmittedTemplate;
    #mailCompletedTemplate;

    constructor(from) {
        this.#from = from;
    }

    async init() {
        this.#mailSubmittedTemplate = (await import(/* @vite-ignore */ '$lib/server/assets/mail/analysis-submitted.js')).default;
        this.#mailCompletedTemplate = (await import(/* @vite-ignore */ '$lib/server/assets/mail/analysis-completed.js')).default;
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