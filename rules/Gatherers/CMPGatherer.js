/**
 * CMPGatherer
 * 
 * Copyright (c) 2025 Midas Nouwens
 * CAVI, Aarhus University
 * 
 * @label CMP Gatherer
 * @description Tries to identify the name of the CMP
 */
/* exported from gatherer id 29 rev 3 on Sun, 30 Mar 2025 12:45:59 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
import WordBoxGatherer from '../Gatherers/WordBoxGatherer.js';
export default class CMPGatherer extends Gatherer {
    constructor() {
        super();
        this.wordbox = new WordBoxGatherer();        
    }

    async onPageWait(scraper) {
        let wordBoxStart = Date.now();
        await this.wordbox.onPageWait(scraper);
        console.log("WordBoxGatherer: ", (Date.now() - wordBoxStart) + "ms");

        this.results = [];

        for (let hit of this.wordbox.hits) {
            try {
                let foundCMPs = await hit.element.evaluate((hit, CMP_patterns) => {
                    let found = [];

                    // Get hit element + all its child elements
                    let elementsToCheck = [hit, ...hit.querySelectorAll("*")];

                    CMP_patterns.forEach(CMP => {
                        CMP.patterns.forEach(pattern => {
                            try {
                                let regex = new RegExp(pattern, 'i'); 

                                elementsToCheck.forEach(el => {
                                    for (let attr of el.attributes) {
                                        if (regex.test(attr.value)) {
                                            found.push({
                                                CMP_name: CMP.CMP_name,
                                                matchedPattern: pattern,
                                                matchingElement: el.outerHTML,
                                                matchingAttribute: attr.name,
                                                matchingValue: attr.value
                                            });
                                            return; // Stop checking further attributes for this element
                                        }
                                    }
                                });

                            } catch (e) {
                                console.log(`Invalid regex pattern: ${pattern}`);
                            }
                        });
                    });

                    return found;
                }, CMP_patterns);

                if (foundCMPs.length > 0) {
                    this.results.push(...foundCMPs);
                }

            } catch (e) {
                console.error("Error in CMPGatherer:", e);
            }
        }
    }

    getResult() {
        return { "CMPs": this.results };
    }
}

const CMP_patterns = [
    {"CMP_name": "Usercentrics", "patterns": ["CybotCookiebot","cNkVwm","\\busercentrics","\\buc-heading-title"]},
    {"CMP_name": "Complianz", "patterns": ["cmplz"]},
    {"CMP_name": "OneTrust", "patterns": ["onetrust","optanon","ot-sdk-container"]},
    {"CMP_name": "Cookie Information", "patterns": ["\\bcoi"]},
    {"CMP_name": "Cookie-Script", "patterns": ["\\bcookiescript_"]},
    {"CMP_name": "Osano", "patterns": ["cookieconsent:desc","osano","cc_container","cc-window"]},
    {"CMP_name": "Cookie Notice", "patterns": ["cn-notice-text"]},
    {"CMP_name": "CookieYes", "patterns": ["cookie_action_close_header","-cli-","\\bcky","cookie-law-info-bar"]},
    {"CMP_name": "Shopify", "patterns": ["shopify-pc__banner"]},
    {"CMP_name": "iubenda", "patterns": ["iubenda"]},
    {"CMP_name": "tarteaucitron", "patterns": ["tarteaucitron"]},
    {"CMP_name": "Borlabs", "patterns": ["\\bborlabs"]},
    {"CMP_name": "consentmanager.net", "patterns": ["cmpwelcomebtnsave","cmpbox"]},
    {"CMP_name": "CookieHub", "patterns": ["\\bch2-"]},
    {"CMP_name": "Digital Control Room", "patterns": ["\\bCookieReports"]},
    {"CMP_name": "Drupal", "patterns": ["eu-cookie-compliance-categories"]},
    {"CMP_name": "CIVIC", "patterns": ["ccc-overlay"]},
    {"CMP_name": "Moove", "patterns": ["\\bmoove-gdpr"]},
    {"CMP_name": "Cookie Info Script", "patterns": ["cookieinfo-close"]},
    {"CMP_name": "Termly", "patterns": ["termly"]},
    {"CMP_name": "Didomi", "patterns": ["didomi"]},
    {"CMP_name": "Axeptio", "patterns": ["\\baxeptio"]},
    {"CMP_name": "Sourcepoint", "patterns": ["sp_message_container"]},
    {"CMP_name": "idnovate", "patterns": ["\\bcookiesplus"]},
    {"CMP_name": "Piwik", "patterns": ["\\bppms_cm"]},
    {"CMP_name": "TrustArc", "patterns": ["\\btruste"]},
    {"CMP_name": "HubSpot", "patterns": ["\\bhs-en-cookie-"]},
    {"CMP_name": "Shoptet", "patterns": ["siteCookies"]},
    {"CMP_name": "Jimdo", "patterns": ["cookie-settings-necessary"]},
    {"CMP_name": "Shoper", "patterns": ["consents__advanced-buttons"]},
    {"CMP_name": "InMobi", "patterns": ["qc-cmp2-ui"]},
    {"CMP_name": "Serviceform", "patterns": ["sf-cookie-settings"]},
    {"CMP_name": "IdoSell", "patterns": ["iai_cookie"]},
    {"CMP_name": "Shopware", "patterns": ["page-wrap--cookie-permission","cookie-permission--container","cookie-consent--header"]},
    {"CMP_name": "8works", "patterns": ["eightworks-cookie-consent"]},
    {"CMP_name": "Wix", "patterns": ["consent-banner-root-container","ccsu-banner-text-container"]},
    {"CMP_name": "Acris", "patterns": ["acris-cookie-settings"]},
    {"CMP_name": "Mozello CookieBar", "patterns": ["cookie-notification-text"]},
    {"CMP_name": "Gomag", "patterns": ["iqitcookielaw"]},
    {"CMP_name": "WordPress Theme Avada", "patterns": ["__gomagCookiePolicy"]},
    {"CMP_name": "FireCask (formerly Peadig)", "patterns": ["fusion-privacy-bar"]},
    {"CMP_name": "CookieFirst", "patterns": ["pea_cook_btn"]},
    {"CMP_name": "Klaro", "patterns": ["cf3E9g"]},
    {"CMP_name": "Amasty (Magento plugin)", "patterns": ["id-cookie-notice"]},
    {"CMP_name": "WordPress Theme WoodMart by xtemos", "patterns": ["amgdprcookie-button"]},
    {"CMP_name": "Cookie Bar (generic script adapted by many)", "patterns": ["wd-cookies-inner"]},
    {"CMP_name": "I Have Cookies by Ketan Mistry", "patterns": ["cb-enable"]},
    {"CMP_name": "CCM19", "patterns": ["gdpr-cookie-accept"]},
    {"CMP_name": "WordPress Theme Flatsome", "patterns": ["ccm-modal-inner"]},
    {"CMP_name": "WordPress Theme Enfold", "patterns": ["flatsome-cookies"]},
    {"CMP_name": "jQuery EU Cookie Law popup by wimagguc", "patterns": ["avia-cookie-"]},
    {"CMP_name": "Consent Magic", "patterns": ["eupopup-body"]},
    {"CMP_name": "CookieHint", "patterns": ["cs-privacy-content-text"]},
    {"CMP_name": "Shoprenter", "patterns": ["cookiecontent"]},
    {"CMP_name": "Squarespace", "patterns": ["nanobar-buttons"]},
    {"CMP_name": "Unidentified CMP 001", "patterns": ["sqs-cookie-banner-v2-cta"]},
    {"CMP_name": "Unidentified CMP 002", "patterns": ["w-cookie-modal"]},
    {"CMP_name": "Unidentified CMP 003", "patterns": ["bemCookieOverlay"]},
    {"CMP_name": "Unidentified CMP 004", "patterns": ["consents__wrapper"]},
    {"CMP_name": "Unidentified CMP 005", "patterns": ["\\bcookie-policy-overlay"]},
    {"CMP_name": "Unidentified CMP 006", "patterns": ["\\bcookie-policy-details"]},
    {"CMP_name": "Unidentified CMP 007", "patterns": ["\\bpopup-text$"]},
    {"CMP_name": "Unidentified CMP 008", "patterns": ["lgcookieslaw"]},
    {"CMP_name": "Adobe Commerce", "patterns": ["module-notification-137"]},
    {"CMP_name": "Unidentified CMP 009", "patterns": ["cookieNoticeContent"]},
    {"CMP_name": "Unidentified CMP (possibly createIT)", "patterns": ["ct-ultimate-gdpr-"]},
    {"CMP_name": "TermsFeed", "patterns": ["cc_div","cc-nb-text"]},
    {"CMP_name": "CookieConsent", "patterns": ["cm__desc"]},
    {"CMP_name": "Django Cookie Consent", "patterns": ["cc-cookie-accept"]}
]