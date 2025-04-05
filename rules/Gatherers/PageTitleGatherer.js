/**
 * PageTitleGatherer
 * 
 * Copyright (c) 2023 Rolf Bagge,
 * Copyright (c) 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label Page Title Gatherer
 * @description Finds the page title from the HEAD of the page and stores it
 */
/* exported from gatherer id 1 rev 3 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
export default class PageTitleGatherer extends Gatherer {
    constructor() {
        super();

        this.result = {};
    }

    async onPageWait(scraper) {
        this.result.title = await scraper.page.evaluate(()=>{
            return document.querySelector("title").textContent;
        });
    }

    getResult() {
        return this.result;
    }
}
