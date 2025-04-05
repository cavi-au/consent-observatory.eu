/**
 * EventListenerGatherer
 * 
 * Copyright (c) 2023 Rolf Bagge,
 * Copyright (c) 2024, 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label Event Listener Gatherer
 * @description Finds buttons based on event listeners
 */
/* exported from gatherer id 20 rev 21 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
import WordBoxGatherer from '../Gatherers/WordBoxGatherer.js';
export default class EventListenerGatherer extends Gatherer {
    constructor() {
        super();
        this.wordbox = new WordBoxGatherer();

        this.result = {};
    }

    async onBeforeLoad(scraper) {
        await this.wordbox.onBeforeLoad(scraper);
        return null;
    }

    async onDomContentLoaded(scraper) {
        await this.wordbox.onDomContentLoaded(scraper);
        return null;
    }

    async getEventListeners(js_obj) {
        let source = null;
        let target = null;
        if (js_obj.remoteObject) source = js_obj.remoteObject();
        if (js_obj._remoteObject) source = js_obj._remoteObject;
        if (js_obj.client) target = js_obj.client;
        if (js_obj._client) target = js_obj._client;

        let object_id = source.objectId;
        let resp = await target.send('DOMDebugger.getEventListeners', {objectId: object_id})
        return resp
    }


    async onPageWait(scraper) {
        // Debug
        if(false) {
            scraper.page.on('console', async (msg) => {
            const msgArgs = msg.args();
            for (let i = 0; i < msgArgs.length; ++i) {
                console.log(await msgArgs[i].jsonValue());
            }
            });
        }

        let wordBoxStart = Date.now();
        await this.wordbox.onPageWait(scraper);
        console.log("WordBoxGatherer: ", (Date.now() - wordBoxStart)+"ms, "+this.wordbox.hits.length+" hits");

        let detections = [];

        let start = Date.now();

        for (let hit of this.wordbox.hits){
            if (scraper.prepareVisibilityAnalysis) await scraper.prepareVisibilityAnalysis(hit.element);
            let visibleElementsHandle = await hit.element.evaluateHandle((hit)=>{
                return new Promise((resolve)=>{
                    let allElements = hit.querySelectorAll("*");
                    let intersectionObserver = new IntersectionObserver((entries)=>{
                        let visibleEntries = entries.filter((entry)=>{
                            if(entry.isIntersecting) {
                                let ariaTab = entry.target.matches("[role='tab']") || entry.target.querySelector("[role='tab']");

                                return !ariaTab;
                            }

                            return false;
                        });
                        
                        intersectionObserver.disconnect();

                        resolve(visibleEntries.map((entry)=>{
                            return entry.target;
                        }));
                    });

                    if (allElements.length==0){
                        resolve([]);
                    } else {
                        allElements.forEach((elm)=>{
                            intersectionObserver.observe(elm);
                        });
                    }
                });
            });

            let visibleElementsProperties = await visibleElementsHandle.getProperties();

            for(let visibleElementProperty of visibleElementsProperties.values()) {
                let element = visibleElementProperty.asElement();
                let eventListenersObj = await this.getEventListeners(element);
                let eventListeners = eventListenersObj.listeners;
                for (let listener of eventListeners){
                    if (listener.type === "click"){
                        let text = (await (await element.getProperty('innerText')).jsonValue());
                        if (text!=undefined){
                            text = text.trim();
                        } else {
                            text = "";
                        }
                        if (text.length==0){
                            // Try value for inputs
                            text = await element.evaluate((el)=>{return el.getAttribute("value")}, element);
                        }
                        if (text) {
                            text = text.trim();
                        } else {
                            continue;
                        }
                        if (text.split(" ").length < 10 && text.length>0){
                            let html = await (await element.getProperty('outerHTML')).jsonValue();
                            let upperCased = text.charAt(0).toUpperCase()==text.charAt(0);
                            let r = {text:text,html:html,confidence:upperCased?1:0.5};
                            if (scraper.prepareVisibilityAnalysis) {
                                let data = await element.evaluate(async (el)=>{return await visibilityAnalysis(el, {})});
                                Object.assign(r, data);
                            } 
                            detections.push(r);
                        }
                    }
                }
            }
        }

        this.result.detections = detections.length;
        this.result.detectionsArray = detections;

        console.log("EventListenerGatherer:", (Date.now()-start)+"ms");

        return null;
    }

    getResult() {
        return this.result;
    }
}
