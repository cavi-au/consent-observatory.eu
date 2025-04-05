/**
 * ButtonGatherer
 * 
 * Copyright (c) 2023 Rolf Bagge,
 * Copyright (c) 2024, 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label Button Gatherer
 * @description Tries to detect buttons by looking for HTML button elements
 */
/* exported from gatherer id 21 rev 20 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
import WordBoxGatherer from '../Gatherers/WordBoxGatherer.js';
export default class ButtonGatherer extends Gatherer {
    constructor() {
        super();
        this.wordbox = new WordBoxGatherer();        

        this.buttonSelector = "button, .btn, .btn-primary, [class*='__close-banner'], .close-banner, [class*='__btn'], [class*='__btn-primary'], input[type='button'], input[role='submit'], [role='button'], a";
    }

    async onPageWait(scraper) {
        let wordBoxStart = Date.now();
        await this.wordbox.onPageWait(scraper);
        console.log("WordBoxGatherer: ", (Date.now() - wordBoxStart)+"ms");

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
                if (scraper.prepareVisibilityAnalysis) await scraper.prepareVisibilityAnalysis(hit.element);
                let foundButtons = await hit.element.evaluate((hit, buttonSelector)=>{
                    return new Promise((resolve)=>{
                        try {
                            let allElements = hit.querySelectorAll(buttonSelector);
                            let intersectionObserver = new IntersectionObserver(async (entries)=>{
                                try {
                                    intersectionObserver.disconnect();

                                    resolve((await Promise.all(entries.filter((entry)=>{
                                        if(!entry.isIntersecting) {
                                            return false;
                                        }

                                        if (entry.target.querySelector(buttonSelector)){
                                            // Buttons cannot contain buttons
                                            return false;
                                        }

                                        if(entry.target.matches("a")) {
                                            //if href is # or javascript: or missing, allow as button
                                            let href = entry.target.getAttribute("href");
                                            if(href == null || href.startsWith("javascript:") || href === "#") {
                                                return true;
                                            }

                                            //Else disallow
                                            return false;
                                        }

                                        return true;
                                    }).map(async (entry)=>{
                                        let text = "";

                                        if(entry.target.matches("input")) {
                                            text = entry.target.value;
                                        } else {
                                            text = entry.target.innerText;

                                            let before = getComputedStyle(entry.target, ":before");
                                            let after = getComputedStyle(entry.target, ":after");
    
                                            let beforeText = before.getPropertyValue("content");
                                            let afterText = after.getPropertyValue("content");
    
                                            if(beforeText !== "none") {
                                                if(!beforeText.startsWith("url(")) {
                                                    beforeText = beforeText.substring(1, beforeText.length-1);
                                                    text = beforeText + text;
                                                }
                                            }
    
                                            if(afterText !== "none") {
                                                if(!afterText.startsWith("url(")) {
                                                    afterText = afterText.substring(1, afterText.length-1);
                                                    text = text + afterText;
                                                }
                                            }
                                        }

                                        let r = {text: text.trim(), html: entry.target.outerHTML}; 
                                        try {
                                            await visibilityAnalysis(entry.target, r);
                                        } catch (e){
                                            // Ignore
                                            console.log(""+e)
                                        }
                                        return r;
                                    }))).filter((obj)=>{
                                        return obj.text.trim().length > 0;
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
                }, this.buttonSelector);

                this.results.push(...foundButtons);

            } catch(e) {
                console.error("Error in ButtonGatherer:", e);
            }
        }

    }

    getResult() {
        return {"detections": this.results.length, "detectionsArray": this.results};
    }
}
