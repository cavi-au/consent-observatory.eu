/**
 * LateRestylingGatherer
 * 
 * Copyright (c) 2023 Rolf Bagge,
 * Copyright (c) 2024, 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label Late Restyling Gatherer
 * @description Attempts to detect changes to the page style that happened shortly after page load
 */
/* exported from gatherer id 5 rev 3 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
export default class LateRestylingGatherer extends Gatherer {
    constructor() {
        super();

        this.result = {};
    }

    async fetchComputedStyles(scraper, querySelector) {
        return await scraper.page.evaluate((querySelector)=>{
            let e = document.querySelector(querySelector);

            let styles = window.getComputedStyle(e);

            let result = {};

            Object.keys(styles).forEach((key)=>{
                if(isNaN(parseInt(key))) {
                    //Real key, not array entry
                    result[key] = styles[key];
                }
            });

            return result;
        }, querySelector);        
    }

    async onDomContentLoaded(scraper) {
        this.result.onDomContentLoaded = {
            "body": await this.fetchComputedStyles(scraper, "body"),
            "html": await this.fetchComputedStyles(scraper, "html")
        }
    }

    async onPageWait(scraper) {
        this.result.onPageWait = {
            "body": await this.fetchComputedStyles(scraper, "body"),
            "html": await this.fetchComputedStyles(scraper, "html")
        }
    }

    getResult() {
        const self = this;

        function doDiff(oldData, newData) {
            let diff = {};

            Object.keys(oldData).forEach((key)=>{
                let oldValue = oldData[key];
                let newValue = newData[key];
    
                if(oldValue === newValue) {
                    //No change, skip
                    return;
                }
    
                if(newValue == null) {
                    //Style was deleted, it was only in old
                    diff[key] = {"type": "deleted", "value": oldValue};
                    return;
                }
    
                if(oldValue !== newValue) {
                    //Style was changed
                    diff[key] = {"type": "change", "oldValue": oldValue, "value": newValue};
                }
            });
            Object.keys(oldData).forEach((key)=>{
                let oldValue = oldData[key];
                let newValue = newData[key];

                if(oldValue == null) {
                    //New style not in old
                    diff[key] = {"type": "new", "value": newValue};
                }
            });

            return diff;
        }

        let result = {};

        Object.keys(this.result.onDomContentLoaded).forEach((key)=>{
            let oldData = self.result.onDomContentLoaded[key];
            let newData = self.result.onPageWait[key];

            result[key] = doDiff(oldData, newData);
        });

        return result;
    }
}
