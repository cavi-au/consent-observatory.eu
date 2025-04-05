import * as crypto from "crypto";
import _ from 'lodash';

const DEFAULT_OPTIONS = {
    includeScreenshots: false,
    ruleset: {}
}

class Job {

    #id;
    #submittedTime;
    #processingStartTime = null;
    #completedTime = null;
    #userEmail;
    #urls;
    #rulesetName;
    #rules;
    #options;

    constructor(id, userEmail, urls, rulesetName, options, rulesetOptions) {
        this.#id = id;
        this.#userEmail = userEmail.trim().toLowerCase();
        this.#urls = urls;
        this.#rulesetName = rulesetName;
        this.#rules = rulesetOptions;
        this.#options = _.defaultsDeep({}, options, DEFAULT_OPTIONS);
        this.#submittedTime = Date.now();
    }

    get id() {
        return this.#id;
    }

    get submittedTime() {
        return this.#submittedTime;
    }

    get processingStartTime() {
        return this.#processingStartTime;
    }

    get completedTime() {
        return this.#completedTime;
    }

    get userEmail() {
        return this.#userEmail;
    }

    get urls() {
        return this.#urls;
    }

    get rulesetName() {
        return this.#rulesetName;
    }

    get options() {
        return this.#options;
    }

    get rulesetOptions() {
        return this.#options.ruleset;
    }

    markProcessingStartTime() {
        if (this.#processingStartTime) {
            throw new Error('processStartTime already set');
        }
        this.#processingStartTime = Date.now();
    }

    markCompletedTime() {
        if (this.#completedTime) {
            throw new Error('completedTime already set');
        }
        this.#completedTime = Date.now();
    }

    toJSON() {
        return {
            id: this.#id,
            submittedTime: this.#submittedTime,
            processingStartTime: this.#processingStartTime,
            completedTime: this.#completedTime,
            userEmail: this.#userEmail,
            urls: this.#urls,
            rulesetName: this.rulesetName,
            rules: this.#rules,
            options: this.#options
        };
    }

    static create(userEmail, urls, rulesetName, options, rulesetOptions) {
        return new Job(crypto.randomUUID(), userEmail, urls, rulesetName, options, rulesetOptions);
    }

    static fromJSONStr(jsonStr) {
        let json = JSON.parse(jsonStr);
        return Job.fromJSON(json);
    }

    static fromJSON(jsonObj) {
        let job = new Job(jsonObj.id, jsonObj.userEmail, jsonObj.urls, jsonObj.rulesetName, jsonObj.rules, jsonObj.options);
        job.#submittedTime = jsonObj.submittedTime;
        job.#processingStartTime = jsonObj.processingStartTime;
        job.#completedTime = jsonObj.completedTime;
        return job;
    }

    static resetProcessingStartTime(job) {
        job.#processingStartTime = null;
    }

}

export { Job };