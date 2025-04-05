/**
 * NormalizedWordButtonGatherer
 * 
 * Copyright (c) 2023 Rolf Bagge, Janus Kristensen
 * Copyright (c) 2024, 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label Normalized Word Button Gatherer
 * @description Find buttons based on a large pre-processed word-corpus
 */
/* exported from gatherer id 23 rev 40 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
import WordBoxGatherer from '../Gatherers/WordBoxGatherer.js';
import js_levenshtein from 'js-levenshtein';
export default class NormalizedWordButtonGatherer extends Gatherer {
  constructor() {
      super();
      this.wordbox = new WordBoxGatherer();        
  }

  async onPageWait(scraper) {
      let wordBoxStart = Date.now();
      await this.wordbox.onPageWait(scraper);
      console.log("WordBoxGatherer: ", (Date.now() - wordBoxStart)+"ms");

      // Debug
      if(false) {
          scraper.page.on('console', async (msg) => {
          const msgArgs = msg.args();
          for (let i = 0; i < msgArgs.length; ++i) {
              console.log(await msgArgs[i].jsonValue());
          }
          });
      }

      this.results = [];

      await scraper.page.exposeFunction("findWordCategory", (text)=>{
          if(text != null) {
              text = text.trim();
              if (text==="") return null;
              let normalized = text.normalize("NFKD").replace(/(\p{Control}|\p{Format}|\p{Private_Use}|\p{Surrogate}|\p{Spacing_Mark}|\p{Enclosing_Mark}|\p{Nonspacing_Mark}|\p{Connector_Punctuation}|\p{Dash_Punctuation}|\p{Close_Punctuation}|\p{Final_Punctuation}|\p{Initial_Punctuation}|\p{Other_Punctuation}|\p{Open_Punctuation}|\p{Modifier_Symbol}|\p{Other_Symbol}|\p{Currency_Symbol}|\p{Line_Separator}|\p{Paragraph_Separator}|\p{Space_Separator})/gu,"").toLowerCase();

              // Find the entry with the lowest levenshtein distance below the cutoff in the word list
              return normalizedWords.filter((data)=>{
                  return js_levenshtein(data.normalized, normalized) < 2;
              }).reduce((accumulator, currentValue)=>{
                  let distance = js_levenshtein(currentValue.normalized, normalized);
                  if (accumulator===null || distance<accumulator.distance){
                    currentValue.distance = distance;
                    return currentValue;
                  } else {
                    return accumulator;
                  }
              },null);
          }
          return null;
      });

      for (let hit of this.wordbox.hits){
          try {
              let evaluateStart = Date.now();
              if (scraper.prepareVisibilityAnalysis) await scraper.prepareVisibilityAnalysis(hit.element);

              let resultHandles = await hit.element.evaluateHandle(async (hit)=>{
                  let foundButtons = [];
                  let maxLength = 256;

                  function wordCat(text){
                    if (!window._wordCategoryCache) window._wordCategoryCache = {};
                    if (window._wordCategoryCache[text]) return window._wordCategoryCache[text];
                    let answer = findWordCategory(text);
                    window._wordCategoryCache[text] = answer;
                    return answer;
                  }                  

                  let elementsInResult = hit.querySelectorAll("*");
                  console.log("NWBG has "+elementsInResult.length+" in result");
                  for(let elm of elementsInResult) {
                      //Check value attribute for category? (intentionally done first so it is removed if both a good value and text is available)
                      if(elm.hasAttribute("value")) {
                        let theValue = elm.getAttribute("value").trim();
                        if (theValue.length<maxLength){
                          let valueCategory = await wordCat(theValue);
                          if(valueCategory != null) {
                            foundButtons.push({text: theValue, element: elm, ...valueCategory});
                          }
                        }
                      }

                      // Check the text content
                      if (elm.innerText) { //This if statement wrapped around this code is added by Midas because there were errors trying to do .trim() on elements without innertext
                        let theText = elm.innerText.trim();
                        if (theText.length<maxLength){
                          let category = await wordCat(theText);
                          if(category != null) {
                            console.log("Pushign "+theText+" "+category.category+" "+category.normalized);
                            foundButtons.push({text: theText, element: elm, ...category});
                          }                      
                        }
                      }
                  }

                  // Filter out useless categories
                  console.log("Filtering categories from "+foundButtons.length+"results...");
                  foundButtons = foundButtons.filter((button)=>{
                      //return true;
                      return button.category && !([0,8,9].includes(button.category));
                  });

                  // Filter out parents
                  console.log("Filtering parents from "+foundButtons.length+"results...");
                  let filteredButtons = [];
                  foundButtons.forEach((button)=>{
                      filteredButtons = filteredButtons.filter((fb)=>{
                          return ! fb.element.contains(button.element);
                      });
                      filteredButtons.push(button);
                  });


                  return Promise.all(filteredButtons.map(async (fb)=>{
                      try {
                          await visibilityAnalysis(fb.element, fb);
                      } catch (e){
                          // Ignore
                          console.log(""+e)
                      }
                      return fb;
                  }));
              });


              // Post processing
              let results = await resultHandles.getProperties();
              //console.log("Gathering:", results, (Date.now() - evaluateStart)+"ms");
              for (let [index, handle] of results){
                let element = await handle.getProperty("element");
                //console.log("Doing result", element);
                let post = {
                  popup: hit.id // Add wordbox popup id
                };

                // Do inspector analysis
                if (scraper.doInspectorAnalysis){
                    try {
                      await scraper.doInspectorAnalysis(element, post);
                    } catch (ex){
                      console.log(ex);
                    }
                }

                // Replace JS links with its html
                //console.log("Adding link", element);
                post.element = await element.evaluate((el)=>{return el.outerHTML+""});

                // Overwrite
                //console.log("Overwriting link");
                await handle.evaluate((self, merger)=>{
                    Object.assign(self, merger);
                }, post);
              };

              this.results.push(...await resultHandles.evaluate(self=>{return self}));

          } catch(e) {
              console.error("Error in NormalizedWordButtonGatherer:", e);
          }
      }

  }

  getResult() {
      return {"detections": this.results.length, "detectionsArray": this.results};
  }
}


let normalizedWords = [
  {
    "normalized": "acceptallcookies",
    "category": 1
  },
  {
    "normalized": "privacypolicy",
    "category": 0
  },
  {
    "normalized": "our6partners",
    "category": 8
  },
  {
    "normalized": "our2partners",
    "category": 8
  },
  {
    "normalized": "our5partners",
    "category": 8
  },
  {
    "normalized": "our4partners",
    "category": 8
  },
  {
    "normalized": "ourpartners",
    "category": 0
  },
  {
    "normalized": "partneri",
    "category": 8
  },
  {
    "normalized": "partners",
    "category": 0
  },
  {
    "normalized": "zaufanychpartnerowiab",
    "category": 0
  },
  {
    "normalized": "zaufanychpartnerow",
    "category": 0
  },
  {
    "normalized": "acceptall",
    "category": 1
  },
  {
    "normalized": "ablehnen",
    "category": 2
  },
  {
    "normalized": "alleakzeptieren",
    "category": 1
  },
  {
    "normalized": "|impressum",
    "category": 0
  },
  {
    "normalized": "impressum|",
    "category": 0
  },
  {
    "normalized": "impresum",
    "category": 0
  },
  {
    "normalized": "impressum",
    "category": 9
  },
  {
    "normalized": "cookiessettings",
    "category": 3
  },
  {
    "normalized": "indstillinger",
    "category": 3
  },
  {
    "normalized": "continuersansaccepter",
    "category": 2
  },
  {
    "normalized": "zustimmen",
    "category": 1
  },
  {
    "normalized": "moreoptions",
    "category": 3
  },
  {
    "normalized": "agree",
    "category": 1
  },
  {
    "normalized": "afvisalle",
    "category": 2
  },
  {
    "normalized": "accepter",
    "category": 1
  },
  {
    "normalized": "toutaccepter",
    "category": 1
  },
  {
    "normalized": "rejectall",
    "category": 2
  },
  {
    "normalized": "accept",
    "category": 1
  },
  {
    "normalized": "cookiepolicy",
    "category": 0
  },
  {
    "normalized": "showdetails",
    "category": 3
  },
  {
    "normalized": "signin",
    "category": 0
  },
  {
    "normalized": "akzeptieren",
    "category": 1
  },
  {
    "normalized": "cookieeinstellungen",
    "category": 3
  },
  {
    "normalized": "details",
    "category": 3
  },
  {
    "normalized": "datenschutzerklarung",
    "category": 0
  },
  {
    "normalized": "bier",
    "category": 0
  },
  {
    "normalized": "her",
    "category": 0
  },
  {
    "normalized": "hier",
    "category": 9
  },
  {
    "normalized": "sport",
    "category": 0
  },
  {
    "normalized": "video",
    "category": 0
  },
  {
    "normalized": "settings",
    "category": 3
  },
  {
    "normalized": "news",
    "category": 0
  },
  {
    "normalized": "datenschutzhinweisen",
    "category": 0
  },
  {
    "normalized": "visdetaljer",
    "category": 3
  },
  {
    "normalized": "accepterallecookies",
    "category": 1
  },
  {
    "normalized": "dk",
    "category": 0
  },
  {
    "normalized": "om",
    "category": 0
  },
  {
    "normalized": "uk",
    "category": 0
  },
  {
    "normalized": "k",
    "category": 0
  },
  {
    "normalized": "o",
    "category": 0
  },
  {
    "normalized": "sok",
    "category": 0
  },
  {
    "normalized": "sok",
    "category": 0
  },
  {
    "normalized": "ok",
    "category": 1
  },
  {
    "normalized": "accepteretfermer",
    "category": 1
  },
  {
    "normalized": "aideetcontact",
    "category": 0
  },
  {
    "normalized": "promos",
    "category": 0
  },
  {
    "normalized": "blog",
    "category": 0
  },
  {
    "normalized": "butpro",
    "category": 0
  },
  {
    "normalized": "personnalisermeschoix",
    "category": 3
  },
  {
    "normalized": "continuasenzaaccettare",
    "category": 2
  },
  {
    "normalized": "accettatuttiicookie",
    "category": 1
  },
  {
    "normalized": "personalizza",
    "category": 3
  },
  {
    "normalized": "showpurposes",
    "category": 3
  },
  {
    "normalized": "akceptuje",
    "category": 1
  },
  {
    "normalized": "pokazcele",
    "category": 9
  },
  {
    "normalized": "einstellungen",
    "category": 3
  },
  {
    "normalized": "ustawieniazaawansowane",
    "category": 3
  },
  {
    "normalized": "przejdzdoserwisu",
    "category": 1
  },
  {
    "normalized": "allecookiesakzeptieren",
    "category": 1
  },
  {
    "normalized": "konfigurieren",
    "category": 3
  },
  {
    "normalized": "gehtklar",
    "category": 1
  },
  {
    "normalized": "|imprint",
    "category": 0
  },
  {
    "normalized": "imprint",
    "category": 9
  },
  {
    "normalized": "bourse",
    "category": 0
  },
  {
    "normalized": "borse",
    "category": 9
  },
  {
    "normalized": "weiter",
    "category": 1
  },
  {
    "normalized": "weiter",
    "category": 1
  },
  {
    "normalized": "wetter",
    "category": 9
  },
  {
    "normalized": "audio",
    "category": 0
  },
  {
    "normalized": "tvprogramm",
    "category": 0
  },
  {
    "normalized": "livetv",
    "category": 0
  },
  {
    "normalized": "informationenaufeinemgeratspeichernundoderabrufen",
    "category": 0
  },
  {
    "normalized": "mere",
    "category": 3
  },
  {
    "normalized": "here",
    "category": 0
  },
  {
    "normalized": "datenschutzmanager",
    "category": 3
  },
  {
    "normalized": "accepteralle",
    "category": 1
  },
  {
    "normalized": "tilladudvalgte",
    "category": 4
  },
  {
    "normalized": "kunnødvendige",
    "category": 2
  },
  {
    "normalized": "fleremuligheder",
    "category": 3
  },
  {
    "normalized": "ensavoirplus→",
    "category": 3
  },
  {
    "normalized": "accepterfermer",
    "category": 1
  },
  {
    "normalized": "parametrerlescookies",
    "category": 3
  },
  {
    "normalized": "personnaliser",
    "category": 3
  },
  {
    "normalized": "decline",
    "category": 2
  },
  {
    "normalized": "signup",
    "category": 0
  },
  {
    "normalized": "termsofservice",
    "category": 0
  },
  {
    "normalized": "mode",
    "category": 0
  },
  {
    "normalized": "more",
    "category": 3
  },
  {
    "normalized": "acceptertout",
    "category": 1
  },
  {
    "normalized": "donotaccept",
    "category": 2
  },
  {
    "normalized": "accessyourdevice",
    "category": 0
  },
  {
    "normalized": "setyourchoices",
    "category": 3
  },
  {
    "normalized": "preferences",
    "category": 3
  },
  {
    "normalized": "gererlesparametres",
    "category": 3
  },
  {
    "normalized": "choisirmonmagasin",
    "category": 0
  },
  {
    "normalized": "meconnecter",
    "category": 0
  },
  {
    "normalized": "monpanier",
    "category": 0
  },
  {
    "normalized": "salonsalleamangerdecojusqua40profitezen",
    "category": 0
  },
  {
    "normalized": "chambreliteriejusqua50profitezen",
    "category": 0
  },
  {
    "normalized": "electrotvsonjusqua100profitezen",
    "category": 0
  },
  {
    "normalized": "haut",
    "category": 0
  },
  {
    "normalized": "consulterlapolitiquecookies",
    "category": 0
  },
  {
    "normalized": "identifiant",
    "category": 9
  },
  {
    "normalized": "societestierces",
    "category": 0
  },
  {
    "normalized": "accetto",
    "category": 1
  },
  {
    "normalized": "accettatutto",
    "category": 1
  },
  {
    "normalized": "impostazione",
    "category": 3
  },
  {
    "normalized": "accettaechiudi",
    "category": 1
  },
  {
    "normalized": "login",
    "category": 0
  },
  {
    "normalized": "archiviareeoaccedereainformazionisuundispositivo",
    "category": 0
  },
  {
    "normalized": "utilizzaredatidigeolocalizzazioneprecisi",
    "category": 0
  },
  {
    "normalized": "scansioneattivadellecaratteristichedeldispositivoaifinidellidentificazione",
    "category": 0
  },
  {
    "normalized": "categories",
    "category": 8
  },
  {
    "normalized": "categorie",
    "category": 0
  },
  {
    "normalized": "notifiche",
    "category": 0
  },
  {
    "normalized": "cerca",
    "category": 9
  },
  {
    "normalized": "accedi",
    "category": 1
  },
  {
    "normalized": "irelandsnationalpublicservicemedia",
    "category": 0
  },
  {
    "normalized": "managecookies",
    "category": 3
  },
  {
    "normalized": "detailssection",
    "category": 3
  },
  {
    "normalized": "precisegeolocationdataandidentificationthroughdevicescanning",
    "category": 0
  },
  {
    "normalized": "managesettings",
    "category": 3
  },
  {
    "normalized": "storeandoraccessinformationonadevice",
    "category": 0
  },
  {
    "normalized": "manageoptions",
    "category": 3
  },
  {
    "normalized": "einstellungenandern",
    "category": 3
  },
  {
    "normalized": "odrzuceniewszystkich",
    "category": 2
  },
  {
    "normalized": "partneranzeigen",
    "category": 0
  },
  {
    "normalized": "nurnotwendigecookiesakzeptieren",
    "category": 2
  },
  {
    "normalized": "alleablehnen",
    "category": 2
  },
  {
    "normalized": "detailsanzeigen",
    "category": 0
  },
  {
    "normalized": "dieseauswahlbestatigen",
    "category": 4
  },
  {
    "normalized": "oderhierallecookieeinstellungenimdetailverwalten",
    "category": 3
  },
  {
    "normalized": "abschnittcookies",
    "category": 9
  },
  {
    "normalized": "optionalecookiesablehnen",
    "category": 2
  },
  {
    "normalized": "anpassen",
    "category": 3
  },
  {
    "normalized": "schließen",
    "category": 1
  },
  {
    "normalized": "agreetoall",
    "category": 1
  },
  {
    "normalized": "changesettings",
    "category": 3
  },
  {
    "normalized": "onlyrequired",
    "category": 2
  },
  {
    "normalized": "nurnotwendigecookiesverwenden",
    "category": 2
  },
  {
    "normalized": "mehrinfosundeinstellungen",
    "category": 3
  },
  {
    "normalized": "einverstanden",
    "category": 1
  },
  {
    "normalized": "filtersinformationstorageandaccesscancelapply",
    "category": 0
  },
  {
    "normalized": "nurauswahlbestatigen",
    "category": 4
  },
  {
    "normalized": "ressorts",
    "category": 9
  },
  {
    "normalized": "politik",
    "category": 0
  },
  {
    "normalized": "ntvreporterinoblastdonezkgeruchteuberukrainischegegenoffensiveimsuden",
    "category": 0
  },
  {
    "normalized": "fruhstart",
    "category": 0
  },
  {
    "normalized": "fdpfraktionschefimfruhstartfunktionierendeheizungenwerdennichtherausgerissen",
    "category": 0
  },
  {
    "normalized": "fremdinhalteanzeigensozialenetzwerkeundchatsysteme",
    "category": 0
  },
  {
    "normalized": "verwendungvonnetid",
    "category": 0
  },
  {
    "normalized": "einstellungenoderablehnen",
    "category": 3
  },
  {
    "normalized": "ichhabebereitseinpurabo",
    "category": 0
  },
  {
    "normalized": "yourdata",
    "category": 0
  },
  {
    "normalized": "settingsorreject",
    "category": 3
  },
  {
    "normalized": "verwendungvoncookies",
    "category": 0
  },
  {
    "normalized": "marken",
    "category": 0
  },
  {
    "normalized": "test",
    "category": 0
  },
  {
    "normalized": "gebrauchtwagen",
    "category": 0
  },
  {
    "normalized": "ratgeber",
    "category": 0
  },
  {
    "normalized": "classiccars",
    "category": 0
  },
  {
    "normalized": "akzeptierenundweiter",
    "category": 1
  },
  {
    "normalized": "datenschutzhinweisenpur",
    "category": 0
  },
  {
    "normalized": "fur299monatabonnieren",
    "category": 5
  },
  {
    "normalized": "hiereinloggen",
    "category": 0
  },
  {
    "normalized": "fragenfaq",
    "category": 0
  },
  {
    "normalized": "personalisierteanzeigen",
    "category": 0
  },
  {
    "normalized": "personalisierteinhalte",
    "category": 0
  },
  {
    "normalized": "anzeigenmessunginhaltemessungerkenntnisseuberzielgruppenundproduktentwicklung",
    "category": 0
  },
  {
    "normalized": "agbs",
    "category": 0
  },
  {
    "normalized": "agb",
    "category": 9
  },
  {
    "normalized": "zumabonnement",
    "category": 0
  },
  {
    "normalized": "hieranmelden",
    "category": 0
  },
  {
    "normalized": "datenschutzeinstellungen",
    "category": 3
  },
  {
    "normalized": "nichtzustimmen",
    "category": 2
  },
  {
    "normalized": "datenschutzinformation",
    "category": 0
  },
  {
    "normalized": "anbieterliste",
    "category": 0
  },
  {
    "normalized": "einstellungenverwalten",
    "category": 3
  },
  {
    "normalized": "samarbejdspartnere",
    "category": 0
  },
  {
    "normalized": "tilladallecookies",
    "category": 1
  },
  {
    "normalized": "nødvendig",
    "category": 8
  },
  {
    "normalized": "læsmereogtilpasminepræferencer",
    "category": 3
  },
  {
    "normalized": "afvis",
    "category": 2
  },
  {
    "normalized": "fravælgalle",
    "category": 2
  },
  {
    "normalized": "tilladalle",
    "category": 1
  },
  {
    "normalized": "accepternødvendigecookies",
    "category": 2
  },
  {
    "normalized": "cookieprivatlivspolitik",
    "category": 0
  },
  {
    "normalized": "cookiepolitik",
    "category": 0
  },
  {
    "normalized": "købadgang",
    "category": 5
  },
  {
    "normalized": "logindher",
    "category": 0
  },
  {
    "normalized": "parametrer",
    "category": 3
  },
  {
    "normalized": "gerermespreferences",
    "category": 3
  },
  {
    "normalized": "toutrefuser",
    "category": 2
  },
  {
    "normalized": "refus→",
    "category": 2
  },
  {
    "normalized": "partenaires",
    "category": 0
  },
  {
    "normalized": "nos7partenaires",
    "category": 8
  },
  {
    "normalized": "nos9partenaires",
    "category": 8
  },
  {
    "normalized": "nospartenaires",
    "category": 0
  },
  {
    "normalized": "cookie",
    "category": 0
  },
  {
    "normalized": "ocookies",
    "category": 0
  },
  {
    "normalized": "cookies",
    "category": 8
  },
  {
    "normalized": "politiquedeprotectiondesdonneespersonnelles",
    "category": 0
  },
  {
    "normalized": "jerefusetout",
    "category": 2
  },
  {
    "normalized": "jepersonnalisemescookies",
    "category": 3
  },
  {
    "normalized": "jacceptetout",
    "category": 1
  },
  {
    "normalized": "showmoreaboutyourchoices",
    "category": 3
  },
  {
    "normalized": "refusenonessentialcookies",
    "category": 2
  },
  {
    "normalized": "newtotwitter",
    "category": 0
  },
  {
    "normalized": "signupwithapple",
    "category": 0
  },
  {
    "normalized": "createaccount",
    "category": 0
  },
  {
    "normalized": "cookieuse",
    "category": 0
  },
  {
    "normalized": "accessibility",
    "category": 0
  },
  {
    "normalized": "adsinfo",
    "category": 0
  },
  {
    "normalized": "dansk",
    "category": 0
  },
  {
    "normalized": "polski",
    "category": 0
  },
  {
    "normalized": "العربية",
    "category": 0
  },
  {
    "normalized": "føroyskt",
    "category": 0
  },
  {
    "normalized": "turkce",
    "category": 0
  },
  {
    "normalized": "deutsch",
    "category": 0
  },
  {
    "normalized": "romana",
    "category": 0
  },
  {
    "normalized": "francaisfrance",
    "category": 0
  },
  {
    "normalized": "espanol",
    "category": 0
  },
  {
    "normalized": "portuguesbrasil",
    "category": 0
  },
  {
    "normalized": "onlyallowessentialcookies",
    "category": 2
  },
  {
    "normalized": "allowessentialandoptionalcookies",
    "category": 1
  },
  {
    "normalized": "×",
    "category": 0
  },
  {
    "normalized": "refusertout",
    "category": 2
  },
  {
    "normalized": "afficherlesdetails",
    "category": 3
  },
  {
    "normalized": "nonmerci",
    "category": 2
  },
  {
    "normalized": "selectionnercertainescategories",
    "category": 8
  },
  {
    "normalized": "plus+",
    "category": 0
  },
  {
    "normalized": "plus",
    "category": 9
  },
  {
    "normalized": "precedent",
    "category": 0
  },
  {
    "normalized": "suivant",
    "category": 0
  },
  {
    "normalized": "acceptertouslescookies",
    "category": 1
  },
  {
    "normalized": "refusertouslescookies",
    "category": 2
  },
  {
    "normalized": "accepteretcontinuer",
    "category": 1
  },
  {
    "normalized": "refuseretcontinuer",
    "category": 2
  },
  {
    "normalized": "produits",
    "category": 0
  },
  {
    "normalized": "nouvelles",
    "category": 0
  },
  {
    "normalized": "transfertsrumeurs",
    "category": 0
  },
  {
    "normalized": "valeurs",
    "category": 0
  },
  {
    "normalized": "competitions",
    "category": 0
  },
  {
    "normalized": "forums",
    "category": 0
  },
  {
    "normalized": "montm",
    "category": 0
  },
  {
    "normalized": "direct",
    "category": 0
  },
  {
    "normalized": "stockeretouaccederadesinformationssurunterminal",
    "category": 0
  },
  {
    "normalized": "profildepublicitespersonnaliseesetaffichage",
    "category": 0
  },
  {
    "normalized": "mesuredeperformanceducontenuetdeveloppementproduit",
    "category": 0
  },
  {
    "normalized": "creerunprofilpourafficheruncontenupersonnalise",
    "category": 0
  },
  {
    "normalized": "selectionnerducontenupersonnalise",
    "category": 0
  },
  {
    "normalized": "utiliserdesdonneesdegeolocalisationprecises",
    "category": 0
  },
  {
    "normalized": "analyseractivementlescaracteristiquesduterminalpourlidentification",
    "category": 0
  },
  {
    "normalized": "mentionslegales",
    "category": 0
  },
  {
    "normalized": "protectiondesdonnees",
    "category": 0
  },
  {
    "normalized": "rechercher",
    "category": 0
  },
  {
    "normalized": "collectionpalaisroyal",
    "category": 0
  },
  {
    "normalized": "nouveautes",
    "category": 0
  },
  {
    "normalized": "vetements",
    "category": 0
  },
  {
    "normalized": "accessoires",
    "category": 0
  },
  {
    "normalized": "lamarque",
    "category": 0
  },
  {
    "normalized": "politiquecookiesetautrestraceurs",
    "category": 0
  },
  {
    "normalized": "personnaliservotrechoix",
    "category": 3
  },
  {
    "normalized": "terzepartiselezionate",
    "category": 0
  },
  {
    "normalized": "finalitapubblicitarie",
    "category": 0
  },
  {
    "normalized": "fornitori",
    "category": 0
  },
  {
    "normalized": "piuopzioni",
    "category": 3
  },
  {
    "normalized": "continuewithoutaccepting",
    "category": 2
  },
  {
    "normalized": "personalizzacookie",
    "category": 3
  },
  {
    "normalized": "rifiutaechiudi",
    "category": 2
  },
  {
    "normalized": "preferenze",
    "category": 3
  },
  {
    "normalized": "rifiutatuttiicookie",
    "category": 2
  },
  {
    "normalized": "calciomercato",
    "category": 0
  },
  {
    "normalized": "valoridimercato",
    "category": 0
  },
  {
    "normalized": "database",
    "category": 0
  },
  {
    "normalized": "miotm",
    "category": 0
  },
  {
    "normalized": "indiretta",
    "category": 0
  },
  {
    "normalized": "annuncibasiciprofilodiannuncipersonalizzatievalutazionedellannuncio",
    "category": 0
  },
  {
    "normalized": "contenutipersonalizzativalutazionedeicontenutieosservazionidelpubblico",
    "category": 0
  },
  {
    "normalized": "selezionareannuncipersonalizzati",
    "category": 0
  },
  {
    "normalized": "sviluppareeperfezionareiprodotti",
    "category": 0
  },
  {
    "normalized": "gestireleimpostazioni",
    "category": 3
  },
  {
    "normalized": "informazionilegali",
    "category": 0
  },
  {
    "normalized": "trattamentodeidati",
    "category": 0
  },
  {
    "normalized": "voli",
    "category": 0
  },
  {
    "normalized": "magazine",
    "category": 0
  },
  {
    "normalized": "preferiti",
    "category": 9
  },
  {
    "normalized": "abbattiiprezziconidealoscopricomerisparmiare",
    "category": 0
  },
  {
    "normalized": "da109500samsunggalaxys23ultra512gbnerosmartphone5g",
    "category": 0
  },
  {
    "normalized": "da22690appleairpodspro2cuffiebluetoothvotomedio910",
    "category": 0
  },
  {
    "normalized": "da7987adidascampus00ssneakerslowtop",
    "category": 0
  },
  {
    "normalized": "da2490serestocollareantiparassitariocanida8kgprodottoantipulci2",
    "category": 0
  },
  {
    "normalized": "ulteriorioffertedelgiorno",
    "category": 0
  },
  {
    "normalized": "fornitoridiserviziterzi",
    "category": 0
  },
  {
    "normalized": "rifiutaicookieopzionali",
    "category": 2
  },
  {
    "normalized": "privacy",
    "category": 0
  },
  {
    "normalized": "contatti",
    "category": 0
  },
  {
    "normalized": "sologliessenziali",
    "category": 2
  },
  {
    "normalized": "impostapreferenze",
    "category": 3
  },
  {
    "normalized": "modificaleimpostazionisullaprivacy",
    "category": 3
  },
  {
    "normalized": "accettoleimpostazionisullaprivacy",
    "category": 1
  },
  {
    "normalized": "preferenzedeicookie",
    "category": 3
  },
  {
    "normalized": "continua",
    "category": 1
  },
  {
    "normalized": "weather10c",
    "category": 0
  },
  {
    "normalized": "menu",
    "category": 0
  },
  {
    "normalized": "entertainment",
    "category": 0
  },
  {
    "normalized": "business",
    "category": 0
  },
  {
    "normalized": "lifestyle",
    "category": 0
  },
  {
    "normalized": "culture",
    "category": 0
  },
  {
    "normalized": "player",
    "category": 0
  },
  {
    "normalized": "tv",
    "category": 0
  },
  {
    "normalized": "radio",
    "category": 0
  },
  {
    "normalized": "customize",
    "category": 3
  },
  {
    "normalized": "allowallcookies",
    "category": 1
  },
  {
    "normalized": "savepreferencesandexit",
    "category": 4
  },
  {
    "normalized": "declineall",
    "category": 2
  },
  {
    "normalized": "managecookiesettings",
    "category": 3
  },
  {
    "normalized": "managemycookies",
    "category": 3
  },
  {
    "normalized": "continuewithoutagreeing→",
    "category": 2
  },
  {
    "normalized": "learnmore→",
    "category": 3
  },
  {
    "normalized": "agreeandclose",
    "category": 1
  },
  {
    "normalized": "premierleague",
    "category": 0
  },
  {
    "normalized": "championsleague",
    "category": 0
  },
  {
    "normalized": "nfldraft",
    "category": 0
  },
  {
    "normalized": "wwebacklash",
    "category": 0
  },
  {
    "normalized": "azerbaijangrandprix",
    "category": 0
  },
  {
    "normalized": "deny",
    "category": 2
  },
  {
    "normalized": "allowselection",
    "category": 4
  },
  {
    "normalized": "allowall",
    "category": 1
  },
  {
    "normalized": "explore",
    "category": 0
  },
  {
    "normalized": "create",
    "category": 0
  },
  {
    "normalized": "manageconsent",
    "category": 3
  },
  {
    "normalized": "acceptandclose",
    "category": 1
  },
  {
    "normalized": "gotit",
    "category": 1
  },
  {
    "normalized": "useprecisegeolocationdata",
    "category": 0
  },
  {
    "normalized": "activelyscandevicecharacteristicsforidentification",
    "category": 0
  },
  {
    "normalized": "options",
    "category": 3
  },
  {
    "normalized": "viewalistofpartners",
    "category": 0
  },
  {
    "normalized": "agreeandproceed",
    "category": 1
  },
  {
    "normalized": "cookiesusedonoursite",
    "category": 0
  },
  {
    "normalized": "aceptar",
    "category": 1
  },
  {
    "normalized": "terzeparti",
    "category": 0
  },
  {
    "normalized": "acceptcookies",
    "category": 1
  },
  {
    "normalized": "aceptarycerrar",
    "category": 1
  },
  {
    "normalized": "mostradettagli",
    "category": 3
  },
  {
    "normalized": "drittanbietern",
    "category": 9
  },
  {
    "normalized": "drittanbieter",
    "category": 0
  },
  {
    "normalized": "aprisottomenu",
    "category": 3
  },
  {
    "normalized": "acepto",
    "category": 1
  },
  {
    "normalized": "homme",
    "category": 0
  },
  {
    "normalized": "nome",
    "category": 0
  },
  {
    "normalized": "home",
    "category": 9
  },
  {
    "normalized": "masopciones",
    "category": 3
  },
  {
    "normalized": "trans",
    "category": 9
  },
  {
    "normalized": "indietro",
    "category": 9
  },
  {
    "normalized": "nostripartner",
    "category": 0
  },
  {
    "normalized": "socios",
    "category": 0
  },
  {
    "normalized": "configurar",
    "category": 3
  },
  {
    "normalized": "impostazionicookie",
    "category": 3
  },
  {
    "normalized": "anmelden",
    "category": 0
  },
  {
    "normalized": "managepreferences",
    "category": 3
  },
  {
    "normalized": "nonaccetto",
    "category": 2
  },
  {
    "normalized": "voirnospartenaires",
    "category": 0
  },
  {
    "normalized": "politiquedeconfidentialite",
    "category": 0
  },
  {
    "normalized": "buildabet",
    "category": 0
  },
  {
    "normalized": "auto",
    "category": 0
  },
  {
    "normalized": "datenschutz",
    "category": 0
  },
  {
    "normalized": "refuser",
    "category": 2
  },
  {
    "normalized": "acceptclose",
    "category": 1
  },
  {
    "normalized": "aceptarcookies",
    "category": 1
  },
  {
    "normalized": "couples",
    "category": 0
  },
  {
    "normalized": "consent",
    "category": 1
  },
  {
    "normalized": "suche",
    "category": 0
  },
  {
    "normalized": "faq",
    "category": 0
  },
  {
    "normalized": "jaccepte",
    "category": 1
  },
  {
    "normalized": "gestiscileopzioni",
    "category": 3
  },
  {
    "normalized": "configuraciondecookies",
    "category": 3
  },
  {
    "normalized": "aceptartodaslascookies",
    "category": 1
  },
  {
    "normalized": "rifiutatutti",
    "category": 2
  },
  {
    "normalized": "frauen",
    "category": 0
  },
  {
    "normalized": "manner",
    "category": 0
  },
  {
    "normalized": "thirdpartyvendors",
    "category": 0
  },
  {
    "normalized": "fußball",
    "category": 0
  },
  {
    "normalized": "deals",
    "category": 0
  },
  {
    "normalized": "masinformacion→",
    "category": 3
  },
  {
    "normalized": "configuration",
    "category": 3
  },
  {
    "normalized": "opzionicookie",
    "category": 3
  },
  {
    "normalized": "unterhaltung",
    "category": 0
  },
  {
    "normalized": "spiele",
    "category": 0
  },
  {
    "normalized": "startseite",
    "category": 0
  },
  {
    "normalized": "search",
    "category": 0
  },
  {
    "normalized": "parchen",
    "category": 0
  },
  {
    "normalized": "transsexuelle",
    "category": 0
  },
  {
    "normalized": "pannellodellepreferenze",
    "category": 3
  },
  {
    "normalized": "mostrardetalles",
    "category": 3
  },
  {
    "normalized": "tvstream",
    "category": 0
  },
  {
    "normalized": "infoszubildplus",
    "category": 0
  },
  {
    "normalized": "mediathek",
    "category": 0
  },
  {
    "normalized": "bildshop",
    "category": 0
  },
  {
    "normalized": "zeitung",
    "category": 0
  },
  {
    "normalized": "regio",
    "category": 0
  },
  {
    "normalized": "sexliebe",
    "category": 0
  },
  {
    "normalized": "football",
    "category": 0
  },
  {
    "normalized": "personnaliservoschoix",
    "category": 3
  },
  {
    "normalized": "privacycenter",
    "category": 8
  },
  {
    "normalized": "nutzungsbedingungen",
    "category": 0
  },
  {
    "normalized": "gestiscipreferenze",
    "category": 3
  },
  {
    "normalized": "pannelloopzionicookie",
    "category": 3
  },
  {
    "normalized": "en",
    "category": 0
  },
  {
    "normalized": "services",
    "category": 0
  },
  {
    "normalized": "jetztanmelden",
    "category": 0
  },
  {
    "normalized": "bundesliga",
    "category": 0
  },
  {
    "normalized": "pannellodellepreferenzepubblicitarie",
    "category": 3
  },
  {
    "normalized": "localiser",
    "category": 9
  },
  {
    "normalized": "following00",
    "category": 0
  },
  {
    "normalized": "celien",
    "category": 9
  },
  {
    "normalized": "cookiesakzeptieren",
    "category": 1
  },
  {
    "normalized": "milf",
    "category": 0
  },
  {
    "normalized": "aceptartodo",
    "category": 1
  },
  {
    "normalized": "reject",
    "category": 2
  },
  {
    "normalized": "rechazar",
    "category": 2
  },
  {
    "normalized": "sespartenaires",
    "category": 0
  },
  {
    "normalized": "fremdinhalteanzeigensozialenetzwerkevideos",
    "category": 0
  },
  {
    "normalized": "gerermeschoix",
    "category": 3
  },
  {
    "normalized": "voirletelephone",
    "category": 0
  },
  {
    "normalized": "nuestrossocios",
    "category": 0
  },
  {
    "normalized": "viewour4partners",
    "category": 8
  },
  {
    "normalized": "viewourpartners",
    "category": 0
  },
  {
    "normalized": "fornitoriterzi",
    "category": 0
  },
  {
    "normalized": "acconsento",
    "category": 1
  },
  {
    "normalized": "fournisseurstiers",
    "category": 0
  },
  {
    "normalized": "gerervospreferences",
    "category": 3
  },
  {
    "normalized": "termsofuse",
    "category": 0
  },
  {
    "normalized": "gerermescookies",
    "category": 3
  },
  {
    "normalized": "ici",
    "category": 0
  },
  {
    "normalized": "politicadecookies",
    "category": 0
  },
  {
    "normalized": "enter",
    "category": 9
  },
  {
    "normalized": "rejectallcookies",
    "category": 2
  },
  {
    "normalized": "personalisedads",
    "category": 0
  },
  {
    "normalized": "personalisedcontent",
    "category": 0
  },
  {
    "normalized": "adandcontentmeasurementaudienceinsightsandproductdevelopment",
    "category": 0
  },
  {
    "normalized": "usasoloicookienecessari",
    "category": 2
  },
  {
    "normalized": "rechazartodo",
    "category": 2
  },
  {
    "normalized": "mujeres",
    "category": 0
  },
  {
    "normalized": "hombres",
    "category": 0
  },
  {
    "normalized": "actu",
    "category": 0
  },
  {
    "normalized": "moto",
    "category": 0
  },
  {
    "normalized": "marques",
    "category": 0
  },
  {
    "normalized": "parametresdescookies",
    "category": 3
  },
  {
    "normalized": "consentementscertifiespar",
    "category": 9
  },
  {
    "normalized": "filles",
    "category": 0
  },
  {
    "normalized": "hommes",
    "category": 0
  },
  {
    "normalized": "nurnotwendigecookies",
    "category": 2
  },
  {
    "normalized": "males",
    "category": 0
  },
  {
    "normalized": "all",
    "category": 0
  },
  {
    "normalized": "females",
    "category": 0
  },
  {
    "normalized": "exit",
    "category": 0
  },
  {
    "normalized": "ragazze",
    "category": 0
  },
  {
    "normalized": "transessuali",
    "category": 0
  },
  {
    "normalized": "verwendungundweitergabevonnutzerkennungenzuwerbezwecken",
    "category": 0
  },
  {
    "normalized": "formula1",
    "category": 0
  },
  {
    "normalized": "tennis",
    "category": 0
  },
  {
    "normalized": "handball",
    "category": 0
  },
  {
    "normalized": "basketball",
    "category": 0
  },
  {
    "normalized": "close",
    "category": 1
  },
  {
    "normalized": "espaceclient",
    "category": 0
  },
  {
    "normalized": "nothanks",
    "category": 2
  },
  {
    "normalized": "feedback",
    "category": 0
  },
  {
    "normalized": "configurarcookies",
    "category": 3
  },
  {
    "normalized": "girls",
    "category": 0
  },
  {
    "normalized": "guys",
    "category": 0
  },
  {
    "normalized": "einstellungsmenu",
    "category": 3
  },
  {
    "normalized": "plusdoptions",
    "category": 3
  },
  {
    "normalized": "auswahlbestatigen",
    "category": 4
  },
  {
    "normalized": "aktuelles",
    "category": 0
  },
  {
    "normalized": "privatsphare",
    "category": 0
  },
  {
    "normalized": "genauestandortdatenundabfragevongerateeigenschaftenzuridentifikation",
    "category": 0
  },
  {
    "normalized": "personalizecookies",
    "category": 3
  },
  {
    "normalized": "autoriser",
    "category": 0
  },
  {
    "normalized": "solocookienecessari",
    "category": 2
  },
  {
    "normalized": "didattica",
    "category": 0
  },
  {
    "normalized": "feed",
    "category": 0
  },
  {
    "normalized": "alleansehen",
    "category": 9
  },
  {
    "normalized": "emillybronte",
    "category": 0
  },
  {
    "normalized": "sexgreat",
    "category": 0
  },
  {
    "normalized": "gay",
    "category": 0
  },
  {
    "normalized": "proveedoresexternos",
    "category": 0
  },
  {
    "normalized": "consentir",
    "category": 1
  },
  {
    "normalized": "cliccaqui",
    "category": 0
  },
  {
    "normalized": "aceptartodas",
    "category": 1
  },
  {
    "normalized": "continuarsinaceptar",
    "category": 2
  },
  {
    "normalized": "politicadeprivacidad",
    "category": 0
  },
  {
    "normalized": "parejas",
    "category": 0
  },
  {
    "normalized": "essais",
    "category": 0
  },
  {
    "normalized": "guidedachat",
    "category": 0
  },
  {
    "normalized": "electriques",
    "category": 0
  },
  {
    "normalized": "hybrides",
    "category": 0
  },
  {
    "normalized": "teave",
    "category": 3
  },
  {
    "normalized": "leave",
    "category": 0
  },
  {
    "normalized": "jechoisis",
    "category": 3
  },
  {
    "normalized": "transsexuels",
    "category": 0
  },
  {
    "normalized": "donotconsent",
    "category": 2
  },
  {
    "normalized": "okacceptall",
    "category": 1
  },
  {
    "normalized": "denyallcookies",
    "category": 2
  },
  {
    "normalized": "coppie",
    "category": 0
  },
  {
    "normalized": "cliquantici",
    "category": 0
  },
  {
    "normalized": "jetztbildpurabonnieren",
    "category": 0
  },
  {
    "normalized": "3liga",
    "category": 0
  },
  {
    "normalized": "bestatigen",
    "category": 8
  },
  {
    "normalized": "agences",
    "category": 0
  },
  {
    "normalized": "ouvriruncompte",
    "category": 0
  },
  {
    "normalized": "epargner",
    "category": 4
  },
  {
    "normalized": "akceptujeiprzechodzedoserwisu",
    "category": 1
  },
  {
    "normalized": "groupevivendi",
    "category": 0
  },
  {
    "normalized": "nossocietesaffilieesdugroupevivendi",
    "category": 0
  },
  {
    "normalized": "pourensavoirplus",
    "category": 3
  },
  {
    "normalized": "prismamedia",
    "category": 0
  },
  {
    "normalized": "parametrervoscookies",
    "category": 1
  },
  {
    "normalized": "chartecookies",
    "category": 0
  },
  {
    "normalized": "akzeptierenschließen",
    "category": 1
  },
  {
    "normalized": "motorbikes",
    "category": 0
  },
  {
    "normalized": "mybets",
    "category": 0
  },
  {
    "normalized": "deutschlandalleflughafen",
    "category": 0
  },
  {
    "normalized": "nonaccettareechiudi",
    "category": 2
  },
  {
    "normalized": "noacepto",
    "category": 2
  },
  {
    "normalized": "accederavotreterminal",
    "category": 0
  },
  {
    "normalized": "toutaccepteretcontinuer",
    "category": 1
  },
  {
    "normalized": "parametrervoschoix",
    "category": 3
  },
  {
    "normalized": "disagreeandclose",
    "category": 2
  },
  {
    "normalized": "alleauswahlen",
    "category": 1
  },
  {
    "normalized": "immobilien",
    "category": 0
  },
  {
    "normalized": "zurmeldung",
    "category": 0
  },
  {
    "normalized": "genauestandortdatenverwenden",
    "category": 0
  },
  {
    "normalized": "gerateeigenschaftenzuridentifikationaktivabfragen",
    "category": 0
  },
  {
    "normalized": "vernuestrossocios",
    "category": 0
  },
  {
    "normalized": "gutscheine",
    "category": 0
  },
  {
    "normalized": "auswahlspeichern",
    "category": 4
  },
  {
    "normalized": "privacycookies",
    "category": 0
  },
  {
    "normalized": "imokwiththat",
    "category": 1
  },
  {
    "normalized": "aqui",
    "category": 8
  },
  {
    "normalized": "getmore",
    "category": 0
  },
  {
    "normalized": "featured",
    "category": 0
  },
  {
    "normalized": "women",
    "category": 0
  },
  {
    "normalized": "okgotit",
    "category": 1
  },
  {
    "normalized": "jaicompris",
    "category": 1
  },
  {
    "normalized": "rubrica",
    "category": 0
  },
  {
    "normalized": "servizionline",
    "category": 0
  },
  {
    "normalized": "lamiaemail",
    "category": 0
  },
  {
    "normalized": "condividi",
    "category": 0
  },
  {
    "normalized": "akzeptierenundfortfahren",
    "category": 1
  },
  {
    "normalized": "vrcams",
    "category": 0
  },
  {
    "normalized": "teen18+",
    "category": 0
  },
  {
    "normalized": "granny",
    "category": 0
  },
  {
    "normalized": "anaisbloom",
    "category": 0
  },
  {
    "normalized": "christynaross",
    "category": 0
  },
  {
    "normalized": "xvideos",
    "category": 0
  },
  {
    "normalized": "parentsreadthistoprotectyourkids",
    "category": 0
  },
  {
    "normalized": "permitirtodas",
    "category": 1
  },
  {
    "normalized": "gestionaropciones",
    "category": 3
  },
  {
    "normalized": "rezepte",
    "category": 0
  },
  {
    "normalized": "listofpartnersvendors",
    "category": 0
  },
  {
    "normalized": "preferencesdecookies",
    "category": 3
  },
  {
    "normalized": "refuserlescookies",
    "category": 2
  },
  {
    "normalized": "accepterlescookies",
    "category": 1
  },
  {
    "normalized": "autorisertouslescookies",
    "category": 1
  },
  {
    "normalized": "sabonner",
    "category": 0
  },
  {
    "normalized": "okpourmoi",
    "category": 1
  },
  {
    "normalized": "datenubermittlunganpartneraußerhalbdereuewrdrittlandstransfer",
    "category": 0
  },
  {
    "normalized": "ulterioriinformazioni→",
    "category": 3
  },
  {
    "normalized": "yesiagree",
    "category": 1
  },
  {
    "normalized": "setcookiepreferences",
    "category": 3
  },
  {
    "normalized": "nosconseils",
    "category": 0
  },
  {
    "normalized": "stars",
    "category": 0
  },
  {
    "normalized": "royals",
    "category": 0
  },
  {
    "normalized": "accettacookie",
    "category": 1
  },
  {
    "normalized": "informativasullaprivacy",
    "category": 0
  },
  {
    "normalized": "manageyourcookies",
    "category": 3
  },
  {
    "normalized": "einstellungenanpassen",
    "category": 3
  },
  {
    "normalized": "manage",
    "category": 3
  },
  {
    "normalized": "handy",
    "category": 0
  },
  {
    "normalized": "next",
    "category": 0
  },
  {
    "normalized": "sientrar",
    "category": 1
  },
  {
    "normalized": "fcaugsburg",
    "category": 0
  },
  {
    "normalized": "onlyuseessentialcookies",
    "category": 2
  },
  {
    "normalized": "usenecessarycookiesonly",
    "category": 2
  },
  {
    "normalized": "customisecookies",
    "category": 3
  },
  {
    "normalized": "decouvrir",
    "category": 0
  },
  {
    "normalized": "thatsfine",
    "category": 1
  },
  {
    "normalized": "podcasts",
    "category": 0
  },
  {
    "normalized": "popmaster",
    "category": 0
  },
  {
    "normalized": "frankskinnerspoetrypodcast",
    "category": 0
  },
  {
    "normalized": "stayingrelevant",
    "category": 0
  },
  {
    "normalized": "timslisteningparty",
    "category": 0
  },
  {
    "normalized": "footballuntold",
    "category": 0
  },
  {
    "normalized": "joannalumleythemaestro",
    "category": 0
  },
  {
    "normalized": "decouvrirsg",
    "category": 0
  },
  {
    "normalized": "gestiscicookies",
    "category": 3
  },
  {
    "normalized": "live",
    "category": 0
  },
  {
    "normalized": "politiquecookies",
    "category": 0
  },
  {
    "normalized": "allowcookies",
    "category": 1
  },
  {
    "normalized": "trustedpartners",
    "category": 0
  },
  {
    "normalized": "customisechoices",
    "category": 3
  },
  {
    "normalized": "acceptallvisitthesite",
    "category": 1
  },
  {
    "normalized": "configure",
    "category": 3
  },
  {
    "normalized": "dax",
    "category": 0
  },
  {
    "normalized": "dowjones",
    "category": 0
  },
  {
    "normalized": "tecdax",
    "category": 0
  },
  {
    "normalized": "letmechoose",
    "category": 3
  },
  {
    "normalized": "augsburg",
    "category": 0
  },
  {
    "normalized": "iacceptandillcontinuebrowsing",
    "category": 1
  },
  {
    "normalized": "cookieindstilinger",
    "category": 3
  },
  {
    "normalized": "mehr",
    "category": 3
  },
  {
    "normalized": "femme",
    "category": 0
  },
  {
    "normalized": "agreeclose",
    "category": 1
  },
  {
    "normalized": "mavoiture",
    "category": 0
  },
  {
    "normalized": "polizeibericht",
    "category": 0
  },
  {
    "normalized": "biowetter",
    "category": 0
  },
  {
    "normalized": "prospekte",
    "category": 0
  },
  {
    "normalized": "benzinpreise",
    "category": 0
  },
  {
    "normalized": "dieselpreise",
    "category": 0
  },
  {
    "normalized": "affiliatesandpartners",
    "category": 0
  },
  {
    "normalized": "koln",
    "category": 0
  },
  {
    "normalized": "auswahleinfacheranzeigen",
    "category": 9
  },
  {
    "normalized": "einpersonalisiertesanzeigenprofilerstellen",
    "category": 0
  },
  {
    "normalized": "personalisierteanzeigenauswahlen",
    "category": 0
  },
  {
    "normalized": "einpersonalisiertesinhaltsprofilerstellen",
    "category": 0
  },
  {
    "normalized": "personalisierteinhalteauswahlen",
    "category": 0
  },
  {
    "normalized": "anzeigenleistungmessen",
    "category": 0
  },
  {
    "normalized": "inhalteleistungmessen",
    "category": 0
  },
  {
    "normalized": "marktforschungeinsetzenumerkenntnisseuberzielgruppenzugewinnen",
    "category": 0
  },
  {
    "normalized": "produkteentwickelnundverbessern",
    "category": 0
  },
  {
    "normalized": "focusprompt",
    "category": 0
  },
  {
    "normalized": "jetztabonnieren",
    "category": 0
  },
  {
    "normalized": "einstellungenablehnen",
    "category": 3
  },
  {
    "normalized": "marketing",
    "category": 0
  },
  {
    "normalized": "nurerforderlichecookies",
    "category": 2
  },
  {
    "normalized": "servicefunktionen",
    "category": 0
  },
  {
    "normalized": "myoptions",
    "category": 3
  },
  {
    "normalized": "gestionarcookies",
    "category": 3
  },
  {
    "normalized": "13",
    "category": 0
  },
  {
    "normalized": "almacenaroaccederainformacionenundispositivo",
    "category": 0
  },
  {
    "normalized": "aceptarycontinuar",
    "category": 1
  },
  {
    "normalized": "fermer",
    "category": 8
  },
  {
    "normalized": "rechazarlastodas",
    "category": 2
  },
  {
    "normalized": "consultalanostracookiepolicy",
    "category": 8
  },
  {
    "normalized": "intranetdateneo",
    "category": 0
  },
  {
    "normalized": "ilmioportale",
    "category": 0
  },
  {
    "normalized": "it",
    "category": 0
  },
  {
    "normalized": "ateneo",
    "category": 0
  },
  {
    "normalized": "ricerca",
    "category": 0
  },
  {
    "normalized": "terzamissione",
    "category": 0
  },
  {
    "normalized": "internazionale",
    "category": 0
  },
  {
    "normalized": "servizieopportunita",
    "category": 0
  },
  {
    "normalized": "iscriversistudiarelaurearsi",
    "category": 0
  },
  {
    "normalized": "laureeelaureemagistrali",
    "category": 0
  },
  {
    "normalized": "insegnamenti",
    "category": 0
  },
  {
    "normalized": "masteruniversitari",
    "category": 0
  },
  {
    "normalized": "dottoratidiricerca",
    "category": 0
  },
  {
    "normalized": "scuoledispecializzazione",
    "category": 0
  },
  {
    "normalized": "corsidialtaformazione",
    "category": 0
  },
  {
    "normalized": "summerewinterschool",
    "category": 0
  },
  {
    "normalized": "educationprogettiinternazionali",
    "category": 0
  },
  {
    "normalized": "formazioneinsegnanti",
    "category": 0
  },
  {
    "normalized": "innovazionedidattica",
    "category": 0
  },
  {
    "normalized": "esamidistato",
    "category": 0
  },
  {
    "normalized": "vuoiiscrivertiallaa20232024",
    "category": 0
  },
  {
    "normalized": "seiiscritto",
    "category": 0
  },
  {
    "normalized": "ambito",
    "category": 0
  },
  {
    "normalized": "tipodicorso",
    "category": 0
  },
  {
    "normalized": "campus",
    "category": 0
  },
  {
    "normalized": "lingua",
    "category": 0
  },
  {
    "normalized": "dipartimento",
    "category": 0
  },
  {
    "normalized": "continuewithrecommendedcookies",
    "category": 8
  },
  {
    "normalized": "vendorlist",
    "category": 0
  },
  {
    "normalized": "cookiespersonalisieren",
    "category": 3
  },
  {
    "normalized": "mehrerfahren",
    "category": 0
  },
  {
    "normalized": "transperson",
    "category": 0
  },
  {
    "normalized": "datenschutzrichtlinien",
    "category": 0
  },
  {
    "normalized": "18usc2257recordkeepingrequirementscompliancestatementkonformitatserklarung",
    "category": 0
  },
  {
    "normalized": "ichbinuber18",
    "category": 0
  },
  {
    "normalized": "hierverlassen",
    "category": 0
  },
  {
    "normalized": "topmodels",
    "category": 0
  },
  {
    "normalized": "gratiskontoerstellen",
    "category": 0
  },
  {
    "normalized": "einloggen",
    "category": 0
  },
  {
    "normalized": "empfohlen",
    "category": 0
  },
  {
    "normalized": "meinefavoriten",
    "category": 0
  },
  {
    "normalized": "verlauf",
    "category": 0
  },
  {
    "normalized": "ukrainisch",
    "category": 0
  },
  {
    "normalized": "neuemodels",
    "category": 0
  },
  {
    "normalized": "fetisch",
    "category": 0
  },
  {
    "normalized": "aufnahmemoglich",
    "category": 0
  },
  {
    "normalized": "jung22+",
    "category": 0
  },
  {
    "normalized": "reif",
    "category": 0
  },
  {
    "normalized": "arabisch",
    "category": 0
  },
  {
    "normalized": "asiatisch",
    "category": 0
  },
  {
    "normalized": "dunkelhautig",
    "category": 0
  },
  {
    "normalized": "indisch",
    "category": 0
  },
  {
    "normalized": "lateinamerikanisch",
    "category": 0
  },
  {
    "normalized": "weiß",
    "category": 0
  },
  {
    "normalized": "allekategorien+",
    "category": 0
  },
  {
    "normalized": "deutschesexcams",
    "category": 0
  },
  {
    "normalized": "kairakampen",
    "category": 0
  },
  {
    "normalized": "teenlanalya",
    "category": 0
  },
  {
    "normalized": "hotmilfbitch",
    "category": 0
  },
  {
    "normalized": "dorideluxe66",
    "category": 0
  },
  {
    "normalized": "adyaaly",
    "category": 0
  },
  {
    "normalized": "sissivienna",
    "category": 0
  },
  {
    "normalized": "gymbunnyoffi",
    "category": 0
  },
  {
    "normalized": "leahobscure",
    "category": 0
  },
  {
    "normalized": "passiongirlx",
    "category": 0
  },
  {
    "normalized": "carmenmonroe",
    "category": 0
  },
  {
    "normalized": "lexicoco",
    "category": 0
  },
  {
    "normalized": "lissababe1",
    "category": 0
  },
  {
    "normalized": "kathysecret",
    "category": 0
  },
  {
    "normalized": "melinastyles",
    "category": 0
  },
  {
    "normalized": "curvysarah",
    "category": 0
  },
  {
    "normalized": "mehrsehen",
    "category": 9
  },
  {
    "normalized": "holyhelen",
    "category": 0
  },
  {
    "normalized": "cookiesrichtlinien",
    "category": 0
  },
  {
    "normalized": "setup",
    "category": 0
  },
  {
    "normalized": "continuewithadsfreeofcharge",
    "category": 8
  },
  {
    "normalized": "aktionen",
    "category": 0
  },
  {
    "normalized": "shop",
    "category": 0
  },
  {
    "normalized": "externeinhalte",
    "category": 0
  },
  {
    "normalized": "personalizarcookies",
    "category": 3
  },
  {
    "normalized": "↓1servicio",
    "category": 0
  },
  {
    "normalized": "storagepreferences",
    "category": 0
  },
  {
    "normalized": "thirdparties",
    "category": 0
  },
  {
    "normalized": "sale",
    "category": 0
  },
  {
    "normalized": "sale",
    "category": 0
  },
  {
    "normalized": "save",
    "category": 4
  },
  {
    "normalized": "iniciarsesion",
    "category": 0
  },
  {
    "normalized": "arabes",
    "category": 0
  },
  {
    "normalized": "latina",
    "category": 0
  },
  {
    "normalized": "vertodo",
    "category": 9
  },
  {
    "normalized": "emeliblur",
    "category": 0
  },
  {
    "normalized": "ajustes",
    "category": 3
  },
  {
    "normalized": "confirmsuggestedpreferences",
    "category": 8
  },
  {
    "normalized": "changepreferences",
    "category": 3
  },
  {
    "normalized": "ichstimmezu",
    "category": 1
  },
  {
    "normalized": "charteenmatieredecookies",
    "category": 0
  },
  {
    "normalized": "jenaccepterien",
    "category": 1
  },
  {
    "normalized": "englishus",
    "category": 0
  },
  {
    "normalized": "personnaliserlescookies",
    "category": 3
  },
  {
    "normalized": "mesfavoris",
    "category": 0
  },
  {
    "normalized": "voirtout",
    "category": 9
  },
  {
    "normalized": "marybrent",
    "category": 0
  },
  {
    "normalized": "viviancurly",
    "category": 0
  },
  {
    "normalized": "lustiges",
    "category": 0
  },
  {
    "normalized": "digitalbilder",
    "category": 0
  },
  {
    "normalized": "newsletter",
    "category": 0
  },
  {
    "normalized": "gutefragejpg",
    "category": 0
  },
  {
    "normalized": "musik",
    "category": 0
  },
  {
    "normalized": "detailedsettings",
    "category": 3
  },
  {
    "normalized": "administrercookiesogfamereatvide",
    "category": 3
  },
  {
    "normalized": "godkend",
    "category": 1
  },
  {
    "normalized": "ferienwohnung",
    "category": 0
  },
  {
    "normalized": "biszu55sparen",
    "category": 0
  },
  {
    "normalized": "flughotel",
    "category": 0
  },
  {
    "normalized": "conseils",
    "category": 0
  },
  {
    "normalized": "tousnosconseils",
    "category": 0
  },
  {
    "normalized": "vendre",
    "category": 0
  },
  {
    "normalized": "jerefuse",
    "category": 2
  },
  {
    "normalized": "leggidipiu",
    "category": 3
  },
  {
    "normalized": "fetishes",
    "category": 0
  },
  {
    "normalized": "mature",
    "category": 0
  },
  {
    "normalized": "veditutto",
    "category": 9
  },
  {
    "normalized": "personalizar",
    "category": 3
  },
  {
    "normalized": "verwendungdernetid",
    "category": 0
  },
  {
    "normalized": "даясогласен",
    "category": 1
  },
  {
    "normalized": "personalisiertesanzeigenprofilundeinblendung",
    "category": 0
  },
  {
    "normalized": "formel1",
    "category": 0
  },
  {
    "normalized": "corona",
    "category": 0
  },
  {
    "normalized": "ernahrung",
    "category": 0
  },
  {
    "normalized": "haufiggestelltenfragenfaqs",
    "category": 0
  },
  {
    "normalized": "volksakku",
    "category": 0
  },
  {
    "normalized": "enregistrer",
    "category": 0
  },
  {
    "normalized": "zustimmenweiter",
    "category": 1
  },
  {
    "normalized": "moreinformation",
    "category": 3
  },
  {
    "normalized": "listadodesocios",
    "category": 0
  },
  {
    "normalized": "bild",
    "category": 0
  },
  {
    "normalized": "vfbstuttgart",
    "category": 0
  },
  {
    "normalized": "hamburgersv",
    "category": 0
  },
  {
    "normalized": "fcstpauli",
    "category": 0
  },
  {
    "normalized": "svdarmstadt98",
    "category": 0
  },
  {
    "normalized": "karlsruhersc",
    "category": 0
  },
  {
    "normalized": "hallescherfc",
    "category": 0
  },
  {
    "normalized": "vflosnabruck",
    "category": 0
  },
  {
    "normalized": "arsenalfc",
    "category": 0
  },
  {
    "normalized": "southamptonfc",
    "category": 0
  },
  {
    "normalized": "seemore",
    "category": 9
  },
  {
    "normalized": "jetzt",
    "category": 0
  },
  {
    "normalized": "2015",
    "category": 0
  },
  {
    "normalized": "2200",
    "category": 0
  },
  {
    "normalized": "anderezeit",
    "category": 0
  },
  {
    "normalized": "cookienotice",
    "category": 0
  },
  {
    "normalized": "gestioneprivacy",
    "category": 0
  },
  {
    "normalized": "giaabbonatoaccedi",
    "category": 0
  },
  {
    "normalized": "rifiutaeabbonati",
    "category": 8
  },
  {
    "normalized": "sezioni",
    "category": 0
  },
  {
    "normalized": "support",
    "category": 0
  },
  {
    "normalized": "disagree",
    "category": 2
  },
  {
    "normalized": "necessary",
    "category": 8
  },
  {
    "normalized": "english",
    "category": 0
  },
  {
    "normalized": "preferenzecookie",
    "category": 3
  },
  {
    "normalized": "ichbin18oderalter",
    "category": 0
  },
  {
    "normalized": "mehroptionen",
    "category": 3
  },
  {
    "normalized": "customizeselection",
    "category": 3
  },
  {
    "normalized": "acceptandcontinue",
    "category": 1
  },
  {
    "normalized": "monespaceclient",
    "category": 0
  },
  {
    "normalized": "besoindaide",
    "category": 0
  },
  {
    "normalized": "sitesedffr",
    "category": 0
  },
  {
    "normalized": "choixquevousavezexprimesparailleurs",
    "category": 0
  },
  {
    "normalized": "emprunter",
    "category": 0
  },
  {
    "normalized": "assurer",
    "category": 0
  },
  {
    "normalized": "advertisingpreferences",
    "category": 0
  },
  {
    "normalized": "ukrainian",
    "category": 0
  },
  {
    "normalized": "testkaufberatung",
    "category": 0
  },
  {
    "normalized": "downloads",
    "category": 0
  },
  {
    "normalized": "specials",
    "category": 0
  },
  {
    "normalized": "chip365",
    "category": 0
  },
  {
    "normalized": "gerersonquotidien",
    "category": 0
  },
  {
    "normalized": "financer",
    "category": 0
  },
  {
    "normalized": "proteger",
    "category": 0
  },
  {
    "normalized": "annuairedesprofessionnels",
    "category": 0
  },
  {
    "normalized": "berechtigteninteresses",
    "category": 0
  },
  {
    "normalized": "fournisseurscertifiesiab",
    "category": 0
  },
  {
    "normalized": "politiquedescookies",
    "category": 0
  },
  {
    "normalized": "finspublicitaires",
    "category": 0
  },
  {
    "normalized": "jai18ansouplus",
    "category": 0
  },
  {
    "normalized": "editsettings",
    "category": 3
  },
  {
    "normalized": "continuaaccettandotutti",
    "category": 1
  },
  {
    "normalized": "modificapreferenze",
    "category": 3
  },
  {
    "normalized": "rifiutaicookienontecnici",
    "category": 2
  },
  {
    "normalized": "esploraskytg24skysportskyvideo",
    "category": 0
  },
  {
    "normalized": "promotions",
    "category": 0
  },
  {
    "normalized": "multibuilder",
    "category": 0
  },
  {
    "normalized": "azsportsafter",
    "category": 0
  },
  {
    "normalized": "favourites",
    "category": 0
  },
  {
    "normalized": "footballtoday",
    "category": 0
  },
  {
    "normalized": "footballspain",
    "category": 0
  },
  {
    "normalized": "europeanleagues",
    "category": 0
  },
  {
    "normalized": "atpbarcelona",
    "category": 0
  },
  {
    "normalized": "enhancedaccas",
    "category": 9
  },
  {
    "normalized": "priceboost",
    "category": 0
  },
  {
    "normalized": "calendar",
    "category": 0
  },
  {
    "normalized": "volleyball",
    "category": 0
  },
  {
    "normalized": "icehockey",
    "category": 0
  },
  {
    "normalized": "americanfootball",
    "category": 0
  },
  {
    "normalized": "laliga",
    "category": 0
  },
  {
    "normalized": "seriea",
    "category": 0
  },
  {
    "normalized": "ligue1",
    "category": 0
  },
  {
    "normalized": "betslip",
    "category": 0
  },
  {
    "normalized": "zumlernportal",
    "category": 0
  },
  {
    "normalized": "viewallstatuses",
    "category": 0
  },
  {
    "normalized": "ttmmjjjj",
    "category": 0
  },
  {
    "normalized": "kontakt",
    "category": 0
  },
  {
    "normalized": "canalivideo",
    "category": 0
  },
  {
    "normalized": "prev",
    "category": 0
  },
  {
    "normalized": "videoastromoonbinemortoa25anni",
    "category": 0
  },
  {
    "normalized": "sportingjuventus11golehighlights",
    "category": 0
  },
  {
    "normalized": "reglages",
    "category": 3
  },
  {
    "normalized": "accepttracking",
    "category": 1
  },
  {
    "normalized": "aceptarelseguimiento",
    "category": 8
  },
  {
    "normalized": "sezionedettagli",
    "category": 9
  },
  {
    "normalized": "rifiuta",
    "category": 2
  },
  {
    "normalized": "dollarkurs",
    "category": 0
  },
  {
    "normalized": "aktien",
    "category": 0
  },
  {
    "normalized": "thatsok",
    "category": 1
  },
  {
    "normalized": "privacynotice",
    "category": 0
  },
  {
    "normalized": "parametrermespreferences",
    "category": 3
  },
  {
    "normalized": "accountsandcards",
    "category": 0
  },
  {
    "normalized": "savingsandinvestment",
    "category": 0
  },
  {
    "normalized": "mortgagesandloans",
    "category": 0
  },
  {
    "normalized": "insurance",
    "category": 0
  },
  {
    "normalized": "cookieszulassen",
    "category": 1
  },
  {
    "normalized": "notakemetosettings",
    "category": 8
  },
  {
    "normalized": "advertisingcookienotice",
    "category": 0
  },
  {
    "normalized": "idonotagree",
    "category": 2
  },
  {
    "normalized": "winter",
    "category": 0
  },
  {
    "normalized": "sommer",
    "category": 0
  },
  {
    "normalized": "mehranzeigen",
    "category": 3
  },
  {
    "normalized": "dataprotection",
    "category": 0
  },
  {
    "normalized": "adstorage",
    "category": 0
  },
  {
    "normalized": "analyticsstorage",
    "category": 0
  },
  {
    "normalized": "lingerie",
    "category": 0
  },
  {
    "normalized": "maison",
    "category": 0
  },
  {
    "normalized": "chaussures",
    "category": 0
  },
  {
    "normalized": "panier",
    "category": 0
  },
  {
    "normalized": "agreetoallcookies",
    "category": 1
  },
  {
    "normalized": "idontaccept",
    "category": 2
  },
  {
    "normalized": "pneus",
    "category": 0
  },
  {
    "normalized": "piecesauto",
    "category": 0
  },
  {
    "normalized": "batteries",
    "category": 0
  },
  {
    "normalized": "huiles",
    "category": 0
  },
  {
    "normalized": "servicessansrdv",
    "category": 0
  },
  {
    "normalized": "trouvezvospiecesauto",
    "category": 0
  },
  {
    "normalized": "trouvezvospneus",
    "category": 0
  },
  {
    "normalized": "gererlesoptions",
    "category": 3
  },
  {
    "normalized": "soymayordeedadyaceptolascookies",
    "category": 0
  },
  {
    "normalized": "soymayordeedadyaceptosolocookiesfuncionales",
    "category": 0
  },
  {
    "normalized": "accettasoloicookiesselezionati",
    "category": 2
  },
  {
    "normalized": "validersanspersonnaliser",
    "category": 8
  },
  {
    "normalized": "jegacceptererallecookiesladoskommeigang",
    "category": 1
  },
  {
    "normalized": "fortsætudenatacceptere",
    "category": 2
  },
  {
    "normalized": "konfigurer",
    "category": 3
  },
  {
    "normalized": "gestionarlasopciones",
    "category": 3
  },
  {
    "normalized": "deacuerdoycerrar",
    "category": 1
  },
  {
    "normalized": "adsettings",
    "category": 3
  },
  {
    "normalized": "rubrikauswahlen",
    "category": 9
  },
  {
    "normalized": "stellenangebote",
    "category": 0
  },
  {
    "normalized": "lehrstellenausbildung",
    "category": 0
  },
  {
    "normalized": "dualesstudium",
    "category": 0
  },
  {
    "normalized": "minijobs",
    "category": 0
  },
  {
    "normalized": "praktikum",
    "category": 0
  },
  {
    "normalized": "neuestejobs",
    "category": 0
  },
  {
    "normalized": "jobratgeber",
    "category": 0
  },
  {
    "normalized": "wohnungmieten",
    "category": 0
  },
  {
    "normalized": "wohnungkaufen",
    "category": 0
  },
  {
    "normalized": "hauskaufen",
    "category": 0
  },
  {
    "normalized": "hausmieten",
    "category": 0
  },
  {
    "normalized": "immobilienbewertung",
    "category": 0
  },
  {
    "normalized": "immobilienmakler",
    "category": 0
  },
  {
    "normalized": "umzug",
    "category": 0
  },
  {
    "normalized": "immobilienratgeber",
    "category": 0
  },
  {
    "normalized": "neuwagen",
    "category": 0
  },
  {
    "normalized": "autoabo",
    "category": 0
  },
  {
    "normalized": "kfzzulassung",
    "category": 0
  },
  {
    "normalized": "autowerkstatt",
    "category": 0
  },
  {
    "normalized": "automagazin",
    "category": 0
  },
  {
    "normalized": "technischedaten",
    "category": 0
  },
  {
    "normalized": "singleborse",
    "category": 0
  },
  {
    "normalized": "siesuchtihn",
    "category": 0
  },
  {
    "normalized": "ersuchtsie",
    "category": 0
  },
  {
    "normalized": "siesuchtsie",
    "category": 0
  },
  {
    "normalized": "ersuchtihn",
    "category": 0
  },
  {
    "normalized": "partnervermittlung",
    "category": 0
  },
  {
    "normalized": "casualdating",
    "category": 0
  },
  {
    "normalized": "partnersuche50+",
    "category": 0
  },
  {
    "normalized": "datingmagazin",
    "category": 0
  },
  {
    "normalized": "tourismus",
    "category": 0
  },
  {
    "normalized": "hotels",
    "category": 0
  },
  {
    "normalized": "ferienwohnungen",
    "category": 0
  },
  {
    "normalized": "wellnesshotel",
    "category": 0
  },
  {
    "normalized": "ubernachten",
    "category": 0
  },
  {
    "normalized": "ausflug",
    "category": 0
  },
  {
    "normalized": "tourismusmagazin",
    "category": 0
  },
  {
    "normalized": "veranstaltungen",
    "category": 0
  },
  {
    "normalized": "theater",
    "category": 0
  },
  {
    "normalized": "partys",
    "category": 0
  },
  {
    "normalized": "konzerte",
    "category": 0
  },
  {
    "normalized": "musicals",
    "category": 0
  },
  {
    "normalized": "markte",
    "category": 0
  },
  {
    "normalized": "kinderveranstaltungen",
    "category": 0
  },
  {
    "normalized": "onlineevents",
    "category": 0
  },
  {
    "normalized": "branchenbuch",
    "category": 0
  },
  {
    "normalized": "apotheken",
    "category": 0
  },
  {
    "normalized": "handwerker",
    "category": 0
  },
  {
    "normalized": "stadtplan",
    "category": 0
  },
  {
    "normalized": "straßen",
    "category": 0
  },
  {
    "normalized": "sehenswurdigkeiten",
    "category": 0
  },
  {
    "normalized": "kleinanzeigen",
    "category": 0
  },
  {
    "normalized": "haushaltshilfe",
    "category": 0
  },
  {
    "normalized": "kinderbetreuung",
    "category": 0
  },
  {
    "normalized": "seniorenbetreuung",
    "category": 0
  },
  {
    "normalized": "tierbetreuung",
    "category": 0
  },
  {
    "normalized": "nachhilfe",
    "category": 0
  },
  {
    "normalized": "haushaltsnahedienstleistungen",
    "category": 0
  },
  {
    "normalized": "okzgadzamsie",
    "category": 1
  },
  {
    "normalized": "niezgadzamsie",
    "category": 2
  },
  {
    "normalized": "zmieniamzgody",
    "category": 3
  },
  {
    "normalized": "1fckoln",
    "category": 0
  },
  {
    "normalized": "kolnerumland",
    "category": 0
  },
  {
    "normalized": "letsdance",
    "category": 0
  },
  {
    "normalized": "dusseldorf",
    "category": 0
  },
  {
    "normalized": "promishow",
    "category": 0
  },
  {
    "normalized": "neuesteartikel",
    "category": 0
  },
  {
    "normalized": "mehrzumpurabo",
    "category": 0
  },
  {
    "normalized": "bereitspurabonnenthieranmelden",
    "category": 0
  },
  {
    "normalized": "sozialenetzwerkevideosundpersonalisierung",
    "category": 0
  },
  {
    "normalized": "nutzungsanalyse",
    "category": 0
  },
  {
    "normalized": "drittstaatentransfer",
    "category": 0
  },
  {
    "normalized": "yesimhappy",
    "category": 1
  },
  {
    "normalized": "agreeall",
    "category": 1
  },
  {
    "normalized": "customizeyourchoices",
    "category": 3
  },
  {
    "normalized": "manageyourcookieshere",
    "category": 3
  },
  {
    "normalized": "wiebeschrieben",
    "category": 0
  },
  {
    "normalized": "measurement",
    "category": 0
  },
  {
    "normalized": "accettare",
    "category": 1
  },
  {
    "normalized": "gestisci",
    "category": 3
  },
  {
    "normalized": "vederelanostrapoliticacookie",
    "category": 0
  },
  {
    "normalized": "horoskope",
    "category": 0
  },
  {
    "normalized": "sternzeichen",
    "category": 0
  },
  {
    "normalized": "tarot",
    "category": 0
  },
  {
    "normalized": "jahreshoroskop2023",
    "category": 0
  },
  {
    "normalized": "traumdeutung",
    "category": 0
  },
  {
    "normalized": "acceptselection",
    "category": 4
  },
  {
    "normalized": "acceptrecommended",
    "category": 8
  },
  {
    "normalized": "essentiellefunktionen",
    "category": 0
  },
  {
    "normalized": "erweiterteeinstellungen",
    "category": 3
  },
  {
    "normalized": "loginwithfacebook",
    "category": 0
  },
  {
    "normalized": "loginwithinstagram",
    "category": 0
  },
  {
    "normalized": "createanaccount",
    "category": 0
  },
  {
    "normalized": "seinfo",
    "category": 0
  },
  {
    "normalized": "quieroobtenermasinformacion",
    "category": 8
  },
  {
    "normalized": "nepasconsentir",
    "category": 2
  },
  {
    "normalized": "refusertoutfermer",
    "category": 2
  },
  {
    "normalized": "configurarorechazarlascookies",
    "category": 8
  },
  {
    "normalized": "okacepto",
    "category": 1
  },
  {
    "normalized": "了解更多",
    "category": 3
  },
  {
    "normalized": "almacenardatosdeanalitica",
    "category": 0
  },
  {
    "normalized": "almacenamientoparaanuncios",
    "category": 0
  },
  {
    "normalized": "guardaropciones",
    "category": 3
  },
  {
    "normalized": "salvascelte",
    "category": 4
  },
  {
    "normalized": "modificatuconfiguracion",
    "category": 3
  },
  {
    "normalized": "verstanden",
    "category": 1
  },
  {
    "normalized": "cookieconsentmanager",
    "category": 8
  },
  {
    "normalized": "8514live",
    "category": 0
  },
  {
    "normalized": "ellaunendlich",
    "category": 0
  },
  {
    "normalized": "wildcheryl",
    "category": 0
  },
  {
    "normalized": "diebestenkostenlosenlivesexcams",
    "category": 0
  },
  {
    "normalized": "eleonoree",
    "category": 0
  },
  {
    "normalized": "topkostenlosesexwebcams",
    "category": 0
  },
  {
    "normalized": "denegartodas",
    "category": 2
  },
  {
    "normalized": "getleopur",
    "category": 0
  },
  {
    "normalized": "impostazionedeicookie",
    "category": 3
  },
  {
    "normalized": "aboutduckduckgo",
    "category": 0
  },
  {
    "normalized": "addduckduckgotoedge",
    "category": 0
  },
  {
    "normalized": "majorbrowsers",
    "category": 0
  },
  {
    "normalized": "duckduckgocom",
    "category": 0
  },
  {
    "normalized": "iosandroid",
    "category": 0
  },
  {
    "normalized": "iagreeandamover18",
    "category": 0
  },
  {
    "normalized": "idonotagreeoramnotover18",
    "category": 0
  },
  {
    "normalized": "registrieren",
    "category": 0
  },
  {
    "normalized": "suchbegriff",
    "category": 0
  },
  {
    "normalized": "fruhling",
    "category": 0
  },
  {
    "normalized": "gesundeernahrung",
    "category": 0
  },
  {
    "normalized": "klugerabnehmen",
    "category": 0
  },
  {
    "normalized": "smarterleben",
    "category": 0
  },
  {
    "normalized": "vegetarisch",
    "category": 0
  },
  {
    "normalized": "rhabarber",
    "category": 0
  },
  {
    "normalized": "lieblingsrezepte",
    "category": 0
  },
  {
    "normalized": "iabtcf20framework",
    "category": 0
  },
  {
    "normalized": "datenschutzbestimmungen",
    "category": 0
  },
  {
    "normalized": "einstellungenauswahltreffen",
    "category": 3
  },
  {
    "normalized": "jetztvergleichen",
    "category": 0
  },
  {
    "normalized": "zumnewsletter",
    "category": 0
  },
  {
    "normalized": "ubermich",
    "category": 0
  },
  {
    "normalized": "rezeptenachart",
    "category": 0
  },
  {
    "normalized": "fleischgeflugel",
    "category": 0
  },
  {
    "normalized": "vegetarischerezepte",
    "category": 0
  },
  {
    "normalized": "pastarezepte",
    "category": 0
  },
  {
    "normalized": "hackfleischrezepte",
    "category": 0
  },
  {
    "normalized": "reisrezepte",
    "category": 0
  },
  {
    "normalized": "salatesnacks",
    "category": 0
  },
  {
    "normalized": "suppeneintopfe",
    "category": 0
  },
  {
    "normalized": "pizzarezepte",
    "category": 0
  },
  {
    "normalized": "quichestartes",
    "category": 0
  },
  {
    "normalized": "fischmeeresfruchte",
    "category": 0
  },
  {
    "normalized": "rezeptenachanlass",
    "category": 0
  },
  {
    "normalized": "schnellerezepte",
    "category": 0
  },
  {
    "normalized": "furdiefamilie",
    "category": 0
  },
  {
    "normalized": "furgaste",
    "category": 0
  },
  {
    "normalized": "kuchengeback",
    "category": 0
  },
  {
    "normalized": "dessertssussspeisen",
    "category": 0
  },
  {
    "normalized": "fingerfooddips",
    "category": 0
  },
  {
    "normalized": "beilagengemuse",
    "category": 0
  },
  {
    "normalized": "beliebterezepte",
    "category": 0
  },
  {
    "normalized": "rezeptevonabisz",
    "category": 0
  },
  {
    "normalized": "saisonalerezepte",
    "category": 0
  },
  {
    "normalized": "spargelrezepte",
    "category": 0
  },
  {
    "normalized": "erdbeerrezepte",
    "category": 0
  },
  {
    "normalized": "kartoffelrezepte",
    "category": 0
  },
  {
    "normalized": "sommersalate",
    "category": 0
  },
  {
    "normalized": "tomatenrezepte",
    "category": 0
  },
  {
    "normalized": "zucchinirezepte",
    "category": 0
  },
  {
    "normalized": "ofenrezepte",
    "category": 0
  },
  {
    "normalized": "apfelrezepte",
    "category": 0
  },
  {
    "normalized": "kohlrezepte",
    "category": 0
  },
  {
    "normalized": "meinekochbucher",
    "category": 0
  },
  {
    "normalized": "zumeinem",
    "category": 0
  },
  {
    "normalized": "kochbuchnr1",
    "category": 0
  },
  {
    "normalized": "besserkochen",
    "category": 0
  },
  {
    "normalized": "tippsundtricks",
    "category": 0
  },
  {
    "normalized": "kuchenhelfern",
    "category": 0
  },
  {
    "normalized": "saisonkalender",
    "category": 0
  },
  {
    "normalized": "saisonalregional",
    "category": 0
  },
  {
    "normalized": "gemuse",
    "category": 0
  },
  {
    "normalized": "obst",
    "category": 0
  },
  {
    "normalized": "salatekrauter",
    "category": 0
  },
  {
    "normalized": "warumessinnmacht",
    "category": 0
  },
  {
    "normalized": "furdenkostenlosennewsletteranmeldennichtsverpassen",
    "category": 0
  },
  {
    "normalized": "blitzsaucehollandaise",
    "category": 0
  },
  {
    "normalized": "zumeinfachenrezept>>",
    "category": 0
  },
  {
    "normalized": "nudelauflaufschinkenkase",
    "category": 0
  },
  {
    "normalized": "schnellespargelcremesuppe",
    "category": 0
  },
  {
    "normalized": "rechazartodas",
    "category": 2
  },
  {
    "normalized": "aceptarseleccionadas",
    "category": 4
  },
  {
    "normalized": "conocermas",
    "category": 3
  },
  {
    "normalized": "consigue15dedto",
    "category": 0
  },
  {
    "normalized": "terminosdeuso",
    "category": 0
  },
  {
    "normalized": "soymayorde18anos",
    "category": 0
  },
  {
    "normalized": "salir",
    "category": 9
  },
  {
    "normalized": "8538envivo",
    "category": 0
  },
  {
    "normalized": "mejoresmodelos",
    "category": 0
  },
  {
    "normalized": "crearcuentagratis",
    "category": 0
  },
  {
    "normalized": "inicio",
    "category": 0
  },
  {
    "normalized": "recomendado",
    "category": 9
  },
  {
    "normalized": "misfavoritos",
    "category": 0
  },
  {
    "normalized": "verhistorial",
    "category": 0
  },
  {
    "normalized": "ucranianas",
    "category": 0
  },
  {
    "normalized": "nuevasmodelos",
    "category": 0
  },
  {
    "normalized": "camarasenvivovr",
    "category": 0
  },
  {
    "normalized": "grabable",
    "category": 0
  },
  {
    "normalized": "adolescentes18+",
    "category": 0
  },
  {
    "normalized": "jovencitas22+",
    "category": 0
  },
  {
    "normalized": "maduras",
    "category": 0
  },
  {
    "normalized": "abuelas",
    "category": 0
  },
  {
    "normalized": "asiaticas",
    "category": 0
  },
  {
    "normalized": "chicasnegras",
    "category": 0
  },
  {
    "normalized": "india",
    "category": 0
  },
  {
    "normalized": "blanca",
    "category": 0
  },
  {
    "normalized": "mascategorias",
    "category": 0
  },
  {
    "normalized": "camarasdesexoespanol",
    "category": 0
  },
  {
    "normalized": "spicyg69",
    "category": 0
  },
  {
    "normalized": "evucciabb85",
    "category": 0
  },
  {
    "normalized": "barfantasy",
    "category": 0
  },
  {
    "normalized": "secretoeternoo",
    "category": 0
  },
  {
    "normalized": "fullpartyrosse24",
    "category": 0
  },
  {
    "normalized": "jenifferbrowl",
    "category": 0
  },
  {
    "normalized": "monserrath",
    "category": 0
  },
  {
    "normalized": "darlingpearl",
    "category": 0
  },
  {
    "normalized": "hot7baby",
    "category": 0
  },
  {
    "normalized": "livesuki",
    "category": 0
  },
  {
    "normalized": "devoorahot",
    "category": 0
  },
  {
    "normalized": "dianagomez",
    "category": 0
  },
  {
    "normalized": "sussanramirez",
    "category": 0
  },
  {
    "normalized": "zorritasuperhot",
    "category": 0
  },
  {
    "normalized": "nikita16669",
    "category": 0
  },
  {
    "normalized": "vermas",
    "category": 0
  },
  {
    "normalized": "mejorescamarasdesexoenvivo",
    "category": 0
  },
  {
    "normalized": "earlyflowerr",
    "category": 0
  },
  {
    "normalized": "iniciarsesionregistrarse",
    "category": 0
  },
  {
    "normalized": "estoydeacuerdo",
    "category": 1
  },
  {
    "normalized": "clear",
    "category": 9
  },
  {
    "normalized": "refuseall",
    "category": 2
  },
  {
    "normalized": "straight",
    "category": 0
  },
  {
    "normalized": "transgender",
    "category": 0
  },
  {
    "normalized": "imover18",
    "category": 0
  },
  {
    "normalized": "allowselected",
    "category": 4
  },
  {
    "normalized": "personalizzaicookies",
    "category": 3
  },
  {
    "normalized": "proseguisoloconicookiestecnicinecessari",
    "category": 2
  },
  {
    "normalized": "accederasudispositivo",
    "category": 0
  },
  {
    "normalized": "configuresusopciones",
    "category": 3
  },
  {
    "normalized": "noaceptar",
    "category": 2
  },
  {
    "normalized": "sinscrire",
    "category": 0
  },
  {
    "normalized": "parametresdeconfidentialite",
    "category": 3
  },
  {
    "normalized": "serendrelesiteweb",
    "category": 0
  },
  {
    "normalized": "uniquementautoriserlescookiesessentiels",
    "category": 2
  },
  {
    "normalized": "autoriserlescookiesessentielsetoptionnels",
    "category": 1
  },
  {
    "normalized": "affichertouteslesfinalites",
    "category": 0
  },
  {
    "normalized": "jai+de18entrer",
    "category": 0
  },
  {
    "normalized": "plusdinformations",
    "category": 3
  },
  {
    "normalized": "nouveauxclientsseulement",
    "category": 0
  },
  {
    "normalized": "conditionsdutilisation",
    "category": 0
  },
  {
    "normalized": "jaiplusde18ans",
    "category": 0
  },
  {
    "normalized": "quitter",
    "category": 9
  },
  {
    "normalized": "8222live",
    "category": 0
  },
  {
    "normalized": "meilleursmodeles",
    "category": 0
  },
  {
    "normalized": "creeruncomptegratuit",
    "category": 0
  },
  {
    "normalized": "accueil",
    "category": 0
  },
  {
    "normalized": "flux",
    "category": 0
  },
  {
    "normalized": "recommandes",
    "category": 8
  },
  {
    "normalized": "historiquedevisionnage",
    "category": 0
  },
  {
    "normalized": "ukrainienne",
    "category": 0
  },
  {
    "normalized": "francaise",
    "category": 0
  },
  {
    "normalized": "nouveauxmodeles",
    "category": 0
  },
  {
    "normalized": "camsenvr",
    "category": 0
  },
  {
    "normalized": "fetichismes",
    "category": 0
  },
  {
    "normalized": "enregistrable",
    "category": 0
  },
  {
    "normalized": "ados18+",
    "category": 0
  },
  {
    "normalized": "jeunes22+",
    "category": 0
  },
  {
    "normalized": "mamies",
    "category": 0
  },
  {
    "normalized": "asiatiques",
    "category": 0
  },
  {
    "normalized": "ebenes",
    "category": 0
  },
  {
    "normalized": "indiennes",
    "category": 0
  },
  {
    "normalized": "latinos",
    "category": 0
  },
  {
    "normalized": "caucasienne",
    "category": 0
  },
  {
    "normalized": "categories+",
    "category": 0
  },
  {
    "normalized": "sexcamsdefrancaise",
    "category": 0
  },
  {
    "normalized": "aphrodiite",
    "category": 0
  },
  {
    "normalized": "aphroditexxx69",
    "category": 0
  },
  {
    "normalized": "sweetarabic",
    "category": 0
  },
  {
    "normalized": "spicylottie",
    "category": 0
  },
  {
    "normalized": "blaackcat",
    "category": 0
  },
  {
    "normalized": "delichieuse5",
    "category": 0
  },
  {
    "normalized": "deliciosa98",
    "category": 0
  },
  {
    "normalized": "lalylyna",
    "category": 0
  },
  {
    "normalized": "lenathegirlwhostandsup",
    "category": 0
  },
  {
    "normalized": "petitechienne1",
    "category": 0
  },
  {
    "normalized": "grosseins",
    "category": 0
  },
  {
    "normalized": "ladymiforever",
    "category": 0
  },
  {
    "normalized": "playsirx",
    "category": 0
  },
  {
    "normalized": "funkooples",
    "category": 0
  },
  {
    "normalized": "immaalexa",
    "category": 0
  },
  {
    "normalized": "shana03",
    "category": 0
  },
  {
    "normalized": "stasia25",
    "category": 0
  },
  {
    "normalized": "cillynacam4",
    "category": 0
  },
  {
    "normalized": "miiaajoness",
    "category": 0
  },
  {
    "normalized": "sofie27",
    "category": 0
  },
  {
    "normalized": "misschiennelilou",
    "category": 0
  },
  {
    "normalized": "lesmeilleuressexcamgratuitesendirect",
    "category": 0
  },
  {
    "normalized": "lalaxo",
    "category": 0
  },
  {
    "normalized": "politiqueenmatieredecookies",
    "category": 0
  },
  {
    "normalized": "funpot",
    "category": 0
  },
  {
    "normalized": "alles",
    "category": 0
  },
  {
    "normalized": "bilder",
    "category": 0
  },
  {
    "normalized": "herzschmerz",
    "category": 0
  },
  {
    "normalized": "musikundmehr",
    "category": 0
  },
  {
    "normalized": "beigewitternichtinswasserjpg",
    "category": 0
  },
  {
    "normalized": "daskabelhaltjpg",
    "category": 0
  },
  {
    "normalized": "trabbijpg",
    "category": 0
  },
  {
    "normalized": "vergebenundvergessenjpg",
    "category": 0
  },
  {
    "normalized": "einlaechelnpps",
    "category": 0
  },
  {
    "normalized": "petrusjpg",
    "category": 0
  },
  {
    "normalized": "inwelchereinheitwirddichtegemessenjpg",
    "category": 0
  },
  {
    "normalized": "malebeneinkaufengehenjpg",
    "category": 0
  },
  {
    "normalized": "eristjetztdeutscherjpg",
    "category": 0
  },
  {
    "normalized": "dumusstmichnichtverstehenjpg",
    "category": 0
  },
  {
    "normalized": "tierischefreundejpg",
    "category": 0
  },
  {
    "normalized": "tierischestraßensperregif",
    "category": 0
  },
  {
    "normalized": "katzepackteingif",
    "category": 0
  },
  {
    "normalized": "lauftmitdemlernenjpg",
    "category": 0
  },
  {
    "normalized": "nichtsanmerkenlassenjpg",
    "category": 0
  },
  {
    "normalized": "helmutkohlkommtindiehollejpg",
    "category": 0
  },
  {
    "normalized": "herziges",
    "category": 0
  },
  {
    "normalized": "regleromcookies",
    "category": 0
  },
  {
    "normalized": "administrationafcookies",
    "category": 9
  },
  {
    "normalized": "conditionsgeneralesdutilisation",
    "category": 0
  },
  {
    "normalized": "seeourcookiepolicypage",
    "category": 0
  },
  {
    "normalized": "reise",
    "category": 0
  },
  {
    "normalized": "mietwagen",
    "category": 0
  },
  {
    "normalized": "fluge",
    "category": 0
  },
  {
    "normalized": "sportreisen",
    "category": 0
  },
  {
    "normalized": "hotelgoldclub",
    "category": 0
  },
  {
    "normalized": "reisecenter",
    "category": 0
  },
  {
    "normalized": "2erwachsene|1zimmer",
    "category": 0
  },
  {
    "normalized": "hotelsfinden",
    "category": 0
  },
  {
    "normalized": "sanktpeterording",
    "category": 0
  },
  {
    "normalized": "cuxhaven",
    "category": 0
  },
  {
    "normalized": "warnemunde",
    "category": 0
  },
  {
    "normalized": "salvalepreferenze",
    "category": 4
  },
  {
    "normalized": "lescanpolitique",
    "category": 0
  },
  {
    "normalized": "international",
    "category": 0
  },
  {
    "normalized": "economie",
    "category": 0
  },
  {
    "normalized": "decideurs",
    "category": 0
  },
  {
    "normalized": "lescaneco",
    "category": 0
  },
  {
    "normalized": "sport24",
    "category": 0
  },
  {
    "normalized": "lescansport",
    "category": 0
  },
  {
    "normalized": "madame",
    "category": 0
  },
  {
    "normalized": "figarostore",
    "category": 0
  },
  {
    "normalized": "figarotv",
    "category": 0
  },
  {
    "normalized": "tvmag",
    "category": 0
  },
  {
    "normalized": "sante",
    "category": 0
  },
  {
    "normalized": "etudiant",
    "category": 0
  },
  {
    "normalized": "figarochiccn",
    "category": 0
  },
  {
    "normalized": "histoire",
    "category": 0
  },
  {
    "normalized": "nautisme",
    "category": 0
  },
  {
    "normalized": "golf",
    "category": 0
  },
  {
    "normalized": "figaroscope",
    "category": 0
  },
  {
    "normalized": "voyage",
    "category": 0
  },
  {
    "normalized": "encheres",
    "category": 0
  },
  {
    "normalized": "abonnezvousaufigaro",
    "category": 0
  },
  {
    "normalized": "actualitesconseils",
    "category": 0
  },
  {
    "normalized": "tousnosarticles",
    "category": 0
  },
  {
    "normalized": "actualites",
    "category": 0
  },
  {
    "normalized": "liveetvideos",
    "category": 0
  },
  {
    "normalized": "louer",
    "category": 0
  },
  {
    "normalized": "louerunbien",
    "category": 0
  },
  {
    "normalized": "locationappartement",
    "category": 0
  },
  {
    "normalized": "locationmaison",
    "category": 0
  },
  {
    "normalized": "locationparking",
    "category": 0
  },
  {
    "normalized": "locationlocauxprofessionnels",
    "category": 0
  },
  {
    "normalized": "locationimmobilierdexception",
    "category": 0
  },
  {
    "normalized": "tousnosbiensenlocation",
    "category": 0
  },
  {
    "normalized": "conseilspourlalocation",
    "category": 0
  },
  {
    "normalized": "contratdelocation",
    "category": 0
  },
  {
    "normalized": "documentspourunbail",
    "category": 0
  },
  {
    "normalized": "etatdeslieux",
    "category": 0
  },
  {
    "normalized": "preavisdelocation",
    "category": 0
  },
  {
    "normalized": "vendreunbien",
    "category": 0
  },
  {
    "normalized": "estimationimmobiliere",
    "category": 0
  },
  {
    "normalized": "deposeruneannonce",
    "category": 0
  },
  {
    "normalized": "trouverundiagnostiqueur",
    "category": 0
  },
  {
    "normalized": "simulationdepretimmobilier",
    "category": 0
  },
  {
    "normalized": "trouverundemenageur",
    "category": 0
  },
  {
    "normalized": "conseilspourvendreunbien",
    "category": 0
  },
  {
    "normalized": "mandatdevente",
    "category": 0
  },
  {
    "normalized": "compromisdevente",
    "category": 0
  },
  {
    "normalized": "fraisdagence",
    "category": 0
  },
  {
    "normalized": "acheter",
    "category": 0
  },
  {
    "normalized": "acheterunbien",
    "category": 0
  },
  {
    "normalized": "appartementsavendre",
    "category": 0
  },
  {
    "normalized": "maisonsavendre",
    "category": 0
  },
  {
    "normalized": "maisonsneuvesavendre",
    "category": 0
  },
  {
    "normalized": "tousnosbiensavendre",
    "category": 0
  },
  {
    "normalized": "immobilierneuf",
    "category": 0
  },
  {
    "normalized": "immobilierdexception",
    "category": 0
  },
  {
    "normalized": "conseilspouracheter",
    "category": 0
  },
  {
    "normalized": "investirdanslimmobilier",
    "category": 0
  },
  {
    "normalized": "modeledoffredachat",
    "category": 0
  },
  {
    "normalized": "fraisdenotaire",
    "category": 0
  },
  {
    "normalized": "trouverunpretimmobilier",
    "category": 0
  },
  {
    "normalized": "calculerlecoutdevotreassurance",
    "category": 0
  },
  {
    "normalized": "accettaretutti",
    "category": 1
  },
  {
    "normalized": "salvaleimpostazioni",
    "category": 4
  },
  {
    "normalized": "negare",
    "category": 2
  },
  {
    "normalized": "noaggiusta",
    "category": 8
  },
  {
    "normalized": "fashionbeauty",
    "category": 0
  },
  {
    "normalized": "consentisoloicookieessenziali",
    "category": 2
  },
  {
    "normalized": "consenticookieessenzialiefacoltativi",
    "category": 1
  },
  {
    "normalized": "spedizionegratis",
    "category": 0
  },
  {
    "normalized": "terminidiutilizzo",
    "category": 0
  },
  {
    "normalized": "hopiudi18anni",
    "category": 0
  },
  {
    "normalized": "esciqui",
    "category": 0
  },
  {
    "normalized": "8075dalvivo",
    "category": 0
  },
  {
    "normalized": "creaunaccountgratuito",
    "category": 0
  },
  {
    "normalized": "bacheca",
    "category": 0
  },
  {
    "normalized": "consigliato",
    "category": 8
  },
  {
    "normalized": "imieipreferiti",
    "category": 0
  },
  {
    "normalized": "cronologiavisualizzazioni",
    "category": 0
  },
  {
    "normalized": "ucraine",
    "category": 0
  },
  {
    "normalized": "italiane",
    "category": 0
  },
  {
    "normalized": "nuovemodelle",
    "category": 0
  },
  {
    "normalized": "caminvr",
    "category": 0
  },
  {
    "normalized": "registrabile",
    "category": 0
  },
  {
    "normalized": "teenager18+",
    "category": 0
  },
  {
    "normalized": "giovani22+",
    "category": 0
  },
  {
    "normalized": "anziane",
    "category": 0
  },
  {
    "normalized": "asiatiche",
    "category": 0
  },
  {
    "normalized": "mulatte",
    "category": 0
  },
  {
    "normalized": "indiane",
    "category": 0
  },
  {
    "normalized": "bianche",
    "category": 0
  },
  {
    "normalized": "tuttelecategorie+",
    "category": 0
  },
  {
    "normalized": "italianecamdisesso",
    "category": 0
  },
  {
    "normalized": "miaelis",
    "category": 0
  },
  {
    "normalized": "julianne",
    "category": 0
  },
  {
    "normalized": "sweetgattina",
    "category": 0
  },
  {
    "normalized": "luanamanara",
    "category": 0
  },
  {
    "normalized": "reginadicuori",
    "category": 0
  },
  {
    "normalized": "cataleya80",
    "category": 0
  },
  {
    "normalized": "vogliosaxxx",
    "category": 0
  },
  {
    "normalized": "scarlethmaximo",
    "category": 0
  },
  {
    "normalized": "nathashhaa",
    "category": 0
  },
  {
    "normalized": "monellax",
    "category": 0
  },
  {
    "normalized": "missivory95",
    "category": 0
  },
  {
    "normalized": "albabianca",
    "category": 0
  },
  {
    "normalized": "lussymay00",
    "category": 0
  },
  {
    "normalized": "sexylory98",
    "category": 0
  },
  {
    "normalized": "crhystel",
    "category": 0
  },
  {
    "normalized": "juliettevolpewyorika",
    "category": 0
  },
  {
    "normalized": "margot",
    "category": 0
  },
  {
    "normalized": "adele30",
    "category": 0
  },
  {
    "normalized": "altro",
    "category": 0
  },
  {
    "normalized": "lemigliorisexcamdalvivogratis",
    "category": 0
  },
  {
    "normalized": "anaruru222",
    "category": 0
  },
  {
    "normalized": "informativasuicookie",
    "category": 0
  },
  {
    "normalized": "solousarcookiesnecesarias",
    "category": 2
  },
  {
    "normalized": "permitirtodaslascookies",
    "category": 3
  },
  {
    "normalized": "verdetalles",
    "category": 3
  },
  {
    "normalized": "neplusaffichercemessage",
    "category": 0
  },
  {
    "normalized": "guardarajustes",
    "category": 4
  },
  {
    "normalized": "adobeanalytics",
    "category": 0
  },
  {
    "normalized": "adform",
    "category": 0
  },
  {
    "normalized": "adition",
    "category": 0
  },
  {
    "normalized": "communityumfrage",
    "category": 0
  },
  {
    "normalized": "doubleclickfloodlight",
    "category": 0
  },
  {
    "normalized": "metafacebook",
    "category": 0
  },
  {
    "normalized": "einzelneinstellen",
    "category": 9
  },
  {
    "normalized": "alleverweigern",
    "category": 2
  },
  {
    "normalized": "jugar",
    "category": 0
  },
  {
    "normalized": "bonsplansetpetitsprix",
    "category": 0
  },
  {
    "normalized": "selectionsetconseilsfnac",
    "category": 0
  },
  {
    "normalized": "nosselectionartistes",
    "category": 0
  },
  {
    "normalized": "bdjeunesse",
    "category": 0
  },
  {
    "normalized": "litteraturefiction",
    "category": 0
  },
  {
    "normalized": "selectcookiepreferences",
    "category": 3
  },
  {
    "normalized": "einfacheanzeigenundanzeigenmessung",
    "category": 0
  },
  {
    "normalized": "personalisierteinhalteinhaltemessungerkenntnisseuberzielgruppenundproduktentwicklung",
    "category": 0
  },
  {
    "normalized": "zustimmungverweigern",
    "category": 2
  },
  {
    "normalized": "zgoda",
    "category": 1
  },
  {
    "normalized": "odmawiam",
    "category": 2
  },
  {
    "normalized": "zmianaustawien",
    "category": 0
  },
  {
    "normalized": "dax062",
    "category": 0
  },
  {
    "normalized": "telefonverzeichnisse",
    "category": 0
  },
  {
    "normalized": "lotto",
    "category": 0
  },
  {
    "normalized": "telekomservices",
    "category": 0
  },
  {
    "normalized": "telekom",
    "category": 0
  },
  {
    "normalized": "hilfeservice",
    "category": 0
  },
  {
    "normalized": "fragmagenta",
    "category": 0
  },
  {
    "normalized": "kundencenter",
    "category": 0
  },
  {
    "normalized": "freemail",
    "category": 0
  },
  {
    "normalized": "magentacloud",
    "category": 0
  },
  {
    "normalized": "tarifeprodukte",
    "category": 0
  },
  {
    "normalized": "purabologin",
    "category": 0
  },
  {
    "normalized": "emaillogin",
    "category": 0
  },
  {
    "normalized": "deutschland",
    "category": 0
  },
  {
    "normalized": "ausland",
    "category": 0
  },
  {
    "normalized": "coronakrise",
    "category": 0
  },
  {
    "normalized": "tagesanbruch",
    "category": 0
  },
  {
    "normalized": "regional",
    "category": 0
  },
  {
    "normalized": "berlin",
    "category": 0
  },
  {
    "normalized": "hamburg",
    "category": 0
  },
  {
    "normalized": "munchen",
    "category": 0
  },
  {
    "normalized": "frankfurt",
    "category": 0
  },
  {
    "normalized": "allestadte",
    "category": 0
  },
  {
    "normalized": "zweikampfderwoche",
    "category": 0
  },
  {
    "normalized": "fcbayernnewsticker",
    "category": 0
  },
  {
    "normalized": "wintersport",
    "category": 0
  },
  {
    "normalized": "mehrsport",
    "category": 0
  },
  {
    "normalized": "liveticker",
    "category": 0
  },
  {
    "normalized": "ergebnisse",
    "category": 0
  },
  {
    "normalized": "sportwetten",
    "category": 0
  },
  {
    "normalized": "wirtschaftfinanzen",
    "category": 0
  },
  {
    "normalized": "dieanleger",
    "category": 0
  },
  {
    "normalized": "unserkfztipp",
    "category": 0
  },
  {
    "normalized": "immobilienteilverkauf",
    "category": 0
  },
  {
    "normalized": "zukunftkreditkarte",
    "category": 0
  },
  {
    "normalized": "investiereninimmobilien",
    "category": 0
  },
  {
    "normalized": "dschungelcamp",
    "category": 0
  },
  {
    "normalized": "kino",
    "category": 0
  },
  {
    "normalized": "panorama",
    "category": 0
  },
  {
    "normalized": "menschen",
    "category": 0
  },
  {
    "normalized": "unglucke",
    "category": 0
  },
  {
    "normalized": "kriminalitat",
    "category": 0
  },
  {
    "normalized": "justiz",
    "category": 0
  },
  {
    "normalized": "buntes",
    "category": 0
  },
  {
    "normalized": "geschichte",
    "category": 0
  },
  {
    "normalized": "quiz",
    "category": 0
  },
  {
    "normalized": "lesermeinungen",
    "category": 0
  },
  {
    "normalized": "gesundheit",
    "category": 0
  },
  {
    "normalized": "krankheitensymptome",
    "category": 0
  },
  {
    "normalized": "fitness",
    "category": 0
  },
  {
    "normalized": "gesundleben",
    "category": 0
  },
  {
    "normalized": "heilmittel",
    "category": 0
  },
  {
    "normalized": "schwangerschaft",
    "category": 0
  },
  {
    "normalized": "selbsttests",
    "category": 0
  },
  {
    "normalized": "leben",
    "category": 0
  },
  {
    "normalized": "essentrinken",
    "category": 0
  },
  {
    "normalized": "familie",
    "category": 0
  },
  {
    "normalized": "alltagswissen",
    "category": 0
  },
  {
    "normalized": "liebe",
    "category": 0
  },
  {
    "normalized": "modebeauty",
    "category": 0
  },
  {
    "normalized": "heimaturlaub",
    "category": 0
  },
  {
    "normalized": "onlinespiele",
    "category": 0
  },
  {
    "normalized": "browsergames",
    "category": 0
  },
  {
    "normalized": "taglichespiele",
    "category": 0
  },
  {
    "normalized": "3gewinnt",
    "category": 0
  },
  {
    "normalized": "brettspielekartenspiele",
    "category": 0
  },
  {
    "normalized": "bubbleshooter",
    "category": 0
  },
  {
    "normalized": "gratiscasino",
    "category": 0
  },
  {
    "normalized": "kreuzwortratsel",
    "category": 0
  },
  {
    "normalized": "mahjong",
    "category": 0
  },
  {
    "normalized": "sudoku",
    "category": 0
  },
  {
    "normalized": "wortquiz",
    "category": 0
  },
  {
    "normalized": "nachhaltigkeit",
    "category": 0
  },
  {
    "normalized": "klimaumwelt",
    "category": 0
  },
  {
    "normalized": "mobilitatverkehr",
    "category": 0
  },
  {
    "normalized": "heimgartenwohnen",
    "category": 0
  },
  {
    "normalized": "energie",
    "category": 0
  },
  {
    "normalized": "finanzenberuf",
    "category": 0
  },
  {
    "normalized": "konsum",
    "category": 0
  },
  {
    "normalized": "klimalexikon",
    "category": 0
  },
  {
    "normalized": "neuvorstellungenfahrberichte",
    "category": 0
  },
  {
    "normalized": "rechtverkehr",
    "category": 0
  },
  {
    "normalized": "elektromobilitat",
    "category": 0
  },
  {
    "normalized": "technikservice",
    "category": 0
  },
  {
    "normalized": "goldraubdiebemachenmillionenbeute",
    "category": 0
  },
  {
    "normalized": "herzogoutetsichnach43jahrenliebe",
    "category": 0
  },
  {
    "normalized": "dassoll2024pflichtfureigentumerwerden",
    "category": 0
  },
  {
    "normalized": "wiesnausstellerschmeißthin",
    "category": 0
  },
  {
    "normalized": "matthausteiltgegenbayernbosseaus",
    "category": 0
  },
  {
    "normalized": "hierwirdamfreitagverstarktgeblitzt",
    "category": 0
  },
  {
    "normalized": "wechselfixexbayernstargehtzumzdf",
    "category": 0
  },
  {
    "normalized": "hannovermannuberfahrtwolftot",
    "category": 0
  },
  {
    "normalized": "lenameyerlandrutzeigtsichverandert",
    "category": 0
  },
  {
    "normalized": "bayernstarwurdevontuchelvergessen",
    "category": 0
  },
  {
    "normalized": "xabialonsodasistseineehefrau",
    "category": 0
  },
  {
    "normalized": "scheidungstricksorgtfurwirbel",
    "category": 0
  },
  {
    "normalized": "alleschlagzeilenanzeigen",
    "category": 0
  },
  {
    "normalized": "kolleginerschossenwendeimverfahrengegenbaldwin",
    "category": 0
  },
  {
    "normalized": "russischebombetrifftversehentlicheigenegrenzstadt",
    "category": 0
  },
  {
    "normalized": "jetztsichern",
    "category": 0
  },
  {
    "normalized": "согласиться",
    "category": 1
  },
  {
    "normalized": "vor",
    "category": 0
  },
  {
    "normalized": "kfzversicherung",
    "category": 0
  },
  {
    "normalized": "kredit",
    "category": 0
  },
  {
    "normalized": "strom",
    "category": 0
  },
  {
    "normalized": "shopping",
    "category": 0
  },
  {
    "normalized": "dsl",
    "category": 0
  },
  {
    "normalized": "homepage",
    "category": 0
  },
  {
    "normalized": "calcio",
    "category": 0
  },
  {
    "normalized": "motociclismo",
    "category": 0
  },
  {
    "normalized": "scommesse",
    "category": 0
  },
  {
    "normalized": "altrisport",
    "category": 0
  },
  {
    "normalized": "running",
    "category": 0
  },
  {
    "normalized": "esports",
    "category": 0
  },
  {
    "normalized": "biglietti",
    "category": 0
  },
  {
    "normalized": "comprabiglietti",
    "category": 0
  },
  {
    "normalized": "palinsestotv",
    "category": 0
  },
  {
    "normalized": "mistercalciocup",
    "category": 0
  },
  {
    "normalized": "finalitaecaratteristichespeciali",
    "category": 0
  },
  {
    "normalized": "interesselegittimo",
    "category": 0
  },
  {
    "normalized": "salvaedesci",
    "category": 8
  },
  {
    "normalized": "controlsinyourfacebookaccount",
    "category": 0
  },
  {
    "normalized": "moreinformationaboutonlineadvertising",
    "category": 0
  },
  {
    "normalized": "controllingcookieswithbrowsersettings",
    "category": 0
  },
  {
    "normalized": "purlogin",
    "category": 0
  },
  {
    "normalized": "cookiemanager",
    "category": 0
  },
  {
    "normalized": "bereitstellungsbedingungen",
    "category": 0
  },
  {
    "normalized": "werbefreilesen",
    "category": 9
  },
  {
    "normalized": "einbindungvonexternenmultimediainhalten",
    "category": 0
  },
  {
    "normalized": "aboverwaltung",
    "category": 0
  },
  {
    "normalized": "yourcookiesettings",
    "category": 3
  },
  {
    "normalized": "deinecookieeinstellungen",
    "category": 3
  },
  {
    "normalized": "akzeptiereallecookies",
    "category": 1
  },
  {
    "normalized": "tuconfiguraciondecookies",
    "category": 3
  },
  {
    "normalized": "جرينتش",
    "category": 0
  },
  {
    "normalized": "مفضلتي",
    "category": 0
  },
  {
    "normalized": "previous",
    "category": 0
  },
  {
    "normalized": "personalize",
    "category": 3
  },
  {
    "normalized": "setpreferences",
    "category": 3
  },
  {
    "normalized": "rebutjar",
    "category": 2
  },
  {
    "normalized": "entra",
    "category": 9
  },
  {
    "normalized": "personalizzalemiescelte",
    "category": 3
  },
  {
    "normalized": "принять",
    "category": 1
  },
  {
    "normalized": "annuler",
    "category": 2
  },
  {
    "normalized": "collectall",
    "category": 0
  },
  {
    "normalized": "shopnow",
    "category": 0
  },
  {
    "normalized": "iagreetotheprivacycookiepolicy",
    "category": 1
  },
  {
    "normalized": "shippingelsewherevisitsheinsinternationalsite",
    "category": 0
  },
  {
    "normalized": "jeparametremeschoix",
    "category": 3
  },
  {
    "normalized": "configurarmispreferencias",
    "category": 3
  },
  {
    "normalized": "accettainostricookies",
    "category": 1
  },
  {
    "normalized": "bildplus",
    "category": 0
  },
  {
    "normalized": "fanmeile",
    "category": 0
  },
  {
    "normalized": "heutelive",
    "category": 0
  },
  {
    "normalized": "fanshop",
    "category": 0
  },
  {
    "normalized": "heftabo",
    "category": 0
  },
  {
    "normalized": "ussport",
    "category": 0
  },
  {
    "normalized": "ergebnissetabellen",
    "category": 0
  },
  {
    "normalized": "statistiken",
    "category": 0
  },
  {
    "normalized": "teams",
    "category": 0
  },
  {
    "normalized": "magentasport",
    "category": 0
  },
  {
    "normalized": "readmore",
    "category": 9
  },
  {
    "normalized": "zumkomplettentvprogramm",
    "category": 0
  },
  {
    "normalized": "zudenmediathekentipps",
    "category": 0
  },
  {
    "normalized": "diebestenshowsimtv",
    "category": 0
  },
  {
    "normalized": "dokusreportagenimtv",
    "category": 0
  },
  {
    "normalized": "fußballimtv",
    "category": 0
  },
  {
    "normalized": "diebestenfilmeimtv",
    "category": 0
  },
  {
    "normalized": "hollywoodblockbusterimtv",
    "category": 0
  },
  {
    "normalized": "heute",
    "category": 0
  },
  {
    "normalized": "configuratuscookies",
    "category": 3
  },
  {
    "normalized": "refuseunnecessarycookies",
    "category": 2
  },
  {
    "normalized": "thislink",
    "category": 0
  },
  {
    "normalized": "set",
    "category": 0
  },
  {
    "normalized": "partnerselezionati",
    "category": 0
  },
  {
    "normalized": "permitirlaseleccion",
    "category": 4
  },
  {
    "normalized": "necesarias",
    "category": 8
  },
  {
    "normalized": "ajustesdeprivacidad",
    "category": 0
  },
  {
    "normalized": "iralapaginaweb",
    "category": 8
  },
  {
    "normalized": "edizionilocali",
    "category": 0
  },
  {
    "normalized": "servizi",
    "category": 0
  },
  {
    "normalized": "weitere",
    "category": 0
  },
  {
    "normalized": "neuespiele",
    "category": 0
  },
  {
    "normalized": "beliebtespiele",
    "category": 0
  },
  {
    "normalized": "fremdinhalteanzeigensozialenetzwerke",
    "category": 0
  },
  {
    "normalized": "allowonlytechnicalcookies",
    "category": 2
  },
  {
    "normalized": "consulterledetaildescookies",
    "category": 3
  },
  {
    "normalized": "moodledataprivacypolicy",
    "category": 0
  },
  {
    "normalized": "moodletermsandconditions",
    "category": 0
  },
  {
    "normalized": "appsupport",
    "category": 0
  },
  {
    "normalized": "showmore",
    "category": 8
  },
  {
    "normalized": "scanandinstall",
    "category": 0
  },
  {
    "normalized": "contactus",
    "category": 0
  },
  {
    "normalized": "accessibilitystatement",
    "category": 0
  },
  {
    "normalized": "privacypage",
    "category": 0
  },
  {
    "normalized": "versenden",
    "category": 0
  },
  {
    "normalized": "empfangen",
    "category": 0
  },
  {
    "normalized": "retournieren",
    "category": 0
  },
  {
    "normalized": "mydpd",
    "category": 0
  },
  {
    "normalized": "suchemitpaketreferenz",
    "category": 0
  },
  {
    "normalized": "showvendorswithinthiscategory",
    "category": 0
  },
  {
    "normalized": "manageyourprivacysettings",
    "category": 3
  },
  {
    "normalized": "adjust",
    "category": 8
  },
  {
    "normalized": "viewoptionsorreject",
    "category": 8
  },
  {
    "normalized": "finetune",
    "category": 3
  },
  {
    "normalized": "thatscool",
    "category": 1
  },
  {
    "normalized": "usodecookies",
    "category": 9
  },
  {
    "normalized": "usodeicookie",
    "category": 9
  },
  {
    "normalized": "continuaconlanavigazione",
    "category": 8
  },
  {
    "normalized": "souscrire",
    "category": 0
  },
  {
    "normalized": "faireuneestimation",
    "category": 0
  },
  {
    "normalized": "francemetropolitaine|fr",
    "category": 0
  },
  {
    "normalized": "choisiruneoffredelectriciteoudegaz",
    "category": 0
  },
  {
    "normalized": "preparervotredemenagement",
    "category": 0
  },
  {
    "normalized": "reduirevotreconsommationdenergie",
    "category": 0
  },
  {
    "normalized": "souscrirepartelephone",
    "category": 0
  },
  {
    "normalized": "souscrireauneoffredenergie",
    "category": 0
  },
  {
    "normalized": "notrepolitiquecookies",
    "category": 0
  },
  {
    "normalized": "wchodze",
    "category": 8
  },
  {
    "normalized": "french",
    "category": 0
  },
  {
    "normalized": "german",
    "category": 0
  },
  {
    "normalized": "polish",
    "category": 0
  },
  {
    "normalized": "russian",
    "category": 0
  },
  {
    "normalized": "spanish",
    "category": 0
  },
  {
    "normalized": "dowiedzsiewiecej",
    "category": 3
  },
  {
    "normalized": "stations",
    "category": 0
  },
  {
    "normalized": "shows",
    "category": 0
  },
  {
    "normalized": "premium",
    "category": 0
  },
  {
    "normalized": "mylist",
    "category": 0
  },
  {
    "normalized": "starta30dayfreetrialsubscribe",
    "category": 0
  },
  {
    "normalized": "findoutmore",
    "category": 8
  },
  {
    "normalized": "jeffbrazieronlyhuman",
    "category": 0
  },
  {
    "normalized": "googleconsentmodeframework",
    "category": 0
  },
  {
    "normalized": "contentembeds",
    "category": 0
  },
  {
    "normalized": "cote",
    "category": 0
  },
  {
    "normalized": "fichestechniques",
    "category": 0
  },
  {
    "normalized": "007automotive",
    "category": 0
  },
  {
    "normalized": "voirses6annonces",
    "category": 0
  },
  {
    "normalized": "1dealauto",
    "category": 0
  },
  {
    "normalized": "voirses18annonces",
    "category": 0
  },
  {
    "normalized": "123partez",
    "category": 0
  },
  {
    "normalized": "voirses20annonces",
    "category": 0
  },
  {
    "normalized": "123car",
    "category": 0
  },
  {
    "normalized": "100autos",
    "category": 0
  },
  {
    "normalized": "100autodoccasion",
    "category": 0
  },
  {
    "normalized": "17autosport",
    "category": 0
  },
  {
    "normalized": "zurwebsitegehen",
    "category": 9
  },
  {
    "normalized": "touteslescategories",
    "category": 8
  },
  {
    "normalized": "cookiesandsimilartechnologies",
    "category": 0
  },
  {
    "normalized": "closecookiepolicybanner",
    "category": 8
  },
  {
    "normalized": "seitebetretenenter",
    "category": 8
  },
  {
    "normalized": "узнатьбольше",
    "category": 8
  },
  {
    "normalized": "purposes",
    "category": 3
  },
  {
    "normalized": "aceptarlascookies",
    "category": 1
  },
  {
    "normalized": "aceptarsololascookiesesenciales",
    "category": 2
  },
  {
    "normalized": "spedire",
    "category": 0
  },
  {
    "normalized": "ricevere",
    "category": 0
  },
  {
    "normalized": "brtfermopoint",
    "category": 0
  },
  {
    "normalized": "logistica",
    "category": 0
  },
  {
    "normalized": "sostenibilita",
    "category": 0
  },
  {
    "normalized": "servizioclienti",
    "category": 0
  },
  {
    "normalized": "scopridipiu",
    "category": 8
  },
  {
    "normalized": "ricercaavanzata",
    "category": 0
  },
  {
    "normalized": "rifiutaretutto",
    "category": 2
  },
  {
    "normalized": "aceptotodaslascookies",
    "category": 1
  },
  {
    "normalized": "ingresar",
    "category": 9
  },
  {
    "normalized": "rechazarcookies",
    "category": 2
  },
  {
    "normalized": "apuestasenvivoslotscasinocasinoenvivopokerpromocionessportiumuno",
    "category": 0
  },
  {
    "normalized": "personalizzalatuahomepagefailogin",
    "category": 0
  },
  {
    "normalized": "casino",
    "category": 0
  },
  {
    "normalized": "poker",
    "category": 0
  },
  {
    "normalized": "blognews",
    "category": 0
  },
  {
    "normalized": "register",
    "category": 0
  },
  {
    "normalized": "topsports",
    "category": 0
  },
  {
    "normalized": "result1x2",
    "category": 0
  },
  {
    "normalized": "overunder",
    "category": 0
  },
  {
    "normalized": "bothteamstoscore",
    "category": 0
  },
  {
    "normalized": "selectanevent",
    "category": 0
  },
  {
    "normalized": "oddsperselection",
    "category": 0
  },
  {
    "normalized": "winningsmorethan",
    "category": 0
  },
  {
    "normalized": "matchwinner",
    "category": 0
  },
  {
    "normalized": "doublechance",
    "category": 0
  },
  {
    "normalized": "addselection",
    "category": 0
  },
  {
    "normalized": "spinselection",
    "category": 0
  },
  {
    "normalized": "addtobetslip",
    "category": 0
  },
  {
    "normalized": "minigames",
    "category": 0
  },
  {
    "normalized": "store",
    "category": 0
  },
  {
    "normalized": "viewdesktopwebsite",
    "category": 0
  },
  {
    "normalized": "18usc2257recordkeepingrequirementscompliancestatement",
    "category": 0
  },
  {
    "normalized": "exithere",
    "category": 0
  },
  {
    "normalized": "6656live",
    "category": 0
  },
  {
    "normalized": "createfreeaccount",
    "category": 0
  },
  {
    "normalized": "recommended",
    "category": 8
  },
  {
    "normalized": "myfavorites",
    "category": 0
  },
  {
    "normalized": "watchhistory",
    "category": 0
  },
  {
    "normalized": "nordic",
    "category": 0
  },
  {
    "normalized": "newmodels",
    "category": 0
  },
  {
    "normalized": "recordable",
    "category": 0
  },
  {
    "normalized": "young22+",
    "category": 0
  },
  {
    "normalized": "arab",
    "category": 0
  },
  {
    "normalized": "asian",
    "category": 0
  },
  {
    "normalized": "ebony",
    "category": 0
  },
  {
    "normalized": "white",
    "category": 0
  },
  {
    "normalized": "allcategories+",
    "category": 0
  },
  {
    "normalized": "topfreelivesexcams",
    "category": 0
  },
  {
    "normalized": "seeall",
    "category": 8
  },
  {
    "normalized": "lailai888",
    "category": 0
  },
  {
    "normalized": "rachelquinn",
    "category": 0
  },
  {
    "normalized": "carlawhite",
    "category": 0
  },
  {
    "normalized": "miashy",
    "category": 0
  },
  {
    "normalized": "lilshell",
    "category": 0
  },
  {
    "normalized": "alessiataylor",
    "category": 0
  },
  {
    "normalized": "smyingzi",
    "category": 0
  },
  {
    "normalized": "edentop",
    "category": 0
  },
  {
    "normalized": "carissajones",
    "category": 0
  },
  {
    "normalized": "bejenisweet",
    "category": 0
  },
  {
    "normalized": "judy0523",
    "category": 0
  },
  {
    "normalized": "hannabeckett",
    "category": 0
  },
  {
    "normalized": "alenacaprice",
    "category": 0
  },
  {
    "normalized": "tattoogirlalia",
    "category": 0
  },
  {
    "normalized": "qingqing521",
    "category": 0
  },
  {
    "normalized": "mounika25",
    "category": 0
  },
  {
    "normalized": "linlin",
    "category": 0
  },
  {
    "normalized": "evilyn",
    "category": 0
  },
  {
    "normalized": "bonkkmee",
    "category": 0
  },
  {
    "normalized": "anabella",
    "category": 0
  },
  {
    "normalized": "sidnymeow",
    "category": 0
  },
  {
    "normalized": "nordicsexcams",
    "category": 0
  },
  {
    "normalized": "athenedestiny",
    "category": 0
  },
  {
    "normalized": "alleinhalte",
    "category": 0
  },
  {
    "normalized": "neukarrierewelt",
    "category": 0
  },
  {
    "normalized": "cookiemanagement",
    "category": 8
  },
  {
    "normalized": "boxing",
    "category": 0
  },
  {
    "normalized": "mma",
    "category": 0
  },
  {
    "normalized": "transfers",
    "category": 0
  },
  {
    "normalized": "allsport",
    "category": 0
  },
  {
    "normalized": "listenlive",
    "category": 0
  },
  {
    "normalized": "schedulecatchup",
    "category": 0
  },
  {
    "normalized": "tottenhamconfirmfabioparaticihaslefttheclub",
    "category": 0
  },
  {
    "normalized": "privacyandcookiepolicy",
    "category": 0
  },
  {
    "normalized": "obtenmasinformacionyconfiguraelusodecookies",
    "category": 3
  },
  {
    "normalized": "devenirlicencie",
    "category": 0
  },
  {
    "normalized": "tutoriels",
    "category": 0
  },
  {
    "normalized": "connexioninscription",
    "category": 0
  },
  {
    "normalized": "courtalouer",
    "category": 0
  },
  {
    "normalized": "club",
    "category": 0
  },
  {
    "normalized": "championnatparequipe",
    "category": 0
  },
  {
    "normalized": "definirvospreferences",
    "category": 3
  },
  {
    "normalized": "erforderlich",
    "category": 8
  },
  {
    "normalized": "analyse",
    "category": 0
  },
  {
    "normalized": "werbung",
    "category": 0
  },
  {
    "normalized": "auswahlubernehmen",
    "category": 4
  },
  {
    "normalized": "viewourpartnerstofindoutmore",
    "category": 0
  },
  {
    "normalized": "viewallreportedincidents",
    "category": 0
  },
  {
    "normalized": "viewstatus",
    "category": 0
  },
  {
    "normalized": "bakerloo",
    "category": 0
  },
  {
    "normalized": "central",
    "category": 0
  },
  {
    "normalized": "circle",
    "category": 0
  },
  {
    "normalized": "district",
    "category": 0
  },
  {
    "normalized": "hammersmithcity",
    "category": 0
  },
  {
    "normalized": "jubilee",
    "category": 0
  },
  {
    "normalized": "metropolitan",
    "category": 0
  },
  {
    "normalized": "northern",
    "category": 0
  },
  {
    "normalized": "piccadilly",
    "category": 0
  },
  {
    "normalized": "victoria",
    "category": 0
  },
  {
    "normalized": "waterloocity",
    "category": 0
  },
  {
    "normalized": "londonoverground",
    "category": 0
  },
  {
    "normalized": "elizabethline",
    "category": 0
  },
  {
    "normalized": "dlr",
    "category": 0
  },
  {
    "normalized": "tram",
    "category": 0
  },
  {
    "normalized": "a1",
    "category": 0
  },
  {
    "normalized": "scegliletuelocalnews",
    "category": 0
  },
  {
    "normalized": "statistiquesetperformance",
    "category": 0
  },
  {
    "normalized": "plusdedetails",
    "category": 3
  },
  {
    "normalized": "uniquementnecessaires",
    "category": 2
  },
  {
    "normalized": "tinder",
    "category": 0
  },
  {
    "normalized": "learn",
    "category": 0
  },
  {
    "normalized": "safety",
    "category": 0
  },
  {
    "normalized": "language",
    "category": 0
  },
  {
    "normalized": "moreinfooncookiesandprovidersweuse",
    "category": 0
  },
  {
    "normalized": "personalizemychoices",
    "category": 3
  },
  {
    "normalized": "erlauben",
    "category": 1
  },
  {
    "normalized": "accettasoloinecessari",
    "category": 2
  },
  {
    "normalized": "hilfeundkontakt",
    "category": 0
  },
  {
    "normalized": "bahnhotel",
    "category": 0
  },
  {
    "normalized": "fruhestehinreise",
    "category": 0
  },
  {
    "normalized": "spatesteruckreise",
    "category": 0
  },
  {
    "normalized": "reisefinden",
    "category": 0
  },
  {
    "normalized": "filter",
    "category": 0
  },
  {
    "normalized": "themen",
    "category": 0
  },
  {
    "normalized": "bestenlisten",
    "category": 0
  },
  {
    "normalized": "okostrom",
    "category": 0
  },
  {
    "normalized": "heuteistwarnstreikdieserechtehabenzugreisende",
    "category": 0
  },
  {
    "normalized": "handyaufladenkostetes75centoder075cent",
    "category": 0
  },
  {
    "normalized": "aktuellinteressant",
    "category": 0
  },
  {
    "normalized": "nesquikkabacokakaofalltbeiokotestdurch",
    "category": 0
  },
  {
    "normalized": "okostromanbieterdassinddiebilligstenunterdenbesten",
    "category": 0
  },
  {
    "normalized": "spargelrohessenwasdafurspricht",
    "category": 0
  },
  {
    "normalized": "okotestschuppenshampoosnaturkosmetikmeistsehrgut",
    "category": 0
  },
  {
    "normalized": "beliebtebestenlisten",
    "category": 0
  },
  {
    "normalized": "grunemodelabels",
    "category": 0
  },
  {
    "normalized": "diebestenmodelabelsfurfairtradekleidungnachhaltigemode",
    "category": 0
  },
  {
    "normalized": "unsere9partner",
    "category": 8
  },
  {
    "normalized": "unserepartner",
    "category": 0
  },
  {
    "normalized": "zustimmenundweiter",
    "category": 1
  },
  {
    "normalized": "werbefreifur299monat",
    "category": 5
  },
  {
    "normalized": "hilfezurnutzung",
    "category": 0
  },
  {
    "normalized": "cinemaonicelunedi10aprilesusky",
    "category": 0
  },
  {
    "normalized": "chiudi",
    "category": 1
  },
  {
    "normalized": "proceedwithrequiredcookiesonly",
    "category": 2
  },
  {
    "normalized": "viewcookiesettings",
    "category": 3
  },
  {
    "normalized": "viewprivacypolicy",
    "category": 0
  },
  {
    "normalized": "notrepolitiquedecookies",
    "category": 0
  },
  {
    "normalized": "configurales",
    "category": 3
  },
  {
    "normalized": "acceptalestotes",
    "category": 1
  },
  {
    "normalized": "ja",
    "category": 8
  },
  {
    "normalized": "ca",
    "category": 0
  },
  {
    "normalized": "cercador",
    "category": 0
  },
  {
    "normalized": "temes",
    "category": 0
  },
  {
    "normalized": "seuelectronica",
    "category": 0
  },
  {
    "normalized": "tramits",
    "category": 0
  },
  {
    "normalized": "situacionsdevida",
    "category": 0
  },
  {
    "normalized": "generalitat",
    "category": 0
  },
  {
    "normalized": "actualitat",
    "category": 0
  },
  {
    "normalized": "setcookieoptions",
    "category": 3
  },
  {
    "normalized": "settingsreject",
    "category": 8
  },
  {
    "normalized": "forgotyourpassword",
    "category": 0
  },
  {
    "normalized": "learnmoreinourcookiepolicy",
    "category": 0
  },
  {
    "normalized": "siaccetto",
    "category": 1
  },
  {
    "normalized": "ouijaccepte",
    "category": 1
  },
  {
    "normalized": "jaichstimmezu",
    "category": 1
  },
  {
    "normalized": "groupem6",
    "category": 0
  },
  {
    "normalized": "partenairespublicitaires",
    "category": 0
  },
  {
    "normalized": "confidentialite",
    "category": 0
  },
  {
    "normalized": "tilpascookies",
    "category": 3
  },
  {
    "normalized": "nurnotwendige",
    "category": 2
  },
  {
    "normalized": "fornecedoresexternos",
    "category": 0
  },
  {
    "normalized": "geriropcoes",
    "category": 3
  },
  {
    "normalized": "toutrejeter",
    "category": 2
  },
  {
    "normalized": "iunderstand",
    "category": 1
  },
  {
    "normalized": "infoeinstellungen",
    "category": 3
  },
  {
    "normalized": "ablehnung",
    "category": 2
  },
  {
    "normalized": "einwilligung",
    "category": 1
  },
  {
    "normalized": "managetracking",
    "category": 8
  },
  {
    "normalized": "gestionarelseguimiento",
    "category": 0
  },
  {
    "normalized": "cerrar",
    "category": 9
  },
  {
    "normalized": "nograziesoloicookietecnici",
    "category": 2
  },
  {
    "normalized": "nonaccettare",
    "category": 2
  },
  {
    "normalized": "negailconsenso",
    "category": 2
  },
  {
    "normalized": "strumentiditracciamento",
    "category": 0
  },
  {
    "normalized": "cookiepreferences",
    "category": 3
  },
  {
    "normalized": "okay",
    "category": 1
  },
  {
    "normalized": "preferenciasdecookies",
    "category": 3
  },
  {
    "normalized": "vale",
    "category": 1
  },
  {
    "normalized": "datenschutzhinweis",
    "category": 0
  },
  {
    "normalized": "mehrinformationen",
    "category": 3
  },
  {
    "normalized": "voirlalistedenospartenaires",
    "category": 0
  },
  {
    "normalized": "accettotutti",
    "category": 1
  },
  {
    "normalized": "gestiscilepreferenze",
    "category": 3
  },
  {
    "normalized": "anbieterubersicht",
    "category": 0
  },
  {
    "normalized": "accettaviviunesperienzacompleta",
    "category": 1
  },
  {
    "normalized": "continuasenzaavereunesperienzapersonalizzata",
    "category": 2
  },
  {
    "normalized": "cookiesverwalten",
    "category": 3
  },
  {
    "normalized": "mitausschließlichfunktionalencookiesfortfahren",
    "category": 2
  },
  {
    "normalized": "auswahlen",
    "category": 3
  },
  {
    "normalized": "apodiscounterde",
    "category": 0
  },
  {
    "normalized": "apocom",
    "category": 0
  },
  {
    "normalized": "apothekede",
    "category": 0
  },
  {
    "normalized": "apothekeat",
    "category": 0
  },
  {
    "normalized": "apoluxde",
    "category": 0
  },
  {
    "normalized": "juvalisde",
    "category": 0
  },
  {
    "normalized": "deutscheinternetapothekede",
    "category": 0
  },
  {
    "normalized": "versandapode",
    "category": 0
  },
  {
    "normalized": "individuelleeinstellungenverwalten",
    "category": 3
  },
  {
    "normalized": "listen",
    "category": 8
  },
  {
    "normalized": "liste",
    "category": 0
  },
  {
    "normalized": "ichstimmeallemzu",
    "category": 1
  },
  {
    "normalized": "getthedeals",
    "category": 3
  },
  {
    "normalized": "comescriverelefrazionisuword",
    "category": 0
  },
  {
    "normalized": "comescaricarelibridagooglebooksgratis",
    "category": 0
  },
  {
    "normalized": "programmipermasterizzare",
    "category": 0
  },
  {
    "normalized": "comeaggiornaredriverpc",
    "category": 0
  },
  {
    "normalized": "applicazioniperandroidutili",
    "category": 0
  },
  {
    "normalized": "modificar",
    "category": 3
  },
  {
    "normalized": "zertifikate",
    "category": 0
  },
  {
    "normalized": "hebelprodukte",
    "category": 0
  },
  {
    "normalized": "devisen",
    "category": 0
  },
  {
    "normalized": "rohstoffe",
    "category": 0
  },
  {
    "normalized": "fonds",
    "category": 0
  },
  {
    "normalized": "etfs",
    "category": 0
  },
  {
    "normalized": "krypto",
    "category": 0
  },
  {
    "normalized": "anleihen",
    "category": 0
  },
  {
    "normalized": "depot",
    "category": 0
  },
  {
    "normalized": "hangseng",
    "category": 0
  },
  {
    "normalized": "sp500",
    "category": 0
  },
  {
    "normalized": "olpreis",
    "category": 0
  },
  {
    "normalized": "nikkei225",
    "category": 0
  },
  {
    "normalized": "eurostoxx50",
    "category": 0
  },
  {
    "normalized": "goldpreis",
    "category": 0
  },
  {
    "normalized": "zumlogin",
    "category": 0
  },
  {
    "normalized": "rgpd",
    "category": 0
  },
  {
    "normalized": "cookieconsenttool",
    "category": 0
  },
  {
    "normalized": "configuraciones",
    "category": 3
  },
  {
    "normalized": "personalizarlascookies",
    "category": 3
  },
  {
    "normalized": "jetztfinden",
    "category": 0
  },
  {
    "normalized": "unsererdatenschutzerklarung",
    "category": 0
  },
  {
    "normalized": "nurerforderlichecookiesverwenden",
    "category": 2
  },
  {
    "normalized": "ichbindamiteinverstanden",
    "category": 1
  },
  {
    "normalized": "privatsphareeinstellungen",
    "category": 0
  },
  {
    "normalized": "zumangebot",
    "category": 0
  },
  {
    "normalized": "220partner",
    "category": 0
  },
  {
    "normalized": "stellenmarkt",
    "category": 0
  },
  {
    "normalized": "kfz",
    "category": 0
  },
  {
    "normalized": "tickets",
    "category": 0
  },
  {
    "normalized": "themenwelten",
    "category": 0
  },
  {
    "normalized": "karteidernot",
    "category": 0
  },
  {
    "normalized": "meinplus",
    "category": 0
  },
  {
    "normalized": "lokales",
    "category": 0
  },
  {
    "normalized": "traueranzeigen",
    "category": 0
  },
  {
    "normalized": "anzeigen",
    "category": 0
  },
  {
    "normalized": "intersana",
    "category": 0
  },
  {
    "normalized": "abohefte",
    "category": 0
  },
  {
    "normalized": "favoriten",
    "category": 0
  },
  {
    "normalized": "oldtimersteuer",
    "category": 0
  },
  {
    "normalized": "shanghaiautoshow2023",
    "category": 0
  },
  {
    "normalized": "breenunfall",
    "category": 0
  },
  {
    "normalized": "bestellstoppbeiaudi",
    "category": 0
  },
  {
    "normalized": "ams+fur099testen",
    "category": 0
  },
  {
    "normalized": "privacymanager",
    "category": 8
  },
  {
    "normalized": "daccord",
    "category": 1
  },
  {
    "normalized": "sonogiaabbonatofammientrare",
    "category": 8
  },
  {
    "normalized": "lirelapolitiquedeconfidentialite",
    "category": 0
  },
  {
    "normalized": "ne",
    "category": 2
  },
  {
    "normalized": "de",
    "category": 0
  },
  {
    "normalized": "strikterforderlichecookies",
    "category": 2
  },
  {
    "normalized": "funktional",
    "category": 0
  },
  {
    "normalized": "ausfuhrlicheinformationenunddetaillierteeinstellungen>",
    "category": 3
  },
  {
    "normalized": "backrezepte",
    "category": 0
  },
  {
    "normalized": "gesunderbacken",
    "category": 0
  },
  {
    "normalized": "besserbacken",
    "category": 0
  },
  {
    "normalized": "jetzteinloggen",
    "category": 0
  },
  {
    "normalized": "personalisierteanzeigenanzeigenmessungunderkenntnisseuberzielgruppen",
    "category": 0
  },
  {
    "normalized": "contentpassfaq",
    "category": 0
  },
  {
    "normalized": "rechazolascookies",
    "category": 2
  },
  {
    "normalized": "configurarpreferencias",
    "category": 3
  },
  {
    "normalized": "mevabien",
    "category": 1
  },
  {
    "normalized": "cestokpourmoi",
    "category": 1
  },
  {
    "normalized": "branchesandatms",
    "category": 0
  },
  {
    "normalized": "condicionesgenerales",
    "category": 0
  },
  {
    "normalized": "masactitudes",
    "category": 0
  },
  {
    "normalized": "mehreinstellungen",
    "category": 3
  },
  {
    "normalized": "einwilligungablehnen",
    "category": 2
  },
  {
    "normalized": "acceso",
    "category": 8
  },
  {
    "normalized": "6063angeboteundpauschalen",
    "category": 0
  },
  {
    "normalized": "316angeboteundpauschalen",
    "category": 0
  },
  {
    "normalized": "hieranderecookiesablehnen",
    "category": 8
  },
  {
    "normalized": "allencookieszustimmen",
    "category": 1
  },
  {
    "normalized": "ablehnenkonfigurieren",
    "category": 8
  },
  {
    "normalized": "clickhere",
    "category": 8
  },
  {
    "normalized": "showvendors",
    "category": 0
  },
  {
    "normalized": "findecollection",
    "category": 0
  },
  {
    "normalized": "jusqua701surlesite",
    "category": 0
  },
  {
    "normalized": "politiquedenoscookies",
    "category": 0
  },
  {
    "normalized": "changemypreferences",
    "category": 3
  },
  {
    "normalized": "changecookiessettings",
    "category": 3
  },
  {
    "normalized": "mostrarlospropositos",
    "category": 0
  },
  {
    "normalized": "alleannehmen",
    "category": 1
  },
  {
    "normalized": "investment",
    "category": 0
  },
  {
    "normalized": "uberuns",
    "category": 0
  },
  {
    "normalized": "experten",
    "category": 0
  },
  {
    "normalized": "wissen",
    "category": 0
  },
  {
    "normalized": "bcdi",
    "category": 0
  },
  {
    "normalized": "bcdiusa",
    "category": 0
  },
  {
    "normalized": "bcdideutschland",
    "category": 0
  },
  {
    "normalized": "boersedeaktienfonds",
    "category": 0
  },
  {
    "normalized": "boersedetechnologiefonds",
    "category": 0
  },
  {
    "normalized": "listedesfournisseurs",
    "category": 0
  },
  {
    "normalized": "selectionnerdespublicitesstandard",
    "category": 0
  },
  {
    "normalized": "creerunprofilpersonnalisedepublicites",
    "category": 0
  },
  {
    "normalized": "selectionnerdespublicitespersonnalisees",
    "category": 0
  },
  {
    "normalized": "barajeans",
    "category": 0
  },
  {
    "normalized": "cartecadeau",
    "category": 0
  },
  {
    "normalized": "marqueengagee",
    "category": 0
  },
  {
    "normalized": "accettatuttiicookiediprofilazione",
    "category": 1
  },
  {
    "normalized": "rifiutatuttiicookiediprofilazione",
    "category": 2
  },
  {
    "normalized": "salvapreferenzeedesci",
    "category": 4
  },
  {
    "normalized": "uniquementlescookiesnecessaires",
    "category": 2
  },
  {
    "normalized": "enprofiter",
    "category": 0
  },
  {
    "normalized": "10000conseillerset500boutiquesprochesdevous",
    "category": 0
  },
  {
    "normalized": "trouverunnouveautelephone",
    "category": 0
  },
  {
    "normalized": "choisirunforfaitmobile",
    "category": 0
  },
  {
    "normalized": "changerdeboxinternet",
    "category": 0
  },
  {
    "normalized": "moffrirunesmarttv",
    "category": 0
  },
  {
    "normalized": "accederalassistance",
    "category": 0
  },
  {
    "normalized": "terzepartiselezionateaderentialtcfdiiab",
    "category": 0
  },
  {
    "normalized": "individuelleeinstellungen",
    "category": 3
  },
  {
    "normalized": "monmagasin",
    "category": 0
  },
  {
    "normalized": "nosoffres",
    "category": 0
  },
  {
    "normalized": "projetsetchantiers",
    "category": 0
  },
  {
    "normalized": "outildegestiondechantier",
    "category": 0
  },
  {
    "normalized": "aide",
    "category": 0
  },
  {
    "normalized": "grosœuvre",
    "category": 0
  },
  {
    "normalized": "isolationcloisonetplafond",
    "category": 0
  },
  {
    "normalized": "electricite",
    "category": 0
  },
  {
    "normalized": "menuiserieinterieure",
    "category": 0
  },
  {
    "normalized": "menuiserieexterieure",
    "category": 0
  },
  {
    "normalized": "revetementsolsetmurs",
    "category": 0
  },
  {
    "normalized": "cuisine",
    "category": 0
  },
  {
    "normalized": "sallesdebainsetsanitaires",
    "category": 0
  },
  {
    "normalized": "outillage",
    "category": 0
  },
  {
    "normalized": "chauffageettraitementdelair",
    "category": 0
  },
  {
    "normalized": "plomberie",
    "category": 0
  },
  {
    "normalized": "quincaillerierangement",
    "category": 0
  },
  {
    "normalized": "amenagementexterieur",
    "category": 0
  },
  {
    "normalized": "peintureetdecoration",
    "category": 0
  },
  {
    "normalized": "equipementdeprotectionindividuelle",
    "category": 0
  },
  {
    "normalized": "configuracioncookies",
    "category": 3
  },
  {
    "normalized": "strictlynecessarycookies",
    "category": 2
  },
  {
    "normalized": "analytics",
    "category": 0
  },
  {
    "normalized": "indenwarenkorb",
    "category": 0
  },
  {
    "normalized": "zurstartseite",
    "category": 0
  },
  {
    "normalized": "hearts",
    "category": 0
  },
  {
    "normalized": "moments",
    "category": 0
  },
  {
    "normalized": "family",
    "category": 0
  },
  {
    "normalized": "health",
    "category": 0
  },
  {
    "normalized": "beauty",
    "category": 0
  },
  {
    "normalized": "fashion",
    "category": 0
  },
  {
    "normalized": "topnews",
    "category": 0
  },
  {
    "normalized": "mehrlesen",
    "category": 3
  },
  {
    "normalized": "alleakzeptierenundweiterlesen",
    "category": 1
  },
  {
    "normalized": "einfacheanzeigenpersonalisierteinhalteundanzeigenmessung",
    "category": 0
  },
  {
    "normalized": "utilizardatosdelocalizaciongeograficaprecisa",
    "category": 0
  },
  {
    "normalized": "analizaractivamentelascaracteristicasdeldispositivoparasuidentificacion",
    "category": 0
  },
  {
    "normalized": "disagreeexit",
    "category": 2
  },
  {
    "normalized": "agreeexit",
    "category": 1
  },
  {
    "normalized": "jetztbzberlinpurabonnieren",
    "category": 0
  },
  {
    "normalized": "topvente",
    "category": 0
  },
  {
    "normalized": "cartescadeaux",
    "category": 0
  },
  {
    "normalized": "configurarorechazarsuuso",
    "category": 3
  },
  {
    "normalized": "aceptaryseguirnavegando",
    "category": 1
  },
  {
    "normalized": "lesmagazines",
    "category": 0
  },
  {
    "normalized": "ensavoir+etparametrermeschoix",
    "category": 3
  },
  {
    "normalized": "cancel",
    "category": 8
  },
  {
    "normalized": "suivezlareformedesretraites",
    "category": 0
  },
  {
    "normalized": "expolabeautecacheedelindustrie",
    "category": 0
  },
  {
    "normalized": "nosconseilscrypto",
    "category": 0
  },
  {
    "normalized": "lirelasuite",
    "category": 8
  },
  {
    "normalized": "fichefiabilite",
    "category": 0
  },
  {
    "normalized": "evenementcaradisiac",
    "category": 0
  },
  {
    "normalized": "peugeot208alepreuvependantunesemaine",
    "category": 0
  },
  {
    "normalized": "cards",
    "category": 0
  },
  {
    "normalized": "personalisedcards",
    "category": 0
  },
  {
    "normalized": "gifts",
    "category": 0
  },
  {
    "normalized": "giftwrap",
    "category": 0
  },
  {
    "normalized": "balloons",
    "category": 0
  },
  {
    "normalized": "birthday",
    "category": 0
  },
  {
    "normalized": "elencodeipartnerfornitori",
    "category": 0
  },
  {
    "normalized": "mostrafinalita",
    "category": 0
  },
  {
    "normalized": "continuaresenzaaccettare",
    "category": 2
  },
  {
    "normalized": "scopridipiuepersonalizza",
    "category": 3
  },
  {
    "normalized": "vendita",
    "category": 0
  },
  {
    "normalized": "affitto",
    "category": 0
  },
  {
    "normalized": "vacanze",
    "category": 0
  },
  {
    "normalized": "stanze",
    "category": 0
  },
  {
    "normalized": "pubblicaannunciogratis",
    "category": 0
  },
  {
    "normalized": "einstellungenundablehnen",
    "category": 8
  },
  {
    "normalized": "okverstanden",
    "category": 1
  },
  {
    "normalized": "thirdpartyproviders",
    "category": 0
  },
  {
    "normalized": "privacysettings",
    "category": 3
  },
  {
    "normalized": "rejectnonessentialcookies",
    "category": 2
  },
  {
    "normalized": "weiterohnezuakzeptieren",
    "category": 2
  },
  {
    "normalized": "acceptcontinue",
    "category": 1
  },
  {
    "normalized": "signintomy4",
    "category": 0
  },
  {
    "normalized": "boxsets",
    "category": 0
  },
  {
    "normalized": "parentalcontrolsoff",
    "category": 0
  },
  {
    "normalized": "viewall20",
    "category": 0
  },
  {
    "normalized": "thehunter",
    "category": 0
  },
  {
    "normalized": "thedogacademy",
    "category": 0
  },
  {
    "normalized": "nakedattraction",
    "category": 0
  },
  {
    "normalized": "taskmaster",
    "category": 0
  },
  {
    "normalized": "thegreenman",
    "category": 0
  },
  {
    "normalized": "selectindividualcategories",
    "category": 8
  },
  {
    "normalized": "choisissezvotreoffre",
    "category": 0
  },
  {
    "normalized": "accepteruniquementlescookiesessentiels",
    "category": 2
  },
  {
    "normalized": "ajustesdecookies",
    "category": 3
  },
  {
    "normalized": "consulternotrepolitiquecookies",
    "category": 0
  },
  {
    "normalized": "acceptadditionalcookies",
    "category": 8
  },
  {
    "normalized": "datenschutzcenter",
    "category": 0
  },
  {
    "normalized": "manuallymanagecookies",
    "category": 3
  },
  {
    "normalized": "datenschutzerklarungpur",
    "category": 0
  },
  {
    "normalized": "letsgo",
    "category": 9
  },
  {
    "normalized": "mitcontentpasseinloggen",
    "category": 5
  },
  {
    "normalized": "nonoragrazie",
    "category": 2
  },
  {
    "normalized": "parametrermeschoix",
    "category": 3
  },
  {
    "normalized": "flerevalgmuligheder",
    "category": 3
  },
  {
    "normalized": "privatliv",
    "category": 0
  },
  {
    "normalized": "vilkar",
    "category": 0
  },
  {
    "normalized": "jouez",
    "category": 0
  },
  {
    "normalized": "no",
    "category": 2
  },
  {
    "normalized": "yes",
    "category": 8
  },
  {
    "normalized": "rejectcookies",
    "category": 2
  },
  {
    "normalized": "sussocios",
    "category": 0
  },
  {
    "normalized": "continueretaccepter",
    "category": 1
  },
  {
    "normalized": "consentitutti",
    "category": 1
  },
  {
    "normalized": "donneespersonnellesetcookies",
    "category": 0
  },
  {
    "normalized": "cookierichtlinie",
    "category": 0
  },
  {
    "normalized": "keepthemoff",
    "category": 2
  },
  {
    "normalized": "wirtschaft",
    "category": 0
  },
  {
    "normalized": "help",
    "category": 0
  },
  {
    "normalized": "vernuestrapoliticadecookies",
    "category": 0
  },
  {
    "normalized": "cookiesablehnen",
    "category": 2
  },
  {
    "normalized": "allecookieszulassen",
    "category": 1
  },
  {
    "normalized": "usedition",
    "category": 0
  },
  {
    "normalized": "nouscontacter",
    "category": 0
  },
  {
    "normalized": "ohnewerbetrackingfur299monat",
    "category": 5
  },
  {
    "normalized": "mesinformacio→",
    "category": 3
  },
  {
    "normalized": "acceptaritancar",
    "category": 1
  },
  {
    "normalized": "gaming",
    "category": 0
  },
  {
    "normalized": "paneldeconfiguracion",
    "category": 3
  },
  {
    "normalized": "notifications",
    "category": 0
  },
  {
    "normalized": "preferencias",
    "category": 3
  },
  {
    "normalized": "vor1stunde12minuten",
    "category": 0
  },
  {
    "normalized": "vor2stunden41minuten",
    "category": 0
  },
  {
    "normalized": "vor1stunde23minuten",
    "category": 0
  },
  {
    "normalized": "vor4stunden",
    "category": 0
  },
  {
    "normalized": "vor1stunde59minuten",
    "category": 0
  },
  {
    "normalized": "obstgemuse",
    "category": 0
  },
  {
    "normalized": "kuhlregal",
    "category": 0
  },
  {
    "normalized": "tiefkuhl",
    "category": 0
  },
  {
    "normalized": "lebensmittel",
    "category": 0
  },
  {
    "normalized": "drogerie",
    "category": 0
  },
  {
    "normalized": "wasser",
    "category": 0
  },
  {
    "normalized": "limosaft",
    "category": 0
  },
  {
    "normalized": "weine",
    "category": 0
  },
  {
    "normalized": "spirituosen",
    "category": 0
  },
  {
    "normalized": "bebe",
    "category": 0
  },
  {
    "normalized": "acceptandcontinuetosite",
    "category": 1
  },
  {
    "normalized": "kultur",
    "category": 0
  },
  {
    "normalized": "subscribe",
    "category": 0
  },
  {
    "normalized": "accettoicookie",
    "category": 1
  },
  {
    "normalized": "parametrervotreconsentement",
    "category": 3
  },
  {
    "normalized": "cliquezici",
    "category": 8
  },
  {
    "normalized": "dsgvo",
    "category": 0
  },
  {
    "normalized": "jeconsultelesoffres",
    "category": 0
  },
  {
    "normalized": "einstellungsmoglichkeiten",
    "category": 3
  },
  {
    "normalized": "allezulassen",
    "category": 1
  },
  {
    "normalized": "essentialcookiesonly",
    "category": 2
  },
  {
    "normalized": "community",
    "category": 0
  },
  {
    "normalized": "reviews",
    "category": 0
  },
  {
    "normalized": "datenschutzoptionen",
    "category": 3
  },
  {
    "normalized": "schließenakzeptieren",
    "category": 1
  },
  {
    "normalized": "jetztbezahlen",
    "category": 0
  },
  {
    "normalized": "akzeptierenweiter",
    "category": 1
  },
  {
    "normalized": "denegar",
    "category": 2
  },
  {
    "normalized": "detailszeigen",
    "category": 3
  },
  {
    "normalized": "freepattern",
    "category": 0
  },
  {
    "normalized": "monespace",
    "category": 0
  },
  {
    "normalized": "tiermarkt",
    "category": 0
  },
  {
    "normalized": "veureelsnostressocis",
    "category": 0
  },
  {
    "normalized": "administrercookies",
    "category": 3
  },
  {
    "normalized": "jemabonne",
    "category": 5
  },
  {
    "normalized": "modificaleimpostazioni",
    "category": 3
  },
  {
    "normalized": "annehmen",
    "category": 1
  },
  {
    "normalized": "zweckeanzeigen",
    "category": 0
  },
  {
    "normalized": "apps",
    "category": 0
  },
  {
    "normalized": "meinkonto",
    "category": 0
  },
  {
    "normalized": "mais",
    "category": 3
  },
  {
    "normalized": "mail",
    "category": 0
  },
  {
    "normalized": "abonnierenfur299monat",
    "category": 5
  },
  {
    "normalized": "choosecookies",
    "category": 3
  },
  {
    "normalized": "datenschutzinformationszentrum",
    "category": 9
  },
  {
    "normalized": "gestiondescookies",
    "category": 3
  },
  {
    "normalized": "subscribefornotifications",
    "category": 0
  },
  {
    "normalized": "getmyoffer",
    "category": 0
  },
  {
    "normalized": "gbedition",
    "category": 0
  },
  {
    "normalized": "dejaabonneseconnecter",
    "category": 0
  },
  {
    "normalized": "configurarlasorechazarlasclicandoaqui",
    "category": 0
  },
  {
    "normalized": "useofcookies",
    "category": 0
  },
  {
    "normalized": "precisegeolocation",
    "category": 0
  },
  {
    "normalized": "dismiss",
    "category": 2
  },
  {
    "normalized": "jobs",
    "category": 0
  },
  {
    "normalized": "aktuell",
    "category": 0
  },
  {
    "normalized": "legalnotice",
    "category": 0
  },
  {
    "normalized": "establecerpreferencias",
    "category": 3
  },
  {
    "normalized": "eveningstandard",
    "category": 0
  },
  {
    "normalized": "verweigern",
    "category": 2
  },
  {
    "normalized": "notwendigecookies",
    "category": 2
  },
  {
    "normalized": "gestisciicookie",
    "category": 3
  },
  {
    "normalized": "weiterohneeinwilligung",
    "category": 2
  },
  {
    "normalized": "einwilligunginternationalerdatentransfer",
    "category": 8
  },
  {
    "normalized": "skyglass",
    "category": 0
  },
  {
    "normalized": "jetzttesten",
    "category": 0
  },
  {
    "normalized": "nachangriffvonexpatientmiteisenstangepsychiaterinstirbt",
    "category": 0
  },
  {
    "normalized": "leifersmutmaßlichebrandstifterausgeforscht",
    "category": 0
  },
  {
    "normalized": "promizaungastjanniksinneruberraschtamateurfußballer",
    "category": 0
  },
  {
    "normalized": "rablandlkwkommtvonstraßeabfahrerverletzt",
    "category": 0
  },
  {
    "normalized": "seifenkistenspaßauf4radern",
    "category": 0
  },
  {
    "normalized": "datenschutzhinweisencontentpass",
    "category": 0
  },
  {
    "normalized": "diesescoolebalkonsetistbeibossgeraderichtiggunstig",
    "category": 0
  },
  {
    "normalized": "arbeitenmitperfekterworklifebalanceisthiermoglich",
    "category": 0
  },
  {
    "normalized": "sosiehtdermodernstekuchenfachmarktinhalleaus",
    "category": 0
  },
  {
    "normalized": "nyheder",
    "category": 0
  },
  {
    "normalized": "legroupetf1",
    "category": 0
  },
  {
    "normalized": "cookiestraceurstechniques",
    "category": 0
  },
  {
    "normalized": "detiers",
    "category": 0
  },
  {
    "normalized": "scottishsun",
    "category": 0
  },
  {
    "normalized": "money",
    "category": 0
  },
  {
    "normalized": "alrighty",
    "category": 1
  },
  {
    "normalized": "furtherinfo",
    "category": 3
  },
  {
    "normalized": "aidecontact",
    "category": 0
  },
  {
    "normalized": "permitirsolocookiesesenciales",
    "category": 2
  },
  {
    "normalized": "solocookieessenziali",
    "category": 2
  },
  {
    "normalized": "successivo",
    "category": 0
  },
  {
    "normalized": "pausa",
    "category": 0
  },
  {
    "normalized": "configurarlascookies",
    "category": 3
  },
  {
    "normalized": "auswahlbestatigenspeichern",
    "category": 4
  },
  {
    "normalized": "listeunsererpartner",
    "category": 0
  },
  {
    "normalized": "thridparty",
    "category": 0
  },
  {
    "normalized": "account",
    "category": 0
  },
  {
    "normalized": "wishlist",
    "category": 0
  },
  {
    "normalized": "basket",
    "category": 0
  },
  {
    "normalized": "hobbii",
    "category": 0
  },
  {
    "normalized": "diy4u",
    "category": 0
  },
  {
    "normalized": "jeparametre",
    "category": 3
  },
  {
    "normalized": "onlynecessarycookies",
    "category": 2
  },
  {
    "normalized": "nurnotwendigeakzeptieren",
    "category": 2
  },
  {
    "normalized": "suchenach",
    "category": 0
  },
  {
    "normalized": "wosuchstdu",
    "category": 0
  },
  {
    "normalized": "alleerlauben",
    "category": 1
  },
  {
    "normalized": "proseguisenzaconsenso",
    "category": 2
  },
  {
    "normalized": "scopodanoiutilizzato",
    "category": 0
  },
  {
    "normalized": "caratteristichedanoiutilizzate",
    "category": 0
  },
  {
    "normalized": "informazioniutilizzabili",
    "category": 0
  },
  {
    "normalized": "berechtigteminteresse",
    "category": 0
  },
  {
    "normalized": "paisinflacion",
    "category": 0
  },
  {
    "normalized": "alquilergobierno",
    "category": 0
  },
  {
    "normalized": "jubilacionobligatoria",
    "category": 0
  },
  {
    "normalized": "reinounido",
    "category": 0
  },
  {
    "normalized": "tinyhomes",
    "category": 0
  },
  {
    "normalized": "ibex35",
    "category": 0
  },
  {
    "normalized": "eurusd",
    "category": 0
  },
  {
    "normalized": "bankinter",
    "category": 0
  },
  {
    "normalized": "filmeserien",
    "category": 0
  },
  {
    "normalized": "jetztentdecken",
    "category": 0
  },
  {
    "normalized": "angebote",
    "category": 0
  },
  {
    "normalized": "opcionesdegestion",
    "category": 3
  },
  {
    "normalized": "nichtakzeptieren",
    "category": 2
  },
  {
    "normalized": "weitereeinstellungen",
    "category": 3
  },
  {
    "normalized": "jenacceptepas",
    "category": 2
  },
  {
    "normalized": "altrescelte",
    "category": 3
  },
  {
    "normalized": "hierklicken",
    "category": 8
  },
  {
    "normalized": "zudeneinstellungen",
    "category": 3
  },
  {
    "normalized": "favoris",
    "category": 0
  },
  {
    "normalized": "historique",
    "category": 0
  },
  {
    "normalized": "secciondedatos",
    "category": 0
  },
  {
    "normalized": "functionalanalyticsadvertisingnoniabvendorsandsocialmediacookies",
    "category": 9
  },
  {
    "normalized": "indizes",
    "category": 0
  },
  {
    "normalized": "hotstuff",
    "category": 0
  },
  {
    "normalized": "offiziell",
    "category": 0
  },
  {
    "normalized": "rtindikation",
    "category": 0
  },
  {
    "normalized": "vergleichschart",
    "category": 0
  },
  {
    "normalized": "datenschutzinformationen",
    "category": 0
  },
  {
    "normalized": "holidays",
    "category": 0
  },
  {
    "normalized": "destinations",
    "category": 0
  },
  {
    "normalized": "searchholidays",
    "category": 0
  },
  {
    "normalized": "liefergebiet",
    "category": 0
  },
  {
    "normalized": "marketingpartner",
    "category": 0
  },
  {
    "normalized": "active",
    "category": 0
  },
  {
    "normalized": "tarife",
    "category": 0
  },
  {
    "normalized": "handystablets",
    "category": 0
  },
  {
    "normalized": "tvinternet",
    "category": 0
  },
  {
    "normalized": "vertragverlangern",
    "category": 0
  },
  {
    "normalized": "akzeptierealle",
    "category": 0
  },
  {
    "normalized": "einstellungenspeichern",
    "category": 4
  },
  {
    "normalized": "motori",
    "category": 0
  },
  {
    "normalized": "marketinganalysis",
    "category": 0
  },
  {
    "normalized": "nograzie",
    "category": 2
  },
  {
    "normalized": "newsticker",
    "category": 0
  },
  {
    "normalized": "foren",
    "category": 0
  },
  {
    "normalized": "videopodcast",
    "category": 0
  },
  {
    "normalized": "verkehr",
    "category": 0
  },
  {
    "normalized": "regionen",
    "category": 0
  },
  {
    "normalized": "gesellschaft",
    "category": 0
  },
  {
    "normalized": "outlet",
    "category": 0
  },
  {
    "normalized": "alleoptionalencookiesablehnen",
    "category": 2
  },
  {
    "normalized": "refusertouslescookiesoptionnels",
    "category": 2
  },
  {
    "normalized": "kategorien",
    "category": 0
  },
  {
    "normalized": "nachrichten",
    "category": 0
  },
  {
    "normalized": "ichsuche",
    "category": 0
  },
  {
    "normalized": "categorias",
    "category": 0
  },
  {
    "normalized": "notificaciones",
    "category": 0
  },
  {
    "normalized": "buscar",
    "category": 0
  },
  {
    "normalized": "lemag",
    "category": 0
  },
  {
    "normalized": "connexion",
    "category": 0
  },
  {
    "normalized": "magasin",
    "category": 0
  },
  {
    "normalized": "jouets",
    "category": 0
  },
  {
    "normalized": "puericulture",
    "category": 0
  },
  {
    "normalized": "necessaryonly",
    "category": 2
  },
  {
    "normalized": "link",
    "category": 0
  },
  {
    "normalized": "900832685",
    "category": 0
  },
  {
    "normalized": "sillamadme",
    "category": 9
  },
  {
    "normalized": "garcon",
    "category": 0
  },
  {
    "normalized": "tallasgrandes",
    "category": 0
  },
  {
    "normalized": "toutaccepteretfermer",
    "category": 1
  },
  {
    "normalized": "refuseandconfigure",
    "category": 8
  },
  {
    "normalized": "moda",
    "category": 0
  },
  {
    "normalized": "bonsplans",
    "category": 0
  },
  {
    "normalized": "monespacelaredoute+",
    "category": 0
  },
  {
    "normalized": "configurermespreferences",
    "category": 3
  },
  {
    "normalized": "rifiutareeconfigurare",
    "category": 8
  },
  {
    "normalized": "690",
    "category": 0
  },
  {
    "normalized": "jemidentifie",
    "category": 0
  },
  {
    "normalized": "politique",
    "category": 0
  },
  {
    "normalized": "sciences",
    "category": 0
  },
  {
    "normalized": "style",
    "category": 0
  },
  {
    "normalized": "guerreenukraine",
    "category": 0
  },
  {
    "normalized": "reformedesretraites",
    "category": 0
  },
  {
    "normalized": "infosulservizio",
    "category": 0
  },
  {
    "normalized": "tech",
    "category": 0
  },
  {
    "normalized": "jegaccepterer",
    "category": 1
  },
  {
    "normalized": "visformal",
    "category": 3
  },
  {
    "normalized": "politiquedegestiondescookies",
    "category": 0
  },
  {
    "normalized": "weiterohnezustimmung→",
    "category": 2
  },
  {
    "normalized": "einstellen",
    "category": 3
  },
  {
    "normalized": "zulassenundschließen",
    "category": 1
  },
  {
    "normalized": "autoriseretfermer",
    "category": 1
  },
  {
    "normalized": "opensitesearch",
    "category": 0
  },
  {
    "normalized": "selectpersonalisedads",
    "category": 0
  },
  {
    "normalized": "particuliers",
    "category": 0
  },
  {
    "normalized": "affinermeschoix",
    "category": 3
  },
  {
    "normalized": "gartenpraxis",
    "category": 0
  },
  {
    "normalized": "gartengestaltung",
    "category": 0
  },
  {
    "normalized": "grunesleben",
    "category": 0
  },
  {
    "normalized": "dating",
    "category": 0
  },
  {
    "normalized": "cookiesfromourpartners",
    "category": 0
  },
  {
    "normalized": "readfulllegaldescription",
    "category": 0
  },
  {
    "normalized": "lirelarticle",
    "category": 0
  },
  {
    "normalized": "decouvrirles37engagementsmgen",
    "category": 0
  },
  {
    "normalized": "jeprotegemasante",
    "category": 0
  },
  {
    "normalized": "jerealiseundevis",
    "category": 0
  },
  {
    "normalized": "lescookiesstatistiques",
    "category": 0
  },
  {
    "normalized": "lescookiesdepersonnalisation",
    "category": 0
  },
  {
    "normalized": "lescookiespublicitaires",
    "category": 0
  },
  {
    "normalized": "configurarrechazarcookies",
    "category": 8
  },
  {
    "normalized": "tirichiamiamo",
    "category": 0
  },
  {
    "normalized": "cookieindstillingerne",
    "category": 0
  },
  {
    "normalized": "godkendalle",
    "category": 1
  },
  {
    "normalized": "godkendkunobligatoriske",
    "category": 2
  },
  {
    "normalized": "accepterobligatoireseulement",
    "category": 2
  },
  {
    "normalized": "nonvenderelemieinformazionipersonali",
    "category": 8
  },
  {
    "normalized": "400weiterewebsites",
    "category": 8
  },
  {
    "normalized": "200weiterewebsites",
    "category": 0
  },
  {
    "normalized": "yesiaccept",
    "category": 1
  },
  {
    "normalized": "technischnichtnotwendigecookiesablehnen",
    "category": 2
  },
  {
    "normalized": "externeinhalteunderweiterteinteraktion",
    "category": 0
  },
  {
    "normalized": "opciones",
    "category": 3
  },
  {
    "normalized": "touslesproduits",
    "category": 0
  },
  {
    "normalized": "weitereoptionen",
    "category": 3
  },
  {
    "normalized": "weitereinformationen",
    "category": 3
  },
  {
    "normalized": "accettaselezionati",
    "category": 4
  },
  {
    "normalized": "ottoundfunfpartnerbrauchen",
    "category": 0
  },
  {
    "normalized": "allow",
    "category": 1
  },
  {
    "normalized": "personalisedadsandadmeasurement",
    "category": 0
  },
  {
    "normalized": "hardware",
    "category": 0
  },
  {
    "normalized": "bestof",
    "category": 0
  },
  {
    "normalized": "thetop100",
    "category": 0
  },
  {
    "normalized": "infoseite",
    "category": 0
  },
  {
    "normalized": "nonmostrarepiu",
    "category": 9
  },
  {
    "normalized": "mariedesange",
    "category": 0
  },
  {
    "normalized": "changerdedateetdheure",
    "category": 0
  },
  {
    "normalized": "optionenverwalten",
    "category": 3
  },
  {
    "normalized": "manageyourpreferences",
    "category": 3
  },
  {
    "normalized": "personalisierteinhalteundinhaltemessung",
    "category": 0
  },
  {
    "normalized": "helenefischer",
    "category": 0
  },
  {
    "normalized": "andreasgabalier",
    "category": 0
  },
  {
    "normalized": "floriansilbereisen",
    "category": 0
  },
  {
    "normalized": "andreaberg",
    "category": 0
  },
  {
    "normalized": "denegarcookies",
    "category": 2
  },
  {
    "normalized": "nurfunktionalecookies",
    "category": 2
  },
  {
    "normalized": "correo",
    "category": 0
  },
  {
    "normalized": "hilfe",
    "category": 0
  },
  {
    "normalized": "cookiesundahnlichetechnologien",
    "category": 0
  },
  {
    "normalized": "skyq",
    "category": 0
  },
  {
    "normalized": "skywifi",
    "category": 0
  },
  {
    "normalized": "produkte",
    "category": 0
  },
  {
    "normalized": "zurmerklistehinzufugen",
    "category": 0
  },
  {
    "normalized": "zustimmenundschließen",
    "category": 1
  },
  {
    "normalized": "newsapp",
    "category": 0
  },
  {
    "normalized": "digitalezeitung",
    "category": 0
  },
  {
    "normalized": "sonderthemen",
    "category": 0
  },
  {
    "normalized": "abonnieren",
    "category": 0
  },
  {
    "normalized": "stuttgart",
    "category": 0
  },
  {
    "normalized": "kriseimsudanersterevakuierungsfluginberlingelandet",
    "category": 0
  },
  {
    "normalized": "kindergefahrdetluftverschmutzungineuropaweiterzuhoch",
    "category": 0
  },
  {
    "normalized": "ukrainekriegimlivetickermoskauhatstabilitatderweltzerstort",
    "category": 0
  },
  {
    "normalized": "problemzonebohlweginbraunschweigkanneinalkoholverbothelfen",
    "category": 0
  },
  {
    "normalized": "gasexplosioninwohnung55jahrigerinlebensgefahr",
    "category": 0
  },
  {
    "normalized": "anmeldelser",
    "category": 0
  },
  {
    "normalized": "telefoner",
    "category": 0
  },
  {
    "normalized": "bærbare",
    "category": 0
  },
  {
    "normalized": "tiers",
    "category": 0
  },
  {
    "normalized": "permitirlastodas",
    "category": 1
  },
  {
    "normalized": "irishsun",
    "category": 0
  },
  {
    "normalized": "sunbingo",
    "category": 0
  },
  {
    "normalized": "dreamteam",
    "category": 0
  },
  {
    "normalized": "showbiz",
    "category": 0
  },
  {
    "normalized": "fabulous",
    "category": 0
  },
  {
    "normalized": "deardeidre",
    "category": 0
  },
  {
    "normalized": "finebyme",
    "category": 1
  },
  {
    "normalized": "logout",
    "category": 0
  },
  {
    "normalized": "showall",
    "category": 8
  },
  {
    "normalized": "alleauswahlenundschließen",
    "category": 1
  },
  {
    "normalized": "autresservices",
    "category": 0
  },
  {
    "normalized": "electriciteetgaz",
    "category": 0
  },
  {
    "normalized": "economiesdenergie",
    "category": 0
  },
  {
    "normalized": "vehiculeselectriques",
    "category": 0
  },
  {
    "normalized": "pourquoinouschoisir",
    "category": 0
  },
  {
    "normalized": "personalisedcontentcontentmeasurementaudienceinsightsandproductdevelopment",
    "category": 0
  },
  {
    "normalized": "any",
    "category": 9
  },
  {
    "normalized": "feelmorethrillsinqatar",
    "category": 0
  },
  {
    "normalized": "thecheapestallinclusiveholidaydestinationsthissummer",
    "category": 0
  },
  {
    "normalized": "makethemostofyourannualleavein2023",
    "category": 0
  },
  {
    "normalized": "howtogetmoreforyourmoneyonholiday",
    "category": 0
  },
  {
    "normalized": "nuressentiellecookies",
    "category": 2
  },
  {
    "normalized": "hideads",
    "category": 8
  },
  {
    "normalized": "videoondemand",
    "category": 0
  },
  {
    "normalized": "rejectandclose",
    "category": 2
  },
  {
    "normalized": "administrarmiscookies",
    "category": 3
  },
  {
    "normalized": "jeparametrelescookies",
    "category": 3
  },
  {
    "normalized": "fornitoriconcertificazioneiab",
    "category": 0
  },
  {
    "normalized": "klima",
    "category": 0
  },
  {
    "normalized": "koln7c",
    "category": 0
  },
  {
    "normalized": "berlin16c",
    "category": 0
  },
  {
    "normalized": "hamburg13c",
    "category": 0
  },
  {
    "normalized": "munchen12c",
    "category": 0
  },
  {
    "normalized": "frankfurtammain13c",
    "category": 0
  },
  {
    "normalized": "tweetsfromwetterzentrale1",
    "category": 0
  },
  {
    "normalized": "xnxx",
    "category": 0
  },
  {
    "normalized": "sololasesenciales",
    "category": 2
  },
  {
    "normalized": "uniquementlesessentiels",
    "category": 2
  },
  {
    "normalized": "definirmespreferences",
    "category": 3
  },
  {
    "normalized": "onlyessential",
    "category": 2
  },
  {
    "normalized": "einverstandenundweiter",
    "category": 1
  },
  {
    "normalized": "solocookiesestrictamentenecesarias",
    "category": 2
  },
  {
    "normalized": "personalizarconfiguracion",
    "category": 3
  },
  {
    "normalized": "utiliseruniquementlescookiesnecessaires",
    "category": 2
  },
  {
    "normalized": "modifierlesparametres",
    "category": 3
  },
  {
    "normalized": "soloicookiesnecessari",
    "category": 2
  },
  {
    "normalized": "accettaeprosegui",
    "category": 1
  },
  {
    "normalized": "gestiscileimpostazioni",
    "category": 3
  },
  {
    "normalized": "abschnitteinzelheiten",
    "category": 0
  },
  {
    "normalized": "readourcookiepolicy",
    "category": 0
  },
  {
    "normalized": "sauvegardervospreferences",
    "category": 4
  },
  {
    "normalized": "configurarlasorechazarsuusoclicandoaqui",
    "category": 8
  },
  {
    "normalized": "gratuit",
    "category": 0
  },
  {
    "normalized": "partager",
    "category": 0
  },
  {
    "normalized": "nouveau",
    "category": 0
  },
  {
    "normalized": "+partages",
    "category": 0
  },
  {
    "normalized": "+vus",
    "category": 0
  },
  {
    "normalized": "tagmanagement",
    "category": 0
  },
  {
    "normalized": "bing",
    "category": 0
  },
  {
    "normalized": "meta",
    "category": 0
  },
  {
    "normalized": "googleads",
    "category": 0
  },
  {
    "normalized": "googleanalytics",
    "category": 0
  },
  {
    "normalized": "criteo",
    "category": 0
  },
  {
    "normalized": "selezionaicookies",
    "category": 3
  },
  {
    "normalized": "managecookiesettingsacceptall",
    "category": 8
  },
  {
    "normalized": "acceptproceed",
    "category": 1
  },
  {
    "normalized": "coursesenligne",
    "category": 0
  },
  {
    "normalized": "magasinsu",
    "category": 0
  },
  {
    "normalized": "votrecodepostalouville",
    "category": 0
  },
  {
    "normalized": "jeminspire",
    "category": 0
  },
  {
    "normalized": "lapolitiquedegestiondestraceurs",
    "category": 0
  },
  {
    "normalized": "browse",
    "category": 0
  },
  {
    "normalized": "english|krdkk",
    "category": 0
  },
  {
    "normalized": "patternswithdiscount",
    "category": 0
  },
  {
    "normalized": "registerforfree",
    "category": 0
  },
  {
    "normalized": "bestseller",
    "category": 0
  },
  {
    "normalized": "newpatterns",
    "category": 0
  },
  {
    "normalized": "currenttrends",
    "category": 0
  },
  {
    "normalized": "discount",
    "category": 0
  },
  {
    "normalized": "popularauthors",
    "category": 0
  },
  {
    "normalized": "calkalco",
    "category": 0
  },
  {
    "normalized": "crochet",
    "category": 0
  },
  {
    "normalized": "knitting",
    "category": 0
  },
  {
    "normalized": "sewing",
    "category": 0
  },
  {
    "normalized": "craftsdiy",
    "category": 0
  },
  {
    "normalized": "knooking",
    "category": 0
  },
  {
    "normalized": "felting",
    "category": 0
  },
  {
    "normalized": "embroidery",
    "category": 0
  },
  {
    "normalized": "plotting",
    "category": 0
  },
  {
    "normalized": "gallery",
    "category": 0
  },
  {
    "normalized": "crafts",
    "category": 0
  },
  {
    "normalized": "freepatternsinourblog",
    "category": 0
  },
  {
    "normalized": "sigridcardigan",
    "category": 0
  },
  {
    "normalized": "bookmarkenglerbunnycrochetpattern",
    "category": 0
  },
  {
    "normalized": "barbaraengler",
    "category": 0
  },
  {
    "normalized": "cremebruleehoodie",
    "category": 0
  },
  {
    "normalized": "bestofnew",
    "category": 0
  },
  {
    "normalized": "featuredpatterns",
    "category": 0
  },
  {
    "normalized": "featuredauthor",
    "category": 0
  },
  {
    "normalized": "pattern4kids",
    "category": 0
  },
  {
    "normalized": "acornmittsknittingpattern3sizes",
    "category": 0
  },
  {
    "normalized": "filartaue",
    "category": 0
  },
  {
    "normalized": "frauriedelstrickt",
    "category": 0
  },
  {
    "normalized": "madebyanja",
    "category": 0
  },
  {
    "normalized": "crochetpatterntriangularscarfpantariste",
    "category": 0
  },
  {
    "normalized": "kleinesfeines",
    "category": 0
  },
  {
    "normalized": "easterfriendsamigurumibunnychickandsheepcrochetpattern",
    "category": 0
  },
  {
    "normalized": "toysbyknitfriends",
    "category": 0
  },
  {
    "normalized": "knittingpatternwashclothdishclothchristmastreeeasy",
    "category": 0
  },
  {
    "normalized": "crochetpatternchickeneggcosy",
    "category": 0
  },
  {
    "normalized": "expansionpacksweetdreams",
    "category": 0
  },
  {
    "normalized": "triangularscarfchalomabecrochetpattern",
    "category": 0
  },
  {
    "normalized": "heartbasketformanyoccasions",
    "category": 0
  },
  {
    "normalized": "vousetesunparticulier",
    "category": 0
  },
  {
    "normalized": "rechercherunethematiqueunproduit",
    "category": 0
  },
  {
    "normalized": "trouveruneagence",
    "category": 0
  },
  {
    "normalized": "etvousquelestvotrebesoin",
    "category": 0
  },
  {
    "normalized": "viewourprivacypolicy",
    "category": 0
  },
  {
    "normalized": "choisissezunmagasin",
    "category": 0
  },
  {
    "normalized": "bonjouridentifiezvous",
    "category": 0
  },
  {
    "normalized": "universproduits",
    "category": 0
  },
  {
    "normalized": "noscours",
    "category": 0
  },
  {
    "normalized": "refuseretfermer",
    "category": 2
  },
  {
    "normalized": "ausschließlichnotwendigecookieszulassen",
    "category": 2
  },
  {
    "normalized": "reglagesdescookies",
    "category": 3
  },
  {
    "normalized": "itspartners",
    "category": 0
  },
  {
    "normalized": "individualsettings",
    "category": 3
  },
  {
    "normalized": "allecookiesannehmen",
    "category": 1
  },
  {
    "normalized": "eigeneauswahltreffen",
    "category": 3
  },
  {
    "normalized": "40dedescuento",
    "category": 0
  },
  {
    "normalized": "40deremise",
    "category": 0
  },
  {
    "normalized": "40disconto",
    "category": 0
  },
  {
    "normalized": "webanalyse",
    "category": 0
  },
  {
    "normalized": "personalisiertewerbemaßnahmen",
    "category": 0
  },
  {
    "normalized": "zustimmenmitzusammenfuhrung",
    "category": 1
  },
  {
    "normalized": "confirmmychoices",
    "category": 4
  },
  {
    "normalized": "upgradetocore",
    "category": 0
  },
  {
    "normalized": "join",
    "category": 0
  },
  {
    "normalized": "usermenu",
    "category": 0
  },
  {
    "normalized": "submit",
    "category": 9
  },
  {
    "normalized": "deviation",
    "category": 0
  },
  {
    "normalized": "aceptoelusodecookies",
    "category": 1
  },
  {
    "normalized": "rejectallunnecessarycookies",
    "category": 2
  },
  {
    "normalized": "okiagree",
    "category": 1
  },
  {
    "normalized": "nurunbedingterforderlich",
    "category": 2
  },
  {
    "normalized": "personalizzaituoicookie",
    "category": 3
  },
  {
    "normalized": "informativadatipersonali",
    "category": 0
  },
  {
    "normalized": "learnmoreadjustsettings",
    "category": 3
  },
  {
    "normalized": "widersprechen",
    "category": 9
  },
  {
    "normalized": "auswahltreffen",
    "category": 9
  },
  {
    "normalized": "periodismoporyparajuristas",
    "category": 0
  },
  {
    "normalized": "rejectnonessential",
    "category": 2
  },
  {
    "normalized": "marktangebote",
    "category": 0
  },
  {
    "normalized": "jobsbeiedeka",
    "category": 0
  },
  {
    "normalized": "unseremarken",
    "category": 0
  },
  {
    "normalized": "gewinnspiele",
    "category": 0
  },
  {
    "normalized": "nachhaltigkeitbeiedeka",
    "category": 0
  },
  {
    "normalized": "youtubeaktivieren",
    "category": 0
  },
  {
    "normalized": "alleangebote",
    "category": 0
  },
  {
    "normalized": "aktivieren",
    "category": 0
  },
  {
    "normalized": "nurnotwendigetechnologien",
    "category": 2
  },
  {
    "normalized": "cookiesindividuellauswahlen",
    "category": 3
  },
  {
    "normalized": "mercadosycotizaciones",
    "category": 0
  },
  {
    "normalized": "toutautoriser",
    "category": 1
  },
  {
    "normalized": "portada",
    "category": 0
  },
  {
    "normalized": "informacionyajustes",
    "category": 3
  },
  {
    "normalized": "empinternational",
    "category": 0
  },
  {
    "normalized": "empfrance",
    "category": 0
  },
  {
    "normalized": "empdeutschland",
    "category": 0
  },
  {
    "normalized": "empitalia",
    "category": 0
  },
  {
    "normalized": "emppolska",
    "category": 0
  },
  {
    "normalized": "empceskarepublika",
    "category": 0
  },
  {
    "normalized": "empnorge",
    "category": 0
  },
  {
    "normalized": "empschweiz",
    "category": 0
  },
  {
    "normalized": "empsuomi",
    "category": 0
  },
  {
    "normalized": "empireland",
    "category": 0
  },
  {
    "normalized": "empunitedkingdom",
    "category": 0
  },
  {
    "normalized": "empsweden",
    "category": 0
  },
  {
    "normalized": "empdanmark",
    "category": 0
  },
  {
    "normalized": "largenetherlands",
    "category": 0
  },
  {
    "normalized": "emposterreich",
    "category": 0
  },
  {
    "normalized": "empslovensko",
    "category": 0
  },
  {
    "normalized": "largebelgique",
    "category": 0
  },
  {
    "normalized": "empespana",
    "category": 0
  },
  {
    "normalized": "backstageclub",
    "category": 0
  },
  {
    "normalized": "nachhaltigbeiemp",
    "category": 0
  },
  {
    "normalized": "payback",
    "category": 0
  },
  {
    "normalized": "getthelook",
    "category": 0
  },
  {
    "normalized": "empmerchandisefanartikelshopfurrockentertainment",
    "category": 0
  },
  {
    "normalized": "nee",
    "category": 2
  },
  {
    "normalized": "neu",
    "category": 0
  },
  {
    "normalized": "schuhe",
    "category": 0
  },
  {
    "normalized": "bandmerch",
    "category": 0
  },
  {
    "normalized": "wohnenfreizeit",
    "category": 0
  },
  {
    "normalized": "cookiepolicyqui",
    "category": 0
  },
  {
    "normalized": "mehrvonernstingsfamily",
    "category": 0
  },
  {
    "normalized": "cookieinformationen",
    "category": 0
  },
  {
    "normalized": "allentoolszustimmen",
    "category": 1
  },
  {
    "normalized": "nurerforderlichetechnologien",
    "category": 2
  },
  {
    "normalized": "consenso",
    "category": 8
  },
  {
    "normalized": "zustimmung",
    "category": 1
  },
  {
    "normalized": "provinciacittanomeonumeroditelefono",
    "category": 0
  },
  {
    "normalized": "adcamgirlsitaliane",
    "category": 0
  },
  {
    "normalized": "accedialsito",
    "category": 8
  },
  {
    "normalized": "abbandonailsito",
    "category": 8
  },
  {
    "normalized": "sonodaccordo",
    "category": 1
  },
  {
    "normalized": "searchforitemsorshops",
    "category": 0
  },
  {
    "normalized": "skiptocontent",
    "category": 9
  },
  {
    "normalized": "readourwonderfullyweirdstory",
    "category": 0
  },
  {
    "normalized": "gotohelpcenter",
    "category": 9
  },
  {
    "normalized": "updatesettings",
    "category": 8
  },
  {
    "normalized": "pc",
    "category": 0
  },
  {
    "normalized": "playstation",
    "category": 0
  },
  {
    "normalized": "xbox",
    "category": 0
  },
  {
    "normalized": "nintendo",
    "category": 0
  },
  {
    "normalized": "digitalfoundry",
    "category": 0
  },
  {
    "normalized": "tippslosung",
    "category": 0
  },
  {
    "normalized": "residentevil4remakekomplettlosung",
    "category": 0
  },
  {
    "normalized": "residentevil4remakealle16aufziehkastellane",
    "category": 0
  },
  {
    "normalized": "residentevil4remakealleherausforderungen",
    "category": 0
  },
  {
    "normalized": "fifa23totw25",
    "category": 0
  },
  {
    "normalized": "fifa23totsevent",
    "category": 0
  },
  {
    "normalized": "fifa23futfantasyupgradetracker",
    "category": 0
  },
  {
    "normalized": "hogwartslegacykomplettlosungtippsundtricks",
    "category": 0
  },
  {
    "normalized": "metroidprimekomplettlosung",
    "category": 0
  },
  {
    "normalized": "pokemongoumweltwoche2023",
    "category": 0
  },
  {
    "normalized": "pokemongopflanzenunddankbarkeit",
    "category": 0
  },
  {
    "normalized": "schonregistriert",
    "category": 0
  },
  {
    "normalized": "administrer",
    "category": 3
  },
  {
    "normalized": "kundenødvendige",
    "category": 2
  },
  {
    "normalized": "cambialemieimpostazioni",
    "category": 3
  },
  {
    "normalized": "creeruncompte",
    "category": 0
  },
  {
    "normalized": "touslesjeux",
    "category": 0
  },
  {
    "normalized": "euromillions",
    "category": 0
  },
  {
    "normalized": "illiko",
    "category": 0
  },
  {
    "normalized": "bingolive",
    "category": 0
  },
  {
    "normalized": "resultats",
    "category": 0
  },
  {
    "normalized": "jeuresponsable",
    "category": 0
  },
  {
    "normalized": "parissportifspoker",
    "category": 0
  },
  {
    "normalized": "lacharteviepriveedelafrancaisedesjeux",
    "category": 0
  },
  {
    "normalized": "mitgliedwerden",
    "category": 0
  },
  {
    "normalized": "jetztmitgliedwerden",
    "category": 0
  },
  {
    "normalized": "cookiesanpassen",
    "category": 3
  },
  {
    "normalized": "disallowcookies",
    "category": 2
  },
  {
    "normalized": "inhaltemessungerkenntnisseuberzielgruppenundproduktentwicklung",
    "category": 0
  },
  {
    "normalized": "externeinhaltesozialenetzwerke",
    "category": 0
  },
  {
    "normalized": "freitag21042023",
    "category": 0
  },
  {
    "normalized": "pushmitteilungen",
    "category": 0
  },
  {
    "normalized": "realtimekurseaktiv",
    "category": 0
  },
  {
    "normalized": "alleerlaubenundweiter",
    "category": 1
  },
  {
    "normalized": "shortlist0",
    "category": 0
  },
  {
    "normalized": "citybreaks",
    "category": 0
  },
  {
    "normalized": "extras",
    "category": 0
  },
  {
    "normalized": "chat",
    "category": 0
  },
  {
    "normalized": "saveandexit",
    "category": 8
  },
  {
    "normalized": "scegliepersonalizza",
    "category": 3
  },
  {
    "normalized": "entendido",
    "category": 1
  },
  {
    "normalized": "accederauxrubriquesetsitesdefranceinfo",
    "category": 0
  },
  {
    "normalized": "accederauxsitesdefrancetv",
    "category": 0
  },
  {
    "normalized": "accederauxsitesderadiofrance",
    "category": 0
  },
  {
    "normalized": "accederaumenumoncompte",
    "category": 0
  },
  {
    "normalized": "sousmenupolitique",
    "category": 0
  },
  {
    "normalized": "sousmenusociete",
    "category": 0
  },
  {
    "normalized": "sousmenufaitsdivers",
    "category": 0
  },
  {
    "normalized": "sousmenusante",
    "category": 0
  },
  {
    "normalized": "sousmenuecoconso",
    "category": 0
  },
  {
    "normalized": "sousmenumonde",
    "category": 0
  },
  {
    "normalized": "sousmenueurope",
    "category": 0
  },
  {
    "normalized": "sousmenuculture",
    "category": 0
  },
  {
    "normalized": "sousmenusport",
    "category": 0
  },
  {
    "normalized": "sousmenuenvironnement",
    "category": 0
  },
  {
    "normalized": "sousmenumeteo",
    "category": 0
  },
  {
    "normalized": "meinshop",
    "category": 0
  },
  {
    "normalized": "hilfekontakt",
    "category": 0
  },
  {
    "normalized": "ohneeinwilligungweiter",
    "category": 1
  },
  {
    "normalized": "mobilfunk",
    "category": 0
  },
  {
    "normalized": "internet",
    "category": 0
  },
  {
    "normalized": "tventertainment",
    "category": 0
  },
  {
    "normalized": "mailcloud",
    "category": 0
  },
  {
    "normalized": "finanzen",
    "category": 0
  },
  {
    "normalized": "digital",
    "category": 0
  },
  {
    "normalized": "domain",
    "category": 0
  },
  {
    "normalized": "steilekarriere",
    "category": 0
  },
  {
    "normalized": "usa",
    "category": 0
  },
  {
    "normalized": "bugatti",
    "category": 0
  },
  {
    "normalized": "merkfix",
    "category": 0
  },
  {
    "normalized": "flop",
    "category": 0
  },
  {
    "normalized": "seitensprung",
    "category": 0
  },
  {
    "normalized": "kundenservice",
    "category": 0
  },
  {
    "normalized": "sozialemedien",
    "category": 0
  },
  {
    "normalized": "analytik",
    "category": 0
  },
  {
    "normalized": "datenaustausch",
    "category": 0
  },
  {
    "normalized": "generierungeineruseridaufbasisihreremailadresse",
    "category": 0
  },
  {
    "normalized": "verwalten",
    "category": 3
  },
  {
    "normalized": "anpassencookiedetails",
    "category": 3
  },
  {
    "normalized": "individuellecookieeinstellungen",
    "category": 3
  },
  {
    "normalized": "parametresindividuelsdescookies",
    "category": 3
  },
  {
    "normalized": "giftlists",
    "category": 0
  },
  {
    "normalized": "deliveringto",
    "category": 0
  },
  {
    "normalized": "seethefullrange",
    "category": 0
  },
  {
    "normalized": "yourcart00",
    "category": 0
  },
  {
    "normalized": "mehrzumplusabo",
    "category": 0
  },
  {
    "normalized": "nutzungsbestimmungen",
    "category": 0
  },
  {
    "normalized": "accettareeproseguire",
    "category": 1
  },
  {
    "normalized": "visualizzaimpostazionicookie",
    "category": 3
  },
  {
    "normalized": "protegevosdonnees",
    "category": 9
  },
  {
    "normalized": "foodthemen",
    "category": 0
  },
  {
    "normalized": "freebies",
    "category": 0
  },
  {
    "normalized": "ciclismo",
    "category": 0
  },
  {
    "normalized": "parma",
    "category": 0
  },
  {
    "normalized": "fidenza",
    "category": 0
  },
  {
    "normalized": "salsomaggiore",
    "category": 0
  },
  {
    "normalized": "ilmiocomune",
    "category": 0
  },
  {
    "normalized": "italiamondo",
    "category": 0
  },
  {
    "normalized": "ilparma",
    "category": 0
  },
  {
    "normalized": "gemopro",
    "category": 0
  },
  {
    "normalized": "moncompte",
    "category": 0
  },
  {
    "normalized": "ceremonie",
    "category": 0
  },
  {
    "normalized": "enfant",
    "category": 0
  },
  {
    "normalized": "nosmarques",
    "category": 0
  },
  {
    "normalized": "gemolocation",
    "category": 0
  },
  {
    "normalized": "gemoforgood",
    "category": 0
  },
  {
    "normalized": "voyagedestinations",
    "category": 0
  },
  {
    "normalized": "selectcookies",
    "category": 3
  },
  {
    "normalized": "informationen",
    "category": 9
  },
  {
    "normalized": "strictlynecessary",
    "category": 2
  },
  {
    "normalized": "savesettings",
    "category": 4
  },
  {
    "normalized": "settingsindetail",
    "category": 3
  },
  {
    "normalized": "meineoptionen",
    "category": 3
  },
  {
    "normalized": "continuer",
    "category": 1
  },
  {
    "normalized": "rejetertout",
    "category": 2
  },
  {
    "normalized": "mesoptions",
    "category": 3
  },
  {
    "normalized": "lemieopzioni",
    "category": 3
  },
  {
    "normalized": "customerservice",
    "category": 0
  },
  {
    "normalized": "tumcerezlerikabulet",
    "category": 1
  },
  {
    "normalized": "cerezayarlarınagit",
    "category": 3
  },
  {
    "normalized": "nichtnotwendigecookiesablehnen",
    "category": 2
  },
  {
    "normalized": "administrerpræferencer",
    "category": 3
  },
  {
    "normalized": "mobiles",
    "category": 0
  },
  {
    "normalized": "security",
    "category": 0
  },
  {
    "normalized": "developer",
    "category": 0
  },
  {
    "normalized": "netzpolitik",
    "category": 0
  },
  {
    "normalized": "journal",
    "category": 0
  },
  {
    "normalized": "kunstlicheintelligenz",
    "category": 0
  },
  {
    "normalized": "windows",
    "category": 0
  },
  {
    "normalized": "linuxopensource",
    "category": 0
  },
  {
    "normalized": "diezukunftderarbeit",
    "category": 0
  },
  {
    "normalized": "hybridwork",
    "category": 0
  },
  {
    "normalized": "purabo",
    "category": 0
  },
  {
    "normalized": "puraboabschließen",
    "category": 0
  },
  {
    "normalized": "mitpuraboanmelden",
    "category": 0
  },
  {
    "normalized": "akzeptierenundschließen",
    "category": 1
  },
  {
    "normalized": "altreinfo",
    "category": 3
  },
  {
    "normalized": "hessenschau",
    "category": 0
  },
  {
    "normalized": "hr1",
    "category": 0
  },
  {
    "normalized": "hr2kultur",
    "category": 0
  },
  {
    "normalized": "hrinfo",
    "category": 0
  },
  {
    "normalized": "youfm",
    "category": 0
  },
  {
    "normalized": "hrfernsehen",
    "category": 0
  },
  {
    "normalized": "hrsinfonieorchester",
    "category": 0
  },
  {
    "normalized": "hrbigband",
    "category": 0
  },
  {
    "normalized": "derhr",
    "category": 0
  },
  {
    "normalized": "freizeit",
    "category": 0
  },
  {
    "normalized": "updatecookiepreference",
    "category": 3
  },
  {
    "normalized": "komfort",
    "category": 0
  },
  {
    "normalized": "alleauswahlenbestatigen",
    "category": 1
  },
  {
    "normalized": "hollandbarrett",
    "category": 0
  },
  {
    "normalized": "rewards",
    "category": 0
  },
  {
    "normalized": "vitaminssupplements",
    "category": 0
  },
  {
    "normalized": "fooddrink",
    "category": 0
  },
  {
    "normalized": "sportsnutrition",
    "category": 0
  },
  {
    "normalized": "guthealthhub",
    "category": 0
  },
  {
    "normalized": "cbd",
    "category": 0
  },
  {
    "normalized": "weightmanagement",
    "category": 0
  },
  {
    "normalized": "offers",
    "category": 0
  },
  {
    "normalized": "wellnessneeds",
    "category": 0
  },
  {
    "normalized": "thehealthhub",
    "category": 0
  },
  {
    "normalized": "unitedkingdom",
    "category": 0
  },
  {
    "normalized": "europeanunioneucountries",
    "category": 0
  },
  {
    "normalized": "belgium",
    "category": 0
  },
  {
    "normalized": "netherlands",
    "category": 0
  },
  {
    "normalized": "ireland",
    "category": 0
  },
  {
    "normalized": "customisesettings",
    "category": 3
  },
  {
    "normalized": "thebestindesigndecorationandstyle",
    "category": 0
  },
  {
    "normalized": "interiordesign",
    "category": 0
  },
  {
    "normalized": "kitchens",
    "category": 0
  },
  {
    "normalized": "bathrooms",
    "category": 0
  },
  {
    "normalized": "housedesign",
    "category": 0
  },
  {
    "normalized": "livingrooms",
    "category": 0
  },
  {
    "normalized": "gardens",
    "category": 0
  },
  {
    "normalized": "signuptoournewsletter",
    "category": 0
  },
  {
    "normalized": "outdatedbedroomtrends",
    "category": 0
  },
  {
    "normalized": "gardenprivacymistakes",
    "category": 0
  },
  {
    "normalized": "canyoureusepottingsoil",
    "category": 0
  },
  {
    "normalized": "hummingbirdfeedermistakes",
    "category": 0
  },
  {
    "normalized": "bestmattresstopper2023",
    "category": 0
  },
  {
    "normalized": "closecookiebannerandcontinue",
    "category": 1
  },
  {
    "normalized": "weiterecookieeinstellungen",
    "category": 3
  },
  {
    "normalized": "managemypreferences",
    "category": 3
  },
  {
    "normalized": "miterforderlicheneinstellungenfortfahren",
    "category": 8
  },
  {
    "normalized": "einstellungenanzeigen",
    "category": 3
  },
  {
    "normalized": "gundem",
    "category": 0
  },
  {
    "normalized": "dunya",
    "category": 0
  },
  {
    "normalized": "bigpara",
    "category": 0
  },
  {
    "normalized": "sporarena",
    "category": 0
  },
  {
    "normalized": "kelebek",
    "category": 0
  },
  {
    "normalized": "yasam",
    "category": 0
  },
  {
    "normalized": "yazarlar",
    "category": 0
  },
  {
    "normalized": "resmiilanlar",
    "category": 0
  },
  {
    "normalized": "ucuncutaraftedarikciler",
    "category": 0
  },
  {
    "normalized": "izinver",
    "category": 1
  },
  {
    "normalized": "secenekleriyonetin",
    "category": 3
  },
  {
    "normalized": "lapoliticadeprivacidad",
    "category": 0
  },
  {
    "normalized": "meinteresaluz",
    "category": 0
  },
  {
    "normalized": "merkzettel",
    "category": 0
  },
  {
    "normalized": "gunstigeflugefinden",
    "category": 0
  },
  {
    "normalized": "alleschnappchenanzeigen",
    "category": 0
  },
  {
    "normalized": "vuelos",
    "category": 0
  },
  {
    "normalized": "favoritos",
    "category": 0
  },
  {
    "normalized": "masgangas",
    "category": 0
  },
  {
    "normalized": "terceros",
    "category": 0
  },
  {
    "normalized": "rechazarcookiesopcionales",
    "category": 2
  },
  {
    "normalized": "arealegal",
    "category": 0
  },
  {
    "normalized": "myselection",
    "category": 8
  },
  {
    "normalized": "maselection",
    "category": 9
  },
  {
    "normalized": "plusdebonsplans",
    "category": 0
  },
  {
    "normalized": "esfournisseurstiers",
    "category": 0
  },
  {
    "normalized": "refuserlescookieoptionnels",
    "category": 2
  },
  {
    "normalized": "20des40surlemobilierizibul",
    "category": 0
  },
  {
    "normalized": "gooddays20des3articles",
    "category": 0
  },
  {
    "normalized": "oxybul",
    "category": 0
  },
  {
    "normalized": "okaidi",
    "category": 8
  },
  {
    "normalized": "obaibi",
    "category": 9
  },
  {
    "normalized": "catimini",
    "category": 0
  },
  {
    "normalized": "absorba",
    "category": 0
  },
  {
    "normalized": "chipie",
    "category": 0
  },
  {
    "normalized": "liligaufrette",
    "category": 0
  },
  {
    "normalized": "lunivers02ans",
    "category": 0
  },
  {
    "normalized": "mobilierdeco",
    "category": 0
  },
  {
    "normalized": "jetrouve",
    "category": 0
  },
  {
    "normalized": "openmainmenu",
    "category": 3
  },
  {
    "normalized": "onlynecessary",
    "category": 2
  },
  {
    "normalized": "settingsmoreinfo",
    "category": 3
  },
  {
    "normalized": "tolearnmoreaboutcookiesviewourcookiepolicy",
    "category": 0
  },
  {
    "normalized": "lalistadeinostripartner",
    "category": 0
  },
  {
    "normalized": "maggioriinformazioni",
    "category": 3
  },
  {
    "normalized": "rechazaroconfigurar",
    "category": 8
  },
  {
    "normalized": "werbefreilesenfur299monat",
    "category": 5
  },
  {
    "normalized": "naszychpartnerowreklamowych",
    "category": 0
  },
  {
    "normalized": "ustawieniaprywatnosci",
    "category": 3
  },
  {
    "normalized": "alcunipartner",
    "category": 0
  },
  {
    "normalized": "pannellodiconfigurazionedellepreferenze",
    "category": 3
  },
  {
    "normalized": "configurervospreferences",
    "category": 3
  },
  {
    "normalized": "acceptonlyrequiredcookies",
    "category": 2
  },
  {
    "normalized": "aceptarsololascookiesnecesarias",
    "category": 2
  },
  {
    "normalized": "accettasoloicookienecessari",
    "category": 2
  },
  {
    "normalized": "zustimmungenzertifiziertvon",
    "category": 0
  },
  {
    "normalized": "nogracias",
    "category": 2
  },
  {
    "normalized": "seleccionarcategoriasindividuales",
    "category": 3
  },
  {
    "normalized": "selezionacategorieindividuali",
    "category": 3
  },
  {
    "normalized": "compte",
    "category": 0
  },
  {
    "normalized": "tiendas",
    "category": 0
  },
  {
    "normalized": "cuenta",
    "category": 0
  },
  {
    "normalized": "mujer",
    "category": 0
  },
  {
    "normalized": "nina",
    "category": 0
  },
  {
    "normalized": "necesitasayuda",
    "category": 0
  },
  {
    "normalized": "negozi",
    "category": 0
  },
  {
    "normalized": "ilmioprofilo",
    "category": 0
  },
  {
    "normalized": "haibisognodiaiuto",
    "category": 0
  },
  {
    "normalized": "consultalacookiepolicy",
    "category": 0
  },
  {
    "normalized": "impostare",
    "category": 9
  },
  {
    "normalized": "cookiestracking",
    "category": 0
  },
  {
    "normalized": "externeinhalteeinbinden",
    "category": 0
  },
  {
    "normalized": "genauestandortdatenundgerateeigenschaftenzuridentifikationabfragen",
    "category": 0
  },
  {
    "normalized": "personalisierteinhalteinhaltemessungerkenntnisseuberzielgruppenundproduktentwicklungausspielen",
    "category": 0
  },
  {
    "normalized": "personalisierteanzeigenundanzeigenmessungausspielen",
    "category": 0
  },
  {
    "normalized": "werbefreifur050woche",
    "category": 5
  },
  {
    "normalized": "analyticscookies",
    "category": 0
  },
  {
    "normalized": "infosaufdeinemgeratspeichernoderabrufen",
    "category": 0
  },
  {
    "normalized": "datenverarbeitungindrittlandern",
    "category": 0
  },
  {
    "normalized": "finalita",
    "category": 0
  },
  {
    "normalized": "nousetnosfiliales",
    "category": 0
  },
  {
    "normalized": "oktoutaccepter",
    "category": 1
  },
  {
    "normalized": "continueretsabonner",
    "category": 8
  },
  {
    "normalized": "choosepreferences",
    "category": 3
  },
  {
    "normalized": "verarbeitungdeinerdaten",
    "category": 0
  },
  {
    "normalized": "lesmarques",
    "category": 0
  },
  {
    "normalized": "abzulehnen",
    "category": 2
  },
  {
    "normalized": "formation",
    "category": 0
  },
  {
    "normalized": "marchespublics",
    "category": 0
  },
  {
    "normalized": "boutique",
    "category": 0
  },
  {
    "normalized": "journalenligne",
    "category": 0
  },
  {
    "normalized": "jeux",
    "category": 0
  },
  {
    "normalized": "sabonnera1",
    "category": 0
  },
  {
    "normalized": "endirect",
    "category": 0
  },
  {
    "normalized": "faitsdivers",
    "category": 0
  },
  {
    "normalized": "ruedetivoli",
    "category": 0
  },
  {
    "normalized": "jeuxconcours",
    "category": 0
  },
  {
    "normalized": "topoffers",
    "category": 0
  },
  {
    "normalized": "brands",
    "category": 0
  },
  {
    "normalized": "trending",
    "category": 0
  },
  {
    "normalized": "promociones",
    "category": 0
  },
  {
    "normalized": "hogar",
    "category": 0
  },
  {
    "normalized": "marcas",
    "category": 0
  },
  {
    "normalized": "inspiracion",
    "category": 0
  },
  {
    "normalized": "ocasionesespeciales",
    "category": 0
  },
  {
    "normalized": "pieces",
    "category": 0
  },
  {
    "normalized": "vestiaire",
    "category": 0
  },
  {
    "normalized": "mieuxchoisir",
    "category": 0
  },
  {
    "normalized": "robedete",
    "category": 0
  },
  {
    "normalized": "biancheriaperlacasa",
    "category": 0
  },
  {
    "normalized": "casa",
    "category": 0
  },
  {
    "normalized": "outdoor",
    "category": 0
  },
  {
    "normalized": "marche",
    "category": 0
  },
  {
    "normalized": "ispirazioni",
    "category": 0
  },
  {
    "normalized": "continuewithoutacceptingoptionalcookies>",
    "category": 2
  },
  {
    "normalized": "devenirclient",
    "category": 0
  },
  {
    "normalized": "comptesetcartes",
    "category": 0
  },
  {
    "normalized": "simulateursetdevis",
    "category": 0
  },
  {
    "normalized": "mavie",
    "category": 0
  },
  {
    "normalized": "decouvrirlcl",
    "category": 0
  },
  {
    "normalized": "decouvrirapplepay",
    "category": 0
  },
  {
    "normalized": "ouvriruncompteenligne>",
    "category": 0
  },
  {
    "normalized": "simulerunpretimmobilier>",
    "category": 0
  },
  {
    "normalized": "tousnossimulateursetdevis>",
    "category": 0
  },
  {
    "normalized": "vosquestionsnosreponses>",
    "category": 0
  },
  {
    "normalized": "parametrervospreferences",
    "category": 3
  },
  {
    "normalized": "mehrdetails",
    "category": 3
  },
  {
    "normalized": "kochen",
    "category": 0
  },
  {
    "normalized": "backen",
    "category": 0
  },
  {
    "normalized": "spargel",
    "category": 0
  },
  {
    "normalized": "grillen",
    "category": 0
  },
  {
    "normalized": "fortsæt",
    "category": 8
  },
  {
    "normalized": "legnu",
    "category": 0
  },
  {
    "normalized": "refuseretsabonneraumonde",
    "category": 5
  },
  {
    "normalized": "sidentifier",
    "category": 0
  },
  {
    "normalized": "elfbar",
    "category": 0
  },
  {
    "normalized": "280",
    "category": 0
  },
  {
    "normalized": "resistancespnpvoopoo",
    "category": 0
  },
  {
    "normalized": "pufffullmoon",
    "category": 0
  },
  {
    "normalized": "1050",
    "category": 0
  },
  {
    "normalized": "resistancestppvoopoo",
    "category": 0
  },
  {
    "normalized": "jedebute",
    "category": 0
  },
  {
    "normalized": "ecigarettes",
    "category": 0
  },
  {
    "normalized": "eliquides",
    "category": 0
  },
  {
    "normalized": "coindesexperts",
    "category": 0
  },
  {
    "normalized": "diy",
    "category": 0
  },
  {
    "normalized": "485",
    "category": 0
  },
  {
    "normalized": "abonnes",
    "category": 0
  },
  {
    "normalized": "technet",
    "category": 0
  },
  {
    "normalized": "debats",
    "category": 0
  },
  {
    "normalized": "afrique",
    "category": 0
  },
  {
    "normalized": "evenements",
    "category": 0
  },
  {
    "normalized": "iranlarevolutiondesfemmes",
    "category": 0
  },
  {
    "normalized": "leclassementdeshopitaux",
    "category": 0
  },
  {
    "normalized": "ideesrecues",
    "category": 0
  },
  {
    "normalized": "classementdesecolesdecommerce",
    "category": 0
  },
  {
    "normalized": "lesguerresdelenergie",
    "category": 0
  },
  {
    "normalized": "lebigbangdeledition",
    "category": 0
  },
  {
    "normalized": "jerefuseenmabonnantpour1>",
    "category": 5
  },
  {
    "normalized": "dejaabonnejemidentifie",
    "category": 0
  },
  {
    "normalized": "lessocietesdesongroupe",
    "category": 0
  },
  {
    "normalized": "leurspartenaires",
    "category": 0
  },
  {
    "normalized": "parametrermonconsentement",
    "category": 3
  },
  {
    "normalized": "personnalisermonchoix",
    "category": 3
  },
  {
    "normalized": "listedenospartenairesfournisseurs",
    "category": 0
  },
  {
    "normalized": "autourdemoi",
    "category": 0
  },
  {
    "normalized": "mosaique",
    "category": 0
  },
  {
    "normalized": "jour",
    "category": 0
  },
  {
    "normalized": "mois",
    "category": 0
  },
  {
    "normalized": "annee",
    "category": 0
  },
  {
    "normalized": "confirmer",
    "category": 1
  },
  {
    "normalized": "disagreecreateaccount",
    "category": 8
  },
  {
    "normalized": "ideesetdebats",
    "category": 0
  },
  {
    "normalized": "societe",
    "category": 0
  },
  {
    "normalized": "environnement",
    "category": 0
  },
  {
    "normalized": "archives",
    "category": 0
  },
  {
    "normalized": "refuseretsabonnerpour1→",
    "category": 5
  },
  {
    "normalized": "parametrages",
    "category": 3
  },
  {
    "normalized": "mailplus",
    "category": 0
  },
  {
    "normalized": "mailpec",
    "category": 0
  },
  {
    "normalized": "mailbusiness",
    "category": 0
  },
  {
    "normalized": "sifattura",
    "category": 0
  },
  {
    "normalized": "annunci",
    "category": 0
  },
  {
    "normalized": "fun",
    "category": 0
  },
  {
    "normalized": "drive",
    "category": 0
  },
  {
    "normalized": "cupido",
    "category": 0
  },
  {
    "normalized": "mailapp",
    "category": 0
  },
  {
    "normalized": "socialnews",
    "category": 0
  },
  {
    "normalized": "temicaldi",
    "category": 0
  },
  {
    "normalized": "notizie",
    "category": 0
  },
  {
    "normalized": "meteo",
    "category": 0
  },
  {
    "normalized": "donne",
    "category": 0
  },
  {
    "normalized": "viaggi",
    "category": 0
  },
  {
    "normalized": "cucina",
    "category": 0
  },
  {
    "normalized": "oroscopo",
    "category": 0
  },
  {
    "normalized": "trend",
    "category": 0
  },
  {
    "normalized": "personalizzalascelta",
    "category": 3
  },
  {
    "normalized": "essentielle",
    "category": 8
  },
  {
    "normalized": "chooseavideo",
    "category": 0
  },
  {
    "normalized": "allowtechnicalcookies",
    "category": 8
  },
  {
    "normalized": "accettoeproseguo",
    "category": 1
  },
  {
    "normalized": "servicesspeichern",
    "category": 0
  },
  {
    "normalized": "nurnotwendigeannehmen",
    "category": 2
  },
  {
    "normalized": "alleoptionalenablehnen",
    "category": 2
  },
  {
    "normalized": "mysettings",
    "category": 3
  },
  {
    "normalized": "115partner",
    "category": 8
  },
  {
    "normalized": "212partner",
    "category": 8
  },
  {
    "normalized": "215partner",
    "category": 0
  },
  {
    "normalized": "maisonsdumondecom",
    "category": 0
  },
  {
    "normalized": "accountmenu",
    "category": 0
  },
  {
    "normalized": "closesearchoverlay",
    "category": 0
  },
  {
    "normalized": "europe",
    "category": 0
  },
  {
    "normalized": "fx",
    "category": 0
  },
  {
    "normalized": "rates",
    "category": 0
  },
  {
    "normalized": "futures",
    "category": 0
  },
  {
    "normalized": "ftse1007914131152015",
    "category": 0
  },
  {
    "normalized": "dax15881668569054",
    "category": 0
  },
  {
    "normalized": "cac407577003829051",
    "category": 0
  },
  {
    "normalized": "ftsemib277458111869043",
    "category": 0
  },
  {
    "normalized": "ibex359415603530037",
    "category": 0
  },
  {
    "normalized": "stoxx60046900157034",
    "category": 0
  },
  {
    "normalized": "closetrendingtickersbar",
    "category": 0
  },
  {
    "normalized": "selectbasicads",
    "category": 9
  },
  {
    "normalized": "createapersonalisedadsprofile",
    "category": 9
  },
  {
    "normalized": "unirme",
    "category": 0
  },
  {
    "normalized": "rechercherunproduitunconseil",
    "category": 0
  },
  {
    "normalized": "legroupematmut",
    "category": 0
  },
  {
    "normalized": "nosagences",
    "category": 0
  },
  {
    "normalized": "contact",
    "category": 0
  },
  {
    "normalized": "jacheteunvehicule",
    "category": 0
  },
  {
    "normalized": "jedemenage",
    "category": 0
  },
  {
    "normalized": "jeprendssoindemasante",
    "category": 0
  },
  {
    "normalized": "jadopteunanimal",
    "category": 0
  },
  {
    "normalized": "jesuisetudiant",
    "category": 0
  },
  {
    "normalized": "politiquedutilisationdescookies",
    "category": 0
  },
  {
    "normalized": "kunnødvendigecookies",
    "category": 2
  },
  {
    "normalized": "resumendecookies",
    "category": 0
  },
  {
    "normalized": "quienessomos",
    "category": 0
  },
  {
    "normalized": "personalizacion",
    "category": 8
  },
  {
    "normalized": "denegartodo",
    "category": 2
  },
  {
    "normalized": "mediapart",
    "category": 0
  },
  {
    "normalized": "alaune",
    "category": 0
  },
  {
    "normalized": "rubriques",
    "category": 0
  },
  {
    "normalized": "saintesoline",
    "category": 0
  },
  {
    "normalized": "codiceetico",
    "category": 0
  },
  {
    "normalized": "cookiedifunzionalita",
    "category": 9
  },
  {
    "normalized": "cookiediprofilazioneepubblicitamirata",
    "category": 0
  },
  {
    "normalized": "rejected",
    "category": 8
  },
  {
    "normalized": "informationenfurarbeitgeber",
    "category": 0
  },
  {
    "normalized": "ubersichtmagazine",
    "category": 0
  },
  {
    "normalized": "ubersichtnewsletter",
    "category": 0
  },
  {
    "normalized": "themenweltenergie",
    "category": 0
  },
  {
    "normalized": "losgehts",
    "category": 0
  },
  {
    "normalized": "twitter",
    "category": 0
  },
  {
    "normalized": "facebook",
    "category": 0
  },
  {
    "normalized": "youtube",
    "category": 0
  },
  {
    "normalized": "instagram",
    "category": 0
  },
  {
    "normalized": "zuippenmedia",
    "category": 0
  },
  {
    "normalized": "barralateral",
    "category": 0
  },
  {
    "normalized": "gestionar",
    "category": 3
  },
  {
    "normalized": "passerdirectementaucontenuprincipal",
    "category": 0
  },
  {
    "normalized": "accederauservicedepersonnalisationvisuelle",
    "category": 0
  },
  {
    "normalized": "jaiunequestion",
    "category": 0
  },
  {
    "normalized": "actusconseils",
    "category": 0
  },
  {
    "normalized": "noustrouver",
    "category": 0
  },
  {
    "normalized": "employeurs",
    "category": 0
  },
  {
    "normalized": "patients",
    "category": 0
  },
  {
    "normalized": "professionnelsdesante",
    "category": 0
  },
  {
    "normalized": "legroupemgen",
    "category": 0
  },
  {
    "normalized": "accepteretpoursuivre",
    "category": 1
  },
  {
    "normalized": "listofpartners",
    "category": 0
  },
  {
    "normalized": "associationsdesassociationsdemontpelliervontnettoyerlerieucoulon",
    "category": 0
  },
  {
    "normalized": "accederpourttc",
    "category": 9
  },
  {
    "normalized": "accepteretaccedergratuitement",
    "category": 1
  },
  {
    "normalized": ">accetta<",
    "category": 1
  },
  {
    "normalized": "okiagreeall",
    "category": 1
  },
  {
    "normalized": "rifiutoicookie",
    "category": 2
  },
  {
    "normalized": "okcontinue",
    "category": 1
  },
  {
    "normalized": "adjustorviewcookiepolicy",
    "category": 3
  },
  {
    "normalized": "consultarmasinformacionsobrecookiespropiasydeterceros",
    "category": 3
  },
  {
    "normalized": "accettolutilizzodeicookiediprofilazione",
    "category": 1
  },
  {
    "normalized": "nograziesolocookietecnicieanalytics",
    "category": 2
  },
  {
    "normalized": "customizemysettings",
    "category": 3
  },
  {
    "normalized": "legal",
    "category": 0
  },
  {
    "normalized": "brtworlds",
    "category": 0
  },
  {
    "normalized": "ohnezustimmungweiter",
    "category": 1
  },
  {
    "normalized": "cookieindstillingerogpolitik",
    "category": 3
  },
  {
    "normalized": "parametresetpolitiquedescookies",
    "category": 3
  },
  {
    "normalized": "suscribirme",
    "category": 0
  },
  {
    "normalized": "suscribirse",
    "category": 9
  },
  {
    "normalized": "verpoliticadeprivacidad",
    "category": 0
  },
  {
    "normalized": "erforderlichedienste",
    "category": 0
  },
  {
    "normalized": "werbungzustimmungnotig",
    "category": 0
  },
  {
    "normalized": "websiteanalyseundoptimierung",
    "category": 0
  },
  {
    "normalized": "anzeigenexternerinhalte",
    "category": 0
  },
  {
    "normalized": "yesthatsok",
    "category": 1
  },
  {
    "normalized": "dertagpolizistcrashtabsichtlichfrontalingeisterfahrer",
    "category": 0
  },
  {
    "normalized": "habilitartodas",
    "category": 1
  },
  {
    "normalized": "learnmoreaboutouruseofcookiesandinformation",
    "category": 3
  },
  {
    "normalized": "auswahlerlauben",
    "category": 4
  },
  {
    "normalized": "notwendig",
    "category": 8
  },
  {
    "normalized": "takeatour",
    "category": 0
  },
  {
    "normalized": "mynewsnow",
    "category": 0
  },
  {
    "normalized": "bigissue",
    "category": 0
  },
  {
    "normalized": "belfasttelegraph",
    "category": 0
  },
  {
    "normalized": "world",
    "category": 0
  },
  {
    "normalized": "foxnews",
    "category": 0
  },
  {
    "normalized": "deutschewelle",
    "category": 0
  },
  {
    "normalized": "outlookindia",
    "category": 0
  },
  {
    "normalized": "morningstar",
    "category": 0
  },
  {
    "normalized": "cnn",
    "category": 0
  },
  {
    "normalized": "history",
    "category": 0
  },
  {
    "normalized": "newsnowclassifieds",
    "category": 0
  },
  {
    "normalized": "propertiesforsale",
    "category": 0
  },
  {
    "normalized": "propertiesforrent",
    "category": 0
  },
  {
    "normalized": "findoutmoreabouthowweusecookies",
    "category": 3
  },
  {
    "normalized": "findastore",
    "category": 0
  },
  {
    "normalized": "joinus",
    "category": 0
  },
  {
    "normalized": "newfeatured",
    "category": 0
  },
  {
    "normalized": "kids",
    "category": 0
  },
  {
    "normalized": "personalisierteanzeigenundanzeigenmessung",
    "category": 0
  },
  {
    "normalized": "akzeptierenundweiterlesen",
    "category": 1
  },
  {
    "normalized": "zumpurabo",
    "category": 0
  },
  {
    "normalized": "ausgewahltedienstespeichern",
    "category": 4
  },
  {
    "normalized": "myaccount",
    "category": 0
  },
  {
    "normalized": "tvmembership",
    "category": 0
  },
  {
    "normalized": "termsconditions",
    "category": 0
  },
  {
    "normalized": "editcookies",
    "category": 3
  },
  {
    "normalized": "yourtrackersettings",
    "category": 3
  },
  {
    "normalized": "viewourcookiepolicy",
    "category": 0
  },
  {
    "normalized": "einstellungenubernehmen",
    "category": 8
  },
  {
    "normalized": "cookieeinstellungenandern",
    "category": 8
  },
  {
    "normalized": "einstellungenoffnen",
    "category": 3
  },
  {
    "normalized": "registrati",
    "category": 0
  },
  {
    "normalized": "complementsalimentaires",
    "category": 0
  },
  {
    "normalized": "aromatherapie",
    "category": 0
  },
  {
    "normalized": "nutrition",
    "category": 0
  },
  {
    "normalized": "beautehygiene",
    "category": 0
  },
  {
    "normalized": "recettesdiy",
    "category": 0
  },
  {
    "normalized": "conseilsactus",
    "category": 0
  },
  {
    "normalized": "requiredcookies",
    "category": 2
  },
  {
    "normalized": "allcookies",
    "category": 1
  },
  {
    "normalized": "signmeup",
    "category": 0
  },
  {
    "normalized": "zustimmenschließenx",
    "category": 1
  },
  {
    "normalized": "toutrefuseretcontinuer",
    "category": 2
  },
  {
    "normalized": "ablehnenundschließen",
    "category": 2
  },
  {
    "normalized": "ichbrauchemehrinfos",
    "category": 3
  },
  {
    "normalized": "datennutzungen",
    "category": 0
  },
  {
    "normalized": "usasoloicookietecnici",
    "category": 2
  },
  {
    "normalized": "parfum",
    "category": 0
  },
  {
    "normalized": "verzeichnis",
    "category": 0
  },
  {
    "normalized": "research",
    "category": 0
  },
  {
    "normalized": "chnokfirmoinmitcenturyvoreinemmoment",
    "category": 0
  },
  {
    "normalized": "waspassiertgerade",
    "category": 0
  },
  {
    "normalized": "neuerezensionen",
    "category": 0
  },
  {
    "normalized": "toprezensionen",
    "category": 0
  },
  {
    "normalized": "11109marken",
    "category": 0
  },
  {
    "normalized": "neubeiparfumo",
    "category": 0
  },
  {
    "normalized": "thirsttrap",
    "category": 0
  },
  {
    "normalized": "confessionsofarebel",
    "category": 0
  },
  {
    "normalized": "parfumerien",
    "category": 0
  },
  {
    "normalized": "erweitertesuche",
    "category": 0
  },
  {
    "normalized": "forsale",
    "category": 0
  },
  {
    "normalized": "valuations",
    "category": 0
  },
  {
    "normalized": "leasingfinance",
    "category": 0
  },
  {
    "normalized": "cartax",
    "category": 0
  },
  {
    "normalized": "caradvice",
    "category": 0
  },
  {
    "normalized": "companycars",
    "category": 0
  },
  {
    "normalized": "carreviewsandspecs",
    "category": 0
  },
  {
    "normalized": "ownerreviews",
    "category": 0
  },
  {
    "normalized": "specs",
    "category": 0
  },
  {
    "normalized": "carsforsale",
    "category": 0
  },
  {
    "normalized": "getafreecarvaluation",
    "category": 0
  },
  {
    "normalized": "leasingandfinance",
    "category": 0
  },
  {
    "normalized": "personalisedcontentcontentmeasurementandaudienceinsights",
    "category": 0
  },
  {
    "normalized": "developandimproveproducts",
    "category": 0
  },
  {
    "normalized": "partslink24film",
    "category": 0
  },
  {
    "normalized": "adjustsettings",
    "category": 3
  },
  {
    "normalized": "acceptonlyessentialservices",
    "category": 2
  },
  {
    "normalized": "ichnehmediekekse",
    "category": 1
  },
  {
    "normalized": "product",
    "category": 0
  },
  {
    "normalized": "forcreators",
    "category": 0
  },
  {
    "normalized": "pricing",
    "category": 0
  },
  {
    "normalized": "resources",
    "category": 0
  },
  {
    "normalized": "createonpatreon",
    "category": 0
  },
  {
    "normalized": "getstarted",
    "category": 0
  },
  {
    "normalized": "todayswordlehintandanswer674mondayapril24",
    "category": 0
  },
  {
    "normalized": "newonsteam",
    "category": 0
  },
  {
    "normalized": "speeddemon",
    "category": 0
  },
  {
    "normalized": "preisvergleich",
    "category": 0
  },
  {
    "normalized": "customisemychoices",
    "category": 3
  },
  {
    "normalized": "cliquezicipourplusdinformations",
    "category": 3
  },
  {
    "normalized": "socialmedia",
    "category": 0
  },
  {
    "normalized": "manageyourprivacy",
    "category": 3
  },
  {
    "normalized": "consentпогоджуюсь",
    "category": 1
  },
  {
    "normalized": "moreinfo",
    "category": 3
  },
  {
    "normalized": "onlyrequiredcookies",
    "category": 2
  },
  {
    "normalized": "okjaccepte",
    "category": 1
  },
  {
    "normalized": "nonjerefuse",
    "category": 2
  },
  {
    "normalized": "alatv",
    "category": 0
  },
  {
    "normalized": "superstream",
    "category": 0
  },
  {
    "normalized": "aucinema",
    "category": 0
  },
  {
    "normalized": "canal+",
    "category": 0
  },
  {
    "normalized": "disney+",
    "category": 0
  },
  {
    "normalized": "primevideo",
    "category": 0
  },
  {
    "normalized": "netflix",
    "category": 0
  },
  {
    "normalized": "ajouterdeschaines",
    "category": 0
  },
  {
    "normalized": "accettohocompreso",
    "category": 1
  },
  {
    "normalized": "declinemanagepreferences",
    "category": 8
  },
  {
    "normalized": "informativacookies",
    "category": 0
  },
  {
    "normalized": "hightechelectromenagermaisonautosantebienetreargentassurancealimentationautrescombatslitiges",
    "category": 0
  },
  {
    "normalized": "effetssecondaireslesmedicamentsquiaffectentlasexualite",
    "category": 0
  },
  {
    "normalized": "voitureoptionssurabonnement",
    "category": 0
  },
  {
    "normalized": "testtondeusesagazon",
    "category": 0
  },
  {
    "normalized": "politiquedeconfidentialitemiseajourle10012023",
    "category": 0
  },
  {
    "normalized": "toutaccepterfermer",
    "category": 1
  },
  {
    "normalized": "gbp",
    "category": 0
  },
  {
    "normalized": "allecookiesablehnen",
    "category": 2
  },
  {
    "normalized": "breakdowncover",
    "category": 0
  },
  {
    "normalized": "servicemot",
    "category": 0
  },
  {
    "normalized": "routeplanner",
    "category": 0
  },
  {
    "normalized": "buyingacar",
    "category": 0
  },
  {
    "normalized": "newsadvice",
    "category": 0
  },
  {
    "normalized": "yesthatsfine",
    "category": 1
  },
  {
    "normalized": "nomanagecookies",
    "category": 8
  },
  {
    "normalized": "guardarconfiguracion",
    "category": 3
  },
  {
    "normalized": "recrutement",
    "category": 0
  },
  {
    "normalized": "sinscrireauxactusmaratp",
    "category": 0
  },
  {
    "normalized": "itineraires",
    "category": 0
  },
  {
    "normalized": "horaires",
    "category": 0
  },
  {
    "normalized": "plans",
    "category": 0
  },
  {
    "normalized": "visiterparis",
    "category": 0
  },
  {
    "normalized": "endirectdugrouperatp",
    "category": 0
  },
  {
    "normalized": "alleraupanneau2",
    "category": 0
  },
  {
    "normalized": "configurerlescookies",
    "category": 3
  },
  {
    "normalized": "eingeschranktnutzen",
    "category": 8
  },
  {
    "normalized": "permitirsolocookiestecnicas",
    "category": 2
  },
  {
    "normalized": "okestoydeacuerdo",
    "category": 1
  },
  {
    "normalized": "nodamemasinformacion",
    "category": 8
  },
  {
    "normalized": "einblendungpersonalisierteranzeigenanzeigenmessungunderkenntnisseuberzielgruppen",
    "category": 0
  },
  {
    "normalized": "moreinformationoncookies",
    "category": 3
  },
  {
    "normalized": "acceptallandcontinue",
    "category": 1
  },
  {
    "normalized": "optionaleablehnen",
    "category": 2
  },
  {
    "normalized": "managechoices",
    "category": 3
  },
  {
    "normalized": "inspirations",
    "category": 0
  },
  {
    "normalized": "photos",
    "category": 0
  },
  {
    "normalized": "parametrervospreferencescookiesettraceurs",
    "category": 3
  },
  {
    "normalized": "jeparticipe",
    "category": 0
  },
  {
    "normalized": "newsstories",
    "category": 0
  },
  {
    "normalized": "sendungenaz",
    "category": 0
  },
  {
    "normalized": "livetvaufrtl+",
    "category": 0
  },
  {
    "normalized": "topstories",
    "category": 0
  },
  {
    "normalized": "fermeretaccepter",
    "category": 1
  },
  {
    "normalized": "dortmund",
    "category": 0
  },
  {
    "normalized": "bochum",
    "category": 0
  },
  {
    "normalized": "nrw",
    "category": 0
  },
  {
    "normalized": "promitv",
    "category": 0
  },
  {
    "normalized": "bvb",
    "category": 0
  },
  {
    "normalized": "s04",
    "category": 0
  },
  {
    "normalized": "redaktionellempfohleneinhalte",
    "category": 0
  },
  {
    "normalized": "erweiterteeinstellung",
    "category": 3
  },
  {
    "normalized": "viscookieindstillinger",
    "category": 3
  },
  {
    "normalized": "jajegaccepterer",
    "category": 1
  },
  {
    "normalized": "privatlivspolitik",
    "category": 0
  },
  {
    "normalized": "fammiscegliere",
    "category": 3
  },
  {
    "normalized": "events",
    "category": 0
  },
  {
    "normalized": "branchennews",
    "category": 0
  },
  {
    "normalized": "newcomer",
    "category": 0
  },
  {
    "normalized": "rolandkaiser",
    "category": 0
  },
  {
    "normalized": "kerstinott",
    "category": 0
  },
  {
    "normalized": "stefanmross",
    "category": 0
  },
  {
    "normalized": "andreakiewel",
    "category": 0
  },
  {
    "normalized": "allestars",
    "category": 0
  },
  {
    "normalized": "fotos",
    "category": 0
  },
  {
    "normalized": "stardesmonats",
    "category": 0
  },
  {
    "normalized": "allevotings",
    "category": 0
  },
  {
    "normalized": "horoskopheutediese4sternzeichenbereitenanderengerneherzschmerz",
    "category": 0
  },
  {
    "normalized": "mireillemathieusiehatsolchetodesangst",
    "category": 0
  },
  {
    "normalized": "prinzessindianaihregestohlenenliebesbriefewurdenzurtickendenzeitbombe",
    "category": 0
  },
  {
    "normalized": "alleanzeigen",
    "category": 3
  },
  {
    "normalized": "spenden",
    "category": 0
  },
  {
    "normalized": "teilen",
    "category": 0
  },
  {
    "normalized": "tweet",
    "category": 0
  },
  {
    "normalized": "confirmandcontinue",
    "category": 1
  },
  {
    "normalized": "leavethiswebsite",
    "category": 9
  },
  {
    "normalized": "personalizarmispreferencias",
    "category": 3
  },
  {
    "normalized": "leermas",
    "category": 3
  },
  {
    "normalized": "configurecookies",
    "category": 3
  },
  {
    "normalized": "getgbp3off",
    "category": 0
  },
  {
    "normalized": "meinsky",
    "category": 0
  },
  {
    "normalized": "skyqerleben",
    "category": 0
  },
  {
    "normalized": "pacchettitv",
    "category": 0
  },
  {
    "normalized": "skytvenetflix",
    "category": 0
  },
  {
    "normalized": "skycinema",
    "category": 0
  },
  {
    "normalized": "skytv+sport",
    "category": 0
  },
  {
    "normalized": "skytv+calcio",
    "category": 0
  },
  {
    "normalized": "videoeaudio",
    "category": 0
  },
  {
    "normalized": "funzionalita",
    "category": 9
  },
  {
    "normalized": "design",
    "category": 0
  },
  {
    "normalized": "specifichetecniche",
    "category": 9
  },
  {
    "normalized": "offerte",
    "category": 0
  },
  {
    "normalized": "assistenza",
    "category": 0
  },
  {
    "normalized": "tuttalassistenza",
    "category": 0
  },
  {
    "normalized": "problemidivisione",
    "category": 0
  },
  {
    "normalized": "skywifiinstallazione",
    "category": 0
  },
  {
    "normalized": "skywificonnessione",
    "category": 0
  },
  {
    "normalized": "accedialfaidate",
    "category": 0
  },
  {
    "normalized": "cookiepraferenzen",
    "category": 3
  },
  {
    "normalized": "denyall",
    "category": 2
  },
  {
    "normalized": "allowallinclusprovidercookies",
    "category": 1
  },
  {
    "normalized": "nichtzustimmst",
    "category": 2
  },
  {
    "normalized": "purzugangerwerben",
    "category": 0
  },
  {
    "normalized": "mitpurzugangeinloggen",
    "category": 0
  },
  {
    "normalized": "einstellungenpersonalisieren",
    "category": 3
  },
  {
    "normalized": "souteniretpayer",
    "category": 0
  },
  {
    "normalized": "kabulediyorum",
    "category": 1
  },
  {
    "normalized": "tercihleriyonet",
    "category": 3
  },
  {
    "normalized": "privatkunden",
    "category": 0
  },
  {
    "normalized": "firmenkunden",
    "category": 0
  },
  {
    "normalized": "leichtesprache",
    "category": 0
  },
  {
    "normalized": "barrierefreiheit",
    "category": 0
  },
  {
    "normalized": "onlinebanking",
    "category": 0
  },
  {
    "normalized": "aktuellethemen",
    "category": 0
  },
  {
    "normalized": "unsereleistungen",
    "category": 0
  },
  {
    "normalized": "unsereratgeber",
    "category": 0
  },
  {
    "normalized": "filialeundservices",
    "category": 0
  },
  {
    "normalized": "wiruberuns",
    "category": 0
  },
  {
    "normalized": "erklarungzumdatenschutz",
    "category": 0
  },
  {
    "normalized": "zusatzlichecookiesablehnen",
    "category": 2
  },
  {
    "normalized": "advertisingpurposes",
    "category": 0
  },
  {
    "normalized": "ablehnenallernichtnotwendigencookies",
    "category": 2
  },
  {
    "normalized": "sucheoffnen",
    "category": 0
  },
  {
    "normalized": "fluchthoffnungundzweifelschicksaleinersyrischenfamilie",
    "category": 0
  },
  {
    "normalized": "kreativelosungenfurunbezahlbareswohnen",
    "category": 0
  },
  {
    "normalized": "sogefahrlichsinddiemethodenvonheilpraktikernwirklich",
    "category": 0
  },
  {
    "normalized": "einenmonatfur1euro",
    "category": 0
  },
  {
    "normalized": "checkoutdetails",
    "category": 3
  },
  {
    "normalized": "loginhere",
    "category": 0
  },
  {
    "normalized": "generaltermsandconditions",
    "category": 0
  },
  {
    "normalized": "zurdeutschenseitewechseln",
    "category": 0
  },
  {
    "normalized": "removeads",
    "category": 9
  },
  {
    "normalized": "randomquiz",
    "category": 0
  },
  {
    "normalized": "nfl",
    "category": 0
  },
  {
    "normalized": "bbl",
    "category": 0
  },
  {
    "normalized": "nba",
    "category": 0
  },
  {
    "normalized": "wta500stuttgart",
    "category": 0
  },
  {
    "normalized": "atp250munchen",
    "category": 0
  },
  {
    "normalized": "atp500barcelona",
    "category": 0
  },
  {
    "normalized": "schachwm",
    "category": 0
  },
  {
    "normalized": "allenewsanzeigen",
    "category": 0
  },
  {
    "normalized": "yesiacceptcookies",
    "category": 1
  },
  {
    "normalized": "cookieeinwilligungslosung",
    "category": 9
  },
  {
    "normalized": "mesuredaudience",
    "category": 0
  },
  {
    "normalized": "reseauxsociaux",
    "category": 0
  },
  {
    "normalized": "sauvegardermeschoix",
    "category": 4
  },
  {
    "normalized": "privacyplease",
    "category": 8
  },
  {
    "normalized": "klassentreffen",
    "category": 0
  },
  {
    "normalized": "deutscheschulenimausland",
    "category": 0
  },
  {
    "normalized": "drittenundunserenpartnern",
    "category": 0
  },
  {
    "normalized": "nuressenziellecookieserlauben",
    "category": 2
  },
  {
    "normalized": "optionen",
    "category": 3
  },
  {
    "normalized": "vertragkundigen",
    "category": 0
  },
  {
    "normalized": "adfreefor299month",
    "category": 5
  },
  {
    "normalized": "dolomiten",
    "category": 0
  },
  {
    "normalized": "bezirke",
    "category": 0
  },
  {
    "normalized": "chronik",
    "category": 0
  },
  {
    "normalized": "privacyeinstellungen",
    "category": 3
  },
  {
    "normalized": "ablehnenundabonnieren",
    "category": 8
  },
  {
    "normalized": "mits+einloggen",
    "category": 0
  },
  {
    "normalized": "meinestn",
    "category": 0
  },
  {
    "normalized": "abo",
    "category": 0
  },
  {
    "normalized": "ukrainekrieg",
    "category": 0
  },
  {
    "normalized": "energiekrise",
    "category": 0
  },
  {
    "normalized": "coronavirus",
    "category": 0
  },
  {
    "normalized": "schlagzeilen",
    "category": 0
  },
  {
    "normalized": "stadtbezirke",
    "category": 0
  },
  {
    "normalized": "badenwurttemberg",
    "category": 0
  },
  {
    "normalized": "continuetosite",
    "category": 8
  },
  {
    "normalized": "refuseretsabonnerasudouest",
    "category": 5
  },
  {
    "normalized": "szde",
    "category": 0
  },
  {
    "normalized": "alleszprodukte",
    "category": 0
  },
  {
    "normalized": "meinesz",
    "category": 0
  },
  {
    "normalized": "szplus",
    "category": 0
  },
  {
    "normalized": "meinung",
    "category": 0
  },
  {
    "normalized": "medien",
    "category": 0
  },
  {
    "normalized": "bayern",
    "category": 0
  },
  {
    "normalized": "reportage",
    "category": 0
  },
  {
    "normalized": "nutzungsanalyseundproduktoptimierung",
    "category": 0
  },
  {
    "normalized": "personalisierteinhalteundmarketing",
    "category": 0
  },
  {
    "normalized": "werbungdurchdritteiab",
    "category": 0
  },
  {
    "normalized": "vertragsbedingungen",
    "category": 0
  },
  {
    "normalized": "widerrufsbelehrung",
    "category": 0
  },
  {
    "normalized": "ichbineinverstanden",
    "category": 1
  },
  {
    "normalized": "deutlichwenigerwerbung",
    "category": 9
  },
  {
    "normalized": "siebestimmenwiewirtracken",
    "category": 9
  },
  {
    "normalized": "jetztkostenlostesten",
    "category": 9
  },
  {
    "normalized": "button",
    "category": 9
  },
  {
    "normalized": "ulm",
    "category": 0
  },
  {
    "normalized": "neuulm",
    "category": 0
  },
  {
    "normalized": "goppingen",
    "category": 0
  },
  {
    "normalized": "geislingen",
    "category": 0
  },
  {
    "normalized": "schwabischhall",
    "category": 0
  },
  {
    "normalized": "crailsheim",
    "category": 0
  },
  {
    "normalized": "gaildorf",
    "category": 0
  },
  {
    "normalized": "ehingen",
    "category": 0
  },
  {
    "normalized": "metzingen",
    "category": 0
  },
  {
    "normalized": "reutlingen",
    "category": 0
  },
  {
    "normalized": "munsingen",
    "category": 0
  },
  {
    "normalized": "hechingen",
    "category": 0
  },
  {
    "normalized": "aboabschließen",
    "category": 0
  },
  {
    "normalized": "dax010",
    "category": 0
  },
  {
    "normalized": "krimukrainegreiftan",
    "category": 0
  },
  {
    "normalized": "schlagerstarnenntgrundfurkarriereaus",
    "category": 0
  },
  {
    "normalized": "touristenhochburgverhangtselfieverbot",
    "category": 0
  },
  {
    "normalized": "unfallinfreizeitparkfrauschwerverletzt",
    "category": 0
  },
  {
    "normalized": "landwillstarkstearmeeeuropasaufbauen",
    "category": 0
  },
  {
    "normalized": "skyexpertekritisiertthomastuchel",
    "category": 0
  },
  {
    "normalized": "beliebtemodeketteeroffnetimnorden",
    "category": 0
  },
  {
    "normalized": "mannfahrtaufautozugmitsperrung",
    "category": 0
  },
  {
    "normalized": "totesehepaarinhausgefunden",
    "category": 0
  },
  {
    "normalized": "kurioserversprecherbeisiegerehrung",
    "category": 0
  },
  {
    "normalized": "007nachfolgeergiltalsneuerfavorit",
    "category": 0
  },
  {
    "normalized": "chefenthullturlaubsgeheimnis",
    "category": 0
  },
  {
    "normalized": "dieseoptionenhatdiebundeswehrjetztimsudan",
    "category": 0
  },
  {
    "normalized": "dasschlaraffenlandundseinetodlichegefahr",
    "category": 0
  },
  {
    "normalized": "meinenstandortbestimmen",
    "category": 0
  },
  {
    "normalized": "chemnitz",
    "category": 0
  },
  {
    "normalized": "dresden",
    "category": 0
  },
  {
    "normalized": "erfurt",
    "category": 0
  },
  {
    "normalized": "frankfurtmain",
    "category": 0
  },
  {
    "normalized": "leipzig",
    "category": 0
  },
  {
    "normalized": "magdeburg",
    "category": 0
  },
  {
    "normalized": "notwendigetechnologien",
    "category": 8
  },
  {
    "normalized": "vorscrollen",
    "category": 0
  },
  {
    "normalized": "einbindungvonexterneninhaltenfurjournalistischezwecke",
    "category": 0
  },
  {
    "normalized": "aujourdhui24avril",
    "category": 0
  },
  {
    "normalized": "toutelajournee",
    "category": 0
  },
  {
    "normalized": "symbole",
    "category": 0
  },
  {
    "normalized": "leaflet|openstreetmap|ecmwfbymeteored",
    "category": 0
  },
  {
    "normalized": "lameteodanslesdepartements",
    "category": 0
  },
  {
    "normalized": "praferenzen",
    "category": 3
  },
  {
    "normalized": "sonosproersmartehøjttaleretilvirksomheder",
    "category": 0
  },
  {
    "normalized": "msilancerernyenvidiageforcertx4070grafikkort",
    "category": 0
  },
  {
    "normalized": "telegraphcouk",
    "category": 0
  },
  {
    "normalized": "telegraphcommercialcookies",
    "category": 0
  },
  {
    "normalized": "solonecessari",
    "category": 2
  },
  {
    "normalized": "scopriloffertatelepass",
    "category": 0
  },
  {
    "normalized": "scoprilapromorcacontelepass",
    "category": 0
  },
  {
    "normalized": "aprobar",
    "category": 0
  },
  {
    "normalized": "statistik",
    "category": 0
  },
  {
    "normalized": "detailsauswahlen",
    "category": 3
  },
  {
    "normalized": "einwilligen",
    "category": 1
  },
  {
    "normalized": "nahereinfos",
    "category": 3
  },
  {
    "normalized": "allerdirectementaucontenu",
    "category": 8
  },
  {
    "normalized": "programmes",
    "category": 0
  },
  {
    "normalized": "stream",
    "category": 0
  },
  {
    "normalized": "toutelinfo",
    "category": 3
  },
  {
    "normalized": "pourvous",
    "category": 0
  },
  {
    "normalized": "regarderledirect",
    "category": 0
  },
  {
    "normalized": "regarderlesjtendirect",
    "category": 0
  },
  {
    "normalized": "regardervotrejtpersonnalise",
    "category": 0
  },
  {
    "normalized": "danslactualiteencemoment",
    "category": 0
  },
  {
    "normalized": "policysuicookie",
    "category": 0
  },
  {
    "normalized": "preferenzesuicookie",
    "category": 3
  },
  {
    "normalized": "accountsubscriptionsettings",
    "category": 0
  },
  {
    "normalized": "showprofile",
    "category": 0
  },
  {
    "normalized": "vipmembership",
    "category": 0
  },
  {
    "normalized": "favoritecreations",
    "category": 0
  },
  {
    "normalized": "downloadhistory",
    "category": 0
  },
  {
    "normalized": "artistsifollow",
    "category": 0
  },
  {
    "normalized": "comments",
    "category": 0
  },
  {
    "normalized": "guestbook",
    "category": 0
  },
  {
    "normalized": "privatemessages",
    "category": 0
  },
  {
    "normalized": "blogposts",
    "category": 0
  },
  {
    "normalized": "editscreenshots",
    "category": 0
  },
  {
    "normalized": "servicestatus",
    "category": 0
  },
  {
    "normalized": "supportcenter",
    "category": 0
  },
  {
    "normalized": "reportads",
    "category": 0
  },
  {
    "normalized": "reportinfringement",
    "category": 0
  },
  {
    "normalized": "aboutus",
    "category": 0
  },
  {
    "normalized": "releasedfromearlyaccess",
    "category": 0
  },
  {
    "normalized": "artists",
    "category": 0
  },
  {
    "normalized": "vipinfo",
    "category": 0
  },
  {
    "normalized": "travel",
    "category": 0
  },
  {
    "normalized": "imin",
    "category": 9
  },
  {
    "normalized": "todayssections",
    "category": 0
  },
  {
    "normalized": "paginadepoliticadecookies",
    "category": 0
  },
  {
    "normalized": "leggilacookiepolicy",
    "category": 0
  },
  {
    "normalized": "nonconsentirecookies",
    "category": 2
  },
  {
    "normalized": "configuracionpersonalizada",
    "category": 3
  },
  {
    "normalized": "consulterlapolitiquedecookies",
    "category": 0
  },
  {
    "normalized": "permitir",
    "category": 1
  },
  {
    "normalized": "transfersrumours",
    "category": 0
  },
  {
    "normalized": "marketvalues",
    "category": 0
  },
  {
    "normalized": "mytm",
    "category": 0
  },
  {
    "normalized": "basicadspersonalisedadsprofileandadmeasurement",
    "category": 0
  },
  {
    "normalized": "transfersgeruchte",
    "category": 0
  },
  {
    "normalized": "marktwerte",
    "category": 0
  },
  {
    "normalized": "wettbewerbe",
    "category": 0
  },
  {
    "normalized": "meintm",
    "category": 0
  },
  {
    "normalized": "noticias",
    "category": 0
  },
  {
    "normalized": "fichajesrumores",
    "category": 0
  },
  {
    "normalized": "valoresdemercado",
    "category": 0
  },
  {
    "normalized": "competiciones",
    "category": 0
  },
  {
    "normalized": "envivo",
    "category": 0
  },
  {
    "normalized": "seleccionaranunciospersonalizados",
    "category": 9
  },
  {
    "normalized": "avisolegal",
    "category": 0
  },
  {
    "normalized": "hierablehnen",
    "category": 2
  },
  {
    "normalized": "carhire",
    "category": 0
  },
  {
    "normalized": "flights",
    "category": 0
  },
  {
    "normalized": "travelinsurance",
    "category": 0
  },
  {
    "normalized": "addanotherairport",
    "category": 0
  },
  {
    "normalized": "discovermoreonourblog",
    "category": 0
  },
  {
    "normalized": "juventus",
    "category": 0
  },
  {
    "normalized": "torino",
    "category": 0
  },
  {
    "normalized": "goldenboy",
    "category": 0
  },
  {
    "normalized": "tuttorunning",
    "category": 0
  },
  {
    "normalized": "piemontenews",
    "category": 0
  },
  {
    "normalized": "rtl+musik",
    "category": 0
  },
  {
    "normalized": "stobern",
    "category": 0
  },
  {
    "normalized": "jetztstreamen",
    "category": 0
  },
  {
    "normalized": "neuestaffel",
    "category": 0
  },
  {
    "normalized": "wochentlich",
    "category": 0
  },
  {
    "normalized": "drama",
    "category": 0
  },
  {
    "normalized": "snooker",
    "category": 0
  },
  {
    "normalized": "dokumentation",
    "category": 0
  },
  {
    "normalized": "arzteserie",
    "category": 0
  },
  {
    "normalized": "dokumentarfilm",
    "category": 0
  },
  {
    "normalized": "actionthriller",
    "category": 0
  },
  {
    "normalized": "allowselectedcookies",
    "category": 4
  },
  {
    "normalized": "imhappywithallcookies",
    "category": 1
  },
  {
    "normalized": "cambiarconfiguracion",
    "category": 3
  },
  {
    "normalized": "configuraicookie",
    "category": 3
  },
  {
    "normalized": "consentisoloicookietecnici",
    "category": 2
  },
  {
    "normalized": "usasoloinecessari",
    "category": 2
  },
  {
    "normalized": "accettaicookiesselezionati",
    "category": 4
  },
  {
    "normalized": "hjem",
    "category": 0
  },
  {
    "normalized": "expertenforum",
    "category": 0
  },
  {
    "normalized": "kinderwunsch",
    "category": 0
  },
  {
    "normalized": "baby",
    "category": 0
  },
  {
    "normalized": "kleinkind",
    "category": 0
  },
  {
    "normalized": "familienleben",
    "category": 0
  },
  {
    "normalized": "savemypreferences",
    "category": 4
  },
  {
    "normalized": "hemeroteca",
    "category": 0
  },
  {
    "normalized": "consensicertificatida",
    "category": 9
  },
  {
    "normalized": "sapernedipiu",
    "category": 3
  },
  {
    "normalized": "okperme",
    "category": 1
  },
  {
    "normalized": "ablehnenodereinstellungen",
    "category": 8
  },
  {
    "normalized": "suscribir",
    "category": 5
  },
  {
    "normalized": "persapernedipiu",
    "category": 3
  },
  {
    "normalized": "manageyourpreferenceshere",
    "category": 3
  },
  {
    "normalized": "kinotv",
    "category": 0
  },
  {
    "normalized": "servizipremium",
    "category": 0
  },
  {
    "normalized": "openthecookiejar",
    "category": 8
  },
  {
    "normalized": "affiliatenetworks",
    "category": 0
  },
  {
    "normalized": "aktienfrankfurteroffnungverhaltenerauftaktunterden16000daxpunkten",
    "category": 0
  },
  {
    "normalized": "softwareag",
    "category": 0
  },
  {
    "normalized": "toppick",
    "category": 0
  },
  {
    "normalized": "ihreborsenwoche",
    "category": 0
  },
  {
    "normalized": "solarstar",
    "category": 0
  },
  {
    "normalized": "wochenausblick",
    "category": 0
  },
  {
    "normalized": "tagesbriefing",
    "category": 0
  },
  {
    "normalized": "salzgitter",
    "category": 0
  },
  {
    "normalized": "europabluechips",
    "category": 0
  },
  {
    "normalized": "nasdaq100",
    "category": 0
  },
  {
    "normalized": "atx",
    "category": 0
  },
  {
    "normalized": "ubersicht",
    "category": 0
  },
  {
    "normalized": "watsonde",
    "category": 0
  },
  {
    "normalized": "jetztweltpurabonnieren",
    "category": 0
  },
  {
    "normalized": "statistics",
    "category": 0
  },
  {
    "normalized": "acceptrequiredcookies",
    "category": 8
  },
  {
    "normalized": "wetterzentrale",
    "category": 0
  },
  {
    "normalized": "nov142022",
    "category": 0
  },
  {
    "normalized": "httpswetterzentraledeentopkartenphpmap=8model=hardmvar=9run=12time=41lid=oph=0mv=0tr=1mapref",
    "category": 0
  },
  {
    "normalized": "httpswetterzentraledeenshowdiagramsphpgeoid=113304model=hardmvar=92run=12lid=opbw=1",
    "category": 0
  },
  {
    "normalized": "costofliving",
    "category": 0
  },
  {
    "normalized": "techappliances",
    "category": 0
  },
  {
    "normalized": "homegarden",
    "category": 0
  },
  {
    "normalized": "babychild",
    "category": 0
  },
  {
    "normalized": "carstravel",
    "category": 0
  },
  {
    "normalized": "consumerrightscampaigns",
    "category": 0
  },
  {
    "normalized": "readourcookiepolicyhere",
    "category": 0
  },
  {
    "normalized": "cookiesauswahlen",
    "category": 3
  },
  {
    "normalized": "optimierung",
    "category": 0
  },
  {
    "normalized": "personalisierung",
    "category": 0
  },
  {
    "normalized": "gesund",
    "category": 0
  },
  {
    "normalized": "furdich",
    "category": 0
  },
  {
    "normalized": "storeoraccessinformationonyourdevice",
    "category": 0
  },
  {
    "normalized": "dataprocessinginthirdcountries",
    "category": 0
  },
  {
    "normalized": "deacordo",
    "category": 1
  },
  {
    "normalized": "rechazartodaslascookies",
    "category": 2
  },
  {
    "normalized": "padresleanestoparaprotegerasushijos",
    "category": 0
  },
  {
    "normalized": "haciendoclickaqui",
    "category": 9
  },
  {
    "normalized": "impostazioniprivacy",
    "category": 3
  },
  {
    "normalized": "vaialsito",
    "category": 9
  },
  {
    "normalized": "declinecookies",
    "category": 2
  },
  {
    "normalized": "akkoord",
    "category": 1
  },
  {
    "normalized": "allesaccepteren",
    "category": 1
  },
  {
    "normalized": "weigeren",
    "category": 2
  },
  {
    "normalized": "cookiestatement",
    "category": 0
  },
  {
    "normalized": "accepteren",
    "category": 1
  },
  {
    "normalized": "gegevens",
    "category": 9
  },
  {
    "normalized": "dezemedia",
    "category": 9
  },
  {
    "normalized": "detailstonen",
    "category": 0
  },
  {
    "normalized": "meeruitleg",
    "category": 0
  },
  {
    "normalized": "derdepartijen",
    "category": 9
  },
  {
    "normalized": "instellingen",
    "category": 3
  },
  {
    "normalized": "allecookiesaccepteren",
    "category": 1
  },
  {
    "normalized": "ikgaakkoord",
    "category": 1
  },
  {
    "normalized": "meeropties",
    "category": 3
  },
  {
    "normalized": "cookieinstellingen",
    "category": 3
  },
  {
    "normalized": "allecookiestoestaan",
    "category": 1
  },
  {
    "normalized": "cookiebeleid",
    "category": 0
  },
  {
    "normalized": "meerinformatie",
    "category": 3
  },
  {
    "normalized": "stelvoorkeurenin",
    "category": 3
  },
  {
    "normalized": "privacybeleid",
    "category": 9
  },
  {
    "normalized": "accepteerallesenslaop",
    "category": 1
  },
  {
    "normalized": "allesafwijzen",
    "category": 2
  },
  {
    "normalized": "wijziginstellingen",
    "category": 3
  },
  {
    "normalized": "bekijkcategorie",
    "category": 9
  },
  {
    "normalized": "instellingenwijzigen",
    "category": 3
  },
  {
    "normalized": "cookiesaccepteren",
    "category": 1
  },
  {
    "normalized": "sluiten",
    "category": 9
  },
  {
    "normalized": "zelfinstellen",
    "category": 3
  },
  {
    "normalized": "accepterenendoorgaan",
    "category": 1
  },
  {
    "normalized": "accepteercookies",
    "category": 1
  },
  {
    "normalized": "alleennoodzakelijkecookies",
    "category": 2
  },
  {
    "normalized": "derden",
    "category": 9
  },
  {
    "normalized": "allestoestaan",
    "category": 1
  },
  {
    "normalized": "neelieverniet",
    "category": 2
  },
  {
    "normalized": "nietnu",
    "category": 2
  },
  {
    "normalized": "cookieinstellingenaanpassen",
    "category": 3
  },
  {
    "normalized": "doeleindenweergeven",
    "category": 9
  },
  {
    "normalized": "instellingenbeheren",
    "category": 3
  },
  {
    "normalized": "accepteeralles",
    "category": 1
  },
  {
    "normalized": "nietakkoord",
    "category": 2
  },
  {
    "normalized": "cookievoorkeuren",
    "category": 3
  },
  {
    "normalized": "colofon",
    "category": 0
  },
  {
    "normalized": "instellingenaanpassen",
    "category": 3
  },
  {
    "normalized": "weiger",
    "category": 2
  },
  {
    "normalized": "alleenessentielecookies",
    "category": 2
  },
  {
    "normalized": "meeruitlegovercookies",
    "category": 9
  },
  {
    "normalized": "cookievoorkeurenaanpassen",
    "category": 3
  },
  {
    "normalized": "voorkeurenaanpassen",
    "category": 3
  },
  {
    "normalized": "basiscookies",
    "category": 2
  },
  {
    "normalized": "akkoordensluiten",
    "category": 1
  },
  {
    "normalized": "shorts",
    "category": 0
  },
  {
    "normalized": "subscriptions",
    "category": 5
  },
  {
    "normalized": "library",
    "category": 0
  },
  {
    "normalized": "movies",
    "category": 0
  },
  {
    "normalized": "browsechannels",
    "category": 0
  },
  {
    "normalized": "youtubepremium",
    "category": 0
  },
  {
    "normalized": "youtubemusic",
    "category": 0
  },
  {
    "normalized": "youtubekids",
    "category": 0
  },
  {
    "normalized": "reporthistory",
    "category": 0
  },
  {
    "normalized": "sendfeedback",
    "category": 0
  },
  {
    "normalized": "cookieverklaring",
    "category": 9
  },
  {
    "normalized": "cookiesbeheren",
    "category": 3
  },
  {
    "normalized": "selectietoestaan",
    "category": 4
  },
  {
    "normalized": "profileringtalpanetwork",
    "category": 0
  },
  {
    "normalized": "neeinstellingenbeheren",
    "category": 3
  },
  {
    "normalized": "jaallesaccepteren",
    "category": 1
  },
  {
    "normalized": "hoegebruikenwejegegevens",
    "category": 0
  },
  {
    "normalized": "welkegegevensverzamelenwe",
    "category": 0
  },
  {
    "normalized": "adjustpreferences",
    "category": 3
  },
  {
    "normalized": "whatarecookieslearnmore",
    "category": 0
  },
  {
    "normalized": "whydoweusecookieslearnmore",
    "category": 0
  },
  {
    "normalized": "declineoptionalcookies",
    "category": 2
  },
  {
    "normalized": "wijzigvoorkeur",
    "category": 3
  },
  {
    "normalized": "nederlands",
    "category": 0
  },
  {
    "normalized": "alleennoodzakelijk",
    "category": 2
  },
  {
    "normalized": "pascookievoorkeurenaan",
    "category": 3
  },
  {
    "normalized": "doorgaanzonderteaccepteren",
    "category": 2
  },
  {
    "normalized": "onzepartners",
    "category": 0
  },
  {
    "normalized": "voorkeureninstellen",
    "category": 3
  },
  {
    "normalized": "leesverder",
    "category": 0
  },
  {
    "normalized": "strict",
    "category": 9
  },
  {
    "normalized": "performance",
    "category": 0
  },
  {
    "normalized": "targeting",
    "category": 0
  },
  {
    "normalized": "detailsweergeven",
    "category": 3
  },
  {
    "normalized": "meerinformatieovercookies",
    "category": 3
  },
  {
    "normalized": "neebedankt",
    "category": 2
  },
  {
    "normalized": "aanvaarden",
    "category": 1
  },
  {
    "normalized": "privacyverklaring",
    "category": 0
  },
  {
    "normalized": "personalisedadsadmeasurementaudienceinsightsandproductdevelopment",
    "category": 0
  },
  {
    "normalized": "privacycookiebeleid",
    "category": 0
  },
  {
    "normalized": "howtoprotectyourminors",
    "category": 0
  },
  {
    "normalized": "informatieopeenapparaatopslaanenofopenen",
    "category": 0
  },
  {
    "normalized": "uitgebreidecookies",
    "category": 0
  },
  {
    "normalized": "cookiespagina",
    "category": 0
  },
  {
    "normalized": "jadatisprima",
    "category": 1
  },
  {
    "normalized": "detailgedeelte",
    "category": 0
  },
  {
    "normalized": "alleenselectietoestaan",
    "category": 4
  },
  {
    "normalized": "allesweigeren",
    "category": 2
  },
  {
    "normalized": "klantinfo",
    "category": 0
  },
  {
    "normalized": "gegevensvananderen",
    "category": 0
  },
  {
    "normalized": "versleuteldegegevens",
    "category": 0
  },
  {
    "normalized": "howweusecookies",
    "category": 0
  },
  {
    "normalized": "acceptonlyessentialcookies",
    "category": 2
  },
  {
    "normalized": "mijninstellingenbeheren",
    "category": 3
  },
  {
    "normalized": "cookieoverzicht",
    "category": 0
  },
  {
    "normalized": "afwijzen",
    "category": 2
  },
  {
    "normalized": "voorkeuren",
    "category": 3
  },
  {
    "normalized": "nietaccepteren",
    "category": 2
  },
  {
    "normalized": "advertentiepartners",
    "category": 0
  },
  {
    "normalized": "onzemedia",
    "category": 0
  },
  {
    "normalized": "jaikaccepteercookies",
    "category": 1
  },
  {
    "normalized": "beheeropties",
    "category": 3
  },
  {
    "normalized": "weigeralleoptionelecookies",
    "category": 2
  },
  {
    "normalized": "partnerlijstderden",
    "category": 0
  },
  {
    "normalized": "allesopslaan",
    "category": 4
  },
  {
    "normalized": "alleenverplichtaccepteren",
    "category": 2
  },
  {
    "normalized": "pasjevoorkeuren",
    "category": 3
  },
  {
    "normalized": "okgaverder",
    "category": 1
  },
  {
    "normalized": "jadatwilik",
    "category": 1
  },
  {
    "normalized": "gegevensbescherming",
    "category": 0
  },
  {
    "normalized": "jaoptimalecookiesaccepteren",
    "category": 1
  },
  {
    "normalized": "neeikwilgeenoptimaleervaring",
    "category": 2
  },
  {
    "normalized": "unclassified",
    "category": 0
  },
  {
    "normalized": "useqrcode",
    "category": 0
  },
  {
    "normalized": "usephoneemailusername",
    "category": 0
  },
  {
    "normalized": "preciezegeolocatiegegevensgebruiken",
    "category": 0
  },
  {
    "normalized": "deapparaatkenmerkenactiefscannenvooridentificatie",
    "category": 0
  },
  {
    "normalized": "akkoordenverdergaan",
    "category": 1
  },
  {
    "normalized": "leverancierslijst",
    "category": 0
  },
  {
    "normalized": "allefunctionaliteiten",
    "category": 0
  },
  {
    "normalized": "privacyinstellingen",
    "category": 3
  },
  {
    "normalized": "ganaardewebsite",
    "category": 9
  },
  {
    "normalized": "lislasuitepoursavoircommentprotegertesmineurs",
    "category": 0
  },
  {
    "normalized": "weigeralles",
    "category": 2
  },
  {
    "normalized": "toondetails",
    "category": 3
  },
  {
    "normalized": "dezemeldingnietmeerweergeven",
    "category": 9
  },
  {
    "normalized": "whataremetaproductslearnmore",
    "category": 0
  },
  {
    "normalized": "yourcookiechoiceslearnmore",
    "category": 9
  },
  {
    "normalized": "howweusethesecookies",
    "category": 0
  },
  {
    "normalized": "uwcookieinstellingen",
    "category": 3
  },
  {
    "normalized": "cookievoorkeurenbeheren",
    "category": 3
  },
  {
    "normalized": "meldjeaan",
    "category": 9
  },
  {
    "normalized": "bekijkonsprivacybeleid",
    "category": 0
  },
  {
    "normalized": "meerweten",
    "category": 0
  },
  {
    "normalized": "aanvaardcookies",
    "category": 1
  },
  {
    "normalized": "leesmeeroverhoejeminderjarigenkuntbeschermen",
    "category": 0
  },
  {
    "normalized": "zaakceptujciasteczka",
    "category": 1
  },
  {
    "normalized": "przeczytajwiecejnatematochronynieletnich",
    "category": 0
  },
  {
    "normalized": "отклонитьвсе",
    "category": 2
  },
  {
    "normalized": "принятьфаилыcookie",
    "category": 1
  },
  {
    "normalized": "подробнееоспособахоградитьнесовершеннолетнихотнеподходящегоконтента",
    "category": 0
  },
  {
    "normalized": "cookiestoestaan",
    "category": 1
  },
  {
    "normalized": "sluitmelding",
    "category": 1
  },
  {
    "normalized": "kucuklerinizinasılkoruyacagınızhakkındadahafazlabilgiedinin",
    "category": 0
  },
  {
    "normalized": "klikhiervoormeerinformatie",
    "category": 3
  },
  {
    "normalized": "acceptonlynecessary",
    "category": 2
  },
  {
    "normalized": "2dehandsbeconsent",
    "category": 0
  },
  {
    "normalized": "privacystatement",
    "category": 0
  },
  {
    "normalized": "onzeprivacyverklaring",
    "category": 0
  },
  {
    "normalized": "okprima",
    "category": 1
  },
  {
    "normalized": "onzecookieinstellingen",
    "category": 3
  },
  {
    "normalized": "setityourself",
    "category": 3
  },
  {
    "normalized": "onlyallowbasiccookies",
    "category": 2
  },
  {
    "normalized": "privacyregeling",
    "category": 0
  },
  {
    "normalized": "beheervoorkeuren",
    "category": 3
  },
  {
    "normalized": "instellingenenmeerinformatie",
    "category": 3
  },
  {
    "normalized": "jaikgaakkoord",
    "category": 1
  },
  {
    "normalized": "noodzakelijkecookiesaltijdingeschakeld",
    "category": 2
  },
  {
    "normalized": "gepersonaliseerdeadvertenties",
    "category": 0
  },
  {
    "normalized": "opslaanenaccepteren",
    "category": 8
  },
  {
    "normalized": "allesselecteren",
    "category": 1
  },
  {
    "normalized": "naarinstellingen",
    "category": 3
  },
  {
    "normalized": "onzecookiepolicy",
    "category": 0
  },
  {
    "normalized": "ikaccepteerhetgebruikvancookies",
    "category": 1
  },
  {
    "normalized": "laatmijkiezen",
    "category": 3
  },
  {
    "normalized": "dezepagina",
    "category": 0
  },
  {
    "normalized": "hieraanpassen",
    "category": 3
  },
  {
    "normalized": "accepteerallesensluit",
    "category": 1
  },
  {
    "normalized": "doorgaanzonderakkoordtegaan→",
    "category": 2
  },
  {
    "normalized": "moreoptionslessoptions",
    "category": 8
  },
  {
    "normalized": "alleenstriktnoodzakelijk",
    "category": 2
  },
  {
    "normalized": "meldjenuaan",
    "category": 8
  },
  {
    "normalized": "jaakkoord",
    "category": 1
  },
  {
    "normalized": "meldaan",
    "category": 8
  },
  {
    "normalized": "bevestigdezekeuze",
    "category": 4
  },
  {
    "normalized": "beheerhierallecookiesindetail",
    "category": 3
  },
  {
    "normalized": "nomanagesettings",
    "category": 3
  },
  {
    "normalized": "beheren",
    "category": 3
  },
  {
    "normalized": "jagaverder",
    "category": 1
  },
  {
    "normalized": "annuleren",
    "category": 9
  },
  {
    "normalized": "function",
    "category": 0
  },
  {
    "normalized": "leeshier",
    "category": 0
  },
  {
    "normalized": "hoesjes",
    "category": 0
  },
  {
    "normalized": "screenprotectors",
    "category": 0
  },
  {
    "normalized": "opladers",
    "category": 0
  },
  {
    "normalized": "houders",
    "category": 0
  },
  {
    "normalized": "kabels",
    "category": 0
  },
  {
    "normalized": "headsets",
    "category": 0
  },
  {
    "normalized": "meercategorieen",
    "category": 0
  },
  {
    "normalized": "selecteerjemerk",
    "category": 0
  },
  {
    "normalized": "clickhereformoreinformationaboutourcookieusage",
    "category": 0
  },
  {
    "normalized": "managecookiepreferences",
    "category": 3
  },
  {
    "normalized": "instellingenopslaan",
    "category": 3
  },
  {
    "normalized": "save+exit",
    "category": 4
  },
  {
    "normalized": "okakkoord",
    "category": 1
  },
  {
    "normalized": "meeroveronscookiebeleid",
    "category": 0
  },
  {
    "normalized": "algemenevoorwaarden",
    "category": 0
  },
  {
    "normalized": "mijninstellingen",
    "category": 3
  },
  {
    "normalized": "naarwebsite",
    "category": 0
  },
  {
    "normalized": "veiligheidenprivacy",
    "category": 0
  },
  {
    "normalized": "eensverdernaardewebsite",
    "category": 1
  },
  {
    "normalized": "zelfcookiesbeheren",
    "category": 3
  },
  {
    "normalized": "keuzeopslaan",
    "category": 4
  },
  {
    "normalized": "functioneel",
    "category": 9
  },
  {
    "normalized": "persoonlijk",
    "category": 0
  },
  {
    "normalized": "debesteervaring",
    "category": 0
  },
  {
    "normalized": "voorkeurenkiezen",
    "category": 3
  },
  {
    "normalized": "marktplaatsnlconsent",
    "category": 0
  },
  {
    "normalized": "cookieinstellingenenbeleid",
    "category": 3
  },
  {
    "normalized": "sidebar",
    "category": 0
  },
  {
    "normalized": "265",
    "category": 0
  },
  {
    "normalized": "576",
    "category": 0
  },
  {
    "normalized": "populair",
    "category": 0
  },
  {
    "normalized": "recent",
    "category": 0
  },
  {
    "normalized": "reacties",
    "category": 0
  },
  {
    "normalized": "leesmeer",
    "category": 3
  },
  {
    "normalized": "wijzigcookieinstellingen",
    "category": 3
  },
  {
    "normalized": "voorkeuraanpassen",
    "category": 3
  },
  {
    "normalized": "akkoordmetcookies",
    "category": 1
  },
  {
    "normalized": "customizepreferences",
    "category": 3
  },
  {
    "normalized": "neeikwilnualleenminimalecookies",
    "category": 2
  },
  {
    "normalized": "doorhierteklikken",
    "category": 9
  },
  {
    "normalized": "individueleinstellingen",
    "category": 3
  },
  {
    "normalized": "alleenvereist",
    "category": 2
  },
  {
    "normalized": "zoekenzoeken",
    "category": 0
  },
  {
    "normalized": "zoeken",
    "category": 0
  },
  {
    "normalized": "themas",
    "category": 0
  },
  {
    "normalized": "foldersactiesonzeactiessale",
    "category": 0
  },
  {
    "normalized": "onzeacties",
    "category": 0
  },
  {
    "normalized": "meerinfo",
    "category": 3
  },
  {
    "normalized": "waarzoekjenaar",
    "category": 0
  },
  {
    "normalized": "watzijncookies",
    "category": 0
  },
  {
    "normalized": "nochangesettings",
    "category": 3
  },
  {
    "normalized": "geenprobleem",
    "category": 2
  },
  {
    "normalized": "gebruiksvoorwaarden",
    "category": 0
  },
  {
    "normalized": "akkoordendoorgaan",
    "category": 1
  },
  {
    "normalized": "doorgaan",
    "category": 1
  },
  {
    "normalized": "pasvoorkeuraan",
    "category": 3
  },
  {
    "normalized": "slimondernemen",
    "category": 0
  },
  {
    "normalized": "inspiratie",
    "category": 0
  },
  {
    "normalized": "klantenservice",
    "category": 0
  },
  {
    "normalized": "sligrovestigingen",
    "category": 0
  },
  {
    "normalized": "foldersacties",
    "category": 0
  },
  {
    "normalized": "aanbiedingen",
    "category": 0
  },
  {
    "normalized": "alleproducten",
    "category": 0
  },
  {
    "normalized": "functionality",
    "category": 0
  },
  {
    "normalized": "okenvenstersluiten",
    "category": 1
  },
  {
    "normalized": "bekijkonzecookiepolicy",
    "category": 0
  },
  {
    "normalized": "partnersbekijken",
    "category": 0
  },
  {
    "normalized": "akkoordendoorgaannaarterstalnl",
    "category": 1
  },
  {
    "normalized": "manageorrejectcookies",
    "category": 3
  },
  {
    "normalized": "voorkeurenbeheren",
    "category": 3
  },
  {
    "normalized": "gaverder",
    "category": 9
  },
  {
    "normalized": "continuewithfacebook",
    "category": 0
  },
  {
    "normalized": "continuewithgoogle",
    "category": 0
  },
  {
    "normalized": "continuewithtwitter",
    "category": 0
  },
  {
    "normalized": "continuewithapple",
    "category": 0
  },
  {
    "normalized": "continuewithinstagram",
    "category": 0
  },
  {
    "normalized": "basisadvertentiesgepersonaliseerdadvertentieprofielenadvertentiemeting",
    "category": 0
  },
  {
    "normalized": "gepersonaliseerdecontentcontentmetingeninzichteninhetpubliek",
    "category": 0
  },
  {
    "normalized": "gepersonaliseerdeadvertentiesselecteren",
    "category": 0
  },
  {
    "normalized": "productenontwikkelenenverbeteren",
    "category": 0
  },
  {
    "normalized": "striktnoodzakelijkecookies",
    "category": 2
  },
  {
    "normalized": "functionelecookies",
    "category": 2
  },
  {
    "normalized": "advertenties",
    "category": 0
  },
  {
    "normalized": "lijstmetbedrijven",
    "category": 0
  },
  {
    "normalized": "neeikwilalleenminimalecookies",
    "category": 2
  },
  {
    "normalized": "leesmeeroverhetgebruikvancookies",
    "category": 0
  },
  {
    "normalized": "voorkeurenopslaan",
    "category": 4
  },
  {
    "normalized": "okverdermetallecookies",
    "category": 1
  },
  {
    "normalized": "keuzeaanpassen",
    "category": 3
  },
  {
    "normalized": "uitgebreideinstellingen",
    "category": 3
  },
  {
    "normalized": "allesinschakelen",
    "category": 1
  },
  {
    "normalized": "advancedsettings",
    "category": 3
  },
  {
    "normalized": "enableall",
    "category": 1
  },
  {
    "normalized": "toestemming",
    "category": 9
  },
  {
    "normalized": "over",
    "category": 0
  },
  {
    "normalized": "wijzigvoorkeuren",
    "category": 3
  },
  {
    "normalized": "personalisedadvertisingandcontentadvertisingandcontentmeasurementaudienceresearchandservicesdevelopment",
    "category": 8
  },
  {
    "normalized": "speichern",
    "category": 4
  },
  {
    "normalized": "speichernvonoderzugriffaufinformationenaufeinemendgerat",
    "category": 0
  },
  {
    "normalized": "our856partners",
    "category": 8
  },
  {
    "normalized": "our823partners",
    "category": 8
  },
  {
    "normalized": "our853partners",
    "category": 0
  },
  {
    "normalized": "about",
    "category": 0
  },
  {
    "normalized": "unsere856partner",
    "category": 8
  },
  {
    "normalized": "unsere813partner",
    "category": 8
  },
  {
    "normalized": "unsere853partner",
    "category": 0
  },
  {
    "normalized": "listederpartnerlieferanten",
    "category": 0
  },
  {
    "normalized": "zustimmenfortfahren",
    "category": 1
  },
  {
    "normalized": "cookiedetails",
    "category": 0
  },
  {
    "normalized": "mehrinfos→",
    "category": 3
  },
  {
    "normalized": "annehmenundschliessen",
    "category": 1
  },
  {
    "normalized": "nuressentiellecookiesakzeptieren",
    "category": 2
  },
  {
    "normalized": "auswahlakzeptieren",
    "category": 4
  },
  {
    "normalized": "personalisiertewerbungundinhaltemessungvonwerbeleistungundderperformancevoninhaltenzielgruppenforschungsowieentwicklungundverbesserungvonangeboten",
    "category": 0
  },
  {
    "normalized": "allecookieserlauben",
    "category": 1
  },
  {
    "normalized": "nurerforderlichecookieserlauben",
    "category": 1
  },
  {
    "normalized": "cookieauswahl",
    "category": 8
  },
  {
    "normalized": "einstellungenbearbeiten",
    "category": 3
  },
  {
    "normalized": "verwendunggenauerstandortdaten",
    "category": 0
  },
  {
    "normalized": "noustun",
    "category": 1
  },
  {
    "normalized": "naitaandmeid",
    "category": 3
  },
  {
    "normalized": "lubakoik",
    "category": 1
  },
  {
    "normalized": "keeldu",
    "category": 2
  },
  {
    "normalized": "rohkemteavet",
    "category": 3
  },
  {
    "normalized": "lubavalik",
    "category": 1
  },
  {
    "normalized": "kohanda",
    "category": 3
  },
  {
    "normalized": "eisoovi",
    "category": 2
  },
  {
    "normalized": "kupsisteseaded",
    "category": 3
  },
  {
    "normalized": "lubakoikkupsised",
    "category": 1
  },
  {
    "normalized": "noustunkoigikupsistega",
    "category": 1
  },
  {
    "normalized": "keeldukoigist",
    "category": 2
  },
  {
    "normalized": "naitauksikasju",
    "category": 3
  },
  {
    "normalized": "noustunkoigiga",
    "category": 1
  },
  {
    "normalized": "sainaru",
    "category": 1
  },
  {
    "normalized": "einoustu",
    "category": 2
  },
  {
    "normalized": "kuvaeesmargid",
    "category": 3
  },
  {
    "normalized": "nousolek",
    "category": 1
  },
  {
    "normalized": "uksikasjad",
    "category": 3
  },
  {
    "normalized": "vajalik",
    "category": 0
  },
  {
    "normalized": "kupsistesatted",
    "category": 3
  },
  {
    "normalized": "kinnitakoik",
    "category": 1
  },
  {
    "normalized": "lubakupsised",
    "category": 1
  },
  {
    "normalized": "rohkeminfot",
    "category": 3
  },
  {
    "normalized": "partneriteteenuseosutajateloend",
    "category": 8
  },
  {
    "normalized": "privaatsussatted",
    "category": 3
  },
  {
    "normalized": "partnerid",
    "category": 0
  },
  {
    "normalized": "rohkemvoimalusi",
    "category": 3
  },
  {
    "normalized": "sulge",
    "category": 1
  },
  {
    "normalized": "noustunkoikidekupsistega",
    "category": 1
  },
  {
    "normalized": "lukkakoiktagasi",
    "category": 2
  },
  {
    "normalized": "muudankupsisteseadistusi",
    "category": 3
  },
  {
    "normalized": "sinulinn",
    "category": 0
  },
  {
    "normalized": "siit",
    "category": 0
  },
  {
    "normalized": "lubavajalikudkupsised",
    "category": 3
  },
  {
    "normalized": "seaded",
    "category": 3
  },
  {
    "normalized": "haldan",
    "category": 8
  },
  {
    "normalized": "ainultvajalikudkupsised",
    "category": 1
  },
  {
    "normalized": "haldanseadeid",
    "category": 3
  },
  {
    "normalized": "muudankupsisteeelistusi",
    "category": 3
  },
  {
    "normalized": "meeldib",
    "category": 1
  },
  {
    "normalized": "kupsistepoliitikast",
    "category": 3
  },
  {
    "normalized": "noustunmargitudkupsistega",
    "category": 1
  },
  {
    "normalized": "noustunkupsistega",
    "category": 1
  },
  {
    "normalized": "olennous",
    "category": 1
  },
  {
    "normalized": "miks",
    "category": 8
  },
  {
    "normalized": "loerohkem",
    "category": 3
  },
  {
    "normalized": "loenlahemalt",
    "category": 3
  },
  {
    "normalized": "personaliseeri",
    "category": 3
  },
  {
    "normalized": "noustuntingimustega",
    "category": 1
  },
  {
    "normalized": "noustukoigega",
    "category": 1
  },
  {
    "normalized": "oigustatudhuvi",
    "category": 8
  },
  {
    "normalized": "kampaaniad",
    "category": 0
  },
  {
    "normalized": "tapsemaltvalikud",
    "category": 3
  },
  {
    "normalized": "eelistused",
    "category": 3
  },
  {
    "normalized": "kuvakoikeesmargid",
    "category": 8
  },
  {
    "normalized": "turustamine",
    "category": 0
  },
  {
    "normalized": "organisatsioon",
    "category": 0
  },
  {
    "normalized": "haridus",
    "category": 0
  },
  {
    "normalized": "teenused",
    "category": 0
  },
  {
    "normalized": "kogudjateadus",
    "category": 0
  },
  {
    "normalized": "salvestan",
    "category": 1
  },
  {
    "normalized": "tooted",
    "category": 0
  },
  {
    "normalized": "eelistustemaaramine",
    "category": 3
  },
  {
    "normalized": "noustunvajalikega",
    "category": 2
  },
  {
    "normalized": "koiktooted",
    "category": 0
  },
  {
    "normalized": "kohandavalikud",
    "category": 3
  },
  {
    "normalized": "tapsemadnousolekud",
    "category": 3
  },
  {
    "normalized": "sisenegooglega",
    "category": 0
  },
  {
    "normalized": "sisenefacebookga",
    "category": 0
  },
  {
    "normalized": "sisenelinkedinga",
    "category": 0
  },
  {
    "normalized": "seadedjatingimused",
    "category": 3
  },
  {
    "normalized": "tingimusedjakohandamine",
    "category": 3
  },
  {
    "normalized": "muudaeelistusi",
    "category": 3
  },
  {
    "normalized": "kupsisteinfo",
    "category": 3
  },
  {
    "normalized": "kupsisteavaldus",
    "category": 9
  },
  {
    "normalized": "keeldukoik",
    "category": 2
  },
  {
    "normalized": "noustunhadavajalikekupsistega",
    "category": 1
  },
  {
    "normalized": "kupsisteloetelu",
    "category": 8
  },
  {
    "normalized": "kupsistest",
    "category": 3
  },
  {
    "normalized": "lisateave→",
    "category": 3
  },
  {
    "normalized": "noustujasulge",
    "category": 1
  },
  {
    "normalized": "япринимаю",
    "category": 1
  },
  {
    "normalized": "показатьцели",
    "category": 3
  },
  {
    "normalized": "haldakupsisteseadeid",
    "category": 3
  },
  {
    "normalized": "lugegekupsistekohtalahemalt",
    "category": 3
  },
  {
    "normalized": "lubavalitud",
    "category": 1
  },
  {
    "normalized": "luba",
    "category": 1
  },
  {
    "normalized": "otsi",
    "category": 0
  },
  {
    "normalized": "tellinturuulevaate",
    "category": 0
  },
  {
    "normalized": "peidateade",
    "category": 8
  },
  {
    "normalized": "iunderstandandaccept",
    "category": 1
  },
  {
    "normalized": "informatsioon",
    "category": 3
  },
  {
    "normalized": "kiireltkatte",
    "category": 0
  },
  {
    "normalized": "miinusmuuk",
    "category": 0
  },
  {
    "normalized": "loelisaks",
    "category": 3
  },
  {
    "normalized": "noadjust",
    "category": 9
  },
  {
    "normalized": "muuda",
    "category": 3
  },
  {
    "normalized": "keeldukoigistkupsistest",
    "category": 2
  },
  {
    "normalized": "strictlynecessaryonly",
    "category": 1
  },
  {
    "normalized": "noustuvalitudkupsistega",
    "category": 1
  },
  {
    "normalized": "muukaup24ees",
    "category": 0
  },
  {
    "normalized": "keela",
    "category": 2
  },
  {
    "normalized": "cookiepreferencesrejectaccept",
    "category": 9
  },
  {
    "normalized": "jaholensellegakursis",
    "category": 1
  },
  {
    "normalized": "viewmyoptions",
    "category": 3
  },
  {
    "normalized": "alltoovotjatenimekirjast",
    "category": 0
  },
  {
    "normalized": "nouskoigiga",
    "category": 1
  },
  {
    "normalized": "valiuksikudeesmargid",
    "category": 8
  },
  {
    "normalized": "kohandagekupsiseid",
    "category": 3
  },
  {
    "normalized": "noustunainultvajalikekupsistega",
    "category": 1
  },
  {
    "normalized": "lubanainultvajalikudkupsised",
    "category": 1
  },
  {
    "normalized": "kohandakuvauksikasjad",
    "category": 3
  },
  {
    "normalized": "salvestanseaded",
    "category": 3
  },
  {
    "normalized": "haalesta",
    "category": 3
  },
  {
    "normalized": "soovintaiendavatinfot",
    "category": 3
  },
  {
    "normalized": "aktsepteeri",
    "category": 1
  },
  {
    "normalized": "kupsisteseadetega",
    "category": 3
  },
  {
    "normalized": "valinkupsisedexpandmore",
    "category": 0
  },
  {
    "normalized": "noustunkohustuslikekupsistega",
    "category": 1
  },
  {
    "normalized": "muujad758",
    "category": 0
  },
  {
    "normalized": "seadetehaldamine",
    "category": 3
  },
  {
    "normalized": "continuetointernational",
    "category": 0
  },
  {
    "normalized": "shoponestoniastore",
    "category": 0
  },
  {
    "normalized": "privaatsuspoliitika",
    "category": 0
  },
  {
    "normalized": "uksused",
    "category": 9
  },
  {
    "normalized": "kupsistehaldamine",
    "category": 3
  },
  {
    "normalized": "kupsisteeelistused",
    "category": 3
  },
  {
    "normalized": "kupsiseid",
    "category": 9
  },
  {
    "normalized": "eiaitah",
    "category": 2
  },
  {
    "normalized": "lubaainultvalitud",
    "category": 1
  },
  {
    "normalized": "jahnoustun",
    "category": 1
  },
  {
    "normalized": "salvestavalik",
    "category": 4
  },
  {
    "normalized": "olennouskoigigajasalvestan",
    "category": 1
  },
  {
    "normalized": "valinisekupsised",
    "category": 3
  },
  {
    "normalized": "ainultvajalikud",
    "category": 1
  },
  {
    "normalized": "deselectselectall",
    "category": 0
  },
  {
    "normalized": "satted",
    "category": 3
  },
  {
    "normalized": "kupsistelubamine",
    "category": 1
  },
  {
    "normalized": "rohkemseadeid",
    "category": 3
  },
  {
    "normalized": "courses",
    "category": 0
  },
  {
    "normalized": "youtubetv",
    "category": 0
  },
  {
    "normalized": "ainultkoigeolulisem",
    "category": 8
  },
  {
    "normalized": "maaraeelistused",
    "category": 3
  },
  {
    "normalized": "kupsistekasutamisepohimotetega",
    "category": 8
  },
  {
    "normalized": "eelistustehaldamine",
    "category": 3
  },
  {
    "normalized": "muudaseadeid",
    "category": 3
  },
  {
    "normalized": "send",
    "category": 0
  },
  {
    "normalized": "keeldukoigikupsistekasutamisest",
    "category": 2
  },
  {
    "normalized": "kupsistekasutamiseteade",
    "category": 8
  },
  {
    "normalized": "mepartnerid",
    "category": 0
  },
  {
    "normalized": "tutvugemeiepartneritega",
    "category": 0
  },
  {
    "normalized": "keelduebavajalikest",
    "category": 2
  },
  {
    "normalized": "veebilehelonkasutatudkupsiseid",
    "category": 8
  },
  {
    "normalized": "consentselection",
    "category": 8
  },
  {
    "normalized": "isikuandmetekaitsmisetingimustega",
    "category": 0
  },
  {
    "normalized": "epood",
    "category": 0
  },
  {
    "normalized": "juurdepaasetavus",
    "category": 0
  },
  {
    "normalized": "eesti",
    "category": 0
  },
  {
    "normalized": "logisisse",
    "category": 0
  },
  {
    "normalized": "loeedasi",
    "category": 3
  },
  {
    "normalized": "haldanseadeidurlhttpswwwlhveeassetsimageselementsarrowbold16svg",
    "category": 0
  },
  {
    "normalized": "русскии",
    "category": 0
  },
  {
    "normalized": "kinnitamuvalikud",
    "category": 1
  },
  {
    "normalized": "seadetest",
    "category": 3
  },
  {
    "normalized": "closegdprcookiebanner",
    "category": 8
  },
  {
    "normalized": "kohandakupsised",
    "category": 3
  },
  {
    "normalized": "privaatsuspohimotted",
    "category": 9
  },
  {
    "normalized": "telli",
    "category": 0
  },
  {
    "normalized": "veelvalikuid",
    "category": 3
  },
  {
    "normalized": "noustunainultolulistekupsistega",
    "category": 1
  },
  {
    "normalized": "afghanistan",
    "category": 0
  },
  {
    "normalized": "kupsistelehel",
    "category": 9
  },
  {
    "normalized": "kupsistekasutamisepohimotteid",
    "category": 0
  },
  {
    "normalized": "salvestaeelistused",
    "category": 4
  },
  {
    "normalized": "sulgenavigatsioon",
    "category": 9
  },
  {
    "normalized": "otsing",
    "category": 0
  },
  {
    "normalized": "meiekupsisepoliitikakohtasiit",
    "category": 9
  },
  {
    "normalized": "withdrawconsent",
    "category": 2
  },
  {
    "normalized": "olennousjasalvestan",
    "category": 1
  },
  {
    "normalized": "sendmenewpassword",
    "category": 0
  },
  {
    "normalized": "kupsiseeeskiri",
    "category": 8
  },
  {
    "normalized": "списокпартнеровпоставщиков",
    "category": 0
  },
  {
    "normalized": "jatkailmanousolekuta",
    "category": 2
  },
  {
    "normalized": "jatkailmavastuvotmata",
    "category": 2
  },
  {
    "normalized": "endgerateeigenschaftenzuridentifikationaktivabfragen",
    "category": 0
  },
  {
    "normalized": "praferenzenspeichern",
    "category": 4
  },
  {
    "normalized": "genauestandortdatenundidentifikationdurchscannenvonendgeraten",
    "category": 0
  },
  {
    "normalized": "individuelleeinstellungeinblenden",
    "category": 3
  },
  {
    "normalized": "notwendigecookiesakzeptieren",
    "category": 2
  },
  {
    "normalized": "ubercookies",
    "category": 8
  },
  {
    "normalized": "akzeptierenschliessen",
    "category": 1
  },
  {
    "normalized": "individuelledatenschutzeinstellungen",
    "category": 3
  },
  {
    "normalized": "cookieserlauben",
    "category": 1
  },
  {
    "normalized": "alleakzeptierenundschließen",
    "category": 1
  },
  {
    "normalized": "nurerforderliche",
    "category": 2
  },
  {
    "normalized": "nichteinverstanden",
    "category": 2
  },
  {
    "normalized": "allesakzeptiereninklusanbieter",
    "category": 1
  },
  {
    "normalized": "↓1service",
    "category": 0
  },
  {
    "normalized": "unsere201partner",
    "category": 8
  },
  {
    "normalized": "nurtechnischnotwendigeakzeptieren",
    "category": 2
  },
  {
    "normalized": "zurkenntnisgenommen",
    "category": 1
  },
  {
    "normalized": "allediensteablehnen",
    "category": 2
  },
  {
    "normalized": "allediensteerlauben",
    "category": 1
  },
  {
    "normalized": "vonunsverwendetefunktionen",
    "category": 8
  },
  {
    "normalized": "vonunsverwendeteinformationen",
    "category": 8
  },
  {
    "normalized": "auswahlspeichernundzustimmen",
    "category": 4
  },
  {
    "normalized": "onlyacceptessentialcookies",
    "category": 2
  },
  {
    "normalized": "nurausgewahltecookiesakzeptieren",
    "category": 4
  },
  {
    "normalized": "weitereinformationenanzeigen",
    "category": 8
  },
  {
    "normalized": "17thirdparties",
    "category": 0
  },
  {
    "normalized": "14thirdparties",
    "category": 8
  },
  {
    "normalized": "allecookiesinklusanbieterakzeptieren",
    "category": 1
  },
  {
    "normalized": "optcookiesablehnen",
    "category": 2
  },
  {
    "normalized": "ichstimmenichtzu",
    "category": 2
  },
  {
    "normalized": "sprachwahlmenuoffnen",
    "category": 0
  },
  {
    "normalized": "unsere63partner",
    "category": 8
  },
  {
    "normalized": "anzeigeneinstellungen",
    "category": 3
  },
  {
    "normalized": "hiergehteszudendeutschencookieeinstellungen",
    "category": 3
  },
  {
    "normalized": "dataprivacyframeworkprogram",
    "category": 0
  },
  {
    "normalized": "cookieeinstellungenkonnensiejederzeitandern",
    "category": 3
  },
  {
    "normalized": "showmoreinformation",
    "category": 3
  },
  {
    "normalized": "ichakzeptierefunktionaleundmarketingcookiesusw",
    "category": 1
  },
  {
    "normalized": "personalisieredeineauswahl",
    "category": 3
  },
  {
    "normalized": "nichterforderlicheablehnen",
    "category": 2
  },
  {
    "normalized": "abgelehnt",
    "category": 2
  },
  {
    "normalized": "dataprivacypolicy",
    "category": 0
  },
  {
    "normalized": "tools",
    "category": 9
  },
  {
    "normalized": "zulassen",
    "category": 1
  },
  {
    "normalized": "meineauswahlerlauben",
    "category": 4
  },
  {
    "normalized": "optionalecookiesausschalten",
    "category": 2
  },
  {
    "normalized": "messung",
    "category": 9
  },
  {
    "normalized": "individualprivacysettings",
    "category": 3
  },
  {
    "normalized": "nurtechnischnotwendigecookiesakzeptieren",
    "category": 2
  },
  {
    "normalized": "nurmitessentiellencookiesfortfahren",
    "category": 2
  },
  {
    "normalized": "nurausgewahltecookiesverwenden",
    "category": 4
  },
  {
    "normalized": "klickensiehier",
    "category": 9
  },
  {
    "normalized": "speichernschließen",
    "category": 4
  },
  {
    "normalized": "mehrinfoscookieeinstellungen",
    "category": 3
  },
  {
    "normalized": "ablehneneswerdennurunbedingterforderlichecookiesgesetzt",
    "category": 2
  },
  {
    "normalized": "jaallecookiesinklusivevonusanbieternakzeptieren",
    "category": 1
  },
  {
    "normalized": "↓5services",
    "category": 0
  },
  {
    "normalized": "acceptselected",
    "category": 4
  },
  {
    "normalized": "allesakzeptiereninklusa",
    "category": 1
  },
  {
    "normalized": "forfurtherinformation",
    "category": 9
  },
  {
    "normalized": "ausgewahltecookiesakzeptieren",
    "category": 4
  },
  {
    "normalized": "okboomer",
    "category": 1
  },
  {
    "normalized": "personalisiertewerbung",
    "category": 0
  },
  {
    "normalized": "viewour824partners",
    "category": 8
  },
  {
    "normalized": "142partners",
    "category": 8
  },
  {
    "normalized": "legitimateinterest",
    "category": 9
  },
  {
    "normalized": "richtliniezucookiessdksundahnlichentechnologien",
    "category": 9
  },
  {
    "normalized": "allecookiesinklvonusanbietern",
    "category": 1
  },
  {
    "normalized": "nurerforderlichecookiesnutzen",
    "category": 2
  },
  {
    "normalized": "rejectoptional",
    "category": 2
  },
  {
    "normalized": "nurnotwendigecookieszulassen",
    "category": 2
  },
  {
    "normalized": "allecookiesunddrittanbieterinklusubermittlungenzulassen",
    "category": 1
  },
  {
    "normalized": "allebestatigen",
    "category": 1
  },
  {
    "normalized": "verbesserungdeskundenservices",
    "category": 0
  },
  {
    "normalized": "aduserdata",
    "category": 0
  },
  {
    "normalized": "adpersonalization",
    "category": 0
  },
  {
    "normalized": "nurtechnischnotwendigecookiesverwenden",
    "category": 2
  },
  {
    "normalized": "nurnotwendigecookieserlauben",
    "category": 2
  },
  {
    "normalized": "kronepur",
    "category": 0
  },
  {
    "normalized": "kurieradfree",
    "category": 0
  },
  {
    "normalized": "unser200partner",
    "category": 8
  },
  {
    "normalized": "einstellungenfestlegen",
    "category": 3
  },
  {
    "normalized": "cookieeinstellungenoffnen",
    "category": 3
  },
  {
    "normalized": "nurnotwendigeerlauben",
    "category": 2
  },
  {
    "normalized": "aboutsettings",
    "category": 3
  },
  {
    "normalized": "acceptselectedcookies",
    "category": 4
  },
  {
    "normalized": "yesiacceptallcookies",
    "category": 1
  },
  {
    "normalized": "savechoices",
    "category": 4
  },
  {
    "normalized": "nurtechnischnotwendige",
    "category": 2
  },
  {
    "normalized": "fortfahrenohneakzeptieren",
    "category": 2
  },
  {
    "normalized": "alleauswahlenundzustimmen",
    "category": 1
  },
  {
    "normalized": "detailauswahl",
    "category": 0
  },
  {
    "normalized": "sehensiesichunsere46partneran",
    "category": 8
  },
  {
    "normalized": "editcookiesettings→",
    "category": 3
  },
  {
    "normalized": "privatsphareeinstellungenindividuellfestlegen",
    "category": 0
  },
  {
    "normalized": "allecookieszulasseninklusanbieter",
    "category": 1
  },
  {
    "normalized": "applysettings",
    "category": 3
  },
  {
    "normalized": "acceptsettings",
    "category": 4
  },
  {
    "normalized": "individuelleauswahl",
    "category": 8
  },
  {
    "normalized": "cookieseinstellen",
    "category": 3
  },
  {
    "normalized": "consentdetails",
    "category": 8
  },
  {
    "normalized": "allaccept",
    "category": 1
  },
  {
    "normalized": "unser181partner",
    "category": 8
  },
  {
    "normalized": "dienstespeichern",
    "category": 9
  },
  {
    "normalized": "300anderewebsites",
    "category": 8
  },
  {
    "normalized": "cookieeinstellungenanpassen→",
    "category": 3
  },
  {
    "normalized": "technischnotwendigecookies",
    "category": 2
  },
  {
    "normalized": "notwendigecookiesverwenden",
    "category": 2
  },
  {
    "normalized": "allowallcookiesinclusproviders",
    "category": 1
  },
  {
    "normalized": "switchzumeinwilligenbzwablehnendesdienstesadobeanalytics",
    "category": 0
  },
  {
    "normalized": "switchzumeinwilligenbzwablehnenderkategoriesonstigeinhalte",
    "category": 0
  },
  {
    "normalized": "switchzumeinwilligenbzwablehnendesdienstesgooglerecaptcha",
    "category": 0
  },
  {
    "normalized": "switchzumeinwilligenbzwablehnendesdienstesvimeo",
    "category": 0
  },
  {
    "normalized": "switchzumeinwilligenbzwablehnendesdienstesyoutube",
    "category": 0
  },
  {
    "normalized": "cookieconsentschließen",
    "category": 9
  },
  {
    "normalized": "erforderlichecookies",
    "category": 2
  },
  {
    "normalized": "allecookiesakzeptierenweiter",
    "category": 1
  },
  {
    "normalized": "alleszulasseninklusanbieter",
    "category": 1
  },
  {
    "normalized": "notwendigeszulassen",
    "category": 2
  },
  {
    "normalized": "leistungen",
    "category": 0
  },
  {
    "normalized": "einbettenexternerinhalte",
    "category": 0
  },
  {
    "normalized": "acceptallinclthirdcountries",
    "category": 1
  },
  {
    "normalized": "einstellungenansehen",
    "category": 3
  },
  {
    "normalized": "schließenohnezuspeichern",
    "category": 9
  },
  {
    "normalized": "diensteablehnen",
    "category": 2
  },
  {
    "normalized": "wenndukeinecookiesmitausnahmedertechnischnotwendigencookieakzeptierenmochtestdannklickebittehier",
    "category": 2
  },
  {
    "normalized": "allgemeinengeschaftsbedingungen",
    "category": 0
  },
  {
    "normalized": "inourprivacypolicy",
    "category": 0
  },
  {
    "normalized": "dataprotectionstatement",
    "category": 0
  },
  {
    "normalized": "unsere32partner",
    "category": 8
  },
  {
    "normalized": "zustimmungzuruckziehen",
    "category": 2
  },
  {
    "normalized": "technischnotwendigeakzeptieren",
    "category": 2
  },
  {
    "normalized": "werbungbasierendaufeinerreduziertenmengevondatenpersonalisierteinhalteundmessungvonwerbeleistung",
    "category": 0
  },
  {
    "normalized": "messungderperformancevoninhaltenzielgruppenforschungsowieentwicklungundverbesserungderangebote",
    "category": 0
  },
  {
    "normalized": "personalisiertewerbungundinhaltemessungvonwerbeleistungundinhaltenzielgruppenforschungundentwicklungvonangeboten",
    "category": 0
  },
  {
    "normalized": "cookiedeclaration",
    "category": 0
  },
  {
    "normalized": "aboutcookies",
    "category": 0
  },
  {
    "normalized": "manageditsecuritysolutions",
    "category": 0
  },
  {
    "normalized": "industrialcybersecurity",
    "category": 0
  },
  {
    "normalized": "oemsdksundapis",
    "category": 0
  },
  {
    "normalized": "uberikarus",
    "category": 0
  },
  {
    "normalized": "individuellkonfigurieren",
    "category": 3
  },
  {
    "normalized": "nuressenzielle",
    "category": 2
  },
  {
    "normalized": "onlyallowrequiredcookies",
    "category": 2
  },
  {
    "normalized": "mehrdazu",
    "category": 0
  },
  {
    "normalized": "58partner",
    "category": 8
  },
  {
    "normalized": "ausgewahltecookieszulassen",
    "category": 4
  },
  {
    "normalized": "mitallencookiesfortfahren",
    "category": 1
  },
  {
    "normalized": "cookieubersicht",
    "category": 0
  },
  {
    "normalized": "yesiagreetoallcookies",
    "category": 1
  },
  {
    "normalized": "kooperationspartnerundwerbendeunternehmenlieferanten",
    "category": 0
  },
  {
    "normalized": "empfangenundverwendenautomatischgesendetergerateinformationenzumzweckderidentifikation",
    "category": 0
  },
  {
    "normalized": "allecookiesdeaktivieren",
    "category": 2
  },
  {
    "normalized": "zueinwilligungsoptionenspringen",
    "category": 3
  },
  {
    "normalized": "switchtoacceptorrejectthecategoryothercontent",
    "category": 9
  },
  {
    "normalized": "allenverarbeitungszwecken",
    "category": 0
  },
  {
    "normalized": "sparkassengruppe",
    "category": 0
  },
  {
    "normalized": "mehruberdiegenutztencookieserfahren",
    "category": 0
  },
  {
    "normalized": "akzeptiert",
    "category": 1
  },
  {
    "normalized": "werbungbasierendaufeinerreduziertenmengevondateneinempersonalisiertenwerbeprofilundmessungvonwerbeleistung",
    "category": 0
  },
  {
    "normalized": "personalisierteinhaltemessungvoninhaltenundzielgruppenforschung",
    "category": 0
  },
  {
    "normalized": "verwendungvonprofilenzurauswahlpersonalisierterwerbung",
    "category": 0
  },
  {
    "normalized": "entwicklungundverbesserungderangebote",
    "category": 0
  },
  {
    "normalized": "verwendungreduzierterdatenzurauswahlvoninhalten",
    "category": 0
  },
  {
    "normalized": "fokustugraz",
    "category": 0
  },
  {
    "normalized": "essenziell",
    "category": 8
  },
  {
    "normalized": "keineeinwilligung",
    "category": 2
  },
  {
    "normalized": "individuelleeinstellung",
    "category": 3
  },
  {
    "normalized": "lernensiemehrubercookies",
    "category": 0
  },
  {
    "normalized": "unsere594partner",
    "category": 8
  },
  {
    "normalized": "marketingcookies",
    "category": 0
  },
  {
    "normalized": "statistikcookies",
    "category": 0
  },
  {
    "normalized": "essentielecookies",
    "category": 2
  },
  {
    "normalized": "essentiellecookies",
    "category": 0
  },
  {
    "normalized": "allecookiesaanvaarden",
    "category": 1
  },
  {
    "normalized": "viewour267partners",
    "category": 8
  },
  {
    "normalized": "setmypreferences",
    "category": 3
  },
  {
    "normalized": "aanvaardallecookies",
    "category": 1
  },
  {
    "normalized": "allecookiesweigeren",
    "category": 2
  },
  {
    "normalized": "onze853partners",
    "category": 8
  },
  {
    "normalized": "personaliseren",
    "category": 3
  },
  {
    "normalized": "changecookiepreferences",
    "category": 3
  },
  {
    "normalized": "steljevoorkeurenin",
    "category": 3
  },
  {
    "normalized": "choisirsoimemelescookies",
    "category": 3
  },
  {
    "normalized": "lescookiesessentielsuniquement",
    "category": 2
  },
  {
    "normalized": "weigercookies",
    "category": 2
  },
  {
    "normalized": "beheercookiesperdoel",
    "category": 3
  },
  {
    "normalized": "choose",
    "category": 3
  },
  {
    "normalized": "verderzonderanalysetool",
    "category": 2
  },
  {
    "normalized": "verdermetanalysetool",
    "category": 1
  },
  {
    "normalized": "toestemmingintrekken",
    "category": 2
  },
  {
    "normalized": "settingcookiepreferences",
    "category": 3
  },
  {
    "normalized": "changemycookiesettings",
    "category": 3
  },
  {
    "normalized": "enkelnoodzakelijkecookiesaanvaarden",
    "category": 2
  },
  {
    "normalized": "cookieinstellingenbeheren",
    "category": 3
  },
  {
    "normalized": "nos392partenaires",
    "category": 8
  },
  {
    "normalized": "kommeerteweten",
    "category": 3
  },
  {
    "normalized": "viewour202partners",
    "category": 0
  },
  {
    "normalized": "viewour205partners",
    "category": 8
  },
  {
    "normalized": "configurepreferences",
    "category": 3
  },
  {
    "normalized": "modifiermanuellement",
    "category": 3
  },
  {
    "normalized": "givememoreinfo",
    "category": 8
  },
  {
    "normalized": "noonlyfunctionalcookies",
    "category": 2
  },
  {
    "normalized": "enkelnoodzakelijkecookiestoestaan",
    "category": 2
  },
  {
    "normalized": "mijncookiesbeheren",
    "category": 3
  },
  {
    "normalized": "continuersansloutildanalyse",
    "category": 2
  },
  {
    "normalized": "continueravecloutildanalyse",
    "category": 1
  },
  {
    "normalized": "illdecidemyself",
    "category": 3
  },
  {
    "normalized": "consentscertifiedby",
    "category": 0
  },
  {
    "normalized": "iwanttochoose",
    "category": 3
  },
  {
    "normalized": "522thirdparties",
    "category": 8
  },
  {
    "normalized": "voorwie",
    "category": 0
  },
  {
    "normalized": "peppol",
    "category": 0
  },
  {
    "normalized": "toestemmingsvoorkeuren",
    "category": 3
  },
  {
    "normalized": "ensavoirplussurlescookiesutilisesetleurorigine",
    "category": 8
  },
  {
    "normalized": "verderzonderaccepteren",
    "category": 2
  },
  {
    "normalized": "nuressentiellecookieszulassen",
    "category": 2
  },
  {
    "normalized": "minimalecookiesaanvaarden",
    "category": 2
  },
  {
    "normalized": "okthanks",
    "category": 1
  },
  {
    "normalized": "fermerlabannierevisitbrussels",
    "category": 0
  },
  {
    "normalized": "217derdendoorgegeven",
    "category": 8
  },
  {
    "normalized": "isgoedtoondepopup",
    "category": 9
  },
  {
    "normalized": "nunietmisschienlater",
    "category": 2
  },
  {
    "normalized": "refusercookies",
    "category": 2
  },
  {
    "normalized": "gestiondescookiesparobjectif",
    "category": 3
  },
  {
    "normalized": "essentialandfunctionalcookies",
    "category": 2
  },
  {
    "normalized": "beheercookies",
    "category": 3
  },
  {
    "normalized": "proceedwithfunctionalcookiesonly",
    "category": 2
  },
  {
    "normalized": "selectieaccepteren",
    "category": 4
  },
  {
    "normalized": "mijnkeuzesbevestigen",
    "category": 4
  },
  {
    "normalized": "stelvoorkeurenzelfin",
    "category": 3
  },
  {
    "normalized": "rejeter",
    "category": 2
  },
  {
    "normalized": "changeconsentdetails",
    "category": 3
  },
  {
    "normalized": "irefuse",
    "category": 2
  },
  {
    "normalized": "selectieopslaan",
    "category": 4
  },
  {
    "normalized": "jecookiesbeheren",
    "category": 3
  },
  {
    "normalized": "klikher",
    "category": 8
  },
  {
    "normalized": "klikhier",
    "category": 9
  },
  {
    "normalized": "showallpartners823→",
    "category": 0
  },
  {
    "normalized": "showallpartners820→",
    "category": 8
  },
  {
    "normalized": "stockeretouaccederadesinformationssurunappareil",
    "category": 0
  },
  {
    "normalized": "enkelnoodzakelijkecookies",
    "category": 2
  },
  {
    "normalized": "verdernaargoplay",
    "category": 8
  },
  {
    "normalized": "bekijkonze243partners",
    "category": 8
  },
  {
    "normalized": "beheerjevoorkeuren",
    "category": 3
  },
  {
    "normalized": "nonjeveuxplusdinformation",
    "category": 8
  },
  {
    "normalized": "confirmermonchoix",
    "category": 4
  },
  {
    "normalized": "managesettingsordeny",
    "category": 3
  },
  {
    "normalized": "bekijkonze192partners",
    "category": 8
  },
  {
    "normalized": "aanvaardalle",
    "category": 1
  },
  {
    "normalized": "openmenu",
    "category": 3
  },
  {
    "normalized": "enkelselectietoestaan",
    "category": 4
  },
  {
    "normalized": "cookiesweigeren",
    "category": 2
  },
  {
    "normalized": "hidethismessage",
    "category": 1
  },
  {
    "normalized": "enkelstriktnoodzakelijkecookies",
    "category": 2
  },
  {
    "normalized": "staallestoe",
    "category": 1
  },
  {
    "normalized": "stanoodzakelijkecookiestoe",
    "category": 2
  },
  {
    "normalized": "kiescookies",
    "category": 3
  },
  {
    "normalized": "parametragedescookies",
    "category": 3
  },
  {
    "normalized": "refuseretparametrerlescookies",
    "category": 3
  },
  {
    "normalized": "viewour806partners",
    "category": 8
  },
  {
    "normalized": "iwoudliketosetmycookiepreferencesmanually",
    "category": 3
  },
  {
    "normalized": "297tcfleveranciersen517advertentiepartners",
    "category": 8
  },
  {
    "normalized": "optiesbeheren",
    "category": 3
  },
  {
    "normalized": "mijnkeuzebewaren",
    "category": 4
  },
  {
    "normalized": "okikbegrijphet",
    "category": 1
  },
  {
    "normalized": "verdergaanmetanalytischecookies",
    "category": 2
  },
  {
    "normalized": "betnow",
    "category": 0
  },
  {
    "normalized": "configureercookieinstellingen",
    "category": 3
  },
  {
    "normalized": "rejeterlescookiesnonessentiels",
    "category": 2
  },
  {
    "normalized": "parametragedespreferences",
    "category": 3
  },
  {
    "normalized": "jaikgeeftoestemming",
    "category": 1
  },
  {
    "normalized": "neegaverdernaardewebsite",
    "category": 2
  },
  {
    "normalized": "accepteergeselecteerde",
    "category": 4
  },
  {
    "normalized": "affichertouslespartenaires812→",
    "category": 8
  },
  {
    "normalized": "advertentieinstellingen",
    "category": 9
  },
  {
    "normalized": "uniquementlescookiesessentiels",
    "category": 2
  },
  {
    "normalized": "jaikaanvaardallecookies",
    "category": 1
  },
  {
    "normalized": "neenikstelzelfvoorkeurcookiesin",
    "category": 3
  },
  {
    "normalized": "noconsent",
    "category": 2
  },
  {
    "normalized": "voirnos296partenaires",
    "category": 8
  },
  {
    "normalized": "neepasaan",
    "category": 3
  },
  {
    "normalized": "privacyinstellingenwijzigen",
    "category": 3
  },
  {
    "normalized": "bewaarvoorkeuren",
    "category": 4
  },
  {
    "normalized": "jetoestemmingintrekken",
    "category": 2
  },
  {
    "normalized": "accepterlaselection",
    "category": 4
  },
  {
    "normalized": "nos289partenaires",
    "category": 8
  },
  {
    "normalized": "afwijzenensluiten",
    "category": 2
  },
  {
    "normalized": "cookievoorkeureninstellen",
    "category": 3
  },
  {
    "normalized": "steljepersoonlijkevoorkeurenin",
    "category": 3
  },
  {
    "normalized": "showdetailedsettings",
    "category": 3
  },
  {
    "normalized": "bewaarmijnkeuze",
    "category": 4
  },
  {
    "normalized": "savepreferences",
    "category": 4
  },
  {
    "normalized": "adjustyourpreferences",
    "category": 3
  },
  {
    "normalized": "beheerinstellingen",
    "category": 3
  },
  {
    "normalized": "meerleren",
    "category": 8
  },
  {
    "normalized": "closemodal",
    "category": 9
  },
  {
    "normalized": "choixdescookies",
    "category": 3
  },
  {
    "normalized": "bekijkdecookieinstellingen",
    "category": 3
  },
  {
    "normalized": "nosmedias",
    "category": 0
  },
  {
    "normalized": "onze826partners",
    "category": 8
  },
  {
    "normalized": "meerwetenovercookiespdf",
    "category": 0
  },
  {
    "normalized": "hierweigeren",
    "category": 2
  },
  {
    "normalized": "gepersonaliseerdecontent",
    "category": 0
  },
  {
    "normalized": "advertentieencontentmetingendoelgroepenonderzoekenontwikkelingvandiensten",
    "category": 0
  },
  {
    "normalized": "lijstmetadvertentiepartners",
    "category": 0
  },
  {
    "normalized": "nos1014partenaires",
    "category": 0
  },
  {
    "normalized": "consentement",
    "category": 1
  },
  {
    "normalized": "aproposdescookies",
    "category": 8
  },
  {
    "normalized": "iunderstood",
    "category": 1
  },
  {
    "normalized": "acceptnecessaryonly",
    "category": 2
  },
  {
    "normalized": "plusdinfos",
    "category": 0
  },
  {
    "normalized": "plusdinfo",
    "category": 8
  },
  {
    "normalized": "consulternotrepolitiquedecookies",
    "category": 0
  },
  {
    "normalized": "onze807partners",
    "category": 8
  },
  {
    "normalized": "necessarycookies",
    "category": 2
  },
  {
    "normalized": "ikganietakkoord",
    "category": 2
  },
  {
    "normalized": "our277partners",
    "category": 8
  },
  {
    "normalized": "onze81partners",
    "category": 8
  },
  {
    "normalized": "overcookies",
    "category": 8
  },
  {
    "normalized": "enkelfunctionelecookiesaanvaarden",
    "category": 2
  },
  {
    "normalized": "onze273partners",
    "category": 8
  },
  {
    "normalized": "nos79partenaires",
    "category": 8
  },
  {
    "normalized": "our66partners",
    "category": 8
  },
  {
    "normalized": "onze188partners",
    "category": 8
  },
  {
    "normalized": "our284partners",
    "category": 8
  },
  {
    "normalized": "our59partners",
    "category": 8
  },
  {
    "normalized": "nos827partenaires",
    "category": 8
  },
  {
    "normalized": "configurervoscookies",
    "category": 3
  },
  {
    "normalized": "ensavoirplusetpersonnaliser",
    "category": 3
  },
  {
    "normalized": "single",
    "category": 0
  },
  {
    "normalized": "system",
    "category": 0
  },
  {
    "normalized": "potentialwin",
    "category": 0
  },
  {
    "normalized": "leesmeeroverhoewijpersoonlijkeinformatieverwerken",
    "category": 0
  },
  {
    "normalized": "schrijfin",
    "category": 0
  },
  {
    "normalized": "acceptertouslescookiesetcontinuerverslesite",
    "category": 1
  },
  {
    "normalized": "reglerlesparametres",
    "category": 3
  },
  {
    "normalized": "nos441partenaires",
    "category": 8
  },
  {
    "normalized": "geolocalisationprecise",
    "category": 0
  },
  {
    "normalized": "nos216partenaires",
    "category": 8
  },
  {
    "normalized": "nos25partenaires",
    "category": 8
  },
  {
    "normalized": "cookieskiezen",
    "category": 3
  },
  {
    "normalized": "laatmeerzien",
    "category": 0
  },
  {
    "normalized": "begrepen",
    "category": 1
  },
  {
    "normalized": "necessaires",
    "category": 8
  },
  {
    "normalized": "vertelmemeer",
    "category": 0
  },
  {
    "normalized": "selectietoestaanallecookiestoestaan",
    "category": 8
  },
  {
    "normalized": "onze79partners",
    "category": 8
  },
  {
    "normalized": "wwwtuibe",
    "category": 0
  },
  {
    "normalized": "wwwtuiflybe",
    "category": 0
  },
  {
    "normalized": "nos813partenaires",
    "category": 8
  },
  {
    "normalized": "wettelijkevermeldingen",
    "category": 0
  },
  {
    "normalized": "categorieen",
    "category": 0
  },
  {
    "normalized": "our804partners",
    "category": 8
  },
  {
    "normalized": "cookiesfonctionnels",
    "category": 2
  },
  {
    "normalized": "cookiesdestatistiques",
    "category": 0
  },
  {
    "normalized": "omcookies",
    "category": 0
  },
  {
    "normalized": "tilladvalgte",
    "category": 4
  },
  {
    "normalized": "detaljer",
    "category": 8
  },
  {
    "normalized": "samtykke",
    "category": 1
  },
  {
    "normalized": "vores856partnere",
    "category": 8
  },
  {
    "normalized": "afvisogluk",
    "category": 2
  },
  {
    "normalized": "accepterogluk",
    "category": 1
  },
  {
    "normalized": "spremi",
    "category": 4
  },
  {
    "normalized": "sprejmi",
    "category": 1
  },
  {
    "normalized": "annonceindstillinger",
    "category": 3
  },
  {
    "normalized": "tilpas",
    "category": 3
  },
  {
    "normalized": "vælgalle",
    "category": 1
  },
  {
    "normalized": "funktionelle",
    "category": 0
  },
  {
    "normalized": "statisticke",
    "category": 0
  },
  {
    "normalized": "statistiske",
    "category": 8
  },
  {
    "normalized": "gemindstillinger",
    "category": 4
  },
  {
    "normalized": "vores198samarbejdspartnere",
    "category": 8
  },
  {
    "normalized": "tilpasdinevalg",
    "category": 4
  },
  {
    "normalized": "vores332partnere",
    "category": 8
  },
  {
    "normalized": "acceptervalgte",
    "category": 4
  },
  {
    "normalized": "læsmere",
    "category": 8
  },
  {
    "normalized": "oktilalle",
    "category": 1
  },
  {
    "normalized": "afslaalle",
    "category": 2
  },
  {
    "normalized": "læsmereomcookies",
    "category": 0
  },
  {
    "normalized": "købadgangogafvis",
    "category": 5
  },
  {
    "normalized": "erklæringomcookies",
    "category": 0
  },
  {
    "normalized": "opdatersamtykke",
    "category": 8
  },
  {
    "normalized": "persondatapolitik",
    "category": 0
  },
  {
    "normalized": "tredjeparter",
    "category": 0
  },
  {
    "normalized": "avanceredeannonceindstillinger",
    "category": 3
  },
  {
    "normalized": "viscookies",
    "category": 0
  },
  {
    "normalized": "tilpasindstillinger",
    "category": 3
  },
  {
    "normalized": "accepternødvendige",
    "category": 2
  },
  {
    "normalized": "bekræftminevalg",
    "category": 4
  },
  {
    "normalized": "købabonnement",
    "category": 5
  },
  {
    "normalized": "annonceringssamarbejdspartnere",
    "category": 0
  },
  {
    "normalized": "nejtak",
    "category": 2
  },
  {
    "normalized": "vores205partnere",
    "category": 8
  },
  {
    "normalized": "lærmere→",
    "category": 0
  },
  {
    "normalized": "læsmereomcookiesoghvordandeindsamlededatabehandlesher",
    "category": 0
  },
  {
    "normalized": "our709partners",
    "category": 8
  },
  {
    "normalized": "opbevareogellertilgaoplysningerpaenenhed",
    "category": 0
  },
  {
    "normalized": "præcisegeografiskeplaceringsoplysningerogidentifikationgennemenhedsscanning",
    "category": 0
  },
  {
    "normalized": "læscookiepolitik",
    "category": 0
  },
  {
    "normalized": "listeoverpartnereleverandører",
    "category": 0
  },
  {
    "normalized": "glacier",
    "category": 0
  },
  {
    "normalized": "careers",
    "category": 0
  },
  {
    "normalized": "cookieogprivatlivspolitik",
    "category": 0
  },
  {
    "normalized": "tilladnødvendige",
    "category": 2
  },
  {
    "normalized": "tilladkunnødvendige",
    "category": 2
  },
  {
    "normalized": "oktilvalgte",
    "category": 4
  },
  {
    "normalized": "tilladnødvendigecookies",
    "category": 2
  },
  {
    "normalized": "acceptnecessary",
    "category": 2
  },
  {
    "normalized": "kunpakrævede",
    "category": 2
  },
  {
    "normalized": "pakrævede",
    "category": 2
  },
  {
    "normalized": "jatek",
    "category": 0
  },
  {
    "normalized": "jatak",
    "category": 1
  },
  {
    "normalized": "ændreminepræferancer",
    "category": 3
  },
  {
    "normalized": "tilpasditvalg",
    "category": 4
  },
  {
    "normalized": "uklassificerede",
    "category": 0
  },
  {
    "normalized": "læsvorescookiepolitik",
    "category": 0
  },
  {
    "normalized": "jataktilvalgtecookies",
    "category": 4
  },
  {
    "normalized": "vores709partnere",
    "category": 8
  },
  {
    "normalized": "ladmigvælge",
    "category": 8
  },
  {
    "normalized": "afviscookies",
    "category": 2
  },
  {
    "normalized": "vores10partnere",
    "category": 8
  },
  {
    "normalized": "tilladvalgtecookies",
    "category": 4
  },
  {
    "normalized": "accepterogfortsæt",
    "category": 1
  },
  {
    "normalized": "visdetaljeromcookiekategorierne",
    "category": 3
  },
  {
    "normalized": "bekræft",
    "category": 1
  },
  {
    "normalized": "acceptersporing",
    "category": 1
  },
  {
    "normalized": "administrersporing",
    "category": 3
  },
  {
    "normalized": "viscookieoversigt",
    "category": 0
  },
  {
    "normalized": "jatakaccepteralle",
    "category": 1
  },
  {
    "normalized": "yourprivacysettings",
    "category": 3
  },
  {
    "normalized": "keepselected",
    "category": 4
  },
  {
    "normalized": "onlymandatory",
    "category": 2
  },
  {
    "normalized": "showallpartners812→",
    "category": 8
  },
  {
    "normalized": "gemogluk",
    "category": 4
  },
  {
    "normalized": "listeovercookies",
    "category": 0
  },
  {
    "normalized": "begrænset",
    "category": 2
  },
  {
    "normalized": "hvordanschibstedbehandlerdinepersonoplysninger",
    "category": 0
  },
  {
    "normalized": "cookiesbrugtafreklamepartnereiab",
    "category": 0
  },
  {
    "normalized": "analyseogproduktudvikling",
    "category": 0
  },
  {
    "normalized": "nødvendigecookies",
    "category": 2
  },
  {
    "normalized": "sealleleverandører",
    "category": 0
  },
  {
    "normalized": "afvisalt",
    "category": 2
  },
  {
    "normalized": "jegacceptererallecookies",
    "category": 1
  },
  {
    "normalized": "retindstillinger",
    "category": 3
  },
  {
    "normalized": "tilladalleogfortsæt",
    "category": 1
  },
  {
    "normalized": "visleverandører70",
    "category": 8
  },
  {
    "normalized": "google",
    "category": 0
  },
  {
    "normalized": "rediger",
    "category": 3
  },
  {
    "normalized": "nejtakafvisalle",
    "category": 2
  },
  {
    "normalized": "deterokaccepteralle",
    "category": 1
  },
  {
    "normalized": "oktilnødvendige",
    "category": 2
  },
  {
    "normalized": "statistiktilatviserelevantespilogpuljer",
    "category": 0
  },
  {
    "normalized": "markedsføringtilrelevantindholdpaandrehjemmesider",
    "category": 0
  },
  {
    "normalized": "nødvendigeforatdanskespildkfungerer",
    "category": 0
  },
  {
    "normalized": "jataktilladalle",
    "category": 1
  },
  {
    "normalized": "læscookiepolitikher",
    "category": 0
  },
  {
    "normalized": "tilpastjenester",
    "category": 8
  },
  {
    "normalized": "sevalgtecookies",
    "category": 8
  },
  {
    "normalized": "administrerindstillinger",
    "category": 3
  },
  {
    "normalized": "jataktilallecookies",
    "category": 1
  },
  {
    "normalized": "ændreindstillinger",
    "category": 3
  },
  {
    "normalized": "viscookiedetaljer",
    "category": 0
  },
  {
    "normalized": "accepterkunnødvendige",
    "category": 2
  },
  {
    "normalized": "fuldweboplevelse",
    "category": 1
  },
  {
    "normalized": "visleverandører",
    "category": 0
  },
  {
    "normalized": "declineallunnecessarycookies",
    "category": 2
  },
  {
    "normalized": "games",
    "category": 0
  },
  {
    "normalized": "copenhagen",
    "category": 0
  },
  {
    "normalized": "malmo",
    "category": 0
  },
  {
    "normalized": "barcelona",
    "category": 0
  },
  {
    "normalized": "istanbul",
    "category": 0
  },
  {
    "normalized": "brighton",
    "category": 0
  },
  {
    "normalized": "healthwarning",
    "category": 0
  },
  {
    "normalized": "playersupport",
    "category": 0
  },
  {
    "normalized": "projectfantasy",
    "category": 0
  },
  {
    "normalized": "project007",
    "category": 0
  },
  {
    "normalized": "hitman",
    "category": 0
  },
  {
    "normalized": "hitmanabsolution",
    "category": 0
  },
  {
    "normalized": "kanelynch2",
    "category": 0
  },
  {
    "normalized": "minininjas",
    "category": 0
  },
  {
    "normalized": "hitmanbloodmoney",
    "category": 0
  },
  {
    "normalized": "hitmancontracts",
    "category": 0
  },
  {
    "normalized": "freedomfighters",
    "category": 0
  },
  {
    "normalized": "hitman2silentassassin",
    "category": 0
  },
  {
    "normalized": "hitmancodename47",
    "category": 0
  },
  {
    "normalized": "cookiepolicysettings",
    "category": 0
  },
  {
    "normalized": "visdetaljeromcookies",
    "category": 0
  },
  {
    "normalized": "tilladcookies",
    "category": 1
  },
  {
    "normalized": "accepterdenfuldeoplevelse",
    "category": 1
  },
  {
    "normalized": "tilladudvalgtecookies",
    "category": 4
  },
  {
    "normalized": "træksamtykketilbage",
    "category": 2
  },
  {
    "normalized": "pctablets",
    "category": 0
  },
  {
    "normalized": "tvhifi",
    "category": 0
  },
  {
    "normalized": "mobil",
    "category": 0
  },
  {
    "normalized": "boligfritid",
    "category": 0
  },
  {
    "normalized": "demovarer",
    "category": 0
  },
  {
    "normalized": "kampagner",
    "category": 0
  },
  {
    "normalized": "tilladallenødvendige",
    "category": 2
  },
  {
    "normalized": "jegvilgernehavegratisadgang",
    "category": 1
  },
  {
    "normalized": "købadgangellerlogin",
    "category": 5
  },
  {
    "normalized": "tilpassetannonceringogindholdannonceringsogindholdsmalingmalgruppeundersøgelserogudviklingaftjenester",
    "category": 0
  },
  {
    "normalized": "listeoverleverandører",
    "category": 0
  },
  {
    "normalized": "vælgspecifikkeformal",
    "category": 0
  },
  {
    "normalized": "gratisadgang",
    "category": 1
  },
  {
    "normalized": "googlesprivatlivspolitik",
    "category": 0
  },
  {
    "normalized": "lukindstillinger",
    "category": 9
  },
  {
    "normalized": "41thirdparties",
    "category": 8
  },
  {
    "normalized": "søg",
    "category": 0
  },
  {
    "normalized": "administrersamtykke",
    "category": 3
  },
  {
    "normalized": "cookiesettingsinformation",
    "category": 3
  },
  {
    "normalized": "chooseyourpreferences",
    "category": 3
  },
  {
    "normalized": "brugkunnødvendige",
    "category": 2
  },
  {
    "normalized": "vores764partnere",
    "category": 8
  },
  {
    "normalized": "cookiespayousee",
    "category": 0
  },
  {
    "normalized": "læsmereomtivolisbrugafcookiesher",
    "category": 0
  },
  {
    "normalized": "tillad",
    "category": 1
  },
  {
    "normalized": "afvisallecookies",
    "category": 2
  },
  {
    "normalized": "selectall",
    "category": 8
  },
  {
    "normalized": "kundevigtigste",
    "category": 2
  },
  {
    "normalized": "deterok",
    "category": 1
  },
  {
    "normalized": "indstilpræferencer",
    "category": 3
  },
  {
    "normalized": "eksklusiveappkuponertildig",
    "category": 0
  },
  {
    "normalized": "forstaet",
    "category": 8
  },
  {
    "normalized": "marketingcookiesinklusivfacebookoggoogle",
    "category": 8
  },
  {
    "normalized": "omcookiessporing",
    "category": 0
  },
  {
    "normalized": "nejtilcookies",
    "category": 2
  },
  {
    "normalized": "jatilcookies",
    "category": 1
  },
  {
    "normalized": "famereatvide",
    "category": 0
  },
  {
    "normalized": "marketingcookiesinklusivemetaplatformsfacebookoggoogle",
    "category": 0
  },
  {
    "normalized": "cookiepolitikoglisteoverpartersomentenindsamlerellervivideregiveroplysningertil",
    "category": 0
  },
  {
    "normalized": "persondatapolitikker",
    "category": 0
  },
  {
    "normalized": "lsrememberme",
    "category": 0
  },
  {
    "normalized": "læsmereomvoresprivatlivspolitikogbrugafcookies",
    "category": 0
  },
  {
    "normalized": "handelsbetingelser",
    "category": 0
  },
  {
    "normalized": "readmoreaboutcookies",
    "category": 0
  },
  {
    "normalized": "vores13samarbejdspartnere",
    "category": 8
  },
  {
    "normalized": "mereomhvordanvibrugercookies",
    "category": 0
  },
  {
    "normalized": "cookiepolitikher",
    "category": 0
  },
  {
    "normalized": "nødvendigepakrævet",
    "category": 2
  },
  {
    "normalized": "markedsføring",
    "category": 8
  },
  {
    "normalized": "personalisering",
    "category": 8
  },
  {
    "normalized": "readmoreaboutourcookiepolicy",
    "category": 0
  },
  {
    "normalized": "aboutcookiesingeneral",
    "category": 0
  },
  {
    "normalized": "læsmereomcookiespalexdk",
    "category": 0
  },
  {
    "normalized": "secookieogprivatlivspolitikher",
    "category": 0
  },
  {
    "normalized": "læsmereomvorescookiepolitik",
    "category": 0
  },
  {
    "normalized": "cookieinformation",
    "category": 0
  },
  {
    "normalized": "sadanadministrererogafviserducookies",
    "category": 8
  },
  {
    "normalized": "ratsel",
    "category": 0
  },
  {
    "normalized": "dukansigenejtaktilstatistik",
    "category": 8
  },
  {
    "normalized": "secookiepolitik",
    "category": 0
  },
  {
    "normalized": "tipos",
    "category": 0
  },
  {
    "normalized": "præferencerforcookies",
    "category": 3
  },
  {
    "normalized": "vores26samarbejdspartnere",
    "category": 8
  },
  {
    "normalized": "læsmereomvoresbrugafcookies",
    "category": 0
  },
  {
    "normalized": ">sevorescookiepolitik",
    "category": 0
  },
  {
    "normalized": "privatlivogcookies",
    "category": 0
  },
  {
    "normalized": "useragreement",
    "category": 9
  },
  {
    "normalized": "allenzustimmen",
    "category": 1
  },
  {
    "normalized": "subscribenow",
    "category": 9
  },
  {
    "normalized": "usemandatoryservices",
    "category": 0
  },
  {
    "normalized": "cookiecenter",
    "category": 0
  },
  {
    "normalized": "einwilligenundweiter",
    "category": 1
  },
  {
    "normalized": "pushbenachrichtigungenkommunikation",
    "category": 0
  },
  {
    "normalized": "angebotsubergreifendeverarbeitungvondatendurchbertelsmannunternehmenfuranalyseproduktentwicklungmessungwerbungundrisikomanagement",
    "category": 0
  },
  {
    "normalized": "speichernschliessen",
    "category": 4
  },
  {
    "normalized": "erstellungvonprofilenfurpersonalisiertewerbung",
    "category": 0
  },
  {
    "normalized": "nurerforderlichecookiesakzeptieren",
    "category": 2
  },
  {
    "normalized": "funktionalanalytikwerbungnichtiabanbietersozialemedienundunbedingterforderlichecookies",
    "category": 0
  },
  {
    "normalized": "einwilligungseinstellungen",
    "category": 3
  },
  {
    "normalized": "sehensiesichunsere241partneran",
    "category": 8
  },
  {
    "normalized": "individuellanpassen",
    "category": 3
  },
  {
    "normalized": "personalisierteanzeigenwerbetrackingundzugriffaufihrendgerat",
    "category": 0
  },
  {
    "normalized": "consentandcontinue",
    "category": 1
  },
  {
    "normalized": "neunpartner",
    "category": 8
  },
  {
    "normalized": "144partner",
    "category": 8
  },
  {
    "normalized": "156partner",
    "category": 8
  },
  {
    "normalized": "allownecessarycookies",
    "category": 2
  },
  {
    "normalized": "our14partners",
    "category": 0
  },
  {
    "normalized": "our147partners",
    "category": 0
  },
  {
    "normalized": "our140partners",
    "category": 8
  },
  {
    "normalized": "analyseverwalten",
    "category": 9
  },
  {
    "normalized": "individuelleauswahlspeichern",
    "category": 4
  },
  {
    "normalized": "sehensiesichunsere239partneran",
    "category": 8
  },
  {
    "normalized": "nutzungsanalysemarketingpersonalisierung",
    "category": 0
  },
  {
    "normalized": "sozialenetzwerkeundembeds",
    "category": 0
  },
  {
    "normalized": "verwendungreduzierterdatenzurauswahlvonwerbeanzeigen",
    "category": 0
  },
  {
    "normalized": "erstellungvonprofilenzurpersonalisierungvoninhalten",
    "category": 0
  },
  {
    "normalized": "verwendungvonprofilenzurauswahlpersonalisierterinhalte",
    "category": 0
  },
  {
    "normalized": "messungderwerbeleistung",
    "category": 0
  },
  {
    "normalized": "messungderperformancevoninhalten",
    "category": 0
  },
  {
    "normalized": "ohneakzeptierenfortfahren",
    "category": 2
  },
  {
    "normalized": "allowonlynecessarycookies",
    "category": 2
  },
  {
    "normalized": "nichtannehmenundweiter",
    "category": 2
  },
  {
    "normalized": "werbefreifur149monat",
    "category": 5
  },
  {
    "normalized": "purabobereitsgebuchthieranmelden",
    "category": 0
  },
  {
    "normalized": "analysecookiesumdiewebseitezuoptimieren",
    "category": 0
  },
  {
    "normalized": "pushmessaging",
    "category": 0
  },
  {
    "normalized": "kundenkommunikationundsupport",
    "category": 0
  },
  {
    "normalized": "jetztautobildpurabonnieren",
    "category": 0
  },
  {
    "normalized": "denhieraufgefuhrtenunternehmen",
    "category": 0
  },
  {
    "normalized": "softwaretableau",
    "category": 0
  },
  {
    "normalized": "alleablehnenaußernotwendigecookies",
    "category": 2
  },
  {
    "normalized": "nothankyou",
    "category": 2
  },
  {
    "normalized": "contentpassaboabschliessen",
    "category": 5
  },
  {
    "normalized": "faqvoncontentpass",
    "category": 0
  },
  {
    "normalized": "rejectnonnecessary",
    "category": 2
  },
  {
    "normalized": "mehrinformationendazufindestduhier",
    "category": 0
  },
  {
    "normalized": "comdirectsurfertracking",
    "category": 0
  },
  {
    "normalized": "jetztcomputerbildpurabonnieren",
    "category": 0
  },
  {
    "normalized": "widerrufen",
    "category": 2
  },
  {
    "normalized": "datenschutzhinweisederdbagzuranalyse",
    "category": 0
  },
  {
    "normalized": "statistischecookiesakzeptieren",
    "category": 8
  },
  {
    "normalized": "weiterohnestatistischecookies",
    "category": 8
  },
  {
    "normalized": "rejectallalleablehnen",
    "category": 2
  },
  {
    "normalized": "acceptakzeptierten",
    "category": 1
  },
  {
    "normalized": "messungvonwerbeleistungundderperformancevoninhaltenzielgruppenforschungsowieentwicklungundverbesserungderangebote",
    "category": 0
  },
  {
    "normalized": "plattform",
    "category": 0
  },
  {
    "normalized": "wachsemituns",
    "category": 0
  },
  {
    "normalized": "unternehmen",
    "category": 0
  },
  {
    "normalized": "konfigurierenoderablehnen",
    "category": 3
  },
  {
    "normalized": "viewour244partners",
    "category": 8
  },
  {
    "normalized": "nurtechnischnotwendigecookies",
    "category": 2
  },
  {
    "normalized": "149drittanbietern",
    "category": 8
  },
  {
    "normalized": "werbefreifur399inklustmonat",
    "category": 5
  },
  {
    "normalized": "jainordnung",
    "category": 1
  },
  {
    "normalized": "neindanke",
    "category": 2
  },
  {
    "normalized": "akzeptierenwieausgewahlt",
    "category": 4
  },
  {
    "normalized": "↓3anwendungen",
    "category": 0
  },
  {
    "normalized": "datenschutzmanageraufrufen",
    "category": 0
  },
  {
    "normalized": "nurfunktionellecookiesannehmen",
    "category": 2
  },
  {
    "normalized": "nurerforderlichetechnologienakzeptieren",
    "category": 2
  },
  {
    "normalized": "210thirdparties",
    "category": 8
  },
  {
    "normalized": "↓7dienste",
    "category": 0
  },
  {
    "normalized": "personalisiertewerbungundmessungvonwerbeleistung",
    "category": 0
  },
  {
    "normalized": "jetztdetailsansehen",
    "category": 0
  },
  {
    "normalized": "vertragspartner",
    "category": 0
  },
  {
    "normalized": "auswahlpersonalisierterwerbungmessungvonwerbeleistungundzielgruppenforschung",
    "category": 0
  },
  {
    "normalized": "personalisierteinhalteundmessungvoninhalten",
    "category": 0
  },
  {
    "normalized": "speicherungvonwebanalysedaten",
    "category": 0
  },
  {
    "normalized": "nichterlauben",
    "category": 2
  },
  {
    "normalized": "sachsen",
    "category": 0
  },
  {
    "normalized": "politikundverwaltung",
    "category": 0
  },
  {
    "normalized": "schriftgroßeanpassen",
    "category": 0
  },
  {
    "normalized": "kontrasterhohen",
    "category": 0
  },
  {
    "normalized": "animationenstoppen",
    "category": 0
  },
  {
    "normalized": "seitevorlesen",
    "category": 0
  },
  {
    "normalized": "odercookiesindividuelleinstellen",
    "category": 3
  },
  {
    "normalized": "detailsfindensieinunsererdatenschutzerklarung",
    "category": 0
  },
  {
    "normalized": "gratistesten",
    "category": 0
  },
  {
    "normalized": "siehabenbereitseinabohieranmelden",
    "category": 0
  },
  {
    "normalized": "allgemeinenutzungsbedingungen|",
    "category": 0
  },
  {
    "normalized": "szpersonalisierungundmarketing",
    "category": 0
  },
  {
    "normalized": "einbindungexternerinhalte",
    "category": 0
  },
  {
    "normalized": "selbstauswahlen",
    "category": 3
  },
  {
    "normalized": "angemessenheitsbeschlussdereukommission",
    "category": 0
  },
  {
    "normalized": "konfigurationansehen",
    "category": 8
  },
  {
    "normalized": "nurnotwendigefunktionscookiesakzeptieren",
    "category": 2
  },
  {
    "normalized": "analyseerlauben",
    "category": 1
  },
  {
    "normalized": "auswahlspeichernschließen",
    "category": 4
  },
  {
    "normalized": "jetztspielen",
    "category": 0
  },
  {
    "normalized": "einwilligungenspeichern",
    "category": 4
  },
  {
    "normalized": "werbefreifur399immonat",
    "category": 5
  },
  {
    "normalized": "einstellungenzumablehnenvoncookies",
    "category": 3
  },
  {
    "normalized": "annehmenundschließen",
    "category": 1
  },
  {
    "normalized": "agreeandcontinue",
    "category": 1
  },
  {
    "normalized": "subscribetozeitdepur",
    "category": 9
  },
  {
    "normalized": "loginpur",
    "category": 0
  },
  {
    "normalized": "yahoo",
    "category": 0
  },
  {
    "normalized": "erforderlichecookiesakzeptieren",
    "category": 2
  },
  {
    "normalized": "datenschutzeinstellungenanpassen",
    "category": 0
  },
  {
    "normalized": "sozialenetzwerkeundexterneinhalte",
    "category": 0
  },
  {
    "normalized": "pluskostenlostesten",
    "category": 0
  },
  {
    "normalized": "snowplow",
    "category": 0
  },
  {
    "normalized": "our183partners",
    "category": 0
  },
  {
    "normalized": "our173partners",
    "category": 8
  },
  {
    "normalized": "daad",
    "category": 0
  },
  {
    "normalized": "dritte",
    "category": 0
  },
  {
    "normalized": "nutzungsdatenverarbeitet",
    "category": 0
  },
  {
    "normalized": "drittlander",
    "category": 0
  },
  {
    "normalized": "okgerne",
    "category": 1
  },
  {
    "normalized": "impressumdatenschutz",
    "category": 0
  },
  {
    "normalized": "matomoanalysedienst",
    "category": 0
  },
  {
    "normalized": "settingseinstellungen",
    "category": 3
  },
  {
    "normalized": "datenschutzseite",
    "category": 0
  },
  {
    "normalized": "dannloggensiesicheinfachhierein",
    "category": 0
  },
  {
    "normalized": "abonnement",
    "category": 9
  },
  {
    "normalized": "funktionalanalytikwerbungnichtiabanbietersozialemedienundstrikterforderlichecookies",
    "category": 0
  },
  {
    "normalized": "ressourcen",
    "category": 0
  },
  {
    "normalized": "listederiabframeworkteilnehmer",
    "category": 8
  },
  {
    "normalized": "messungvonwerbeleistungundinhaltensowiezielgruppenforschung",
    "category": 0
  },
  {
    "normalized": "bittebeachtensiedasscookiesundanderetechnologienauchbeinutzungvonhazpurzumeinsatzkommensoweitdiesetechnischunbedingterforderlichsindumihnendaswebangebothazfehlerfreiundsicherzurverfugungstellenzukonnen",
    "category": 0
  },
  {
    "normalized": "erfahrensiemehr",
    "category": 0
  },
  {
    "normalized": "18298",
    "category": 8
  },
  {
    "normalized": "bittebeachtensiedasscookiesundanderetechnologienauchbeinutzungvonlvzpurzumeinsatzkommensoweitdiesetechnischunbedingterforderlichsindumihnendaswebangebotlvzfehlerfreiundsicherzurverfugungstellenzukonnen",
    "category": 0
  },
  {
    "normalized": "bittebeachtensiedasscookiesundanderetechnologienauchbeinutzungvonrndpurzumeinsatzkommensoweitdiesetechnischunbedingterforderlichsindumihnendaswebangebotrndfehlerfreiundsicherzurverfugungstellenzukonnen",
    "category": 0
  },
  {
    "normalized": "suchestarten",
    "category": 0
  },
  {
    "normalized": "cookiehinweis",
    "category": 0
  },
  {
    "normalized": "+ihreprivatsphare",
    "category": 0
  },
  {
    "normalized": "personalisierteanzeigeninhaltewerbetrackingundzugriffaufihrendgerat",
    "category": 0
  },
  {
    "normalized": "purfaq",
    "category": 0
  },
  {
    "normalized": "speichernvonoderzugriffaufinformationenaufeinemendgeratpersonalisiertewerbungundinhaltemessungvonwerbeleistungundderperformancevoninhaltenzielgruppenforschungsowieentwicklungundverbesserungvonangeboten",
    "category": 0
  },
  {
    "normalized": "technischnotwendig",
    "category": 9
  },
  {
    "normalized": "personalisiertewerbungundinhaltemessungvonwerbeleistungundderperformancevoninhaltensowiezielgruppenforschung",
    "category": 0
  },
  {
    "normalized": "university",
    "category": 0
  },
  {
    "normalized": "studying",
    "category": 0
  },
  {
    "normalized": "researchandteaching",
    "category": 0
  },
  {
    "normalized": "externevideoinhalte",
    "category": 0
  },
  {
    "normalized": "chatbotassistent",
    "category": 0
  },
  {
    "normalized": "werbungbasierendaufeinerreduziertenmengevondatenundmessungvonwerbeleistung",
    "category": 0
  },
  {
    "normalized": "personalisierteinhaltemessungvoninhaltenzielgruppenforschungundentwicklungvonangeboten",
    "category": 0
  },
  {
    "normalized": "1vulkanvegascasinomitbestemangebot",
    "category": 0
  },
  {
    "normalized": "11warumwahlenkundenvulkanvegas",
    "category": 0
  },
  {
    "normalized": "12wiefangeichanzuspielen",
    "category": 0
  },
  {
    "normalized": "13wiekannmansichaufvulkanvegasanmelden",
    "category": 0
  },
  {
    "normalized": "14kannicheinigepersonlichendatenandern",
    "category": 0
  },
  {
    "normalized": "15wieandereichmeinpasswort",
    "category": 0
  },
  {
    "normalized": "17hatvulkanvegasbonuscodeoderpromocode",
    "category": 0
  },
  {
    "normalized": "18wievielsollmanmindestenseinzahlen",
    "category": 0
  },
  {
    "normalized": "skinumschalten",
    "category": 0
  },
  {
    "normalized": "technicallynecessary",
    "category": 8
  },
  {
    "normalized": "personalisedcontentcontentmeasurementaudienceresearchandservicesdevelopment",
    "category": 0
  },
  {
    "normalized": "personalisedadvertisingandadvertisingmeasurement",
    "category": 0
  },
  {
    "normalized": "unbedingterforderlichecookies",
    "category": 0
  },
  {
    "normalized": "analysecookiesanalysespeicherung",
    "category": 0
  },
  {
    "normalized": "rubriken",
    "category": 0
  },
  {
    "normalized": "meinzdf",
    "category": 0
  },
  {
    "normalized": "existingpursubscription",
    "category": 0
  },
  {
    "normalized": "purabofaq",
    "category": 0
  },
  {
    "normalized": "alleenfunctionelecookies",
    "category": 2
  },
  {
    "normalized": "preciezegeolocatiegegevensenidentificatieviahetscannenvanapparaten",
    "category": 0
  },
  {
    "normalized": "bekijkonze105partners",
    "category": 8
  },
  {
    "normalized": "sluit",
    "category": 8
  },
  {
    "normalized": "deapparaatkenmerkenactiefscannenteridentificatie",
    "category": 0
  },
  {
    "normalized": "lieverniet",
    "category": 2
  },
  {
    "normalized": "64derdepartijen",
    "category": 8
  },
  {
    "normalized": "voorkeurenwijzigen",
    "category": 3
  },
  {
    "normalized": "derdepartijenlijst",
    "category": 8
  },
  {
    "normalized": "300tcfleveranciersen511advertentiepartners",
    "category": 8
  },
  {
    "normalized": "gepersonaliseerdeadvertentiesencontentadvertentieencontentmetingendoelgroepenonderzoekenontwikkelingvandiensten",
    "category": 0
  },
  {
    "normalized": "opslaan",
    "category": 4
  },
  {
    "normalized": "weigernietessentielecookies",
    "category": 2
  },
  {
    "normalized": "japrima",
    "category": 1
  },
  {
    "normalized": "125thirdparties",
    "category": 8
  },
  {
    "normalized": "viewour71partners",
    "category": 8
  },
  {
    "normalized": "bekijkvoorkeuren",
    "category": 3
  },
  {
    "normalized": "426thirdparties",
    "category": 8
  },
  {
    "normalized": "acceptiam24+",
    "category": 9
  },
  {
    "normalized": "acceptiamunder24",
    "category": 9
  },
  {
    "normalized": "513thirdparties",
    "category": 8
  },
  {
    "normalized": "137tcfleveranciersen62advertentiepartners",
    "category": 8
  },
  {
    "normalized": "wijzigen",
    "category": 3
  },
  {
    "normalized": "detailstonenenzelfaanpassen",
    "category": 3
  },
  {
    "normalized": "allecookiesafwijzen",
    "category": 2
  },
  {
    "normalized": "507thirdparties",
    "category": 8
  },
  {
    "normalized": "functioneleanalytischeadvertentienietiableveranciersensocialemediacookies",
    "category": 0
  },
  {
    "normalized": "linknaariableveranciers",
    "category": 0
  },
  {
    "normalized": "weigerallecookies",
    "category": 2
  },
  {
    "normalized": "bekijkonze827partners",
    "category": 8
  },
  {
    "normalized": "comfortabel",
    "category": 9
  },
  {
    "normalized": "hierkanjejecookieszelfinstellen",
    "category": 3
  },
  {
    "normalized": "minimaal",
    "category": 9
  },
  {
    "normalized": "onzeoplossingen",
    "category": 0
  },
  {
    "normalized": "overons",
    "category": 0
  },
  {
    "normalized": "nieuwstrainingen",
    "category": 0
  },
  {
    "normalized": "aanvullendecookiesweigeren",
    "category": 2
  },
  {
    "normalized": "nopersonalcookiesplease",
    "category": 2
  },
  {
    "normalized": "akkoordikben24+",
    "category": 9
  },
  {
    "normalized": "akkoordikbenonder24",
    "category": 9
  },
  {
    "normalized": "jacookiesaccepteren",
    "category": 1
  },
  {
    "normalized": "anderewebsites",
    "category": 0
  },
  {
    "normalized": "advertentievrijvoor399permaand",
    "category": 5
  },
  {
    "normalized": "loginmetcontentpass",
    "category": 5
  },
  {
    "normalized": "704partners",
    "category": 8
  },
  {
    "normalized": "lijstmetpartners",
    "category": 8
  },
  {
    "normalized": "prestatiecookies",
    "category": 9
  },
  {
    "normalized": "advertentiesvooronlinegokken",
    "category": 0
  },
  {
    "normalized": "advertising",
    "category": 0
  },
  {
    "normalized": "stelmijnvoorkeurin",
    "category": 3
  },
  {
    "normalized": "bekijkonze99partners",
    "category": 8
  },
  {
    "normalized": "accepteeralleennoodzakelijke",
    "category": 2
  },
  {
    "normalized": "ikbenouderdan24",
    "category": 9
  },
  {
    "normalized": "ikbenjongerdan24",
    "category": 9
  },
  {
    "normalized": "allesaanvaarden",
    "category": 1
  },
  {
    "normalized": "openvoorkeuren",
    "category": 3
  },
  {
    "normalized": "configureren",
    "category": 3
  },
  {
    "normalized": "zoek",
    "category": 0
  },
  {
    "normalized": "howdataisused",
    "category": 0
  },
  {
    "normalized": "advendors",
    "category": 0
  },
  {
    "normalized": "gamblingoptin",
    "category": 0
  },
  {
    "normalized": "juridischeinformatie",
    "category": 0
  },
  {
    "normalized": "prima",
    "category": 1
  },
  {
    "normalized": "alleenfunctionelecookiesaccepteren",
    "category": 2
  },
  {
    "normalized": "our33partners",
    "category": 8
  },
  {
    "normalized": "nsnlcookiebeleid",
    "category": 0
  },
  {
    "normalized": "schoenen",
    "category": 0
  },
  {
    "normalized": "kleding",
    "category": 0
  },
  {
    "normalized": "tassenaccessoires",
    "category": 0
  },
  {
    "normalized": "nieuw",
    "category": 0
  },
  {
    "normalized": "looks",
    "category": 0
  },
  {
    "normalized": "bekijkonzepartners",
    "category": 8
  },
  {
    "normalized": "supportzoekenicoon",
    "category": 0
  },
  {
    "normalized": "producten",
    "category": 0
  },
  {
    "normalized": "huishoudelijkeartikelen",
    "category": 0
  },
  {
    "normalized": "persoonlijkeverzorging",
    "category": 0
  },
  {
    "normalized": "beeldengeluid",
    "category": 0
  },
  {
    "normalized": "verzorgingvoormoederenkind",
    "category": 0
  },
  {
    "normalized": "verlichting",
    "category": 0
  },
  {
    "normalized": "onderdelenenaccessoires",
    "category": 0
  },
  {
    "normalized": "gezondheid",
    "category": 0
  },
  {
    "normalized": "autoverlichting",
    "category": 0
  },
  {
    "normalized": "acties",
    "category": 0
  },
  {
    "normalized": "megamazzeldagen",
    "category": 0
  },
  {
    "normalized": "privacyencookieverklaringen",
    "category": 0
  },
  {
    "normalized": "cookieswijzigen",
    "category": 3
  },
  {
    "normalized": "navigatiesluiten",
    "category": 9
  },
  {
    "normalized": "slimmeoplossingen",
    "category": 0
  },
  {
    "normalized": "hiervindjeonsprivacyreglement",
    "category": 0
  },
  {
    "normalized": "toonbettingadvertenties",
    "category": 0
  },
  {
    "normalized": "gepersonaliseerdecontentcontentmetingenendoelgroepenonderzoek",
    "category": 0
  },
  {
    "normalized": "profielengebruikenvoordeselectievangepersonaliseerdeadvertenties",
    "category": 0
  },
  {
    "normalized": "dienstenontwikkelenenverbeteren",
    "category": 0
  },
  {
    "normalized": "beperktegegevensgebruikenomcontentteselecteren",
    "category": 0
  },
  {
    "normalized": "advertentiesopbasisvanbeperktegegevensgepersonaliseerdadvertentieprofielenadvertentiemetingen",
    "category": 0
  },
  {
    "normalized": "meerinformatieenaanpassen",
    "category": 3
  },
  {
    "normalized": "whatarecookies",
    "category": 0
  },
  {
    "normalized": "123partners",
    "category": 8
  },
  {
    "normalized": "personalisatie",
    "category": 9
  },
  {
    "normalized": "leesookonscookiebeleid",
    "category": 0
  },
  {
    "normalized": "bekijkonscookiebeleid",
    "category": 0
  },
  {
    "normalized": "→neeweigercookies",
    "category": 2
  },
  {
    "normalized": "beheermijnkeuzes",
    "category": 3
  },
  {
    "normalized": "mijnxel",
    "category": 0
  },
  {
    "normalized": "domeinregistratie",
    "category": 0
  },
  {
    "normalized": "academy",
    "category": 0
  },
  {
    "normalized": "achterxel",
    "category": 0
  },
  {
    "normalized": "zakelijk",
    "category": 0
  },
  {
    "normalized": "cerisemedia",
    "category": 0
  },
  {
    "normalized": "ouijesuisdaccord",
    "category": 1
  },
  {
    "normalized": "pourensavoirplussurfirstidetvosdroits",
    "category": 0
  },
  {
    "normalized": "espacedeconfidentialite",
    "category": 0
  },
  {
    "normalized": "voirnos352partenaires",
    "category": 8
  },
  {
    "normalized": "accesrapide",
    "category": 0
  },
  {
    "normalized": "compteprismaconnect",
    "category": 0
  },
  {
    "normalized": "refuseretsabonner199pouruneexperiencesanspub→",
    "category": 5
  },
  {
    "normalized": "refuserlescookiesetsabonner",
    "category": 5
  },
  {
    "normalized": "voirnos155partenaires",
    "category": 8
  },
  {
    "normalized": "allocataires",
    "category": 0
  },
  {
    "normalized": "macaf",
    "category": 0
  },
  {
    "normalized": "enseignements",
    "category": 0
  },
  {
    "normalized": "politiqueeducative",
    "category": 0
  },
  {
    "normalized": "rechercherdanslesite",
    "category": 0
  },
  {
    "normalized": "continuersansaccepter→refuseretsabonner",
    "category": 8
  },
  {
    "normalized": "jedesactivelesfinalitesnonessentielles",
    "category": 2
  },
  {
    "normalized": "283partenaires",
    "category": 8
  },
  {
    "normalized": "vousetes",
    "category": 0
  },
  {
    "normalized": "academie",
    "category": 0
  },
  {
    "normalized": "utiliserdesprofilspourselectionnerdespublicitespersonnalisees",
    "category": 0
  },
  {
    "normalized": "jindiqueraimoncodepostaluneautrefois",
    "category": 0
  },
  {
    "normalized": "nousrejoindre",
    "category": 0
  },
  {
    "normalized": "rechercherdesvoyages",
    "category": 0
  },
  {
    "normalized": "parametresdaffichage",
    "category": 3
  },
  {
    "normalized": "politiquesprioritaires",
    "category": 0
  },
  {
    "normalized": "aproposdugouvernement",
    "category": 0
  },
  {
    "normalized": "continuersansaccepter→continuersansaccepter",
    "category": 2
  },
  {
    "normalized": "classement",
    "category": 0
  },
  {
    "normalized": "instituts",
    "category": 0
  },
  {
    "normalized": "servicesuniversitaires",
    "category": 0
  },
  {
    "normalized": "admission",
    "category": 0
  },
  {
    "normalized": "voirnos585partenaires",
    "category": 8
  },
  {
    "normalized": "accesdirect",
    "category": 9
  },
  {
    "normalized": "bloquertouslescookies",
    "category": 2
  },
  {
    "normalized": "ouiaccepter",
    "category": 1
  },
  {
    "normalized": "choisirvosparametres",
    "category": 3
  },
  {
    "normalized": "utiliserdesdonneeslimiteespourselectionnerlapublicite",
    "category": 0
  },
  {
    "normalized": "creerdesprofilspourlapublicitepersonnalisee",
    "category": 0
  },
  {
    "normalized": "voirnos19partenaires",
    "category": 8
  },
  {
    "normalized": "versioncontrastee",
    "category": 0
  },
  {
    "normalized": "aidesetdemarches",
    "category": 0
  },
  {
    "normalized": "lemagazineviesdefamille",
    "category": 0
  },
  {
    "normalized": "continuersansaccepter→refuser>",
    "category": 2
  },
  {
    "normalized": "modifiermespreferences",
    "category": 3
  },
  {
    "normalized": "voirnos806partenaires",
    "category": 8
  },
  {
    "normalized": "nos274partenaires",
    "category": 8
  },
  {
    "normalized": "interdire",
    "category": 2
  },
  {
    "normalized": "autoriserlaselection",
    "category": 4
  },
  {
    "normalized": "voirnos262partenaires",
    "category": 8
  },
  {
    "normalized": "obtenirlappli",
    "category": 0
  },
  {
    "normalized": "nonajuster",
    "category": 3
  },
  {
    "normalized": "voirnos144partenaires",
    "category": 8
  },
  {
    "normalized": "selectionnerlescookies",
    "category": 3
  },
  {
    "normalized": "aquoiserventlescookies",
    "category": 0
  },
  {
    "normalized": "jesuisdaccord",
    "category": 1
  },
  {
    "normalized": "ensavoirplussurlescookies",
    "category": 0
  },
  {
    "normalized": "apprendreetcomprendre",
    "category": 0
  },
  {
    "normalized": "nousconnaitre",
    "category": 0
  },
  {
    "normalized": "collaboreravecnous",
    "category": 0
  },
  {
    "normalized": "europeinternational",
    "category": 0
  },
  {
    "normalized": "rejetertouslescookies",
    "category": 2
  },
  {
    "normalized": "conseilsdevoyage",
    "category": 0
  },
  {
    "normalized": "volsdirects",
    "category": 0
  },
  {
    "normalized": "meilleurmomentpourvoyager",
    "category": 0
  },
  {
    "normalized": "commentaires",
    "category": 0
  },
  {
    "normalized": "preferencesdeconfidentialite",
    "category": 0
  },
  {
    "normalized": "trips",
    "category": 0
  },
  {
    "normalized": "selectionnerlesobjectifsindividuels",
    "category": 0
  },
  {
    "normalized": "our342partners",
    "category": 8
  },
  {
    "normalized": "actulocale",
    "category": 0
  },
  {
    "normalized": "refuseandsubscribefor099>",
    "category": 5
  },
  {
    "normalized": "jedonnemonconsentement",
    "category": 1
  },
  {
    "normalized": "jemabonnepour099",
    "category": 5
  },
  {
    "normalized": "jemeconnecte",
    "category": 9
  },
  {
    "normalized": "areyousubscribelogin",
    "category": 0
  },
  {
    "normalized": "our81partners",
    "category": 0
  },
  {
    "normalized": "our818partners",
    "category": 8
  },
  {
    "normalized": "disagreeclose",
    "category": 2
  },
  {
    "normalized": "leurs241partenaires",
    "category": 8
  },
  {
    "normalized": "disagreeandcreateaccount",
    "category": 8
  },
  {
    "normalized": "vousetesabonneeconnectezvous",
    "category": 8
  },
  {
    "normalized": "refuseallexcepttechnicalcookies",
    "category": 2
  },
  {
    "normalized": "primaire",
    "category": 0
  },
  {
    "normalized": "college",
    "category": 0
  },
  {
    "normalized": "lycee",
    "category": 0
  },
  {
    "normalized": "fermerlafenetredinformationsurleslumniz",
    "category": 0
  },
  {
    "normalized": "our291partners",
    "category": 8
  },
  {
    "normalized": "voirnos729partenaires",
    "category": 8
  },
  {
    "normalized": "affichernos310partenaires",
    "category": 8
  },
  {
    "normalized": "nos140partenaires",
    "category": 8
  },
  {
    "normalized": "voirnos57partenaires",
    "category": 8
  },
  {
    "normalized": "voirnos289partenaires",
    "category": 8
  },
  {
    "normalized": "poursuivresansaccepter",
    "category": 2
  },
  {
    "normalized": "voirnos310partenaires",
    "category": 8
  },
  {
    "normalized": "personnaliserlesparametres",
    "category": 3
  },
  {
    "normalized": "voirnos734partenaires",
    "category": 8
  },
  {
    "normalized": "nos839partenaires",
    "category": 8
  },
  {
    "normalized": "afficherlarechercher",
    "category": 0
  },
  {
    "normalized": "undefined",
    "category": 0
  },
  {
    "normalized": "voirnos423partenaires",
    "category": 8
  },
  {
    "normalized": "declineclose",
    "category": 2
  },
  {
    "normalized": "137partners",
    "category": 8
  },
  {
    "normalized": "our198partners",
    "category": 8
  },
  {
    "normalized": "300autressitesweb",
    "category": 0
  },
  {
    "normalized": "sanspublicitepour399mois",
    "category": 5
  },
  {
    "normalized": "connectezvousici",
    "category": 0
  },
  {
    "normalized": "128partenaires",
    "category": 8
  },
  {
    "normalized": "appsentconnexion",
    "category": 0
  },
  {
    "normalized": "ses124societestierces",
    "category": 8
  },
  {
    "normalized": "nacceptezquelenecessaire",
    "category": 2
  },
  {
    "normalized": "scolariteetudesexamens",
    "category": 0
  },
  {
    "normalized": "metiersressourceshumainesconcours",
    "category": 0
  },
  {
    "normalized": "academiedegrenoble",
    "category": 0
  },
  {
    "normalized": "examens",
    "category": 0
  },
  {
    "normalized": "scolariteorientationetudes",
    "category": 0
  },
  {
    "normalized": "recrutementcarrieremetiers",
    "category": 0
  },
  {
    "normalized": "scolariteetudes",
    "category": 0
  },
  {
    "normalized": "concoursmetiersrh",
    "category": 0
  },
  {
    "normalized": ">refuseretchoisirleservice2parmoispouruneexperiencesanspublicitepersonnaliseecontinuersansaccepter→",
    "category": 5
  },
  {
    "normalized": "voirlesconditionsdeloffre",
    "category": 0
  },
  {
    "normalized": "ses821partenairesdont806partenairesiab",
    "category": 8
  },
  {
    "normalized": "nos47partenaires",
    "category": 8
  },
  {
    "normalized": "refuseretsabonnerapartirde1→",
    "category": 5
  },
  {
    "normalized": "gestiondesparametres",
    "category": 3
  },
  {
    "normalized": "espacepersonnel",
    "category": 0
  },
  {
    "normalized": "valider",
    "category": 9
  },
  {
    "normalized": "our12partners",
    "category": 8
  },
  {
    "normalized": "politiquedeprotectiondesdonnees",
    "category": 0
  },
  {
    "normalized": "actusetagenda",
    "category": 0
  },
  {
    "normalized": "lecnes",
    "category": 0
  },
  {
    "normalized": "sinformersurlespace",
    "category": 0
  },
  {
    "normalized": "espacesprofessionnels",
    "category": 0
  },
  {
    "normalized": "206partenaires",
    "category": 8
  },
  {
    "normalized": "ensavoirplussurlescookiesettechnologiessimilaires",
    "category": 0
  },
  {
    "normalized": "moncarnetderecettes",
    "category": 0
  },
  {
    "normalized": "toutrefuseretfermercontinuersansaccepter→",
    "category": 2
  },
  {
    "normalized": "nos38partenaires",
    "category": 8
  },
  {
    "normalized": "affichernos38partenaires",
    "category": 8
  },
  {
    "normalized": "skiptomaincontent",
    "category": 9
  },
  {
    "normalized": "continuersansacceptercontinuersansaccepter→",
    "category": 2
  },
  {
    "normalized": "our45partners",
    "category": 8
  },
  {
    "normalized": "franceinfo",
    "category": 0
  },
  {
    "normalized": "francetv",
    "category": 0
  },
  {
    "normalized": "radiofrance",
    "category": 0
  },
  {
    "normalized": "accueilfranceinfo",
    "category": 0
  },
  {
    "normalized": "emissions",
    "category": 0
  },
  {
    "normalized": "rechercheruneactualite",
    "category": 0
  },
  {
    "normalized": "vraioufaux",
    "category": 0
  },
  {
    "normalized": "ecoconso",
    "category": 0
  },
  {
    "normalized": "monde",
    "category": 0
  },
  {
    "normalized": "lactupourlesjeunes",
    "category": 0
  },
  {
    "normalized": "uneinfotransparente",
    "category": 0
  },
  {
    "normalized": "lelive",
    "category": 0
  },
  {
    "normalized": "nos197partenaires",
    "category": 8
  },
  {
    "normalized": "questcequuncookie",
    "category": 0
  },
  {
    "normalized": "pourquoilehuffingtonpostvousdemandedaccepterlescookiespouraccederausite",
    "category": 0
  },
  {
    "normalized": "nos63partenaires",
    "category": 8
  },
  {
    "normalized": "parametresdaccessibilite",
    "category": 0
  },
  {
    "normalized": "portalsmenu",
    "category": 0
  },
  {
    "normalized": "agenda",
    "category": 0
  },
  {
    "normalized": "repereslewebzine",
    "category": 0
  },
  {
    "normalized": "presse",
    "category": 0
  },
  {
    "normalized": "atlasdescartesdelanthropocene",
    "category": 0
  },
  {
    "normalized": "cartesign",
    "category": 0
  },
  {
    "normalized": "hebergements",
    "category": 0
  },
  {
    "normalized": "voitures",
    "category": 0
  },
  {
    "normalized": "vol+hotel",
    "category": 0
  },
  {
    "normalized": "our1130partners",
    "category": 8
  },
  {
    "normalized": "cookiesbaliseswebetautrestechnologiesliberationliberationfr",
    "category": 0
  },
  {
    "normalized": "traceurs",
    "category": 8
  },
  {
    "normalized": "pourtinscrirealanewslettercestparici",
    "category": 0
  },
  {
    "normalized": "jecreemoncompte",
    "category": 0
  },
  {
    "normalized": "jaidejauncompte",
    "category": 0
  },
  {
    "normalized": "logement",
    "category": 0
  },
  {
    "normalized": "electionseuropeennes",
    "category": 0
  },
  {
    "normalized": "guerreauprocheorient",
    "category": 0
  },
  {
    "normalized": "listedenospartenaires",
    "category": 0
  },
  {
    "normalized": "activermonespacesante",
    "category": 0
  },
  {
    "normalized": "programmation",
    "category": 0
  },
  {
    "normalized": "billetterie",
    "category": 0
  },
  {
    "normalized": "visites",
    "category": 0
  },
  {
    "normalized": "jeunes",
    "category": 0
  },
  {
    "normalized": "infospratiques",
    "category": 0
  },
  {
    "normalized": "lopera",
    "category": 0
  },
  {
    "normalized": "ses813partenairesdont806partenairesiab",
    "category": 8
  },
  {
    "normalized": "affichernos227partenaires",
    "category": 8
  },
  {
    "normalized": "nos846partenaires",
    "category": 8
  },
  {
    "normalized": "lagalaxiesenat",
    "category": 0
  },
  {
    "normalized": "langues",
    "category": 0
  },
  {
    "normalized": "travauxparlementaires",
    "category": 0
  },
  {
    "normalized": "vossenateurs",
    "category": 0
  },
  {
    "normalized": "connaitrelesenat",
    "category": 0
  },
  {
    "normalized": "lesenatetvous",
    "category": 0
  },
  {
    "normalized": "europeetinternational",
    "category": 0
  },
  {
    "normalized": "ouvrirlarecherche",
    "category": 0
  },
  {
    "normalized": "our189partners",
    "category": 8
  },
  {
    "normalized": "refuserlescookiesnonessentiels",
    "category": 2
  },
  {
    "normalized": "refuseretsabonner",
    "category": 5
  },
  {
    "normalized": "pourquoiteleramavousdemandedaccepterlescookies",
    "category": 0
  },
  {
    "normalized": "publicitesbaseessurdesdonneeslimiteesprofildepublicitespersonnaliseesetmesuredeperformancedespublicites",
    "category": 0
  },
  {
    "normalized": "contenupersonnalisemesuredeperformanceducontenuetetudesdaudience",
    "category": 0
  },
  {
    "normalized": "developperetameliorerlesservices",
    "category": 0
  },
  {
    "normalized": "analyseractivementlescaracteristiquesdelappareilpourlidentification",
    "category": 0
  },
  {
    "normalized": "declarationrelativealaprotectiondesdonnees",
    "category": 0
  },
  {
    "normalized": "viedecampus",
    "category": 0
  },
  {
    "normalized": "afficherplus",
    "category": 0
  },
  {
    "normalized": "ensavoirplussurnotrepolitiquedeprotectiondesdonneespersonnelles",
    "category": 0
  },
  {
    "normalized": "indispensableuniquement",
    "category": 0
  },
  {
    "normalized": "gestiondemeschoix",
    "category": 3
  },
  {
    "normalized": "voirlespreferences",
    "category": 3
  },
  {
    "normalized": "its71iabpartnersandits12otherpartners",
    "category": 8
  },
  {
    "normalized": "managemysettings",
    "category": 3
  },
  {
    "normalized": "necessarycookiesonly",
    "category": 2
  },
  {
    "normalized": "disableall",
    "category": 2
  },
  {
    "normalized": "saveandclose",
    "category": 4
  },
  {
    "normalized": "iabcertifiedvendors",
    "category": 8
  },
  {
    "normalized": "taispeainsonrai",
    "category": 8
  },
  {
    "normalized": "adjustmypreferences",
    "category": 3
  },
  {
    "normalized": "viewpreferences",
    "category": 3
  },
  {
    "normalized": "rejectalloptionalcookies",
    "category": 2
  },
  {
    "normalized": "customisesettingsdisableallallowall",
    "category": 8
  },
  {
    "normalized": "idonotacceptcookies",
    "category": 2
  },
  {
    "normalized": "viewour198partners",
    "category": 8
  },
  {
    "normalized": "usestrictlynecessaryonly",
    "category": 2
  },
  {
    "normalized": "cookiessettingsrejectallcookiesacceptallcookies",
    "category": 8
  },
  {
    "normalized": "privacycookiepolicy",
    "category": 0
  },
  {
    "normalized": "performanceandfunctionalcookies",
    "category": 0
  },
  {
    "normalized": "iacceptallnonnecessarycookieswillbeturnedon",
    "category": 1
  },
  {
    "normalized": "irejectallnonnecessarycookieswillbeturnedoff",
    "category": 2
  },
  {
    "normalized": "rejectalloptional",
    "category": 2
  },
  {
    "normalized": "signupwithgoogle",
    "category": 0
  },
  {
    "normalized": "savemycookiechoicesandclose",
    "category": 4
  },
  {
    "normalized": "riachtanach",
    "category": 8
  },
  {
    "normalized": "sainroghanna",
    "category": 9
  },
  {
    "normalized": "staitistici",
    "category": 9
  },
  {
    "normalized": "margaiocht",
    "category": 0
  },
  {
    "normalized": "fianainriachtanachaamhain",
    "category": 2
  },
  {
    "normalized": "ceadaighroghnu",
    "category": 4
  },
  {
    "normalized": "ceadaighgachfianan",
    "category": 1
  },
  {
    "normalized": "viewour442partners",
    "category": 8
  },
  {
    "normalized": "approve",
    "category": 1
  },
  {
    "normalized": "managemycookiesettings",
    "category": 3
  },
  {
    "normalized": "declineadvertisingcookies",
    "category": 2
  },
  {
    "normalized": "menuitemseparator",
    "category": 0
  },
  {
    "normalized": "mycookiepreferences",
    "category": 3
  },
  {
    "normalized": "booknow",
    "category": 0
  },
  {
    "normalized": "dismissthismessage",
    "category": 8
  },
  {
    "normalized": "manageyourcookiesettings",
    "category": 3
  },
  {
    "normalized": "updatepreferences",
    "category": 3
  },
  {
    "normalized": "viewour39partners",
    "category": 0
  },
  {
    "normalized": "viewour37partners",
    "category": 8
  },
  {
    "normalized": "allowselectiontickbelow",
    "category": 4
  },
  {
    "normalized": "howdoichangemycookiesettings",
    "category": 0
  },
  {
    "normalized": "companies",
    "category": 0
  },
  {
    "normalized": "salaries",
    "category": 0
  },
  {
    "normalized": "foremployers",
    "category": 0
  },
  {
    "normalized": "happywithcookies",
    "category": 1
  },
  {
    "normalized": "showcookiedetails",
    "category": 0
  },
  {
    "normalized": "travelrestrictions",
    "category": 0
  },
  {
    "normalized": "privacypreferences",
    "category": 3
  },
  {
    "normalized": "selectindividualpurposes",
    "category": 3
  },
  {
    "normalized": "gotodeals",
    "category": 0
  },
  {
    "normalized": "onlystrictlynecessary",
    "category": 2
  },
  {
    "normalized": "saveclose",
    "category": 4
  },
  {
    "normalized": "onlyacceptstrictlynecessary",
    "category": 2
  },
  {
    "normalized": "acceptstrictlynecessary",
    "category": 2
  },
  {
    "normalized": "restricteduse",
    "category": 8
  },
  {
    "normalized": "newsevents",
    "category": 0
  },
  {
    "normalized": "researchprogrammes",
    "category": 0
  },
  {
    "normalized": "publications",
    "category": 0
  },
  {
    "normalized": "membership",
    "category": 0
  },
  {
    "normalized": "committees",
    "category": 0
  },
  {
    "normalized": "policyinternational",
    "category": 0
  },
  {
    "normalized": "grantsawards",
    "category": 0
  },
  {
    "normalized": "youngacademyireland",
    "category": 0
  },
  {
    "normalized": "supportus",
    "category": 0
  },
  {
    "normalized": "0items",
    "category": 0
  },
  {
    "normalized": "spreadshirtie",
    "category": 0
  },
  {
    "normalized": "spreadshirtdk",
    "category": 0
  },
  {
    "normalized": "legalinformation",
    "category": 0
  },
  {
    "normalized": "adjustcookiesettings",
    "category": 3
  },
  {
    "normalized": "manageyourconfiguration",
    "category": 3
  },
  {
    "normalized": "nothankyouclose",
    "category": 2
  },
  {
    "normalized": "viewcookiepolicy",
    "category": 0
  },
  {
    "normalized": "yesacceptall",
    "category": 1
  },
  {
    "normalized": "managepreferencescookies",
    "category": 3
  },
  {
    "normalized": "listofvendors",
    "category": 0
  },
  {
    "normalized": "norejectall",
    "category": 2
  },
  {
    "normalized": "takemetothecookiesettings",
    "category": 3
  },
  {
    "normalized": "info",
    "category": 0
  },
  {
    "normalized": "continueandallowallcookies",
    "category": 1
  },
  {
    "normalized": "manualsetting",
    "category": 3
  },
  {
    "normalized": "useyourcurrentlocation",
    "category": 0
  },
  {
    "normalized": "parents",
    "category": 0
  },
  {
    "normalized": "teachers",
    "category": 0
  },
  {
    "normalized": "appexclusivecouponsforyou",
    "category": 0
  },
  {
    "normalized": "myallianz",
    "category": 0
  },
  {
    "normalized": "claims",
    "category": 0
  },
  {
    "normalized": "documents",
    "category": 0
  },
  {
    "normalized": "underinsurance",
    "category": 0
  },
  {
    "normalized": "thestore",
    "category": 0
  },
  {
    "normalized": "shoppingonline",
    "category": 0
  },
  {
    "normalized": "sustainability",
    "category": 0
  },
  {
    "normalized": "aboutarnotts",
    "category": 0
  },
  {
    "normalized": "projects",
    "category": 0
  },
  {
    "normalized": "policy",
    "category": 0
  },
  {
    "normalized": "donate",
    "category": 0
  },
  {
    "normalized": "okiunderstand",
    "category": 1
  },
  {
    "normalized": "privacypolicyanddisclaimer",
    "category": 0
  },
  {
    "normalized": "aboutthistool",
    "category": 0
  },
  {
    "normalized": "whatson",
    "category": 0
  },
  {
    "normalized": "members",
    "category": 0
  },
  {
    "normalized": "dcciacademy",
    "category": 0
  },
  {
    "normalized": "readmoreandmanagesettings",
    "category": 3
  },
  {
    "normalized": "learnmoreandcustomise",
    "category": 3
  },
  {
    "normalized": "managecookieconsent",
    "category": 3
  },
  {
    "normalized": "helpfromaslittleas199permonth",
    "category": 8
  },
  {
    "normalized": "dontshowagain",
    "category": 0
  },
  {
    "normalized": "remindmelater",
    "category": 0
  },
  {
    "normalized": "customisemycookies",
    "category": 3
  },
  {
    "normalized": "merch",
    "category": 0
  },
  {
    "normalized": "ourprivacypolicy",
    "category": 0
  },
  {
    "normalized": "+reviewouruseofcookiesandsetyourpreferences",
    "category": 0
  },
  {
    "normalized": "noidontaccept",
    "category": 2
  },
  {
    "normalized": "dataprotectionpolicies",
    "category": 0
  },
  {
    "normalized": "cookiepolicypage",
    "category": 0
  },
  {
    "normalized": "ieenglish",
    "category": 0
  },
  {
    "normalized": "gaeilge",
    "category": 0
  },
  {
    "normalized": "startselling",
    "category": 0
  },
  {
    "normalized": "createnow",
    "category": 0
  },
  {
    "normalized": "tshirts",
    "category": 0
  },
  {
    "normalized": "hoodiessweatshirts",
    "category": 0
  },
  {
    "normalized": "aprons",
    "category": 0
  },
  {
    "normalized": "babyclothing",
    "category": 0
  },
  {
    "normalized": "mugs",
    "category": 0
  },
  {
    "normalized": "capshats",
    "category": 0
  },
  {
    "normalized": "sweatshirts",
    "category": 0
  },
  {
    "normalized": "ormacookiesettingsorma",
    "category": 0
  },
  {
    "normalized": "ormarejectallcookiesorma",
    "category": 2
  },
  {
    "normalized": "ormaacceptallcookiesorma",
    "category": 1
  },
  {
    "normalized": "thisismyfirstvisit",
    "category": 0
  },
  {
    "normalized": "everyday",
    "category": 0
  },
  {
    "normalized": "everyweek",
    "category": 0
  },
  {
    "normalized": "everymonth",
    "category": 0
  },
  {
    "normalized": "lessoften",
    "category": 0
  },
  {
    "normalized": "youth",
    "category": 0
  },
  {
    "normalized": "saferinternetday",
    "category": 0
  },
  {
    "normalized": "getresources",
    "category": 0
  },
  {
    "normalized": "teens",
    "category": 0
  },
  {
    "normalized": "guce",
    "category": 0
  },
  {
    "normalized": "1407partners",
    "category": 8
  },
  {
    "normalized": "543partner",
    "category": 8
  },
  {
    "normalized": "accettaecontinua",
    "category": 1
  },
  {
    "normalized": "nostri1394partner",
    "category": 8
  },
  {
    "normalized": "gestioneconsensi",
    "category": 3
  },
  {
    "normalized": "informazionisuicookie",
    "category": 0
  },
  {
    "normalized": "inostri856partner",
    "category": 8
  },
  {
    "normalized": "piuinformazioni",
    "category": 0
  },
  {
    "normalized": "1366partners",
    "category": 8
  },
  {
    "normalized": "archiviareinformazionisudispositivoeoaccedervi",
    "category": 0
  },
  {
    "normalized": "impostaicookies",
    "category": 3
  },
  {
    "normalized": "negatutti",
    "category": 2
  },
  {
    "normalized": "dettagli",
    "category": 8
  },
  {
    "normalized": "accettasoloiselezionati",
    "category": 4
  },
  {
    "normalized": "1375",
    "category": 8
  },
  {
    "normalized": "altreopzioni",
    "category": 3
  },
  {
    "normalized": "notelegali",
    "category": 0
  },
  {
    "normalized": "sevuoipuoinonaccettare",
    "category": 2
  },
  {
    "normalized": "chiudierifiutatutto",
    "category": 2
  },
  {
    "normalized": "bloccaicookienonessenziali",
    "category": 2
  },
  {
    "normalized": "tilladkunnødvendigecookies",
    "category": 2
  },
  {
    "normalized": "pecspid",
    "category": 0
  },
  {
    "normalized": "webmarketing",
    "category": 0
  },
  {
    "normalized": "rejectdenyall",
    "category": 2
  },
  {
    "normalized": "accettailtracciamento",
    "category": 1
  },
  {
    "normalized": "gestisciiltracciamento",
    "category": 3
  },
  {
    "normalized": "accettaicookienecessari",
    "category": 2
  },
  {
    "normalized": "gestisciituoicookie",
    "category": 9
  },
  {
    "normalized": "1394partner",
    "category": 8
  },
  {
    "normalized": "proseguigratis",
    "category": 1
  },
  {
    "normalized": "chiudirifiutatuttiicookie",
    "category": 2
  },
  {
    "normalized": "inostri10partner",
    "category": 8
  },
  {
    "normalized": "rifiutaesostienici",
    "category": 5
  },
  {
    "normalized": "padel",
    "category": 0
  },
  {
    "normalized": "genova2024",
    "category": 0
  },
  {
    "normalized": "elencodeipartner",
    "category": 8
  },
  {
    "normalized": "uselimiteddatatoselectadvertising",
    "category": 0
  },
  {
    "normalized": "createprofilesforpersonalisedadvertising",
    "category": 0
  },
  {
    "normalized": "useprofilestoselectpersonalisedadvertising",
    "category": 0
  },
  {
    "normalized": "createprofilestopersonalisecontent",
    "category": 0
  },
  {
    "normalized": "forstaminevalg",
    "category": 3
  },
  {
    "normalized": "useprofilestoselectpersonalisedcontent",
    "category": 0
  },
  {
    "normalized": "measureadvertisingperformance",
    "category": 0
  },
  {
    "normalized": "measurecontentperformance",
    "category": 0
  },
  {
    "normalized": "developandimproveservices",
    "category": 0
  },
  {
    "normalized": "uselimiteddatatoselectcontent",
    "category": 0
  },
  {
    "normalized": "necrologie",
    "category": 0
  },
  {
    "normalized": "abbonati",
    "category": 0
  },
  {
    "normalized": "sfogliatore",
    "category": 0
  },
  {
    "normalized": "salvapreferenze",
    "category": 4
  },
  {
    "normalized": "siacconsento",
    "category": 1
  },
  {
    "normalized": "nononacconsento",
    "category": 2
  },
  {
    "normalized": "viewour10partners",
    "category": 8
  },
  {
    "normalized": "volidiretti",
    "category": 0
  },
  {
    "normalized": "restrizionidiviaggio",
    "category": 0
  },
  {
    "normalized": "preferenzeinmateriadiprivacy",
    "category": 9
  },
  {
    "normalized": "elencodeifornitori",
    "category": 8
  },
  {
    "normalized": "selezionalesingolefinalita",
    "category": 3
  },
  {
    "normalized": "thislist",
    "category": 9
  },
  {
    "normalized": "accediregistrati",
    "category": 0
  },
  {
    "normalized": "selezionanewsletter",
    "category": 0
  },
  {
    "normalized": "iscriviti",
    "category": 0
  },
  {
    "normalized": "jackpot",
    "category": 0
  },
  {
    "normalized": "guideacquisto",
    "category": 0
  },
  {
    "normalized": "dichiarazionesuicookie",
    "category": 0
  },
  {
    "normalized": "cookietecnici",
    "category": 0
  },
  {
    "normalized": "vaiallepreferenzecookie",
    "category": 3
  },
  {
    "normalized": "1402partner",
    "category": 8
  },
  {
    "normalized": "closethisnotice",
    "category": 9
  },
  {
    "normalized": "donotsellmypersonalinformation",
    "category": 2
  },
  {
    "normalized": "onlytechnicalcookies",
    "category": 2
  },
  {
    "normalized": "accettasolocookietecnici",
    "category": 2
  },
  {
    "normalized": "pubblicitaecontenutipersonalizzativalutazionedeicontenutiedellefficaciadellapubblicitaricerchesulpubblicosviluppodiservizi",
    "category": 0
  },
  {
    "normalized": "193fornitoritcfe84partnerpubblicitari",
    "category": 8
  },
  {
    "normalized": "inostri807partner",
    "category": 8
  },
  {
    "normalized": "server",
    "category": 0
  },
  {
    "normalized": "domini",
    "category": 0
  },
  {
    "normalized": "hosting",
    "category": 0
  },
  {
    "normalized": "wordpress",
    "category": 0
  },
  {
    "normalized": "sitiweb",
    "category": 0
  },
  {
    "normalized": "gdprprivacy",
    "category": 0
  },
  {
    "normalized": "gratis",
    "category": 0
  },
  {
    "normalized": "webmail",
    "category": 0
  },
  {
    "normalized": "setyourpreferences",
    "category": 3
  },
  {
    "normalized": "sonstigecookieservices",
    "category": 8
  },
  {
    "normalized": "elencoterzeparti",
    "category": 8
  },
  {
    "normalized": "300altrisitiweb",
    "category": 9
  },
  {
    "normalized": "senzapubblicitaper399almese",
    "category": 5
  },
  {
    "normalized": "accediqui",
    "category": 0
  },
  {
    "normalized": "faqcontentpass",
    "category": 0
  },
  {
    "normalized": "permaggioriinformazioniconsultalanostracookiepolicy",
    "category": 0
  },
  {
    "normalized": "politicasuicookie",
    "category": 0
  },
  {
    "normalized": "offertediprimaveraamazon2024lemiglioriofferte",
    "category": 0
  },
  {
    "normalized": "comesiscriveunapec",
    "category": 0
  },
  {
    "normalized": "comeagisconogliscammer",
    "category": 0
  },
  {
    "normalized": "comecontrollarepagamentitarionline",
    "category": 0
  },
  {
    "normalized": "comeaprireilcancelloconiltelefono",
    "category": 0
  },
  {
    "normalized": "rifiutaretuttiicookie",
    "category": 2
  },
  {
    "normalized": "gestirepreferenze",
    "category": 3
  },
  {
    "normalized": "autorizzaretuttiicookie",
    "category": 1
  },
  {
    "normalized": "inostri814partner",
    "category": 8
  },
  {
    "normalized": "utilizzodatipubblicitari",
    "category": 9
  },
  {
    "normalized": "visualizzavendorsditerzeparti",
    "category": 8
  },
  {
    "normalized": "cookiepolicycompleta",
    "category": 0
  },
  {
    "normalized": "chisiamo",
    "category": 0
  },
  {
    "normalized": "cosafacciamo",
    "category": 0
  },
  {
    "normalized": "volontariato",
    "category": 0
  },
  {
    "normalized": "sostienici",
    "category": 9
  },
  {
    "normalized": "continuasenzaaccettare→rifiutaechiudi",
    "category": 2
  },
  {
    "normalized": "inostri57partner",
    "category": 8
  },
  {
    "normalized": "novoglioperdere",
    "category": 9
  },
  {
    "normalized": "altri31partner",
    "category": 8
  },
  {
    "normalized": "understandaudiencesthroughstatisticsorcombinationsofdatafromdifferentsources",
    "category": 0
  },
  {
    "normalized": "rifiutaтutte",
    "category": 2
  },
  {
    "normalized": "puntidiritiro",
    "category": 0
  },
  {
    "normalized": "standard",
    "category": 0
  },
  {
    "normalized": "ignora",
    "category": 8
  },
  {
    "normalized": "viewourpartnersepossibileimpostarelepreferenzediconsensosingolarmenteperognipartnercliccandoqui",
    "category": 3
  },
  {
    "normalized": "soggiorni",
    "category": 9
  },
  {
    "normalized": "pacchettivacanze",
    "category": 0
  },
  {
    "normalized": "edicola",
    "category": 0
  },
  {
    "normalized": "focus",
    "category": 0
  },
  {
    "normalized": "configurapreferenze",
    "category": 3
  },
  {
    "normalized": "networkmaggioli",
    "category": 0
  },
  {
    "normalized": "mailpersonal",
    "category": 0
  },
  {
    "normalized": "gossip",
    "category": 0
  },
  {
    "normalized": "guidatv",
    "category": 0
  },
  {
    "normalized": "elencodeifornitoriiab",
    "category": 8
  },
  {
    "normalized": "desideromodificarelemiepreferenze",
    "category": 3
  },
  {
    "normalized": "accettaecontinuaaleggere",
    "category": 1
  },
  {
    "normalized": "cliccaquipervedereiterminielecondizionicompleti",
    "category": 9
  },
  {
    "normalized": "11240",
    "category": 0
  },
  {
    "normalized": "10108",
    "category": 0
  },
  {
    "normalized": "13117",
    "category": 0
  },
  {
    "normalized": "informativadeicookies",
    "category": 0
  },
  {
    "normalized": "rivenditori",
    "category": 0
  },
  {
    "normalized": "rinnovi",
    "category": 0
  },
  {
    "normalized": "areaclienti",
    "category": 0
  },
  {
    "normalized": "moreinformationabouthowweusecookiesisonourwebsiteprivacynotice",
    "category": 0
  },
  {
    "normalized": "datidigeolocalizzazioneprecisieidentificazioneattraversolascansionedeldispositivo",
    "category": 0
  },
  {
    "normalized": "informativasullusodeicookie",
    "category": 0
  },
  {
    "normalized": "pubblicitabasatasudatilimitatiprofilopubblicitariopersonalizzatoevalutazionedellefficaciadellapubblicita",
    "category": 0
  },
  {
    "normalized": "contenutipersonalizzativalutazionedeicontenutiericerchesulpubblico",
    "category": 0
  },
  {
    "normalized": "usodeiprofiliperlaselezionedipubblicitapersonalizzata",
    "category": 0
  },
  {
    "normalized": "sviluppareemigliorareiservizi",
    "category": 0
  },
  {
    "normalized": "usodidatilimitatiperlaselezionedeicontenuti",
    "category": 0
  },
  {
    "normalized": "technicalcookiesonly",
    "category": 2
  },
  {
    "normalized": "cookieprivacypolicy",
    "category": 0
  },
  {
    "normalized": "fatturazioneelettronica",
    "category": 0
  },
  {
    "normalized": "comparatoretariffe",
    "category": 0
  },
  {
    "normalized": "pagamentobollettini",
    "category": 0
  },
  {
    "normalized": "prosegui",
    "category": 1
  },
  {
    "normalized": "edition2024",
    "category": 0
  },
  {
    "normalized": "pressepro",
    "category": 0
  },
  {
    "normalized": "openclosesubmenu",
    "category": 3
  },
  {
    "normalized": "agreetoalldatauses",
    "category": 1
  },
  {
    "normalized": "rejectalldatauses",
    "category": 2
  },
  {
    "normalized": "continueranaviguersansaccepter>",
    "category": 2
  },
  {
    "normalized": "parceiros",
    "category": 8
  },
  {
    "normalized": "detailsdeconsentement",
    "category": 3
  },
  {
    "normalized": "choisirquoiaccepter",
    "category": 3
  },
  {
    "normalized": "prendreunrendezvous",
    "category": 0
  },
  {
    "normalized": "refuserlescookiesfacultatifs",
    "category": 2
  },
  {
    "normalized": "festival",
    "category": 0
  },
  {
    "normalized": "jeunepublic",
    "category": 0
  },
  {
    "normalized": "expositions",
    "category": 0
  },
  {
    "normalized": "bloquerlescookies",
    "category": 2
  },
  {
    "normalized": "enregistrerlespreferences",
    "category": 3
  },
  {
    "normalized": "notrecookiepolicy",
    "category": 0
  },
  {
    "normalized": "jacceptelescookiessurasadventurelu",
    "category": 1
  },
  {
    "normalized": "liensdespartenaires",
    "category": 8
  },
  {
    "normalized": "generalvendorlist",
    "category": 8
  },
  {
    "normalized": "solutions",
    "category": 0
  },
  {
    "normalized": "toutelinformation",
    "category": 0
  },
  {
    "normalized": "dossiersthematiques",
    "category": 0
  },
  {
    "normalized": "annuaire",
    "category": 0
  },
  {
    "normalized": "parametrersoimeme",
    "category": 3
  },
  {
    "normalized": "conhecaosnossos820parceiros",
    "category": 8
  },
  {
    "normalized": "saibamais→",
    "category": 3
  },
  {
    "normalized": "aceitarefechar",
    "category": 1
  },
  {
    "normalized": "acceptalloptionalcookies",
    "category": 1
  },
  {
    "normalized": "declinealloptionalcookies",
    "category": 2
  },
  {
    "normalized": "tailoryourcookiepreferences",
    "category": 3
  },
  {
    "normalized": "przypomnijpozniej",
    "category": 0
  },
  {
    "normalized": "ichlehneab",
    "category": 2
  },
  {
    "normalized": "acceptonlynecessarycookies",
    "category": 2
  },
  {
    "normalized": "hinweisausblenden",
    "category": 8
  },
  {
    "normalized": "luxembourg",
    "category": 0
  },
  {
    "normalized": "industries",
    "category": 0
  },
  {
    "normalized": "insights",
    "category": 0
  },
  {
    "normalized": "trainingcenter",
    "category": 0
  },
  {
    "normalized": "meetourpeople",
    "category": 0
  },
  {
    "normalized": "mediacentre",
    "category": 0
  },
  {
    "normalized": "requiredonly",
    "category": 2
  },
  {
    "normalized": "clickheretosetyourcookiespreferences",
    "category": 3
  },
  {
    "normalized": "nurunbedingtnotwendig",
    "category": 2
  },
  {
    "normalized": "parametresducookies",
    "category": 3
  },
  {
    "normalized": "vousaccompagner",
    "category": 0
  },
  {
    "normalized": "votrepolitiqueenergetiqueetclimatique",
    "category": 0
  },
  {
    "normalized": "boiteaoutils",
    "category": 0
  },
  {
    "normalized": "conseillers",
    "category": 0
  },
  {
    "normalized": "artisans",
    "category": 0
  },
  {
    "normalized": "infrastructuredecharge",
    "category": 0
  },
  {
    "normalized": "stroumbeweegt",
    "category": 0
  },
  {
    "normalized": "appelsdoffres",
    "category": 0
  },
  {
    "normalized": "planificationfinancementrealisation",
    "category": 0
  },
  {
    "normalized": "accordvolontairefedil",
    "category": 0
  },
  {
    "normalized": "auditsenergetiques",
    "category": 0
  },
  {
    "normalized": "alatelier",
    "category": 0
  },
  {
    "normalized": "sensibilisationdupersonnel",
    "category": 0
  },
  {
    "normalized": "aubureau",
    "category": 0
  },
  {
    "normalized": "aircomprime",
    "category": 0
  },
  {
    "normalized": "eclairage",
    "category": 0
  },
  {
    "normalized": "entrainementselectriques",
    "category": 0
  },
  {
    "normalized": "systemedeventilation",
    "category": 0
  },
  {
    "normalized": "systemesdepompage",
    "category": 0
  },
  {
    "normalized": "energiethermique",
    "category": 0
  },
  {
    "normalized": "aideseconomiesdenergies",
    "category": 0
  },
  {
    "normalized": "mecanismedobligations",
    "category": 0
  },
  {
    "normalized": "energiesrenouvelablestarifsdinjection",
    "category": 0
  },
  {
    "normalized": "seancesdinformation",
    "category": 0
  },
  {
    "normalized": "conferencedelancement",
    "category": 0
  },
  {
    "normalized": "apropos",
    "category": 8
  },
  {
    "normalized": "customizeconsents",
    "category": 3
  },
  {
    "normalized": "choosecookiestoaccept",
    "category": 3
  },
  {
    "normalized": "autorisertout",
    "category": 1
  },
  {
    "normalized": "refuseallcookies",
    "category": 2
  },
  {
    "normalized": "savemychoices",
    "category": 4
  },
  {
    "normalized": "enregistrerlesparametresactuels",
    "category": 4
  },
  {
    "normalized": "aceptoveranunciospersonalizados",
    "category": 1
  },
  {
    "normalized": "gererlescookiesmanuellement",
    "category": 3
  },
  {
    "normalized": "nautoriserquelescookiesessentiels",
    "category": 2
  },
  {
    "normalized": "affichertouslespartenaires801→",
    "category": 8
  },
  {
    "normalized": "interdirelescookies",
    "category": 2
  },
  {
    "normalized": "essentiels",
    "category": 8
  },
  {
    "normalized": "tous",
    "category": 8
  },
  {
    "normalized": "demarchesparthematique",
    "category": 0
  },
  {
    "normalized": "accepterlescookiesfacultatifs",
    "category": 1
  },
  {
    "normalized": "moreinfoandpersonalise",
    "category": 3
  },
  {
    "normalized": "preferencesenmatieredecookies",
    "category": 3
  },
  {
    "normalized": "neplusafficher",
    "category": 9
  },
  {
    "normalized": "voirnos820partenaires",
    "category": 8
  },
  {
    "normalized": "sehensiesichunsere820partneran",
    "category": 8
  },
  {
    "normalized": "viewour818partners",
    "category": 0
  },
  {
    "normalized": "viewour819partners",
    "category": 8
  },
  {
    "normalized": "refusertouslescookiesetouautrestechnologiesquinesontpasstrictementnecessaires",
    "category": 2
  },
  {
    "normalized": "aproposdelabcl",
    "category": 9
  },
  {
    "normalized": "politiquemonetaire",
    "category": 0
  },
  {
    "normalized": "rechercheetpublications",
    "category": 0
  },
  {
    "normalized": "stabilitefinanciereetsupervisiondesliquidites",
    "category": 0
  },
  {
    "normalized": "infrastructuresetsystemesdepaiement",
    "category": 0
  },
  {
    "normalized": "statistiques",
    "category": 0
  },
  {
    "normalized": "reportingreglementaire",
    "category": 0
  },
  {
    "normalized": "operationsbancaires",
    "category": 0
  },
  {
    "normalized": "cadrejuridique",
    "category": 0
  },
  {
    "normalized": "moreinformationaboutourcookiepolicy",
    "category": 0
  },
  {
    "normalized": "meiinformatiounen",
    "category": 8
  },
  {
    "normalized": "seethelistofvendors",
    "category": 8
  },
  {
    "normalized": "prepareretmettreenœuvrelapolitiquedugouvernement",
    "category": 0
  },
  {
    "normalized": "visitezlesiteduministere",
    "category": 0
  },
  {
    "normalized": "ablehnenzustimmen",
    "category": 8
  },
  {
    "normalized": "mysmartofficelogin",
    "category": 0
  },
  {
    "normalized": "enregistrerlesparametres",
    "category": 4
  },
  {
    "normalized": "macontributionalaprotectionduclimat",
    "category": 0
  },
  {
    "normalized": "lesaidespourmonprojet",
    "category": 0
  },
  {
    "normalized": "lesetapesdemonprojet",
    "category": 0
  },
  {
    "normalized": "minformer",
    "category": 0
  },
  {
    "normalized": "choosewhattoaccept",
    "category": 3
  },
  {
    "normalized": "refuserlescookiesdanalysecliquezici",
    "category": 2
  },
  {
    "normalized": "verotrasopciones",
    "category": 3
  },
  {
    "normalized": "voirlesmentionslegales",
    "category": 0
  },
  {
    "normalized": "consulterlalistedesfournisseurs",
    "category": 8
  },
  {
    "normalized": "compris",
    "category": 1
  },
  {
    "normalized": "ormajaccepteorma",
    "category": 1
  },
  {
    "normalized": "individualsbusinessesinnovatorseveryone",
    "category": 0
  },
  {
    "normalized": "individuals",
    "category": 0
  },
  {
    "normalized": "businesses",
    "category": 0
  },
  {
    "normalized": "innovators",
    "category": 0
  },
  {
    "normalized": "everyone",
    "category": 0
  },
  {
    "normalized": "datenschutzundcookierichtlinie",
    "category": 0
  },
  {
    "normalized": "installningar",
    "category": 3
  },
  {
    "normalized": "accepteraalla",
    "category": 1
  },
  {
    "normalized": "godkannalla",
    "category": 1
  },
  {
    "normalized": "fleralternativ",
    "category": 3
  },
  {
    "normalized": "avvisaalla",
    "category": 2
  },
  {
    "normalized": "godkann",
    "category": 1
  },
  {
    "normalized": "cookieinstallningar",
    "category": 3
  },
  {
    "normalized": "leverantorer",
    "category": 8
  },
  {
    "normalized": "okej",
    "category": 1
  },
  {
    "normalized": "avvisa",
    "category": 2
  },
  {
    "normalized": "jaggodkanner",
    "category": 1
  },
  {
    "normalized": "lagraochellerfaatkomsttillinformationpaenenhet",
    "category": 0
  },
  {
    "normalized": "jagaccepterar",
    "category": 1
  },
  {
    "normalized": "tillatalla",
    "category": 1
  },
  {
    "normalized": "flerinstallningar",
    "category": 3
  },
  {
    "normalized": "endastnodvandigacookies",
    "category": 2
  },
  {
    "normalized": "anpassa",
    "category": 3
  },
  {
    "normalized": "accepteraallacookies",
    "category": 1
  },
  {
    "normalized": "endastnodvandiga",
    "category": 2
  },
  {
    "normalized": "visasyften",
    "category": 3
  },
  {
    "normalized": "godkannallakakor",
    "category": 1
  },
  {
    "normalized": "godkannallacookies",
    "category": 1
  },
  {
    "normalized": "hanteracookies",
    "category": 3
  },
  {
    "normalized": "tillaturval",
    "category": 4
  },
  {
    "normalized": "accepteraallakakor",
    "category": 1
  },
  {
    "normalized": "tillatallacookies",
    "category": 1
  },
  {
    "normalized": "hanterakakor",
    "category": 3
  },
  {
    "normalized": "vara860partners",
    "category": 8
  },
  {
    "normalized": "nekaalla",
    "category": 2
  },
  {
    "normalized": "41partners",
    "category": 8
  },
  {
    "normalized": "produktutvecklingpersonanpassningmarknadsforingochreklamutfortavschibsted",
    "category": 0
  },
  {
    "normalized": "godkannnodvandigakakor",
    "category": 2
  },
  {
    "normalized": "andrainstallningar",
    "category": 3
  },
  {
    "normalized": "godkannochstang",
    "category": 1
  },
  {
    "normalized": "jagforstar",
    "category": 1
  },
  {
    "normalized": "anvandabegransadedataforattvaljareklam",
    "category": 0
  },
  {
    "normalized": "skapaprofilerforpersonaliseradreklam",
    "category": 0
  },
  {
    "normalized": "anvandaprofilerforattvaljapersonaliseradreklam",
    "category": 0
  },
  {
    "normalized": "skapaprofilerforattpersonaliseradinnehall",
    "category": 0
  },
  {
    "normalized": "anvandaprofilerforattvaljapersonaliseradinnehall",
    "category": 0
  },
  {
    "normalized": "matareklamprestanda",
    "category": 0
  },
  {
    "normalized": "listaoverpartnerleverantorer",
    "category": 8
  },
  {
    "normalized": "tillatallakakor",
    "category": 1
  },
  {
    "normalized": "lesmeromcookies",
    "category": 8
  },
  {
    "normalized": "lasmeromcookies",
    "category": 9
  },
  {
    "normalized": "merinformation→",
    "category": 3
  },
  {
    "normalized": "information",
    "category": 3
  },
  {
    "normalized": "detaljsektionen",
    "category": 3
  },
  {
    "normalized": "lasmeromvaracookies",
    "category": 3
  },
  {
    "normalized": "godkannnodvandiga",
    "category": 2
  },
  {
    "normalized": "hanteravalbarakakor",
    "category": 3
  },
  {
    "normalized": "personanpassadreklamochinnehallreklamochinnehallsmatningforskningangaendemalgruppochtjansteutveckling",
    "category": 0
  },
  {
    "normalized": "tillatbaranodvandigakakor",
    "category": 2
  },
  {
    "normalized": "personuppgiftsochcookiepolicy",
    "category": 0
  },
  {
    "normalized": "anpassadittval",
    "category": 3
  },
  {
    "normalized": "neka",
    "category": 2
  },
  {
    "normalized": "our860partners",
    "category": 8
  },
  {
    "normalized": "okenaarwebsite",
    "category": 1
  },
  {
    "normalized": "godkanninte",
    "category": 2
  },
  {
    "normalized": "godkannendastnodvandiga",
    "category": 2
  },
  {
    "normalized": "hantera",
    "category": 3
  },
  {
    "normalized": "godkannkakor",
    "category": 1
  },
  {
    "normalized": "accepteranodvandiga",
    "category": 2
  },
  {
    "normalized": "reklaminstallningar",
    "category": 0
  },
  {
    "normalized": "baranodvandigakakor",
    "category": 2
  },
  {
    "normalized": "sparainstallningar",
    "category": 4
  },
  {
    "normalized": "endastnodvandigakakor",
    "category": 2
  },
  {
    "normalized": "valjniva",
    "category": 8
  },
  {
    "normalized": "sparaval",
    "category": 4
  },
  {
    "normalized": "anpassaval",
    "category": 3
  },
  {
    "normalized": "nekaochstang",
    "category": 2
  },
  {
    "normalized": "tcfpartnersochandrapartners",
    "category": 8
  },
  {
    "normalized": "hanteraalternativ",
    "category": 3
  },
  {
    "normalized": "marknadsforing",
    "category": 0
  },
  {
    "normalized": "loggain",
    "category": 0
  },
  {
    "normalized": "lasmer",
    "category": 3
  },
  {
    "normalized": "vara102partners",
    "category": 8
  },
  {
    "normalized": "nodvandig",
    "category": 2
  },
  {
    "normalized": "accepteracookies",
    "category": 1
  },
  {
    "normalized": "godkannendastdetobligatoriska",
    "category": 2
  },
  {
    "normalized": "nejjagaccepterarinte",
    "category": 2
  },
  {
    "normalized": "jajagaccepterar",
    "category": 1
  },
  {
    "normalized": "anpassakakor",
    "category": 3
  },
  {
    "normalized": "avvisaallacookies",
    "category": 2
  },
  {
    "normalized": "allownecessary",
    "category": 1
  },
  {
    "normalized": "stallinpreferenser",
    "category": 3
  },
  {
    "normalized": "jaggodkannerallakakor",
    "category": 1
  },
  {
    "normalized": "jaggodkannernodvandigakakor",
    "category": 2
  },
  {
    "normalized": "minaval",
    "category": 8
  },
  {
    "normalized": "enbartnodvandiga",
    "category": 2
  },
  {
    "normalized": "bekraftaminaval",
    "category": 4
  },
  {
    "normalized": "godkannendastnodvandigacookies",
    "category": 2
  },
  {
    "normalized": "googlessekretesspolicy",
    "category": 0
  },
  {
    "normalized": "okjagharforstatt",
    "category": 1
  },
  {
    "normalized": "jagaccepterarallacookies",
    "category": 1
  },
  {
    "normalized": "har",
    "category": 8
  },
  {
    "normalized": "accepterarekommenderade",
    "category": 1
  },
  {
    "normalized": "acceptnecessarycookies",
    "category": 2
  },
  {
    "normalized": "nekaallautomnodvandiga",
    "category": 2
  },
  {
    "normalized": "policyforkakor",
    "category": 0
  },
  {
    "normalized": "detarokej",
    "category": 1
  },
  {
    "normalized": "anpassadeinstallningar",
    "category": 3
  },
  {
    "normalized": "godkanner",
    "category": 1
  },
  {
    "normalized": "accepteraurvalavkakor",
    "category": 4
  },
  {
    "normalized": "accepteraendastnodvandiga",
    "category": 2
  },
  {
    "normalized": "cookiessdkerochwebbsparningspolicy",
    "category": 0
  },
  {
    "normalized": "avfardaalla",
    "category": 2
  },
  {
    "normalized": "latmigvalja",
    "category": 3
  },
  {
    "normalized": "thegovernmentofsweden",
    "category": 0
  },
  {
    "normalized": "governmentpolicyinswedentheeu",
    "category": 0
  },
  {
    "normalized": "documentspublications",
    "category": 0
  },
  {
    "normalized": "howswedenisgoverned",
    "category": 0
  },
  {
    "normalized": "presscontacts",
    "category": 0
  },
  {
    "normalized": "besokare",
    "category": 0
  },
  {
    "normalized": "leverantorslistan",
    "category": 8
  },
  {
    "normalized": "leverantorslista",
    "category": 0
  },
  {
    "normalized": "utvecklaochforbattratjanster",
    "category": 0
  },
  {
    "normalized": "anvandaexaktauppgifteromgeografiskpositionering",
    "category": 0
  },
  {
    "normalized": "aktivtlasaavenhetensegenskaperforidentifieringsandamal",
    "category": 0
  },
  {
    "normalized": "avvisacookies",
    "category": 2
  },
  {
    "normalized": "privacypolicies",
    "category": 0
  },
  {
    "normalized": "nekaallautomnodvandigakakor",
    "category": 2
  },
  {
    "normalized": "jaggodkannerattnianvanderallacookies",
    "category": 1
  },
  {
    "normalized": "jaggodkannerenbartattnianvandernodvandigacookies",
    "category": 2
  },
  {
    "normalized": "jagaccepterarallakakor",
    "category": 1
  },
  {
    "normalized": "varacookies",
    "category": 0
  },
  {
    "normalized": "datorutrustning",
    "category": 0
  },
  {
    "normalized": "datorsurfplatta",
    "category": 0
  },
  {
    "normalized": "tvljudbild",
    "category": 0
  },
  {
    "normalized": "mobilklockor",
    "category": 0
  },
  {
    "normalized": "vitvaror",
    "category": 0
  },
  {
    "normalized": "hemhushall",
    "category": 0
  },
  {
    "normalized": "kampanjer",
    "category": 0
  },
  {
    "normalized": "samtycktillalla",
    "category": 1
  },
  {
    "normalized": "vara1412partners",
    "category": 8
  },
  {
    "normalized": "jagaccepterarcookies",
    "category": 1
  },
  {
    "normalized": "lasmerivarcookiepolicy",
    "category": 0
  },
  {
    "normalized": "godkannbaranodvandiga",
    "category": 2
  },
  {
    "normalized": "installningarochinfo",
    "category": 3
  },
  {
    "normalized": "stanggodkann",
    "category": 1
  },
  {
    "normalized": "omwebbplatsenochkakor",
    "category": 0
  },
  {
    "normalized": "readmoreaboutourcookies",
    "category": 3
  },
  {
    "normalized": "valjindividuellaandamal",
    "category": 3
  },
  {
    "normalized": "installningarforcookies",
    "category": 3
  },
  {
    "normalized": "fortsattmedvalda",
    "category": 4
  },
  {
    "normalized": "stanginstallningar",
    "category": 0
  },
  {
    "normalized": "anpassaminacookies",
    "category": 3
  },
  {
    "normalized": "sparaingacookies",
    "category": 2
  },
  {
    "normalized": "detarokformig",
    "category": 1
  },
  {
    "normalized": "sverigesregering",
    "category": 0
  },
  {
    "normalized": "regeringenspolitikisverigeeu",
    "category": 0
  },
  {
    "normalized": "dokumentpublikationer",
    "category": 0
  },
  {
    "normalized": "sastyrssverige",
    "category": 0
  },
  {
    "normalized": "presskontakt",
    "category": 0
  },
  {
    "normalized": "jobbahososs",
    "category": 0
  },
  {
    "normalized": "latmigvaljanu",
    "category": 3
  },
  {
    "normalized": "avvisaallautomnodvandiga",
    "category": 2
  },
  {
    "normalized": "accepteranodvandigakakor",
    "category": 2
  },
  {
    "normalized": "fortsattutansamtycke",
    "category": 2
  },
  {
    "normalized": "anpassaminaval",
    "category": 3
  },
  {
    "normalized": "accepterasamtligakakor",
    "category": 1
  },
  {
    "normalized": "godkannbaranodvandigakakor",
    "category": 2
  },
  {
    "normalized": "installningarforkakor",
    "category": 3
  },
  {
    "normalized": "sparaminaval",
    "category": 4
  },
  {
    "normalized": "jaggodkanneralla",
    "category": 1
  },
  {
    "normalized": "godkannkakorforstatistik",
    "category": 1
  },
  {
    "normalized": "godkannintekakorforstatistik",
    "category": 2
  },
  {
    "normalized": "omkakor",
    "category": 0
  },
  {
    "normalized": "jajaghallermed",
    "category": 1
  },
  {
    "normalized": "lashurvianvanderkakorochliknandetekniker",
    "category": 3
  },
  {
    "normalized": "anpassavalavcookies",
    "category": 3
  },
  {
    "normalized": "sahanterarvipersonuppgifterochcookies",
    "category": 0
  },
  {
    "normalized": "godkannendastnodvandigakakor",
    "category": 2
  },
  {
    "normalized": "baranodvandiga",
    "category": 2
  },
  {
    "normalized": "varlistaoverpartners",
    "category": 8
  },
  {
    "normalized": "jagsamtycker",
    "category": 1
  },
  {
    "normalized": "godkanncookies",
    "category": 1
  },
  {
    "normalized": "godkannallacookiesdirekt",
    "category": 1
  },
  {
    "normalized": "tillatendastnodvandigakakor",
    "category": 2
  },
  {
    "normalized": "29thirdparties",
    "category": 8
  },
  {
    "normalized": "listofcookies",
    "category": 8
  },
  {
    "normalized": "yesiapprove",
    "category": 1
  },
  {
    "normalized": "baradeviktigaste",
    "category": 2
  },
  {
    "normalized": "stallinonskemal",
    "category": 3
  },
  {
    "normalized": "webbplatsanpassning",
    "category": 0
  },
  {
    "normalized": "prestandacookies",
    "category": 0
  },
  {
    "normalized": "personuppgiftspolicy",
    "category": 0
  },
  {
    "normalized": "lasmerochhanterainstallningar",
    "category": 3
  },
  {
    "normalized": "vara815partners",
    "category": 8
  },
  {
    "normalized": "stangochgodkann",
    "category": 1
  },
  {
    "normalized": "accepteraallaochfortsatt",
    "category": 1
  },
  {
    "normalized": "hanteraminainstallningar",
    "category": 3
  },
  {
    "normalized": "subscribeviaemail",
    "category": 0
  },
  {
    "normalized": "swedishwebsite",
    "category": 0
  },
  {
    "normalized": "klickahar",
    "category": 9
  },
  {
    "normalized": "personanpassadreklamochinnehallreklamochinnehallsmatningsamtforskningangaendemalgrupp",
    "category": 0
  },
  {
    "normalized": "tredjepartsleverantorer",
    "category": 8
  },
  {
    "normalized": "cookieochprivatpolicy",
    "category": 0
  },
  {
    "normalized": "kopvillkor",
    "category": 0
  },
  {
    "normalized": "integritetspolicy",
    "category": 0
  },
  {
    "normalized": "meromcookiespaicabanken",
    "category": 0
  },
  {
    "normalized": "anvandendastnodvandigacookies",
    "category": 2
  },
  {
    "normalized": "vara199partners",
    "category": 8
  },
  {
    "normalized": "anpassadinakakor",
    "category": 3
  },
  {
    "normalized": "fortsatt",
    "category": 1
  },
  {
    "normalized": "nodvandigaobligatoriskt",
    "category": 2
  },
  {
    "normalized": "jajaggodkanner",
    "category": 1
  },
  {
    "normalized": "nejjagavbojer",
    "category": 2
  },
  {
    "normalized": "vadarkakor",
    "category": 0
  },
  {
    "normalized": "omwebbkakorpamalmose",
    "category": 0
  },
  {
    "normalized": "lasmeromkakorpamigrationsverketswebbplats",
    "category": 0
  },
  {
    "normalized": "lasmeromhurvihanterarcookieshar>",
    "category": 0
  },
  {
    "normalized": "lasmeromhurvihanterarkakorochpersonuppgifter",
    "category": 0
  },
  {
    "normalized": "sekretesspolicy",
    "category": 0
  },
  {
    "normalized": "preferenser",
    "category": 0
  },
  {
    "normalized": "matning",
    "category": 0
  },
  {
    "normalized": "annat",
    "category": 0
  },
  {
    "normalized": "hanteraochavvisacookies+",
    "category": 3
  },
  {
    "normalized": "varapartners",
    "category": 8
  },
  {
    "normalized": "jaggodkannercookies",
    "category": 1
  },
  {
    "normalized": "lyssna",
    "category": 0
  },
  {
    "normalized": "lattlast",
    "category": 0
  },
  {
    "normalized": "otherlanguages",
    "category": 0
  },
  {
    "normalized": "teckensprak",
    "category": 0
  },
  {
    "normalized": "prenumereraviaepost",
    "category": 0
  },
  {
    "normalized": "englishwebsite",
    "category": 0
  },
  {
    "normalized": "lasmeromochhanterakakorcookies",
    "category": 0
  },
  {
    "normalized": "extra15off",
    "category": 0
  },
  {
    "normalized": "innstillingerforcookiesinformasjonskapsler",
    "category": 3
  },
  {
    "normalized": "cookiepreferenser",
    "category": 3
  },
  {
    "normalized": "lasmeromvarcookiepolicy",
    "category": 0
  },
  {
    "normalized": "отказвамвсички",
    "category": 2
  },
  {
    "normalized": "приемамвсички",
    "category": 1
  },
  {
    "normalized": "statisticsfunction",
    "category": 0
  },
  {
    "normalized": "changeyourcookiesettings",
    "category": 3
  },
  {
    "normalized": "rechazarysuscribirse",
    "category": 5
  },
  {
    "normalized": "rechazarypagar",
    "category": 5
  },
  {
    "normalized": "nuestros895socios",
    "category": 8
  },
  {
    "normalized": "elecciondecookies",
    "category": 3
  },
  {
    "normalized": "aceptarynavegargratis",
    "category": 1
  },
  {
    "normalized": "listadeasociadosproveedores",
    "category": 8
  },
  {
    "normalized": "ver817socios",
    "category": 8
  },
  {
    "normalized": "nuestros789socios",
    "category": 8
  },
  {
    "normalized": "aceptarycontinuargratis",
    "category": 1
  },
  {
    "normalized": "789socios",
    "category": 8
  },
  {
    "normalized": "configuraciondelascookies",
    "category": 3
  },
  {
    "normalized": "814socios",
    "category": 8
  },
  {
    "normalized": "rechazaryregistrarse",
    "category": 5
  },
  {
    "normalized": "configuraropciones",
    "category": 3
  },
  {
    "normalized": "ver490socios",
    "category": 8
  },
  {
    "normalized": "detalles",
    "category": 3
  },
  {
    "normalized": "acercadelascookies",
    "category": 8
  },
  {
    "normalized": "iniciarsesionconcontentpass",
    "category": 5
  },
  {
    "normalized": "deacuerdo",
    "category": 1
  },
  {
    "normalized": "rechazaropcionales",
    "category": 2
  },
  {
    "normalized": "rechazarycerrar",
    "category": 2
  },
  {
    "normalized": "consentimiento",
    "category": 1
  },
  {
    "normalized": "185socios",
    "category": 8
  },
  {
    "normalized": "acceder",
    "category": 1
  },
  {
    "normalized": "ver489socios",
    "category": 8
  },
  {
    "normalized": "203socios",
    "category": 8
  },
  {
    "normalized": "cookiesestrictamentenecesarias",
    "category": 2
  },
  {
    "normalized": "nuestros814socios",
    "category": 8
  },
  {
    "normalized": "privacidad",
    "category": 0
  },
  {
    "normalized": "masinfo",
    "category": 8
  },
  {
    "normalized": "guardarpreferencias",
    "category": 4
  },
  {
    "normalized": "almacenarlainformacionenundispositivoyoaccederaella",
    "category": 0
  },
  {
    "normalized": "gestionarpreferencias",
    "category": 3
  },
  {
    "normalized": "400sitiosweb",
    "category": 8
  },
  {
    "normalized": "suscribirseyrechazartodo",
    "category": 5
  },
  {
    "normalized": "mimiespacio",
    "category": 0
  },
  {
    "normalized": "ver953socios",
    "category": 8
  },
  {
    "normalized": "aceptarsololoobligatorio",
    "category": 2
  },
  {
    "normalized": "rechazarlascookiesnoesenciales",
    "category": 2
  },
  {
    "normalized": "estabien",
    "category": 1
  },
  {
    "normalized": "estrictamentenecesarias",
    "category": 2
  },
  {
    "normalized": "aceptarseguimiento",
    "category": 1
  },
  {
    "normalized": "gestionarseguimiento",
    "category": 3
  },
  {
    "normalized": "nodeseoverlapoliticadecookies",
    "category": 9
  },
  {
    "normalized": "condicionesdeuso",
    "category": 0
  },
  {
    "normalized": "publicidadycontenidopersonalizadosmediciondepublicidadycontenidoinvestigaciondeaudienciaydesarrollodeservicios",
    "category": 0
  },
  {
    "normalized": "declinar",
    "category": 2
  },
  {
    "normalized": "customizecookiesettings",
    "category": 3
  },
  {
    "normalized": "paneldeconfiguarcion",
    "category": 3
  },
  {
    "normalized": "nuestros826socios",
    "category": 8
  },
  {
    "normalized": "entendidogracias",
    "category": 1
  },
  {
    "normalized": "rechazarlas",
    "category": 2
  },
  {
    "normalized": "allownecessarycookiescontinue",
    "category": 1
  },
  {
    "normalized": "summary",
    "category": 0
  },
  {
    "normalized": "1540partners",
    "category": 8
  },
  {
    "normalized": "sololoestrictamentenecesario",
    "category": 2
  },
  {
    "normalized": "volverparaaceptar",
    "category": 9
  },
  {
    "normalized": "datosdelocalizaciongeograficaprecisaeidentificacionmedianteanalisisdedispositivos",
    "category": 0
  },
  {
    "normalized": "rejectcookiesfor1",
    "category": 5
  },
  {
    "normalized": "viewour909partners",
    "category": 8
  },
  {
    "normalized": "our821partners",
    "category": 8
  },
  {
    "normalized": "ver838socios",
    "category": 8
  },
  {
    "normalized": "918partners",
    "category": 8
  },
  {
    "normalized": "agreecontinue",
    "category": 1
  },
  {
    "normalized": "400otherwebsites",
    "category": 8
  },
  {
    "normalized": "denysurfadfree",
    "category": 2
  },
  {
    "normalized": "loginwithcontentpass",
    "category": 5
  },
  {
    "normalized": "dataprivacy",
    "category": 0
  },
  {
    "normalized": "personaldata",
    "category": 0
  },
  {
    "normalized": "vernuestros489socios",
    "category": 0
  },
  {
    "normalized": "administrarlascookies",
    "category": 3
  },
  {
    "normalized": "820partners",
    "category": 8
  },
  {
    "normalized": "meinteresa",
    "category": 9
  },
  {
    "normalized": "rechazarnonecesarias",
    "category": 2
  },
  {
    "normalized": "vuelosdirectos",
    "category": 0
  },
  {
    "normalized": "elmejormomento",
    "category": 0
  },
  {
    "normalized": "escribenos",
    "category": 0
  },
  {
    "normalized": "preferenciasdeprivacidad",
    "category": 3
  },
  {
    "normalized": "listadeproveedores",
    "category": 8
  },
  {
    "normalized": "seleccionarfinesindividuales",
    "category": 3
  },
  {
    "normalized": "10socios",
    "category": 8
  },
  {
    "normalized": "novolveramostrarestemensaje",
    "category": 1
  },
  {
    "normalized": "vernuestros869socios",
    "category": 8
  },
  {
    "normalized": "privacidaddedatos",
    "category": 8
  },
  {
    "normalized": "llamadme",
    "category": 0
  },
  {
    "normalized": "documentaciondecookies",
    "category": 0
  },
  {
    "normalized": "tecnicas",
    "category": 0
  },
  {
    "normalized": "836sociosvernuestrossocios",
    "category": 8
  },
  {
    "normalized": "configurarcookiessinaceptar",
    "category": 3
  },
  {
    "normalized": "aceptarlastodas",
    "category": 1
  },
  {
    "normalized": "gestionarajustes",
    "category": 3
  },
  {
    "normalized": "siestoydeacuerdo",
    "category": 1
  },
  {
    "normalized": "configurartusopciones",
    "category": 3
  },
  {
    "normalized": "llamadmegratis",
    "category": 0
  },
  {
    "normalized": "rechazarlascookies",
    "category": 2
  },
  {
    "normalized": "rechazarsuscribirme",
    "category": 5
  },
  {
    "normalized": "verlaconfiguraciondelascookies",
    "category": 3
  },
  {
    "normalized": "apuestasslotscasinocasinoenvivopokerpromocionessportiumuno",
    "category": 0
  },
  {
    "normalized": "permitirsolocookiesnecesarias",
    "category": 2
  },
  {
    "normalized": "soloesenciales",
    "category": 2
  },
  {
    "normalized": "300otrossitiosweb",
    "category": 8
  },
  {
    "normalized": "sinanunciospor399almes",
    "category": 5
  },
  {
    "normalized": "iniciasesionaqui",
    "category": 0
  },
  {
    "normalized": "706sociospodemos",
    "category": 8
  },
  {
    "normalized": "esticdacord",
    "category": 1
  },
  {
    "normalized": "canviarpreferencies",
    "category": 3
  },
  {
    "normalized": "grabarpreferencias",
    "category": 4
  },
  {
    "normalized": "guardar",
    "category": 4
  },
  {
    "normalized": "paneldeconfiguraciondecookies",
    "category": 3
  },
  {
    "normalized": "configuralaprivadesa",
    "category": 3
  },
  {
    "normalized": "desalaconfiguracio",
    "category": 3
  },
  {
    "normalized": "acceptahotot",
    "category": 1
  },
  {
    "normalized": "nongrazas",
    "category": 2
  },
  {
    "normalized": "administrarpreferenciasdecookies",
    "category": 3
  },
  {
    "normalized": "rexeitarcookies",
    "category": 2
  },
  {
    "normalized": "sociosnuestros",
    "category": 8
  },
  {
    "normalized": "editandolaconfiguracion",
    "category": 3
  },
  {
    "normalized": "personas",
    "category": 9
  },
  {
    "normalized": "nuestros215socios",
    "category": 8
  },
  {
    "normalized": "moreinformationhere",
    "category": 3
  },
  {
    "normalized": "consultarnuestrapoliticadecookies",
    "category": 0
  },
  {
    "normalized": "rechazartodocontinuarsinaceptar→",
    "category": 2
  },
  {
    "normalized": "grupodesitiosweb",
    "category": 0
  },
  {
    "normalized": "nuestros490socios",
    "category": 8
  },
  {
    "normalized": "tengounasuscripcion",
    "category": 5
  },
  {
    "normalized": "nuestros57socios",
    "category": 8
  },
  {
    "normalized": "advertisingbasedonlimiteddataandadvertisingmeasurement",
    "category": 0
  },
  {
    "normalized": "personalisedadvertising",
    "category": 0
  },
  {
    "normalized": "selectionofpersonalisedadvertisingandadvertisingmeasurement",
    "category": 0
  },
  {
    "normalized": "incibe",
    "category": 9
  },
  {
    "normalized": "tuayudaenciberseguridad",
    "category": 0
  },
  {
    "normalized": "experienciaincibe",
    "category": 9
  },
  {
    "normalized": "programacibercooperantes",
    "category": 0
  },
  {
    "normalized": "campanas",
    "category": 0
  },
  {
    "normalized": "saladeprensa",
    "category": 0
  },
  {
    "normalized": "informacioncorporativa",
    "category": 0
  },
  {
    "normalized": "incibecert",
    "category": 0
  },
  {
    "normalized": "ciudadania",
    "category": 0
  },
  {
    "normalized": "menores",
    "category": 0
  },
  {
    "normalized": "empresas",
    "category": 0
  },
  {
    "normalized": "espanadigital2026",
    "category": 0
  },
  {
    "normalized": "alojamientos",
    "category": 0
  },
  {
    "normalized": "coches",
    "category": 0
  },
  {
    "normalized": "viajes",
    "category": 0
  },
  {
    "normalized": "listadeasociados",
    "category": 8
  },
  {
    "normalized": "buscarpor",
    "category": 0
  },
  {
    "normalized": "prediccion",
    "category": 0
  },
  {
    "normalized": "modelos",
    "category": 0
  },
  {
    "normalized": "imagenessatelite",
    "category": 0
  },
  {
    "normalized": "observacion",
    "category": 0
  },
  {
    "normalized": "multimedia",
    "category": 0
  },
  {
    "normalized": "meapunto",
    "category": 1
  },
  {
    "normalized": "doymiconsentimiento",
    "category": 1
  },
  {
    "normalized": "sololascookiesnecesarias",
    "category": 2
  },
  {
    "normalized": "geolocalizacionprecisa",
    "category": 0
  },
  {
    "normalized": "mas",
    "category": 0
  },
  {
    "normalized": "thanksforlettingmeknow",
    "category": 1
  },
  {
    "normalized": "verpreferencias",
    "category": 3
  },
  {
    "normalized": "ver908socios",
    "category": 8
  },
  {
    "normalized": "registro",
    "category": 5
  },
  {
    "normalized": "publicidadbasadaendatoslimitadosperfilpublicitariopersonalizadoymedicionpublicitaria",
    "category": 0
  },
  {
    "normalized": "contenidopersonalizadomediciondelcontenidoinformacionsobrelaaudienciaydesarrollodeservicios",
    "category": 0
  },
  {
    "normalized": "utilizarperfilesparaseleccionarlapublicidadpersonalizada",
    "category": 0
  },
  {
    "normalized": "nuestrapoliticadecookies",
    "category": 0
  },
  {
    "normalized": "universidaddigital",
    "category": 0
  },
  {
    "normalized": "conocenos",
    "category": 0
  },
  {
    "normalized": "estudiantes",
    "category": 0
  },
  {
    "normalized": "investigacionytransferencia",
    "category": 0
  },
  {
    "normalized": "+uca",
    "category": 0
  },
  {
    "normalized": "declinarconsentimiento",
    "category": 2
  },
  {
    "normalized": "deacuerdonogracias",
    "category": 2
  },
  {
    "normalized": "acceptartot",
    "category": 1
  },
  {
    "normalized": "gestionarmiseleccion",
    "category": 3
  },
  {
    "normalized": "aceptarnecesarias",
    "category": 2
  },
  {
    "normalized": "maisopcoes",
    "category": 3
  },
  {
    "normalized": "aceitartodososcookies",
    "category": 1
  },
  {
    "normalized": "rejeitartodos",
    "category": 2
  },
  {
    "normalized": "concordo",
    "category": 1
  },
  {
    "normalized": "definicoesdecookies",
    "category": 3
  },
  {
    "normalized": "aceitartodos",
    "category": 1
  },
  {
    "normalized": "rejeitar",
    "category": 2
  },
  {
    "normalized": "aceitartudo",
    "category": 1
  },
  {
    "normalized": "definicoes",
    "category": 3
  },
  {
    "normalized": "recusar",
    "category": 2
  },
  {
    "normalized": "mostrarfinalidades",
    "category": 3
  },
  {
    "normalized": "euaceito",
    "category": 1
  },
  {
    "normalized": "gerirpreferencias",
    "category": 3
  },
  {
    "normalized": "maisinformacao",
    "category": 3
  },
  {
    "normalized": "listadeparceirosfornecedores",
    "category": 8
  },
  {
    "normalized": "rejeitartudo",
    "category": 2
  },
  {
    "normalized": "recusartudo",
    "category": 2
  },
  {
    "normalized": "aceitarecontinuar",
    "category": 1
  },
  {
    "normalized": "continuarsemaceitar",
    "category": 2
  },
  {
    "normalized": "fechar",
    "category": 1
  },
  {
    "normalized": "sabermais",
    "category": 8
  },
  {
    "normalized": "sobreascookies",
    "category": 8
  },
  {
    "normalized": "continuesemaceitar",
    "category": 2
  },
  {
    "normalized": "gerircookies",
    "category": 3
  },
  {
    "normalized": "lermaisacercadecookies",
    "category": 8
  },
  {
    "normalized": "enviar",
    "category": 9
  },
  {
    "normalized": "conhecaosnossos833parceiros",
    "category": 8
  },
  {
    "normalized": "aceitartodasascookies",
    "category": 1
  },
  {
    "normalized": "rejeitartodososcookies",
    "category": 2
  },
  {
    "normalized": "configuracoes",
    "category": 3
  },
  {
    "normalized": "configuraroscookies",
    "category": 3
  },
  {
    "normalized": "pesquisa",
    "category": 0
  },
  {
    "normalized": "pesquisar",
    "category": 9
  },
  {
    "normalized": "configuracoesdecookies",
    "category": 3
  },
  {
    "normalized": "guardarescolhas",
    "category": 4
  },
  {
    "normalized": "apenasosnecessarios",
    "category": 2
  },
  {
    "normalized": "permitirtodososcookies",
    "category": 1
  },
  {
    "normalized": "recusartodos",
    "category": 2
  },
  {
    "normalized": "149fornecedorestcfe68parceirosdeanuncios",
    "category": 8
  },
  {
    "normalized": "alterardefinicoes",
    "category": 3
  },
  {
    "normalized": "concordareprosseguir",
    "category": 1
  },
  {
    "normalized": "alterardefinicoesdecookies",
    "category": 3
  },
  {
    "normalized": "listadefornecedores",
    "category": 8
  },
  {
    "normalized": "permitirselecao",
    "category": 4
  },
  {
    "normalized": "lermais",
    "category": 3
  },
  {
    "normalized": "oknaomostrarnovamente",
    "category": 1
  },
  {
    "normalized": "apresentacao",
    "category": 0
  },
  {
    "normalized": "recursoshumanos",
    "category": 0
  },
  {
    "normalized": "acessoeingresso",
    "category": 1
  },
  {
    "normalized": "projetos",
    "category": 0
  },
  {
    "normalized": "cursos",
    "category": 0
  },
  {
    "normalized": "rejeitaroscookiesnaoessenciais",
    "category": 2
  },
  {
    "normalized": "gerirdefinicoes",
    "category": 3
  },
  {
    "normalized": "osnossos814parceiros",
    "category": 8
  },
  {
    "normalized": "discordo",
    "category": 2
  },
  {
    "normalized": "apenascookiesessenciais",
    "category": 2
  },
  {
    "normalized": "personalizardefinicoes",
    "category": 3
  },
  {
    "normalized": "simeuconcordo",
    "category": 1
  },
  {
    "normalized": "estritamentenecessario",
    "category": 2
  },
  {
    "normalized": "centrodepreferenciasdecookies",
    "category": 3
  },
  {
    "normalized": "aceitarrastreio",
    "category": 1
  },
  {
    "normalized": "gerirrastreio",
    "category": 3
  },
  {
    "normalized": "geriraspreferencias",
    "category": 3
  },
  {
    "normalized": "saibamaisepersonalize",
    "category": 3
  },
  {
    "normalized": "rejeitarcookiesnaoessenciais",
    "category": 2
  },
  {
    "normalized": "aceitoousodecookies",
    "category": 1
  },
  {
    "normalized": "concordarcomtodos",
    "category": 1
  },
  {
    "normalized": "personalizarasuaescolha",
    "category": 3
  },
  {
    "normalized": "definirpreferencias",
    "category": 3
  },
  {
    "normalized": "concordeecontinue",
    "category": 1
  },
  {
    "normalized": "preferenciasdeconsentimento",
    "category": 3
  },
  {
    "normalized": "definicoesdeanunciosavancadas",
    "category": 3
  },
  {
    "normalized": "politicadedadospessoais",
    "category": 0
  },
  {
    "normalized": "parceirosdepublicidade",
    "category": 8
  },
  {
    "normalized": "verfornecedores813",
    "category": 8
  },
  {
    "normalized": "verfinalidades",
    "category": 3
  },
  {
    "normalized": "simaceito",
    "category": 1
  },
  {
    "normalized": "cookiesnecessarias",
    "category": 2
  },
  {
    "normalized": "grupodewebsites",
    "category": 0
  },
  {
    "normalized": "conhecaosnossos776parceiros",
    "category": 8
  },
  {
    "normalized": "aceitotodasascookies",
    "category": 1
  },
  {
    "normalized": "cadocumentos",
    "category": 0
  },
  {
    "normalized": "caonline",
    "category": 0
  },
  {
    "normalized": "sustentabilidade",
    "category": 0
  },
  {
    "normalized": "ajuda",
    "category": 0
  },
  {
    "normalized": "rejeitarcookiesopcionais",
    "category": 2
  },
  {
    "normalized": "verosparceiros",
    "category": 8
  },
  {
    "normalized": "naoaceitarefechar",
    "category": 2
  },
  {
    "normalized": "aceitooscookies",
    "category": 1
  },
  {
    "normalized": "recusooscookies",
    "category": 2
  },
  {
    "normalized": "aceitarselecao",
    "category": 4
  },
  {
    "normalized": "subscrevaanewsletter",
    "category": 0
  },
  {
    "normalized": "+351",
    "category": 0
  },
  {
    "normalized": "configuracaodecookies",
    "category": 3
  },
  {
    "normalized": "gerir",
    "category": 3
  },
  {
    "normalized": "declinartodos",
    "category": 2
  },
  {
    "normalized": "formacao",
    "category": 0
  },
  {
    "normalized": "conhecaosnossos819parceiros",
    "category": 8
  },
  {
    "normalized": "allowallthecookies",
    "category": 1
  },
  {
    "normalized": "useonlytheneededcookies",
    "category": 2
  },
  {
    "normalized": "conselhogeral",
    "category": 0
  },
  {
    "normalized": "licenciaturas",
    "category": 0
  },
  {
    "normalized": "estudanteinternacional",
    "category": 0
  },
  {
    "normalized": "desporto",
    "category": 0
  },
  {
    "normalized": "bolsas",
    "category": 0
  },
  {
    "normalized": "estudar",
    "category": 0
  },
  {
    "normalized": "idinovacao",
    "category": 0
  },
  {
    "normalized": "idnoipl",
    "category": 0
  },
  {
    "normalized": "unidadesid",
    "category": 0
  },
  {
    "normalized": "inovacao",
    "category": 0
  },
  {
    "normalized": "comunidade",
    "category": 0
  },
  {
    "normalized": "politecnico",
    "category": 0
  },
  {
    "normalized": "orgaosdegoverno",
    "category": 0
  },
  {
    "normalized": "informacaodegestao",
    "category": 0
  },
  {
    "normalized": "outrosservicos",
    "category": 0
  },
  {
    "normalized": "recrutamento",
    "category": 0
  },
  {
    "normalized": "gestaoderiscos",
    "category": 0
  },
  {
    "normalized": "portuguesescolas",
    "category": 0
  },
  {
    "normalized": "portuguescolaboradores",
    "category": 0
  },
  {
    "normalized": "portuguesestudantes",
    "category": 0
  },
  {
    "normalized": "portuguesplataformas",
    "category": 0
  },
  {
    "normalized": "functionalityorcustomizationcookies",
    "category": 0
  },
  {
    "normalized": "definicoesdascookies",
    "category": 0
  },
  {
    "normalized": "aceitetudo",
    "category": 1
  },
  {
    "normalized": "visualizardefinicoesdecookies",
    "category": 3
  },
  {
    "normalized": "aceitarapenasoscookiesessenciais",
    "category": 2
  },
  {
    "normalized": "permitircookies",
    "category": 1
  },
  {
    "normalized": "relacoesbilaterais",
    "category": 0
  },
  {
    "normalized": "iniciarsessao",
    "category": 9
  },
  {
    "normalized": "portugues",
    "category": 0
  },
  {
    "normalized": "selecionarfinsindividuais",
    "category": 3
  },
  {
    "normalized": "conhecaosnossos894parceiros",
    "category": 8
  },
  {
    "normalized": "configurartodososcookies",
    "category": 3
  },
  {
    "normalized": "salvarselecao",
    "category": 4
  },
  {
    "normalized": "rejeitetudo",
    "category": 2
  },
  {
    "normalized": "presidentedarepublica",
    "category": 0
  },
  {
    "normalized": "atualidade",
    "category": 0
  },
  {
    "normalized": "iniciativas",
    "category": 0
  },
  {
    "normalized": "sairx",
    "category": 9
  },
  {
    "normalized": "naoajustar",
    "category": 3
  },
  {
    "normalized": "aceitoecompreendi",
    "category": 1
  },
  {
    "normalized": "definir",
    "category": 9
  },
  {
    "normalized": "apenascookiesnecessarios",
    "category": 2
  },
  {
    "normalized": "somenteessenciais",
    "category": 2
  },
  {
    "normalized": "continuarsemconsentimento",
    "category": 2
  },
  {
    "normalized": "personalizarasminhasescolhas",
    "category": 3
  },
  {
    "normalized": "verdefinicoesdecookies",
    "category": 3
  },
  {
    "normalized": "aceitartudoefechar",
    "category": 1
  },
  {
    "normalized": "833parceirosvejaosnossosparceiros",
    "category": 8
  },
  {
    "normalized": "semanunciospor399eurospormes",
    "category": 5
  },
  {
    "normalized": "entraraqui",
    "category": 9
  },
  {
    "normalized": "128parceiros",
    "category": 8
  },
  {
    "normalized": "assinar",
    "category": 0
  },
  {
    "normalized": "entendieaceito",
    "category": 1
  },
  {
    "normalized": "naoautorizo",
    "category": 2
  },
  {
    "normalized": "autorizo",
    "category": 1
  },
  {
    "normalized": "guardardefinicoes",
    "category": 4
  },
  {
    "normalized": "+recentes",
    "category": 0
  },
  {
    "normalized": "+visualizados",
    "category": 0
  },
  {
    "normalized": "filtrar",
    "category": 0
  },
  {
    "normalized": "ajusteassuaspreferencias",
    "category": 3
  },
  {
    "normalized": "hotelopholdiørskog",
    "category": 0
  },
  {
    "normalized": "quemsaoosindianosbasicamenteafricanosneandertaisedenisovanos",
    "category": 0
  },
  {
    "normalized": "chatbla",
    "category": 0
  },
  {
    "normalized": "casasdeapostas",
    "category": 0
  },
  {
    "normalized": "protecaodedados",
    "category": 0
  },
  {
    "normalized": "fichatecnica",
    "category": 0
  },
  {
    "normalized": "confirmarasminhasescolhas",
    "category": 4
  },
  {
    "normalized": "envioem7296horas",
    "category": 0
  },
  {
    "normalized": "politicadedevolucaode30dias",
    "category": 0
  },
  {
    "normalized": "fretegratisexcetoasilhas",
    "category": 0
  },
  {
    "normalized": "pagamentoemprestacoessemjuros",
    "category": 0
  },
  {
    "normalized": "livros",
    "category": 0
  },
  {
    "normalized": "ebooks",
    "category": 0
  },
  {
    "normalized": "audiolivros",
    "category": 0
  },
  {
    "normalized": "listas",
    "category": 0
  },
  {
    "normalized": "cesto",
    "category": 0
  },
  {
    "normalized": "cliente",
    "category": 0
  },
  {
    "normalized": "emportugues",
    "category": 0
  },
  {
    "normalized": "emingles",
    "category": 0
  },
  {
    "normalized": "emespanhol",
    "category": 0
  },
  {
    "normalized": "emfrances",
    "category": 0
  },
  {
    "normalized": "livrosescolares",
    "category": 0
  },
  {
    "normalized": "apoioescolar",
    "category": 0
  },
  {
    "normalized": "papelaria",
    "category": 0
  },
  {
    "normalized": "jogosebrinquedos",
    "category": 0
  },
  {
    "normalized": "apenasfuncionais",
    "category": 0
  },
  {
    "normalized": "paramim",
    "category": 0
  },
  {
    "normalized": "paraaminhaempresa",
    "category": 0
  },
  {
    "normalized": "serassociado",
    "category": 0
  },
  {
    "normalized": "institucional",
    "category": 0
  },
  {
    "normalized": "investorrelations",
    "category": 0
  },
  {
    "normalized": "abrirconta",
    "category": 0
  },
  {
    "normalized": "calculeoimpactodasuapegadaclimatica",
    "category": 0
  },
  {
    "normalized": "40dedesconto",
    "category": 0
  },
  {
    "normalized": "saibamaissobreasfuncionalidadesdoscookiesaqui",
    "category": 0
  },
  {
    "normalized": "osnossos57parceiros",
    "category": 8
  },
  {
    "normalized": "quemsomos",
    "category": 0
  },
  {
    "normalized": "areasdeatuacao",
    "category": 0
  },
  {
    "normalized": "gnrnomundo",
    "category": 0
  },
  {
    "normalized": "eservicos",
    "category": 0
  },
  {
    "normalized": "damosvalorasuaprivacidade",
    "category": 0
  },
  {
    "normalized": "oiefp",
    "category": 0
  },
  {
    "normalized": "emprego",
    "category": 0
  },
  {
    "normalized": "apoios",
    "category": 0
  },
  {
    "normalized": "parasabermaiscliqueaqui",
    "category": 3
  },
  {
    "normalized": "compreendoeaceito",
    "category": 1
  },
  {
    "normalized": "orgaos",
    "category": 0
  },
  {
    "normalized": "conselhodegestao",
    "category": 0
  },
  {
    "normalized": "comissaodeeticadoinstitutopolitecnicodecoimbra",
    "category": 0
  },
  {
    "normalized": "publicitacaodeatos",
    "category": 0
  },
  {
    "normalized": "empregopublico",
    "category": 0
  },
  {
    "normalized": "sigqipc",
    "category": 0
  },
  {
    "normalized": "gavip",
    "category": 0
  },
  {
    "normalized": "valorizacaoprofissionaleinovacaopedagogica",
    "category": 0
  },
  {
    "normalized": "avaliacaodedesempenho",
    "category": 0
  },
  {
    "normalized": "identidadevisual",
    "category": 0
  },
  {
    "normalized": "diplomadosdasviasprofissionalizantes",
    "category": 0
  },
  {
    "normalized": "legislacao|regulamentos",
    "category": 0
  },
  {
    "normalized": "mobilidadeinternacional",
    "category": 0
  },
  {
    "normalized": "erasmusuniaoeuropeia",
    "category": 0
  },
  {
    "normalized": "erasmusforadauniaoeuropeiaicm",
    "category": 0
  },
  {
    "normalized": "centroculturalpenedodasaudadedigital",
    "category": 0
  },
  {
    "normalized": "associacoesdeestudantes",
    "category": 0
  },
  {
    "normalized": "i2ainstitutodeinvestigacaoaplicada",
    "category": 0
  },
  {
    "normalized": "centrosdeinvestigacaoelaboratorios",
    "category": 0
  },
  {
    "normalized": "projetosebolsasnoipc",
    "category": 0
  },
  {
    "normalized": "prestacaodeservicosacomunidade",
    "category": 0
  },
  {
    "normalized": "saudebemestar",
    "category": 0
  },
  {
    "normalized": "observatorio",
    "category": 0
  },
  {
    "normalized": "boaspraticasambientais",
    "category": 0
  },
  {
    "normalized": "aceitotodos",
    "category": 1
  },
  {
    "normalized": "rejeitotodos",
    "category": 2
  },
  {
    "normalized": "escolasinstitutos",
    "category": 0
  },
  {
    "normalized": "mestrados",
    "category": 0
  },
  {
    "normalized": "doutoramentos",
    "category": 0
  },
  {
    "normalized": "posgraduacoes",
    "category": 0
  },
  {
    "normalized": "cursosonline",
    "category": 0
  },
  {
    "normalized": "cursosdeespecializacao",
    "category": 0
  },
  {
    "normalized": "cursosprr",
    "category": 0
  },
  {
    "normalized": "unidadescurricularesisoladas",
    "category": 0
  },
  {
    "normalized": "concursolocal",
    "category": 0
  },
  {
    "normalized": "concursonacional",
    "category": 0
  },
  {
    "normalized": "concursosespeciais",
    "category": 0
  },
  {
    "normalized": "reingressomudancadecursoetransferencia",
    "category": 0
  },
  {
    "normalized": "cliciplcentrodelinguasecultura",
    "category": 0
  },
  {
    "normalized": "informacaoacademica",
    "category": 0
  },
  {
    "normalized": "projetoseparcerias",
    "category": 0
  },
  {
    "normalized": "equipa",
    "category": 0
  },
  {
    "normalized": "conheceroipl",
    "category": 0
  },
  {
    "normalized": "iplopendays",
    "category": 0
  },
  {
    "normalized": "diasabertos",
    "category": 0
  },
  {
    "normalized": "veraonoipl",
    "category": 0
  },
  {
    "normalized": "feiraseducativas",
    "category": 0
  },
  {
    "normalized": "viveroipl",
    "category": 0
  },
  {
    "normalized": "apoioaoaluno",
    "category": 0
  },
  {
    "normalized": "estruturasdeapoio",
    "category": 0
  },
  {
    "normalized": "premiosebolsas",
    "category": 0
  },
  {
    "normalized": "vidaacademica",
    "category": 0
  },
  {
    "normalized": "reconhecimentodegraus",
    "category": 0
  },
  {
    "normalized": "reconhecimentoautomatico",
    "category": 0
  },
  {
    "normalized": "reconhecimentodenivel",
    "category": 0
  },
  {
    "normalized": "reconhecimentoespecifico",
    "category": 0
  },
  {
    "normalized": "politicadeid",
    "category": 0
  },
  {
    "normalized": "projetosdeid",
    "category": 0
  },
  {
    "normalized": "programasdeestudodeposdoutoramento",
    "category": 0
  },
  {
    "normalized": "unidadesfinanciamentofct",
    "category": 0
  },
  {
    "normalized": "outrasunidades",
    "category": 0
  },
  {
    "normalized": "idica",
    "category": 0
  },
  {
    "normalized": "empreendedorismo",
    "category": 0
  },
  {
    "normalized": "propriedadeintelectual",
    "category": 0
  },
  {
    "normalized": "politecid",
    "category": 0
  },
  {
    "normalized": "publicacoes",
    "category": 0
  },
  {
    "normalized": "caminhosdoconhecimento",
    "category": 0
  },
  {
    "normalized": "estudosereflexoes",
    "category": 0
  },
  {
    "normalized": "repositoriodoipl",
    "category": 0
  },
  {
    "normalized": "mobilidade",
    "category": 0
  },
  {
    "normalized": "erasmus+",
    "category": 0
  },
  {
    "normalized": "foradaeuropa",
    "category": 0
  },
  {
    "normalized": "antesdechegar",
    "category": 0
  },
  {
    "normalized": "candidaturas",
    "category": 0
  },
  {
    "normalized": "resultados",
    "category": 0
  },
  {
    "normalized": "1afase",
    "category": 0
  },
  {
    "normalized": "descobrirlisboa",
    "category": 0
  },
  {
    "normalized": "descobriroipl",
    "category": 0
  },
  {
    "normalized": "relacoesinternacionais",
    "category": 0
  },
  {
    "normalized": "cplp",
    "category": 0
  },
  {
    "normalized": "ureka",
    "category": 0
  },
  {
    "normalized": "parcerias",
    "category": 0
  },
  {
    "normalized": "cursosdeverao",
    "category": 0
  },
  {
    "normalized": "alumni",
    "category": 0
  },
  {
    "normalized": "empregabilidade",
    "category": 0
  },
  {
    "normalized": "ensinoadistancia",
    "category": 0
  },
  {
    "normalized": "espacoartes",
    "category": 0
  },
  {
    "normalized": "projetonextlevelprr",
    "category": 0
  },
  {
    "normalized": "missaoevalores",
    "category": 0
  },
  {
    "normalized": "presidente",
    "category": 0
  },
  {
    "normalized": "despachos",
    "category": 0
  },
  {
    "normalized": "intervencoes",
    "category": 0
  },
  {
    "normalized": "planoquadrienal",
    "category": 0
  },
  {
    "normalized": "planodeatividades",
    "category": 0
  },
  {
    "normalized": "relatoriodeatividades",
    "category": 0
  },
  {
    "normalized": "quadrodeavaliacaoeresponsabilizacao",
    "category": 0
  },
  {
    "normalized": "qualidade",
    "category": 0
  },
  {
    "normalized": "politicaparaaqualidade",
    "category": 0
  },
  {
    "normalized": "estruturadaqualidade",
    "category": 0
  },
  {
    "normalized": "avaliacaointerna",
    "category": 0
  },
  {
    "normalized": "avaliacaoexterna",
    "category": 0
  },
  {
    "normalized": "comunicacao",
    "category": 0
  },
  {
    "normalized": "identidade",
    "category": 0
  },
  {
    "normalized": "brochurasefolhetos",
    "category": 0
  },
  {
    "normalized": "imagensereportagens",
    "category": 0
  },
  {
    "normalized": "iplnosmedia",
    "category": 0
  },
  {
    "normalized": "comunicacaocomosmedia",
    "category": 0
  },
  {
    "normalized": "politicaambiental",
    "category": 0
  },
  {
    "normalized": "ecoipl",
    "category": 0
  },
  {
    "normalized": "campussustentavel",
    "category": 0
  },
  {
    "normalized": "responsabilidadesocial",
    "category": 0
  },
  {
    "normalized": "premiosedistincoesdoipl",
    "category": 0
  },
  {
    "normalized": "titulodeespecialista",
    "category": 0
  },
  {
    "normalized": "legislacao",
    "category": 0
  },
  {
    "normalized": "calendariodeprovas",
    "category": 0
  },
  {
    "normalized": "areasdetituloespecialista",
    "category": 0
  },
  {
    "normalized": "honoriscausa",
    "category": 0
  },
  {
    "normalized": "legislacaoeoutrosdocumentos",
    "category": 0
  },
  {
    "normalized": "politecnicodelisboa",
    "category": 0
  },
  {
    "normalized": "consultapublica",
    "category": 0
  },
  {
    "normalized": "estatutos",
    "category": 0
  },
  {
    "normalized": "regulamentos",
    "category": 0
  },
  {
    "normalized": "outrosdocumentos",
    "category": 0
  },
  {
    "normalized": "legislacaogeral",
    "category": 0
  },
  {
    "normalized": "legislacaopessoaldocente",
    "category": 0
  },
  {
    "normalized": "legislacaopessoalnaodocente",
    "category": 0
  },
  {
    "normalized": "ensinosuperior",
    "category": 0
  },
  {
    "normalized": "normasfinanceiraseorcamentais",
    "category": 0
  },
  {
    "normalized": "contratacaopublica",
    "category": 0
  },
  {
    "normalized": "comunicacaoeimagem",
    "category": 0
  },
  {
    "normalized": "gestaoacademica",
    "category": 0
  },
  {
    "normalized": "gestaofinanceira",
    "category": 0
  },
  {
    "normalized": "projetosespeciaiseinovacao",
    "category": 0
  },
  {
    "normalized": "relacoesinternacionaisemobilidadeacademica",
    "category": 0
  },
  {
    "normalized": "gestaoderecursoshumanos",
    "category": 0
  },
  {
    "normalized": "publicitacaodevinculacao",
    "category": 0
  },
  {
    "normalized": "mapaserelatorios",
    "category": 0
  },
  {
    "normalized": "servicodesaudeocupacional",
    "category": 0
  },
  {
    "normalized": "sistemasdeinformacaoecomunicacoes",
    "category": 0
  },
  {
    "normalized": "apoiotecnico",
    "category": 0
  },
  {
    "normalized": "assessoriajuridica",
    "category": 0
  },
  {
    "normalized": "auditoriaecontrolointerno",
    "category": 0
  },
  {
    "normalized": "contratacaoepatrimonio",
    "category": 0
  },
  {
    "normalized": "qualidadeeacreditacao",
    "category": 0
  },
  {
    "normalized": "settingcookies",
    "category": 3
  },
  {
    "normalized": "mostrarmais",
    "category": 3
  },
  {
    "normalized": "cookiesstrictlynecessary",
    "category": 2
  },
  {
    "normalized": "guardareaceitar",
    "category": 1
  },
  {
    "normalized": "sobrecookies",
    "category": 3
  },
  {
    "normalized": "selecionaroscookies",
    "category": 3
  },
  {
    "normalized": "sobre",
    "category": 3
  },
  {
    "normalized": "diretoriodeperfis",
    "category": 0
  },
  {
    "normalized": "atalhosdoteclado",
    "category": 0
  },
  {
    "normalized": "opcoes",
    "category": 3
  },
  {
    "normalized": "voos",
    "category": 0
  },
  {
    "normalized": "carros",
    "category": 0
  },
  {
    "normalized": "pacotes",
    "category": 0
  },
  {
    "normalized": "inscricao",
    "category": 0
  },
  {
    "normalized": "entendi",
    "category": 1
  },
  {
    "normalized": "politicadeprivacidadeecookies",
    "category": 0
  },
  {
    "normalized": "subscrevernewsletter",
    "category": 0
  },
  {
    "normalized": "englishversion",
    "category": 0
  },
  {
    "normalized": "osnossos823parceiros",
    "category": 8
  },
  {
    "normalized": "definirosmeusparametros",
    "category": 3
  },
  {
    "normalized": "slots",
    "category": 0
  },
  {
    "normalized": "jogosdemesa",
    "category": 0
  },
  {
    "normalized": "casinoplaytech",
    "category": 0
  },
  {
    "normalized": "apostasdesportivas",
    "category": 0
  },
  {
    "normalized": "apostasaovivo",
    "category": 0
  },
  {
    "normalized": "promocoes",
    "category": 0
  },
  {
    "normalized": "saibamaissobreousodecookies",
    "category": 3
  },
  {
    "normalized": "naomostrarestamensagemnovamente",
    "category": 8
  },
  {
    "normalized": "armazenareouacederainformacoesnumdispositivo",
    "category": 0
  },
  {
    "normalized": "conteudospersonalizadosmedicaodeconteudoseestudosdeaudiencia",
    "category": 0
  },
  {
    "normalized": "utilizarperfisparaselecionarpublicidadepersonalizada",
    "category": 0
  },
  {
    "normalized": "desenvolveremelhorarservicos",
    "category": 0
  },
  {
    "normalized": "utilizardadosdegeolocalizacaoprecisos",
    "category": 0
  },
  {
    "normalized": "procurarativamenteascaracteristicasdodispositivoparaidentificacao",
    "category": 0
  },
  {
    "normalized": "informacaolegal",
    "category": 0
  },
  {
    "normalized": "publicidadebaseadaemdadoslimitadosperfildepublicidadepersonalizadoemedicaodepublicidade",
    "category": 0
  },
  {
    "normalized": "dinheirovivo",
    "category": 0
  },
  {
    "normalized": "ojogo",
    "category": 0
  },
  {
    "normalized": "motor24",
    "category": 0
  },
  {
    "normalized": "menshealth",
    "category": 0
  },
  {
    "normalized": "womenshealth",
    "category": 0
  },
  {
    "normalized": "evasoes",
    "category": 0
  },
  {
    "normalized": "voltaaomundo",
    "category": 0
  },
  {
    "normalized": "delas",
    "category": 0
  },
  {
    "normalized": "classificados",
    "category": 0
  },
  {
    "normalized": "ouviremdireto",
    "category": 0
  },
  {
    "normalized": "reportagemtsf",
    "category": 0
  },
  {
    "normalized": "politica",
    "category": 0
  },
  {
    "normalized": "mundo",
    "category": 0
  },
  {
    "normalized": "ultimas",
    "category": 0
  },
  {
    "normalized": "compreendi",
    "category": 1
  },
  {
    "normalized": "gerirasminhasescolhas",
    "category": 3
  },
  {
    "normalized": "apenasnecessarios",
    "category": 2
  },
  {
    "normalized": "приемам",
    "category": 1
  },
  {
    "normalized": "настроики",
    "category": 3
  },
  {
    "normalized": "разбрах",
    "category": 1
  },
  {
    "normalized": "съгласявамсе",
    "category": 1
  },
  {
    "normalized": "разрешивсички",
    "category": 1
  },
  {
    "normalized": "покажидетаили",
    "category": 3
  },
  {
    "normalized": "настроикинабисквитките",
    "category": 3
  },
  {
    "normalized": "научетеповече→",
    "category": 3
  },
  {
    "normalized": "приеманеизатваряне",
    "category": 1
  },
  {
    "normalized": "приемивсички",
    "category": 1
  },
  {
    "normalized": "отказ",
    "category": 2
  },
  {
    "normalized": "персонализация",
    "category": 3
  },
  {
    "normalized": "приеманенавсичкибисквитки",
    "category": 1
  },
  {
    "normalized": "показваненацелите",
    "category": 3
  },
  {
    "normalized": "съгласенсъм",
    "category": 1
  },
  {
    "normalized": "прегледнабисквитки",
    "category": 3
  },
  {
    "normalized": "съгласие",
    "category": 1
  },
  {
    "normalized": "приемане",
    "category": 1
  },
  {
    "normalized": "ощеопции",
    "category": 3
  },
  {
    "normalized": "ок",
    "category": 1
  },
  {
    "normalized": "нашите51партньори",
    "category": 8
  },
  {
    "normalized": "приеми",
    "category": 1
  },
  {
    "normalized": "вижповече",
    "category": 3
  },
  {
    "normalized": "повечеинформация",
    "category": 3
  },
  {
    "normalized": "партньори",
    "category": 8
  },
  {
    "normalized": "детаили",
    "category": 3
  },
  {
    "normalized": "отказвам",
    "category": 2
  },
  {
    "normalized": "отхвърляненавсички",
    "category": 2
  },
  {
    "normalized": "списъкспартньоридоставчици",
    "category": 8
  },
  {
    "normalized": "откажи",
    "category": 2
  },
  {
    "normalized": "отхвърляненавсичкибисквитки",
    "category": 2
  },
  {
    "normalized": "разбирам",
    "category": 1
  },
  {
    "normalized": "позволиизбора",
    "category": 4
  },
  {
    "normalized": "покажетеподробности",
    "category": 3
  },
  {
    "normalized": "приеметевсички",
    "category": 1
  },
  {
    "normalized": "предпочитаниязабисквитки",
    "category": 3
  },
  {
    "normalized": "позволивсичкибисквитки",
    "category": 1
  },
  {
    "normalized": "прочететеоще",
    "category": 3
  },
  {
    "normalized": "отхвърливсички",
    "category": 2
  },
  {
    "normalized": "предпочитания",
    "category": 3
  },
  {
    "normalized": "контакти",
    "category": 0
  },
  {
    "normalized": "отхвърляненезадължителнитебисквитки",
    "category": 2
  },
  {
    "normalized": "разрешивсичкибисквитки",
    "category": 1
  },
  {
    "normalized": "отхвърлетевсички",
    "category": 2
  },
  {
    "normalized": "затвори",
    "category": 1
  },
  {
    "normalized": "променинастроиките",
    "category": 3
  },
  {
    "normalized": "добре",
    "category": 1
  },
  {
    "normalized": "регистрация",
    "category": 0
  },
  {
    "normalized": "тук",
    "category": 8
  },
  {
    "normalized": "необходими",
    "category": 2
  },
  {
    "normalized": "cookieconsentchange",
    "category": 3
  },
  {
    "normalized": "запишииприеми",
    "category": 1
  },
  {
    "normalized": "регистрациявписване",
    "category": 9
  },
  {
    "normalized": "изберетерегион",
    "category": 0
  },
  {
    "normalized": "запазетепредпочитанията",
    "category": 4
  },
  {
    "normalized": "продуктииоферти",
    "category": 0
  },
  {
    "normalized": "доставкизабизнеса",
    "category": 0
  },
  {
    "normalized": "информацияиуслуги",
    "category": 0
  },
  {
    "normalized": "детаилнинастроики",
    "category": 3
  },
  {
    "normalized": "откаживсички",
    "category": 2
  },
  {
    "normalized": "самонеобходимитебисквитки",
    "category": 2
  },
  {
    "normalized": "съгласенсъмпродължи",
    "category": 1
  },
  {
    "normalized": "промянананастроиките",
    "category": 3
  },
  {
    "normalized": "разрешавамвсички",
    "category": 1
  },
  {
    "normalized": "самотехническинеобходимитебисквитки",
    "category": 2
  },
  {
    "normalized": "повечеинформацияиуправление",
    "category": 3
  },
  {
    "normalized": "отказваненавсичкибисквитки",
    "category": 2
  },
  {
    "normalized": "управлениенапредпочитанията",
    "category": 3
  },
  {
    "normalized": "запази",
    "category": 4
  },
  {
    "normalized": "декларациябисквитки",
    "category": 0
  },
  {
    "normalized": "аналитични",
    "category": 9
  },
  {
    "normalized": "рекламни",
    "category": 0
  },
  {
    "normalized": "приемамизползванетонабисквитки",
    "category": 1
  },
  {
    "normalized": "отричам",
    "category": 2
  },
  {
    "normalized": "научиповече",
    "category": 0
  },
  {
    "normalized": "несъмсъгласен",
    "category": 2
  },
  {
    "normalized": "приемамвсичкицели",
    "category": 1
  },
  {
    "normalized": "покажиподробности",
    "category": 3
  },
  {
    "normalized": "задома",
    "category": 0
  },
  {
    "normalized": "заофиса",
    "category": 0
  },
  {
    "normalized": "други",
    "category": 0
  },
  {
    "normalized": "потвърждавамизбора",
    "category": 4
  },
  {
    "normalized": "списъксдоставчици",
    "category": 8
  },
  {
    "normalized": "съхраняваненаиилидостъпдоинформациянаустроиство",
    "category": 0
  },
  {
    "normalized": "използваненаограничениданнизаизборнареклама",
    "category": 0
  },
  {
    "normalized": "създаваненапрофилизаперсонализиранареклама",
    "category": 0
  },
  {
    "normalized": "използваненапрофилизаизборнаперсонализиранареклама",
    "category": 0
  },
  {
    "normalized": "създаваненапрофилисцелперсонализираненасъдържанието",
    "category": 0
  },
  {
    "normalized": "използваненапрофилизаизборнаперсонализираносъдържанието",
    "category": 0
  },
  {
    "normalized": "политиказаповерителност",
    "category": 0
  },
  {
    "normalized": "управление",
    "category": 0
  },
  {
    "normalized": "заприложението",
    "category": 9
  },
  {
    "normalized": "некоригираите",
    "category": 3
  },
  {
    "normalized": "продължи",
    "category": 1
  },
  {
    "normalized": "персонализираи",
    "category": 3
  },
  {
    "normalized": "подробности",
    "category": 3
  },
  {
    "normalized": "забранибисквитките",
    "category": 2
  },
  {
    "normalized": "разрешибисквитките",
    "category": 1
  },
  {
    "normalized": "неприемам",
    "category": 2
  },
  {
    "normalized": "настроикизаизползваненабисквитки",
    "category": 3
  },
  {
    "normalized": "политиказаизползваненабисквитки",
    "category": 0
  },
  {
    "normalized": "персонализираитенастроиките",
    "category": 3
  },
  {
    "normalized": "приемамвсичкобисквитки",
    "category": 1
  },
  {
    "normalized": "отхвърляне",
    "category": 2
  },
  {
    "normalized": "персонализиране",
    "category": 3
  },
  {
    "normalized": "отказвамвсичкинезадължителни",
    "category": 2
  },
  {
    "normalized": "доверенипартньори",
    "category": 8
  },
  {
    "normalized": "управлениенанастроиките",
    "category": 3
  },
  {
    "normalized": "неблагодаря",
    "category": 2
  },
  {
    "normalized": "дасъгласявамсе",
    "category": 1
  },
  {
    "normalized": "отхвърлите",
    "category": 2
  },
  {
    "normalized": "дасъгласенсъм",
    "category": 1
  },
  {
    "normalized": "персонализиранинастроики",
    "category": 3
  },
  {
    "normalized": "приеманенабисквитките",
    "category": 1
  },
  {
    "normalized": "управлениенабисквитки",
    "category": 3
  },
  {
    "normalized": "позволисамонеобходимите",
    "category": 2
  },
  {
    "normalized": "покажиповече",
    "category": 3
  },
  {
    "normalized": "заланаславата",
    "category": 0
  },
  {
    "normalized": "помощ",
    "category": 0
  },
  {
    "normalized": "отговорнаигра",
    "category": 0
  },
  {
    "normalized": "казино",
    "category": 0
  },
  {
    "normalized": "наживо",
    "category": 0
  },
  {
    "normalized": "промоции",
    "category": 0
  },
  {
    "normalized": "колелонеколела",
    "category": 0
  },
  {
    "normalized": "карта",
    "category": 0
  },
  {
    "normalized": "турнири",
    "category": 0
  },
  {
    "normalized": "настроикинабисквитки",
    "category": 3
  },
  {
    "normalized": "употребатанабисквитки",
    "category": 0
  },
  {
    "normalized": "запазете",
    "category": 4
  },
  {
    "normalized": "приемамусловията",
    "category": 1
  },
  {
    "normalized": "продължетебездаприемате",
    "category": 2
  },
  {
    "normalized": "абонираисе",
    "category": 9
  },
  {
    "normalized": "<назад",
    "category": 0
  },
  {
    "normalized": "напред>",
    "category": 0
  },
  {
    "normalized": "заглавие",
    "category": 0
  },
  {
    "normalized": "къмсаита",
    "category": 1
  },
  {
    "normalized": "конфигуриране",
    "category": 3
  },
  {
    "normalized": "редактиране",
    "category": 3
  },
  {
    "normalized": "вашитеправа",
    "category": 0
  },
  {
    "normalized": "строгонеобходими",
    "category": 0
  },
  {
    "normalized": "ефективност",
    "category": 0
  },
  {
    "normalized": "функционалност",
    "category": 0
  },
  {
    "normalized": "таргетиране",
    "category": 0
  },
  {
    "normalized": "режимнасъгласиезатрафик",
    "category": 0
  },
  {
    "normalized": "забравенапарола",
    "category": 0
  },
  {
    "normalized": "входсимеил",
    "category": 0
  },
  {
    "normalized": "политиказаизползваненабисквиткивадминсофтиадминсофтплюс",
    "category": 0
  },
  {
    "normalized": "затовакакможедасеоткажешоттях",
    "category": 0
  },
  {
    "normalized": "разшири",
    "category": 0
  },
  {
    "normalized": "позволяваненавсичкибисквитки",
    "category": 1
  },
  {
    "normalized": "политиказазащитанаданните",
    "category": 0
  },
  {
    "normalized": "настроикизаповерителност",
    "category": 3
  },
  {
    "normalized": "входзаклиенти",
    "category": 0
  },
  {
    "normalized": "нашите12партньори",
    "category": 8
  },
  {
    "normalized": "откажете",
    "category": 2
  },
  {
    "normalized": "политиказазащитаналичнитеданни",
    "category": 0
  },
  {
    "normalized": "промокод5",
    "category": 0
  },
  {
    "normalized": "приложения",
    "category": 0
  },
  {
    "normalized": "прочетохисесъгласявам",
    "category": 1
  },
  {
    "normalized": "академиченсъстав",
    "category": 0
  },
  {
    "normalized": "биц",
    "category": 0
  },
  {
    "normalized": "кариери",
    "category": 0
  },
  {
    "normalized": "симцентър",
    "category": 0
  },
  {
    "normalized": "събития",
    "category": 0
  },
  {
    "normalized": "профилнакупувача",
    "category": 0
  },
  {
    "normalized": "занас",
    "category": 0
  },
  {
    "normalized": "студенти",
    "category": 0
  },
  {
    "normalized": "факултети",
    "category": 0
  },
  {
    "normalized": "сдо",
    "category": 0
  },
  {
    "normalized": "научнадеиност",
    "category": 0
  },
  {
    "normalized": "международнадеиност",
    "category": 0
  },
  {
    "normalized": "проекти",
    "category": 0
  },
  {
    "normalized": "стандартен",
    "category": 0
  },
  {
    "normalized": "поголям",
    "category": 0
  },
  {
    "normalized": "наиголям",
    "category": 0
  },
  {
    "normalized": "нормаленконтраст",
    "category": 0
  },
  {
    "normalized": "високконтраст",
    "category": 0
  },
  {
    "normalized": "повечеопции",
    "category": 3
  },
  {
    "normalized": "самонеобходимибисквитки",
    "category": 2
  },
  {
    "normalized": "декларациязаповерителност",
    "category": 0
  },
  {
    "normalized": "управлениенаопциите",
    "category": 3
  },
  {
    "normalized": "чат",
    "category": 0
  },
  {
    "normalized": "съгласенсъмсбисквитките",
    "category": 1
  },
  {
    "normalized": "137доставчикилисъответнодоставчикавtcfи65рекламнипартньора",
    "category": 8
  },
  {
    "normalized": "политикатазабисквитките",
    "category": 0
  },
  {
    "normalized": "научиповечеинастроики",
    "category": 3
  },
  {
    "normalized": "политиказабисквитките",
    "category": 0
  },
  {
    "normalized": "управлениенасъгласието",
    "category": 3
  },
  {
    "normalized": "приеманенавсички",
    "category": 1
  },
  {
    "normalized": "съгласен",
    "category": 1
  },
  {
    "normalized": "приеманенанеобходимитебисквитки",
    "category": 2
  },
  {
    "normalized": "прогнози0",
    "category": 0
  },
  {
    "normalized": "споразумение",
    "category": 8
  },
  {
    "normalized": "относноприложението",
    "category": 0
  },
  {
    "normalized": "допълнителнаинформация",
    "category": 0
  },
  {
    "normalized": "cloudcart",
    "category": 0
  },
  {
    "normalized": "запазинастроиките",
    "category": 4
  },
  {
    "normalized": "advertisingpartners",
    "category": 0
  },
  {
    "normalized": "18advertisingpartners",
    "category": 0
  },
  {
    "normalized": "declineallcookies",
    "category": 2
  },
  {
    "normalized": "open",
    "category": 0
  },
  {
    "normalized": "customsettings",
    "category": 3
  },
  {
    "normalized": "assurance",
    "category": 0
  },
  {
    "normalized": "accountancy",
    "category": 0
  },
  {
    "normalized": "advisory",
    "category": 0
  },
  {
    "normalized": "corporate",
    "category": 0
  },
  {
    "normalized": "skippageheaderandnavigation",
    "category": 0
  },
  {
    "normalized": "naccetta",
    "category": 1
  },
  {
    "normalized": "saveaccept",
    "category": 4
  },
  {
    "normalized": "currentstudents",
    "category": 0
  },
  {
    "normalized": "staff",
    "category": 0
  },
  {
    "normalized": "nonnecessary",
    "category": 9
  },
  {
    "normalized": "prihvatisve",
    "category": 1
  },
  {
    "normalized": "prihvacam",
    "category": 1
  },
  {
    "normalized": "postavke",
    "category": 3
  },
  {
    "normalized": "prihvacamsve",
    "category": 1
  },
  {
    "normalized": "prihvatiizatvori",
    "category": 1
  },
  {
    "normalized": "slazemse",
    "category": 1
  },
  {
    "normalized": "neprihvacam",
    "category": 2
  },
  {
    "normalized": "postavkekolacica",
    "category": 3
  },
  {
    "normalized": "saznajtevise→",
    "category": 3
  },
  {
    "normalized": "prikazidetalje",
    "category": 8
  },
  {
    "normalized": "odbijsve",
    "category": 2
  },
  {
    "normalized": "prihvatitesvekolacice",
    "category": 1
  },
  {
    "normalized": "dopustisve",
    "category": 1
  },
  {
    "normalized": "prilagodi",
    "category": 3
  },
  {
    "normalized": "postavkezakolacice",
    "category": 3
  },
  {
    "normalized": "prihvatisvekolacice",
    "category": 1
  },
  {
    "normalized": "saznajvise",
    "category": 3
  },
  {
    "normalized": "dopustiselektiranje",
    "category": 4
  },
  {
    "normalized": "prihvati",
    "category": 1
  },
  {
    "normalized": "prihvacamodabrane",
    "category": 4
  },
  {
    "normalized": "prilagodipostavke",
    "category": 3
  },
  {
    "normalized": "odbij",
    "category": 2
  },
  {
    "normalized": "omogucisvekolacice",
    "category": 1
  },
  {
    "normalized": "prihvacamsamoneophodno",
    "category": 2
  },
  {
    "normalized": "uskrati",
    "category": 2
  },
  {
    "normalized": "prihvatikolacice",
    "category": 1
  },
  {
    "normalized": "prihvatitesve",
    "category": 1
  },
  {
    "normalized": "privola",
    "category": 0
  },
  {
    "normalized": "pojedinosti",
    "category": 3
  },
  {
    "normalized": "odbacisve",
    "category": 2
  },
  {
    "normalized": "uredi",
    "category": 3
  },
  {
    "normalized": "uredu",
    "category": 1
  },
  {
    "normalized": "nas811partneri",
    "category": 8
  },
  {
    "normalized": "prihvacamkolacice",
    "category": 1
  },
  {
    "normalized": "viseopcija",
    "category": 3
  },
  {
    "normalized": "onama",
    "category": 0
  },
  {
    "normalized": "odbiti",
    "category": 2
  },
  {
    "normalized": "razumijem",
    "category": 1
  },
  {
    "normalized": "prilagodite",
    "category": 3
  },
  {
    "normalized": "upravljanjepostavkama",
    "category": 3
  },
  {
    "normalized": "nasa853partnera",
    "category": 8
  },
  {
    "normalized": "visemogucnosti",
    "category": 3
  },
  {
    "normalized": "odbijamsve",
    "category": 2
  },
  {
    "normalized": "prihvatinuzne",
    "category": 2
  },
  {
    "normalized": "politikakolacica",
    "category": 0
  },
  {
    "normalized": "ovdje",
    "category": 8
  },
  {
    "normalized": "pravilaprivatnosti",
    "category": 0
  },
  {
    "normalized": "spremipostavke",
    "category": 3
  },
  {
    "normalized": "postavkamakolacica",
    "category": 3
  },
  {
    "normalized": "prihvacamsvekolacice",
    "category": 1
  },
  {
    "normalized": "prikazivise",
    "category": 3
  },
  {
    "normalized": "samopotrebnikolacici",
    "category": 2
  },
  {
    "normalized": "viseinformacija",
    "category": 8
  },
  {
    "normalized": "kolacici",
    "category": 0
  },
  {
    "normalized": "prihvacamsamonuzne",
    "category": 2
  },
  {
    "normalized": "dozvolisve",
    "category": 1
  },
  {
    "normalized": "pristanak",
    "category": 1
  },
  {
    "normalized": "promijenipostavke",
    "category": 3
  },
  {
    "normalized": "neslazemse",
    "category": 2
  },
  {
    "normalized": "odbijizatvori",
    "category": 2
  },
  {
    "normalized": "pristajemnaobveznekolacice",
    "category": 2
  },
  {
    "normalized": "prihvatiodabrano",
    "category": 4
  },
  {
    "normalized": "nas807partneri",
    "category": 8
  },
  {
    "normalized": "odbijsvekolacice",
    "category": 2
  },
  {
    "normalized": "postavkama",
    "category": 3
  },
  {
    "normalized": "tojeuredu",
    "category": 1
  },
  {
    "normalized": "prihvacamsamonuznekolacice",
    "category": 2
  },
  {
    "normalized": "prijava",
    "category": 0
  },
  {
    "normalized": "nastavitesneophodnimkolacicima",
    "category": 2
  },
  {
    "normalized": "nastavitesasvimkolacicima",
    "category": 1
  },
  {
    "normalized": "upravljajkolacicima",
    "category": 3
  },
  {
    "normalized": "okolacicima",
    "category": 0
  },
  {
    "normalized": "pohranaiilipristuppodacimanauređaju",
    "category": 0
  },
  {
    "normalized": "koristenjeogranicenihpodatakazaodabiroglasavanja",
    "category": 0
  },
  {
    "normalized": "kreiranjeprofilazapersonaliziranooglasavanje",
    "category": 0
  },
  {
    "normalized": "koristenjeprofilazaodabirpersonaliziranogoglasavanja",
    "category": 0
  },
  {
    "normalized": "kreiranjeprofilazapersonaliziranjesadrzaja",
    "category": 0
  },
  {
    "normalized": "koristenjeprofilazaodabirpersonaliziranogsadrzaja",
    "category": 0
  },
  {
    "normalized": "azurirajtekolacice",
    "category": 3
  },
  {
    "normalized": "prihvatinuznekolacice",
    "category": 2
  },
  {
    "normalized": "prihvatipreporuceno",
    "category": 1
  },
  {
    "normalized": "upravljanjekolacicima",
    "category": 3
  },
  {
    "normalized": "nuzni",
    "category": 0
  },
  {
    "normalized": "nastavibezprihvacanja",
    "category": 2
  },
  {
    "normalized": "dijeluspojedinostima",
    "category": 0
  },
  {
    "normalized": "slazemseinastavljam",
    "category": 1
  },
  {
    "normalized": "prilagoditepostavke",
    "category": 3
  },
  {
    "normalized": "politikazastiteprivatnosti",
    "category": 0
  },
  {
    "normalized": "nastavikupovatinaaboutyouhr",
    "category": 0
  },
  {
    "normalized": "spremimojepostavke",
    "category": 4
  },
  {
    "normalized": "52trecih",
    "category": 0
  },
  {
    "normalized": "iacceptandagree",
    "category": 1
  },
  {
    "normalized": "prikazivisepojedinosti",
    "category": 3
  },
  {
    "normalized": "odbijamsveosimneophodnog",
    "category": 2
  },
  {
    "normalized": "dobavljaci755",
    "category": 8
  },
  {
    "normalized": "pristanakzasve",
    "category": 1
  },
  {
    "normalized": "pouzdanihpartnera",
    "category": 0
  },
  {
    "normalized": "azurirajtepostavke",
    "category": 3
  },
  {
    "normalized": "individualnepostavkeprivatnosti",
    "category": 3
  },
  {
    "normalized": "prihvatitesamoosnovnekolacice",
    "category": 2
  },
  {
    "normalized": "politikaprivatnosti",
    "category": 0
  },
  {
    "normalized": "odbijam",
    "category": 2
  },
  {
    "normalized": "podesavanjakolacica",
    "category": 3
  },
  {
    "normalized": "popisdobavljaca",
    "category": 0
  },
  {
    "normalized": "samoneophodnikolacici",
    "category": 2
  },
  {
    "normalized": "naprednepostavke",
    "category": 3
  },
  {
    "normalized": "prihvatikolacicecookies",
    "category": 1
  },
  {
    "normalized": "prikazipodrobnosti",
    "category": 3
  },
  {
    "normalized": "koristitisamoneophodno",
    "category": 2
  },
  {
    "normalized": "prilagoditekolacic",
    "category": 3
  },
  {
    "normalized": "zatvori",
    "category": 1
  },
  {
    "normalized": "poslovni",
    "category": 0
  },
  {
    "normalized": "građani",
    "category": 0
  },
  {
    "normalized": "javnatijela",
    "category": 0
  },
  {
    "normalized": "politicikolacica",
    "category": 0
  },
  {
    "normalized": "nasih1402partnera",
    "category": 8
  },
  {
    "normalized": "pristajem",
    "category": 1
  },
  {
    "normalized": "upravljaj",
    "category": 3
  },
  {
    "normalized": "nastavitepregledavatibezprihvacanja>",
    "category": 2
  },
  {
    "normalized": "prihvatisamoobavezne",
    "category": 2
  },
  {
    "normalized": "konfiguracija",
    "category": 3
  },
  {
    "normalized": "prihvacamneophodne",
    "category": 2
  },
  {
    "normalized": "informacije",
    "category": 0
  },
  {
    "normalized": "funkcionalnikolacici",
    "category": 0
  },
  {
    "normalized": "statistickikolacici",
    "category": 0
  },
  {
    "normalized": "pogledajtenase867partnere",
    "category": 8
  },
  {
    "normalized": "prihvatisamonuzno",
    "category": 2
  },
  {
    "normalized": "nonpotrebno",
    "category": 9
  },
  {
    "normalized": "pregledajtekolacice",
    "category": 3
  },
  {
    "normalized": "pokazidetalje",
    "category": 0
  },
  {
    "normalized": "odbijtesveosimneophodnih",
    "category": 2
  },
  {
    "normalized": "viseinformacijaokolacicimamozeteprocitatiovdje",
    "category": 0
  },
  {
    "normalized": "prikazipojedinosti",
    "category": 3
  },
  {
    "normalized": "naprednepostavkekolacica",
    "category": 3
  },
  {
    "normalized": "prihvatisamoneophodnekolacice",
    "category": 2
  },
  {
    "normalized": "uredipostavke",
    "category": 3
  },
  {
    "normalized": "dozvolitekolacice",
    "category": 1
  },
  {
    "normalized": "promijenitepostavkeprivatnosti",
    "category": 3
  },
  {
    "normalized": "suglasansam",
    "category": 1
  },
  {
    "normalized": "odreditepostavke",
    "category": 3
  },
  {
    "normalized": "prihvatisamonuznekolacice",
    "category": 2
  },
  {
    "normalized": "pogledajtenase851partnere",
    "category": 8
  },
  {
    "normalized": "odaberi",
    "category": 3
  },
  {
    "normalized": "izmijenipostavkekolacica",
    "category": 3
  },
  {
    "normalized": "dopustamodabrane",
    "category": 4
  },
  {
    "normalized": "prihvatisamooznacene",
    "category": 4
  },
  {
    "normalized": "samoobvezno",
    "category": 2
  },
  {
    "normalized": "elektronickuprivolu",
    "category": 8
  },
  {
    "normalized": "vecprimamnewsletter",
    "category": 0
  },
  {
    "normalized": "agreeproceed",
    "category": 1
  },
  {
    "normalized": "viseokolacicimamozeteprocitatiovdje",
    "category": 0
  },
  {
    "normalized": "prihvacamsveponuđene",
    "category": 1
  },
  {
    "normalized": "idirektservisi",
    "category": 0
  },
  {
    "normalized": "individualnepostavke",
    "category": 3
  },
  {
    "normalized": "klikniovdjezaviseinformacijaokolacicima",
    "category": 0
  },
  {
    "normalized": "dozvolitesvekolacice",
    "category": 1
  },
  {
    "normalized": "prihvacamnuzne",
    "category": 2
  },
  {
    "normalized": "ureditepostavke",
    "category": 3
  },
  {
    "normalized": "popiskolacica",
    "category": 8
  },
  {
    "normalized": "otvoriizbornik",
    "category": 3
  },
  {
    "normalized": "onemogucisve",
    "category": 2
  },
  {
    "normalized": "odobrisveizatvori",
    "category": 1
  },
  {
    "normalized": "prihvatisamopotrebno",
    "category": 2
  },
  {
    "normalized": "ustedjeti",
    "category": 4
  },
  {
    "normalized": "procitajvise",
    "category": 3
  },
  {
    "normalized": "samonuznikolacici",
    "category": 2
  },
  {
    "normalized": "samoosnovno",
    "category": 2
  },
  {
    "normalized": "postavipostavke",
    "category": 3
  },
  {
    "normalized": "scitech",
    "category": 0
  },
  {
    "normalized": "viral",
    "category": 0
  },
  {
    "normalized": "prebacisenaaboutyoudk",
    "category": 0
  },
  {
    "normalized": "postavkeprivatnosti",
    "category": 3
  },
  {
    "normalized": "pokazivise",
    "category": 3
  },
  {
    "normalized": "uvjetiiodredbe",
    "category": 0
  },
  {
    "normalized": "zastitapodataka",
    "category": 0
  },
  {
    "normalized": "odbitiusluge",
    "category": 2
  },
  {
    "normalized": "uredipostavkecookiescookies",
    "category": 3
  },
  {
    "normalized": "pretrazitewebtrgovinu",
    "category": 0
  },
  {
    "normalized": "postavkeoglasa",
    "category": 3
  },
  {
    "normalized": "osobnipodaciikakoihstitimo",
    "category": 0
  },
  {
    "normalized": "otisak",
    "category": 0
  },
  {
    "normalized": "nasipartneri",
    "category": 8
  },
  {
    "normalized": "pogledajtenasepartnere",
    "category": 8
  },
  {
    "normalized": "opceinformacijeozastitiosobnihpodataka",
    "category": 0
  },
  {
    "normalized": "detaljnije",
    "category": 0
  },
  {
    "normalized": "wwwekupihr",
    "category": 0
  },
  {
    "normalized": "pravilimaprivatnosti",
    "category": 0
  },
  {
    "normalized": "pravilimaopostupanjuskolacicima",
    "category": 8
  },
  {
    "normalized": "funkcionalnost",
    "category": 0
  },
  {
    "normalized": "analiza",
    "category": 0
  },
  {
    "normalized": "personalizacijasadrzajaoglasavanjaianaliza",
    "category": 0
  },
  {
    "normalized": "spremisave",
    "category": 4
  },
  {
    "normalized": "podrobno",
    "category": 0
  },
  {
    "normalized": "izjavuokolacicima",
    "category": 0
  },
  {
    "normalized": "izbornik",
    "category": 9
  },
  {
    "normalized": "nas22partneri",
    "category": 8
  },
  {
    "normalized": "prihvatineophodno",
    "category": 2
  },
  {
    "normalized": "drustvenemreze",
    "category": 0
  },
  {
    "normalized": "mjerenjeperformansioglasavanja",
    "category": 0
  },
  {
    "normalized": "mjerenjeperformansisadrzaja",
    "category": 0
  },
  {
    "normalized": "razvojipoboljsanjeusluga",
    "category": 0
  },
  {
    "normalized": "koristenjepreciznihgeolokacijskihpodataka",
    "category": 0
  },
  {
    "normalized": "aktivnoskeniranjekarakteristikauređajazaidentifikaciju",
    "category": 0
  },
  {
    "normalized": "ostalo",
    "category": 0
  },
  {
    "normalized": "zabrani",
    "category": 2
  },
  {
    "normalized": "pogledajpostavke",
    "category": 3
  },
  {
    "normalized": "osnovnoifunkcionalno",
    "category": 0
  },
  {
    "normalized": "obaveznikolacici",
    "category": 0
  },
  {
    "normalized": "podesavanje",
    "category": 3
  },
  {
    "normalized": "potreban",
    "category": 9
  },
  {
    "normalized": "opciuvjetiposlovanja",
    "category": 0
  },
  {
    "normalized": "prikazipostavke",
    "category": 3
  },
  {
    "normalized": "izjavaozastitipodataka",
    "category": 0
  },
  {
    "normalized": "partnerima",
    "category": 0
  },
  {
    "normalized": "policaokolacicima",
    "category": 0
  },
  {
    "normalized": "odbacisvekolacice",
    "category": 2
  },
  {
    "normalized": "upravljanjepreferencama",
    "category": 3
  },
  {
    "normalized": "opceuvjetekoristenja",
    "category": 0
  },
  {
    "normalized": "proizvodiiusluge",
    "category": 0
  },
  {
    "normalized": "istrazivanja",
    "category": 0
  },
  {
    "normalized": "korisneinformacije",
    "category": 0
  },
  {
    "normalized": "zelimsurfatibezcookies",
    "category": 2
  },
  {
    "normalized": "statisticki",
    "category": 0
  },
  {
    "normalized": "marketinski",
    "category": 0
  },
  {
    "normalized": "trazi",
    "category": 0
  },
  {
    "normalized": "mobilnipaketi",
    "category": 0
  },
  {
    "normalized": "uređaji",
    "category": 0
  },
  {
    "normalized": "eonpaketi",
    "category": 0
  },
  {
    "normalized": "zastotelemach",
    "category": 0
  },
  {
    "normalized": "povucigdprcookieprivolu",
    "category": 2
  },
  {
    "normalized": "detalji",
    "category": 3
  },
  {
    "normalized": "oaplikaciji",
    "category": 0
  },
  {
    "normalized": "ustawienia",
    "category": 3
  },
  {
    "normalized": "akceptujwszystkie",
    "category": 1
  },
  {
    "normalized": "zezwolnawszystkie",
    "category": 1
  },
  {
    "normalized": "dostosuj",
    "category": 3
  },
  {
    "normalized": "nasipartnerzy876",
    "category": 0
  },
  {
    "normalized": "pokazszczegoły",
    "category": 3
  },
  {
    "normalized": "odrzucwszystkie",
    "category": 2
  },
  {
    "normalized": "zgadzamsie",
    "category": 1
  },
  {
    "normalized": "zaakceptujwszystkie",
    "category": 1
  },
  {
    "normalized": "ustawieniaplikowcookie",
    "category": 3
  },
  {
    "normalized": "spersonalizuj",
    "category": 3
  },
  {
    "normalized": "oplikachcookie",
    "category": 3
  },
  {
    "normalized": "ustawienzaawansowanych",
    "category": 8
  },
  {
    "normalized": "nasipartnerzy",
    "category": 0
  },
  {
    "normalized": "rozumiem",
    "category": 1
  },
  {
    "normalized": "zmienustawienia",
    "category": 3
  },
  {
    "normalized": "akceptujwszystkieplikicookie",
    "category": 1
  },
  {
    "normalized": "listapartnerowdostawcow",
    "category": 0
  },
  {
    "normalized": "odmowa",
    "category": 2
  },
  {
    "normalized": "szczegoły",
    "category": 3
  },
  {
    "normalized": "akceptujwszystko",
    "category": 1
  },
  {
    "normalized": "zaakceptuj",
    "category": 1
  },
  {
    "normalized": "odrzuc",
    "category": 2
  },
  {
    "normalized": "zgodanawszystkie",
    "category": 1
  },
  {
    "normalized": "zezwolnawybor",
    "category": 1
  },
  {
    "normalized": "iagreeandgotothewebsite",
    "category": 1
  },
  {
    "normalized": "iagreeandgotothesite",
    "category": 1
  },
  {
    "normalized": "odrzucwszystko",
    "category": 2
  },
  {
    "normalized": "ustawieniapreferencji",
    "category": 3
  },
  {
    "normalized": "naszymi859partnerami",
    "category": 0
  },
  {
    "normalized": "dostosujzgody",
    "category": 3
  },
  {
    "normalized": "zaakceptujwszystko",
    "category": 1
  },
  {
    "normalized": "naszychpartnerowreklamowych827",
    "category": 0
  },
  {
    "normalized": "zarzadzajcookies",
    "category": 3
  },
  {
    "normalized": "zarzadzaniepreferencjami",
    "category": 3
  },
  {
    "normalized": "politykaprywatnosci",
    "category": 9
  },
  {
    "normalized": "nieakceptuje",
    "category": 2
  },
  {
    "normalized": "odrzucwszystkieplikicookie",
    "category": 2
  },
  {
    "normalized": "partnerzy",
    "category": 0
  },
  {
    "normalized": "zaakceptujikontynuuj",
    "category": 1
  },
  {
    "normalized": "ustawieniareklam",
    "category": 8
  },
  {
    "normalized": "iunderstandclosethisinfo",
    "category": 1
  },
  {
    "normalized": "zaakceptujizamknij",
    "category": 1
  },
  {
    "normalized": "odrzucam",
    "category": 2
  },
  {
    "normalized": "ourcookiesandbasicsofprocessing",
    "category": 8
  },
  {
    "normalized": "cookiesofourpartnersandtheirbasisforprocessing",
    "category": 8
  },
  {
    "normalized": "listazaufanychpartnerow",
    "category": 9
  },
  {
    "normalized": "kontynuujbezakceptacji",
    "category": 2
  },
  {
    "normalized": "tylkoniezbedne",
    "category": 1
  },
  {
    "normalized": "partnerow",
    "category": 0
  },
  {
    "normalized": "ustawieniacookies",
    "category": 3
  },
  {
    "normalized": "plikicookie",
    "category": 9
  },
  {
    "normalized": "zaufanymipartneramiiab813",
    "category": 9
  },
  {
    "normalized": "innymizaufanymipartnerami489",
    "category": 0
  },
  {
    "normalized": "tylkoteniezbedne",
    "category": 1
  },
  {
    "normalized": "wporzadku",
    "category": 1
  },
  {
    "normalized": "korzystajwyłaczniezniezbednychplikowcookie",
    "category": 1
  },
  {
    "normalized": "zarzadzajustawieniami",
    "category": 3
  },
  {
    "normalized": "polityceprywatnosci",
    "category": 8
  },
  {
    "normalized": "zezwolnaniezbedne",
    "category": 1
  },
  {
    "normalized": "146tcfvendorsand63adpartners",
    "category": 9
  },
  {
    "normalized": "wiecej",
    "category": 3
  },
  {
    "normalized": "kontynuujbezakceptacjiplikowcookie",
    "category": 2
  },
  {
    "normalized": "wyrazamzgode",
    "category": 1
  },
  {
    "normalized": "zarzadzajzgodamicookies",
    "category": 3
  },
  {
    "normalized": "zmieniamustawienia",
    "category": 3
  },
  {
    "normalized": "zaakceptujwszystkieplikicookie",
    "category": 1
  },
  {
    "normalized": "wyszukajdomene",
    "category": 0
  },
  {
    "normalized": "odmowic",
    "category": 2
  },
  {
    "normalized": "wiecejopcji",
    "category": 3
  },
  {
    "normalized": "tylkowymagane",
    "category": 1
  },
  {
    "normalized": "niezezwalaj",
    "category": 2
  },
  {
    "normalized": "edytujustawienia",
    "category": 3
  },
  {
    "normalized": "tylkoniezbedneplikicookie",
    "category": 1
  },
  {
    "normalized": "dostosujustawienia",
    "category": 3
  },
  {
    "normalized": "wiecejociasteczkach",
    "category": 3
  },
  {
    "normalized": "zarzadzajpreferencjami",
    "category": 3
  },
  {
    "normalized": "zaakceptujiprzejdzdoserwisu",
    "category": 1
  },
  {
    "normalized": "tutajmozeszodmowiczgody",
    "category": 2
  },
  {
    "normalized": "nasipartnerzy128partnerow",
    "category": 0
  },
  {
    "normalized": "zaufanipartnerzyiab126partnerow",
    "category": 0
  },
  {
    "normalized": "akceptujcookies",
    "category": 1
  },
  {
    "normalized": "wiecejszczegołow",
    "category": 3
  },
  {
    "normalized": "wiecejinformacji",
    "category": 3
  },
  {
    "normalized": "zezwolnawybraneprzezemnie",
    "category": 1
  },
  {
    "normalized": "okrozumiem",
    "category": 1
  },
  {
    "normalized": "zapiszopcje",
    "category": 4
  },
  {
    "normalized": "odrzucamnieobowiazkowe",
    "category": 8
  },
  {
    "normalized": "potwierdzamwszystkie",
    "category": 1
  },
  {
    "normalized": "ochronadanych",
    "category": 8
  },
  {
    "normalized": "zarzadzaj",
    "category": 3
  },
  {
    "normalized": "preferencje",
    "category": 3
  },
  {
    "normalized": "akceptujeniezbedne",
    "category": 1
  },
  {
    "normalized": "ustawieniapikowcookies",
    "category": 3
  },
  {
    "normalized": "zgadzamsienawszystkie",
    "category": 1
  },
  {
    "normalized": "zarzadzajpreferencjamiplikowcookie",
    "category": 3
  },
  {
    "normalized": "akceptujplikicookies",
    "category": 1
  },
  {
    "normalized": "niezbedne",
    "category": 1
  },
  {
    "normalized": "komfortceleanalityczne",
    "category": 9
  },
  {
    "normalized": "ustawcele",
    "category": 3
  },
  {
    "normalized": "otworzustawienia",
    "category": 3
  },
  {
    "normalized": "takzgadzamsie",
    "category": 1
  },
  {
    "normalized": "dopasujustawienia",
    "category": 3
  },
  {
    "normalized": "kontynuujbezwyrazaniazgody→",
    "category": 2
  },
  {
    "normalized": "partnerami",
    "category": 0
  },
  {
    "normalized": "akceptujwybrane",
    "category": 1
  },
  {
    "normalized": "potwierdzammojezgody",
    "category": 1
  },
  {
    "normalized": "podstawowy",
    "category": 9
  },
  {
    "normalized": "politycecookiegrupypzu",
    "category": 0
  },
  {
    "normalized": "polityceprywatnoscigrupypzu",
    "category": 0
  },
  {
    "normalized": "ustawieniachzaawansowanych",
    "category": 3
  },
  {
    "normalized": "dopasujmojeustawienia",
    "category": 3
  },
  {
    "normalized": "pozwolmiwybrac",
    "category": 3
  },
  {
    "normalized": "czytajwiecej",
    "category": 3
  },
  {
    "normalized": "przejdzdosklepu",
    "category": 9
  },
  {
    "normalized": "pokazwszystkichpartnerow801→",
    "category": 0
  },
  {
    "normalized": "oswiadczenieoplikachcookie",
    "category": 9
  },
  {
    "normalized": "przejdzdostrony",
    "category": 8
  },
  {
    "normalized": "centrumprywatnosci",
    "category": 9
  },
  {
    "normalized": "300innychstroninternetowych",
    "category": 0
  },
  {
    "normalized": "bezreklamza399zamiesiac",
    "category": 0
  },
  {
    "normalized": "zalogujsietutaj",
    "category": 0
  },
  {
    "normalized": "128partnerzy",
    "category": 0
  },
  {
    "normalized": "zaufanychpartnerowziab838firm",
    "category": 0
  },
  {
    "normalized": "niedziekuje",
    "category": 2
  },
  {
    "normalized": "zarzadzajplikamicookies",
    "category": 3
  },
  {
    "normalized": "tutaj",
    "category": 9
  },
  {
    "normalized": "zamknijpasekcookies",
    "category": 8
  },
  {
    "normalized": "nasipartnerzy38",
    "category": 0
  },
  {
    "normalized": "dlaciebie",
    "category": 8
  },
  {
    "normalized": "dlafirmy",
    "category": 0
  },
  {
    "normalized": "dladewelopera",
    "category": 0
  },
  {
    "normalized": "dlaecommerce",
    "category": 0
  },
  {
    "normalized": "sklepy",
    "category": 0
  },
  {
    "normalized": "domenyissl",
    "category": 0
  },
  {
    "normalized": "narzedzia",
    "category": 8
  },
  {
    "normalized": "inspiracje",
    "category": 0
  },
  {
    "normalized": "pomoc",
    "category": 8
  },
  {
    "normalized": "our428partners",
    "category": 0
  },
  {
    "normalized": "funkcjonalneianalityczneplikicookie",
    "category": 9
  },
  {
    "normalized": "reklamoweiprofilujaceplikicookie",
    "category": 9
  },
  {
    "normalized": "ofirmie",
    "category": 0
  },
  {
    "normalized": "politykaprywatnosciiplikowcookie",
    "category": 8
  },
  {
    "normalized": "niewyrazamzgodynastosowanieplikowcookies",
    "category": 2
  },
  {
    "normalized": "wyrazamzgodenastosowanieplikowcookies",
    "category": 1
  },
  {
    "normalized": "akceptujpolitykaprywatnosci",
    "category": 1
  },
  {
    "normalized": "dostosujplikicookie",
    "category": 3
  },
  {
    "normalized": "producenci",
    "category": 0
  },
  {
    "normalized": "niepokazujwiecejtegopowiadomienia",
    "category": 8
  },
  {
    "normalized": "listazaufanychpartnerowiab",
    "category": 0
  },
  {
    "normalized": "politykaprywatnoscimediamarkt",
    "category": 8
  },
  {
    "normalized": "listapodmiotowprowadzacychsklepymediamarkt",
    "category": 0
  },
  {
    "normalized": "listaciasteczekipodobnychtechnologii",
    "category": 8
  },
  {
    "normalized": "twojkoszyk0",
    "category": 0
  },
  {
    "normalized": "polityceochronyprywatnosci",
    "category": 0
  },
  {
    "normalized": "zasadachcookies",
    "category": 3
  },
  {
    "normalized": "nieprzejdzdoserwisu",
    "category": 2
  },
  {
    "normalized": "takprzejdzdoserwisu",
    "category": 1
  },
  {
    "normalized": "analytical",
    "category": 0
  },
  {
    "normalized": "politycecookies",
    "category": 0
  },
  {
    "normalized": "wyswietlwiecej",
    "category": 3
  },
  {
    "normalized": "polityceplikowcookie",
    "category": 0
  },
  {
    "normalized": "preferencjedotyczaceplikowcookie",
    "category": 3
  },
  {
    "normalized": "stronagłownapromocjekasynonazywoturniejeklubviptopwygranepomocgrajodpowiedzialnie",
    "category": 0
  },
  {
    "normalized": "zalogujsie",
    "category": 0
  },
  {
    "normalized": "przechowywanieinformacjinaurzadzeniulubdostepdonich",
    "category": 0
  },
  {
    "normalized": "reklamyopartenaograniczonychdanychspersonalizowanyprofilreklamowyipomiarreklam",
    "category": 0
  },
  {
    "normalized": "spersonalizowanetrescipomiartresciibadanieodbiorcow",
    "category": 0
  },
  {
    "normalized": "wykorzystanieprofilidowyboruspersonalizowanychreklam",
    "category": 0
  },
  {
    "normalized": "rozwojiulepszanieusług",
    "category": 0
  },
  {
    "normalized": "uzyciedokładnychdanychgeolokalizacyjnych",
    "category": 0
  },
  {
    "normalized": "aktywneskanowaniecharakterystykiurzadzeniadocelowidentyfikacji",
    "category": 0
  },
  {
    "normalized": "zaufanipartnerzycyfrowegopolsatu",
    "category": 0
  },
  {
    "normalized": "rozumiemiakceptuje",
    "category": 1
  },
  {
    "normalized": "hyvaksykaikki",
    "category": 1
  },
  {
    "normalized": "asetukset",
    "category": 3
  },
  {
    "normalized": "evasteasetukset",
    "category": 3
  },
  {
    "normalized": "naytatiedot",
    "category": 3
  },
  {
    "normalized": "hyvaksy",
    "category": 1
  },
  {
    "normalized": "vainvalttamattomat",
    "category": 1
  },
  {
    "normalized": "sallikaikkievasteet",
    "category": 1
  },
  {
    "normalized": "hyvaksykaikkievasteet",
    "category": 1
  },
  {
    "normalized": "sallikaikki",
    "category": 1
  },
  {
    "normalized": "hylkaakaikki",
    "category": 2
  },
  {
    "normalized": "tietojentallentaminenlaitteellejatailaitteellaolevientietojenkaytto",
    "category": 0
  },
  {
    "normalized": "tarkkojensijaintitietojenkayttaminen",
    "category": 9
  },
  {
    "normalized": "laitteenominaisuuksienkayttaminentunnistamistavarten",
    "category": 9
  },
  {
    "normalized": "muokkaaasetuksia",
    "category": 3
  },
  {
    "normalized": "vainvalttamattomatevasteet",
    "category": 1
  },
  {
    "normalized": "rajoitettuihintietoihinjamainonnanmittaukseenperustuvamainonta",
    "category": 0
  },
  {
    "normalized": "kohdennettumainonta",
    "category": 0
  },
  {
    "normalized": "personoitusisaltosisallonmittaaminenyleisotutkimusjapalvelujenkehittaminen",
    "category": 0
  },
  {
    "normalized": "tietoturvavaarinkaytostenehkaiseminenjavirheidenkorjaaminen",
    "category": 0
  },
  {
    "normalized": "mainonnanjasisallontekninenjakelu",
    "category": 0
  },
  {
    "normalized": "kiella",
    "category": 2
  },
  {
    "normalized": "hyvaksynvainvalttamattomatevasteet",
    "category": 1
  },
  {
    "normalized": "kumppaneineen69",
    "category": 9
  },
  {
    "normalized": "sanomanverkostosta",
    "category": 0
  },
  {
    "normalized": "tietosuoja",
    "category": 9
  },
  {
    "normalized": "lisaavaihtoehtoja",
    "category": 3
  },
  {
    "normalized": "palvelujenkehittaminenjaparantaminen",
    "category": 0
  },
  {
    "normalized": "teknologiakumppanit",
    "category": 0
  },
  {
    "normalized": "kumppanit",
    "category": 0
  },
  {
    "normalized": "evastekaytannot",
    "category": 8
  },
  {
    "normalized": "tietosuojalauseke",
    "category": 8
  },
  {
    "normalized": "sallivalinta",
    "category": 1
  },
  {
    "normalized": "sanomanverkosto",
    "category": 0
  },
  {
    "normalized": "sivustoilla",
    "category": 0
  },
  {
    "normalized": "muokkaaasetuksiasi",
    "category": 3
  },
  {
    "normalized": "tallennaasetukset",
    "category": 3
  },
  {
    "normalized": "kieltaydy",
    "category": 2
  },
  {
    "normalized": "tietoa",
    "category": 9
  },
  {
    "normalized": "tietoja",
    "category": 3
  },
  {
    "normalized": "kaikkipalvelut",
    "category": 0
  },
  {
    "normalized": "hyvaksyvalttamattomat",
    "category": 1
  },
  {
    "normalized": "hyvaksyevasteet",
    "category": 1
  },
  {
    "normalized": "suostumus",
    "category": 8
  },
  {
    "normalized": "kohdennettumainontajapersonoitusisaltomainonnanjasisallonmittaaminensekayleisotutkimus",
    "category": 0
  },
  {
    "normalized": "lisatietojaevasteista",
    "category": 3
  },
  {
    "normalized": "muokkaa",
    "category": 3
  },
  {
    "normalized": "tietoaevasteista",
    "category": 3
  },
  {
    "normalized": "yksityiskohdat",
    "category": 3
  },
  {
    "normalized": "jatkavalttamattomilla",
    "category": 1
  },
  {
    "normalized": "sallivainvalttamattomatevasteet",
    "category": 1
  },
  {
    "normalized": "sallivainvalttamattomat",
    "category": 2
  },
  {
    "normalized": "luelisaa",
    "category": 3
  },
  {
    "normalized": "luelisaaevasteista",
    "category": 3
  },
  {
    "normalized": "mukautavalintoja",
    "category": 3
  },
  {
    "normalized": "kohdennettumainontajapersonoitusisaltomainonnanjasisallonmittausyleisotutkimusjapalvelujenkehittaminen",
    "category": 0
  },
  {
    "normalized": "tilastolliset",
    "category": 0
  },
  {
    "normalized": "markkinointi",
    "category": 0
  },
  {
    "normalized": "valitsekaikki",
    "category": 8
  },
  {
    "normalized": "sallivalitut",
    "category": 1
  },
  {
    "normalized": "hyvaksyvainvalttamattomat",
    "category": 1
  },
  {
    "normalized": "valttamattomat",
    "category": 1
  },
  {
    "normalized": "kumppaneidemme54",
    "category": 0
  },
  {
    "normalized": "muutaasetuksia",
    "category": 3
  },
  {
    "normalized": "muokkaaevasteasetuksia",
    "category": 3
  },
  {
    "normalized": "toiminnalliset",
    "category": 8
  },
  {
    "normalized": "kirjaudu",
    "category": 0
  },
  {
    "normalized": "hylkaa",
    "category": 2
  },
  {
    "normalized": "kolmannenosapuolentoimittajat",
    "category": 0
  },
  {
    "normalized": "estakaikki",
    "category": 2
  },
  {
    "normalized": "valttamaton",
    "category": 1
  },
  {
    "normalized": "sallivainpakollisetevasteet",
    "category": 1
  },
  {
    "normalized": "toimittajineen70kpl",
    "category": 0
  },
  {
    "normalized": "lisatietoja",
    "category": 3
  },
  {
    "normalized": "evasteilmoitus",
    "category": 2
  },
  {
    "normalized": "kiellakaikki",
    "category": 2
  },
  {
    "normalized": "tallennavalinnat",
    "category": 1
  },
  {
    "normalized": "estaevasteet",
    "category": 2
  },
  {
    "normalized": "teenmuutoksia",
    "category": 3
  },
  {
    "normalized": "naytakayttotarkoitukset",
    "category": 3
  },
  {
    "normalized": "vara185partners",
    "category": 0
  },
  {
    "normalized": "naytaevasteet",
    "category": 3
  },
  {
    "normalized": "sallivalitutevasteet",
    "category": 1
  },
  {
    "normalized": "luokittelemattomat",
    "category": 0
  },
  {
    "normalized": "vainpakolliset",
    "category": 1
  },
  {
    "normalized": "muutaevasteasetuksia",
    "category": 3
  },
  {
    "normalized": "muokkaaevastevalintoja",
    "category": 3
  },
  {
    "normalized": "naytaevasteasetukset",
    "category": 3
  },
  {
    "normalized": "evasteasetuksista",
    "category": 3
  },
  {
    "normalized": "muutaevastevalintoja",
    "category": 3
  },
  {
    "normalized": "mitaevasteetovatjamihinniitakaytetaan",
    "category": 0
  },
  {
    "normalized": "evasteidenhallinta",
    "category": 3
  },
  {
    "normalized": "valitseitse",
    "category": 8
  },
  {
    "normalized": "maaritaasetukset",
    "category": 3
  },
  {
    "normalized": "suomeksi",
    "category": 0
  },
  {
    "normalized": "kiellaevasteet",
    "category": 2
  },
  {
    "normalized": "mukautaasetuksia",
    "category": 3
  },
  {
    "normalized": "kumppanit79",
    "category": 0
  },
  {
    "normalized": "hallitseasetuksia",
    "category": 3
  },
  {
    "normalized": "tiedonkeruu",
    "category": 0
  },
  {
    "normalized": "mikaonevaste",
    "category": 0
  },
  {
    "normalized": "saadaevasteasetuksia",
    "category": 3
  },
  {
    "normalized": "kumppanientoimittajienluettelo",
    "category": 0
  },
  {
    "normalized": "voitkieltaytyasuostumuksestasitaalla",
    "category": 2
  },
  {
    "normalized": "hallitseevasteita",
    "category": 3
  },
  {
    "normalized": "showcookiesettings",
    "category": 3
  },
  {
    "normalized": "finland",
    "category": 0
  },
  {
    "normalized": "hallitse",
    "category": 0
  },
  {
    "normalized": "sallivalttamattomatevasteet",
    "category": 1
  },
  {
    "normalized": "essentialsonly",
    "category": 1
  },
  {
    "normalized": "valitsehyvaksyttavat",
    "category": 1
  },
  {
    "normalized": "okkaikkiin",
    "category": 1
  },
  {
    "normalized": "kaytavainvalttamattomiaevasteita",
    "category": 1
  },
  {
    "normalized": "hyvaksynvainsivustonvalttamattomatevasteet",
    "category": 1
  },
  {
    "normalized": "hyvaksyvainpakollinen",
    "category": 1
  },
  {
    "normalized": "sallievasteet",
    "category": 1
  },
  {
    "normalized": "hyvaksyjajatka",
    "category": 1
  },
  {
    "normalized": "onlystrictlynecessarycookies",
    "category": 1
  },
  {
    "normalized": "sallivainpakolliset",
    "category": 1
  },
  {
    "normalized": "okvalttamattomiin",
    "category": 1
  },
  {
    "normalized": "columns",
    "category": 0
  },
  {
    "normalized": "chinanews",
    "category": 0
  },
  {
    "normalized": "cookiessdktjawebseurantakaytanto",
    "category": 0
  },
  {
    "normalized": "evastekaytanto",
    "category": 0
  },
  {
    "normalized": "tuoteryhmat",
    "category": 0
  },
  {
    "normalized": "jatkailmanhyvaksyntaa",
    "category": 2
  },
  {
    "normalized": "teeloytoja",
    "category": 0
  },
  {
    "normalized": "liitymyhobbyhallklubiin",
    "category": 0
  },
  {
    "normalized": "myymarketplacessa",
    "category": 0
  },
  {
    "normalized": "katsokaikkikampanjat",
    "category": 0
  },
  {
    "normalized": "muokkaaevasteasetuksiasi",
    "category": 3
  },
  {
    "normalized": "haluanitsevalitaevasteet",
    "category": 3
  },
  {
    "normalized": "enhyvaksy",
    "category": 2
  },
  {
    "normalized": "sinunevasteasetuksesi",
    "category": 3
  },
  {
    "normalized": "naytalisatietoja",
    "category": 3
  },
  {
    "normalized": "35kumppania",
    "category": 0
  },
  {
    "normalized": "kolmannenosapuolenteknologiatoimittajat",
    "category": 8
  },
  {
    "normalized": "hylkaavalinnaiset",
    "category": 2
  },
  {
    "normalized": "tillatenbartobligatoriska",
    "category": 1
  },
  {
    "normalized": "jatkanvainvalttamattomilla",
    "category": 1
  },
  {
    "normalized": "hyvaksyvalttamattomatevasteet",
    "category": 1
  },
  {
    "normalized": "vaihdaasetuksia",
    "category": 3
  },
  {
    "normalized": "tietosuojalausunnossa",
    "category": 8
  },
  {
    "normalized": "puhelimet",
    "category": 0
  },
  {
    "normalized": "tietokoneet",
    "category": 0
  },
  {
    "normalized": "tabletit",
    "category": 0
  },
  {
    "normalized": "applepalvelut",
    "category": 0
  },
  {
    "normalized": "nettikotiin",
    "category": 0
  },
  {
    "normalized": "yhteystiedot",
    "category": 0
  },
  {
    "normalized": "suljeasetukset",
    "category": 3
  },
  {
    "normalized": "luelisaajamukautaasetuksia",
    "category": 3
  },
  {
    "normalized": "evasteetovatok",
    "category": 1
  },
  {
    "normalized": "allowonlyessentials",
    "category": 1
  },
  {
    "normalized": "jatkavalituilla",
    "category": 1
  },
  {
    "normalized": "vaintarpeellinen",
    "category": 1
  },
  {
    "normalized": "schibstedintekemaatuotekehitystapersonointiamarkkinointiajamainontaavarten",
    "category": 0
  },
  {
    "normalized": "hallitsesuostumuksia",
    "category": 3
  },
  {
    "normalized": "samarbetspartners",
    "category": 0
  },
  {
    "normalized": "selva",
    "category": 1
  },
  {
    "normalized": "evasteet",
    "category": 9
  },
  {
    "normalized": "jatkavalttamattomillaevasteilla",
    "category": 1
  },
  {
    "normalized": "teliadot",
    "category": 0
  },
  {
    "normalized": "naytayksityiskohdat",
    "category": 3
  },
  {
    "normalized": "liittymatulkomailla",
    "category": 0
  },
  {
    "normalized": "muutavalintoja",
    "category": 3
  },
  {
    "normalized": "eisaada",
    "category": 3
  },
  {
    "normalized": "asetapreferenssit",
    "category": 3
  },
  {
    "normalized": "termsandconditionsforthesite",
    "category": 0
  },
  {
    "normalized": "learnmoreaboutcookiesonthisisfinlandfi",
    "category": 8
  },
  {
    "normalized": "necessarytechnicalcookies",
    "category": 1
  },
  {
    "normalized": "eatanddrink",
    "category": 0
  },
  {
    "normalized": "recycled",
    "category": 0
  },
  {
    "normalized": "smartconnect",
    "category": 0
  },
  {
    "normalized": "microsoft365",
    "category": 0
  },
  {
    "normalized": "managed365",
    "category": 0
  },
  {
    "normalized": "crowdinsights",
    "category": 0
  },
  {
    "normalized": "seonok",
    "category": 8
  },
  {
    "normalized": "hyvaksyvalitut",
    "category": 1
  },
  {
    "normalized": "voitmyoshyvaksyavainvalttamattomatevasteet",
    "category": 1
  },
  {
    "normalized": "中文",
    "category": 0
  },
  {
    "normalized": "tiedot",
    "category": 9
  },
  {
    "normalized": "kieltaydynevasteista",
    "category": 2
  },
  {
    "normalized": "lisatietojaespoofisivustosta",
    "category": 0
  },
  {
    "normalized": "31kolmannenosapuolentoimittajaa",
    "category": 0
  },
  {
    "normalized": "kryhmanevastekaytannoista",
    "category": 0
  },
  {
    "normalized": "tietosuojaselosteesta",
    "category": 9
  },
  {
    "normalized": "naytalisaa",
    "category": 3
  },
  {
    "normalized": "valttamattomatevasteet",
    "category": 1
  },
  {
    "normalized": "lisatiedotjaasetukset",
    "category": 3
  },
  {
    "normalized": "luelisaakayttamistammeevasteistajamuistavastaavistatekniikoista",
    "category": 3
  },
  {
    "normalized": "luurinmetsastystarjoukset",
    "category": 8
  },
  {
    "normalized": "evastekaytannoissa",
    "category": 8
  },
  {
    "normalized": "reitittimet",
    "category": 0
  },
  {
    "normalized": "maksupaatteet",
    "category": 0
  },
  {
    "normalized": "lisatarvikkeet",
    "category": 0
  },
  {
    "normalized": "laitepalvelunadaas",
    "category": 0
  },
  {
    "normalized": "laitteenelinkaaripalvelu",
    "category": 0
  },
  {
    "normalized": "laitehuoltopalvelu",
    "category": 0
  },
  {
    "normalized": "aerlaitteet",
    "category": 0
  },
  {
    "normalized": "puhelinliittymat",
    "category": 0
  },
  {
    "normalized": "liikkuvalaajakaista",
    "category": 0
  },
  {
    "normalized": "m2mliittymat",
    "category": 0
  },
  {
    "normalized": "liittymienlisapalvelut",
    "category": 0
  },
  {
    "normalized": "verkkotunnuspienelleyritykselle",
    "category": 0
  },
  {
    "normalized": "verkkotunnusyritykselle",
    "category": 0
  },
  {
    "normalized": "kotisivutyokalu",
    "category": 0
  },
  {
    "normalized": "webhotelli",
    "category": 0
  },
  {
    "normalized": "tvpalvelut",
    "category": 0
  },
  {
    "normalized": "yritysverkonsuunnittelu",
    "category": 0
  },
  {
    "normalized": "lahiverkkolan",
    "category": 0
  },
  {
    "normalized": "yritysverkkosdwan",
    "category": 0
  },
  {
    "normalized": "datanetverkko",
    "category": 0
  },
  {
    "normalized": "liikkuvantyonverkko",
    "category": 0
  },
  {
    "normalized": "tapahtumanverkko",
    "category": 0
  },
  {
    "normalized": "privaattiverkko",
    "category": 0
  },
  {
    "normalized": "nettitoimipisteeseen",
    "category": 0
  },
  {
    "normalized": "nettivaativaankayttoon",
    "category": 0
  },
  {
    "normalized": "nettiulkomaille",
    "category": 0
  },
  {
    "normalized": "laitteidentietosuoja",
    "category": 8
  },
  {
    "normalized": "tietoturvansuunnittelu",
    "category": 0
  },
  {
    "normalized": "soctietoturvakeskus",
    "category": 0
  },
  {
    "normalized": "varmuuskopiointi",
    "category": 0
  },
  {
    "normalized": "tlsvarmenne",
    "category": 0
  },
  {
    "normalized": "turvallinenarkistointi",
    "category": 0
  },
  {
    "normalized": "sahkoinenallekirjoitus",
    "category": 0
  },
  {
    "normalized": "vahvatunnistautuminen",
    "category": 0
  },
  {
    "normalized": "pilviasiantuntijapalvelut",
    "category": 0
  },
  {
    "normalized": "managedcloud",
    "category": 0
  },
  {
    "normalized": "julkisetpilvipalvelut",
    "category": 0
  },
  {
    "normalized": "colocation",
    "category": 0
  },
  {
    "normalized": "konesalijakapasiteettipalvelut",
    "category": 0
  },
  {
    "normalized": "datakeskukset",
    "category": 0
  },
  {
    "normalized": "mobiilivaihde",
    "category": 0
  },
  {
    "normalized": "viestintapalveluvip",
    "category": 0
  },
  {
    "normalized": "modernitasiakaspalveluratkaisut",
    "category": 0
  },
  {
    "normalized": "ulkoistettuvaihde",
    "category": 0
  },
  {
    "normalized": "smsjafaksiviestinta",
    "category": 0
  },
  {
    "normalized": "yritysjapalvelunumerot",
    "category": 0
  },
  {
    "normalized": "alykasteollisuus",
    "category": 0
  },
  {
    "normalized": "tekoaly",
    "category": 0
  },
  {
    "normalized": "nbiot",
    "category": 0
  },
  {
    "normalized": "iotliittymat",
    "category": 0
  },
  {
    "normalized": "alykasraskasliikenne",
    "category": 0
  },
  {
    "normalized": "alykasjulkinenliikenne",
    "category": 0
  },
  {
    "normalized": "alykasrakennus",
    "category": 0
  },
  {
    "normalized": "logistiikanseuranta",
    "category": 0
  },
  {
    "normalized": "iotalusta",
    "category": 0
  },
  {
    "normalized": "servicedesk",
    "category": 0
  },
  {
    "normalized": "neuvontajakonsultiontipalvelut",
    "category": 0
  },
  {
    "normalized": "hallintajavalvontapalvelut",
    "category": 0
  },
  {
    "normalized": "itpalveluidenhallintajatuki",
    "category": 0
  },
  {
    "normalized": "itymparistonhealthcheck",
    "category": 0
  },
  {
    "normalized": "koulutuspalvelut",
    "category": 0
  },
  {
    "normalized": "julkishallinto",
    "category": 0
  },
  {
    "normalized": "laskunvalitys",
    "category": 0
  },
  {
    "normalized": "edipalvelut",
    "category": 0
  },
  {
    "normalized": "verkkopalkka",
    "category": 0
  },
  {
    "normalized": "perintapalvelu",
    "category": 0
  },
  {
    "normalized": "ohjeet",
    "category": 0
  },
  {
    "normalized": "viatjahairiot",
    "category": 0
  },
  {
    "normalized": "etusivu",
    "category": 0
  },
  {
    "normalized": "tutustu",
    "category": 0
  },
  {
    "normalized": "rekisteroidy",
    "category": 0
  },
  {
    "normalized": "mynebulafi",
    "category": 0
  },
  {
    "normalized": "shopinmicsnebulafi",
    "category": 0
  },
  {
    "normalized": "inmicswebmercsfi",
    "category": 0
  },
  {
    "normalized": "mitenevasteitahallitaanjapoistetaan",
    "category": 8
  },
  {
    "normalized": "tietosuojajaevastekaytanto",
    "category": 0
  },
  {
    "normalized": "googlentietosuojakaytanto",
    "category": 0
  },
  {
    "normalized": "muutevasteet",
    "category": 8
  },
  {
    "normalized": "preferenssit",
    "category": 8
  },
  {
    "normalized": "taalta",
    "category": 0
  },
  {
    "normalized": "59kolmannenosapuolentoimittajat",
    "category": 0
  },
  {
    "normalized": "sarjat",
    "category": 0
  },
  {
    "normalized": "divarit",
    "category": 0
  },
  {
    "normalized": "maajoukkueet",
    "category": 0
  },
  {
    "normalized": "harrastaminen",
    "category": 0
  },
  {
    "normalized": "palvelut",
    "category": 0
  },
  {
    "normalized": "salainenliittymaetu",
    "category": 0
  },
  {
    "normalized": "kaikkiliittymat",
    "category": 0
  },
  {
    "normalized": "5gpuhelinliittymat",
    "category": 0
  },
  {
    "normalized": "liittymalapselle",
    "category": 0
  },
  {
    "normalized": "prepaid",
    "category": 0
  },
  {
    "normalized": "esim",
    "category": 0
  },
  {
    "normalized": "multirinnakkaisliittyma",
    "category": 0
  },
  {
    "normalized": "liittymatyritysasiakkaille",
    "category": 0
  },
  {
    "normalized": "5gnettikotiin",
    "category": 0
  },
  {
    "normalized": "mobiililaajakaista",
    "category": 0
  },
  {
    "normalized": "laitenetti",
    "category": 0
  },
  {
    "normalized": "prepaidnetti",
    "category": 0
  },
  {
    "normalized": "kaikkilaitteet",
    "category": 0
  },
  {
    "normalized": "televisiot",
    "category": 0
  },
  {
    "normalized": "kuulokkeet",
    "category": 0
  },
  {
    "normalized": "kaiuttimet",
    "category": 0
  },
  {
    "normalized": "pelaaminen",
    "category": 0
  },
  {
    "normalized": "alykellot",
    "category": 0
  },
  {
    "normalized": "alykoti",
    "category": 0
  },
  {
    "normalized": "nettilaitteet",
    "category": 0
  },
  {
    "normalized": "suosittuanyt",
    "category": 0
  },
  {
    "normalized": "liiga",
    "category": 0
  },
  {
    "normalized": "teliaplay",
    "category": 0
  },
  {
    "normalized": "kanavapaketit",
    "category": 0
  },
  {
    "normalized": "mtvkatsomo",
    "category": 0
  },
  {
    "normalized": "tvohjelmat",
    "category": 0
  },
  {
    "normalized": "turvapaketti",
    "category": 0
  },
  {
    "normalized": "freedomevpn",
    "category": 0
  },
  {
    "normalized": "teliadotsovellus",
    "category": 0
  },
  {
    "normalized": "mobiilivarmenne",
    "category": 0
  },
  {
    "normalized": "asiakasedut",
    "category": 0
  },
  {
    "normalized": "tarjoukset",
    "category": 0
  },
  {
    "normalized": "5gliittymat",
    "category": 0
  },
  {
    "normalized": "5gpuhelimet",
    "category": 0
  },
  {
    "normalized": "paivitaliittymasi5ghen",
    "category": 0
  },
  {
    "normalized": "mikaon5g",
    "category": 0
  },
  {
    "normalized": "kaikkiohjeet",
    "category": 0
  },
  {
    "normalized": "kaikkipuhelinliittymaohjeet",
    "category": 0
  },
  {
    "normalized": "pukkoodi",
    "category": 0
  },
  {
    "normalized": "matkapuhelintenkayttoohjeet",
    "category": 0
  },
  {
    "normalized": "vastaaja",
    "category": 0
  },
  {
    "normalized": "mmsviestienlukeminen",
    "category": 0
  },
  {
    "normalized": "simkortintilausjaaktivointi",
    "category": 0
  },
  {
    "normalized": "omistajanmuutos",
    "category": 0
  },
  {
    "normalized": "kaikkinettiyhteysohjeet",
    "category": 0
  },
  {
    "normalized": "mobiilireitittimienlaiteohjeet",
    "category": 0
  },
  {
    "normalized": "modeemienjareitittimienlaiteohjeet",
    "category": 0
  },
  {
    "normalized": "netinnopeustesti",
    "category": 0
  },
  {
    "normalized": "turvallisestiverkossa",
    "category": 0
  },
  {
    "normalized": "turvapakettiohjeet",
    "category": 0
  },
  {
    "normalized": "freedomevpnohjeet",
    "category": 0
  },
  {
    "normalized": "kaikkitvnjaviihteenohjeet",
    "category": 0
  },
  {
    "normalized": "teliaplaynkayttoonotto",
    "category": 0
  },
  {
    "normalized": "teliaplayboksinkayttoohje",
    "category": 0
  },
  {
    "normalized": "mtvkatsomo+suoratoistopalvelu",
    "category": 0
  },
  {
    "normalized": "kaikkilaskutusohjeet",
    "category": 0
  },
  {
    "normalized": "laskutustietojenmuutos",
    "category": 0
  },
  {
    "normalized": "maksumuistutuspalvelu",
    "category": 0
  },
  {
    "normalized": "haelisaamaksuaikaa",
    "category": 0
  },
  {
    "normalized": "elasku",
    "category": 0
  },
  {
    "normalized": "tilauksenseuranta",
    "category": 0
  },
  {
    "normalized": "tuotteenpalautus",
    "category": 0
  },
  {
    "normalized": "hairiotiedotteet",
    "category": 0
  },
  {
    "normalized": "mobiiliverkonhairiokartta",
    "category": 0
  },
  {
    "normalized": "kiinteanverkonhairiokartta",
    "category": 0
  },
  {
    "normalized": "luelisaaevasteasetuksista",
    "category": 3
  },
  {
    "normalized": "hyvaksyvaintarpeelliset",
    "category": 1
  },
  {
    "normalized": "omattiedotjaasetukset",
    "category": 8
  },
  {
    "normalized": "hallitsevalintojani",
    "category": 3
  },
  {
    "normalized": "minunteliasovellus",
    "category": 0
  },
  {
    "normalized": "teehairioilmoitus",
    "category": 0
  },
  {
    "normalized": "hairiotiedotteidentilaus",
    "category": 0
  },
  {
    "normalized": "kuuluvuuskartta",
    "category": 0
  },
  {
    "normalized": "korjatutviat",
    "category": 0
  },
  {
    "normalized": "etsilahinteliakauppa",
    "category": 0
  },
  {
    "normalized": "teliahelppitukipalvelu",
    "category": 0
  },
  {
    "normalized": "teliayhteiso",
    "category": 0
  },
  {
    "normalized": "liittymanijapalveluni",
    "category": 0
  },
  {
    "normalized": "omatedutjatarjoukset",
    "category": 0
  },
  {
    "normalized": "laskutjaviestit",
    "category": 0
  },
  {
    "normalized": "noraidit",
    "category": 2
  },
  {
    "normalized": "piekritu",
    "category": 1
  },
  {
    "normalized": "raditdetalizeti",
    "category": 3
  },
  {
    "normalized": "apstiprinatvisas",
    "category": 1
  },
  {
    "normalized": "pielagotizveli",
    "category": 3
  },
  {
    "normalized": "sutinku",
    "category": 1
  },
  {
    "normalized": "rodytiinformacija",
    "category": 3
  },
  {
    "normalized": "slapukunustatymai",
    "category": 3
  },
  {
    "normalized": "atmesti",
    "category": 2
  },
  {
    "normalized": "partneriai",
    "category": 0
  },
  {
    "normalized": "daugiaupasirinkimu",
    "category": 3
  },
  {
    "normalized": "valdytiparinktis",
    "category": 3
  },
  {
    "normalized": "tinkinti",
    "category": 3
  },
  {
    "normalized": "issamiinformacija",
    "category": 3
  },
  {
    "normalized": "nustatymai",
    "category": 3
  },
  {
    "normalized": "sutikimas",
    "category": 8
  },
  {
    "normalized": "leistivisusslapukus",
    "category": 1
  },
  {
    "normalized": "leistivisus",
    "category": 1
  },
  {
    "normalized": "leistipasirinkima",
    "category": 1
  },
  {
    "normalized": "tikbutinislapukai",
    "category": 1
  },
  {
    "normalized": "sutinkusuvisais",
    "category": 1
  },
  {
    "normalized": "patvirtintivisus",
    "category": 1
  },
  {
    "normalized": "butini",
    "category": 1
  },
  {
    "normalized": "priimtivisus",
    "category": 1
  },
  {
    "normalized": "apie",
    "category": 0
  },
  {
    "normalized": "pieklustamiba",
    "category": 1
  },
  {
    "normalized": "balssatrums",
    "category": 0
  },
  {
    "normalized": "atlautvisu",
    "category": 1
  },
  {
    "normalized": "papilduopcijas",
    "category": 3
  },
  {
    "normalized": "lautatlasi",
    "category": 1
  },
  {
    "normalized": "nepiekritu",
    "category": 2
  },
  {
    "normalized": "atlautvisussikfailus",
    "category": 1
  },
  {
    "normalized": "piekristvisam",
    "category": 1
  },
  {
    "normalized": "iestatijumi",
    "category": 3
  },
  {
    "normalized": "espiekritu",
    "category": 1
  },
  {
    "normalized": "noraiditvisu",
    "category": 2
  },
  {
    "normalized": "pienemtvisu",
    "category": 1
  },
  {
    "normalized": "sikdatnuiestatijumi",
    "category": 3
  },
  {
    "normalized": "atlautvisassikdatnes",
    "category": 1
  },
  {
    "normalized": "pielagot",
    "category": 3
  },
  {
    "normalized": "saglabatiestatijumus",
    "category": 4
  },
  {
    "normalized": "pienemtvisas",
    "category": 1
  },
  {
    "normalized": "parvalditiestatijumus",
    "category": 3
  },
  {
    "normalized": "noraiditvisussikfailus",
    "category": 2
  },
  {
    "normalized": "piekrisana",
    "category": 1
  },
  {
    "normalized": "japiekritu",
    "category": 1
  },
  {
    "normalized": "raditmerkus",
    "category": 2
  },
  {
    "normalized": "nenepiekritu",
    "category": 2
  },
  {
    "normalized": "apstiprinatvisassikdatnes",
    "category": 1
  },
  {
    "normalized": "sikakainformacija",
    "category": 0
  },
  {
    "normalized": "pressenterorspacetoshowvolumeslider",
    "category": 0
  },
  {
    "normalized": "detalizetakainformacijaparizmantotajamsikdatnem",
    "category": 3
  },
  {
    "normalized": "nepieciesams",
    "category": 8
  },
  {
    "normalized": "izmantottikainepieciesamassikdatnes",
    "category": 1
  },
  {
    "normalized": "tikainepieciesamas",
    "category": 2
  },
  {
    "normalized": "sikdatnupolitika",
    "category": 3
  },
  {
    "normalized": "parvalditsikdatnes",
    "category": 3
  },
  {
    "normalized": "piekristvisamsikdatnem",
    "category": 1
  },
  {
    "normalized": "akceptetatzimetos",
    "category": 1
  },
  {
    "normalized": "akceptetvisu",
    "category": 1
  },
  {
    "normalized": "sikfailuiestatijumi",
    "category": 3
  },
  {
    "normalized": "piekrist",
    "category": 1
  },
  {
    "normalized": "piekrituvisamsikdatnem",
    "category": 1
  },
  {
    "normalized": "atteikties",
    "category": 2
  },
  {
    "normalized": "papilduinformacija",
    "category": 3
  },
  {
    "normalized": "consenttoall",
    "category": 0
  },
  {
    "normalized": "partneri758",
    "category": 0
  },
  {
    "normalized": "sapratu",
    "category": 1
  },
  {
    "normalized": "pienemt",
    "category": 1
  },
  {
    "normalized": "laujietmanizveleties",
    "category": 3
  },
  {
    "normalized": "jusupilseta",
    "category": 0
  },
  {
    "normalized": "aizvert",
    "category": 1
  },
  {
    "normalized": "apstiprinatatzimetas",
    "category": 1
  },
  {
    "normalized": "pienemtunturpinat",
    "category": 1
  },
  {
    "normalized": "партнеры",
    "category": 0
  },
  {
    "normalized": "дополнительныепараметры",
    "category": 0
  },
  {
    "normalized": "tikainepieciesamassikdatnes",
    "category": 1
  },
  {
    "normalized": "piekrituvisam",
    "category": 1
  },
  {
    "normalized": "raditpartnerus",
    "category": 0
  },
  {
    "normalized": "raditinformaciju",
    "category": 3
  },
  {
    "normalized": "uzzinatvairak",
    "category": 3
  },
  {
    "normalized": "partnerupakalpojumusniedzejusaraksts",
    "category": 0
  },
  {
    "normalized": "sikdatnuizmantosanasnoteikumos",
    "category": 3
  },
  {
    "normalized": "izveleties",
    "category": 1
  },
  {
    "normalized": "akceptetvisassikdatnes",
    "category": 1
  },
  {
    "normalized": "essaprotu",
    "category": 1
  },
  {
    "normalized": "pielagotsikdatnes",
    "category": 3
  },
  {
    "normalized": "vairakinformacijaparsikdatnem",
    "category": 3
  },
  {
    "normalized": "detalizetainformacija",
    "category": 3
  },
  {
    "normalized": "pienemttikaiatzimetas",
    "category": 1
  },
  {
    "normalized": "vendors760",
    "category": 0
  },
  {
    "normalized": "vairakinformacijas",
    "category": 3
  },
  {
    "normalized": "pienemtsikdatnes",
    "category": 1
  },
  {
    "normalized": "pienemtnepieciesamos",
    "category": 1
  },
  {
    "normalized": "lasitvairak",
    "category": 3
  },
  {
    "normalized": "raditdetalas",
    "category": 3
  },
  {
    "normalized": "uzzinivairak",
    "category": 3
  },
  {
    "normalized": "noraiditvisassikdatnes",
    "category": 2
  },
  {
    "normalized": "piekrituieteiktajamsikdatnem",
    "category": 1
  },
  {
    "normalized": "piekritutikainepieciesamajamsikdatnem",
    "category": 1
  },
  {
    "normalized": "atlautizveletossikfailus",
    "category": 1
  },
  {
    "normalized": "atsauktpiekrisanu",
    "category": 1
  },
  {
    "normalized": "esnepiekritu",
    "category": 2
  },
  {
    "normalized": "piekristvisusikfailuizmantosanai",
    "category": 1
  },
  {
    "normalized": "ienakt",
    "category": 0
  },
  {
    "normalized": "pieslegties",
    "category": 0
  },
  {
    "normalized": "apstiprinatobligatas",
    "category": 8
  },
  {
    "normalized": "atlauttikaiatlasitos",
    "category": 1
  },
  {
    "normalized": "iestatijumuparvaldiba",
    "category": 3
  },
  {
    "normalized": "atcelt",
    "category": 2
  },
  {
    "normalized": "nepieciesamassikdatnes",
    "category": 3
  },
  {
    "normalized": "preferencessikdatnes",
    "category": 3
  },
  {
    "normalized": "marketingasikdatnes",
    "category": 0
  },
  {
    "normalized": "lietottikainepieciesamossikfailus",
    "category": 3
  },
  {
    "normalized": "atstattehniskassikdatnes",
    "category": 3
  },
  {
    "normalized": "mainitsikdatnuiestatijumus",
    "category": 3
  },
  {
    "normalized": "turpinatbezpiekrisanas",
    "category": 1
  },
  {
    "normalized": "visaspreces",
    "category": 0
  },
  {
    "normalized": "toppiedavajumi",
    "category": 0
  },
  {
    "normalized": "outletveikals",
    "category": 0
  },
  {
    "normalized": "pardodiet220lv",
    "category": 0
  },
  {
    "normalized": "turpinatiepirktiesaboutyoulv",
    "category": 0
  },
  {
    "normalized": "tikainepieciesamiesikfaili",
    "category": 1
  },
  {
    "normalized": "vairak",
    "category": 0
  },
  {
    "normalized": "piekristvisiem",
    "category": 1
  },
  {
    "normalized": "atteiktiesnovisiem",
    "category": 2
  },
  {
    "normalized": "noteikumiuniestatijumi",
    "category": 3
  },
  {
    "normalized": "individualiedatuaizsardzibasiestatijumi",
    "category": 3
  },
  {
    "normalized": "lietojiettikainepieciesamossikfailus",
    "category": 3
  },
  {
    "normalized": "nepiekritusikdatnulietosanai",
    "category": 2
  },
  {
    "normalized": "apstiprinat",
    "category": 1
  },
  {
    "normalized": "uzstadijumi",
    "category": 3
  },
  {
    "normalized": "aizvertsopazinojumu",
    "category": 2
  },
  {
    "normalized": "настроить",
    "category": 3
  },
  {
    "normalized": "отклонить",
    "category": 2
  },
  {
    "normalized": "принятьипродолжить",
    "category": 0
  },
  {
    "normalized": "piekristunaizvert",
    "category": 1
  },
  {
    "normalized": "neakceptet",
    "category": 2
  },
  {
    "normalized": "akceptetizveletassikdatnes",
    "category": 1
  },
  {
    "normalized": "sitimeklavietneizmantosikfailus",
    "category": 1
  },
  {
    "normalized": "piekristtikainepieciesamosikfailuizmantosanai",
    "category": 1
  },
  {
    "normalized": "izveletiessikfailuveidus",
    "category": 3
  },
  {
    "normalized": "piekrituunaizvertsadalu",
    "category": 1
  },
  {
    "normalized": "mainitiestatijumus",
    "category": 3
  },
  {
    "normalized": "mainitsikfailuiestatijumus",
    "category": 3
  },
  {
    "normalized": "apstiprinatnepieciesamas",
    "category": 1
  },
  {
    "normalized": "apstiprinatvisu",
    "category": 1
  },
  {
    "normalized": "pienemtvisassikdatnes",
    "category": 1
  },
  {
    "normalized": "sikdatnuuzstadijumi",
    "category": 1
  },
  {
    "normalized": "doneallpiekritu",
    "category": 0
  },
  {
    "normalized": "analitikassikdatnes",
    "category": 0
  },
  {
    "normalized": "tunepielagot",
    "category": 0
  },
  {
    "normalized": "akcpetetizveleto",
    "category": 1
  },
  {
    "normalized": "atlautatlasitassikdatnes",
    "category": 1
  },
  {
    "normalized": "принятьвсе",
    "category": 0
  },
  {
    "normalized": "большенастроек",
    "category": 0
  },
  {
    "normalized": "parvaldit",
    "category": 0
  },
  {
    "normalized": "apstiprinattikainepieciesamas",
    "category": 1
  },
  {
    "normalized": "esapstiprinu",
    "category": 1
  },
  {
    "normalized": "sikdatnuopcijas",
    "category": 3
  },
  {
    "normalized": "piekristtikaiatzimetajam",
    "category": 1
  },
  {
    "normalized": "pienemtsevisatzimetas",
    "category": 1
  },
  {
    "normalized": "parvalditatteikties",
    "category": 2
  },
  {
    "normalized": "parvalditsikdatnuiestatijumus",
    "category": 3
  },
  {
    "normalized": "doneallpiekrist",
    "category": 0
  },
  {
    "normalized": "clearturpinatbezpiekrisanas",
    "category": 0
  },
  {
    "normalized": "tuneuzstadijumi",
    "category": 0
  },
  {
    "normalized": "vendors758",
    "category": 0
  },
  {
    "normalized": "pienemttikainepieciesamos",
    "category": 1
  },
  {
    "normalized": "labiturpiniet",
    "category": 1
  },
  {
    "normalized": "nepielagot",
    "category": 2
  },
  {
    "normalized": "manasopcijas",
    "category": 3
  },
  {
    "normalized": "apstiprinatizveles",
    "category": 1
  },
  {
    "normalized": "disablecookies",
    "category": 0
  },
  {
    "normalized": "enablecookies",
    "category": 0
  },
  {
    "normalized": "atsakos",
    "category": 2
  },
  {
    "normalized": "sikdatnuiestatijumiem",
    "category": 3
  },
  {
    "normalized": "tikaiobligatassikdatnes",
    "category": 3
  },
  {
    "normalized": "piekrituatlasitajam",
    "category": 1
  },
  {
    "normalized": "piekrituvisiem",
    "category": 1
  },
  {
    "normalized": "noraiditvisas",
    "category": 2
  },
  {
    "normalized": "kazino",
    "category": 0
  },
  {
    "normalized": "livekazino",
    "category": 0
  },
  {
    "normalized": "piedavajumi",
    "category": 0
  },
  {
    "normalized": "registreties",
    "category": 0
  },
  {
    "normalized": "shoponlatviastore",
    "category": 0
  },
  {
    "normalized": "izmantotizveletassikdatnes",
    "category": 1
  },
  {
    "normalized": "izmantotvisassikdatnes",
    "category": 1
  },
  {
    "normalized": "sikdatnes",
    "category": 0
  },
  {
    "normalized": "akceptetvisussikfailus",
    "category": 1
  },
  {
    "normalized": "turpinatnepienemot",
    "category": 2
  },
  {
    "normalized": "labi",
    "category": 1
  },
  {
    "normalized": "iestatitpreferences",
    "category": 3
  },
  {
    "normalized": "selectlanguage",
    "category": 0
  },
  {
    "normalized": "parietuzaboutyoudk",
    "category": 0
  },
  {
    "normalized": "partneriem",
    "category": 0
  },
  {
    "normalized": "privatumapolitika",
    "category": 0
  },
  {
    "normalized": "izvele",
    "category": 0
  },
  {
    "normalized": "parvalditpreferences",
    "category": 3
  },
  {
    "normalized": "uzzinatvairakparizmantotajamsikdatnem>sikdatnupolitika",
    "category": 3
  },
  {
    "normalized": "uzticamopartneru",
    "category": 0
  },
  {
    "normalized": "gribulaimet",
    "category": 0
  },
  {
    "normalized": "mainitsikdatnuuzstadijumus",
    "category": 3
  },
  {
    "normalized": "nepieciesamas23",
    "category": 0
  },
  {
    "normalized": "aaa",
    "category": 0
  },
  {
    "normalized": "esesmulatvijalvvirtualaisasistents",
    "category": 0
  },
  {
    "normalized": "piedalities",
    "category": 0
  },
  {
    "normalized": "statistikassikdatnes8",
    "category": 0
  },
  {
    "normalized": "marketingasikdatnes39",
    "category": 8
  },
  {
    "normalized": "raditvairak",
    "category": 8
  },
  {
    "normalized": "obligatas",
    "category": 0
  },
  {
    "normalized": "sajavietnetiekizmantotassikdatnes",
    "category": 8
  },
  {
    "normalized": "uzzinatvairakparsikdatnem",
    "category": 3
  },
  {
    "normalized": "piekrituizmantotsikdatnes",
    "category": 1
  },
  {
    "normalized": "stokkerprivatumasikdatnupolitika",
    "category": 0
  },
  {
    "normalized": "atmestivisus",
    "category": 2
  },
  {
    "normalized": "partneriai758",
    "category": 0
  },
  {
    "normalized": "atsisakytivisu",
    "category": 8
  },
  {
    "normalized": "keistinustatymus",
    "category": 3
  },
  {
    "normalized": "sutiktisuvisais",
    "category": 1
  },
  {
    "normalized": "priimtivisusslapukus",
    "category": 1
  },
  {
    "normalized": "supratau",
    "category": 1
  },
  {
    "normalized": "musu856partneriai",
    "category": 0
  },
  {
    "normalized": "issamiosinformacijosdalyje",
    "category": 3
  },
  {
    "normalized": "gerai",
    "category": 1
  },
  {
    "normalized": "assutinku",
    "category": 9
  },
  {
    "normalized": "patvirtintipazymetus",
    "category": 9
  },
  {
    "normalized": "nesutinku",
    "category": 2
  },
  {
    "normalized": "sutinkusuvisaisslapukais",
    "category": 1
  },
  {
    "normalized": "sutinkusubutinaisiais",
    "category": 1
  },
  {
    "normalized": "slapukupolitika",
    "category": 8
  },
  {
    "normalized": "partneriutiekejusarasas",
    "category": 0
  },
  {
    "normalized": "butinieji",
    "category": 8
  },
  {
    "normalized": "parinktys",
    "category": 3
  },
  {
    "normalized": "rinktis",
    "category": 3
  },
  {
    "normalized": "priimti",
    "category": 1
  },
  {
    "normalized": "priimtislapukus",
    "category": 1
  },
  {
    "normalized": "priimtiviska",
    "category": 1
  },
  {
    "normalized": "atmestivisusslapukus",
    "category": 2
  },
  {
    "normalized": "atsisakyti",
    "category": 2
  },
  {
    "normalized": "asnesutinku",
    "category": 2
  },
  {
    "normalized": "patvirtinti",
    "category": 1
  },
  {
    "normalized": "patvirtintipasirinktus",
    "category": 1
  },
  {
    "normalized": "rodytipaskirtis",
    "category": 9
  },
  {
    "normalized": "sutikti",
    "category": 1
  },
  {
    "normalized": "jusumiestas",
    "category": 0
  },
  {
    "normalized": "sutiktisuvisaisslapukais",
    "category": 1
  },
  {
    "normalized": "valdytislapukuparametrus",
    "category": 3
  },
  {
    "normalized": "valdytislapukus",
    "category": 3
  },
  {
    "normalized": "naudotitikbutinuosius",
    "category": 1
  },
  {
    "normalized": "keistinesutinku",
    "category": 3
  },
  {
    "normalized": "nustatytiprioritetus",
    "category": 3
  },
  {
    "normalized": "slapukuinformacija",
    "category": 8
  },
  {
    "normalized": "rodytipasirinkimus",
    "category": 3
  },
  {
    "normalized": "daugiauinformacijos",
    "category": 3
  },
  {
    "normalized": "sutinkususlapukais",
    "category": 1
  },
  {
    "normalized": "nesutinkususlapukais",
    "category": 2
  },
  {
    "normalized": "pritaikyti",
    "category": 3
  },
  {
    "normalized": "atmestiviska",
    "category": 2
  },
  {
    "normalized": "patvirtintivisusslapukus",
    "category": 1
  },
  {
    "normalized": "pasirinktislapukus",
    "category": 3
  },
  {
    "normalized": "tvarkytinustatymus",
    "category": 3
  },
  {
    "normalized": "slapukupolitikoje",
    "category": 0
  },
  {
    "normalized": "naudotitikbutinuosiusslapukus",
    "category": 1
  },
  {
    "normalized": "leistibutinus",
    "category": 1
  },
  {
    "normalized": "patvirtintibutinus",
    "category": 1
  },
  {
    "normalized": "nuostatos",
    "category": 0
  },
  {
    "normalized": "skaitytidaugiau",
    "category": 3
  },
  {
    "normalized": "parodytidetaliau",
    "category": 3
  },
  {
    "normalized": "pasirinkti",
    "category": 8
  },
  {
    "normalized": "leistipasirinktusslapukus",
    "category": 1
  },
  {
    "normalized": "asatsisakau",
    "category": 2
  },
  {
    "normalized": "keistimanopasirinkimus",
    "category": 3
  },
  {
    "normalized": "rodytidetales",
    "category": 3
  },
  {
    "normalized": "partneriusarasas",
    "category": 0
  },
  {
    "normalized": "naudotitikbutinusslapukus",
    "category": 1
  },
  {
    "normalized": "rinktisnustatymus",
    "category": 3
  },
  {
    "normalized": "suzinotidaugiau→",
    "category": 3
  },
  {
    "normalized": "sutiktiiruzdaryti",
    "category": 1
  },
  {
    "normalized": "tvarkytiparinktis",
    "category": 3
  },
  {
    "normalized": "patikimupartneriu",
    "category": 0
  },
  {
    "normalized": "keistislapukunustatymus",
    "category": 3
  },
  {
    "normalized": "patvirtintibutinusslapukus",
    "category": 1
  },
  {
    "normalized": "patvirtinu",
    "category": 1
  },
  {
    "normalized": "atsaukti",
    "category": 2
  },
  {
    "normalized": "ivirsu",
    "category": 0
  },
  {
    "normalized": "priimtitikbutinus",
    "category": 1
  },
  {
    "normalized": "gautipasiulyma",
    "category": 0
  },
  {
    "normalized": "slapukuparinktys",
    "category": 3
  },
  {
    "normalized": "doneallsutinku",
    "category": 0
  },
  {
    "normalized": "tunevaldytislapukus",
    "category": 3
  },
  {
    "normalized": "susipazinau",
    "category": 0
  },
  {
    "normalized": "sutinkusupazymetaisiais",
    "category": 1
  },
  {
    "normalized": "noriupasirinkti",
    "category": 3
  },
  {
    "normalized": "koreguotipasirinkima",
    "category": 3
  },
  {
    "normalized": "atsisakau",
    "category": 2
  },
  {
    "normalized": "redaguoti",
    "category": 3
  },
  {
    "normalized": "tuneslapukunustatymai",
    "category": 3
  },
  {
    "normalized": "cleartestibepatvirtinimo",
    "category": 8
  },
  {
    "normalized": "neleistislapuku",
    "category": 2
  },
  {
    "normalized": "atmestivisusnebutinus",
    "category": 2
  },
  {
    "normalized": "slapukupasirinkimai",
    "category": 3
  },
  {
    "normalized": "individualusnustatymai",
    "category": 3
  },
  {
    "normalized": "atsisakytislapuku",
    "category": 2
  },
  {
    "normalized": "individualiaipritaikytinustatymus",
    "category": 3
  },
  {
    "normalized": "visosprekes",
    "category": 0
  },
  {
    "normalized": "toppasiulymai",
    "category": 0
  },
  {
    "normalized": "isparduotuve",
    "category": 0
  },
  {
    "normalized": "partneriai760",
    "category": 0
  },
  {
    "normalized": "shoponlithuaniastore",
    "category": 0
  },
  {
    "normalized": "imones",
    "category": 0
  },
  {
    "normalized": "funkciniai",
    "category": 0
  },
  {
    "normalized": "musu22partneriaiiu",
    "category": 0
  },
  {
    "normalized": "diena",
    "category": 0
  },
  {
    "normalized": "+370",
    "category": 0
  },
  {
    "normalized": "versloklientams",
    "category": 0
  },
  {
    "normalized": "prenumeruoti",
    "category": 0
  },
  {
    "normalized": "perziuretinuostatas",
    "category": 3
  },
  {
    "normalized": "prisijungti",
    "category": 0
  },
  {
    "normalized": "priimu",
    "category": 1
  },
  {
    "normalized": "priimtipasirinktusslapukus",
    "category": 1
  },
  {
    "normalized": "sutinkusupazymetais",
    "category": 1
  },
  {
    "normalized": "doneallpatvirtintislapukus",
    "category": 1
  },
  {
    "normalized": "sutinkuuzdaryti",
    "category": 1
  },
  {
    "normalized": "acceptessential",
    "category": 1
  },
  {
    "normalized": "patvirtintislapukus",
    "category": 1
  },
  {
    "normalized": "patvirtintiviska",
    "category": 1
  },
  {
    "normalized": "prekiaukiteperpigult",
    "category": 0
  },
  {
    "normalized": "tikbutinieji",
    "category": 1
  },
  {
    "normalized": "patvirtintimanopasirinkimus",
    "category": 1
  },
  {
    "normalized": "draustivisus",
    "category": 8
  },
  {
    "normalized": "valdytipasirinkima",
    "category": 8
  },
  {
    "normalized": "pasirinktisavoslapukus",
    "category": 3
  },
  {
    "normalized": "testibesutikimo",
    "category": 8
  },
  {
    "normalized": "leistipasirinktus",
    "category": 1
  },
  {
    "normalized": "slapukus",
    "category": 8
  },
  {
    "normalized": "testinepriemus",
    "category": 2
  },
  {
    "normalized": "uzdaryti",
    "category": 8
  },
  {
    "normalized": "tikbutiniejislapukai",
    "category": 1
  },
  {
    "normalized": "useonlynecessary",
    "category": 1
  },
  {
    "normalized": "pasirinktislapukai",
    "category": 8
  },
  {
    "normalized": "tvarkytislapukus",
    "category": 3
  },
  {
    "normalized": "statistiniai",
    "category": 0
  },
  {
    "normalized": "grieztaibutini",
    "category": 8
  },
  {
    "normalized": "manyra20metu",
    "category": 0
  },
  {
    "normalized": "slapukuvaldymas",
    "category": 3
  },
  {
    "normalized": "visislapukai",
    "category": 9
  },
  {
    "normalized": "rinkodaros",
    "category": 0
  },
  {
    "normalized": "priimtibutinus",
    "category": 1
  },
  {
    "normalized": "igalintivisusslapukus",
    "category": 1
  },
  {
    "normalized": "sutiktisubutinaisiais",
    "category": 1
  },
  {
    "normalized": "priimtiiruzdaryti",
    "category": 1
  },
  {
    "normalized": "tvarkytinuostatas",
    "category": 3
  },
  {
    "normalized": "autoservisassiauliai",
    "category": 0
  },
  {
    "normalized": "registruotis",
    "category": 0
  },
  {
    "normalized": "dalyvauti",
    "category": 0
  },
  {
    "normalized": "suprantu",
    "category": 1
  },
  {
    "normalized": "priimtipazymetusslapukus",
    "category": 1
  },
  {
    "normalized": "pakeistislapukunustatymus",
    "category": 3
  },
  {
    "normalized": "noriulaimeti",
    "category": 0
  },
  {
    "normalized": "teskite",
    "category": 8
  },
  {
    "normalized": "privatumopolitikoje",
    "category": 9
  },
  {
    "normalized": "block",
    "category": 9
  },
  {
    "normalized": "slapukunaudojimopuslapyje",
    "category": 9
  },
  {
    "normalized": "swedbankslapukupolitikoje",
    "category": 0
  },
  {
    "normalized": "patvirtintitikpazymetus",
    "category": 1
  },
  {
    "normalized": "zrprivatumopolitika",
    "category": 0
  },
  {
    "normalized": "internetiniaislapukai",
    "category": 9
  },
  {
    "normalized": "godtaalle",
    "category": 1
  },
  {
    "normalized": "lagreogellerfatilgangtilinformasjonpaenenhet",
    "category": 0
  },
  {
    "normalized": "tilpasselleravvis",
    "category": 3
  },
  {
    "normalized": "personligtilpassetannonsering",
    "category": 0
  },
  {
    "normalized": "annonseleverandører",
    "category": 0
  },
  {
    "normalized": "personvernerklæring",
    "category": 0
  },
  {
    "normalized": "amedia",
    "category": 0
  },
  {
    "normalized": "varenettsteder",
    "category": 0
  },
  {
    "normalized": "alleamedianettstedene",
    "category": 0
  },
  {
    "normalized": "lesmerominformasjonskapsler",
    "category": 0
  },
  {
    "normalized": "33partnere",
    "category": 0
  },
  {
    "normalized": "schibstedspersonligtilpassedeannonseringgjelderschibsted",
    "category": 0
  },
  {
    "normalized": "schibstedspersonligtilpassedeannonsering",
    "category": 0
  },
  {
    "normalized": "godta",
    "category": 1
  },
  {
    "normalized": "endreinnstillinger",
    "category": 3
  },
  {
    "normalized": "godkjennalle",
    "category": 1
  },
  {
    "normalized": "flerevalg",
    "category": 3
  },
  {
    "normalized": "avsla",
    "category": 2
  },
  {
    "normalized": "tillatutvalg",
    "category": 4
  },
  {
    "normalized": "jeggodtar",
    "category": 1
  },
  {
    "normalized": "uenig",
    "category": 2
  },
  {
    "normalized": "enig",
    "category": 1
  },
  {
    "normalized": "lagreinnstillinger",
    "category": 4
  },
  {
    "normalized": "lagreogellerfatilgangtilinformasjonpaenenhetgjelderschibstedsannonsepartnere",
    "category": 0
  },
  {
    "normalized": "valgavpersonligannonseringoginnholdsamtmalingavannonseringoginnholdogpublikumsundersøkelserogtjenesteutviklinggjelderschibstedsannonsepartnere",
    "category": 0
  },
  {
    "normalized": "schibstedspersonvernerklæring",
    "category": 0
  },
  {
    "normalized": "lagreogellerfatilgangtilinformasjonpaenenhetgjelderannonsepartnere",
    "category": 0
  },
  {
    "normalized": "personligtilpassetannonseringoginnholdannonseringoginnholdsmalingpublikumsundersøkelserogtjenesteutviklinggjelderannonsepartnere",
    "category": 0
  },
  {
    "normalized": "leverandører",
    "category": 0
  },
  {
    "normalized": "aksepteralle",
    "category": 1
  },
  {
    "normalized": "ikketillat",
    "category": 2
  },
  {
    "normalized": "barenødvendigecookies",
    "category": 2
  },
  {
    "normalized": "sedetaljer",
    "category": 3
  },
  {
    "normalized": "lukk",
    "category": 1
  },
  {
    "normalized": "godtanødvendige",
    "category": 2
  },
  {
    "normalized": "godtaalleinformasjonskapsler",
    "category": 1
  },
  {
    "normalized": "aksepter",
    "category": 1
  },
  {
    "normalized": "informasjonskapselinnstillinger",
    "category": 3
  },
  {
    "normalized": "cookieerklæring",
    "category": 0
  },
  {
    "normalized": "retningslinjerforinformasjonskapsler",
    "category": 0
  },
  {
    "normalized": "aksepteralt",
    "category": 1
  },
  {
    "normalized": "godtaallecookies",
    "category": 1
  },
  {
    "normalized": "funksjonelle",
    "category": 0
  },
  {
    "normalized": "innstillingerforinformasjonskapsler",
    "category": 3
  },
  {
    "normalized": "godtavalgte",
    "category": 4
  },
  {
    "normalized": "godtaalt",
    "category": 1
  },
  {
    "normalized": "barenødvendige",
    "category": 2
  },
  {
    "normalized": "tillatalleinformasjonskapsler",
    "category": 1
  },
  {
    "normalized": "lagreminevalg",
    "category": 4
  },
  {
    "normalized": "tilpassinnstillinger",
    "category": 3
  },
  {
    "normalized": "tilpassdineinnstillingerher",
    "category": 3
  },
  {
    "normalized": "greit",
    "category": 1
  },
  {
    "normalized": "cookieinnstillinger",
    "category": 3
  },
  {
    "normalized": "logginn",
    "category": 0
  },
  {
    "normalized": "personligtilpassetannonseringoginnholdannonseringoginnholdsmalingpublikumsundersøkelserogtjenesteutvikling",
    "category": 0
  },
  {
    "normalized": "lesmerogvelginformasjonskapsler",
    "category": 3
  },
  {
    "normalized": "detergreit",
    "category": 1
  },
  {
    "normalized": "vare77partnerne",
    "category": 0
  },
  {
    "normalized": "lagre",
    "category": 3
  },
  {
    "normalized": "vare29partnerne",
    "category": 0
  },
  {
    "normalized": "googlesretningslinjerforpersonvern",
    "category": 0
  },
  {
    "normalized": "merinformasjon",
    "category": 8
  },
  {
    "normalized": "neitakk",
    "category": 2
  },
  {
    "normalized": "velgselv",
    "category": 3
  },
  {
    "normalized": "innstillingeneforinformasjonskapsler",
    "category": 3
  },
  {
    "normalized": "godtabaredeobligatoriske",
    "category": 2
  },
  {
    "normalized": "konfigurerpreferanser",
    "category": 3
  },
  {
    "normalized": "tillatvalgtekategorier",
    "category": 4
  },
  {
    "normalized": "tillatoggavidere",
    "category": 1
  },
  {
    "normalized": "lesmeromvareinformasjonskapsler",
    "category": 8
  },
  {
    "normalized": "nødvendigeinformasjonskapsler",
    "category": 0
  },
  {
    "normalized": "skjema",
    "category": 0
  },
  {
    "normalized": "godtakunnødvendige",
    "category": 2
  },
  {
    "normalized": "informasjonskapsler",
    "category": 8
  },
  {
    "normalized": "ikkeselgminepersonopplysninger",
    "category": 2
  },
  {
    "normalized": "utvikleogforbedretjenester",
    "category": 0
  },
  {
    "normalized": "brukebegrensededataforavelgeinnhold",
    "category": 0
  },
  {
    "normalized": "lagreogellerfatilgangtilinformasjonpaenenhetgjelderannonsepartnereogabcstartsiden",
    "category": 0
  },
  {
    "normalized": "personligtilpassetannonseringgjelderannonsepartnereogabcstartsiden",
    "category": 0
  },
  {
    "normalized": "forskningsomrader",
    "category": 0
  },
  {
    "normalized": "altomsintef",
    "category": 0
  },
  {
    "normalized": "forhandlerliste",
    "category": 0
  },
  {
    "normalized": "bliclubmedlem",
    "category": 0
  },
  {
    "normalized": "datautstyr",
    "category": 0
  },
  {
    "normalized": "tvlydbilde",
    "category": 0
  },
  {
    "normalized": "pcnettbrett",
    "category": 0
  },
  {
    "normalized": "mobilerklokker",
    "category": 0
  },
  {
    "normalized": "hvitevarer",
    "category": 0
  },
  {
    "normalized": "hjemfritid",
    "category": 0
  },
  {
    "normalized": "settpreferanser",
    "category": 3
  },
  {
    "normalized": "lesmerogtilpassmineinnstillinger",
    "category": 3
  },
  {
    "normalized": "lagremittvalg",
    "category": 4
  },
  {
    "normalized": "jeggodtaralleinformasjonskapsler",
    "category": 1
  },
  {
    "normalized": "administrerinformasjonskapsler",
    "category": 3
  },
  {
    "normalized": "ominformasjonskapsler",
    "category": 8
  },
  {
    "normalized": "jegvilvitemer",
    "category": 3
  },
  {
    "normalized": "tilpasscookiesinnstillingene",
    "category": 3
  },
  {
    "normalized": "jeggodkjennerkunnødvendigecookies",
    "category": 2
  },
  {
    "normalized": "jeggodkjennerallecookies",
    "category": 1
  },
  {
    "normalized": "visinnstillinger",
    "category": 3
  },
  {
    "normalized": "sehvilkeinformasjonskapslervibruker",
    "category": 8
  },
  {
    "normalized": "tilpassinformasjonskapsler",
    "category": 3
  },
  {
    "normalized": "lagrevalgenemine",
    "category": 4
  },
  {
    "normalized": "aksepterallecookies",
    "category": 1
  },
  {
    "normalized": "godkjenn",
    "category": 1
  },
  {
    "normalized": "handterecookies",
    "category": 3
  },
  {
    "normalized": "formerinformasjonlesvareretningslinjerforinformasjonskapsler",
    "category": 0
  },
  {
    "normalized": "seigjennom",
    "category": 3
  },
  {
    "normalized": "godkjennoglukk",
    "category": 1
  },
  {
    "normalized": "godtainformasjonskapsler",
    "category": 1
  },
  {
    "normalized": "egendefinerteinnstillinger",
    "category": 3
  },
  {
    "normalized": "fortsettutenagodta",
    "category": 2
  },
  {
    "normalized": "godkjennalleoglukk",
    "category": 1
  },
  {
    "normalized": "godtasporing",
    "category": 1
  },
  {
    "normalized": "retningslinerforinformasjonskapslar",
    "category": 0
  },
  {
    "normalized": "jeggodkjenner",
    "category": 1
  },
  {
    "normalized": "jegvilikkeoppgipostnummeretmitt",
    "category": 0
  },
  {
    "normalized": "endreinnstillingerforpersonvern",
    "category": 3
  },
  {
    "normalized": "retningslinjerforcookies",
    "category": 0
  },
  {
    "normalized": "lagrevalg",
    "category": 4
  },
  {
    "normalized": "kunnødvendigeinformasjonskapsler",
    "category": 2
  },
  {
    "normalized": "visoversikt",
    "category": 8
  },
  {
    "normalized": "cookiessdksandwebtrackingpolicy",
    "category": 0
  },
  {
    "normalized": "tilpassvalgetditt",
    "category": 3
  },
  {
    "normalized": "funksjon",
    "category": 0
  },
  {
    "normalized": "maling",
    "category": 0
  },
  {
    "normalized": "administrerindividuellepreferanser",
    "category": 3
  },
  {
    "normalized": "visvarecookies",
    "category": 8
  },
  {
    "normalized": "flereinnstillinger",
    "category": 3
  },
  {
    "normalized": "flerevalgavvis",
    "category": 3
  },
  {
    "normalized": "godtacookies",
    "category": 1
  },
  {
    "normalized": "samtykkeinformasjon",
    "category": 0
  },
  {
    "normalized": "jadetergreit",
    "category": 1
  },
  {
    "normalized": "redigerinnstillinger",
    "category": 3
  },
  {
    "normalized": "lesmerogtilpass",
    "category": 3
  },
  {
    "normalized": "klikkeher",
    "category": 8
  },
  {
    "normalized": "regjeringenno",
    "category": 0
  },
  {
    "normalized": "brukenøyaktigegeolokasjonsdata",
    "category": 0
  },
  {
    "normalized": "aktivtskanneenhetsegenskaperforidentifikasjon",
    "category": 0
  },
  {
    "normalized": "personligetilpassedeannonseroginnhold",
    "category": 0
  },
  {
    "normalized": "visannonseroginnholdsomerbeskyttetmotpersonvern",
    "category": 0
  },
  {
    "normalized": "listeoverpartnere",
    "category": 0
  },
  {
    "normalized": "brukanbefalteinformasjonskapsler",
    "category": 1
  },
  {
    "normalized": "personvernpolicy",
    "category": 0
  },
  {
    "normalized": "brukervilkar",
    "category": 0
  },
  {
    "normalized": "nødvendigepakrevd",
    "category": 2
  },
  {
    "normalized": "dittliv",
    "category": 0
  },
  {
    "normalized": "vareprodukter",
    "category": 0
  },
  {
    "normalized": "cookieerklæringenvar",
    "category": 0
  },
  {
    "normalized": "okformeg",
    "category": 1
  },
  {
    "normalized": "detaljerforinformasjonskapsler",
    "category": 3
  },
  {
    "normalized": "annonseinnstillinger",
    "category": 0
  },
  {
    "normalized": "schibstedsmarkedsføringhostredjepart",
    "category": 0
  },
  {
    "normalized": "schibstedsmarkedsføringhostredjepartgjelderschibsted",
    "category": 0
  },
  {
    "normalized": "oversiktovercookiessamtendrepreferanser",
    "category": 3
  },
  {
    "normalized": "personopplysningspolicy",
    "category": 0
  },
  {
    "normalized": "retningslinjerinformasjonskapsler",
    "category": 0
  },
  {
    "normalized": "cupidoclub",
    "category": 0
  },
  {
    "normalized": "cupidoshop",
    "category": 0
  },
  {
    "normalized": "lesmerher",
    "category": 8
  },
  {
    "normalized": "lesmerominformasjonskapsler>>",
    "category": 8
  },
  {
    "normalized": "retningslinjenevareforinformasjonskapsler",
    "category": 0
  },
  {
    "normalized": "greitgavidere>",
    "category": 1
  },
  {
    "normalized": "innstilinger",
    "category": 3
  },
  {
    "normalized": "deaktiverealle",
    "category": 2
  },
  {
    "normalized": "tillatinformasjonkapsler",
    "category": 1
  },
  {
    "normalized": "bekreftvalgenemine",
    "category": 4
  },
  {
    "normalized": "dukanlesemeromvarbrukavcookiesher",
    "category": 0
  },
  {
    "normalized": "varpersonvernerklæring",
    "category": 0
  },
  {
    "normalized": "tillatvalgtekategoriertillatallecookies",
    "category": 0
  },
  {
    "normalized": "egenskaper",
    "category": 0
  },
  {
    "normalized": "sepreferanser",
    "category": 3
  },
  {
    "normalized": "googlesprivacyterms",
    "category": 0
  },
  {
    "normalized": "αποδοχηολων",
    "category": 1
  },
  {
    "normalized": "απορριψηολων",
    "category": 2
  },
  {
    "normalized": "εμφανισηλεπτομερειων",
    "category": 3
  },
  {
    "normalized": "συμφωνω",
    "category": 1
  },
  {
    "normalized": "διαφωνω",
    "category": 2
  },
  {
    "normalized": "περισσοτερεσεπιλογεσ",
    "category": 3
  },
  {
    "normalized": "διαβαστεπερισσοτερα",
    "category": 8
  },
  {
    "normalized": "ρυθμισεις",
    "category": 3
  },
  {
    "normalized": "αποδεχομαι",
    "category": 1
  },
  {
    "normalized": "προβοληλεπτομερειων",
    "category": 8
  },
  {
    "normalized": "αποδοχη",
    "category": 1
  },
  {
    "normalized": "απορριψη",
    "category": 2
  },
  {
    "normalized": "ρυθμισειςcookies",
    "category": 3
  },
  {
    "normalized": "δεναποδεχομαι",
    "category": 2
  },
  {
    "normalized": "αποδοχηολωντωνcookies",
    "category": 1
  },
  {
    "normalized": "αποδοχηεπιλογων",
    "category": 1
  },
  {
    "normalized": "περισσοτερα",
    "category": 8
  },
  {
    "normalized": "αποδοχηεπιλεγμενων",
    "category": 4
  },
  {
    "normalized": "οχι",
    "category": 2
  },
  {
    "normalized": "ρυθμισειςγιαταcookies",
    "category": 3
  },
  {
    "normalized": "αποθηκευσηπροτιμησεων",
    "category": 4
  },
  {
    "normalized": "αποδοχηcookies",
    "category": 1
  },
  {
    "normalized": "διαχειρησηcookies",
    "category": 3
  },
  {
    "normalized": "αναγκαια",
    "category": 0
  },
  {
    "normalized": "σχετικαμεταcookies",
    "category": 8
  },
  {
    "normalized": "δεχομαι",
    "category": 1
  },
  {
    "normalized": "κλεισιμο",
    "category": 8
  },
  {
    "normalized": "εδω",
    "category": 2
  },
  {
    "normalized": "αποδοχητωνcookies",
    "category": 1
  },
  {
    "normalized": "περισσοτερεςρυθμισεις",
    "category": 3
  },
  {
    "normalized": "διαχειριση",
    "category": 3
  },
  {
    "normalized": "acceptpreferences",
    "category": 1
  },
  {
    "normalized": "επιτρεπονταιολαταcookies",
    "category": 1
  },
  {
    "normalized": "επιτρεπεταιηεπιλογη",
    "category": 4
  },
  {
    "normalized": "χρησιμοποιηστεμονοτααπαραιτηταcookies",
    "category": 2
  },
  {
    "normalized": "showallpartners31→",
    "category": 0
  },
  {
    "normalized": "αποδοχηκαισυνεχειαστησελιδα",
    "category": 1
  },
  {
    "normalized": "επεξεργασιαπολιτικηςcookies",
    "category": 0
  },
  {
    "normalized": "αλλαξτετιςπροτιμησειςμου",
    "category": 3
  },
  {
    "normalized": "απορριπτω",
    "category": 2
  },
  {
    "normalized": "πολιτικηcookies",
    "category": 0
  },
  {
    "normalized": "τηνεχωδιαβασεικαιτηνκατανοω",
    "category": 1
  },
  {
    "normalized": "αλλαγητωνπροτιμησεωνμου",
    "category": 3
  },
  {
    "normalized": "loginsignup",
    "category": 0
  },
  {
    "normalized": "ordernow",
    "category": 0
  },
  {
    "normalized": "acceptrequired",
    "category": 8
  },
  {
    "normalized": "informationandsettings",
    "category": 3
  },
  {
    "normalized": "αποδοχηολωνκαικλεισιμο",
    "category": 1
  },
  {
    "normalized": "δηλωσηγιαταcookies",
    "category": 0
  },
  {
    "normalized": "προσαρμογη",
    "category": 3
  },
  {
    "normalized": "cyeur",
    "category": 0
  },
  {
    "normalized": "κανεεγγραφη",
    "category": 0
  },
  {
    "normalized": "ορισμοςπροτιμησης",
    "category": 3
  },
  {
    "normalized": "yesiloveyourcookies",
    "category": 1
  },
  {
    "normalized": "ourhospital",
    "category": 0
  },
  {
    "normalized": "doctors",
    "category": 0
  },
  {
    "normalized": "hospitalservices",
    "category": 0
  },
  {
    "normalized": "rehabilitation",
    "category": 0
  },
  {
    "normalized": "medicaltourism",
    "category": 0
  },
  {
    "normalized": "νεαεκδηλωσεισ",
    "category": 0
  },
  {
    "normalized": "λεπτομερειες",
    "category": 3
  },
  {
    "normalized": "orchoosewhattoenable",
    "category": 3
  },
  {
    "normalized": "customization",
    "category": 3
  },
  {
    "normalized": "searchfor",
    "category": 0
  },
  {
    "normalized": "ακυρωση",
    "category": 2
  },
  {
    "normalized": "advertisement",
    "category": 0
  },
  {
    "normalized": "others",
    "category": 0
  },
  {
    "normalized": "συνεργατες",
    "category": 0
  },
  {
    "normalized": "getitnow",
    "category": 0
  },
  {
    "normalized": "αποδοχηκαικλεισιμο",
    "category": 1
  },
  {
    "normalized": "wwweventsboussiascom",
    "category": 0
  },
  {
    "normalized": "+35722252572",
    "category": 0
  },
  {
    "normalized": "linkedin",
    "category": 0
  },
  {
    "normalized": "flickr",
    "category": 0
  },
  {
    "normalized": "απαραιτητα",
    "category": 0
  },
  {
    "normalized": "ελληνικα",
    "category": 0
  },
  {
    "normalized": "πληροφοριες",
    "category": 0
  },
  {
    "normalized": "αποδοχηορωνcookies",
    "category": 1
  },
  {
    "normalized": "doyouneedhelp",
    "category": 0
  },
  {
    "normalized": "rent",
    "category": 0
  },
  {
    "normalized": "company",
    "category": 0
  },
  {
    "normalized": "forrent",
    "category": 0
  },
  {
    "normalized": "διαχειρισηρυθμισεων",
    "category": 3
  },
  {
    "normalized": "επικοινωνηστεμαζιμας",
    "category": 0
  },
  {
    "normalized": "βοηθεια",
    "category": 0
  },
  {
    "normalized": "λογαριασμος",
    "category": 0
  },
  {
    "normalized": "δειτετηνπολιτικηαπορρητουμας",
    "category": 0
  },
  {
    "normalized": "+35722396000",
    "category": 0
  },
  {
    "normalized": "infopmccy",
    "category": 0
  },
  {
    "normalized": "τοπανεπιστημιο",
    "category": 0
  },
  {
    "normalized": "σπουδεσ",
    "category": 0
  },
  {
    "normalized": "υποψηφιοιφοιτητεσ",
    "category": 0
  },
  {
    "normalized": "φοιτητεσ",
    "category": 0
  },
  {
    "normalized": "ερευνα",
    "category": 0
  },
  {
    "normalized": "βιβλιοθηκη",
    "category": 0
  },
  {
    "normalized": "συνδεση",
    "category": 0
  },
  {
    "normalized": "ρυθμισηcookies",
    "category": 3
  },
  {
    "normalized": "optout",
    "category": 2
  },
  {
    "normalized": "ενεργοποιησηολων",
    "category": 1
  },
  {
    "normalized": "accommodation",
    "category": 0
  },
  {
    "normalized": "explorepaphos",
    "category": 0
  },
  {
    "normalized": "προτιμησεισ",
    "category": 3
  },
  {
    "normalized": "volumeoff",
    "category": 0
  },
  {
    "normalized": "souhlasim",
    "category": 1
  },
  {
    "normalized": "podrobnenastaveni",
    "category": 3
  },
  {
    "normalized": "podivejtesenanasich123partneru",
    "category": 0
  },
  {
    "normalized": "prijmoutvse",
    "category": 1
  },
  {
    "normalized": "rozumimaprijimam",
    "category": 1
  },
  {
    "normalized": "odmitnout",
    "category": 2
  },
  {
    "normalized": "dalsivolby",
    "category": 3
  },
  {
    "normalized": "povolitvse",
    "category": 1
  },
  {
    "normalized": "nastaveni",
    "category": 3
  },
  {
    "normalized": "vybranymipartnery",
    "category": 0
  },
  {
    "normalized": "prihlasitse",
    "category": 0
  },
  {
    "normalized": "nastavenicookies",
    "category": 3
  },
  {
    "normalized": "zobrazitdetaily",
    "category": 8
  },
  {
    "normalized": "vsechnykategorie",
    "category": 9
  },
  {
    "normalized": "odmitnoutvse",
    "category": 2
  },
  {
    "normalized": "upravit",
    "category": 3
  },
  {
    "normalized": "prizpusobit",
    "category": 3
  },
  {
    "normalized": "pouzenezbytne",
    "category": 2
  },
  {
    "normalized": "odmitnoutvsechny",
    "category": 2
  },
  {
    "normalized": "vporadku",
    "category": 1
  },
  {
    "normalized": "upravitnastaveni",
    "category": 3
  },
  {
    "normalized": "prijmoutvsechny",
    "category": 1
  },
  {
    "normalized": "souhlas",
    "category": 1
  },
  {
    "normalized": "povolitvsechnycookies",
    "category": 1
  },
  {
    "normalized": "povolitvyber",
    "category": 4
  },
  {
    "normalized": "prijmout",
    "category": 1
  },
  {
    "normalized": "souhlasimsevsemi",
    "category": 1
  },
  {
    "normalized": "souhlasimsevsim",
    "category": 1
  },
  {
    "normalized": "viceocookies",
    "category": 8
  },
  {
    "normalized": "pouzitjentechnickecookies",
    "category": 2
  },
  {
    "normalized": "upravitmepredvolby",
    "category": 3
  },
  {
    "normalized": "prizpusobitnastavenicookies",
    "category": 3
  },
  {
    "normalized": "zamitnout",
    "category": 2
  },
  {
    "normalized": "zamitnoutvse",
    "category": 2
  },
  {
    "normalized": "prehleduapodminkachcookiescsob",
    "category": 0
  },
  {
    "normalized": "prijmoutvsechnysouborycookie",
    "category": 1
  },
  {
    "normalized": "povolitnezbytne",
    "category": 2
  },
  {
    "normalized": "povolitvsechny",
    "category": 1
  },
  {
    "normalized": "odmitnoutvolitelnecookies",
    "category": 2
  },
  {
    "normalized": "prijmoutvsechnycookies",
    "category": 1
  },
  {
    "normalized": "odmitam",
    "category": 2
  },
  {
    "normalized": "dalsiinformace",
    "category": 3
  },
  {
    "normalized": "prijmoutnezbytne",
    "category": 2
  },
  {
    "normalized": "souhlasimapokracovat",
    "category": 1
  },
  {
    "normalized": "prijmoutpouzenezbytne",
    "category": 2
  },
  {
    "normalized": "vareni",
    "category": 0
  },
  {
    "normalized": "pouzenezbytnecookies",
    "category": 2
  },
  {
    "normalized": "vice",
    "category": 8
  },
  {
    "normalized": "anosouhlasim",
    "category": 1
  },
  {
    "normalized": "seznampartnerudodavatelu",
    "category": 0
  },
  {
    "normalized": "spravovatcookies",
    "category": 3
  },
  {
    "normalized": "informaceocookies",
    "category": 8
  },
  {
    "normalized": "nesouhlasim",
    "category": 2
  },
  {
    "normalized": "souhlasitazavrit",
    "category": 1
  },
  {
    "normalized": "odmitnoutsouborycookies",
    "category": 2
  },
  {
    "normalized": "nastavenisoukromi",
    "category": 3
  },
  {
    "normalized": "detailninastaveni",
    "category": 3
  },
  {
    "normalized": "nastavenipreferenci",
    "category": 3
  },
  {
    "normalized": "souhlasimaprijimamvse",
    "category": 1
  },
  {
    "normalized": "odmitnoutvsechnycookies",
    "category": 2
  },
  {
    "normalized": "vstoupit",
    "category": 0
  },
  {
    "normalized": "vseprijmout",
    "category": 1
  },
  {
    "normalized": "zobrazitpodrobnosti",
    "category": 3
  },
  {
    "normalized": "prizpusobitnastaveni",
    "category": 3
  },
  {
    "normalized": "zjistitvice",
    "category": 0
  },
  {
    "normalized": "nastavenisouborucookie",
    "category": 3
  },
  {
    "normalized": "predplatitza99kcmesicne",
    "category": 0
  },
  {
    "normalized": "podrobnejsinastaveni",
    "category": 3
  },
  {
    "normalized": "ulozitsluzby",
    "category": 4
  },
  {
    "normalized": "odeslat",
    "category": 0
  },
  {
    "normalized": "rodina",
    "category": 0
  },
  {
    "normalized": "sexaintimnosti",
    "category": 0
  },
  {
    "normalized": "modaakrasa",
    "category": 0
  },
  {
    "normalized": "rozhovory",
    "category": 0
  },
  {
    "normalized": "seberozvoj",
    "category": 0
  },
  {
    "normalized": "zivotnistyl",
    "category": 0
  },
  {
    "normalized": "testyakvizy",
    "category": 0
  },
  {
    "normalized": "tvoreni",
    "category": 0
  },
  {
    "normalized": "radyatipy",
    "category": 0
  },
  {
    "normalized": "horoskopyastro",
    "category": 0
  },
  {
    "normalized": "povolitpouzenezbytne",
    "category": 2
  },
  {
    "normalized": "jentynezbytne",
    "category": 2
  },
  {
    "normalized": "nastavitpreference",
    "category": 3
  },
  {
    "normalized": "tetostrance",
    "category": 0
  },
  {
    "normalized": "vydavatelusdruzenicpex",
    "category": 0
  },
  {
    "normalized": "nechtemevybrat",
    "category": 3
  },
  {
    "normalized": "pouzitjennezbytnecookies",
    "category": 2
  },
  {
    "normalized": "zobrazitpredvolby",
    "category": 3
  },
  {
    "normalized": "ulozitnastaveni",
    "category": 4
  },
  {
    "normalized": "jennezbytne",
    "category": 2
  },
  {
    "normalized": "podivejtesenanasich81partneru",
    "category": 0
  },
  {
    "normalized": "individualninastaveni",
    "category": 3
  },
  {
    "normalized": "doladitnastaveni",
    "category": 3
  },
  {
    "normalized": "detailnejsinastavenicookies",
    "category": 3
  },
  {
    "normalized": "spravovatmoznosti",
    "category": 3
  },
  {
    "normalized": "safeandsound",
    "category": 0
  },
  {
    "normalized": "hledat",
    "category": 0
  },
  {
    "normalized": "nasi856partneri",
    "category": 0
  },
  {
    "normalized": "cestina",
    "category": 0
  },
  {
    "normalized": "neuprav",
    "category": 3
  },
  {
    "normalized": "souhlasimadale",
    "category": 1
  },
  {
    "normalized": "ochranaosobnichudaju",
    "category": 0
  },
  {
    "normalized": "viceinformaci",
    "category": 8
  },
  {
    "normalized": "schvalitvse",
    "category": 1
  },
  {
    "normalized": "spravovatpreference",
    "category": 3
  },
  {
    "normalized": "kliknutimzde",
    "category": 2
  },
  {
    "normalized": "povolitpouzenezbytnecookie",
    "category": 2
  },
  {
    "normalized": "povolitvsechnysouborycookie",
    "category": 1
  },
  {
    "normalized": "odmitamvse",
    "category": 2
  },
  {
    "normalized": "technickecookies",
    "category": 2
  },
  {
    "normalized": "ulozitazavrit",
    "category": 4
  },
  {
    "normalized": "nutnecookies",
    "category": 0
  },
  {
    "normalized": "statistickecookies",
    "category": 0
  },
  {
    "normalized": "preferencnicookies",
    "category": 0
  },
  {
    "normalized": "marketingovecookies",
    "category": 0
  },
  {
    "normalized": "jennutne",
    "category": 2
  },
  {
    "normalized": "spravovatpredvolby",
    "category": 3
  },
  {
    "normalized": "povolitvybrane",
    "category": 4
  },
  {
    "normalized": "zakazatnepotrebne",
    "category": 2
  },
  {
    "normalized": "povolitpouzenutne",
    "category": 2
  },
  {
    "normalized": "pokracujtebezprijeti",
    "category": 2
  },
  {
    "normalized": "vseodmitnout",
    "category": 2
  },
  {
    "normalized": "rozumimasouhlasim",
    "category": 1
  },
  {
    "normalized": "bylomi18letasouhlasim",
    "category": 0
  },
  {
    "normalized": "zmenitnastaveni",
    "category": 3
  },
  {
    "normalized": "rizenipredvoleb",
    "category": 3
  },
  {
    "normalized": "informacnimemorandum",
    "category": 0
  },
  {
    "normalized": "zasadypouzivanisouborucookiessadsdkasledovaniwebu",
    "category": 0
  },
  {
    "normalized": "spravovat",
    "category": 3
  },
  {
    "normalized": "provestjinyvyber",
    "category": 3
  },
  {
    "normalized": "pouzitjennutnecookies",
    "category": 2
  },
  {
    "normalized": "limbaromana",
    "category": 0
  },
  {
    "normalized": "823vendors",
    "category": 0
  },
  {
    "normalized": "odmitnutianebopodrobnenastaveni",
    "category": 3
  },
  {
    "normalized": "souborucookie",
    "category": 0
  },
  {
    "normalized": "spravovatsouborycookie",
    "category": 3
  },
  {
    "normalized": "vlastnimnastaveni",
    "category": 3
  },
  {
    "normalized": "podminky",
    "category": 8
  },
  {
    "normalized": "predvolby",
    "category": 3
  },
  {
    "normalized": "nasich807partneru",
    "category": 0
  },
  {
    "normalized": "odmitnoutazavrit",
    "category": 2
  },
  {
    "normalized": "akceptovatvse",
    "category": 1
  },
  {
    "normalized": "zobrazitucely",
    "category": 3
  },
  {
    "normalized": "nastavitcookies",
    "category": 3
  },
  {
    "normalized": "prijmoutnezbytnesouborycookie",
    "category": 2
  },
  {
    "normalized": "informationaboutcookies",
    "category": 0
  },
  {
    "normalized": "odmitnuti",
    "category": 2
  },
  {
    "normalized": "otevritnastaveni",
    "category": 3
  },
  {
    "normalized": "pouzepotrebne",
    "category": 2
  },
  {
    "normalized": "nastavenisouhlasu",
    "category": 3
  },
  {
    "normalized": "pouzenezbytnenutne",
    "category": 2
  },
  {
    "normalized": "135dodavatelizapojenymidotcfa64reklamnimipartnery",
    "category": 0
  },
  {
    "normalized": "jennezbytnecookies",
    "category": 2
  },
  {
    "normalized": "oblibenerecepty",
    "category": 0
  },
  {
    "normalized": "svetovakuchyne",
    "category": 0
  },
  {
    "normalized": "jakeinformaceukladameazpracovavame",
    "category": 0
  },
  {
    "normalized": "projakeucelytatodatavyuzivame",
    "category": 0
  },
  {
    "normalized": "kdemuzeteupravitvasenastaveni",
    "category": 0
  },
  {
    "normalized": "98partneru",
    "category": 0
  },
  {
    "normalized": "dalsinastaveni",
    "category": 3
  },
  {
    "normalized": "pokracovatbezsouhlasu",
    "category": 2
  },
  {
    "normalized": "zobrazitvice",
    "category": 8
  },
  {
    "normalized": "prijimam",
    "category": 1
  },
  {
    "normalized": "vyberusi",
    "category": 3
  },
  {
    "normalized": "pouzenutne",
    "category": 2
  },
  {
    "normalized": "zavrit",
    "category": 1
  },
  {
    "normalized": "vztahy",
    "category": 0
  },
  {
    "normalized": "celebrity",
    "category": 0
  },
  {
    "normalized": "psychologie",
    "category": 0
  },
  {
    "normalized": "zdravi",
    "category": 0
  },
  {
    "normalized": "zabava",
    "category": 0
  },
  {
    "normalized": "bydleni",
    "category": 0
  },
  {
    "normalized": "tajemno",
    "category": 0
  },
  {
    "normalized": "zasadyochranysoukromi",
    "category": 0
  },
  {
    "normalized": "obchodnipodminky",
    "category": 0
  },
  {
    "normalized": "cookieszasady",
    "category": 0
  },
  {
    "normalized": "obchodnimipodminkamispolecnostiburdamediaextrasro",
    "category": 0
  },
  {
    "normalized": "zasadamiochranysoukromi",
    "category": 0
  },
  {
    "normalized": "zasadochranysoukromiburdamediaextrasro",
    "category": 0
  },
  {
    "normalized": "zmenitnastavenicookies",
    "category": 3
  },
  {
    "normalized": "odmitnoutcookies",
    "category": 2
  },
  {
    "normalized": "souhlasimchcipokracovatvpracisezakonyprolidi",
    "category": 1
  },
  {
    "normalized": "informaceoprovozovateli",
    "category": 0
  },
  {
    "normalized": "pouzenutnecookies",
    "category": 2
  },
  {
    "normalized": "precistvice",
    "category": 8
  },
  {
    "normalized": "cteni",
    "category": 0
  },
  {
    "normalized": "pokracujtebezsouhlasu→",
    "category": 2
  },
  {
    "normalized": "pokracujtebezsouhlasu→odmitnoutvse",
    "category": 2
  },
  {
    "normalized": "zasadyzpracovaniosobnichudaju",
    "category": 0
  },
  {
    "normalized": "duveryhodnychpartneru",
    "category": 0
  },
  {
    "normalized": "prohlasenioochraneudaju",
    "category": 0
  },
  {
    "normalized": "udajeoprovozovatelihornbach",
    "category": 0
  },
  {
    "normalized": "vicemoznosti",
    "category": 3
  },
  {
    "normalized": "souhlasimsevsemibody",
    "category": 1
  },
  {
    "normalized": "bleskcz",
    "category": 0
  },
  {
    "normalized": "bleskprozeny",
    "category": 0
  },
  {
    "normalized": "damacz",
    "category": 0
  },
  {
    "normalized": "maminkacz",
    "category": 0
  },
  {
    "normalized": "e15cz",
    "category": 0
  },
  {
    "normalized": "reflexcz",
    "category": 0
  },
  {
    "normalized": "fitwebcz",
    "category": 0
  },
  {
    "normalized": "zenycz",
    "category": 0
  },
  {
    "normalized": "mojezdravicz",
    "category": 0
  },
  {
    "normalized": "nejnovejsi",
    "category": 0
  },
  {
    "normalized": "suroviny",
    "category": 0
  },
  {
    "normalized": "rady",
    "category": 0
  },
  {
    "normalized": "food",
    "category": 0
  },
  {
    "normalized": "videorecepty",
    "category": 0
  },
  {
    "normalized": "zdravyobed",
    "category": 0
  },
  {
    "normalized": "rychlavecere",
    "category": 0
  },
  {
    "normalized": "chutovky",
    "category": 0
  },
  {
    "normalized": "polevky",
    "category": 0
  },
  {
    "normalized": "omacky",
    "category": 0
  },
  {
    "normalized": "prilohy",
    "category": 0
  },
  {
    "normalized": "testoviny",
    "category": 0
  },
  {
    "normalized": "moucniky",
    "category": 0
  },
  {
    "normalized": "rychle",
    "category": 0
  },
  {
    "normalized": "sladke",
    "category": 0
  },
  {
    "normalized": "dezerty",
    "category": 0
  },
  {
    "normalized": "vegetarianskeazdrave",
    "category": 0
  },
  {
    "normalized": "showpreferences",
    "category": 3
  },
  {
    "normalized": "kontaktujtenasjsmeoffline",
    "category": 0
  },
  {
    "normalized": "podminkachpouzivanisouborucookies",
    "category": 0
  },
  {
    "normalized": "predvolbyprosouborycookies",
    "category": 3
  },
  {
    "normalized": "informace",
    "category": 0
  },
  {
    "normalized": "redakce",
    "category": 0
  },
  {
    "normalized": "nutne",
    "category": 0
  },
  {
    "normalized": "nastavenireklam",
    "category": 0
  },
  {
    "normalized": "vlastnivybercookies",
    "category": 3
  },
  {
    "normalized": "περισσοτερεςπληροφοριες",
    "category": 3
  },
  {
    "normalized": "ναεπιτρεπονταιολα",
    "category": 1
  },
  {
    "normalized": "ενταξει",
    "category": 1
  },
  {
    "normalized": "απορριψηcookies",
    "category": 2
  },
  {
    "normalized": "ναιαποδεχομαιμονοτααπαραιτηταcookies>",
    "category": 2
  },
  {
    "normalized": "ναιτααποδεχομαι",
    "category": 1
  },
  {
    "normalized": "διαχειρισηπροτιμησεων",
    "category": 3
  },
  {
    "normalized": "δεσυμφωνω",
    "category": 2
  },
  {
    "normalized": "αναζητηση",
    "category": 0
  },
  {
    "normalized": "αρνηση",
    "category": 2
  },
  {
    "normalized": "ενημερωθηκα",
    "category": 1
  },
  {
    "normalized": "αλλαγηρυθμισεων",
    "category": 3
  },
  {
    "normalized": "οι856συνεργατεςμας",
    "category": 0
  },
  {
    "normalized": "ενοτηταλεπτομερειες",
    "category": 8
  },
  {
    "normalized": "εμφανισησκοπων",
    "category": 3
  },
  {
    "normalized": "απορριψηολωντωνcookies",
    "category": 2
  },
  {
    "normalized": "keyboard",
    "category": 0
  },
  {
    "normalized": "καταλαβα",
    "category": 1
  },
  {
    "normalized": "αποδοχηαπαραιτητων",
    "category": 2
  },
  {
    "normalized": "προβοληπροτιμησεων",
    "category": 3
  },
  {
    "normalized": "καταλογοςσυνεργατωνπρομηθευτες",
    "category": 0
  },
  {
    "normalized": "στατιστικα",
    "category": 0
  },
  {
    "normalized": "αποδοχηαναγκαιων>",
    "category": 2
  },
  {
    "normalized": "αναγκαιαπροτιμησειςστατιστικαπροωθησηςπροβοληλεπτομερειων",
    "category": 0
  },
  {
    "normalized": "αναζητησηγια",
    "category": 0
  },
  {
    "normalized": "οκ",
    "category": 1
  },
  {
    "normalized": "αποθηκευσηεπιλογων",
    "category": 4
  },
  {
    "normalized": "αποδοχημονοτωναπολυτωςαπαραιτητων",
    "category": 2
  },
  {
    "normalized": "σχετικα",
    "category": 8
  },
  {
    "normalized": "αποθηκευσηκαικλεισιμο",
    "category": 4
  },
  {
    "normalized": "διαχειρισηεπιλογων",
    "category": 3
  },
  {
    "normalized": "ενημερωθηκαγιαταcookies",
    "category": 1
  },
  {
    "normalized": "εισοδος",
    "category": 0
  },
  {
    "normalized": "επιλογεςcookies",
    "category": 3
  },
  {
    "normalized": "μηαποδοχη",
    "category": 2
  },
  {
    "normalized": "αξιοπιστωνσυνεργατωντου",
    "category": 0
  },
  {
    "normalized": "καταλογοςπρομηθευτων",
    "category": 0
  },
  {
    "normalized": "συναινεση",
    "category": 1
  },
  {
    "normalized": "απαραιτηταcookies",
    "category": 0
  },
  {
    "normalized": "αποθηκευσηηκαιπροσβασησταδεδομεναμιαςσυσκευης",
    "category": 0
  },
  {
    "normalized": "χρησηπεριορισμενωνδεδομενωνγιατηνεπιλογηδιαφημισεων",
    "category": 0
  },
  {
    "normalized": "δημιουργιαπροφιλγιαεξατομικευμενεςδιαφημισεις",
    "category": 0
  },
  {
    "normalized": "χρησηπροφιλγιαεπιλογηεξατομικευμενωνδιαφημισεων",
    "category": 0
  },
  {
    "normalized": "δημιουργιαπροφιλγιαεξατομικευσηπεριεχομενου",
    "category": 0
  },
  {
    "normalized": "okσυμφωνω",
    "category": 1
  },
  {
    "normalized": "παραμετροποιηση",
    "category": 3
  },
  {
    "normalized": "μονοτααπολυτωςαπαραιτηταcookies",
    "category": 2
  },
  {
    "normalized": "αποδοχηεπιλογωναποδοχηολων",
    "category": 0
  },
  {
    "normalized": "εμπορικηςπροωθησης",
    "category": 0
  },
  {
    "normalized": "επιλογη",
    "category": 3
  },
  {
    "normalized": "επιλογες",
    "category": 3
  },
  {
    "normalized": "ναισυμφωνω",
    "category": 1
  },
  {
    "normalized": "μηαποδοχηολων",
    "category": 2
  },
  {
    "normalized": "προσαρμογηρυθμισεων",
    "category": 3
  },
  {
    "normalized": "προσαρμογητωνεπιλογωνμου",
    "category": 3
  },
  {
    "normalized": "αποθηκευσηρυθμισεων",
    "category": 3
  },
  {
    "normalized": "προτιμησειςγιαταcookies",
    "category": 3
  },
  {
    "normalized": "αρνησηπροσαρμογη",
    "category": 3
  },
  {
    "normalized": "επιλογηcookies",
    "category": 3
  },
  {
    "normalized": "εχωενημερωθει",
    "category": 1
  },
  {
    "normalized": "συνεχιστεχωριςαποδοχη",
    "category": 2
  },
  {
    "normalized": "ναεπιτραπουνολαταcookies",
    "category": 1
  },
  {
    "normalized": "expandmoreδανεζικα",
    "category": 0
  },
  {
    "normalized": "swaphoriz",
    "category": 0
  },
  {
    "normalized": "αγγλικα",
    "category": 0
  },
  {
    "normalized": "ρηματα",
    "category": 0
  },
  {
    "normalized": "φρασεις",
    "category": 0
  },
  {
    "normalized": "expandmoreδανεζικαswaphorizαγγλικα",
    "category": 0
  },
  {
    "normalized": "αναζητησημετοχων",
    "category": 0
  },
  {
    "normalized": "ρυθμιση",
    "category": 0
  },
  {
    "normalized": "απολυτωςαπαραιτητα",
    "category": 2
  },
  {
    "normalized": "πολιτικηαπορρητου",
    "category": 0
  },
  {
    "normalized": "περισσοτεραπαιχνιδια",
    "category": 0
  },
  {
    "normalized": "συνεχεια",
    "category": 1
  },
  {
    "normalized": "ελαβαγνωση",
    "category": 1
  },
  {
    "normalized": "bazaar4991499",
    "category": 0
  },
  {
    "normalized": "bazaarμαγιο299999",
    "category": 0
  },
  {
    "normalized": "νεαπροιοντα",
    "category": 0
  },
  {
    "normalized": "παπουτσια",
    "category": 0
  },
  {
    "normalized": "sneakers",
    "category": 0
  },
  {
    "normalized": "ρουχα",
    "category": 0
  },
  {
    "normalized": "μαγιο",
    "category": 0
  },
  {
    "normalized": "αξεσουαρ",
    "category": 0
  },
  {
    "normalized": "celebrities",
    "category": 0
  },
  {
    "normalized": "νewsroom",
    "category": 0
  },
  {
    "normalized": "specialfeatures",
    "category": 0
  },
  {
    "normalized": "μαθετεπερισσοτερααποδοχη",
    "category": 8
  },
  {
    "normalized": "μαθετεπερισσοτερα",
    "category": 3
  },
  {
    "normalized": "αποκρυψη",
    "category": 1
  },
  {
    "normalized": "αποθηκευσε",
    "category": 4
  },
  {
    "normalized": "ενοτητες",
    "category": 0
  },
  {
    "normalized": "αναγκαιαπροτιμησειςστατιστικαπροωθησης",
    "category": 0
  },
  {
    "normalized": "προωθησης",
    "category": 0
  },
  {
    "normalized": "προτιμησειςcookies",
    "category": 3
  },
  {
    "normalized": "συνεχειαχωρισcookies",
    "category": 2
  },
  {
    "normalized": "ναιεπιτρεπω",
    "category": 1
  },
  {
    "normalized": "οχιδενεπιτρεπω",
    "category": 2
  },
  {
    "normalized": "επεξεργασια",
    "category": 3
  },
  {
    "normalized": "επικαιροτητα",
    "category": 0
  },
  {
    "normalized": "γνωριστετοπαδα",
    "category": 0
  },
  {
    "normalized": "τοκαταλαβα",
    "category": 1
  },
  {
    "normalized": "αποσυρσησυγκαταθεσης",
    "category": 8
  },
  {
    "normalized": "αποδοχηαπαραιτητωνcookies",
    "category": 1
  },
  {
    "normalized": "elfogadom",
    "category": 1
  },
  {
    "normalized": "tovabbilehetosegek",
    "category": 3
  },
  {
    "normalized": "nemfogadomel",
    "category": 2
  },
  {
    "normalized": "reszletekmegjelenitese",
    "category": 3
  },
  {
    "normalized": "osszeselfogadasa",
    "category": 1
  },
  {
    "normalized": "osszeselutasitasa",
    "category": 2
  },
  {
    "normalized": "beallitasok",
    "category": 3
  },
  {
    "normalized": "osszessutielfogadasa",
    "category": 1
  },
  {
    "normalized": "sutikbeallitasa",
    "category": 3
  },
  {
    "normalized": "osszessutiengedelyezese",
    "category": 1
  },
  {
    "normalized": "testreszabas",
    "category": 3
  },
  {
    "normalized": "rendben",
    "category": 1
  },
  {
    "normalized": "elutasitas",
    "category": 2
  },
  {
    "normalized": "elutasit",
    "category": 2
  },
  {
    "normalized": "osszesengedelyezese",
    "category": 1
  },
  {
    "normalized": "tovabbiinformaciok",
    "category": 3
  },
  {
    "normalized": "kivalasztasengedelyezese",
    "category": 4
  },
  {
    "normalized": "beleegyezes",
    "category": 1
  },
  {
    "normalized": "reszletek",
    "category": 3
  },
  {
    "normalized": "azosszeselfogadasa",
    "category": 1
  },
  {
    "normalized": "elfogad",
    "category": 1
  },
  {
    "normalized": "elutasitom",
    "category": 2
  },
  {
    "normalized": "folytatasbeleegyezesnelkul→",
    "category": 2
  },
  {
    "normalized": "elfogadasesbezaras",
    "category": 1
  },
  {
    "normalized": "sutibeallitasokmodositasa",
    "category": 3
  },
  {
    "normalized": "azosszessutielfogadasa",
    "category": 1
  },
  {
    "normalized": "sutibeallitasok",
    "category": 3
  },
  {
    "normalized": "sutikelfogadasa",
    "category": 1
  },
  {
    "normalized": "mindennekamegengedese",
    "category": 1
  },
  {
    "normalized": "asutikrol",
    "category": 0
  },
  {
    "normalized": "beallitasokmentese",
    "category": 4
  },
  {
    "normalized": "kizarolagazelengedhetetlensutikethasznalja",
    "category": 2
  },
  {
    "normalized": "mindetelfogadom",
    "category": 1
  },
  {
    "normalized": "beallitasokmodositasa",
    "category": 3
  },
  {
    "normalized": "kereses",
    "category": 0
  },
  {
    "normalized": "beallitasokkezelese",
    "category": 3
  },
  {
    "normalized": "elfogadas",
    "category": 1
  },
  {
    "normalized": "megtagad",
    "category": 2
  },
  {
    "normalized": "adatvedelmiszabalyzat",
    "category": 0
  },
  {
    "normalized": "egyetertek",
    "category": 1
  },
  {
    "normalized": "egyenibeallitasok",
    "category": 3
  },
  {
    "normalized": "mindencookieelfogadasa",
    "category": 1
  },
  {
    "normalized": "mindencookieelutasitasa",
    "category": 2
  },
  {
    "normalized": "rendbenvan",
    "category": 1
  },
  {
    "normalized": "koszonomnem",
    "category": 2
  },
  {
    "normalized": "azosszesengedelyezese",
    "category": 1
  },
  {
    "normalized": "igenelfogadom",
    "category": 1
  },
  {
    "normalized": "elfogadomazosszeset",
    "category": 1
  },
  {
    "normalized": "tovabbitudnivalok→",
    "category": 3
  },
  {
    "normalized": "belepes",
    "category": 0
  },
  {
    "normalized": "kosarba",
    "category": 0
  },
  {
    "normalized": "szoboszlaidominik",
    "category": 0
  },
  {
    "normalized": "haboruukrajnaban",
    "category": 0
  },
  {
    "normalized": "gurulodollarok",
    "category": 0
  },
  {
    "normalized": "davidpressman",
    "category": 0
  },
  {
    "normalized": "magyarpeter",
    "category": 0
  },
  {
    "normalized": "mukodeshezszuksegessutikengedelyezese",
    "category": 2
  },
  {
    "normalized": "azosszessutiengedelyezese",
    "category": 1
  },
  {
    "normalized": "reszletesbeallitasok",
    "category": 3
  },
  {
    "normalized": "hozzajarulas",
    "category": 0
  },
  {
    "normalized": "mindentelfogad",
    "category": 1
  },
  {
    "normalized": "szemelyreszabas",
    "category": 3
  },
  {
    "normalized": "beallitasokszerkesztese",
    "category": 3
  },
  {
    "normalized": "regisztracio",
    "category": 0
  },
  {
    "normalized": "856partnerunk",
    "category": 0
  },
  {
    "normalized": "csakaszuksegessutikcookiek",
    "category": 2
  },
  {
    "normalized": "elfogadomestovabb",
    "category": 1
  },
  {
    "normalized": "ertem",
    "category": 1
  },
  {
    "normalized": "partnerunk",
    "category": 0
  },
  {
    "normalized": "csakszukseges",
    "category": 2
  },
  {
    "normalized": "csakelengedhetetlensutikengedelyezese",
    "category": 2
  },
  {
    "normalized": "megertettem",
    "category": 1
  },
  {
    "normalized": "csakazalapvetosutikelfogadasa",
    "category": 2
  },
  {
    "normalized": "bovebben",
    "category": 8
  },
  {
    "normalized": "osszessutielutasitasa",
    "category": 2
  },
  {
    "normalized": "elengedhetetlen",
    "category": 0
  },
  {
    "normalized": "partnereinkmegtekintese",
    "category": 0
  },
  {
    "normalized": "egyebtudnivalok",
    "category": 0
  },
  {
    "normalized": "elfogadasbezaras",
    "category": 1
  },
  {
    "normalized": "kivalasztottakelfogadasa",
    "category": 4
  },
  {
    "normalized": "beallitasokvaltoztatasa",
    "category": 3
  },
  {
    "normalized": "rendbenelfogadom",
    "category": 1
  },
  {
    "normalized": "beallitasokmegvaltoztatasa",
    "category": 3
  },
  {
    "normalized": "sutikszerkesztese",
    "category": 3
  },
  {
    "normalized": "cookiesdkeshasonlotechnologiakravonatkozoszabalyzat",
    "category": 0
  },
  {
    "normalized": "domainregisztracio",
    "category": 0
  },
  {
    "normalized": "masodszintukozdomainek",
    "category": 0
  },
  {
    "normalized": "ujdomain",
    "category": 0
  },
  {
    "normalized": "domainatregisztralas",
    "category": 0
  },
  {
    "normalized": "mindenelutasitasa",
    "category": 2
  },
  {
    "normalized": "kezeles",
    "category": 0
  },
  {
    "normalized": "elmultam18eveselfogadom",
    "category": 0
  },
  {
    "normalized": "megnemvagyok18eves",
    "category": 0
  },
  {
    "normalized": "sutikengedelyezese",
    "category": 1
  },
  {
    "normalized": "kereskedoink758",
    "category": 0
  },
  {
    "normalized": "hozzajarulasmindenhez",
    "category": 0
  },
  {
    "normalized": "kategoriak",
    "category": 0
  },
  {
    "normalized": "markak",
    "category": 0
  },
  {
    "normalized": "mesehosok",
    "category": 0
  },
  {
    "normalized": "kiemeltajanlatok",
    "category": 0
  },
  {
    "normalized": "igenegyetertek",
    "category": 1
  },
  {
    "normalized": "mindensutielfogadasa",
    "category": 1
  },
  {
    "normalized": "mukodeshezszuksegessutik",
    "category": 2
  },
  {
    "normalized": "mutassaareszleteket",
    "category": 8
  },
  {
    "normalized": "rolunk",
    "category": 0
  },
  {
    "normalized": "reszleteskereses",
    "category": 0
  },
  {
    "normalized": "kosar",
    "category": 0
  },
  {
    "normalized": "rovatok",
    "category": 0
  },
  {
    "normalized": "belfold",
    "category": 0
  },
  {
    "normalized": "magazinok",
    "category": 0
  },
  {
    "normalized": "orszagszerte",
    "category": 0
  },
  {
    "normalized": "napilap",
    "category": 0
  },
  {
    "normalized": "forforeigners",
    "category": 0
  },
  {
    "normalized": "velemenyvaro",
    "category": 0
  },
  {
    "normalized": "galeria",
    "category": 0
  },
  {
    "normalized": "feliratkozomahirlevelre",
    "category": 0
  },
  {
    "normalized": "elofizetekazujsagra",
    "category": 0
  },
  {
    "normalized": "csakaszuksegeseketfogadomel",
    "category": 2
  },
  {
    "normalized": "mindensutiengedelyezese",
    "category": 1
  },
  {
    "normalized": "aweboldalmukodesehezfeltetlenulszuksegessutik",
    "category": 0
  },
  {
    "normalized": "funkcionalissutik",
    "category": 0
  },
  {
    "normalized": "szemelyreszabotthirdetesekmegjelenitesehezszuksegessutik",
    "category": 0
  },
  {
    "normalized": "beallitasokelfogadasa",
    "category": 4
  },
  {
    "normalized": "beallitasokmegnyitasa",
    "category": 3
  },
  {
    "normalized": "elfogadomajavasoltsutibeallitasokat",
    "category": 1
  },
  {
    "normalized": "elfogadomasutikhasznalatat",
    "category": 1
  },
  {
    "normalized": "elutasitomasutikhasznalatat",
    "category": 2
  },
  {
    "normalized": "sutibeallitasokmegjelenitese",
    "category": 3
  },
  {
    "normalized": "testreszabom",
    "category": 3
  },
  {
    "normalized": "csakaaszuksegesek",
    "category": 2
  },
  {
    "normalized": "feliratkozas",
    "category": 0
  },
  {
    "normalized": "elfogadomazosszessutit",
    "category": 1
  },
  {
    "normalized": "tovabbibeallitasok",
    "category": 3
  },
  {
    "normalized": "mindelfogadom",
    "category": 1
  },
  {
    "normalized": "osszespartnermegjelenitese823→",
    "category": 0
  },
  {
    "normalized": "mutasdareszleteket",
    "category": 8
  },
  {
    "normalized": "sztar",
    "category": 0
  },
  {
    "normalized": "eletmodi",
    "category": 0
  },
  {
    "normalized": "yesss",
    "category": 0
  },
  {
    "normalized": "mani",
    "category": 0
  },
  {
    "normalized": "ingatlantkeresek",
    "category": 0
  },
  {
    "normalized": "szerzoink",
    "category": 0
  },
  {
    "normalized": "kivalasztottakengedelyezese",
    "category": 4
  },
  {
    "normalized": "mindencookieengedelyezese",
    "category": 1
  },
  {
    "normalized": "csakszuksegescookiek",
    "category": 2
  },
  {
    "normalized": "cookielista",
    "category": 0
  },
  {
    "normalized": "sutikrevonatkozoiranyelveinket",
    "category": 0
  },
  {
    "normalized": "cookiebeallitasokkezelese",
    "category": 3
  },
  {
    "normalized": "fogadjelmindent",
    "category": 1
  },
  {
    "normalized": "kiprobalom",
    "category": 0
  },
  {
    "normalized": "beallitas",
    "category": 3
  },
  {
    "normalized": "folytataselfogadasnelkul",
    "category": 2
  },
  {
    "normalized": "cookiekkezelese",
    "category": 3
  },
  {
    "normalized": "preferenciakbeallitasa",
    "category": 3
  },
  {
    "normalized": "elutasitmindent",
    "category": 2
  },
  {
    "normalized": "az143partnerunk",
    "category": 0
  },
  {
    "normalized": "adatvedelmibeallitasok",
    "category": 3
  },
  {
    "normalized": "sutiktestreszabasa",
    "category": 3
  },
  {
    "normalized": "cookieszabalyzatunknakmegfeleloen",
    "category": 0
  },
  {
    "normalized": "kotelezo",
    "category": 0
  },
  {
    "normalized": "megbizhatopartnereinek",
    "category": 0
  },
  {
    "normalized": "elutasitani",
    "category": 2
  },
  {
    "normalized": "azosszeselutasitasa",
    "category": 2
  },
  {
    "normalized": "elfogadomazadatvedelmitajekoztatobanszereplofelteteleket",
    "category": 1
  },
  {
    "normalized": "elutasitomacookiekhasznalatat",
    "category": 2
  },
  {
    "normalized": "elfogadomacookiekhasznalatat",
    "category": 1
  },
  {
    "normalized": "szukseges",
    "category": 0
  },
  {
    "normalized": "informacio",
    "category": 0
  },
  {
    "normalized": "fooldal",
    "category": 0
  },
  {
    "normalized": "uzleteink",
    "category": 0
  },
  {
    "normalized": "partnereklistajaszallitok",
    "category": 0
  },
  {
    "normalized": "az122partnerunk",
    "category": 0
  },
  {
    "normalized": "osszeselfogadasabeallitasokmentese",
    "category": 9
  },
  {
    "normalized": "adatvedelem",
    "category": 0
  },
  {
    "normalized": "sutiinformaciok",
    "category": 0
  },
  {
    "normalized": "altalanosszerzodesifeltetelek",
    "category": 0
  },
  {
    "normalized": "mindenhol",
    "category": 0
  },
  {
    "normalized": "segitseg",
    "category": 0
  },
  {
    "normalized": "hirlevel",
    "category": 0
  },
  {
    "normalized": "konyv",
    "category": 0
  },
  {
    "normalized": "film",
    "category": 0
  },
  {
    "normalized": "zene",
    "category": 0
  },
  {
    "normalized": "kotta",
    "category": 0
  },
  {
    "normalized": "hangoskonyv",
    "category": 0
  },
  {
    "normalized": "antikvar",
    "category": 0
  },
  {
    "normalized": "ajandek",
    "category": 0
  },
  {
    "normalized": "akciok",
    "category": 0
  },
  {
    "normalized": "ujdonsagok",
    "category": 0
  },
  {
    "normalized": "elorendelheto",
    "category": 0
  },
  {
    "normalized": "cookiesutikezeles",
    "category": 8
  },
  {
    "normalized": "unkat",
    "category": 0
  },
  {
    "normalized": "adatkezelesitajekoztato",
    "category": 0
  },
  {
    "normalized": "egyenibeallitasokelutasitasosszesengedelyezese",
    "category": 9
  },
  {
    "normalized": "itttolthetile",
    "category": 0
  },
  {
    "normalized": "feliratkozom",
    "category": 0
  },
  {
    "normalized": "tobblehetoseg",
    "category": 3
  },
  {
    "normalized": "csakakotelezosutik",
    "category": 2
  },
  {
    "normalized": "kulfold",
    "category": 0
  },
  {
    "normalized": "bozot",
    "category": 0
  },
  {
    "normalized": "insider",
    "category": 0
  },
  {
    "normalized": "lelkizo",
    "category": 0
  },
  {
    "normalized": "sztardzsusz",
    "category": 0
  },
  {
    "normalized": "huha",
    "category": 0
  },
  {
    "normalized": "fules",
    "category": 0
  },
  {
    "normalized": "bizarr",
    "category": 0
  },
  {
    "normalized": "szexmas",
    "category": 0
  },
  {
    "normalized": "otthonka",
    "category": 0
  },
  {
    "normalized": "medicina",
    "category": 0
  },
  {
    "normalized": "fazek",
    "category": 0
  },
  {
    "normalized": "napituti",
    "category": 0
  },
  {
    "normalized": "oldalvonal",
    "category": 0
  },
  {
    "normalized": "kiajobb",
    "category": 0
  },
  {
    "normalized": "tuzeloallas",
    "category": 0
  },
  {
    "normalized": "anapvideoja",
    "category": 0
  },
  {
    "normalized": "anapkepe",
    "category": 0
  },
  {
    "normalized": "sikk",
    "category": 0
  },
  {
    "normalized": "manimeker",
    "category": 0
  },
  {
    "normalized": "partnereinklistaja",
    "category": 0
  },
  {
    "normalized": "mikazokasutik",
    "category": 0
  },
  {
    "normalized": "ajavasoltbeallitasokelfogadasa",
    "category": 1
  },
  {
    "normalized": "acookieszabalyzatunkbantalalsz",
    "category": 0
  },
  {
    "normalized": "cookiebeallitasok",
    "category": 3
  },
  {
    "normalized": "elutasithatod",
    "category": 2
  },
  {
    "normalized": "bezarhato",
    "category": 8
  },
  {
    "normalized": "bezaras",
    "category": 1
  },
  {
    "normalized": "az807partnerunk",
    "category": 0
  },
  {
    "normalized": "webaruhazrendszer",
    "category": 0
  },
  {
    "normalized": "tamogatas",
    "category": 0
  },
  {
    "normalized": "reszletesleiras",
    "category": 8
  },
  {
    "normalized": "hirdetesbeallitasai",
    "category": 0
  },
  {
    "normalized": "partnereinkszolgaltatok",
    "category": 0
  },
  {
    "normalized": "osszeselutasitasaosszessutielfogadasa",
    "category": 0
  },
  {
    "normalized": "optionalecookieszuruckweisen",
    "category": 2
  },
  {
    "normalized": "sozialeswirtschaft",
    "category": 0
  },
  {
    "normalized": "ausblenden",
    "category": 1
  },
  {
    "normalized": "vaduz",
    "category": 0
  },
  {
    "normalized": "freizeittourismus",
    "category": 0
  },
  {
    "normalized": "wohnenumwelt",
    "category": 0
  },
  {
    "normalized": "politikverwaltung",
    "category": 0
  },
  {
    "normalized": "exploreourservices",
    "category": 0
  },
  {
    "normalized": "zeigedetails",
    "category": 3
  },
  {
    "normalized": "verwendetecookies",
    "category": 0
  },
  {
    "normalized": "qdevliprivacypolicy",
    "category": 0
  },
  {
    "normalized": "nurdienotwendigencookies",
    "category": 2
  },
  {
    "normalized": "ichakzeptiere",
    "category": 1
  },
  {
    "normalized": "samþykkja",
    "category": 1
  },
  {
    "normalized": "loka",
    "category": 1
  },
  {
    "normalized": "nanar",
    "category": 3
  },
  {
    "normalized": "leyfafotspor",
    "category": 1
  },
  {
    "normalized": "hafnaollum",
    "category": 2
  },
  {
    "normalized": "vistastillingar",
    "category": 4
  },
  {
    "normalized": "stillingar",
    "category": 3
  },
  {
    "normalized": "leyfanauðsynlegar",
    "category": 2
  },
  {
    "normalized": "leyfaallar",
    "category": 1
  },
  {
    "normalized": "allowonlynecessary",
    "category": 2
  },
  {
    "normalized": "ilagi",
    "category": 1
  },
  {
    "normalized": "nein",
    "category": 2
  },
  {
    "normalized": "frekariupplysingar",
    "category": 8
  },
  {
    "normalized": "lesastefnuokkarumnotkunavafrakokum",
    "category": 0
  },
  {
    "normalized": "lokakokum",
    "category": 8
  },
  {
    "normalized": "afram",
    "category": 1
  },
  {
    "normalized": "playables",
    "category": 0
  },
  {
    "normalized": "samþykkjavefkokur",
    "category": 1
  },
  {
    "normalized": "readfullarticle",
    "category": 0
  },
  {
    "normalized": "sjananar",
    "category": 8
  },
  {
    "normalized": "gerenciarpreferencias",
    "category": 3
  },
  {
    "normalized": "lokaogsamþykkja",
    "category": 1
  },
  {
    "normalized": "samþykkjaallarvefkokur",
    "category": 1
  },
  {
    "normalized": "vefkokustillingar",
    "category": 3
  },
  {
    "normalized": "haldaaframanþessaðsamþykkja",
    "category": 2
  },
  {
    "normalized": "donotsellorsharemypersonalinformation",
    "category": 2
  },
  {
    "normalized": "iknowclose",
    "category": 1
  },
  {
    "normalized": "climateenvironment",
    "category": 0
  },
  {
    "normalized": "communityservices",
    "category": 0
  },
  {
    "normalized": "infrastructure",
    "category": 0
  },
  {
    "normalized": "localstrategyplanning",
    "category": 0
  },
  {
    "normalized": "officeindustrial",
    "category": 0
  },
  {
    "normalized": "residential",
    "category": 0
  },
  {
    "normalized": "retailleisure",
    "category": 0
  },
  {
    "normalized": "transport",
    "category": 0
  },
  {
    "normalized": "deactivatewebsiteanalytics",
    "category": 2
  },
  {
    "normalized": "samþykki",
    "category": 1
  },
  {
    "normalized": "richardmille",
    "category": 0
  },
  {
    "normalized": "dining",
    "category": 0
  },
  {
    "normalized": "tourstransfers",
    "category": 0
  },
  {
    "normalized": "booking",
    "category": 0
  },
  {
    "normalized": "accepttoate",
    "category": 1
  },
  {
    "normalized": "vreausamodificsetarileindividual",
    "category": 3
  },
  {
    "normalized": "listapartenerifurnizori",
    "category": 0
  },
  {
    "normalized": "suntdeacord",
    "category": 1
  },
  {
    "normalized": "afisare",
    "category": 3
  },
  {
    "normalized": "maimulteoptiuni",
    "category": 3
  },
  {
    "normalized": "permitetoate",
    "category": 1
  },
  {
    "normalized": "parteneri",
    "category": 0
  },
  {
    "normalized": "accepttoatecookieurile",
    "category": 1
  },
  {
    "normalized": "setari",
    "category": 3
  },
  {
    "normalized": "respingtoate",
    "category": 2
  },
  {
    "normalized": "permiteselectia",
    "category": 4
  },
  {
    "normalized": "respinge",
    "category": 2
  },
  {
    "normalized": "setaricookieuri",
    "category": 3
  },
  {
    "normalized": "aminteles",
    "category": 1
  },
  {
    "normalized": "vizualizatiscopuri",
    "category": 3
  },
  {
    "normalized": "setaricookies",
    "category": 3
  },
  {
    "normalized": "permiteretoate",
    "category": 1
  },
  {
    "normalized": "doarcookieuriesentiale",
    "category": 2
  },
  {
    "normalized": "sipartenerii",
    "category": 0
  },
  {
    "normalized": "185parteneri",
    "category": 0
  },
  {
    "normalized": "gestioneazaoptiunile",
    "category": 3
  },
  {
    "normalized": "deacordinchidere",
    "category": 1
  },
  {
    "normalized": "respingetitoate",
    "category": 2
  },
  {
    "normalized": "aflamaimulte",
    "category": 8
  },
  {
    "normalized": "personalizeaza",
    "category": 3
  },
  {
    "normalized": "refuza",
    "category": 2
  },
  {
    "normalized": "setaripersonalizate",
    "category": 3
  },
  {
    "normalized": "acceptcookieuri",
    "category": 1
  },
  {
    "normalized": "politicadeconfidentialitate",
    "category": 0
  },
  {
    "normalized": "aratadetaliile",
    "category": 3
  },
  {
    "normalized": "modificasetarile",
    "category": 3
  },
  {
    "normalized": "adaugaincos",
    "category": 0
  },
  {
    "normalized": "acceptatitoate",
    "category": 1
  },
  {
    "normalized": "administreazapreferintele",
    "category": 3
  },
  {
    "normalized": "refuztoate",
    "category": 2
  },
  {
    "normalized": "preferintecookieuri",
    "category": 3
  },
  {
    "normalized": "refuzati",
    "category": 2
  },
  {
    "normalized": "maimulte→",
    "category": 3
  },
  {
    "normalized": "personalizati",
    "category": 3
  },
  {
    "normalized": "dasuntdeacord",
    "category": 1
  },
  {
    "normalized": "aratadetalii",
    "category": 3
  },
  {
    "normalized": "gestioneazasetarile",
    "category": 3
  },
  {
    "normalized": "consimtamant",
    "category": 0
  },
  {
    "normalized": "despre",
    "category": 0
  },
  {
    "normalized": "gestionatipreferintele",
    "category": 3
  },
  {
    "normalized": "deacordsiinchide",
    "category": 1
  },
  {
    "normalized": "refuzatot",
    "category": 2
  },
  {
    "normalized": "refuzaretoate",
    "category": 2
  },
  {
    "normalized": "acceptaretoate",
    "category": 1
  },
  {
    "normalized": "maimulteinformatii",
    "category": 3
  },
  {
    "normalized": "manageuseofyourdata",
    "category": 3
  },
  {
    "normalized": "termenisiconditii",
    "category": 0
  },
  {
    "normalized": "preferintecookie",
    "category": 3
  },
  {
    "normalized": "utilizarecookieurinecesare",
    "category": 2
  },
  {
    "normalized": "studenti",
    "category": 0
  },
  {
    "normalized": "accepttot",
    "category": 1
  },
  {
    "normalized": "doarcookieuriobligatorii",
    "category": 2
  },
  {
    "normalized": "setatipreferintele",
    "category": 3
  },
  {
    "normalized": "preferinte",
    "category": 3
  },
  {
    "normalized": "cookieuriesentiale",
    "category": 2
  },
  {
    "normalized": "maimult",
    "category": 8
  },
  {
    "normalized": "citestemaimult",
    "category": 8
  },
  {
    "normalized": "helpdesk",
    "category": 0
  },
  {
    "normalized": "setarepreferinte",
    "category": 3
  },
  {
    "normalized": "elfogadomasutiket",
    "category": 1
  },
  {
    "normalized": "setareapreferintelor",
    "category": 3
  },
  {
    "normalized": "gestioneazapreferinte",
    "category": 3
  },
  {
    "normalized": "inchide",
    "category": 0
  },
  {
    "normalized": "optiunicookies",
    "category": 3
  },
  {
    "normalized": "permitetifolosireacookieurilor",
    "category": 1
  },
  {
    "normalized": "maabonez",
    "category": 0
  },
  {
    "normalized": "facultati",
    "category": 0
  },
  {
    "normalized": "cercetare",
    "category": 0
  },
  {
    "normalized": "personalizaticookieurile",
    "category": 3
  },
  {
    "normalized": "respingetitoatecookieurile",
    "category": 2
  },
  {
    "normalized": "permitetitoatecookieurile",
    "category": 1
  },
  {
    "normalized": "vezicolaboratoriinostri",
    "category": 0
  },
  {
    "normalized": "okeikgaakkoord",
    "category": 1
  },
  {
    "normalized": "cosprodusegolmomentan",
    "category": 0
  },
  {
    "normalized": "tvvideo",
    "category": 0
  },
  {
    "normalized": "homeaudio",
    "category": 0
  },
  {
    "normalized": "castiaudioportabile",
    "category": 0
  },
  {
    "normalized": "laptoppc",
    "category": 0
  },
  {
    "normalized": "electrocasnice",
    "category": 0
  },
  {
    "normalized": "preferintedeconsimtamant",
    "category": 3
  },
  {
    "normalized": "aicipotirefuzaconsimtamantul",
    "category": 2
  },
  {
    "normalized": "eoklealegpetoate",
    "category": 1
  },
  {
    "normalized": "continuafaracookieuri",
    "category": 2
  },
  {
    "normalized": "afisatitotipartenerii820→",
    "category": 0
  },
  {
    "normalized": "nuacceptcookieuri",
    "category": 2
  },
  {
    "normalized": "desprecookieuri",
    "category": 0
  },
  {
    "normalized": "abonare",
    "category": 0
  },
  {
    "normalized": "aflatimaimulte",
    "category": 8
  },
  {
    "normalized": "examplesofinformationthatmightbeused",
    "category": 0
  },
  {
    "normalized": "refuzcookieurile",
    "category": 2
  },
  {
    "normalized": "modificapreferinteledeconsimtamant",
    "category": 3
  },
  {
    "normalized": "protectiadatelor",
    "category": 0
  },
  {
    "normalized": "partenerilordeincredere",
    "category": 0
  },
  {
    "normalized": "listacomerciantilor",
    "category": 0
  },
  {
    "normalized": "stocareasisauaccesareainformatiilordepeundispozitiv",
    "category": 0
  },
  {
    "normalized": "utilizareadedatelimitatepentruaselectapublicitatea",
    "category": 0
  },
  {
    "normalized": "creareaprofilurilorpentrupublicitatepersonalizata",
    "category": 0
  },
  {
    "normalized": "utilizareaprofilurilorpentruselectareapublicitatiipersonalizate",
    "category": 0
  },
  {
    "normalized": "creareaprofilurilordecontinutpersonalizat",
    "category": 0
  },
  {
    "normalized": "utilizareaprofilurilorpentruselectareacontinutuluipersonalizat",
    "category": 0
  },
  {
    "normalized": "schimbasetarile",
    "category": 3
  },
  {
    "normalized": "mergilaflipro",
    "category": 0
  },
  {
    "normalized": "vinde",
    "category": 0
  },
  {
    "normalized": "appleiphone13pro512gbsierrablue",
    "category": 0
  },
  {
    "normalized": "appleiphone15128gbblue",
    "category": 0
  },
  {
    "normalized": "superdeal",
    "category": 0
  },
  {
    "normalized": "appleiphone14promax128gbdeeppurple",
    "category": 0
  },
  {
    "normalized": "comunicare",
    "category": 0
  },
  {
    "normalized": "programe",
    "category": 0
  },
  {
    "normalized": "salveazasiinchide",
    "category": 4
  },
  {
    "normalized": "gestionati",
    "category": 3
  },
  {
    "normalized": "salvatisetarile",
    "category": 3
  },
  {
    "normalized": "modificapreferintele",
    "category": 3
  },
  {
    "normalized": "personalizeazasetarile",
    "category": 3
  },
  {
    "normalized": "respingetotul",
    "category": 2
  },
  {
    "normalized": "acceptati",
    "category": 1
  },
  {
    "normalized": "136defurnizoritcfsi64departeneripublicitari",
    "category": 0
  },
  {
    "normalized": "gestionatioptiunile",
    "category": 3
  },
  {
    "normalized": "cookieuri",
    "category": 8
  },
  {
    "normalized": "engleza",
    "category": 0
  },
  {
    "normalized": "=legenda",
    "category": 0
  },
  {
    "normalized": "cautare",
    "category": 0
  },
  {
    "normalized": "nusuntdeacord",
    "category": 2
  },
  {
    "normalized": "inteles",
    "category": 0
  },
  {
    "normalized": "respingetitoatecuexceptiacookieurilorstrictnecesare",
    "category": 2
  },
  {
    "normalized": "acceptalepetoate",
    "category": 1
  },
  {
    "normalized": "doarceleobligatorii",
    "category": 2
  },
  {
    "normalized": "personalizaresetari",
    "category": 3
  },
  {
    "normalized": "permitetinumaicookieurileselectate",
    "category": 4
  },
  {
    "normalized": "permitetoatecookies",
    "category": 1
  },
  {
    "normalized": "continuafaraaprobare",
    "category": 2
  },
  {
    "normalized": "schimbapreferintele",
    "category": 3
  },
  {
    "normalized": "contulmeu",
    "category": 0
  },
  {
    "normalized": "setaridetaliate",
    "category": 3
  },
  {
    "normalized": "accepttotul",
    "category": 1
  },
  {
    "normalized": "elutasitokmindensutit",
    "category": 2
  },
  {
    "normalized": "acceptselectia",
    "category": 4
  },
  {
    "normalized": "infoupb",
    "category": 0
  },
  {
    "normalized": "desprenoi",
    "category": 0
  },
  {
    "normalized": "informatiipublice",
    "category": 0
  },
  {
    "normalized": "resurse",
    "category": 0
  },
  {
    "normalized": "utilizaredoarcookieurinecesare",
    "category": 2
  },
  {
    "normalized": "continuatifaraaaccepta",
    "category": 2
  },
  {
    "normalized": "acceptatitot",
    "category": 1
  },
  {
    "normalized": "refuzatitot",
    "category": 2
  },
  {
    "normalized": "gestionaremodulecookie",
    "category": 3
  },
  {
    "normalized": "regulamentbonusuri",
    "category": 0
  },
  {
    "normalized": "doaresential",
    "category": 2
  },
  {
    "normalized": "administreazaserviciile",
    "category": 8
  },
  {
    "normalized": "vezipreferintele",
    "category": 3
  },
  {
    "normalized": "extinde",
    "category": 0
  },
  {
    "normalized": "procesareacomenziiin24h",
    "category": 0
  },
  {
    "normalized": "retururisimple",
    "category": 0
  },
  {
    "normalized": "livraregratuita",
    "category": 0
  },
  {
    "normalized": "platasecurizata",
    "category": 0
  },
  {
    "normalized": "prelucrareadatelorcucaracterpersonal",
    "category": 0
  },
  {
    "normalized": "administraresetari",
    "category": 3
  },
  {
    "normalized": "wishlistintraincont",
    "category": 0
  },
  {
    "normalized": "showroom",
    "category": 0
  },
  {
    "normalized": "recomandari",
    "category": 0
  },
  {
    "normalized": "resigilate",
    "category": 0
  },
  {
    "normalized": "functionalepreferintestatisticisocialmediapublicitateonline",
    "category": 0
  },
  {
    "normalized": "politicaprivindcookies",
    "category": 0
  },
  {
    "normalized": "33parteneriainostri",
    "category": 0
  },
  {
    "normalized": "declaratiecookie",
    "category": 0
  },
  {
    "normalized": "814parteneriainostri",
    "category": 0
  },
  {
    "normalized": "refuzatoatepreferinteaccepttoate",
    "category": 0
  },
  {
    "normalized": "19parteneriainostri",
    "category": 0
  },
  {
    "normalized": "respingeretoate",
    "category": 2
  },
  {
    "normalized": "politicadecookiesaici",
    "category": 0
  },
  {
    "normalized": "appleipadair310520193rdgencellular256gbspacegray",
    "category": 0
  },
  {
    "normalized": "cauta",
    "category": 0
  },
  {
    "normalized": "respingetot",
    "category": 2
  },
  {
    "normalized": "informatiidecontact",
    "category": 0
  },
  {
    "normalized": "politicaprivindcookieurile",
    "category": 0
  },
  {
    "normalized": "anm|2018administratianationalademeteorologie",
    "category": 0
  },
  {
    "normalized": "hartavalorilordetemperaturaaerului",
    "category": 0
  },
  {
    "normalized": "temperaturaresimtita",
    "category": 0
  },
  {
    "normalized": "indicelederacire",
    "category": 0
  },
  {
    "normalized": "temperaturaaeruluivalorimaxime",
    "category": 0
  },
  {
    "normalized": "vremea",
    "category": 0
  },
  {
    "normalized": "autentificare",
    "category": 0
  },
  {
    "normalized": "switchskin",
    "category": 0
  },
  {
    "normalized": "our527partners",
    "category": 0
  },
  {
    "normalized": "politicanoastraprivindcookieurile",
    "category": 0
  },
  {
    "normalized": "maimultedetalii",
    "category": 8
  },
  {
    "normalized": "listadecookieuri",
    "category": 0
  },
  {
    "normalized": "autoevaluare",
    "category": 0
  },
  {
    "normalized": "interpretareanalize",
    "category": 0
  },
  {
    "normalized": "sanatateaz",
    "category": 0
  },
  {
    "normalized": "medicamente",
    "category": 0
  },
  {
    "normalized": "suplimente",
    "category": 0
  },
  {
    "normalized": "cautamedic",
    "category": 0
  },
  {
    "normalized": "clinici",
    "category": 0
  },
  {
    "normalized": "grupuridiscutii",
    "category": 0
  },
  {
    "normalized": "programarimedic",
    "category": 0
  },
  {
    "normalized": "politicaprivindmodulelecookie",
    "category": 0
  },
  {
    "normalized": "preferinteprivindmodulelecookie",
    "category": 3
  },
  {
    "normalized": "vezidetalii",
    "category": 8
  },
  {
    "normalized": "necesare",
    "category": 0
  },
  {
    "normalized": "denavigare",
    "category": 0
  },
  {
    "normalized": "termeniisiconditiile",
    "category": 0
  },
  {
    "normalized": "eelisa",
    "category": 0
  },
  {
    "normalized": "facebookpageopensinnewwindow",
    "category": 0
  },
  {
    "normalized": "xpageopensinnewwindow",
    "category": 0
  },
  {
    "normalized": "instagrampageopensinnewwindow",
    "category": 0
  },
  {
    "normalized": "youtubepageopensinnewwindow",
    "category": 0
  },
  {
    "normalized": "universitate",
    "category": 0
  },
  {
    "normalized": "admitere",
    "category": 0
  },
  {
    "normalized": "politicacookies",
    "category": 0
  },
  {
    "normalized": "winnerfun",
    "category": 0
  },
  {
    "normalized": "sporturi",
    "category": 0
  },
  {
    "normalized": "modelclasicmodeluk",
    "category": 0
  },
  {
    "normalized": "livebetting",
    "category": 0
  },
  {
    "normalized": "livecazinou",
    "category": 0
  },
  {
    "normalized": "promotii",
    "category": 0
  },
  {
    "normalized": "regulamentdejoc",
    "category": 0
  },
  {
    "normalized": "recuperareparola",
    "category": 0
  },
  {
    "normalized": "jocresponsabil",
    "category": 0
  },
  {
    "normalized": "metodedeplata",
    "category": 0
  },
  {
    "normalized": "cookieuripublicitare",
    "category": 0
  },
  {
    "normalized": "cookieurifunctionale",
    "category": 0
  },
  {
    "normalized": "cookieuridesuport",
    "category": 0
  },
  {
    "normalized": "suntdeacordnusuntdeacord",
    "category": 9
  },
  {
    "normalized": "odmietnut",
    "category": 2
  },
  {
    "normalized": "prijatvsetko",
    "category": 1
  },
  {
    "normalized": "povolitvsetko",
    "category": 1
  },
  {
    "normalized": "prisposobit",
    "category": 3
  },
  {
    "normalized": "odmietnutvsetko",
    "category": 2
  },
  {
    "normalized": "prijatvsetkycookies",
    "category": 1
  },
  {
    "normalized": "uchovavaniealebopristupkinformaciamnazariadeni",
    "category": 0
  },
  {
    "normalized": "pokracovatsnevyhnutnymicookies→",
    "category": 2
  },
  {
    "normalized": "povolitvsetkycookies",
    "category": 1
  },
  {
    "normalized": "zamietnutvsetky",
    "category": 2
  },
  {
    "normalized": "tretimstranam",
    "category": 0
  },
  {
    "normalized": "akceptovatvsetky",
    "category": 1
  },
  {
    "normalized": "prijatvsetkysuborycookie",
    "category": 1
  },
  {
    "normalized": "presneudajeogeografickejpoloheaidentifikaciaskenovanimzariadenia",
    "category": 0
  },
  {
    "normalized": "akceptovatvsetkycookies",
    "category": 1
  },
  {
    "normalized": "personalizovanareklamaaobsahmeraniereklamyaobsahuprieskumcielovychskupinavyvojsluzieb",
    "category": 0
  },
  {
    "normalized": "prijat",
    "category": 1
  },
  {
    "normalized": "viacmoznosti",
    "category": 3
  },
  {
    "normalized": "odmietnutsuborycookie",
    "category": 2
  },
  {
    "normalized": "nastaveniasuborovcookie",
    "category": 3
  },
  {
    "normalized": "odmietnutcookies",
    "category": 2
  },
  {
    "normalized": "nasi860partneri",
    "category": 0
  },
  {
    "normalized": "ibanevyhnutne",
    "category": 2
  },
  {
    "normalized": "podmienkachspracuvaniacookies",
    "category": 0
  },
  {
    "normalized": "zamietnut",
    "category": 2
  },
  {
    "normalized": "akceptovat",
    "category": 1
  },
  {
    "normalized": "pokracovatbezsuhlasu→",
    "category": 2
  },
  {
    "normalized": "pouzivaniepresnychudajovogeografickejpolohe",
    "category": 0
  },
  {
    "normalized": "aktivneskenovaniecharakteristikzariadenianaidentifikaciu",
    "category": 0
  },
  {
    "normalized": "lennevyhnutne",
    "category": 2
  },
  {
    "normalized": "precitatviac",
    "category": 8
  },
  {
    "normalized": "nastavit",
    "category": 3
  },
  {
    "normalized": "dalsieinformacie→",
    "category": 3
  },
  {
    "normalized": "odmietnutvsetkycookies",
    "category": 2
  },
  {
    "normalized": "pozritesinasich95partnerov",
    "category": 0
  },
  {
    "normalized": "prijatnevyhnutne",
    "category": 2
  },
  {
    "normalized": "okpokracujte",
    "category": 1
  },
  {
    "normalized": "continuewithnecessarycookies→",
    "category": 2
  },
  {
    "normalized": "povolit",
    "category": 1
  },
  {
    "normalized": "vlastnenastavenie",
    "category": 3
  },
  {
    "normalized": "prijatibanevyhnutne",
    "category": 2
  },
  {
    "normalized": "akceptovatcookies",
    "category": 1
  },
  {
    "normalized": "pokracovatbezsuhlasu→pokracovatsnevyhnutnymicookies",
    "category": 2
  },
  {
    "normalized": "suborovcookies",
    "category": 0
  },
  {
    "normalized": "spravovatsuborycookies",
    "category": 3
  },
  {
    "normalized": "pozritesinasich841partnerov",
    "category": 0
  },
  {
    "normalized": "tojevporiadku",
    "category": 1
  },
  {
    "normalized": "tcfpartnersandotherpartners",
    "category": 0
  },
  {
    "normalized": "zobrazitviac",
    "category": 8
  },
  {
    "normalized": "nasi106partneri",
    "category": 0
  },
  {
    "normalized": "suhlasimsvybranymi",
    "category": 4
  },
  {
    "normalized": "itsluzby",
    "category": 0
  },
  {
    "normalized": "hlasadata",
    "category": 0
  },
  {
    "normalized": "mojucet",
    "category": 0
  },
  {
    "normalized": "pokracovatsnevyhnutnymicookies→pokracovatsnevyhnutnymicookies→",
    "category": 2
  },
  {
    "normalized": "viacinformacii",
    "category": 8
  },
  {
    "normalized": "ochranaosobnychudajov",
    "category": 0
  },
  {
    "normalized": "suhlasimarrowforward",
    "category": 1
  },
  {
    "normalized": "alowed",
    "category": 1
  },
  {
    "normalized": "detailnejsienastaveniecookies",
    "category": 3
  },
  {
    "normalized": "slovencina",
    "category": 0
  },
  {
    "normalized": "popriet",
    "category": 2
  },
  {
    "normalized": "nastaveniecookie",
    "category": 3
  },
  {
    "normalized": "vasiminastaveniami",
    "category": 3
  },
  {
    "normalized": "nepovolitnic",
    "category": 2
  },
  {
    "normalized": "lennevyhnutnecookies",
    "category": 2
  },
  {
    "normalized": "suhlasimadalej",
    "category": 1
  },
  {
    "normalized": "suhlasimodmietnutcookies",
    "category": 2
  },
  {
    "normalized": "suhlasimpovolitcookies",
    "category": 1
  },
  {
    "normalized": "3sluzby",
    "category": 0
  },
  {
    "normalized": "akceptovatvybrane",
    "category": 4
  },
  {
    "normalized": "35thirdparties",
    "category": 0
  },
  {
    "normalized": "cookieprocessingterms",
    "category": 0
  },
  {
    "normalized": "nastaveniepreferencii",
    "category": 3
  },
  {
    "normalized": "suhlasitapokracovat",
    "category": 1
  },
  {
    "normalized": "technologickipartneri",
    "category": 0
  },
  {
    "normalized": "tumozeteodmietnutsuhlas",
    "category": 2
  },
  {
    "normalized": "zasadyochranyosobnychudajov",
    "category": 0
  },
  {
    "normalized": "zistitviac",
    "category": 8
  },
  {
    "normalized": "detailyanastavenie",
    "category": 3
  },
  {
    "normalized": "nasich1412partnerov",
    "category": 0
  },
  {
    "normalized": "podrobnosti",
    "category": 3
  },
  {
    "normalized": "suhlasimprejstnaclanok",
    "category": 1
  },
  {
    "normalized": "nevyhnutnecookies",
    "category": 0
  },
  {
    "normalized": "nastaveniesuborovcookies",
    "category": 3
  },
  {
    "normalized": "potvrdit",
    "category": 1
  },
  {
    "normalized": "nastaveniareklamy",
    "category": 0
  },
  {
    "normalized": "inyvyber",
    "category": 3
  },
  {
    "normalized": "moznosti",
    "category": 3
  },
  {
    "normalized": "suhlasim>>>",
    "category": 1
  },
  {
    "normalized": "zakazatvsetko",
    "category": 2
  },
  {
    "normalized": "mindelutasitasa",
    "category": 2
  },
  {
    "normalized": "mindelfogadasa",
    "category": 1
  },
  {
    "normalized": "povolitcookies",
    "category": 1
  },
  {
    "normalized": "zakazatcookies",
    "category": 2
  },
  {
    "normalized": "odoslatsmssozlavovymkodom",
    "category": 0
  },
  {
    "normalized": "zakladneafunkcne",
    "category": 2
  },
  {
    "normalized": "nastaveniach",
    "category": 3
  },
  {
    "normalized": "cookienastavenie",
    "category": 3
  },
  {
    "normalized": "skeur",
    "category": 0
  },
  {
    "normalized": "prihlasenie",
    "category": 0
  },
  {
    "normalized": "otheroptions",
    "category": 3
  },
  {
    "normalized": "marketingove",
    "category": 0
  },
  {
    "normalized": "odmietnutie",
    "category": 2
  },
  {
    "normalized": "otvoritnastavenie",
    "category": 3
  },
  {
    "normalized": "pozritesinasich17partnerov",
    "category": 0
  },
  {
    "normalized": "povolitlennevyhnutne",
    "category": 2
  },
  {
    "normalized": "prijatpotrebne",
    "category": 2
  },
  {
    "normalized": "spravovatnastavenia",
    "category": 3
  },
  {
    "normalized": "potvrditnastaveniacookies",
    "category": 4
  },
  {
    "normalized": "nastaveniesukromia",
    "category": 3
  },
  {
    "normalized": "nechajtemavybrat",
    "category": 3
  },
  {
    "normalized": "suhlasimsovsetkym",
    "category": 1
  },
  {
    "normalized": "vyberiemsi",
    "category": 3
  },
  {
    "normalized": "lenpotrebnecookies",
    "category": 2
  },
  {
    "normalized": "prijatvsetkoazavriet",
    "category": 1
  },
  {
    "normalized": "viac",
    "category": 8
  },
  {
    "normalized": "prijatlennevyhnutnecookies",
    "category": 2
  },
  {
    "normalized": "malsom18rokovasuhlasim",
    "category": 0
  },
  {
    "normalized": "odoberat",
    "category": 0
  },
  {
    "normalized": "sprostredkovateliaatretiestranyprijemcoviaudajov",
    "category": 0
  },
  {
    "normalized": "ulozit",
    "category": 4
  },
  {
    "normalized": "nepovolit",
    "category": 2
  },
  {
    "normalized": "nienesuhlasim",
    "category": 2
  },
  {
    "normalized": "prisposobitnastavenia",
    "category": 3
  },
  {
    "normalized": "upravitnastaveniasuborovcookies",
    "category": 3
  },
  {
    "normalized": "ibanevyhnutnecookies",
    "category": 2
  },
  {
    "normalized": "pokracovatbezprijatia",
    "category": 2
  },
  {
    "normalized": "odmietnete",
    "category": 2
  },
  {
    "normalized": "prijatcookies",
    "category": 1
  },
  {
    "normalized": "povolitanalytickecookies",
    "category": 8
  },
  {
    "normalized": "analytickecookies",
    "category": 0
  },
  {
    "normalized": "7sluzieb",
    "category": 0
  },
  {
    "normalized": "zmenanastaveni",
    "category": 3
  },
  {
    "normalized": "beriemnavedomie",
    "category": 1
  },
  {
    "normalized": "prijatvybrane",
    "category": 4
  },
  {
    "normalized": "zoznampartnerovdodavatelov",
    "category": 0
  },
  {
    "normalized": "zasadachpouzivaniacookies",
    "category": 0
  },
  {
    "normalized": "vyhlasenieoochraneudajov",
    "category": 0
  },
  {
    "normalized": "udajeoprevadzkovatelovihornbach",
    "category": 0
  },
  {
    "normalized": "odmietamsuborycookie",
    "category": 2
  },
  {
    "normalized": "prijimamsuborycookie",
    "category": 1
  },
  {
    "normalized": "odmietnutpokracovatbezsuhlasu→",
    "category": 2
  },
  {
    "normalized": "nasi926partneri",
    "category": 0
  },
  {
    "normalized": "viacocookies",
    "category": 0
  },
  {
    "normalized": "suhlasit",
    "category": 1
  },
  {
    "normalized": "pravidlachochranyosobnychudajov",
    "category": 0
  },
  {
    "normalized": "kontaktujtenas",
    "category": 0
  },
  {
    "normalized": "ucet",
    "category": 0
  },
  {
    "normalized": "informaciaospracuvanicookies",
    "category": 0
  },
  {
    "normalized": "dalsiemoznosti",
    "category": 3
  },
  {
    "normalized": "ktosom",
    "category": 0
  },
  {
    "normalized": "zivotnesituacie",
    "category": 0
  },
  {
    "normalized": "socialnepoistenie",
    "category": 0
  },
  {
    "normalized": "nastrojeasluzby",
    "category": 0
  },
  {
    "normalized": "upravitpredvolby",
    "category": 3
  },
  {
    "normalized": "nevyhnutne",
    "category": 0
  },
  {
    "normalized": "viacinfo",
    "category": 0
  },
  {
    "normalized": "webglobe",
    "category": 0
  },
  {
    "normalized": "deploy",
    "category": 0
  },
  {
    "normalized": "diorama",
    "category": 0
  },
  {
    "normalized": "suhlasimachcempokracovat",
    "category": 1
  },
  {
    "normalized": "vlastnenastaveniasuborovcookies",
    "category": 3
  },
  {
    "normalized": "wwwuniqaskosobneudaje",
    "category": 0
  },
  {
    "normalized": "zoznampartnerovobchodnikov",
    "category": 0
  },
  {
    "normalized": "prihlasitnaodbernoviniek",
    "category": 0
  },
  {
    "normalized": "dinlokalevinduespolerertopprofessionelservice",
    "category": 0
  },
  {
    "normalized": "stillingaravafrakokum",
    "category": 3
  },
  {
    "normalized": "leyfavafrakokur",
    "category": 1
  },
  {
    "normalized": "lesameira",
    "category": 3
  },
  {
    "normalized": "þiggjaallarkokur",
    "category": 1
  },
  {
    "normalized": "stillakokur",
    "category": 3
  },
  {
    "normalized": "samþykkjaallarkokur",
    "category": 1
  },
  {
    "normalized": "nanarumvafrakokur",
    "category": 8
  },
  {
    "normalized": "upplysingarumvefkokur",
    "category": 8
  },
  {
    "normalized": "personuverndarstefna",
    "category": 0
  },
  {
    "normalized": "stillingarfotspora",
    "category": 3
  },
  {
    "normalized": "hafna",
    "category": 2
  },
  {
    "normalized": "sjameira",
    "category": 8
  },
  {
    "normalized": "manageorreject",
    "category": 3
  },
  {
    "normalized": "leyfavefkokur",
    "category": 1
  },
  {
    "normalized": "oflokkaðarkokur",
    "category": 0
  },
  {
    "normalized": "auglysingakokur",
    "category": 0
  },
  {
    "normalized": "tolfræðikokur",
    "category": 0
  },
  {
    "normalized": "virknikokur",
    "category": 0
  },
  {
    "normalized": "nauðsynlegarvefkokur",
    "category": 0
  },
  {
    "normalized": "veljaallt",
    "category": 0
  },
  {
    "normalized": "aðeinsnauðsynlegarvefkokur",
    "category": 2
  },
  {
    "normalized": "samþykkjaallt",
    "category": 1
  },
  {
    "normalized": "skoða",
    "category": 9
  },
  {
    "normalized": "stillingaravefkokum",
    "category": 3
  },
  {
    "normalized": "synaupplysingar",
    "category": 8
  },
  {
    "normalized": "samþykkjavafrakokur",
    "category": 1
  },
  {
    "normalized": "nanarumvefkokur",
    "category": 8
  },
  {
    "normalized": "nanariupplysingar",
    "category": 8
  },
  {
    "normalized": "vistaval",
    "category": 4
  },
  {
    "normalized": "samþykkjaallar",
    "category": 1
  },
  {
    "normalized": "samþykkjakokur",
    "category": 1
  },
  {
    "normalized": "stillingarfyrirvefkokur",
    "category": 3
  },
  {
    "normalized": "leyfaval",
    "category": 4
  },
  {
    "normalized": "samþykkjaallarvafrakokur",
    "category": 1
  },
  {
    "normalized": "hafnaollumvafrakokum",
    "category": 2
  },
  {
    "normalized": "vafrakokustillingar",
    "category": 3
  },
  {
    "normalized": "afþakkaallar",
    "category": 2
  },
  {
    "normalized": "nauðsynlegar",
    "category": 0
  },
  {
    "normalized": "yfirlysingumvefkokur",
    "category": 8
  },
  {
    "normalized": "gdpr",
    "category": 0
  },
  {
    "normalized": "skoðananar",
    "category": 8
  },
  {
    "normalized": "181partners",
    "category": 0
  },
  {
    "normalized": "viewour754partners",
    "category": 0
  },
  {
    "normalized": "cookiessettingsallowall",
    "category": 8
  },
  {
    "normalized": "viewpartners",
    "category": 0
  },
  {
    "normalized": "directory",
    "category": 0
  },
  {
    "normalized": "leyfa",
    "category": 1
  },
  {
    "normalized": "veljavefkokur",
    "category": 3
  },
  {
    "normalized": "egsamþykki",
    "category": 1
  },
  {
    "normalized": "notendaskilmalar",
    "category": 0
  },
  {
    "normalized": "requiredcookiesonly",
    "category": 2
  },
  {
    "normalized": "showallpartners847→",
    "category": 0
  },
  {
    "normalized": "whatslpg",
    "category": 0
  },
  {
    "normalized": "prices",
    "category": 0
  },
  {
    "normalized": "findourgarages",
    "category": 0
  },
  {
    "normalized": "finetunesettings",
    "category": 3
  },
  {
    "normalized": "leyfaallarvafrakokur",
    "category": 1
  },
  {
    "normalized": "islenska",
    "category": 0
  },
  {
    "normalized": "sjananarumkokustefnu",
    "category": 0
  },
  {
    "normalized": "leyfaaðeinsnauðsynlegar",
    "category": 2
  },
  {
    "normalized": "hafnavalkvæðu",
    "category": 2
  },
  {
    "normalized": "stafrænarlausnir",
    "category": 0
  },
  {
    "normalized": "þekking",
    "category": 0
  },
  {
    "normalized": "stefnurogskilmalar",
    "category": 0
  },
  {
    "normalized": "aðlagakokur",
    "category": 3
  },
  {
    "normalized": "oryggislausnir",
    "category": 0
  },
  {
    "normalized": "raðgjof",
    "category": 0
  },
  {
    "normalized": "rekstrarlausnir",
    "category": 0
  },
  {
    "normalized": "vinnslapersonuupplysinga",
    "category": 0
  },
  {
    "normalized": "acceptessentialonly",
    "category": 2
  },
  {
    "normalized": "freestandarddeliveryreturnsdetails",
    "category": 0
  },
  {
    "normalized": "ourwork",
    "category": 0
  },
  {
    "normalized": "librarycollections",
    "category": 0
  },
  {
    "normalized": "publishinghouse",
    "category": 0
  },
  {
    "normalized": "useessentialcookiesonly",
    "category": 2
  },
  {
    "normalized": "paytoreject",
    "category": 5
  },
  {
    "normalized": "downloadourfreeebook",
    "category": 0
  },
  {
    "normalized": "preferencecenter",
    "category": 3
  },
  {
    "normalized": "personalisedadvertisingadvertisingmeasurementaudienceresearchandservicesdevelopment",
    "category": 0
  },
  {
    "normalized": "selectionofpersonalisedcontentandcontentmeasurement",
    "category": 0
  },
  {
    "normalized": "paytorejectfaqs",
    "category": 5
  },
  {
    "normalized": "readprivacypolicy",
    "category": 0
  },
  {
    "normalized": "readtermsconditions",
    "category": 0
  },
  {
    "normalized": "jegaksepterer",
    "category": 1
  },
  {
    "normalized": "rozumiemzamknijtookno",
    "category": 1
  },
  {
    "normalized": "tak",
    "category": 1
  },
  {
    "normalized": "właczwszystkie",
    "category": 1
  },
  {
    "normalized": "permitirtudo",
    "category": 1
  },
  {
    "normalized": "amcititsiaccept",
    "category": 1
  },
  {
    "normalized": "acceptasicontinua",
    "category": 1
  },
  {
    "normalized": "confirmtoate",
    "category": 1
  },
  {
    "normalized": "daaccept",
    "category": 1
  },
  {
    "normalized": "zaprisestrinjam",
    "category": 1
  },
  {
    "normalized": "dovolivse",
    "category": 1
  },
  {
    "normalized": "soglasan",
    "category": 1
  },
  {
    "normalized": "dovolim",
    "category": 1
  },
  {
    "normalized": "sestrinjam",
    "category": 1
  },
  {
    "normalized": "zapriobvestilo",
    "category": 1
  },
  {
    "normalized": "shrani",
    "category": 1
  },
  {
    "normalized": "sprejmiinnadalju",
    "category": 1
  },
  {
    "normalized": "sprejmivse",
    "category": 1
  },
  {
    "normalized": "sestrinjamzvsem",
    "category": 1
  },
  {
    "normalized": "dovolivsepiskotke",
    "category": 1
  },
  {
    "normalized": "sprejmipiskotke",
    "category": 1
  },
  {
    "normalized": "dovolipiskotke",
    "category": 1
  },
  {
    "normalized": "strinjamse",
    "category": 1
  },
  {
    "normalized": "sprejmiinzapri",
    "category": 1
  },
  {
    "normalized": "sprejmem",
    "category": 1
  },
  {
    "normalized": "dovolivseinzapri",
    "category": 1
  },
  {
    "normalized": "habilitartodoycerrar",
    "category": 1
  },
  {
    "normalized": "meparecebien",
    "category": 1
  },
  {
    "normalized": "todaslascookies",
    "category": 1
  },
  {
    "normalized": "jajagsamtucker",
    "category": 1
  },
  {
    "normalized": "godkannstang",
    "category": 1
  },
  {
    "normalized": "okdavetjag",
    "category": 1
  },
  {
    "normalized": "ichakzeptierealle",
    "category": 1
  },
  {
    "normalized": "okmachtdasgerne",
    "category": 1
  },
  {
    "normalized": "okjacceptetouslescookies",
    "category": 1
  },
  {
    "normalized": "разбериипремининататък",
    "category": 1
  },
  {
    "normalized": "разбирамиприемам",
    "category": 1
  },
  {
    "normalized": "позволетевсичко",
    "category": 1
  },
  {
    "normalized": "приемиипродължи",
    "category": 1
  },
  {
    "normalized": "shvacam",
    "category": 1
  },
  {
    "normalized": "souhlasimaprijimam",
    "category": 1
  },
  {
    "normalized": "souhlasimaccept",
    "category": 1
  },
  {
    "normalized": "prijmoutvseazavrit",
    "category": 1
  },
  {
    "normalized": "tamaasaakuerikkit",
    "category": 1
  },
  {
    "normalized": "okfortsæt",
    "category": 1
  },
  {
    "normalized": "cameva",
    "category": 1
  },
  {
    "normalized": "dasistok",
    "category": 1
  },
  {
    "normalized": "alleeinsetzen",
    "category": 1
  },
  {
    "normalized": "ichstimmeallencookieszu",
    "category": 1
  },
  {
    "normalized": "ναισταcookies",
    "category": 1
  },
  {
    "normalized": "iacceptthesuggestedcookiesettings",
    "category": 1
  },
  {
    "normalized": "engedelyezem",
    "category": 1
  },
  {
    "normalized": "alltilagi",
    "category": 1
  },
  {
    "normalized": "accettatuttiicookieechiudi",
    "category": 1
  },
  {
    "normalized": "chiudiavviso",
    "category": 1
  },
  {
    "normalized": "apstiprinuvisassikdatnes",
    "category": 1
  },
  {
    "normalized": "pikristiaizvert",
    "category": 1
  },
  {
    "normalized": "taip",
    "category": 1
  },
  {
    "normalized": "allakzepteieren",
    "category": 1
  },
  {
    "normalized": "okjaicompris",
    "category": 1
  },
  {
    "normalized": "autoriserlescookies",
    "category": 1
  },
  {
    "normalized": "alleenfunctioneel",
    "category": 2
  },
  {
    "normalized": "wijsallesaf",
    "category": 2
  },
  {
    "normalized": "accepteernoodzakelijkecookies",
    "category": 2
  },
  {
    "normalized": "benekte",
    "category": 2
  },
  {
    "normalized": "potwierdzamwymagane",
    "category": 2
  },
  {
    "normalized": "zezwoltylkonaniezbedne",
    "category": 2
  },
  {
    "normalized": "zaakceptujtylkoniezbedne",
    "category": 2
  },
  {
    "normalized": "zaakceptujwymagane",
    "category": 2
  },
  {
    "normalized": "utilizarapenasoscookiesnecessarios",
    "category": 2
  },
  {
    "normalized": "aceitarapenasonecessario",
    "category": 2
  },
  {
    "normalized": "confirmcaestenecesar",
    "category": 2
  },
  {
    "normalized": "acceptanecesare",
    "category": 2
  },
  {
    "normalized": "prijatpozadovane",
    "category": 2
  },
  {
    "normalized": "zapri",
    "category": 1
  },
  {
    "normalized": "nehvala",
    "category": 2
  },
  {
    "normalized": "zavrni",
    "category": 2
  },
  {
    "normalized": "uporabilezahtevanepiskotke",
    "category": 2
  },
  {
    "normalized": "sprejmiizbrano",
    "category": 2
  },
  {
    "normalized": "nedovolimpiskotkov",
    "category": 2
  },
  {
    "normalized": "nesprejmem",
    "category": 2
  },
  {
    "normalized": "nolasquiero",
    "category": 2
  },
  {
    "normalized": "solofuncionales",
    "category": 2
  },
  {
    "normalized": "jagavbojer",
    "category": 2
  },
  {
    "normalized": "bittenuressenziellenutzen",
    "category": 2
  },
  {
    "normalized": "blockieren",
    "category": 2
  },
  {
    "normalized": "ikweiger",
    "category": 2
  },
  {
    "normalized": "ouiacceptertout",
    "category": 1
  },
  {
    "normalized": "отхвърли",
    "category": 2
  },
  {
    "normalized": "откажетевсички",
    "category": 2
  },
  {
    "normalized": "onlyessentialcookies",
    "category": 2
  },
  {
    "normalized": "samonuzno",
    "category": 2
  },
  {
    "normalized": "nepovolovatcookies",
    "category": 2
  },
  {
    "normalized": "povolitpovinne",
    "category": 2
  },
  {
    "normalized": "povolitjennutne",
    "category": 2
  },
  {
    "normalized": "vseblokovat",
    "category": 2
  },
  {
    "normalized": "lubanainultvajalikud",
    "category": 2
  },
  {
    "normalized": "estakavijaanalytiikka",
    "category": 2
  },
  {
    "normalized": "eikiitos",
    "category": 2
  },
  {
    "normalized": "interdiretout",
    "category": 2
  },
  {
    "normalized": "szuksegesekelfogadasa",
    "category": 2
  },
  {
    "normalized": "szuksegszeruekengedelyezese",
    "category": 2
  },
  {
    "normalized": "nemengedelyezem",
    "category": 2
  },
  {
    "normalized": "einungisnauðsynlegar",
    "category": 2
  },
  {
    "normalized": "nepiekrituvisam",
    "category": 2
  },
  {
    "normalized": "refuseieren",
    "category": 2
  },
  {
    "normalized": "stelvoorkeurin",
    "category": 3
  },
  {
    "normalized": "innstillingerforcookies",
    "category": 3
  },
  {
    "normalized": "justerinnstillingene",
    "category": 3
  },
  {
    "normalized": "administreralternativer",
    "category": 3
  },
  {
    "normalized": "konfiguracjazgod",
    "category": 3
  },
  {
    "normalized": "opcoesdosite",
    "category": 3
  },
  {
    "normalized": "configuratiaautorizatiilor",
    "category": 3
  },
  {
    "normalized": "gestionarecookieuri",
    "category": 3
  },
  {
    "normalized": "vreausaschimbsetarile",
    "category": 3
  },
  {
    "normalized": "zmenitmojenastavenia",
    "category": 3
  },
  {
    "normalized": "nastavitvepiskotkov",
    "category": 3
  },
  {
    "normalized": "pilagoditi",
    "category": 3
  },
  {
    "normalized": "prikaznastavitev",
    "category": 3
  },
  {
    "normalized": "upravljanjenastavitev",
    "category": 3
  },
  {
    "normalized": "pokazipodrobnosti",
    "category": 3
  },
  {
    "normalized": "configurarseleccion",
    "category": 3
  },
  {
    "normalized": "centrodepreferenciasdeprivacidad",
    "category": 3
  },
  {
    "normalized": "modifyconfiguration",
    "category": 3
  },
  {
    "normalized": "modificarconfiguracion",
    "category": 3
  },
  {
    "normalized": "nejjagvillanpassakakor",
    "category": 3
  },
  {
    "normalized": "andraminainstallningar",
    "category": 3
  },
  {
    "normalized": "customiseyourpreferences",
    "category": 3
  },
  {
    "normalized": "individuelledatenschutzpraferenzen",
    "category": 3
  },
  {
    "normalized": "meerinformatieeninstellingen",
    "category": 3
  },
  {
    "normalized": "jechangemespreferences",
    "category": 3
  },
  {
    "normalized": "подробнинастроики",
    "category": 3
  },
  {
    "normalized": "управляваипредпочитанията",
    "category": 3
  },
  {
    "normalized": "upravljajmojimpostavkama",
    "category": 3
  },
  {
    "normalized": "promjenimojepostavke",
    "category": 3
  },
  {
    "normalized": "zelimpromijenitinastavak",
    "category": 3
  },
  {
    "normalized": "vybertenastaveni",
    "category": 3
  },
  {
    "normalized": "personalizovat",
    "category": 3
  },
  {
    "normalized": "chciupravit",
    "category": 3
  },
  {
    "normalized": "tamaasaitigartikkit",
    "category": 3
  },
  {
    "normalized": "sepræferencer",
    "category": 3
  },
  {
    "normalized": "vaataseadeid",
    "category": 3
  },
  {
    "normalized": "naytaasetukset",
    "category": 3
  },
  {
    "normalized": "lisatiedot",
    "category": 3
  },
  {
    "normalized": "valitseevasteet",
    "category": 3
  },
  {
    "normalized": "mukauta",
    "category": 3
  },
  {
    "normalized": "omienasetustenyllapito",
    "category": 3
  },
  {
    "normalized": "parametresdetaillesdescookies",
    "category": 3
  },
  {
    "normalized": "laissezmoichoisir",
    "category": 3
  },
  {
    "normalized": "afficherlesparametresdescookies",
    "category": 3
  },
  {
    "normalized": "praferenzenbearbeiten",
    "category": 3
  },
  {
    "normalized": "kivalasztommitengedelyezek",
    "category": 3
  },
  {
    "normalized": "beallitasokmegtekintese",
    "category": 3
  },
  {
    "normalized": "sersniða",
    "category": 3
  },
  {
    "normalized": "gestisciopzioni",
    "category": 3
  },
  {
    "normalized": "configurazionedeicookie",
    "category": 3
  },
  {
    "normalized": "impostazionipersonalizzate",
    "category": 3
  },
  {
    "normalized": "anstellungen",
    "category": 3
  },
  {
    "normalized": "afficherpreferences",
    "category": 3
  },
  {
    "normalized": "potwierdzamwybor",
    "category": 4
  },
  {
    "normalized": "potwierdzamwybrane",
    "category": 4
  },
  {
    "normalized": "aceitarselecionados",
    "category": 4
  },
  {
    "normalized": "akceptovatvybranecookies",
    "category": 4
  },
  {
    "normalized": "godkannvalda",
    "category": 4
  },
  {
    "normalized": "einwilligungspeichern",
    "category": 4
  },
  {
    "normalized": "ausgewahlteakzeptieren",
    "category": 4
  },
  {
    "normalized": "nurauswahlakzeptieren",
    "category": 4
  },
  {
    "normalized": "ulozitmojevolby",
    "category": 4
  },
  {
    "normalized": "kinnitavalikud",
    "category": 4
  },
  {
    "normalized": "acceptcurrentselection",
    "category": 4
  },
  {
    "normalized": "vorhandeneauswahlspeichern",
    "category": 4
  },
  {
    "normalized": "subscribetofreechoice",
    "category": 5
  },
  {
    "normalized": "noustukupsisetega",
    "category": 1
  },
  {
    "normalized": "præferencer",
    "category": 3
  }
];