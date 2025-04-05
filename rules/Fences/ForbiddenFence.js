/**
 * ButtonGatherer
 * 
 * Copyright (c) 2023 Rolf Bagge,
 * Copyright (c) 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label Forbidden
 * @description Detects if the server replied with a 403 forbidden page
 */
/* exported from gatherer id 22 rev 4 on Sun, 30 Mar 2025 12:19:39 +0200 */
import FenceGatherer from '../Fences/FenceGatherer.js';
export default class ForbiddenFenceGatherer extends FenceGatherer {
    constructor() {
        super(null, "ForbiddenAccess");
    }

    async shouldFence(scraper) {
        let title = await scraper.page.$eval("head title", (node)=>{
            return node.innerText;
        });
        return title.trim() === "403 Forbidden";
    }
}