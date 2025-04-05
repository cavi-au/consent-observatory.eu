import Gatherer from "../Gatherers/Gatherer.js";

export default class FenceGatherer extends Gatherer {
    constructor(fenceSelector, fenceName) {
        super();

        this.fenceSelector = fenceSelector;
        this.fenceName = fenceName;

        this.result = {
            fenceName: this.fenceName,
            detected: false,
            fenced: false
        };
    }

    async shouldFence(scraper) {
        return (await scraper.page.$(this.fenceSelector)) != null;
    }

    async checkForFence(scraper) {
        if (await this.shouldFence(scraper)) {
            this.result.detected = true;
            return true;
        }

    return false;
    }

    async onPageFence(scraper) {
        const self = this;

        console.log("Checking if fenced by:", this.fenceName);

        let blockPromise = new Promise((resolve) => {
            self.blockPromiseResolve = resolve;
        });

    let intervalId = setInterval(async () => {
            try {
                let cloudflare = await self.checkForFence(scraper);

                if (!cloudflare) {
                    //We are no longer fenced
                    self.blockPromiseResolve(false);
                }
            } catch (e) {
                //Ignore
            }
    }, 250);

        let timeoutId = setTimeout(() => {
            self.blockPromiseResolve(true);
        }, 10000);

        //Block until we are sure we are not fenced, or timeout
        try {
            this.result.fenced = await blockPromise;

            console.log(this.result.fenced);

            clearInterval(intervalId);
            clearTimeout(timeoutId);
        } catch (e) {
            console.error(e);
            this.result.fenced = false;
        }
    }

    isFenceBlocking() {
        return this.result.fenced;
    }

    getResult() {
        return this.result;
    }
}


