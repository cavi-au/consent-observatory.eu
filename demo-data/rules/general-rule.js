export default {
    init(options) {
        this.options = options;
    },
    extractorOptions() {
        return this.options;
    },
    extractor: {
        extract: (template = {}, url, options) => {
            const rulesetOptions = options.ruleset.options;
            if (rulesetOptions.extractHTML) {
                template.HTML = document.documentElement.outerHTML;
            }
            return template;
        }
    }
};