import { WebExtractor, ruleUtil as ruleUtils } from '@chcaa/web-extractor'

class WebExtractorExecutor {

    #maxConcurrency = 15;

    #rulesDir;
    #rules;

    constructor(rulesDir) {
        this.#rulesDir = rulesDir;
    }

    async init() {
        if (this.#maxConcurrency > 10 && process.getMaxListeners() < this.#maxConcurrency) {
            process.setMaxListeners(this.#maxConcurrency + 10); // prevent warning caused by puppeteer registering listeners for each instance
        }
        this.#rules = await ruleUtils.getRules(this.#rulesDir);
    }

    async execute(job, dataDestDir, progressListener) {
        await ruleUtils.initRules(this.#rules, { destDir: dataDestDir }); // TODO pass options in chosen from the ui here, see TODO.txt, options should be saved with the job...

        let options = {
            userAgent: undefined, // if undefined a default will be used
            output: {
                screenshot: job.options.includeScreenshots,
                logs: {
                    stackTrace: false // do not include stack traces as we don't know who will get the data
                }
            },
            maxConcurrency: this.#maxConcurrency,
            pageTimeoutMs: 90000
        };

        let webExtractor = new WebExtractor(job.urls, this.#rules, dataDestDir, options);
        if (progressListener) {
            webExtractor.addProgressionListener(progressListener);
        }

        await webExtractor.execute();
    }

}

export { WebExtractorExecutor };