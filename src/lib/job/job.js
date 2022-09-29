import * as crypto from "crypto";
import _ from 'lodash';

const DEFAULT_OPTIONS = {
    includeScreenshots: false
}

class Job {

    #id;
    #submitTime;
    #processingStartTime = null;
    #completedTime = null;
    #userEmail;
    #urls;
    #options;

    constructor(id, userEmail, urls, options) {
        this.#id = id;
        this.#userEmail = userEmail.trim().toLowerCase();
        this.#urls = urls;
        this.#options = _.defaultsDeep({}, options, DEFAULT_OPTIONS);
        this.#submitTime = Date.now();
    }

    get id() {
        return this.#id;
    }

    get submitTime() {
        return this.#submitTime;
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

    get options() {
        return this.#options;
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
            submitTime: this.#submitTime,
            processingStartTime: this.#processingStartTime,
            completedTime: this.#completedTime,
            userEmail: this.#userEmail,
            urls: this.#urls,
            options: this.#options
        };
    }

    static create(userEmail, urls, options) {
        return new Job(crypto.randomUUID(), userEmail, urls, options);
    }

    static fromJSONStr(jsonStr) {
        let json = JSON.parse(jsonStr);
        return Job.fromJSON(json);
    }

    static fromJSON(jsonObj) {
        let job = new Job(jsonObj.id, jsonObj.userEmail, jsonObj.urls, jsonObj.options);
        job.#submitTime = jsonObj.submitTime;
        job.#processingStartTime = jsonObj.processingStartTime;
        job.#completedTime = jsonObj.completedTime;
        return job;
    }

    static resetProcessingStartTime(job) {
        job.#processingStartTime = null;
    }

}

export { Job };