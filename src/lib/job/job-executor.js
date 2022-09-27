import fs from 'fs';
import path from 'path';

class JobExecutor {

    static jobStatus = Object.freeze({
       PENDING: 'pending',
       PROCESSING: 'processing',
       COMPLETED: 'completed'
    });

    #rootDir;
    #pendingDir;
    #processingDir;
    #completedDir;
    #pendingJobs = [];
    #activeJob;
    #jobs = new Map();

    constructor(rootDir) {
        this.#rootDir = rootDir;
        this.#pendingDir = path.join(this.#rootDir, 'pending');
        this.#processingDir = path.join(this.#rootDir, 'processing');
        this.#completedDir = path.join(this.#rootDir, 'completed');
    }

    init() {
        for (let dir of [this.#pendingDir, this.#processingDir, this.#completedDir]) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }

        // TODO a lot of init
        // check if there is any job-file in processing-dir copy it bak to pending, and clear the processing dir
        // load all pendingJobs an sort by timestamp oldest first. Remember to set in jobs as well
        // load all completed jobs and just add them to jobs
        // setup timer for cleaning expired old completed jobs

        // only load .json files from the three dirs...
        //

    }

    /**
     *
     * @param {Job} job
     */
    async addJob(job) {

        let jsonStr = JSON.stringify(job.toJSON());

        // TODO write to disk the name of the file should be timestamp-uid.json

        this.#addJobToQueue(job);
    }

    #addJobToQueue(job) {
        this.#pendingJobs.push(job);
        this.#jobs.set(job.id, { job, status: JobExecutor.jobStatus.PENDING });
        setImmediate(() => this.#pickAndExecuteNextJob());
    }

    #pickAndExecuteNextJob() {
        if (this.#activeJob || this.#pendingJobs.length === 0) {
            return;
        }
        this.#activeJob = this.#pendingJobs.shift();
        this.#jobs.get(this.#activeJob.id).status = JobExecutor.jobStatus.PROCESSING;

        try {
            // run the scraper
            // write result
            // update state to completed, and remove job from processing dir
        } catch (e) {
            console.error(e);
            // TODO do we need any cleanup retry???
            // maybe just move to completed and them with info about the error instead of a result...
        }

        this.#activeJob = undefined;
        setImmediate(() => this.#pickAndExecuteNextJob());
        // notify listeners below using the eventEmitter
    }

    onJobCompleted(listener) {
        // todo have event emitter setup
        // notify listeners when a job has completed (after written everything to "completed"), so a mail can be sent
    }






}

export { JobExecutor };