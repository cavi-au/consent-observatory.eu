/**
 * NetworkGatherer
 * 
 * Copyright (c) 2023 Rolf Bagge,
 * Copyright (c) 2024, 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label Network Gatherer
 * @description Reports any network ressources downloaded after page load
 */
/* exported from gatherer id 4 rev 3 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
export default class NetworkGatherer extends Gatherer {
    constructor() {
        super();

        this.networkResources = [];
    }

    async onBeforeLoad(scraper) {
        scraper.page.on("response", (response)=>{
            let timing = response.timing();

            if(timing != null) {
                Object.keys(timing).forEach((key)=>{
                    if(timing[key] === -1) {
                        delete timing[key];
                    }
                });
            }

            let networkResource = {
                url: response.url(),
                status: response.status(),
                statusText: response.statusText(),
                timing: timing,
                headers: response.headers(),
                receivedTimestamp: Date.now()
            };
            this.networkResources.push(networkResource)
        });
    }

    getResult() {
        return {
            networkResources: this.networkResources
        };
    }
}
