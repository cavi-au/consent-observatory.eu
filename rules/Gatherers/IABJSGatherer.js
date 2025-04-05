/**
 * IABJSGatherer
 * 
 * Copyright (c) 2023 Rolf Bagge,
 * Copyright (c) 2024, 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label IAB JS Gatherer
 * @description Detects popups by probing for the IAB js framework
 */
/* exported from gatherer id 15 rev 8 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
export default class IABJSGatherer extends Gatherer {
    constructor() {
        super();

        this.result = {};
    }

    async onPageWait(scraper) {
        //Code run after page wait is done

        this.result = await scraper.page.evaluate(async ()=>{
            let tcfapiDetected = (window["__tcfapi"] != null);
            let pingResult = null;

            if(tcfapiDetected) {
                pingResult = await new Promise((resolve)=>{

                    let timeoutId = setTimeout(()=>{
                        resolve(null);
                    }, 2000);

                    window["__tcfapi"]("ping", 2, (pingResult)=>{
                        clearTimeout(timeoutId);
                        resolve(pingResult);
                    });
                });
            }
            //TODO: also include check for iFrames, which should have the name "__tcfapiLocator"
            //https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md

            return {
                tcfapiDetected,
                pingResult
            }
        });
    }

    getResult() {
        return this.result;
    }
}
