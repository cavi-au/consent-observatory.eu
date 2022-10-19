import fs from 'fs/promises';
import path from 'path';
import { WebExtractor, ruleUtil as ruleUtils } from '@chcaa/web-extractor';
import { Ruleset } from "$lib/server/analysis/ruleset.js";

class WebExtractorExecutor {

    #maxConcurrency = 15;

    #rulesetRepository;
    #rulesetByName = new Map();

    constructor(rulesetRepository) {
        this.#rulesetRepository = rulesetRepository;
    }

    async init() {
        if (this.#maxConcurrency > 10 && process.getMaxListeners() < this.#maxConcurrency) {
            process.setMaxListeners(this.#maxConcurrency + 10); // prevent warning caused by puppeteer registering listeners for each instance
        }
    }

    async execute(job, dataDestDir, progressListener) {
        let ruleset = this.#rulesetRepository.getRulesetByName(job.rulesetName);
        if (!ruleset) {
            throw new Error(`Ruleset with name: "${job.rulesetName}" does not exist`);
        }
        let ruleInitOptions = { destDir: dataDestDir, ruleset: { name: job.rulesetName, options: job.rulesetOptions } };

        let options = {
            userAgent: undefined, // if undefined a default will be used
            output: {
                screenshot: job.options.includeScreenshots,
                logs: {
                    stackTrace: false // do not include stack traces as we don't know who will get the data
                }
            },
            ruleInitOptions,
            maxConcurrency: this.#maxConcurrency,
            pageTimeoutMs: 90000
        };

        let webExtractor = new WebExtractor(job.urls, ruleset.rules, dataDestDir, options);
        if (progressListener) {
            webExtractor.addProgressionListener(progressListener);
        }

        await webExtractor.execute();
    }

}

export { WebExtractorExecutor };