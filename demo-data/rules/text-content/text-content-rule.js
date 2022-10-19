export default {
    init(options) {
        this.options = options;
    },
    extractorOptions() {
        return this.options;
    },
    extractor: {
        extract(template = {}, url, options) {
            const rulesetOptions = options.ruleset.options;
            function saveData(key, elements) {
                elements = [...elements]; // turn into an array of elements, so we can use array methods
                let result = {};
                if (rulesetOptions.extractScope.includes('text')) {
                    result.text = elements.map(element => element.textContent);
                }
                if (rulesetOptions.extractScope.includes('HTML')) {
                    result.HTML = elements.map(element => element.outerHTML);
                }
                template[key] = result;
            }
            if (rulesetOptions.extractParagraphs) {
                saveData('p', document.querySelectorAll('p'));
            }
            for (let x = 1; x <= 6; x++) {
                if (rulesetOptions[`extractH${x}`]) {
                    saveData(`h${x}`, document.querySelectorAll(`h${x}`));
                }
            }
            return template;
        }
    }
};