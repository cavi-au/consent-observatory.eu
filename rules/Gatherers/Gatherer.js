export default class Gatherer {
    constructor() {
        this.exceptions = [];
    }

    async onBeforeLoad(scraper) {
        return null;
    }

    async onPageFence(scraper) {
        return null;
    }

    async onDomContentLoaded(scraper) {
        return null;
    }
    
    async onPageWait(scraper) {
        return null;
    }

    isFenceBlocking() {
        return false;
    }

    getResult() {
        return null;
    }

    getExceptions() {
        return this.exceptions;
    }
}



