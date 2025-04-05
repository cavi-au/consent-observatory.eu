/**
 * ScreenshotGatherer
 * 
 * Copyright (c) 2023 Rolf Bagge,
 * Copyright (c) 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label Screenshot Gatherer
 * @description Takes two screenshots of the page
 */
/* exported from gatherer id 3 rev 3 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
export default class ScreenshotGatherer extends Gatherer {
    constructor() {
        super();

        this.result = {};
    }

    async doScreenshot(scraper) {
        return await scraper.page.screenshot({
            encoding: "base64"
        });
    }

    async onDomContentLoaded(scraper) {
        this.result.onDomContentLoaded = await this.doScreenshot(scraper);
    }

    async onPageWait(scraper) {
        this.result.onPageWait = await this.doScreenshot(scraper);
    }

    getResult() {
        return this.result;
    }
}
