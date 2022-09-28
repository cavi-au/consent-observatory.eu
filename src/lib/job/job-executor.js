import fs from 'fs';
import fsPromises from 'fs/promises';
import { pipeline } from 'stream/promises';
import path from 'path';
import { EventEmitter } from 'events';
import archiver from 'archiver';
import _ from 'lodash';
import { Job } from './job.js';

const REMOVE_EXPIRED_JOBS_INTERVAL = 60 * 60 * 1000; // every hour

const defaultOptions = {
    completedExpirationTime: 7 * 24 * 60 * 60 * 1000, // 1 week
};

class JobExecutor {

    static jobStatus = Object.freeze({
       PENDING: 'pending',
       PROCESSING: 'processing',
       COMPLETED: 'completed'
    });

    #rootDir;
    #options;
    #pendingDir;
    #processingDir;
    #completedDir;
    #pendingJobs = [];
    #activeJob;
    #jobs = new Map();
    #eventEmitter = new EventEmitter();

    constructor(rootDir, options = {}) {
        if (! rootDir || rootDir.trim() === '') {
            throw new Error('rootDir cannot be empty'); // precaution so we don't accidentally start messing with the wrong dir
        }
        this.#rootDir = rootDir;
        this.#options = _.defaultsDeep({}, options, defaultOptions);
        this.#pendingDir = path.join(this.#rootDir, 'pending');
        this.#processingDir = path.join(this.#rootDir, 'processing');
        this.#completedDir = path.join(this.#rootDir, 'completed');
    }

    async init() {
        for (let dir of [this.#pendingDir, this.#processingDir, this.#completedDir]) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }

        for (let file of await fsPromises.readdir(this.#processingDir)) {
            if (this.#isJobFile(file)) {
                await fsPromises.rename(path.join(this.#processingDir, file), path.join(this.#pendingDir, file));
            }
        }

        await this.#clearProcessingDir();

        let pendingJobs = await this.#readJobsFromDir(this.#pendingDir);
        pendingJobs.sort((j1, j2) => j1.submitTime - j2.submitTime);
        for (let job of pendingJobs) {
            this.#addJobToQueue(job);
        }

        let completedJobs = await this.#readJobsFromDir(this.#completedDir);
        for (let job of completedJobs) {
            this.#jobs.set(job.id, { job, status: JobExecutor.jobStatus.COMPLETED });
        }

        setInterval(this.#removeExpiredJobs, REMOVE_EXPIRED_JOBS_INTERVAL);
    }

    getJobsByEmail(email) {
        // if we get many jobs, we could make a map from user to jobs, when registering the job, to speed up the process (remember to clean up on clean up in process).
        email = email.toLowerCase().trim();
        let jobs = [];
        for (let jobInfo of this.#jobs.values()) {
            if (jobInfo.job.userEmail === email) {
                jobs.push(jobInfo.job);
            }
        }
        return jobs;
    }

    getJobById(jobId) {
        return this.#jobs.get(jobId)?.job;
    }

    getJobStatus(job) {
        return this.#jobs.get(job.id)?.status;
    }

    /**
     *
     * @param {Job} job
     */
    async addJob(job) {
        await this.#writeJobToDir(job, this.#pendingDir);
        this.#addJobToQueue(job);
    }

    #addJobToQueue(job) {
        this.#pendingJobs.push(job);
        this.#jobs.set(job.id, { job, status: JobExecutor.jobStatus.PENDING });
        if (!this.#activeJob) {
            setImmediate(() => this.#pickAndExecuteNextJob());
        }
    }

    async #pickAndExecuteNextJob() {
        if (this.#activeJob || this.#pendingJobs.length === 0) {
            return;
        }

        let job = this.#pendingJobs.shift();

        let jobDataDirPath = path.join(this.#processingDir, `data-${job.id}`);
        let processingJobDataZipPath = this.#getJobDataZipFilePath(this.#processingDir, job);
        let completedJobDataZipPath = this.#getJobDataZipFilePath(this.#completedDir, job);
        let pendingJobPath = this.#getJobFilePath(this.#pendingDir, job);
        let processingJobPath = this.#getJobFilePath(this.#processingDir, job);
        let completedJobPath = this.#getJobFilePath(this.#completedDir, job);

        try {
            await fsPromises.rename(pendingJobPath, processingJobPath); // move to next dir, so it always only exists in one place
            job.markProcessingStartTime();
            await this.#writeJobToDir(job, this.#processingDir);
            await fsPromises.mkdir(jobDataDirPath);

            this.#activeJob = job;
            this.#jobs.get(this.#activeJob.id).status = JobExecutor.jobStatus.PROCESSING;
        } catch (e) {
            console.error(`Could not initiate job: "${job.id}" due to the following error`);
            console.error(e);
            try {
                await this.#clearProcessingDir();
            } catch (e) {
                console.error(e);
            }
            return;
        }

        try {
            // TODO run the scraper and write results to jobDataDirPath


        } catch (e) {
            console.error(e);
            try {
                await fsPromises.writeFile(path.join(jobDataDirPath, 'error.txt'), `An unexpected error occurred: ${e.message}`);
            } catch (e2) {
                console.error(e2);
            }
        } finally {
            try {
                await fsPromises.rename(processingJobPath, completedJobPath); // move to next dir, so it always only exists in one place
                job.markCompletedTime();
                await this.#writeJobToDir(job, this.#completedDir);
                await this.#writeDirToZipFile(jobDataDirPath, processingJobDataZipPath);
                await fsPromises.rename(processingJobDataZipPath, completedJobDataZipPath);
            } catch (e) {
                console.error(`Could not finalize job: "${job.id}" due to the following error`);
                console.error(e);
            }
            try {
                await this.#clearProcessingDir();
            } catch (e) {
                console.error(e);
            }

            this.#jobs.get(job.id).status = JobExecutor.jobStatus.COMPLETED;
        }

        this.#activeJob = undefined;
        setImmediate(() => this.#pickAndExecuteNextJob());

        this.#eventEmitter.emit('completed', { job });
    }

    onJobCompleted(listener) {
        this.#eventEmitter.on('completed', listener);
        // TODO have something hook up here, so a mail can be sent when a job completed
    }

    #getJobFilePath(destDir, job) {
        return path.join(destDir, `job-${job.id}.json`);
    }

    #getJobDataZipFilePath(destDir, job) {
        return path.join(destDir, `data-${job.id}.zip`);
    }

    #isJobFile(filename) {
        return filename.startsWith('job-') && filename.endsWith('json');
    }

    async #writeJobToDir(job, destDir) {
        let jsonStr = JSON.stringify(job.toJSON());
        let filePath = this.#getJobFilePath(destDir, job);
        await fsPromises.writeFile(filePath, jsonStr, 'utf-8');
    }

    async #clearProcessingDir() {
        await this.#clearDir(this.#processingDir);
    }

    async #clearDir(dirPath) {
        if (!dirPath || dirPath.trim() === '' || !path.isAbsolute(dirPath)) {
            throw new Error(`Cannot accept delete of path which is not specified or relative: "${dirPath}"`);
        }
        for (let file of await fsPromises.readdir(dirPath, { withFileTypes: true })) {
            let filePath = path.join(dirPath, file.name);
            if (file.isDirectory()) {
                await fsPromises.rm(filePath, { recursive: true });
            } else {
                await fsPromises.unlink(filePath);
            }
        }
    }

    async #readJobsFromDir(dirPath) {
        let jobs= [];
        for (let file of await fsPromises.readdir(dirPath)) {
            if (this.#isJobFile(file)) {
                let jsonStr = fsPromises.readFile(path.join(this.#pendingDir, file), 'utf-8');
                let job = Job.fromJSONStr(jsonStr);
                jobs.push(job);
            }
        }
        return jobs;
    }

    async #writeDirToZipFile(dirPath, destFilePath) {
        const output = fs.createWriteStream(destFilePath);
        const archive = archiver('zip', {
            zlib: { level: 6 } // Sets the compression level. (0-9)
        });

        archive.on('warning', (err) => { // these are not handled by the pipeline
           console.warn(err);
        });

        let pipelineComplete = pipeline(archive, output);
        archive.directory(dirPath, 'consent-observatory-result');
        archive.finalize();

        await pipelineComplete;
    }

    #removeExpiredJobs = async () => {
        for (let jobInfo of this.#jobs.values()) {
            if (jobInfo.status === JobExecutor.jobStatus.COMPLETED) {
                let expired = Date.now() - jobInfo.job.completedTime > this.#options.completedExpirationTime;
                if (expired) {
                    try {
                        this.#jobs.delete(jobInfo.job.id);
                        let jobFilePath = this.#getJobFilePath(this.#completedDir, jobInfo.job);
                        await fsPromises.unlink(jobFilePath);
                        let jobDataZipFilePath = this.#getJobDataZipFilePath(this.#completedDir, jobInfo.job);
                        await fsPromises.unlink(jobDataZipFilePath);
                    } catch (e) {
                        console.error(e);
                    }

                }
            }
        }
    }

}

async function test() {
    let jEx = new JobExecutor('D:\\temp\\consent-observatory.eu');
    await jEx.init();

    await jEx.addJob(Job.create('peter@vahlstrup.com', '[https://dr.dk]'));

}

//test();

export { JobExecutor };