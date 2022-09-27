class Job {

    #submitTime;
    #processStartTime = null;
    #completedTime = null;
    #id;
    #userEmail;
    #urls;

    constructor(id, userEmail, urls) {
        this.#id = id;
        this.#userEmail = userEmail;
        this.#urls = urls;
        this.#submitTime = Date.now();
    }

    get submitTime() {
        return this.#submitTime;
    }

    get processStartTime() {
        return this.#processStartTime;
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

    toJSON() {
        return {
            submitTime: this.#submitTime,
            processStartTime: this.#processStartTime,
            completedTime: this.#completedTime,
            userEmail: this.#userEmail,
            urls: this.#urls
        };
    }

    static create(userEmail, urls) {
        return new Job(crypto.randomUUID(), userEmail, urls);
    }

    static fromJSON(jsonStr) {
        let json = JSON.parse(jsonStr);
        let job = new Job(json.userEmail, json.urls);
        job.#submitTime = json.submitTime;
        job.#processStartTime = json.processStartTime;
        job.#completedTime = json.completedTime;
        return job;
    }

}