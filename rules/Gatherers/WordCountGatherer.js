/**
 * WordCountGatherer
 * 
 * Copyright (c) 2023 Rolf Bagge, Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label Word Count Gatherer
 * @description Simply counts the number of times the words 'cookie' or 'cookies' appears
 */
/* exported from gatherer id 2 rev 3 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
export default class WordCountGatherer extends Gatherer {
    constructor(words = ["cookies", "cookie[^s]"]) {
        super();
        this.result = {};
        this.words = words;

        if(!Array.isArray(this.words)) {
            this.words = [this.words];
        }
    }

    async onPageWait(scraper) {
        for(let word of this.words) {
            let bodyText = await scraper.page.evaluate(()=>{
                let clonedHtml = document.querySelector("html").cloneNode(true);

                clonedHtml.querySelectorAll("script, style").forEach((elm)=>{
                    elm.remove();
                });

                return clonedHtml.textContent.toLowerCase();
            });

            let matches = bodyText.match(new RegExp(word, "g"));

            this.result[word] = matches!=null?matches.length:0;
        }
    }

    getResult() {
        return this.result
    }
}
