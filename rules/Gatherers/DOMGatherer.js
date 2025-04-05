/**
 * DOMGatherer
 * 
 * Copyright (c) 2023 Rolf Bagge,
 * Copyright (c) 2024, 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label DOM Gatherer
 * @description Stores a copy of the DOM
 */
/* exported from gatherer id 6 rev 3 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
export default class DOMGatherer extends Gatherer {
    constructor() {
        super();

        this.result = {};
    }

    async onPageWait(scraper) {
        this.result.dom = await scraper.page.evaluate(()=>{
            return document.querySelector("html").outerHTML;
        });
    }

    getResult() {
        return this.result;
    }
}
