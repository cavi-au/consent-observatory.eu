/**
 * InspectorAnalyzer
 * 
 * Copyright (c) 2024, 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label Inspector Analyzer
 * @description Allows analysis of an element using tools from outside the page
 */
/* exported from gatherer id 28 rev 11 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
export default class InspectorAnalyzer extends Gatherer {
    constructor() {
        super();
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

    async getClickListeners(js_obj) {
        let resp = (await this.getEventListeners(js_obj)).listeners;
        return resp.filter(l=>{return l.type==="click"});
    }

    async onBeforeLoad(scraper) {
        scraper.doInspectorAnalysis = async (jsObjectLink, metadataObject)=>{
            let analysis = {
                clickListeners: {}
            }

            // Direct click listeners
            let listeners = await this.getClickListeners(jsObjectLink);
            analysis.clickListeners.direct = listeners.length

            // Recurse all children
            let counter = 0;
            let children = await jsObjectLink.$$("*");
            for (let childLink of children){
                counter += (await this.getClickListeners(childLink)).length;
            }
            analysis.clickListeners.children = counter;

            // Traverse parent tree
            counter = 0;
            let pageCounter = 0;
            let parentElementLink = jsObjectLink;
            while ((parentElementLink = await parentElementLink.getProperty("parentNode")).constructor.name === "ElementHandle"){
                let nodeName = await parentElementLink.evaluate(el=>el.nodeName.toLowerCase());
                let clickCount = (await this.getClickListeners(parentElementLink)).length;
                if (["#document", "body"].includes(nodeName)){
                    pageCounter += clickCount;
                } else {
                    counter += clickCount;
                }
            }
            analysis.clickListeners.ancestors = counter;
            analysis.clickListeners.page = pageCounter;

            // Check page elements
            let pageElementLinks = 

            // Add info from ElementHandle
            //analysis.isHidden = jsObjectLink.isHidden;
            //analysis.isFullyIntersectingViewport = await jsObjectLink.isFullyIntersectingViewport(jsObjectLink, {threshold:1});

            metadataObject.inspectorAnalysis = analysis;
            return analysis;
        };
    }
}
