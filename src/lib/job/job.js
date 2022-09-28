import * as crypto from "crypto";

class Job {

    #id;
    #submitTime;
    #processingStartTime = null;
    #completedTime = null;
    #userEmail;
    #urls;

    constructor(id, userEmail, urls) {
        this.#id = id;
        this.#userEmail = userEmail.trim().toLowerCase();
        this.#urls = urls;
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
            submitTime: this.#submitTime,
            processStartTime: this.#processingStartTime,
            completedTime: this.#completedTime,
            userEmail: this.#userEmail,
            urls: this.#urls
        };
    }

    static create(userEmail, urls) {
        return new Job(crypto.randomUUID(), userEmail, urls);
    }

    static fromJSONStr(jsonStr) {
        let json = JSON.parse(jsonStr);
        return Job.fromJSON(json);
    }

    static fromJSON(jsonObj) {
        let job = new Job(jsonObj.id, jsonObj.userEmail, jsonObj.urls);
        job.#submitTime = jsonObj.submitTime;
        job.#processingStartTime = jsonObj.processingStartTime;
        job.#completedTime = jsonObj.completedTime;
        return job;
    }

}

export { Job };