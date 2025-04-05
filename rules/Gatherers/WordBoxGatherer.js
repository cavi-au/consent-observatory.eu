/**
 * WordBoxGatherer
 * 
 * Inspired by BannerClick paper
 * Known issues: Does not pierce closed shadowRoot (but supports open ones)
 * 
 * Copyright (c) 2023 Rolf Bagge, Janus Kristensen
 * Copyright (c) 2024, 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label WordBox Gatherer
 * @description Detects popups using a pre-defined word corpus
 */
/* exported from gatherer id 13 rev 66 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
export default class WordBoxGatherer extends Gatherer {
    constructor() {
        super();
        this.results = {};
    }

    setup(){
        window.corpus = {
            "international": { // Foreign language imports
                triggers: ["cookie","cookies", "GDPR"],
                antiTriggers: []
            }, 
            "de-at": { // Austria
                triggers: ["alle akzeptieren", "einstellungen verwalten", "zwecke anzeigen", "ablehnen", "datenschutzerklärung"],
                antiTriggers: []
            },
            "nl-be": { // Belgium
                triggers: ["accepter", "en savoir plus", "akkoord", "meer informatie", "alle cookies aanvaarden", "paramètres", "accepteren", "d'accord"],
                antiTriggers: []
            }, 
            "bg": { // Bulgaria
                triggers: ["Политика за поверителност", "Приемане", "затваряне", "Настройки", "Отхвърли Всички", "Приеми Всички", "Научете повече", "Приемане и затваряне", "Приемам", "към сайта", "Опции за управление", "Подробни настройки", "продължи", "бисквитки", "бисквитките", "приемете", "Политика за защита на личните данни", "Политика за бисквитките", "съгласие", "Научете повече", "Политика за използване на бисквитки", "други възможности", "приемате", "декларацията за поверителност", "съгласявате", "персонализираме съдържанието"],
                antiTriggers: []
            }, 
            "hr": { // Croatia
                triggers: ["Prihvati i zatvori", "Prihvaćam", "Saznaj više", "Saznajte više", "Prihvati sve kolačiće", "Prihvaćam sve", "Postavke", "Postavke kolačića", "Slažem se", "Pogledajte naše partnere", "Upravljanje opcijama", "Ne prihvaćam", "Više informacija", "Politika privatnosti", "Pravila privatnosti", "Odbaci sve", "Prihvati i zatvori", "Prihvati", "na stranicu", "Opcije za upravljanje", "Detaljne postavke", "nastavi", "kolačići", "kolačići", "prihvati", "Pravila o kolačićima", "pristanak", "Pravila o kolačićima", "druge opcije", "prihvaćam", "izjava o privatnosti", "slažem se", "prilagodite sadržaj"],
                antiTriggers: []
            }, 
            "el-cy": { // Cyprus
                triggers: ["ΑΠΟΔΟΧΗ ΟΛΩΝ", "ΔΙΑΔΟΧΗ ΟΛΩΝ", "ΑΠΟΡΡΙΨΗ ΟΛΩΝ", "ΣΥΜΦΩΝΩ", "Ρυθμίσεις Cookies", "Αποδοχή όλων", "ΔΙΑΦΩΝΩ", "ΠΡΟΤΙΜΗΣΕΙΣ", "Πολιτική Απορρήτου"],
                antiTriggers: []
            }, 
            "cs-cz": { // Czech Republic
                triggers: ["Podrobné nastavení", "Povolit vše", "Souhlasím", "Odmítnout", "Rozumím", "Povolit nezbytné", "Další volby", "Přijmout vše", "Upravit mé předvolby", "Nastavení", "Zásady ochrany osobních údajů"],
                antiTriggers: []
            }, 
            "de": { // Germany
                triggers: ["datenschutz", "akzeptieren", "stimme zu", "zustimmen", "berechtigtes interesse", "Privatsphäre"],
                antiTriggers: ["\\d+ Jahre oder älter"]
            }, 
            "da": { // Denmark
                triggers: ["privatliv", "samtykke", "acceptér", "tillad", "legitim interesse"],
                antiTriggers: []
            }, 
            "et": { // Estonia
                triggers: ["nõustun", "keeldu", "luba kõik", "kohanda", "küpsiste seaded", "küpsiste sätted", "küpsised", "nõustu", "halda", "privaatsus", "küpsiseid", "küpsistega", "küpsistest", "privaatsuspoliitika", "sulge", "seaded", "rohkem teavet", "keeldun", "kuva eesmärgid", "muudan küpsiste seadistusi", "küpsiste seadetega", "sain aru", "loen veel", "privaatsuspõhimõtete", "nõustun kõigi küpsistega", "selge", "lisainfo", "isikupärastamiseks", "isikupärastatud", "isikupärasem", "seaded", "tingimused", "tingimustega", "seadistusi"],
                antiTriggers: []
            }, 
            "en": { // England/US
                triggers: ["we and our \\d+ partners", "privacy", "consent", "accept", "agree", "legitimate interest"],
                antiTriggers: ["\\d+ years or older","\\d+ years"]
            }, 
            "es": { // Spain
                triggers: ["privacidad", "acept", "acceptar", "acordar", "interés legítimo"],
                antiTriggers: []
            }, 
            "fi": { // Finland
                triggers: ["evästeitä","evästeiden", "tietosuoja", "hyväksy", "hylkää", "asetukset", "suostumustasi", "suostumuksesi"],
                antiTriggers: []
            }, 
            "fr": { // France
                triggers: ["confidentialité", "accepter", "accord", "intérêt légitime"],
                antiTriggers: ["\\d+ ans ou plus"]
            }, 
            "el": { // Greece
                triggers: ["ΠΕΡΙΣΣΟΤΕΡΕΣ ΕΠΙΛΟΓΕΣ", "ΣΥΜΦΩΝΩ", "ΔΙΑΦΩΝΩ", "ΑΠΟΔΟΧΗ", "ΑΠΟΡΡΙΨΗ", "Περισσότερα", "ΑΠΟΡΡΗΤΗΝ", "Πολιτική Απορρήτου"],
                antiTriggers: []
            },
            "hu": { // Hungary
                triggers: ["cookie-kat", "Elfogadom", "TOVÁBBI OPCIÓK", "NEM ELFOGADOM", "További információ", "Elfogadás és bezárás", "Beállítások", "Beállítások kezelése", "Hozzájárulás", "ÖSSZES ENGEDÉLYEZÉSE", "Mindent elfogadok", " Adatvédelmi szabályzat", "Elfogadás", "Adatvédelmi szabályzat", "sütik", "Az Ön adatainak védelme fontos számunkra", "Tartalom testreszabása", "Lehetőségek", "További lehetőségek", "Részletek", "Cookie-k", "Információ", "Cookie-szabályzat", "kapcsolódó sütikkel kapcsolatos információk"],
                antiTriggers: []
            },
            "is": { // Iceland
                triggers: ["vefkökur", "kökur", "vafrakökur", "samþykkja", "hafna", "vefköku stillingar", "leyfa", "vista val", "fótspor"],
                antiTriggers: []
            },
            "en-ie": { // Ireland
                triggers: ["fianáin", "cuacha", "lean ar aghaidh", "cosanta sonraí", "socruithe fianán", "glac le gach fianán", "diúltú neamhriachtanach", "bainistigh fianáin"],
                antiTriggers: []
            },
            "it": { // Italy
                triggers: ["politica", "consenso", "accetta", "concordare", "interesse legittimo"],
                antiTriggers: ["\\d+ anni o più"]
            },
            "lv": { // Latvia
                triggers: ["Piekrītu", "PIELĀGOT", "PAPILDU OPCIJAS", "Uzzināt vairāk", "Atļaut visas sīkdatnes", "Apstiprināt", "Pārvaldības iespējas", "Apstiprināt", "Pārvaldības iespējas", "СОГЛАСЕН", "NEPIEKRIŢU", "ДОПОЛНИТЕЛЬНЫЕ ПАРАМЕТРЫ", "Privātuma politika", "Piekrist", "aizvērt", "Iestatījumi", "Noraidīt visu", "Pieņemt visu", "Uzzināt vairāk", "Pieņemt un aizvērt", "Piekrist", "Opcijas pārvaldība", "Detalizēti iestatījumi", "Turpināt", "sīkfaili", "pieņemt", "piekrišana", "Uzzināt vairāk", "Sīkfailu politika", "cits opcijas", "Es piekrītu", "paziņojums par konfidencialitāti", "Es piekrītu", "pielāgot saturu"],
                antiTriggers: []
            },
            "lt": { // Lithuania
                triggers: ["Sutinku", "Tvarkyti parinktis", "Leisti visus slapukus", "DAUGIAU PASIRINKIMŲ", "Atsisakyti visų", "Supratau", "Slapukų nustatymai", "Sutikimas", "Rodyti informaciją", "Patvirtinti", "Privatumo politika", "Rinktis", "Slapuku politikoje", "nesutinku", "Tinkinti", "Priimti", "Slapukai", "Slapukų politika", "Privatumo pareiškimas", "Nustatymai", "Rodyti paskirtis", "Privatumas", "Slapukuose", "Tvarkyti parinktis", "Slapuku politikoje", "Nuostatos", "Rinkodara", "Slapukus"],
                antiTriggers: []
            },
            "fr-lu": { // Luxembourg
                triggers: ["J'accepte", "Je refuse", "Gérer les cookies", "Paramètres des cookies", "Accepter tout", "Afficher toutes les finalités", "Privatsphär"],
                antiTriggers: []
            },
            "mt":{ // Malta
                triggers: ["il-privatezza", "il-cookies", "tal-cookies", "naqbel", "naċċetta", "aktar dwar il cookies", "aċċetta", "irrifjuta"],
                antiTriggers: []
            },
            "nl": { // Netherlands
                triggers: ["accepteren", "afwijzen", "akkoord", "instellen", "toestemming", "privacy-instellingen", "instellingen", "cookiebeleid", "privacyverklaring"],
                antiTriggers: ["\\d+ jaar of ouder"]
            },
            "no": { // Norway
                triggers: ["informasjonskapsler", "personvern", "godta", "avvis"],
                antiTriggers: []
            },
            "pl":{ // Poland
                triggers: ["plików", "plikach", "akceptuję", "odrzucenie wszystkich", "zaakceptuj", "ordzuć", "prwatność"],
                antiTriggers: []
            },
            "pt": { // Portugal
                triggers: ["privacidade", "consentimento", "aceitar", "concordo", "interesse legítimo"],
                antiTriggers: ["\\d+ anos ou mais"]
            },
            "ro": { // Romania
                triggers: ["cookie-uri", "ACCEPT TOATE", "VREAU SA MODIFIC SETARILE INDIVIDUAL", "MODIFIC SETĂRILE", "MAI MULTE OPȚIUNI", "Respinge toate", "Gestionajți opțiunile", "Consimțământ", "Setari cookie-uri", "SETĂRI COOKIES", "Politica de confidențialitate"],
                antiTriggers: []
            },
            "sk": { // Slovakia
                triggers: ["Pokračovať s nevyhnutnými cookies", "Nastavenia", "Súhlasím", "Prijať všetko", "Akceptovať", "Zamietnuť", "Nastavenie cookies", "Nastavenia cookies", "Ďalšie informácie", "Bližšie informácie", "Zásady ochrany osobných údajov"],
                antiTriggers: []
            },
            "sl": { // Slovenia
                triggers: ["STRINJAM SE", "VEČ MOŽNOSTI", "NASTAVITVE", "SPREJMI", "SPREJMEM", "NE STRINJAM SE", "NASTAVITVE PIŠKOTOV", "Sprejmem vse", "Dovoli vse in zapri", "PRILAGODI", "Politika zasebnosti", "zavrni vse", "namesti vse", "po meri", "vi redu", "razumem", "piškotkov", "piškotke", "piškotki", "piškotkih"],
                antiTriggers: []
            },
            "sv": { // Sweden
                triggers: ["acceptera", "godkänn", "kakor"],
                antiTriggers: []
            }
        };

        window.findAnchors = function findAnchors(currentElement, path=":root"){
            // Check this element's own styles for a match, do not dive deeper if found
            let style = getComputedStyle(currentElement);
            if (
                (style.getPropertyValue("z-index") && (!isNaN(style.getPropertyValue("z-index"))) && parseInt(style.getPropertyValue("z-index"))>10) || 
                (style.getPropertyValue("position") && style.getPropertyValue("position").indexOf("fixed")!==-1)
                ){
                    //console.log("Found box with", style.getPropertyValue("position"), style.getPropertyValue("z-index"));
                return [{
                    element: currentElement,
                    path: path
                }];
            }

            // Scan children
            let foundAnchors = [];
            for (var i = 0; i < currentElement.children.length; i++) {
                foundAnchors = [...foundAnchors, ...findAnchors(currentElement.children[i], path+" > "+currentElement.children[i].nodeName+(currentElement.children[i].id?"#"+currentElement.children[i].id:"")+":nth-child(0n+"+i+")")];
            }

            // Scan shadow children
            if (currentElement.shadowRoot){
                for (var i = 0; i < currentElement.shadowRoot.children.length; i++) {
                    foundAnchors = [...foundAnchors, ...findAnchors(currentElement.shadowRoot.children[i], path+":shadow > "+currentElement.shadowRoot.children[i].nodeName+":nth-child("+i+")")];
                }                
            }
            return foundAnchors;
        }

        /** Recursive search for words in text-nodes and attributes **/
        window.findWords = function findWords(currentElement, triggerSet){
            if (currentElement.getClientRects().length===0) return []; // Ignore parts of page invisible to the user

            // Check attributes on this element
            let comparisonText = "";
            for (var i = 0; i < currentElement.attributes.length; i++) {
                comparisonText += currentElement.attributes[i].value+"; ";
            }

            // Check text nodes
            for (var i = 0; i < currentElement.childNodes.length; i++) {
                if (currentElement.childNodes[i].nodeType === Node.TEXT_NODE){
                    comparisonText += currentElement.childNodes[i].textContent+"; ";
                }
            }         

            // Compare with corpus       
            let foundInComparisonText = [];
            for (const [language,details] of Object.entries(corpus)){
                details[triggerSet].forEach(word=>{
                    if (new RegExp("(?:[^\\S\\r\\n]|[\\(\\\"]|^)"+word+"(?:[\\s\\.\\;\\:\\)\\\",]|$)", "mgi").test(comparisonText)) {
                        foundInComparisonText.push({trigger:word,language:language});
                    }
                });
            };
            if (foundInComparisonText.length>0) {
                return [{text:comparisonText,triggers:foundInComparisonText}];
            }

            // Check children and shadow children
            let recursionResult = [];
            for (var i = 0; i < currentElement.children.length; i++) {
                recursionResult = [...recursionResult, ...findWords(currentElement.children[i], triggerSet)];
            }
            if (currentElement.shadowRoot){
                for (var i = 0; i < currentElement.shadowRoot.children.length; i++) {
                    recursionResult = [...recursionResult, ...findWords(currentElement.shadowRoot.children[i], triggerSet)];
                }
            }
            return recursionResult;
        }
    }

    scanPotentialAnchors(){
        return findAnchors(document.body);
    }

    scanIFrame(){
        return [
            findWords(document.body, "triggers"),
            findWords(document.body, "antiTriggers")
        ]
    }

    async foundHit(element, details, scraper){
        details.id = this.hits.length;

        details.triggerCount = {
            positive: 0,
            negative: 0
        }
        details.matches.forEach(match=>{
            details.triggerCount.positive+=match.triggers.length;
        });
        details.negativeMatches.forEach(match=>{
            details.triggerCount.negative+=match.triggers.length;
        });

        if (scraper.doInspectorAnalysis) await scraper.doInspectorAnalysis(element, details);

        this.hits.push({element:element, ...details});
        this.results.hits.push(details);
    }

    async onPageWait(scraper) {
        let self = this;

        // Debug
        if(false) {
            scraper.page.on('console', async (msg) => {
            const msgArgs = msg.args();
            for (let i = 0; i < msgArgs.length; ++i) {
                console.log(await msgArgs[i].jsonValue());
            }
            });
        }

        // Scan the top page
        await scraper.page.evaluate(self.setup);
        if (scraper.prepareVisibilityAnalysis) await scraper.prepareVisibilityAnalysis(scraper.page);
        let potentialAnchorsHandles = await scraper.page.evaluateHandle(self.scanPotentialAnchors);
        let wordAnchorsHandles = await scraper.page.evaluateHandle((potentialAnchors)=>{
            return potentialAnchors.map((anchor)=>{
                console.log("Checking potential element at "+anchor.path);
                if (anchor.element.matches("body, html")) return false; // Skip body/html elements
                let wordResult = findWords(anchor.element, "triggers");
                let antiWordResult = findWords(anchor.element, "antiTriggers");
                console.log("Result is "+wordResult);
                if (wordResult.length===0) return false;
                let result = {
                    element: anchor.element,
                    details: {
                        html: anchor.element.innerHTML,
                        matches: wordResult,
                        negativeMatches: antiWordResult,
                        path: anchor.path
                    }
                };
                try {
                    visibilityAnalysis(anchor.element, result.details, {skipScoring: true, skipButtonDecomposition: true});
                } catch (ex){
                    console.log("Failed visibility analysis"+ex);
                }
                return result;
            }).filter(el=>{return el!==false});
        }, potentialAnchorsHandles);

        // Store anchor hits in result data and for internal use
        this.results.hits = [];
        this.hits = []
        let wordAnchors = await wordAnchorsHandles.getProperties();
        console.log("Gathering normal results...");
        let wordAnchorCount = 0;
        for (let hitHandle of Array.from(wordAnchors.values())){
            wordAnchorCount++;
            await this.foundHit(await hitHandle.getProperty("element"), await (await hitHandle.getProperty("details")).jsonValue(), scraper);
        }
        console.log("hits is now", this.results.hits.length);

        // Scan relevant embedded IFRAMEs also
        let filteredFrames = 0;
        let potentialAnchors = await potentialAnchorsHandles.getProperties();
        console.log("Scanning embedded frames",potentialAnchors.size);
        for (let potentialAnchor of potentialAnchors.values()){
            let anchorEl = await potentialAnchor.getProperty("element");
            let iframes = await anchorEl.$$("iframe");
            for (let iframe of iframes){
                let boundingBox = await iframe.boundingBox();
                let frame = await iframe.contentFrame();

                if(!frame._lifecycleEvents.has("DOMContentLoaded")) {
                    console.log("Skipping not loaded frame:", frame);
                    continue;
                }

                // Setup in the frame
                await frame.evaluate(self.setup);
                await frame.evaluate((offset)=>{
                    window._wordboxClientOffset = offset;
                }, boundingBox);
                if (scraper.prepareVisibilityAnalysis) await scraper.prepareVisibilityAnalysis(frame);

                let [wordResult, antiWordResult] = await frame.evaluate(self.scanIFrame);
                if (wordResult.length>0){                    
                    filteredFrames++;
                    let visibility = {};
                    try {
                        visibility = await frame.evaluate(() => {
                            return visibilityAnalysis(document.body, {}, {skipScoring: true, skipButtonDecomposition: true});
                        });
                    } catch (ex){
                        //console.log("Failed iframe visibility analysis"+ex);
                    }

                    let frameHit = {
                        html: await frame.evaluate(()=>{return document.body.innerHTML+""}),
                        matches: wordResult,
                        negativeMatches: antiWordResult,
                        path: (await(await potentialAnchor.getProperty("path")).jsonValue())+":iframe-content body",
                        iframe: frame.url()
                    };
                    if (visibility.visibilityAnalysis){
                        frameHit.visibilityAnalysis = visibility.visibilityAnalysis;
                    }
                    await this.foundHit(await frame.evaluateHandle(()=>{return document}), frameHit, scraper)
                };
            }
        }

        this.results.potentialAnchors = potentialAnchors.size;
        this.results.filteredAnchors = wordAnchorCount;
        this.results.filteredFrames = filteredFrames;
        this.results.detections = filteredFrames + wordAnchorCount;
    }

    getResult() {
        return this.results;
    }    
}
