/**
 * CheckboxGatherer
 * 
 * Copyright (c) 2023 Rolf Bagge,
 * Copyright (c) 2024, 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label Checkbox Gatherer
 * @description Gathers only HTML inputs with type checkbox
 */
/* exported from gatherer id 25 rev 15 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
import WordBoxGatherer from '../Gatherers/WordBoxGatherer.js';
export default class CheckboxGatherer extends Gatherer {
    constructor() {
        super();
        this.wordbox = new WordBoxGatherer();        
    }

    async onPageWait(scraper) {
        await this.wordbox.onPageWait(scraper);

        // Debug
        if(false) {
            scraper.page.on('console', async (msg) => {
            const msgArgs = msg.args();
            for (let i = 0; i < msgArgs.length; ++i) {
                console.log(await msgArgs[i].jsonValue());
            }
            });
        }

        this.results = [];
        for (let hit of this.wordbox.hits){
            try {
                let foundCheckboxes = await hit.element.evaluate((hit)=>{
                    return new Promise((resolve)=>{
                        try {
                            let allElements = hit.querySelectorAll("input[type='checkbox'], [role='checkbox']");
                            let intersectionObserver = new IntersectionObserver((entries)=>{
                                try {
                                    intersectionObserver.disconnect();
                                    resolve(entries.filter((entry)=>{return entry.isIntersecting}).map((entry)=>{
                                        return {
                                            status: entry.target.checked,
                                            disabled: entry.target.disabled,
                                            html: entry.target.outerHTML
                                        }
                                    }));
                                } catch(e) {
                                    console.log("Error2:", e);
                                }
                            });

                            if(allElements.length > 0) {
                                allElements.forEach((elm)=>{
                                    intersectionObserver.observe(elm);
                                });
                            } else {
                                resolve([]);
                            }
                        } catch(e) {
                            console.log("Error:", e);
                        }
                    });
                });

                this.results.push(...foundCheckboxes);

            } catch(e) {
                console.error("Error in CheckboxGatherer:", e);
            }
        }
    }

    getResult() {
        return {"detections": this.results.length, "detectionsArray": this.results};
    }
}
