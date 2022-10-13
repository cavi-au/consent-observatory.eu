import { ruleUtil as ruleUtils, WebExtractor } from "@chcaa/web-extractor";
import fs from "fs/promises";
import path from "path";
import { Ruleset } from "$lib/server/analysis/ruleset.js";

class RulesetRepository {

    #rulesDir;
    #rulesets;
    #rulesetByName = new Map();

    constructor(rulesDir) {
        this.#rulesDir = rulesDir;
    }

    async init() {
        let rulesets = await this.#loadRulesets(this.#rulesDir);
        if (rulesets.length === 0) {
            throw new Error('No rulesets defined. At least one ruleset mut be present.');
        }
        rulesets.sort(Ruleset.rulesetComparator);
        this.#rulesets = Object.freeze(rulesets);
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
                let rules = await ruleUtils.loadRules(dir);
                try {
                    let ruleSet = new Ruleset(uiJson.name, uiJson.description, rules, uiJson.sortKey, uiJson.options);
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

export { RulesetRepository };