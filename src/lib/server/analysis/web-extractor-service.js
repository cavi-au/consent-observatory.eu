import fs from 'fs/promises';
import path from 'path';
import { WebExtractor, ruleUtil as ruleUtils } from '@chcaa/web-extractor';
import { Ruleset } from "$lib/server/analysis/ruleset.js";

class WebExtractorService {

    #maxConcurrency = 15;

    #rulesDir;
    #rulesets;
    #rulesetByName = new Map();

    constructor(rulesDir) {
        this.#rulesDir = rulesDir;
    }

    async init() {
        if (this.#maxConcurrency > 10 && process.getMaxListeners() < this.#maxConcurrency) {
            process.setMaxListeners(this.#maxConcurrency + 10); // prevent warning caused by puppeteer registering listeners for each instance
        }
        this.#rulesets = await this.#loadRulesets(this.#rulesDir);
        if (this.#rulesets.length === 0) {
            throw new Error('No rulesets defined. At least one ruleset mut be present.');
        }
        for (let ruleset of this.#rulesets) {
            if (this.#rulesetByName.has(ruleset.name)) {
                throw new Error(`Another ruleset is already called: "${ruleset.name}". The name must be unique.`);
            }
            this.#rulesetByName.set(ruleset.name, ruleset);
        }
    }

    get rulesets() {
        return this.#rulesets;
    }

    getRulesetByName(name) {
        return this.#rulesetByName.get(name);
    }

    async execute(job, dataDestDir, progressListener) {
        let ruleset = this.getRulesetByName(job.rulesetName);
        let rulesetOptions = job.rulesetOptions;
        await ruleUtils.initRules(ruleset.rules, { destDir: dataDestDir, rulesetOptions });

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

        let webExtractor = new WebExtractor(job.urls, ruleset.rules, dataDestDir, options);
        if (progressListener) {
            webExtractor.addProgressionListener(progressListener);
        }

        await webExtractor.execute();
    }

    async #loadRulesets(dir) {
        let rulesets = [];
        let files = await fs.readdir(dir, { withFileTypes: true });
        for (let file of files) {
            if (file.isDirectory()) {
                rulesets.push(... await this.#loadRulesets(path.join(dir, file.name)));
            } else if (file.name === '__ui.json') {
                let uiFilePath = path.join(dir, file.name);
                let uiFileContent = await fs.readFile(uiFilePath, 'utf-8');
                let uiJson = JSON.parse(uiFileContent);
                let rules = await ruleUtils.getRules(dir);
                try {
                    let ruleSet = new Ruleset(uiJson.name, uiJson.description, rules, uiJson.options);
                    rulesets.push(ruleSet);
                } catch (e) {
                    e.message = `Error while loading: "${uiFilePath}". ` + e.message;
                    throw e;
                }
            }
        }
        return rulesets;
    }

}

export { WebExtractorService };