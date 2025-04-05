/**
 * Consent Observatory wrapper for Scrape-O-Matic Data Gatherers
 * Copyright (c) 2024,2025 Janus Kristensen, CAVI, Aarhus University
 * 
 * This rule emulates evens required for running Scrape-O-Matic
 * data gatherers as best as possible (not everything is possible):
 * 
 * Current Limitations: 
 * - NormalizedWorbButtonGatherer: Needs js-levenshtein
 * - NetworkGatherer: cannot list network ressources before page load
 * - onPageLoad, onPageFence and onDomContentLoaded are the same event
 * - ShadowDOM and setTimeout hacks are unsupported
 * 
 */

import PageTitleGatherer from './Gatherers/PageTitleGatherer.js';
import WordCountGatherer from './Gatherers/WordCountGatherer.js';
import ScreenshotGatherer from './Gatherers/ScreenshotGatherer.js';
import NetworkGatherer from './Gatherers/NetworkGatherer.js';
import LateRestylingGatherer from './Gatherers/LateRestylingGatherer.js';
import DOMGatherer from './Gatherers/DOMGatherer.js';
import CookieGatherer from './Gatherers/CookieGatherer.js';
import ContentBlockageGatherer from './Gatherers/ContentBlockageGatherer.js';
import WordBoxGatherer from './Gatherers/WordBoxGatherer.js';
import ConsentOMaticGatherer from './Gatherers/ConsentOMaticGatherer.js';
import IABJSGatherer from './Gatherers/IABJSGatherer.js';
import CloudflareFence from './Fences/CloudflareFence.js';
import CaptchaDeliveryFence from './Fences/CaptchaDeliveryFence.js';
import EventListenerGatherer from './Gatherers/EventListenerGatherer.js';
import ButtonGatherer from './Gatherers/ButtonGatherer.js';
import ForbiddenFence from './Fences/ForbiddenFence.js';
import NormalizedWordButtonGatherer from './Gatherers/NormalizedWordButtonGatherer.js';
import VisibilityAnalyzer from './Analyzers/VisibilityAnalyzer.js';
import CheckboxGatherer from './Gatherers/CheckboxGatherer.js';
import InspectorAnalyzer from './Analyzers/InspectorAnalyzer.js';
import CMPGatherer from './Gatherers/CMPGatherer.js';


export default {
        init(options) {
                this.options = options;
                this.scraper = {};
                this.gatherers = [];
                console.log(this.options);

                try {
                        console.log("Scrape-O-Matic Gatherer init starting...");
                        this.gatherers.push(new PageTitleGatherer());
this.gatherers.push(new WordCountGatherer());
this.gatherers.push(new ScreenshotGatherer());
this.gatherers.push(new NetworkGatherer());
this.gatherers.push(new LateRestylingGatherer());
this.gatherers.push(new DOMGatherer());
this.gatherers.push(new CookieGatherer());
this.gatherers.push(new ContentBlockageGatherer());
this.gatherers.push(new WordBoxGatherer());
this.gatherers.push(new ConsentOMaticGatherer());
this.gatherers.push(new IABJSGatherer());
this.gatherers.push(new CloudflareFence());
this.gatherers.push(new CaptchaDeliveryFence());
this.gatherers.push(new EventListenerGatherer());
this.gatherers.push(new ButtonGatherer());
this.gatherers.push(new ForbiddenFence());
this.gatherers.push(new NormalizedWordButtonGatherer());
this.gatherers.push(new VisibilityAnalyzer());
this.gatherers.push(new CheckboxGatherer());
this.gatherers.push(new InspectorAnalyzer());
this.gatherers.push(new CMPGatherer());

                        console.log("Scrape-O-Matic Gatherer init complete");
                } catch (ex) {
                        console.log(ex);
                        throw ex;
                }
        },
    extractorOptions() {
                return this.options;
        },
    getEnabledGatherers() {
                let self = this;
                return this.gatherers.filter(gatherer => {
                        return self.options.ruleset.options[gatherer.constructor.name] == true;
                });
        },
    async runAll(callbackName) {
                for (let gatherer of this.getEnabledGatherers()) {
                        try {
                                await gatherer[callbackName](this.scraper);
                        } catch (ex) {
                                console.log(ex);
                        }
                };
        },
    get extractor() {
                let self = this;
                return [{
                        extractPuppeteer: async function (page, template, url, options) {
                                // Setup scraper and debugging
                                let skipMoveLikeIdiot = options.ruleset.options.skipMoveLikeIdiot;
                                let skipWaiting = options.ruleset.options.skipWaiting;
                                self.scraper.page = page;
                                page.on('console', msg => console.log('PAGE LOG:', msg.text()));
                                let result = {};
                                await self.runAll("onBeforeLoad");

                                //Check fences
                                let fenced = false;
                                await self.runAll("onPageFence");
                                for (let fence of self.getEnabledGatherers()) {
                                        if (fence.isFenceBlocking()) {
                                                fenced = true;
                                                result[gatherer.constructor.name] = fence.getResult();
                                        }
                                }
                                if (fenced) return result;

                                // Emulate initial callbacks
                                await self.runAll("onDomContentLoaded");

                                // Perform intermediary steps
                                if (!skipMoveLikeIdiot) {
                                        console.log("Moving about like an idiot!");
                                        await self.scraper.page.mouse.move(0, 0, { "steps": 10 });
                                        await self.scraper.page.mouse.move(200, 200, { "steps": 10 });
                                }
                                if (!skipWaiting) {
                                        console.log("Waiting for a while...");
                                        await new Promise(resolve => setTimeout(resolve, 10000));
                                }

                                // Run final callbacks
                                await self.runAll("onPageWait");
                                for (let gatherer of self.getEnabledGatherers()) {
                                        result[gatherer.constructor.name] = gatherer.getResult();
                                }
                                return result;
                        }
                }];
        },
    set extractor(t) {
                throw Error("Framework error, trying to set extractor on GathererWrapper which is read only");
        }
};





