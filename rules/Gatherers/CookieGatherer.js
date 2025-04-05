/**
 * CookieGatherer
 * 
 * Copyright (c) 2023 Rolf Bagge,
 * Copyright (c) 2024, 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label Cookie Gatherer
 * @description Reports any cookies set on the page after load
 */
/* exported from gatherer id 7 rev 5 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
export default class CookieGatherer extends Gatherer {
    constructor() {
        super();

        this.result = {};
    }

    async onPageWait(scraper) {
        let chromeDevClient = await scraper.page.target().createCDPSession();
        this.result.cookies = (await chromeDevClient.send("Network.getAllCookies")).cookies;
    }

    getResult() {
        return this.result;
    }
}
