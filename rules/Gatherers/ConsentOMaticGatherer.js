/**
 * ConsentOMaticGatherer {
 *
 * Copyright (c) 2023 Rolf Bagge,
 * Copyright (c) 2024, 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label Consent-O-Matic Gatherer
 * @description Detects popups using a legacy version of Consent-O-Matic (avoid combining with others)
 */
/* exported from gatherer id 14 rev 6 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
export default class ConsentOMaticGatherer extends Gatherer {
    constructor() {
        super();
    }

    runCoM(){
        return new Promise((resolve, reject)=>{
let ruleConfig = {
  "Asus": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookie-policy-info"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookie-policy-info",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "#cookie-policy-info"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "ifallowall",
          "trueAction": {
            "type": "click",
            "target": {
              "selector": "#cookie-policy-info .cookie-btn-box .btn-ok"
            }
          },
          "falseAction": {
            "type": "click",
            "target": {
              "selector": "#cookie-policy-info .cookie-btn-box .btn-setting"
            }
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "airbnb": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[data-testid='main-cookies-banner-container']"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[data-testid='main-cookies-banner-container']",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "[data-testid='modal-container']"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "._1i0vjctk"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "button.f3dg75g"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": "[aria-labelledby='measure-cookies-section-toggle-all'][aria-checked='true']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "[aria-labelledby='measure-cookies-section-toggle-all']"
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": "[aria-labelledby='features-cookies-section-toggle-all'][aria-checked='true']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "[aria-labelledby='features-cookies-section-toggle-all']"
                    }
                  },
                  "type": "A"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": "[aria-labelledby='advertising-cookies-section-toggle-all'][aria-checked='true']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "[aria-labelledby='advertising-cookies-section-toggle-all']"
                    }
                  },
                  "type": "F"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[data-testid='save-btn']"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "admiral": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".a__sc-np32r2-0"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".a__sc-np32r2-0",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": ".a__sc-np32r2-0"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".Button__StyledButton-a1qza5-0",
            "textFilter": [
              "Purposes"
            ]
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "selector": ".Frame-sc-1d4hofp-0.dFwApY"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".a__sc-cqhbjh-2.jtxseY.a__sc-tonkui-1.ddTxVh",
                      "textFilter": [
                        "Store and/or access information on a device"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Consent"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Consent"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "type": "D"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Legitimate Interest"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Legitimate Interest"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".a__sc-cqhbjh-2.jtxseY.a__sc-tonkui-1.ddTxVh",
                      "textFilter": [
                        "Select basic ads",
                        "Create a personalised ads profile",
                        "Select personalised ads",
                        "Measure ad performance"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Consent"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Consent"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "type": "F"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Legitimate Interest"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Legitimate Interest"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".a__sc-cqhbjh-2.jtxseY.a__sc-tonkui-1.ddTxVh",
                      "textFilter": [
                        "Create a personalised content profile",
                        "Select personalised content",
                        "Measure content performance"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Consent"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Consent"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "type": "E"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Legitimate Interest"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Legitimate Interest"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".a__sc-cqhbjh-2.jtxseY.a__sc-tonkui-1.ddTxVh",
                      "textFilter": [
                        "Apply market research to generate audience insights",
                        "Develop and improve products"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Consent"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Consent"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "type": "B"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Legitimate Interest"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            },
                            "parent": {
                              "childFilter": {
                                "target": {
                                  "selector": ".Text-azid7f-0.a__sc-tonkui-2.hfJItt",
                                  "textFilter": [
                                    "Legitimate Interest"
                                  ]
                                }
                              },
                              "selector": ".Toggle__Label-sc-1gq6yqj-0.elgZCt"
                            }
                          },
                          "type": "B"
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "selector": ".Frame-sc-1d4hofp-0.cLZaYT"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".a__sc-cqhbjh-2.jtxseY",
                      "textFilter": [
                        "Use precise geolocation data",
                        "Actively scan device characteristics for identification"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".Button__StyledButton-a1qza5-0",
            "textFilter": [
              "Save & exit"
            ]
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "Autodesk": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "target": {
              "selector": "#adsk-eprivacy-body"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "target": {
              "displayFilter": true,
              "selector": "#adsk-eprivacy-body"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "target": {
            "selector": "#adsk-eprivacy-body"
          },
          "type": "hide"
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "target": {
            "selector": "#adsk-eprivacy-privacy-details"
          },
          "type": "click"
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "action": {
            "actions": [
              {
                "target": {
                  "selector": "h4",
                  "textFilter": [
                    "Online experience"
                  ]
                },
                "trueAction": {
                  "consents": [
                    {
                      "falseAction": {
                        "target": {
                          "selector": "input[data-category-selector='no']"
                        },
                        "type": "click"
                      },
                      "trueAction": {
                        "target": {
                          "selector": "input[data-category-selector='yes']"
                        },
                        "type": "click"
                      },
                      "type": "E"
                    }
                  ],
                  "type": "consent"
                },
                "type": "ifcss"
              },
              {
                "target": {
                  "selector": "h4",
                  "textFilter": [
                    "Communication"
                  ]
                },
                "trueAction": {
                  "consents": [
                    {
                      "falseAction": {
                        "target": {
                          "selector": "input[data-category-selector='no']"
                        },
                        "type": "click"
                      },
                      "trueAction": {
                        "target": {
                          "selector": "input[data-category-selector='yes']"
                        },
                        "type": "click"
                      },
                      "type": "F"
                    }
                  ],
                  "type": "consent"
                },
                "type": "ifcss"
              },
              {
                "target": {
                  "selector": "h4",
                  "textFilter": [
                    "Customer feedback"
                  ]
                },
                "trueAction": {
                  "consents": [
                    {
                      "falseAction": {
                        "target": {
                          "selector": "input[data-category-selector='no']"
                        },
                        "type": "click"
                      },
                      "trueAction": {
                        "target": {
                          "selector": "input[data-category-selector='yes']"
                        },
                        "type": "click"
                      },
                      "type": "X"
                    }
                  ],
                  "type": "consent"
                },
                "type": "ifcss"
              },
              {
                "target": {
                  "selector": "h4",
                  "textFilter": [
                    "Digital advertising"
                  ]
                },
                "trueAction": {
                  "consents": [
                    {
                      "falseAction": {
                        "target": {
                          "selector": "input[data-category-selector='no']"
                        },
                        "type": "click"
                      },
                      "trueAction": {
                        "target": {
                          "selector": "input[data-category-selector='yes']"
                        },
                        "type": "click"
                      },
                      "type": "F"
                    }
                  ],
                  "type": "consent"
                },
                "type": "ifcss"
              },
              {
                "target": {
                  "selector": "h4",
                  "textFilter": [
                    "Troubleshooting"
                  ]
                },
                "trueAction": {
                  "consents": [
                    {
                      "falseAction": {
                        "target": {
                          "selector": "input[data-category-selector='no']"
                        },
                        "type": "click"
                      },
                      "trueAction": {
                        "target": {
                          "selector": "input[data-category-selector='yes']"
                        },
                        "type": "click"
                      },
                      "type": "X"
                    }
                  ],
                  "type": "consent"
                },
                "type": "ifcss"
              }
            ],
            "type": "list"
          },
          "target": {
            "selector": "#adsk-eprivacy-form .adsk-eprivacy-category-container"
          },
          "type": "foreach"
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "target": {
            "selector": "#adsk-eprivacy-continue-btn"
          },
          "type": "click"
        },
        "name": "SAVE_CONSENT"
      }
    ]
  },
  "almacmpv2": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#alma-cmpv2-container"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".almacmp-background-overlay",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": ".almacmp-background-overlay"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#almacmp-modalSettingBtn"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "selector": ".almacmp-box"
              },
              "parent": {
                "selector": "#almacmp-tab-content-purposes"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "span",
                      "textFilter": [
                        "Tavallisten mainosten valinta",
                        "Personoidun mainosprofiilin muodostaminen",
                        "Personoitujen mainosten valinta",
                        "Mainonnan ja sen tehokkuuden mittaaminen",
                        "Markkinatutkimusten soveltaminen käyttäjäymmärryksen luomiseksi"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[id^='purposeConsents'], [id*='specialFeatureConsents']"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "[id^='purposeConsents'], [id*='specialFeatureConsents']"
                            }
                          },
                          "type": "F"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[id*=LegitimateInterests]"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "[id*=LegitimateInterests]"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "span",
                      "textFilter": [
                        "Tietojen tallennus laitteelle ja/tai laitteella olevien tietojen käyttö",
                        "Tarkkojen sijaintitietojen käyttö",
                        "Laitteen ominaisuuksien aktiivinen skannaus tunnistamista varten"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[id^='purposeConsents'], [id*='specialFeatureConsents']"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "[id^='purposeConsents'], [id*='specialFeatureConsents']"
                            }
                          },
                          "type": "D"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[id*=LegitimateInterests]"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "[id*=LegitimateInterests]"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "span",
                      "textFilter": [
                        "Personoidun sisältöprofiilin muodostaminen",
                        "Personoidun sisällön valinta",
                        "Sisällön ja sen tehokkuuden mittaaminen"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[id^='purposeConsents'], [id*='specialFeatureConsents']"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "[id^='purposeConsents'], [id*='specialFeatureConsents']"
                            }
                          },
                          "type": "E"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[id*=LegitimateInterests]"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "[id*=LegitimateInterests]"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "span",
                      "textFilter": [
                        "Tuotekehitys",
                        "Alma Median kohderyhmien jakaminen"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[id*='urposeConsents'], [id*='specialFeatureConsents']"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "[id*='urposeConsents'], [id*='specialFeatureConsents']"
                            }
                          },
                          "type": "X"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[id*=LegitimateInterests]"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "[id*=LegitimateInterests]"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[id^='almacmp-save']"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "affinity": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".c-cookie-banner"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".c-cookie-banner"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".c-modal__content"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".c-modal"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".c-modal__with-footer"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".c-cookie-banner"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[data-qa='manage-cookies']"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "consent",
          "consents": [
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#cookies-analytics"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#cookies-analytics"
                }
              },
              "type": "B"
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "ifcss",
          "target": {
            "selector": "button",
            "textFilter": [
              "Save preference"
            ]
          },
          "trueAction": {
            "type": "click",
            "target": {
              "selector": "button",
              "textFilter": [
                "Save preference"
              ]
            }
          },
          "falseAction": {
            "type": "click",
            "target": {
              "selector": ".c-modal__action button"
            }
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "azofreeware.com": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookieChoiceInfo"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookieChoiceInfo"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#cookieChoiceDismiss"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "bauhaus.cz": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".modal .modal-container.bg-cl-primary"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".modal .modal-container.bg-cl-primary",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".modal"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".overlay.fixed.w-100"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".button-outline"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#perfAgreement"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#perfAgreement"
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#funAgreement"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#funAgreement"
                    }
                  },
                  "type": "A"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#markAgreement"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#markAgreement"
                    }
                  },
                  "type": "F"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".button-outline"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "bbc_fc": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".fc-consent-root .fc-dialog-container .fc-dialog-restricted-content"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".fc-consent-root .fc-dialog-container .fc-dialog-restricted-content"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".fc-consent-root"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".bbccookies-banner"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".fc-consent-root .fc-dialog-container .fc-cta-manage-options"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "selector": ".fc-preference-container"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": "input.fc-preference-consent"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": "input.fc-preference-consent"
                          }
                        },
                        "type": "X"
                      },
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": "input.fc-preference-legitimate-interest"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": "input.fc-preference-legitimate-interest"
                          }
                        },
                        "type": "X"
                      }
                    ]
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".fc-preference-title",
                      "textFilter": [
                        "Store and/or access information on a device"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "type": "D"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".fc-preference-title",
                      "textFilter": [
                        "Select basic ads"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "type": "F"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".fc-preference-title",
                      "textFilter": [
                        "Create a personalised ads profile"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "type": "F"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".fc-preference-title",
                      "textFilter": [
                        "Select personalised ads"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "type": "F"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".fc-preference-title",
                      "textFilter": [
                        "Create a personalised content profile"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "type": "E"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".fc-preference-title",
                      "textFilter": [
                        "Select personalised content"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "type": "E"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".fc-preference-title",
                      "textFilter": [
                        "Measure ad performance"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "type": "F"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".fc-preference-title",
                      "textFilter": [
                        "Measure content performance"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "type": "E"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".fc-preference-title",
                      "textFilter": [
                        "Use precise geolocation data"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-legitimate-interest"
                            }
                          },
                          "type": "D"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.fc-preference-consent"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".fc-consent-root .fc-confirm-choices"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "bankofscotland": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#lbganalyticsCookies"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#lbganalyticsCookies",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "#lbganalyticsCookies"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#more_information"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": ".granular"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "ifcss",
                "target": {
                  "selector": "strong",
                  "textFilter": [
                    "Performance"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "css",
                        "target": {
                          "selector": "[title*='cookies will be permitted when you save your settings']"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "button"
                        }
                      },
                      "type": "B"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "strong",
                  "textFilter": [
                    "Marketing"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "css",
                        "target": {
                          "selector": "[title*='cookies will be permitted when you save your settings']"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "button"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#tealium_confirm_desktop"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "bing": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#bnp_cookie_banner"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#bnp_cookie_banner",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#bnp_cookie_banner"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#mcp_container"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#bnp_btn_preference"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": ".mcp_row"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "#analytics_checkbox"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "#analytics_checkbox"
                      }
                    },
                    "type": "B"
                  }
                ]
              },
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "#sm_checkbox"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "#sm_checkbox"
                      }
                    },
                    "type": "E"
                  }
                ]
              },
              {
                "type": "wait",
                "waitTime": 2500
              },
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "#ad_checkbox"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "#ad_checkbox"
                      }
                    },
                    "type": "F"
                  }
                ]
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "BorlabsCookieBox": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#BorlabsCookieBox"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".show-cookie-box"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "#BorlabsCookieBox>.show-cookie-box"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".cookie-box ._brlbs-manage-btn>a"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "consent",
          "consents": [
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#borlabs-cookie-group-statistics"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#borlabs-cookie-group-statistics"
                }
              },
              "type": "B"
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#borlabs-cookie-group-marketing"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#borlabs-cookie-group-marketing"
                }
              },
              "type": "F"
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#borlabs-cookie-group-external-media"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#borlabs-cookie-group-external-media"
                }
              },
              "type": "E"
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#CookiePrefSave"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "britishairways": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#ensNotifyBanner[aria-label='Consent Banner']"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#overlay[style='display: block;']",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#overlay"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#ensNotifyBanner"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#ensModalWrapper"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "waitcss",
              "target": {
                "selector": "#customise",
                "displayFilter": true
              },
              "retries": 10,
              "waitTime": 250
            },
            {
              "type": "multiclick",
              "target": {
                "selector": "#customise"
              }
            }
          ]
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#AnalyticsSlide"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#AnalyticsSlide"
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#MarketingSlide"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#MarketingSlide"
                    }
                  },
                  "type": "F"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#FunctionalSlide"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#FunctionalSlide"
                    }
                  },
                  "type": "A"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#ensSaveText"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "bol": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "wsp-consent-modal-ofc"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "wsp-consent-modal-ofc",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "wsp-modal-window"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".modal__overlay"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#js-select-button"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": ".consent-modal-ofc__consent-toggle-container"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "#js-internal-transactional-consent, #js-external-transactional-consent"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "#js-internal-transactional-consent, #js-external-transactional-consent"
                      }
                    },
                    "type": "E"
                  }
                ]
              },
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "#js-internal-behavioural-consent, #js-external-behavioural-consent"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "#js-internal-behavioural-consent, #js-external-behavioural-consent"
                      }
                    },
                    "type": "F"
                  }
                ]
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#js-accept-selected-button"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "cassie": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".syrenis-cookie-widget"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cassie-cookie-module",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": ".cassie-cookie-module"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".cassie-view-all"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "selector": ".cassie-cookie-modal--group"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".cassie-cookie-group--heading",
                      "textFilter": [
                        "Performance and Functionality Cookies"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": "[aria-checked=true].cassie-cookie-group--toggle-switch"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".cassie-toggle-switch"
                            }
                          },
                          "type": "B"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".cassie-cookie-group--heading",
                      "textFilter": [
                        "Targeting Cookies for ITV Promotions"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": "[aria-checked=true].cassie-cookie-group--toggle-switch"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".cassie-toggle-switch"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".cassie-cookie-group--heading",
                      "textFilter": [
                        "Third Party Cookies"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": "[aria-checked=true].cassie-cookie-group--toggle-switch"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".cassie-toggle-switch"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".cassie-cookie-group--heading",
                      "textFilter": [
                        "Tracking Cookies"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": "[aria-checked=true].cassie-cookie-group--toggle-switch"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".cassie-toggle-switch"
                            }
                          },
                          "type": "B"
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#cassie_save_preferences"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "chandago": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "parent": null,
            "target": {
              "selector": "#ac-Banner"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "parent": null,
            "target": {
              "displayFilter": true,
              "selector": "#ac-Banner._acc_visible"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "parent": null,
          "target": {
            "selector": "#ac-Banner button._acc_configure",
            "textFilter": "Configurer"
          },
          "type": "click"
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "actions": [
            {
              "retries": 50,
              "target": {
                "selector": "#ac_notice._acc_visible"
              },
              "type": "waitcss",
              "waitTime": 10
            },
            {
              "consents": [
                {
                  "description": "Information storage and access",
                  "falseAction": {
                    "target": {
                      "selector": "._acc_box[data-usage='1'] .i-ko"
                    },
                    "type": "click"
                  },
                  "trueAction": {
                    "target": {
                      "selector": "._acc_box[data-usage='1'] .i-ok"
                    },
                    "type": "click"
                  },
                  "type": "D"
                },
                {
                  "description": "Preferences and Functionality",
                  "falseAction": {
                    "target": {
                      "selector": "._acc_box[data-usage='2'] .i-ko"
                    },
                    "type": "click"
                  },
                  "trueAction": {
                    "target": {
                      "selector": "._acc_box[data-usage='2'] .i-ok"
                    },
                    "type": "click"
                  },
                  "type": "A"
                },
                {
                  "description": "Ad selection, delivery, reporting",
                  "falseAction": {
                    "target": {
                      "selector": "._acc_box[data-usage='3'] .i-ko"
                    },
                    "type": "click"
                  },
                  "trueAction": {
                    "target": {
                      "selector": "._acc_box[data-usage='3'] .i-ok"
                    },
                    "type": "click"
                  },
                  "type": "B"
                },
                {
                  "description": "Content selection, delivery, reporting",
                  "falseAction": {
                    "target": {
                      "selector": "._acc_box[data-usage='4'] .i-ko"
                    },
                    "type": "click"
                  },
                  "trueAction": {
                    "target": {
                      "selector": "._acc_box[data-usage='4'] .i-ok"
                    },
                    "type": "click"
                  },
                  "type": "E"
                },
                {
                  "description": "Measurement",
                  "falseAction": {
                    "target": {
                      "selector": "._acc_box[data-usage='5'] .i-ko"
                    },
                    "type": "click"
                  },
                  "trueAction": {
                    "target": {
                      "selector": "._acc_box[data-usage='5'] .i-ok"
                    },
                    "type": "click"
                  },
                  "type": "F"
                }
              ],
              "type": "consent"
            }
          ],
          "type": "list"
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "parent": null,
          "target": {
            "selector": "._acc_next  ",
            "textFilter": "Enregistrer"
          },
          "type": "click"
        },
        "name": "SAVE_CONSENT"
      }
    ]
  },
  "chrysal.com": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#popup-cookie-settings"
            },
            "parent": {
              "selector": ".popup-content"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#popup-cookie-settings",
              "displayFilter": true
            },
            "parent": {
              "selector": ".popup-content"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": ".popup-content.info"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".button.secondary"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "ifallowall",
          "trueAction": {
            "type": "click",
            "target": {
              "selector": "#cookie_level_option_1"
            }
          },
          "falseAction": {
            "type": "click",
            "target": {
              "selector": "#cookie_level_option_2"
            }
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".button",
            "textFilter": [
              "Agree"
            ]
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "complianz": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cmplz-cookiebanner-container"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cmplz-cookiebanner"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "OPEN_OPTIONS",
        "action": {
          "type": "click",
          "target": {
            "selector": ".cmplz-view-preferences"
          }
        }
      },
      {
        "name": "DO_CONSENT",
        "action": {
          "type": "consent",
          "consents": [
            {
              "type": "B",
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#cmplz-statistics-optin"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#cmplz-statistics-optin"
                }
              }
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#cmplz-preferences-optin"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#cmplz-preferences-optin"
                }
              },
              "type": "A"
            },
            {
              "type": "F",
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#cmplz-marketing-optin"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#cmplz-marketing-optin"
                }
              }
            }
          ]
        }
      },
      {
        "name": "SAVE_CONSENT",
        "action": {
          "type": "click",
          "target": {
            "selector": ".cmplz-save-preferences"
          }
        }
      },
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": ".cmplz-cookiebanner"
          }
        },
        "name": "HIDE_CMP"
      }
    ]
  },
  "consentmanager.net": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cmpbox"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cmpbox .cmpmore"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": "#cmpbox .cmpmorelink",
                "textFilter": [
                  "Customize your choice",
                  "More Options"
                ]
              }
            }
          ]
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "selector": "#cmpbox .cmptbl tbody tr:not(.cmpvenditem)"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".cmpvendname",
                      "textFilter": [
                        "Information storage and access",
                        "Store and/or access information on a device",
                        "Use precise geolocation data",
                        "Actively scan device characteristics for identification"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": ".cmponofftext",
                              "textFilter": [
                                "on"
                              ]
                            },
                            "parent": {
                              "selector": ".cmptdchoice"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".cmpimgyesno, .cmptogglespan"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".cmpvendname",
                      "textFilter": [
                        "Personalisation",
                        "Select basic ads",
                        "Create a personalised ads profile",
                        "Select personalised ads",
                        "Measure ad performance",
                        "Apply market research to generate audience insights"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": ".cmponofftext",
                              "textFilter": [
                                "on"
                              ]
                            },
                            "parent": {
                              "selector": ".cmptdchoice"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".cmpimgyesno, .cmptogglespan"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".cmpvendname",
                      "textFilter": [
                        "Ad selection, delivery, reporting"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": ".cmponofftext",
                              "textFilter": [
                                "on"
                              ]
                            },
                            "parent": {
                              "selector": ".cmptdchoice"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".cmpimgyesno, .cmptogglespan"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".cmpvendname",
                      "textFilter": [
                        "Content selection, delivery, reporting",
                        "Create a personalised content profile",
                        "Select personalised content",
                        "Measure content performance"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": ".cmponofftext",
                              "textFilter": [
                                "on"
                              ]
                            },
                            "parent": {
                              "selector": ".cmptdchoice"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".cmpimgyesno, .cmptogglespan"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".cmpvendname",
                      "textFilter": [
                        "Measurement"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": ".cmponofftext",
                              "textFilter": [
                                "on"
                              ]
                            },
                            "parent": {
                              "selector": ".cmptdchoice"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".cmpimgyesno, .cmptogglespan"
                            }
                          },
                          "type": "B"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".cmpvendname",
                      "textFilter": [
                        "Develop and improve products"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": ".cmponofftext",
                              "textFilter": [
                                "on"
                              ]
                            },
                            "parent": {
                              "selector": ".cmptdchoice"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".cmpimgyesno, .cmptogglespan"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "selector": "#cmpbox .cmptbl tbody tr.cmpvenditem"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "css",
                      "target": {
                        "selector": ".cmponofftext",
                        "textFilter": [
                          "on"
                        ]
                      },
                      "parent": {
                        "selector": ".cmptdchoice"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": ".cmpimgyesno, .cmptogglespan"
                      }
                    },
                    "type": "X"
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": "#cmpbox .cmpboxbtn.cmpboxbtnyes"
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#cmpbox2"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#cmpbox"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "cookiebar": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookie-law-info-bar"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookie-law-info-bar",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#cookie-law-info-bar .cli_settings_button"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "selector": ".cli-tab-header",
                      "textFilter": [
                        "Functional"
                      ]
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label"
                    },
                    "parent": {
                      "selector": ".wt-cli-cookie-bar-container .cli-tab-header",
                      "textFilter": [
                        "Functional"
                      ]
                    }
                  },
                  "type": "A"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "selector": ".wt-cli-cookie-bar-container .cli-tab-header",
                      "textFilter": [
                        "Performance"
                      ]
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label"
                    },
                    "parent": {
                      "selector": ".wt-cli-cookie-bar-container .cli-tab-header",
                      "textFilter": [
                        "Performance"
                      ]
                    }
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "selector": ".wt-cli-cookie-bar-container .cli-tab-header",
                      "textFilter": [
                        "Marketing"
                      ]
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label"
                    },
                    "parent": {
                      "selector": ".wt-cli-cookie-bar-container .cli-tab-header",
                      "textFilter": [
                        "Marketing"
                      ]
                    }
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "selector": ".wt-cli-cookie-bar-container .cli-tab-header",
                      "textFilter": [
                        "Tracking"
                      ]
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label"
                    },
                    "parent": {
                      "selector": ".wt-cli-cookie-bar-container .cli-tab-header",
                      "textFilter": [
                        "Tracking"
                      ]
                    }
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "[data-target=\"functional\"]"
                        }
                      },
                      "selector": ".cli-tab-header"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "[data-target=\"functional\"]"
                        }
                      },
                      "selector": ".cli-tab-header"
                    }
                  },
                  "type": "A"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "[data-target=\"performance\"]"
                        }
                      },
                      "selector": ".cli-tab-header"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "[data-target=\"performance\"]"
                        }
                      },
                      "selector": ".cli-tab-header"
                    }
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "[data-target=\"analytics\"]"
                        }
                      },
                      "selector": ".cli-tab-header"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "[data-target=\"analytics\"]"
                        }
                      },
                      "selector": ".cli-tab-header"
                    }
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "[data-target=\"advertisement\"]"
                        }
                      },
                      "selector": ".cli-tab-header"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "[data-target=\"advertisement\"]"
                        }
                      },
                      "selector": ".cli-tab-header"
                    }
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "[data-target=\"others\"]"
                        }
                      },
                      "selector": ".cli-tab-header"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "[data-target=\"others\"]"
                        }
                      },
                      "selector": ".cli-tab-header"
                    }
                  },
                  "type": "X"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "[data-target=\"analitici\"]"
                        }
                      },
                      "selector": ".cli-tab-header"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "[data-target=\"analitici\"]"
                        }
                      },
                      "selector": ".cli-tab-header"
                    }
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "[data-id=checkbox-non-necessary]"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "[data-id=checkbox-non-necessary]"
                    }
                  },
                  "type": "E"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".cli_setting_save_button"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "cookiebot": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#CybotCookiebotDialogBodyButtonAccept, #CybotCookiebotDialogBody, #CybotCookiebotDialogBodyLevelButtonPreferences, #cb-cookieoverlay, #CybotCookiebotDialog",
              "displayFilter": true
            }
          }
        ],
        "showingMatcher": [
          null
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": "#CybotCookiebotDialogBodyButtonDetails, #CybotCookiebotDialogBodyLevelButtonCustomize",
                "displayFilter": true
              }
            },
            {
              "type": "click",
              "target": {
                "selector": ".cb-button",
                "textFilter": [
                  "Manage cookies"
                ],
                "displayFilter": true
              }
            },
            {
              "type": "click",
              "target": {
                "selector": ".js-cookie-settings",
                "displayFilter": true
              }
            }
          ]
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#CybotCookiebotDialogBodyLevelButtonPreferences"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#CybotCookiebotDialogBodyLevelButtonPreferences"
                    }
                  },
                  "type": "A"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#CybotCookiebotDialogBodyLevelButtonStatistics"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#CybotCookiebotDialogBodyLevelButtonStatistics"
                    }
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#CybotCookiebotDialogBodyLevelButtonMarketing"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#CybotCookiebotDialogBodyLevelButtonMarketing"
                    }
                  },
                  "type": "F"
                }
              ]
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": ":scope > input[id*=CybotCookiebotDialogBodyLevelButtonIABPurposeLegitimateInterest]"
                  }
                },
                "selector": "div.CybotCookiebotDialogBodyLevelButtonWrapper"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "input[id*=CybotCookiebotDialogBodyLevelButtonIABPurposeLegitimateInterest]"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "input[id*=CybotCookiebotDialogBodyLevelButtonIABPurposeLegitimateInterest]"
                      }
                    },
                    "type": "X"
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": ":scope > input[id*=CybotCookiebotDialogBodyLevelButtonIABVendorLegitimateInterest]"
                  }
                },
                "selector": "div.CybotCookiebotDialogBodyLevelButtonWrapper"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "input[id*=CybotCookiebotDialogBodyLevelButtonIABVendorLegitimateInterest]"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "input[id*=CybotCookiebotDialogBodyLevelButtonIABVendorLegitimateInterest]"
                      }
                    },
                    "type": "X"
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "ifcss",
              "target": {
                "selector": "#CybotCookiebotDialogBodyUnderlay"
              },
              "trueAction": {
                "type": "wait",
                "waitTime": 500
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".dtcookie__accept",
                "textFilter": [
                  "Select All and Continue"
                ]
              },
              "trueAction": {
                "type": "click",
                "target": {
                  "selector": ".h-dtcookie-decline",
                  "displayFilter": true
                }
              },
              "falseAction": {
                "type": "click",
                "target": {
                  "selector": ".h-dtcookie-accept",
                  "displayFilter": true
                }
              }
            },
            {
              "type": "click",
              "target": {
                "selector": "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection",
                "displayFilter": true
              }
            },
            {
              "type": "click",
              "target": {
                "selector": ".cb-button",
                "textFilter": [
                  "Save preferences"
                ],
                "displayFilter": true
              }
            },
            {
              "type": "click",
              "target": {
                "selector": ".cb-button",
                "textFilter": [
                  "Done"
                ],
                "displayFilter": true
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": "#CybotCookiebotDialogBodyLevelButtonAccept",
                "displayFilter": true
              },
              "trueAction": {
                "type": "click",
                "target": {
                  "selector": "#CybotCookiebotDialogBodyLevelButtonAccept",
                  "displayFilter": true
                }
              },
              "falseAction": {
                "type": "ifcss",
                "target": {
                  "selector": "#CybotCookiebotDialogBodyButtonAcceptSelected",
                  "displayFilter": true
                },
                "trueAction": {
                  "type": "click",
                  "target": {
                    "selector": "#CybotCookiebotDialogBodyButtonAcceptSelected"
                  }
                },
                "falseAction": {
                  "type": "click",
                  "target": {
                    "selector": "#CybotCookiebotDialogBodyButtonAccept"
                  }
                }
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".js-cookie-settings-close"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".js-cookie-settings-close"
                    }
                  },
                  {
                    "type": "close"
                  },
                  {
                    "type": "waitcss",
                    "target": {
                      "selector": ".JegFindesIkke"
                    },
                    "retries": 1,
                    "waitTime": 500
                  }
                ]
              }
            },
            {
              "type": "click",
              "target": {
                "selector": "#CybotCookiebotDialogBodyButtonDecline",
                "displayFilter": true
              }
            },
            {
              "type": "click",
              "target": {
                "selector": ".cookie-btn",
                "textFilter": [
                  "Tillad valgte"
                ],
                "displayFilter": true
              }
            },
            {
              "type": "click",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": "strong",
                    "textFilter": [
                      "Save cookie settings"
                    ]
                  }
                },
                "selector": ".cb-button",
                "displayFilter": true
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#CybotCookiebotDialogBodyUnderlay"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#CybotCookiebotDialog"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#cb-cookieoverlay"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "cookiecontrolcivic": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#ccc-notify .ccc-notify-button",
              "displayFilter": true
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#ccc-notify .ccc-notify-button",
              "displayFilter": true
            }
          }
        ]
      },
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#ccc-content"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#ccc-content",
              "displayFilter": true
            }
          }
        ]
      },
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#ccc[open]"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#ccc[open]"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": "#ccc #ccc-notify .ccc-notify-button",
                "textFilter": [
                  "Settings",
                  "Cookie Preferences"
                ]
              }
            }
          ]
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "waitcss",
              "target": {
                "selector": "#ccc-recommended-settings",
                "displayFilter": true
              },
              "retries": 10,
              "waitTime": 250
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Analytical Cookies"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Analytical Cookies"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Marketing Cookies"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Marketing Cookies"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Social Sharing Cookies"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Social Sharing Cookies"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Performance"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Performance"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Functionality (incl. social media)"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Functionality (incl. social media)"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "type": "A"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Targeting/Advertising"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Targeting/Advertising"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Google Analytics"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Google Analytics"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Third party cookies"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Third party cookies"
                          ]
                        }
                      },
                      "selector": "#ccc-optional-categories .optional-cookie"
                    }
                  },
                  "type": "X"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": ".optional-cookie button",
                "textFilter": [
                  "Configure Ad Vendors"
                ]
              }
            },
            {
              "type": "waitcss",
              "target": {
                "selector": "#iab-purposes .optional-cookie",
                "displayFilter": true
              },
              "retries": 10,
              "waitTime": 250
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Information storage and access"
                          ]
                        }
                      },
                      "selector": "#iab-purposes .optional-cookie"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Information storage and access"
                          ]
                        }
                      },
                      "selector": "#iab-purposes .optional-cookie"
                    }
                  },
                  "type": "D"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Personalisation"
                          ]
                        }
                      },
                      "selector": "#iab-purposes .optional-cookie"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Personalisation"
                          ]
                        }
                      },
                      "selector": "#iab-purposes .optional-cookie"
                    }
                  },
                  "type": "E"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Ad selection, delivery, reporting"
                          ]
                        }
                      },
                      "selector": "#iab-purposes .optional-cookie"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Ad selection, delivery, reporting"
                          ]
                        }
                      },
                      "selector": "#iab-purposes .optional-cookie"
                    }
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Content selection, delivery, reporting"
                          ]
                        }
                      },
                      "selector": "#iab-purposes .optional-cookie"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Content selection, delivery, reporting"
                          ]
                        }
                      },
                      "selector": "#iab-purposes .optional-cookie"
                    }
                  },
                  "type": "E"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Measurement"
                          ]
                        }
                      },
                      "selector": "#iab-purposes .optional-cookie"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".optional-cookie-header",
                          "textFilter": [
                            "Measurement"
                          ]
                        }
                      },
                      "selector": "#iab-purposes .optional-cookie"
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": ".iab-header-toggle"
                  }
                },
                "selector": "#cc-panel div"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".iab-header-toggle button"
                    }
                  },
                  {
                    "type": "foreach",
                    "target": {
                      "selector": ".optional-cookie"
                    },
                    "action": {
                      "type": "list",
                      "actions": [
                        {
                          "type": "ifcss",
                          "target": {
                            "selector": ".optional-cookie-header",
                            "textFilter": [
                              "Store and/or access information on a device",
                              "Use precise geolocation data",
                              "Actively scan device characteristics for identification"
                            ]
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "checkbox",
                                  "target": {
                                    "selector": "input"
                                  }
                                },
                                "toggleAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": "input"
                                  }
                                },
                                "type": "D"
                              }
                            ]
                          }
                        },
                        {
                          "type": "ifcss",
                          "target": {
                            "selector": ".optional-cookie-header",
                            "textFilter": [
                              "Select basic ads",
                              "Create a personalised ads profile",
                              "Select personalised ads",
                              "Measure ad performance"
                            ]
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "checkbox",
                                  "target": {
                                    "selector": "input"
                                  }
                                },
                                "toggleAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": "input"
                                  }
                                },
                                "type": "F"
                              }
                            ]
                          }
                        },
                        {
                          "type": "ifcss",
                          "target": {
                            "selector": ".optional-cookie-header",
                            "textFilter": [
                              "Select personalised content",
                              "Create a personalised content profile",
                              "Measure content performance"
                            ]
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "checkbox",
                                  "target": {
                                    "selector": "input"
                                  }
                                },
                                "toggleAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": "input"
                                  }
                                },
                                "type": "E"
                              }
                            ]
                          }
                        },
                        {
                          "type": "ifcss",
                          "target": {
                            "selector": ".optional-cookie-header",
                            "textFilter": [
                              "Apply market research to generate audience insights"
                            ]
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "checkbox",
                                  "target": {
                                    "selector": "input"
                                  }
                                },
                                "toggleAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": "input"
                                  }
                                },
                                "type": "B"
                              }
                            ]
                          }
                        },
                        {
                          "type": "ifcss",
                          "target": {
                            "selector": ".optional-cookie-header",
                            "textFilter": [
                              "Develop and improve products"
                            ]
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "checkbox",
                                  "target": {
                                    "selector": "input"
                                  }
                                },
                                "toggleAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": "input"
                                  }
                                },
                                "type": "X"
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#ccc-close"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "#ccc-content"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "cookieinformation": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#coiOverlay, #coiSummery, #coiConsentBanner, #coi-banner-wrapper"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#coiOverlay, #coiSummery, #coiConsentBanner, #coi-banner-wrapper",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".coi-banner__nextpage, .summary-texts__show-details"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "consent",
          "consents": [
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "input"
                },
                "parent": {
                  "selector": "#switch-cookie_cat_functional"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "label, input"
                },
                "parent": {
                  "selector": "#switch-cookie_cat_functional"
                }
              },
              "type": "A"
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "input"
                },
                "parent": {
                  "selector": "#switch-cookie_cat_statistic"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "label, input"
                },
                "parent": {
                  "selector": "#switch-cookie_cat_statistic"
                }
              },
              "type": "A"
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "input"
                },
                "parent": {
                  "selector": "#switch-cookie_cat_marketing"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "label, input"
                },
                "parent": {
                  "selector": "#switch-cookie_cat_marketing"
                }
              },
              "type": "F"
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "ifcss",
              "target": {
                "selector": "#coiConsentBanner #declineButton, #coiOverlay #declineButton",
                "displayFilter": true
              },
              "trueAction": {
                "type": "click",
                "target": {
                  "selector": "#coiConsentBanner #declineButton, #coiOverlay #declineButton"
                }
              },
              "falseAction": {
                "type": "ifcss",
                "target": {
                  "selector": "#coiConsentBanner #updateButton, #coiOverlay #updateButton",
                  "displayFilter": true
                },
                "trueAction": {
                  "type": "click",
                  "target": {
                    "selector": "#coiConsentBanner #updateButton, #coiOverlay #updateButton"
                  }
                },
                "falseAction": {
                  "type": "list",
                  "actions": [
                    {
                      "type": "click",
                      "target": {
                        "selector": "#coiOverlay button.coi-banner__accept",
                        "displayFilter": true
                      }
                    },
                    {
                      "type": "click",
                      "target": {
                        "selector": "#coiConsentBanner .bottom-bar__update-consent",
                        "displayFilter": true
                      }
                    }
                  ]
                }
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#CoiBannerOverlay"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#coiOverlay"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "cookieLab": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "target": {
              "selector": "#cookieLab"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "target": {
              "selector": "#cookieLab"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "target": {
            "selector": "#cookieLab #consentChooseCookies"
          },
          "type": "click"
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "action": {
            "actions": [
              {
                "target": {
                  "selector": ".cookieInfo",
                  "textFilter": [
                    "Statistical analysis cookies"
                  ]
                },
                "trueAction": {
                  "consents": [
                    {
                      "matcher": {
                        "target": {
                          "selector": "input"
                        },
                        "type": "checkbox"
                      },
                      "toggleAction": {
                        "target": {
                          "selector": ".cookieInfo"
                        },
                        "type": "click"
                      },
                      "trueAction": {
                        "target": {
                          "selector": ".cookieInfo"
                        },
                        "type": "click"
                      },
                      "type": "B"
                    }
                  ],
                  "type": "consent"
                },
                "type": "ifcss"
              },
              {
                "target": {
                  "selector": ".cookieInfo",
                  "textFilter": [
                    "Advertising cookies"
                  ]
                },
                "trueAction": {
                  "consents": [
                    {
                      "matcher": {
                        "target": {
                          "selector": "input"
                        },
                        "type": "checkbox"
                      },
                      "toggleAction": {
                        "target": {
                          "selector": ".cookieInfo"
                        },
                        "type": "click"
                      },
                      "trueAction": {
                        "target": {
                          "selector": ".cookieInfo"
                        },
                        "type": "click"
                      },
                      "type": "F"
                    }
                  ],
                  "type": "consent"
                },
                "type": "ifcss"
              }
            ],
            "type": "list"
          },
          "target": {
            "selector": "#cookieLab #cookieChooseCookies > label"
          },
          "type": "foreach"
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "target": {
            "selector": "#cookieLab #chooseSaveSettings"
          },
          "type": "click"
        },
        "name": "SAVE_CONSENT"
      }
    ]
  },
  "cookiescript": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookiescript_injected"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookiescript_wrapper",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "#cookiescript_wrapper"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": ".cookiescript_checkbox"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "ifcss",
                "target": {
                  "selector": "label",
                  "textFilter": "STATISTISKE"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "B"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "label",
                  "textFilter": "MARKETING"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "label",
                  "textFilter": "FUNKTIONELLE"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "A"
                    }
                  ]
                }
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#cookiescript_reject"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "deepl.com": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#dl_cookieBanner"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".dl_cookieBanner_outer",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": ".dl_cookieBanner_container"
          },
          "forceHide": true
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#cookie-checkbox-performance"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#cookie-checkbox-performance"
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#cookie-checkbox-comfort"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#cookie-checkbox-comfort"
                    }
                  },
                  "type": "A"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".dl_cookieBanner--buttonSelected"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "Dailymotion.com": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".Overlay__containerActive___2te0I [aria-label~=privacy], .TCF2ConsentPage__container___1VslO"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".Overlay__containerActive___2te0I [aria-label~=privacy], .TCF2ConsentPage__container___1VslO",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".TCF2Popup__personalize___NeAe-"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "ifcss",
              "target": {
                "selector": ".TCF2ConsentPage__container___1VslO"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "childFilter": {
                        "target": {
                          "selector": "span",
                          "textFilter": [
                            "Accept all"
                          ]
                        }
                      },
                      "selector": ".Button__button___3e-04.TCF2ConsentPage__button___1epOp"
                    }
                  },
                  {
                    "type": "foreach",
                    "target": {
                      "selector": "li div.TCF2Purpose__container___Yf5Lb"
                    },
                    "action": {
                      "type": "list",
                      "actions": [
                        {
                          "type": "ifcss",
                          "target": {
                            "selector": ".TCF2Purpose__name___1-X7e",
                            "textFilter": [
                              "Store and/or access information on a device"
                            ]
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "css",
                                  "target": {
                                    "selector": "span",
                                    "textFilter": [
                                      "On"
                                    ]
                                  },
                                  "parent": {
                                    "selector": ".Button__button___3e-04.SwitchButtons__button___14Shq"
                                  }
                                },
                                "trueAction": {
                                  "type": "click",
                                  "target": {
                                    "childFilter": {
                                      "target": {
                                        "selector": "span",
                                        "textFilter": [
                                          "On"
                                        ]
                                      }
                                    },
                                    "selector": ".Button__button___3e-04.SwitchButtons__button___14Shq"
                                  }
                                },
                                "falseAction": {
                                  "type": "click",
                                  "target": {
                                    "childFilter": {
                                      "target": {
                                        "selector": "span",
                                        "textFilter": [
                                          "Off"
                                        ]
                                      }
                                    },
                                    "selector": ".Button__button___3e-04.SwitchButtons__button___14Shq"
                                  }
                                },
                                "type": "D"
                              }
                            ]
                          }
                        },
                        {
                          "type": "ifcss",
                          "target": {
                            "selector": ".TCF2Purpose__name___1-X7e",
                            "textFilter": [
                              "Select basic ads",
                              "Create a personalised ads profile",
                              "Select personalised ads",
                              "Measure ad performance"
                            ]
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "css",
                                  "target": {
                                    "selector": "span",
                                    "textFilter": [
                                      "On"
                                    ]
                                  },
                                  "parent": {
                                    "selector": ".Button__button___3e-04.SwitchButtons__button___14Shq"
                                  }
                                },
                                "trueAction": {
                                  "type": "click",
                                  "target": {
                                    "childFilter": {
                                      "target": {
                                        "selector": "span",
                                        "textFilter": [
                                          "On"
                                        ]
                                      }
                                    },
                                    "selector": ".Button__button___3e-04.SwitchButtons__button___14Shq"
                                  }
                                },
                                "falseAction": {
                                  "type": "click",
                                  "target": {
                                    "childFilter": {
                                      "target": {
                                        "selector": "span",
                                        "textFilter": [
                                          "Off"
                                        ]
                                      }
                                    },
                                    "selector": ".Button__button___3e-04.SwitchButtons__button___14Shq"
                                  }
                                },
                                "type": "F"
                              }
                            ]
                          }
                        },
                        {
                          "type": "ifcss",
                          "target": {
                            "selector": ".TCF2Purpose__name___1-X7e",
                            "textFilter": [
                              "Create a personalised content profile",
                              "Select personalised content"
                            ]
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "css",
                                  "target": {
                                    "selector": "span",
                                    "textFilter": [
                                      "On"
                                    ]
                                  },
                                  "parent": {
                                    "selector": ".Button__button___3e-04.SwitchButtons__button___14Shq"
                                  }
                                },
                                "trueAction": {
                                  "type": "click",
                                  "target": {
                                    "childFilter": {
                                      "target": {
                                        "selector": "span",
                                        "textFilter": [
                                          "On"
                                        ]
                                      }
                                    },
                                    "selector": ".Button__button___3e-04.SwitchButtons__button___14Shq"
                                  }
                                },
                                "falseAction": {
                                  "type": "click",
                                  "target": {
                                    "childFilter": {
                                      "target": {
                                        "selector": "span",
                                        "textFilter": [
                                          "Off"
                                        ]
                                      }
                                    },
                                    "selector": ".Button__button___3e-04.SwitchButtons__button___14Shq"
                                  }
                                },
                                "type": "E"
                              }
                            ]
                          }
                        },
                        {
                          "type": "ifcss",
                          "target": {
                            "selector": ".TCF2Purpose__name___1-X7e",
                            "textFilter": [
                              "Measure content performance",
                              "Apply market research to generate audience insights",
                              "Actively scan device characteristics for identification"
                            ]
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "css",
                                  "target": {
                                    "selector": "span",
                                    "textFilter": [
                                      "On"
                                    ]
                                  },
                                  "parent": {
                                    "selector": ".Button__button___3e-04.SwitchButtons__button___14Shq"
                                  }
                                },
                                "trueAction": {
                                  "type": "click",
                                  "target": {
                                    "childFilter": {
                                      "target": {
                                        "selector": "span",
                                        "textFilter": [
                                          "On"
                                        ]
                                      }
                                    },
                                    "selector": ".Button__button___3e-04.SwitchButtons__button___14Shq"
                                  }
                                },
                                "falseAction": {
                                  "type": "click",
                                  "target": {
                                    "childFilter": {
                                      "target": {
                                        "selector": "span",
                                        "textFilter": [
                                          "Off"
                                        ]
                                      }
                                    },
                                    "selector": ".Button__button___3e-04.SwitchButtons__button___14Shq"
                                  }
                                },
                                "type": "B"
                              }
                            ]
                          }
                        },
                        {
                          "type": "ifcss",
                          "target": {
                            "selector": ".TCF2Purpose__name___1-X7e",
                            "textFilter": [
                              "Use precise geolocation data",
                              "Develop and improve products"
                            ]
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "css",
                                  "target": {
                                    "selector": "span",
                                    "textFilter": [
                                      "On"
                                    ]
                                  },
                                  "parent": {
                                    "selector": ".Button__button___3e-04.SwitchButtons__button___14Shq"
                                  }
                                },
                                "trueAction": {
                                  "type": "click",
                                  "target": {
                                    "childFilter": {
                                      "target": {
                                        "selector": "span",
                                        "textFilter": [
                                          "On"
                                        ]
                                      }
                                    },
                                    "selector": ".Button__button___3e-04.SwitchButtons__button___14Shq"
                                  }
                                },
                                "falseAction": {
                                  "type": "click",
                                  "target": {
                                    "childFilter": {
                                      "target": {
                                        "selector": "span",
                                        "textFilter": [
                                          "Off"
                                        ]
                                      }
                                    },
                                    "selector": ".Button__button___3e-04.SwitchButtons__button___14Shq"
                                  }
                                },
                                "type": "X"
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": ".TCF2ConsentPage__saveButton___56I8A"
              }
            },
            {
              "type": "close"
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "didomi.io": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#didomi-host, #didomi-notice"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "body.didomi-popup-open, .didomi-notice-banner"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".didomi-popup-notice-buttons .didomi-button:not(.didomi-button-highlight), .didomi-notice-banner .didomi-learn-more-button"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "waitcss",
              "target": {
                "selector": "#didomi-purpose-cookies"
              },
              "retries": 50,
              "waitTime": 50
            },
            {
              "type": "foreach",
              "target": {
                "selector": "#didomi-host .didomi-consent-popup-data-processing"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".didomi-components-accordion",
                      "textFilter": [
                        "Store and/or access information on a device",
                        "Actively scan device characteristics for identification",
                        "Use precise geolocation data",
                        "Authentication and authorization management",
                        "Functionality",
                        "Stocker et/ou accéder à des informations sur un terminal",
                        "Analyser activement les caractéristiques du terminal pour l’identification",
                        "Lagra och/eller få åtkomst till information på en enhet",
                        "Lagre og/eller få tilgang til informasjon på en enhet",
                        "Velg grunnleggende annonser",
                        "Velg personlige annonser",
                        "Tietojen tallennus laitteelle ja/tai laitteella olevien tietojen käyttö",
                        "Conservation et accès aux informations de géolocalisation pour réaliser des études marketing"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "trueAction": {
                            "type": "click",
                            "target": {
                              "selector": ":scope > .didomi-consent-popup-data-processing__buttons .didomi-components-radio__option:nth-child(2)"
                            }
                          },
                          "falseAction": {
                            "type": "click",
                            "target": {
                              "selector": ":scope > .didomi-consent-popup-data-processing__buttons .didomi-components-radio__option:nth-child(1)"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".didomi-components-accordion",
                      "textFilter": [
                        "Create a personalised ads profile",
                        "Apply market research to generate audience insights",
                        "Measure ad performance",
                        "Select basic ads",
                        "Select personalised ads",
                        "Storage and access to geolocation information for targeted advertising purposes",
                        "Offer personalised advertising",
                        "Publicité personnalisée",
                        "Sélectionner des publicités personnalisées",
                        "Créer un profil pour afficher un contenu personnalisé",
                        "Promotions de nos contenus, produits et services",
                        "Publicité ciblée par profilage (collecte, profilage et partage de données entre éditeurs partenaires)",
                        "Cookies för anpassad marknadsföring och innehåll",
                        "Mäta annonsprestanda",
                        "Skapa en personanpassad annonsprofil",
                        "Välja personanpassade annonser",
                        "Cookies for custom marketing and content",
                        "Opprett en personlig annonseprofil",
                        "Måle annonseprestasjon",
                        "Mainonta- ja kohdistusevästeet",
                        "Mainonnan ja sen tehokkuuden mittaaminen",
                        "Personoidun mainosprofiilin muodostaminen",
                        "Tavallisten mainosten valinta",
                        "Personoitujen mainosten valinta",
                        "Cookies Publicitaires et de personnalisation",
                        "Conservation et accès aux informations de géolocalisation à des fins de publicité ciblée"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "trueAction": {
                            "type": "click",
                            "target": {
                              "selector": ":scope > .didomi-consent-popup-data-processing__buttons .didomi-components-radio__option:nth-child(2)"
                            }
                          },
                          "falseAction": {
                            "type": "click",
                            "target": {
                              "selector": ":scope > .didomi-consent-popup-data-processing__buttons .didomi-components-radio__option:nth-child(1)"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".didomi-components-accordion",
                      "textFilter": [
                        "Create a personalised content profile",
                        "Measure content performance",
                        "Select personalised content",
                        "Optimise navigation and suggested content",
                        "Contact",
                        "Personnalisation de votre service",
                        "Sélectionner du contenu personnalisé",
                        "Sélectionner des publicités standard",
                        "Skapa en personanpassad innehållsprofil",
                        "Välja personanpassat innehåll",
                        "Opprette en personlig innholdsprofil",
                        "Velge personlig innhold",
                        "Personoidun sisältöprofiilin muodostaminen",
                        "Personoidun sisällön valinta",
                        "Mesurer la performance des publicités",
                        "Promotion et personnalisation des contenus",
                        "Personnalisation du contenu éditorial et mesure de la performance"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "trueAction": {
                            "type": "click",
                            "target": {
                              "selector": ":scope > .didomi-consent-popup-data-processing__buttons .didomi-components-radio__option:nth-child(2)"
                            }
                          },
                          "falseAction": {
                            "type": "click",
                            "target": {
                              "selector": ":scope > .didomi-consent-popup-data-processing__buttons .didomi-components-radio__option:nth-child(1)"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".didomi-components-accordion",
                      "textFilter": [
                        "Develop and improve products",
                        "Utiliser des données de géolocalisation précises",
                        "Développer et améliorer les produits",
                        "Utveckla och förbättra produkter",
                        "Utvikle og forbedre produkter",
                        "Tuotekehitys",
                        "Activation de l'affiliation"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "trueAction": {
                            "type": "click",
                            "target": {
                              "selector": ":scope > .didomi-consent-popup-data-processing__buttons .didomi-components-radio__option:nth-child(2)"
                            }
                          },
                          "falseAction": {
                            "type": "click",
                            "target": {
                              "selector": ":scope > .didomi-consent-popup-data-processing__buttons .didomi-components-radio__option:nth-child(1)"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".didomi-components-accordion",
                      "textFilter": [
                        "Audience measurement and content performance",
                        "Analytics",
                        "Usage Statistics",
                        "Live tracking of behaviours on a website for assistance and error-tracking",
                        "Mesurer l’audience",
                        "Réseaux sociaux",
                        "Exploiter des études de marché afin de générer des données d’audience",
                        "Mesurer la performance du contenu",
                        "Mesure d'audience",
                        "AB Testing",
                        "Mesure d’audience et web analyse",
                        "Cookies för analys och utveckling",
                        "Mäta innehållsprestanda",
                        "Måle innholdsprestasjon",
                        "Cookies for analysis and development",
                        "Evästeet analysointia ja kehittämistä varten",
                        "Markkinatutkimusten soveltaminen käyttäjäymmärryksen luomiseksi",
                        "Sisällön ja sen tehokkuuden mittaaminen",
                        "Cookies fonctionnels et statistiques d'usage du site"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "trueAction": {
                            "type": "click",
                            "target": {
                              "selector": ":scope > .didomi-consent-popup-data-processing__buttons .didomi-components-radio__option:nth-child(2)"
                            }
                          },
                          "falseAction": {
                            "type": "click",
                            "target": {
                              "selector": ":scope > .didomi-consent-popup-data-processing__buttons .didomi-components-radio__option:nth-child(1)"
                            }
                          },
                          "type": "B"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".didomi-components-accordion",
                      "textFilter": [
                        "Contenus vidéo et audio",
                        "Contenus cartographiques/infographiques",
                        "Personalization",
                        "Contenus cartographiques, infographiques et ludique",
                        "Ces identifiants permettent d'interagir avec les plateformes vidéos.",
                        "Activation des services interactifs proposés par des tiers"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "trueAction": {
                            "type": "click",
                            "target": {
                              "selector": ":scope > .didomi-consent-popup-data-processing__buttons .didomi-components-radio__option:nth-child(2)"
                            }
                          },
                          "falseAction": {
                            "type": "click",
                            "target": {
                              "selector": ":scope > .didomi-consent-popup-data-processing__buttons .didomi-components-radio__option:nth-child(1)"
                            }
                          },
                          "type": "A"
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              "type": "click",
              "target": {
                "selector": ".didomi-consent-popup-view-vendors-list-link"
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "trueAction": {
                    "type": "click",
                    "target": {
                      "selector": ".didomi-consent-popup-container-click-all .didomi-components-radio .didomi-components-radio__option:nth-child(2)"
                    }
                  },
                  "falseAction": {
                    "type": "click",
                    "target": {
                      "selector": ".didomi-consent-popup-container-click-all .didomi-components-radio .didomi-components-radio__option:nth-child(1)"
                    }
                  },
                  "type": "X"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": ".didomi-components-button:first-child"
              },
              "parent": {
                "selector": ".didomi-consent-popup-footer .didomi-consent-popup-actions"
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".didomi-components-button:first-child"
          },
          "parent": {
            "selector": ".didomi-consent-popup-footer .didomi-consent-popup-actions"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#didomi-popup"
              },
              "forceHide": true
            },
            {
              "type": "hide",
              "target": {
                "selector": "#didomi-consent-popup"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "DRCC": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#drcc-overlay"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#drcc-overlay",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "#drcc-overlay"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "waitcss",
          "target": {
            "selector": "div.drcc-cookie-categories"
          },
          "retries": 10,
          "waitTime": 250
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": "div.drcc-checkbox"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "ifcss",
                "target": {
                  "selector": "input[name=\"preferences\"]"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "label"
                        }
                      },
                      "type": "A"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "input[name=\"statistics\"]"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "label"
                        }
                      },
                      "type": "B"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "input[name=\"marketing\"]"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "label"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".submitChosen"
          }
        },
        "name": "SAVE_CONSENT"
      }
    ]
  },
  "Etsy.com": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#wt-portals"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#gdpr-single-choice-overlay",
              "displayFilter": true
            },
            "parent": {
              "selector": "#wt-portals"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#gdpr-single-choice-overlay"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#gdpr-privacy-settings"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".wt-overlay__modal"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "button.wt-btn.wt-btn--transparent",
            "textFilter": [
              "Update settings"
            ]
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": ".wt-pt-xl-6.wt-display-flex-xl"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "#personalization_consent"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "#personalization_consent"
                      }
                    },
                    "type": "A"
                  }
                ]
              },
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "#third_party_consent"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "#third_party_consent"
                      }
                    },
                    "type": "F"
                  }
                ]
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "waitcss",
              "target": {
                "selector": "button[data-wt-overlay-close]",
                "displayFilter": true
              },
              "retries": 10,
              "waitTime": 250
            },
            {
              "type": "click",
              "target": {
                "selector": "button[data-wt-overlay-close]",
                "displayFilter": true
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "EvidonBanner": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "target": {
              "selector": "#_evidon_banner"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "target": {
              "displayFilter": true,
              "selector": "#_evidon_banner"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "actions": [
            {
              "target": {
                "selector": "#_evidon_banner #_evidon-message a",
                "textFilter": [
                  "choices",
                  "Cookie Consent Tool",
                  "here"
                ]
              },
              "type": "click"
            },
            {
              "type": "wait",
              "waitTime": 250
            },
            {
              "target": {
                "selector": "#_evidon_banner #_evidon-option-button"
              },
              "type": "click"
            }
          ],
          "type": "list"
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "actions": [
            {
              "falseAction": {
                "actions": [
                  {
                    "negated": false,
                    "retries": 10,
                    "target": {
                      "selector": "iframe#_evidon-consent-frame"
                    },
                    "type": "waitcss",
                    "waitTime": 250
                  },
                  {
                    "negated": true,
                    "retries": 10,
                    "target": {
                      "selector": "iframe#_evidon-consent-frame"
                    },
                    "type": "waitcss",
                    "waitTime": 250
                  },
                  {
                    "target": {
                      "selector": "button#_evidon-accept-button"
                    },
                    "type": "click"
                  }
                ],
                "type": "list"
              },
              "target": {
                "selector": "#evidon-prefdiag-overlay"
              },
              "trueAction": {
                "target": {
                  "selector": ".evidon-prefdiag-declinebtn"
                },
                "type": "click"
              },
              "type": "ifcss"
            }
          ],
          "type": "list"
        },
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "actions": [
            {
              "target": {
                "selector": "#evidon-prefdiag-background"
              },
              "type": "hide"
            },
            {
              "target": {
                "selector": "#evidon-prefdiag-overlay"
              },
              "type": "hide"
            },
            {
              "target": {
                "selector": "#_evidon_banner"
              },
              "type": "hide"
            }
          ],
          "type": "list"
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "target": {
            "selector": "#evidon-prefdiag-overlay"
          },
          "trueAction": {
            "actions": [
              {
                "target": {
                  "selector": ".evidon-prefdiag-sidebarlink",
                  "textFilter": [
                    "Purposes"
                  ]
                },
                "type": "click"
              },
              {
                "action": {
                  "actions": [
                    {
                      "target": {
                        "selector": "[id*=iab-purpose-name]",
                        "textFilter": [
                          "Information storage and access"
                        ]
                      },
                      "trueAction": {
                        "consents": [
                          {
                            "matcher": {
                              "target": {
                                "selector": "input"
                              },
                              "type": "checkbox"
                            },
                            "toggleAction": {
                              "target": {
                                "selector": "label"
                              },
                              "type": "click"
                            },
                            "type": "D"
                          }
                        ],
                        "type": "consent"
                      },
                      "type": "ifcss"
                    },
                    {
                      "target": {
                        "selector": "[id*=iab-purpose-name]",
                        "textFilter": [
                          "Personalisation"
                        ]
                      },
                      "trueAction": {
                        "consents": [
                          {
                            "matcher": {
                              "target": {
                                "selector": "input"
                              },
                              "type": "checkbox"
                            },
                            "toggleAction": {
                              "target": {
                                "selector": "label"
                              },
                              "type": "click"
                            },
                            "type": "F"
                          }
                        ],
                        "type": "consent"
                      },
                      "type": "ifcss"
                    },
                    {
                      "target": {
                        "selector": "[id*=iab-purpose-name]",
                        "textFilter": [
                          "Content selection, delivery, reporting"
                        ]
                      },
                      "trueAction": {
                        "consents": [
                          {
                            "matcher": {
                              "target": {
                                "selector": "input"
                              },
                              "type": "checkbox"
                            },
                            "toggleAction": {
                              "target": {
                                "selector": "label"
                              },
                              "type": "click"
                            },
                            "type": "E"
                          }
                        ],
                        "type": "consent"
                      },
                      "type": "ifcss"
                    },
                    {
                      "target": {
                        "selector": "[id*=iab-purpose-name]",
                        "textFilter": [
                          "Ad selection, delivery, reporting"
                        ]
                      },
                      "trueAction": {
                        "consents": [
                          {
                            "matcher": {
                              "target": {
                                "selector": "input"
                              },
                              "type": "checkbox"
                            },
                            "toggleAction": {
                              "target": {
                                "selector": "label"
                              },
                              "type": "click"
                            },
                            "type": "F"
                          }
                        ],
                        "type": "consent"
                      },
                      "type": "ifcss"
                    },
                    {
                      "target": {
                        "selector": "[id*=iab-purpose-name]",
                        "textFilter": [
                          "Measurement"
                        ]
                      },
                      "trueAction": {
                        "consents": [
                          {
                            "matcher": {
                              "target": {
                                "selector": "input"
                              },
                              "type": "checkbox"
                            },
                            "toggleAction": {
                              "target": {
                                "selector": "label"
                              },
                              "type": "click"
                            },
                            "type": "B"
                          }
                        ],
                        "type": "consent"
                      },
                      "type": "ifcss"
                    }
                  ],
                  "type": "list"
                },
                "target": {
                  "selector": "#iab-purpose-container [id*='iab-purpose']"
                },
                "type": "foreach"
              },
              {
                "target": {
                  "selector": ".evidon-prefdiag-acceptbtn",
                  "textFilter": [
                    "Save Preferences"
                  ]
                },
                "type": "click"
              },
              {
                "target": {
                  "selector": ".evidon-prefdiag-sidebarlink",
                  "textFilter": [
                    "Vendors"
                  ]
                },
                "type": "click"
              }
            ],
            "type": "list"
          },
          "type": "ifcss"
        },
        "name": "DO_CONSENT"
      }
    ]
  },
  "EvidonIFrame": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "parent": null,
            "target": {
              "selector": ".footer .evidon-footer-image"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "parent": null,
            "target": {
              "selector": ".footer .evidon-footer-image"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "actions": [
            {
              "consents": [
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Advertising"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Advertising"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Functional"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Functional"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "A"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Analytics Provider"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Analytics Provider"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Social Media"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Social Media"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Ad Network"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Ad Network"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Ad Server"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Ad Server"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Creative/Ad Format Technology"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Research Provider"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Research Provider"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Creative/Ad Format Technology"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Data Aggregator/Supplier"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Data Aggregator/Supplier"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Publisher"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Publisher"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Demand Side Platform"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Demand Side Platform"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Retargeter"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Retargeter"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Ad Exchange"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Ad Exchange"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Marketing Solutions"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Marketing Solutions"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Advertiser"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Advertiser"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Supply Side Platform"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Supply Side Platform"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Optimizer"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Optimizer"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Ad Verification"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Ad Verification"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Data Management Platform"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Data Management Platform"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Agency"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Agency"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Business Intelligence"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Business Intelligence"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Key Ad Personalization Cookies"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Key Ad Personalization Cookies"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Analytics"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header-text",
                          "textFilter": "Analytics"
                        }
                      },
                      "selector": ".category-header"
                    },
                    "target": {
                      "selector": "img.category-check.checked"
                    },
                    "type": "click"
                  },
                  "type": "F"
                }
              ],
              "type": "consent"
            }
          ],
          "type": "list"
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "actions": [
            {
              "target": {
                "selector": "button#apply-button"
              },
              "type": "click"
            },
            {
              "target": {
                "selector": "#optoutfeedback",
                "textFilter": [
                  "opted out",
                  "settings updated"
                ]
              },
              "type": "waitcss"
            },
            {
              "type": "close"
            }
          ],
          "type": "list"
        },
        "name": "SAVE_CONSENT"
      }
    ]
  },
  "ez-cookie": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#ez-cookie-dialog"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#ez-cookie-dialog",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#ez-cookie-dialog-wrapper"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#ez-manage-settings"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "selector": "#ez-cookie-dialog .ez-cmp-purpose, #ez-cookie-dialog .ez-cmp-specialFeature"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".ez-cmp-purpose-legitimate-interest input"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".ez-cmp-purpose-legitimate-interest input"
                          }
                        },
                        "type": "X"
                      }
                    ]
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ez-cmp-purpose-name, .ez-cmp-specialFeature-name",
                      "textFilter": [
                        "Store and/or access information on a device",
                        "Use precise geolocation data",
                        "Actively scan device characteristics for identification"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": ".ez-cmp-purpose-consent input, .ez-cmp-specialFeature-consent input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".ez-cmp-purpose-consent input, .ez-cmp-specialFeature-consent input"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ez-cmp-purpose-name, .ez-cmp-specialFeature-name",
                      "textFilter": [
                        "Select basic ads",
                        "Create a personalised ads profile",
                        "Select personalised ads",
                        "Apply market research to generate audience insights",
                        "Measure ad performance"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": ".ez-cmp-purpose-consent input, .ez-cmp-specialFeature-consent input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".ez-cmp-purpose-consent input, .ez-cmp-specialFeature-consent input"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ez-cmp-purpose-name, .ez-cmp-specialFeature-name",
                      "textFilter": [
                        "Create a personalised content profile",
                        "Select personalised content",
                        "Measure content performance"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": ".ez-cmp-purpose-consent input, .ez-cmp-specialFeature-consent input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".ez-cmp-purpose-consent input, .ez-cmp-specialFeature-consent input"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ez-cmp-purpose-name, .ez-cmp-specialFeature-name",
                      "textFilter": [
                        "Develop and improve products"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": ".ez-cmp-purpose-consent input, .ez-cmp-specialFeature-consent input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".ez-cmp-purpose-consent input, .ez-cmp-specialFeature-consent input"
                            }
                          },
                          "type": "B"
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              "type": "click",
              "target": {
                "selector": "#ez-show-vendors"
              }
            },
            {
              "type": "foreach",
              "target": {
                "selector": "#ez-cookie-dialog .ez-cmp-vendor .ez-cmp-vendor-legitimate-interest"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "input"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "input"
                      }
                    },
                    "type": "X"
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#ez-save-settings"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "fastcmp": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#fast-cmp-container"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#fast-cmp-container"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "html"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".fast-cmp-navigation-button"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "waitcss",
              "target": {
                "selector": ".fast-cmp-consent-box"
              },
              "retries": 10,
              "waitTime": 250
            },
            {
              "type": "foreach",
              "target": {
                "selector": ".fast-cmp-consent-box"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "[name='purposeConsents'][value='1']"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[name=purposeConsents]"
                            }
                          },
                          "toggleAction": {
                            "type": "multiclick",
                            "target": {
                              "selector": "[name=purposeConsents]"
                            }
                          },
                          "type": "D"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[name=purposeLegitimateInterests]"
                            }
                          },
                          "toggleAction": {
                            "type": "multiclick",
                            "target": {
                              "selector": "[name=purposeLegitimateInterests]"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "[name='purposeConsents'][value='2'],[name='purposeConsents'][value='3'],[name='purposeConsents'][value='4'],[name='purposeConsents'][value='7'],[name='purposeConsents'][value='9']"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[name=purposeConsents]"
                            }
                          },
                          "toggleAction": {
                            "type": "multiclick",
                            "target": {
                              "selector": "[name=purposeConsents]"
                            }
                          },
                          "type": "F"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[name=purposeLegitimateInterests]"
                            }
                          },
                          "toggleAction": {
                            "type": "multiclick",
                            "target": {
                              "selector": "[name=purposeLegitimateInterests]"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "[name='purposeConsents'][value='5'],[name='purposeConsents'][value='6']"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[name=purposeConsents]"
                            }
                          },
                          "toggleAction": {
                            "type": "multiclick",
                            "target": {
                              "selector": "[name=purposeConsents]"
                            }
                          },
                          "type": "E"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[name=purposeLegitimateInterests]"
                            }
                          },
                          "toggleAction": {
                            "type": "multiclick",
                            "target": {
                              "selector": "[name=purposeLegitimateInterests]"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "[name='purposeConsents'][value='8'],[name='purposeConsents'][value='10']"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[name=purposeConsents]"
                            }
                          },
                          "toggleAction": {
                            "type": "multiclick",
                            "target": {
                              "selector": "[name=purposeConsents]"
                            }
                          },
                          "type": "B"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[name=purposeLegitimateInterests]"
                            }
                          },
                          "toggleAction": {
                            "type": "multiclick",
                            "target": {
                              "selector": "[name=purposeLegitimateInterests]"
                            }
                          },
                          "type": "B"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "[name='specialFeatureOptins'][value='1']"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[name=specialFeatureOptins]"
                            }
                          },
                          "toggleAction": {
                            "type": "multiclick",
                            "target": {
                              "selector": "[name=specialFeatureOptins]"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "[name='specialFeatureOptins'][value='2']"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[name=specialFeatureOptins]"
                            }
                          },
                          "toggleAction": {
                            "type": "multiclick",
                            "target": {
                              "selector": "[name=specialFeatureOptins]"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".fast-cmp-button-primary[value='save']"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "flysas": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".flysas.modal.open.null"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".flysas.modal.open.null",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "[s4s-modal-id='privacyModal']"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "[s4s-modal-id='privacySettingsModal']"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".privacy.configure"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "[element='cookieMarketingTab']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "[element='cookieMarketingTab']"
                    }
                  },
                  "type": "F"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "[element='cookieAnalyticsTab']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "[element='cookieAnalyticsTab']"
                    }
                  },
                  "type": "B"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".cookie.save"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "future": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "parent": null,
            "target": {
              "iframeFilter": true,
              "selector": "script[src='cmpui.js']"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "parent": null,
            "target": {
              "iframeFilter": true,
              "selector": "#mainMoreInfo"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "target": {
            "selector": "#mainMoreInfo"
          },
          "type": "click"
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "action": {
            "actions": [
              {
                "target": {
                  "selector": "label.form-check-label",
                  "textFilter": [
                    "Information storage and access",
                    "Lagring og adgang til oplysninger"
                  ]
                },
                "trueAction": {
                  "consents": [
                    {
                      "matcher": {
                        "target": {
                          "selector": "input"
                        },
                        "type": "checkbox"
                      },
                      "toggleAction": {
                        "target": {
                          "selector": "input"
                        },
                        "type": "click"
                      },
                      "type": "D"
                    }
                  ],
                  "type": "consent"
                },
                "type": "ifcss"
              },
              {
                "target": {
                  "selector": "label.form-check-label",
                  "textFilter": [
                    "Personalisation",
                    "Personalisering"
                  ]
                },
                "trueAction": {
                  "consents": [
                    {
                      "matcher": {
                        "target": {
                          "selector": "input"
                        },
                        "type": "checkbox"
                      },
                      "toggleAction": {
                        "target": {
                          "selector": "input"
                        },
                        "type": "click"
                      },
                      "type": "F"
                    }
                  ],
                  "type": "consent"
                },
                "type": "ifcss"
              },
              {
                "target": {
                  "selector": "label.form-check-label",
                  "textFilter": [
                    "Annoncevalg, levering, rapportering",
                    "Ad selection, delivery, reporting"
                  ]
                },
                "trueAction": {
                  "consents": [
                    {
                      "matcher": {
                        "target": {
                          "selector": "input"
                        },
                        "type": "checkbox"
                      },
                      "toggleAction": {
                        "target": {
                          "selector": "input"
                        },
                        "type": "click"
                      },
                      "type": "F"
                    }
                  ],
                  "type": "consent"
                },
                "type": "ifcss"
              },
              {
                "target": {
                  "selector": "label.form-check-label",
                  "textFilter": [
                    "Udvælgelse af indhold, levering, rapportering",
                    "Content selection, delivery, reporting"
                  ]
                },
                "trueAction": {
                  "consents": [
                    {
                      "matcher": {
                        "target": {
                          "selector": "input"
                        },
                        "type": "checkbox"
                      },
                      "toggleAction": {
                        "target": {
                          "selector": "input"
                        },
                        "type": "click"
                      },
                      "type": "E"
                    }
                  ],
                  "type": "consent"
                },
                "type": "ifcss"
              },
              {
                "target": {
                  "selector": "label.form-check-label",
                  "textFilter": [
                    "Measurement",
                    "Måling"
                  ]
                },
                "trueAction": {
                  "consents": [
                    {
                      "matcher": {
                        "target": {
                          "selector": "input"
                        },
                        "type": "checkbox"
                      },
                      "toggleAction": {
                        "target": {
                          "selector": "input"
                        },
                        "type": "click"
                      },
                      "type": "B"
                    }
                  ],
                  "type": "consent"
                },
                "type": "ifcss"
              }
            ],
            "type": "list"
          },
          "target": {
            "selector": ".cmp-consent-list .form-check"
          },
          "type": "foreach"
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "actions": [
            {
              "target": {
                "selector": ".cmp-btn-save"
              },
              "type": "click"
            },
            {
              "target": {
                "selector": ".cmp-vendors"
              },
              "type": "waitcss"
            },
            {
              "target": {
                "selector": ".cmp-btn-save"
              },
              "type": "click"
            }
          ],
          "type": "list"
        },
        "name": "SAVE_CONSENT"
      }
    ]
  },
  "Flightaware.com": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookieDisclaimerContainer"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookieDisclaimerContainer",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#cookieDisclaimerButtonText"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "google_cwiz": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "childFilter": {
                "target": {
                  "selector": "a[href^=\"https://policies.google.com/privacy\"]"
                }
              },
              "selector": "body[jscontroller] c-wiz",
              "textFilter": "Google Analytics"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "a[href^=\"https://policies.google.com/technologies/cookies\"]"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "childFilter": {
                      "target": {
                        "childFilter": {
                          "target": {
                            "selector": ":scope > button"
                          }
                        },
                        "selector": ":scope > div[data-is-touch-wrapper]"
                      }
                    },
                    "selector": ":scope > div[jsaction]:nth-child(0n+2)"
                  }
                },
                "selector": "div"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "trueAction": {
                      "type": "click",
                      "target": {
                        "selector": "div[jsaction]:nth-child(0n+2) button"
                      }
                    },
                    "falseAction": {
                      "type": "click",
                      "target": {
                        "selector": "div[jsaction]:nth-child(0n+1) button"
                      }
                    },
                    "type": "X"
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "c-wiz form[method=\"POST\"] button"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "google_popup": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[role=\"dialog\"] a[href^=\"https://policies.google.com/privacy\"]"
            }
          },
          {
            "type": "css",
            "target": {
              "selector": "[role=\"dialog\"] a[href^=\"https://policies.google.com/technologies/cookies\"]"
            }
          },
          {
            "type": "css",
            "target": {
              "selector": "[role=\"dialog\"] a[href^=\"https://policies.google.com/terms\"]"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[role=\"dialog\"]",
              "textFilter": "g.co/privacytools"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[role=\"dialog\"] button, [role=\"dialog\"] a",
            "textFilter": [
              "Pasmaak",
              "Fərdiləşdirin",
              "Prilagodi",
              "Personalitza",
              "Přizpůsobit",
              "Addasu",
              "Přizpůsobit",
              "Tilpas",
              "Anpassen",
              "Kohanda",
              "Customise",
              "Personalizar",
              "Pertsonalizatu",
              "I-customize",
              "Saincheap",
              "Personalizar",
              "Sesuaikan",
              "Personalizza",
              "Aanpassen",
              "Personnaliser",
              "More options",
              "Flere alternativer",
              "Weitere Optionen",
              "Flere valgmuligheder",
              "Plus d'options",
              "Fler alternativ",
              "Más opciones",
              "Mais opções",
              "Meer opties",
              "Więcej opcji",
              "Več možnosti"
            ]
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "GLS": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cc--main"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cm",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#cm"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#s-cnt"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#cs-ov"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#c-s-bn"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": ".b-ex"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "[value='function']"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "[value='function']"
                      }
                    },
                    "type": "A"
                  }
                ]
              },
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "[value='analytics']"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "[value='analytics']"
                      }
                    },
                    "type": "B"
                  }
                ]
              },
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "[value='marketing']"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "[value='marketing']"
                      }
                    },
                    "type": "F"
                  }
                ]
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#s-sv-bn"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "gov.uk": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cookie-settings__confirmation"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cookie-settings__confirmation"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "wait",
              "waitTime": 2500
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": "[name='cookies-usage'][value='on']"
                    }
                  },
                  "trueAction": {
                    "type": "click",
                    "target": {
                      "selector": "[name='cookies-usage'][value='on']"
                    }
                  },
                  "falseAction": {
                    "type": "click",
                    "target": {
                      "selector": "[name='cookies-usage'][value='off']"
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": "[name='cookies-campaigns'][value='on']"
                    }
                  },
                  "trueAction": {
                    "type": "click",
                    "target": {
                      "selector": "[name='cookies-campaigns'][value='on']"
                    }
                  },
                  "falseAction": {
                    "type": "click",
                    "target": {
                      "selector": "[name='cookies-campaigns'][value='off']"
                    }
                  },
                  "type": "X"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": "[name='cookies-settings'][value='on']"
                    }
                  },
                  "trueAction": {
                    "type": "click",
                    "target": {
                      "selector": "[name='cookies-settings'][value='on']"
                    }
                  },
                  "falseAction": {
                    "type": "click",
                    "target": {
                      "selector": "[name='cookies-settings'][value='off']"
                    }
                  },
                  "type": "A"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": "[type='submit']",
                "textFilter": [
                  "Save changes"
                ]
              }
            },
            {
              "type": "click",
              "target": {
                "selector": ".cookie-settings__prev-page"
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "gov.ukopen": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".govuk-cookie-banner"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".govuk-cookie-banner",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[href='/help/cookies']"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "gfycat": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cookie-settings-container"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cookie-settings-container",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": "section"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "ifcss",
                "target": {
                  "selector": "h2",
                  "textFilter": [
                    "Preferences"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "A"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "h2",
                  "textFilter": [
                    "Performance & Analytics"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "B"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "h2",
                  "textFilter": [
                    "Marketing"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "close"
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "gfycatopen": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cookieBannerContainer"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cookieBannerContainer.shown",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "ifcss",
          "target": {
            "selector": ".cookie-settings-container"
          },
          "trueAction": {
            "type": "click",
            "target": {
              "selector": ".cookie-banner__close-button"
            }
          },
          "falseAction": {
            "type": "list",
            "actions": [
              {
                "type": "click",
                "target": {
                  "selector": ".cookie-prompt a"
                },
                "openInTab": true
              },
              {
                "type": "click",
                "target": {
                  "selector": ".cookie-banner__close-button"
                }
              }
            ]
          }
        },
        "name": "UTILITY"
      }
    ]
  },
  "Instagram": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".x1qjc9v5.x9f619.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".x1qjc9v5.x9f619.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "ifallowall",
          "trueAction": {
            "type": "click",
            "target": {
              "selector": "._a9--._a9_0"
            }
          },
          "falseAction": {
            "type": "click",
            "target": {
              "selector": "._a9--._a9_1"
            }
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "ionos": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".privacy-consent--modal, .cookieinfo.container"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".privacy-consent--modal, .cookieinfo.container",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".privacy-consent--modal"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".privacy-consent--backdrop"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#co"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": ".privacy-consent--button",
                "textFilter": [
                  "Einstellungen"
                ]
              }
            },
            {
              "type": "click",
              "target": {
                "selector": "a",
                "textFilter": [
                  "Manage cookies"
                ]
              },
              "parent": {
                "selector": ".cookieinfo.container"
              }
            }
          ]
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#cookie-banner-toggle-button-statistics"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#cookie-banner-toggle-button-statistics"
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#cookie-banner-toggle-button-marketing"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#cookie-banner-toggle-button-marketing"
                    }
                  },
                  "type": "E"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#cookie-banner-toggle-button-partnerships"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#cookie-banner-toggle-button-partnerships"
                    }
                  },
                  "type": "F"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": "#confirmSelection"
              }
            },
            {
              "type": "click",
              "target": {
                "selector": "#cookieinfo-close"
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "ikeaToast": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "target": {
              "selector": "[data-widget='cookie-dialog'].toast"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "target": {
              "displayFilter": true,
              "selector": "[data-widget='cookie-dialog'].toast"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "actions": [
            {
              "openInTab": true,
              "target": {
                "selector": "[data-widget='cookie-dialog'].toast .toast__privacy-link",
                "textFilter": [
                  "Cookie and privacy statement"
                ]
              },
              "type": "click"
            },
            {
              "target": {
                "selector": "[data-widget='cookie-dialog'].toast .toast__close"
              },
              "type": "click"
            }
          ],
          "type": "list"
        },
        "name": "OPEN_OPTIONS"
      }
    ]
  },
  "iubuenda": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#iubenda-cs-banner"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".iubenda-cs-customize-btn"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#iubenda-cs-banner"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#iubenda-iframe"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#iubenda-cs-banner .iubenda-cs-customize-btn"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "selector": ".purposes-item"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "input"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "input"
                      }
                    },
                    "type": "X"
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": "label",
                    "textFilter": [
                      "Basic interactions & functionalities",
                      "Interazioni e funzionalità semplici",
                      "Functionality"
                    ]
                  }
                },
                "selector": ".purposes-item"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "input"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "input"
                      }
                    },
                    "type": "A"
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": "label",
                    "textFilter": [
                      "Experience enhancement",
                      "Miglioramento dell’esperienza",
                      "Experience",
                      "Expérience"
                    ]
                  }
                },
                "selector": ".purposes-item"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "input"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "input"
                      }
                    },
                    "type": "E"
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": "label",
                    "textFilter": [
                      "Measurement",
                      "Misurazione",
                      "Mesure"
                    ]
                  }
                },
                "selector": ".purposes-item"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "input"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "input"
                      }
                    },
                    "type": "B"
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": "label",
                    "textFilter": [
                      "Targeting & Advertising",
                      "Targeting e Pubblicità",
                      "Marketing"
                    ]
                  }
                },
                "selector": ".purposes-item"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "input"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "input"
                      }
                    },
                    "type": "F"
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#iubFooterBtn"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "lazyadmin.nl": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".notice-title",
              "textFilter": [
                "Privacy",
                "Управление на вашата поверителност",
                "Administri la seva privacitat",
                "管理您的隐私",
                "Upravljajte Vašom privatnošću",
                "Správa vašeho soukromí",
                "Administrer dit privatliv",
                "Jouw Privacy Beheren",
                "Hallake oma isikuandmete kaitset",
                "Hallinnoi tietosuojaa",
                "Gérer la protection de votre vie privée",
                "Privatsphäre",
                "Διαχείριση του Απορρήτου Σας",
                "Adatvédelmi beállítások kezelése",
                "Gestisci la tua privacy",
                "Pārvaldiet savu konfidencialitāti",
                "Tvarkykite savo privatumą",
                "Manage Privatezza Tiegħek",
                "Administrer ditt personvern",
                "Zarządzaj swoją prywatnością",
                "Faça a Gestão da Sua Privacidade",
                "Gestionare opțiuni de confidențialitate",
                "Управляйте конфиденциальностью",
                "Spravujte si svoje súkromie",
                "Upravljajte svojo zasebnost",
                "Gestione su Privacidad",
                "Hantera din integritet",
                "Gizliliğinizi Yönetin",
                "We use cookies",
                "We gebruiken cookies"
              ],
              "iframeFilter": true
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".notice-title",
              "textFilter": [
                "Privacy",
                "Управление на вашата поверителност",
                "Administri la seva privacitat",
                "管理您的隐私",
                "Upravljajte Vašom privatnošću",
                "Správa vašeho soukromí",
                "Administrer dit privatliv",
                "Jouw Privacy Beheren",
                "Hallake oma isikuandmete kaitset",
                "Hallinnoi tietosuojaa",
                "Gérer la protection de votre vie privée",
                "Privatsphäre",
                "Διαχείριση του Απορρήτου Σας",
                "Adatvédelmi beállítások kezelése",
                "Gestisci la tua privacy",
                "Pārvaldiet savu konfidencialitāti",
                "Tvarkykite savo privatumą",
                "Manage Privatezza Tiegħek",
                "Administrer ditt personvern",
                "Zarządzaj swoją prywatnością",
                "Faça a Gestão da Sua Privacidade",
                "Gestionare opțiuni de confidențialitate",
                "Управляйте конфиденциальностью",
                "Spravujte si svoje súkromie",
                "Upravljajte svojo zasebnost",
                "Gestione su Privacidad",
                "Hantera din integritet",
                "Gizliliğinizi Yönetin",
                "We use cookies",
                "We gebruiken cookies"
              ],
              "iframeFilter": true,
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": "#en"
              }
            },
            {
              "type": "click",
              "target": {
                "selector": "#manageSettings"
              }
            }
          ]
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": "ul li.ng-tns-c73-2"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "ifcss",
                "target": {
                  "selector": "p",
                  "textFilter": [
                    "Store and/or access information on a device"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "css",
                        "target": {
                          "selector": "#mat-slider.state-true"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "#mat-slider"
                        }
                      },
                      "type": "D"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "p",
                  "textFilter": [
                    "Precise geolocation data, and identification through device scanning",
                    "Analytics"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "css",
                        "target": {
                          "selector": "#mat-slider.state-true"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "#mat-slider"
                        }
                      },
                      "type": "B"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "p",
                  "textFilter": [
                    "Personalised ads and content, ad and content measurement, audience insights and product development",
                    "Social Media",
                    "Advertising",
                    "Direct Marketing"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "css",
                        "target": {
                          "selector": "#mat-slider.state-true"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "#mat-slider"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "p",
                  "textFilter": [
                    "Strictly Necessary Cookies",
                    "Functional"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "css",
                        "target": {
                          "selector": "#mat-slider.state-true"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "#mat-slider"
                        }
                      },
                      "type": "A"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "p",
                  "textFilter": [
                    "Use precise geolocation data",
                    "Actively scan device characteristics for identification"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "css",
                        "target": {
                          "selector": "#mat-slider.state-true"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "#mat-slider"
                        }
                      },
                      "type": "X"
                    }
                  ]
                }
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": "#saveAndExit"
              }
            },
            {
              "type": "waitcss",
              "target": {
                "selector": ".mat-dialog-title.confirmationDialogTitle"
              },
              "retries": 10,
              "waitTime": 50
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".mat-dialog-title.confirmationDialogTitle"
              },
              "trueAction": {
                "type": "click",
                "target": {
                  "selector": ".mat-focus-indicator.okButton.mat-raised-button.mat-button-base"
                }
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "myfigurecollection.net": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".gdpr-disclaimer.tbx-target"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".gdpr-disclaimer.tbx-target",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": ".gdpr-disclaimer.tbx-target"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "ifallowall",
              "trueAction": {
                "type": "click",
                "target": {
                  "selector": ".accept.tbx-click"
                }
              },
              "falseAction": {
                "type": "click",
                "target": {
                  "selector": ".decline.tbx-click"
                }
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "marktplaatsopen": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".gdpr-consent-banner.tenant--nlnl"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".gdpr-consent-banner.tenant--nlnl",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#gdpr-consent-banner-manage-button"
          }
        },
        "name": "UTILITY"
      }
    ]
  },
  "marktplaats.nl": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".hz-Consent-submit-button"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".hz-Consent-submit-button",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": ".hz-Consent-vendor-content"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "ifcss",
                "target": {
                  "selector": ".hz-Purpose-header",
                  "textFilter": [
                    "Basisadvertenties selecteren",
                    "Een gepersonaliseerd advertentieprofiel aanmaken",
                    "Gepersonaliseerde advertenties selecteren",
                    "Prestaties van advertenties meten",
                    "Marktonderzoek toepassen om inzichten in het publiek te genereren",
                    "Matching via Adobe"
                  ]
                },
                "trueAction": {
                  "type": "foreach",
                  "target": {
                    "selector": ".hz-Switch"
                  },
                  "action": {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": "input"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": "input"
                          }
                        },
                        "type": "F"
                      }
                    ]
                  }
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": ".hz-Purpose-header",
                  "textFilter": [
                    "Een gepersonaliseerd content profiel aanmaken",
                    "Gepersonaliseerde content selecteren",
                    "Content prestaties meten"
                  ]
                },
                "trueAction": {
                  "type": "foreach",
                  "target": {
                    "selector": ".hz-Switch"
                  },
                  "action": {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": "input"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": "input"
                          }
                        },
                        "type": "E"
                      }
                    ]
                  }
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": ".hz-Purpose-header",
                  "textFilter": [
                    "Producten ontwikkelen en verbeteren"
                  ]
                },
                "trueAction": {
                  "type": "foreach",
                  "target": {
                    "selector": ".hz-Switch"
                  },
                  "action": {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": "input"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": "input"
                          }
                        },
                        "type": "B"
                      }
                    ]
                  }
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": ".hz-Purpose-header",
                  "textFilter": [
                    "Informatie op een apparaat opslaan en/of openen"
                  ]
                },
                "trueAction": {
                  "type": "foreach",
                  "target": {
                    "selector": ".hz-Switch"
                  },
                  "action": {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": "input"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": "input"
                          }
                        },
                        "type": "D"
                      }
                    ]
                  }
                }
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".hz-Consent-submit-button"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "Lidl": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "url",
            "url": [
              "www.lidl.dk"
            ]
          },
          {
            "type": "css",
            "target": {
              "selector": "#CybotCookiebotDialog"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cookie-alert-extended.opened",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "#CybotCookiebotDialog"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".cookie-detail-button"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": ".cookie-alert-configuration-control"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "#preferences"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "#preferences"
                      }
                    },
                    "type": "A"
                  }
                ]
              },
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "#statistics"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "#statistics"
                      }
                    },
                    "type": "B"
                  }
                ]
              },
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "#marketing"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "#marketing"
                      }
                    },
                    "type": "F"
                  }
                ]
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[data-controller='cookie-alert/extended/button/configuration']"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "lego": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[class*='CookieModalstyles__ModalContent']"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[class*='CookieModalstyles__ModalContent']",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "[class*='Modalstyles__Container']"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[class*='CookieModalstyles__ExpandingLink']"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#toggle-switch-analytics"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#toggle-switch-analytics"
                    }
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#toggle-switch-legomarketing"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#toggle-switch-legomarketing"
                    }
                  },
                  "type": "E"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#toggle-switch-thirdparty"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#toggle-switch-thirdparty"
                    }
                  },
                  "type": "F"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[data-test='cookie-settings-save-settings']"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "lemonde.fr": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cmp-container-id, .main--cmp"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookie-banner, .main--cmp"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".message__cookie-settings, .main--cmp"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#cmp-analytics"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#cmp-analytics"
                    }
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#cmp-socials"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#cmp-socials"
                    }
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#cmp-ads"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#cmp-ads"
                    }
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#cmp-customization"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#cmp-customization"
                    }
                  },
                  "type": "E"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#validate"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "HIDE_CMP"
      }
    ]
  },
  "lemonde": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".gdpr-lmd-standard"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".gdpr-lmd-standard"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "button[data-gdpr-action=\"settings\"]"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "waitcss",
              "target": {
                "selector": ".gdpr-lmd-params"
              },
              "retries": 10,
              "waitTime": 250
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input[data-gdpr-params-purpose=\"social\"]"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input[data-gdpr-params-purpose=\"social\"]"
                    }
                  },
                  "type": "X"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input[data-gdpr-params-purpose=\"mediaPlatforms\"]"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input[data-gdpr-params-purpose=\"mediaPlatforms\"]"
                    }
                  },
                  "type": "E"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input[data-gdpr-params-purpose=\"personalization\"]"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input[data-gdpr-params-purpose=\"personalization\"]"
                    }
                  },
                  "type": "E"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input[data-gdpr-params-purpose=\"ads\"]"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input[data-gdpr-params-purpose=\"ads\"]"
                    }
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input[data-gdpr-params-purpose=\"analytics\"]"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "input[data-gdpr-params-purpose=\"analytics\"]"
                    }
                  },
                  "type": "B"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "button[data-gdpr-action=\"save\"]"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "linkedin_popup": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div[type=\"COOKIE_CONSENT\"] [data-tracking-control-name^=\"ga-cookie.consent.manage\"]"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div[type=\"COOKIE_CONSENT\"] [data-tracking-control-name^=\"ga-cookie.consent.manage\"]"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "div[type=\"COOKIE_CONSENT\"] [data-tracking-control-name^=\"ga-cookie.consent.manage\"]"
          }
        },
        "name": "UTILITY"
      }
    ]
  },
  "mydealz.de": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div.oreo-message.bg--color-white.bRad--t-a.space--h-4.space--v-4.boxShadow--large.seal--pointer-on.overflow--scrollY-raw.space--mt-2"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div.oreo-message.bg--color-white.bRad--t-a.space--h-4.space--v-4.boxShadow--large.seal--pointer-on.overflow--scrollY-raw.space--mt-2"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": "span.btn.btn--mode-primary",
                    "textFilter": "Einstellungen speichern"
                  }
                },
                "selector": "button.width--all-12"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "button.flex--grow-1.text--color-brandPrimary.text--b.space--h-3"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "trueAction": {
                    "type": "click",
                    "target": {
                      "selector": "label.size--all-xl.text--b.flex--grow-1.space--mr-3.clickable",
                      "textFilter": "Personalisierungs-Cookies"
                    }
                  },
                  "type": "F"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "trueAction": {
                    "type": "click",
                    "target": {
                      "selector": "label.size--all-xl.text--b.flex--grow-1.space--mr-3.clickable",
                      "textFilter": "Funktionalitäts-Cookies"
                    }
                  },
                  "type": "A"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "trueAction": {
                    "type": "click",
                    "target": {
                      "selector": "label.size--all-xl.text--b.flex--grow-1.space--mr-3.clickable",
                      "textFilter": "Analyse-Cookies"
                    }
                  },
                  "type": "B"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": "span.btn.btn--mode-primary",
                    "textFilter": "Einstellungen speichern"
                  }
                },
                "selector": "button.width--all-12"
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      }
    ]
  },
  "notion.so": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".jsx-539809080.visibility-partial.container"
            },
            "parent": {
              "selector": "#__next"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".jsx-539809080.visibility-partial.container"
            },
            "parent": {
              "selector": "#__next",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": ".jsx-539809080.visibility-partial.container"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[aria-label='More options']"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": "#preference[aria-pressed='true']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#preference"
                    }
                  },
                  "type": "A"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": "#performance[aria-pressed='true']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#performance"
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": "#targeting[aria-pressed='true']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#targeting"
                    }
                  },
                  "type": "F"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[aria-label='Done']"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "oil": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "target": {
              "selector": ".as-oil-content-overlay"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "target": {
              "selector": ".as-oil-content-overlay"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "actions": [
            {
              "target": {
                "selector": ".as-js-advanced-settings"
              },
              "type": "click"
            },
            {
              "retries": 10,
              "target": {
                "selector": ".as-oil-cpc__purpose-container"
              },
              "type": "waitcss",
              "waitTime": 250
            }
          ],
          "type": "list"
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "actions": [
            {
              "consents": [
                {
                  "matcher": {
                    "parent": {
                      "selector": ".as-oil-cpc__purpose-container",
                      "textFilter": [
                        "Information storage and access",
                        "Opbevaring af og adgang til oplysninger på din enhed"
                      ]
                    },
                    "target": {
                      "selector": "input"
                    },
                    "type": "checkbox"
                  },
                  "toggleAction": {
                    "parent": {
                      "selector": ".as-oil-cpc__purpose-container",
                      "textFilter": [
                        "Information storage and access",
                        "Opbevaring af og adgang til oplysninger på din enhed"
                      ]
                    },
                    "target": {
                      "selector": ".as-oil-cpc__switch"
                    },
                    "type": "click"
                  },
                  "type": "D"
                },
                {
                  "matcher": {
                    "parent": {
                      "selector": ".as-oil-cpc__purpose-container",
                      "textFilter": [
                        "Personlige annoncer",
                        "Personalisation"
                      ]
                    },
                    "target": {
                      "selector": "input"
                    },
                    "type": "checkbox"
                  },
                  "toggleAction": {
                    "parent": {
                      "selector": ".as-oil-cpc__purpose-container",
                      "textFilter": [
                        "Personlige annoncer",
                        "Personalisation"
                      ]
                    },
                    "target": {
                      "selector": ".as-oil-cpc__switch"
                    },
                    "type": "click"
                  },
                  "type": "E"
                },
                {
                  "matcher": {
                    "parent": {
                      "selector": ".as-oil-cpc__purpose-container",
                      "textFilter": [
                        "Annoncevalg, levering og rapportering",
                        "Ad selection, delivery, reporting"
                      ]
                    },
                    "target": {
                      "selector": "input"
                    },
                    "type": "checkbox"
                  },
                  "toggleAction": {
                    "parent": {
                      "selector": ".as-oil-cpc__purpose-container",
                      "textFilter": [
                        "Annoncevalg, levering og rapportering",
                        "Ad selection, delivery, reporting"
                      ]
                    },
                    "target": {
                      "selector": ".as-oil-cpc__switch"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "selector": ".as-oil-cpc__purpose-container",
                      "textFilter": [
                        "Personalisering af indhold",
                        "Content selection, delivery, reporting"
                      ]
                    },
                    "target": {
                      "selector": "input"
                    },
                    "type": "checkbox"
                  },
                  "toggleAction": {
                    "parent": {
                      "selector": ".as-oil-cpc__purpose-container",
                      "textFilter": [
                        "Personalisering af indhold",
                        "Content selection, delivery, reporting"
                      ]
                    },
                    "target": {
                      "selector": ".as-oil-cpc__switch"
                    },
                    "type": "click"
                  },
                  "type": "E"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".as-oil-cpc__purpose-header",
                          "textFilter": [
                            "Måling",
                            "Measurement"
                          ]
                        }
                      },
                      "selector": ".as-oil-cpc__purpose-container"
                    },
                    "target": {
                      "selector": "input"
                    },
                    "type": "checkbox"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".as-oil-cpc__purpose-header",
                          "textFilter": [
                            "Måling",
                            "Measurement"
                          ]
                        }
                      },
                      "selector": ".as-oil-cpc__purpose-container"
                    },
                    "target": {
                      "selector": ".as-oil-cpc__switch"
                    },
                    "type": "click"
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "parent": {
                      "selector": ".as-oil-cpc__purpose-container",
                      "textFilter": "Google"
                    },
                    "target": {
                      "selector": "input"
                    },
                    "type": "checkbox"
                  },
                  "toggleAction": {
                    "parent": {
                      "selector": ".as-oil-cpc__purpose-container",
                      "textFilter": "Google"
                    },
                    "target": {
                      "selector": ".as-oil-cpc__switch"
                    },
                    "type": "click"
                  },
                  "type": "F"
                }
              ],
              "type": "consent"
            }
          ],
          "type": "list"
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "target": {
            "selector": ".as-oil__btn-optin"
          },
          "type": "click"
        },
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "target": {
            "selector": "div.as-oil"
          },
          "type": "hide"
        },
        "name": "HIDE_CMP"
      }
    ]
  },
  "onetrust_banner": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#onetrust-banner-sdk, #cookie-consent-wrapper"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#onetrust-banner-sdk, #cookie-consent-preferences",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#onetrust-banner-sdk"
              },
              "hideFromDetection": true,
              "forceHide": true
            },
            {
              "type": "hide",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": "#cookie-consent-preferences"
                  }
                },
                "selector": "#cookie-consent-wrapper"
              },
              "hideFromDetection": true,
              "forceHide": true
            },
            {
              "type": "click",
              "target": {
                "selector": "#onetrust-pc-btn-handler, #cookie-consent-preferences"
              }
            }
          ]
        },
        "name": "UTILITY"
      }
    ]
  },
  "onetrust": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "childFilter": {
                "target": {
                  "selector": ".otPcCenter"
                }
              },
              "selector": "#onetrust-banner-sdk",
              "displayFilter": true,
              "childFilterNegate": true
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#onetrust-banner-sdk",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#onetrust-banner-sdk #onetrust-pc-btn-handler, .ot-sdk-show-settings:not([href])"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": ".category-menu-switch-handler"
              },
              "parent": {
                "childFilter": {
                  "target": {
                    "selector": ".category-header",
                    "textFilter": [
                      "Performance Cookies"
                    ]
                  }
                },
                "selector": ".category-item"
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input.category-switch-handler"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header",
                          "textFilter": [
                            "Performance Cookies"
                          ]
                        }
                      },
                      "selector": ".category-item"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header",
                          "textFilter": [
                            "Performance Cookies"
                          ]
                        }
                      },
                      "selector": ".category-item"
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": ".category-menu-switch-handler"
              },
              "parent": {
                "selector": ".category-item",
                "textFilter": [
                  "Functional Cookies",
                  "Funktionelle cookies"
                ]
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input.category-switch-handler"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Functional Cookies",
                        "Funktionelle cookies"
                      ]
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Functional Cookies",
                        "Funktionelle cookies"
                      ]
                    }
                  },
                  "type": "A"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": ".category-menu-switch-handler"
              },
              "parent": {
                "selector": ".category-item",
                "textFilter": [
                  "Targeting Cookies",
                  "Målrettede cookies"
                ]
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input.category-switch-handler"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Targeting Cookies",
                        "Målrettede cookies"
                      ]
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Targeting Cookies",
                        "Målrettede cookies"
                      ]
                    }
                  },
                  "type": "F"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": ".category-menu-switch-handler"
              },
              "parent": {
                "selector": ".category-item",
                "textFilter": [
                  "Advertising Cookies"
                ]
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input.category-switch-handler"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Advertising Cookies"
                      ]
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Advertising Cookies"
                      ]
                    }
                  },
                  "type": "F"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": ".category-menu-switch-handler"
              },
              "parent": {
                "selector": ".category-item",
                "textFilter": [
                  "Social Media"
                ]
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input.category-switch-handler"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Social Media"
                      ]
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Social Media"
                      ]
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": ".category-menu-switch-handler"
              },
              "parent": {
                "selector": ".category-item",
                "textFilter": [
                  "Marketing Cookies"
                ]
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input.category-switch-handler"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Marketing Cookies"
                      ]
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Marketing Cookies"
                      ]
                    }
                  },
                  "type": "E"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": ".category-menu-switch-handler"
              },
              "parent": {
                "selector": ".category-item",
                "textFilter": [
                  "Measurement",
                  "Statistiske cookies"
                ]
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input.category-switch-handler"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Measurement",
                        "Statistiske cookies"
                      ]
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Measurement",
                        "Statistiske cookies"
                      ]
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": ".category-menu-switch-handler"
              },
              "parent": {
                "selector": ".category-item",
                "textFilter": [
                  "Ad selection, delivery and reporting",
                  "Ad selection, delivery, reporting",
                  "Reklamecookies"
                ]
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input.category-switch-handler"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Ad selection, delivery and reporting",
                        "Ad selection, delivery, reporting",
                        "Reklamecookies"
                      ]
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Ad selection, delivery and reporting",
                        "Ad selection, delivery, reporting",
                        "Reklamecookies"
                      ]
                    }
                  },
                  "type": "F"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": ".category-menu-switch-handler"
              },
              "parent": {
                "selector": ".category-item",
                "textFilter": [
                  "Information storage and access"
                ]
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input.category-switch-handler"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Information storage and access"
                      ]
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Information storage and access"
                      ]
                    }
                  },
                  "type": "D"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": ".category-menu-switch-handler"
              },
              "parent": {
                "selector": ".category-item",
                "textFilter": [
                  "Content selection, delivery, reporting",
                  "Content selection, delivery and reporting"
                ]
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input.category-switch-handler"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Content selection, delivery, reporting",
                        "Content selection, delivery and reporting"
                      ]
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label"
                    },
                    "parent": {
                      "selector": ".category-item",
                      "textFilter": [
                        "Content selection, delivery, reporting",
                        "Content selection, delivery and reporting"
                      ]
                    }
                  },
                  "type": "E"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": ".category-menu-switch-handler"
              },
              "parent": {
                "childFilter": {
                  "target": {
                    "selector": ".category-header",
                    "textFilter": [
                      "Personalisation"
                    ]
                  }
                },
                "selector": ".category-item"
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input.category-switch-handler"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header",
                          "textFilter": [
                            "Personalisation"
                          ]
                        }
                      },
                      "selector": ".category-item"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".category-header",
                          "textFilter": [
                            "Personalisation"
                          ]
                        }
                      },
                      "selector": ".category-item"
                    }
                  },
                  "type": "E"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".save-preference-btn-handler"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#onetrust-consent-sdk"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "onetrust-stackoverflow": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".js-consent-banner"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".js-consent-banner",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": ".js-consent-banner .js-cookie-settings"
              }
            },
            {
              "type": "waitcss",
              "target": {
                "selector": "#onetrust-banner-sdk .js-consent-save"
              },
              "retries": 10,
              "waitTime": 250
            },
            {
              "type": "waitcss",
              "target": {
                "selector": "input"
              },
              "parent": {
                "selector": "#onetrust-banner-sdk .s-modal--body .ai-center"
              },
              "retries": 10,
              "waitTime": 250
            }
          ]
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "consent",
          "consents": [
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "input"
                },
                "parent": {
                  "selector": "#onetrust-banner-sdk .s-modal--body .ai-center",
                  "textFilter": [
                    "Performance Cookies"
                  ]
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "input"
                },
                "parent": {
                  "selector": "#onetrust-banner-sdk .s-modal--body .ai-center",
                  "textFilter": [
                    "Performance Cookies"
                  ]
                }
              },
              "type": "B"
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "input"
                },
                "parent": {
                  "selector": "#onetrust-banner-sdk .s-modal--body .ai-center",
                  "textFilter": [
                    "Targeting Cookies"
                  ]
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "input"
                },
                "parent": {
                  "selector": "#onetrust-banner-sdk .s-modal--body .ai-center",
                  "textFilter": [
                    "Targeting Cookies"
                  ]
                }
              },
              "type": "F"
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "input"
                },
                "parent": {
                  "selector": "#onetrust-banner-sdk .s-modal--body .ai-center",
                  "textFilter": [
                    "Functional Cookies"
                  ]
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "input"
                },
                "parent": {
                  "selector": "#onetrust-banner-sdk .s-modal--body .ai-center",
                  "textFilter": [
                    "Functional Cookies"
                  ]
                }
              },
              "type": "A"
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "wait",
              "waitTime": 500
            },
            {
              "type": "click",
              "target": {
                "selector": "#onetrust-banner-sdk .js-consent-save"
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#onetrust-banner-sdk [role=\"dialog\"]"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".js-consent-banner"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "onetrust_pcpanel": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "childFilter": {
                "target": {
                  "selector": ".otPcPanel, .otPcCenter, .otPcPopup"
                }
              },
              "selector": "#onetrust-consent-sdk"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "childFilter": {
                "target": {
                  "selector": ".otPcPanel, .otPcCenter, .otPcPopup",
                  "displayFilter": true
                }
              },
              "selector": "#onetrust-consent-sdk"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "selector": ".ot-cat-item, .category-item"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Do Not Sell My Personal Information for NYP Print Subscribers (Offline Third Parties)"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            },
                            "negated": true
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Functional Cookies",
                        "Functionality Cookies",
                        "Funktionelle Cookies",
                        "Udvid funktionalitet",
                        "Extend functionality",
                        "Præferencer",
                        "Functional"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "A"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Targeting Cookies",
                        "Reklamecookies",
                        "Advertising Cookies",
                        "Marketing Cookies",
                        "Cookies für Marketingzwecke",
                        "Tilpas annoncering",
                        "ADVERTISING",
                        "Målrettede cookies",
                        "Marketing-Technologien",
                        "MARKETING",
                        "PUBLICIDAD",
                        "PUBBLICITÀ",
                        "REKLAMY",
                        "RECLAME"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Performance Cookies",
                        "Measure content performance",
                        "Measure performance",
                        "Leistungs-Cookies",
                        "Performance-Technologien",
                        "ANALYSECOOKIES",
                        "ANALYSE",
                        "ANÁLISIS",
                        "ANALISI",
                        "ANALITYKA",
                        "Performance Technologies",
                        "Audience Measurement"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "B"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Store and/or access information on a device",
                        "Opbevare og/eller tilgå oplysninger på en enhed",
                        "Informationen auf einem Gerät speichern und/oder abrufen",
                        "Præcise geoplaceringsoplysninger og identifikation gennem enhedsscanning",
                        "Specielle formål"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Personalised ads and content, ad and content measurement, audience insights and product development",
                        "Tilpassede annoncer og tilpasset indhold, annonce- og indholdsmåling, målgruppeindsigter og produktudvikling",
                        "Tilpasse annoncer og tilpasset indhold, annonce- og indholdsmåling, målgruppeindsigter og produktudvikling",
                        "Personalisierte Anzeigen und Inhalte, Anzeigen- und Inhaltsmessung, Erkenntnisse über Zielgruppen und Produktentwicklung",
                        "Personalisierte Anzeigen und Inhalte, Anzeigen- und Inhaltsmessungen, Erkenntnisse über Zielgruppen und Produktentwicklungen"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Use precise geolocation data",
                        "Bruge præcise geoplaceringsoplysninger",
                        "Genaue Standortdaten verwenden"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Actively scan device characteristics for identification",
                        "Aktivt scanne enhedskarakteristika til identifikation",
                        "Geräteeigenschaften zur Identifikation aktiv abfragen"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Cookies målrettet sociale medier",
                        "Social Media Cookies",
                        "SOCIALE MEDIER",
                        "SOCIAL MEDIA",
                        "SOZIALE MEDIEN",
                        "REDES SOCIALES",
                        "RÉSEAUX SOCIAUX",
                        "Informasjonskapsler for sosiale medier",
                        "SOCIALE MEDIA"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Select personalised content",
                        "CONTENT PERSONALISATION",
                        "PERSONALISIERUNG VON INHALTEN",
                        "PERSONALIZACIÓN DEL CONTENIDO",
                        "PERSONALIZZAZIONE DEI CONTENUTI",
                        "PERSONALIZACJA TRESCI",
                        "INHOUDSPERSONALISATIE"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Develop and improve products"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Apply market research to generate audience insights"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Create a personalised content profile"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Personalised ads, and ad measurement",
                        "Select personalised ads",
                        "Create a personalised ads profile"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Select basic ads",
                        "Basic ads, and ad measurement",
                        "Personalised ads profile and display"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Measure ad performance"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Content measurement, audience insights, and product development."
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Recommended Cookies"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Analytics Cookies",
                        "Externí analýzy",
                        "Analyse Cookies",
                        "Statistical Cookies",
                        "Mål ydeevne",
                        "Måle- og analysecookies",
                        "Statistiske cookies",
                        "Analytical Cookies",
                        "Statistik Cookies",
                        "Analytics",
                        "Statistik"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "B"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".ot-cat-header, .category-header",
                      "textFilter": [
                        "Precise geolocation data, and identification through device scanning"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input.category-switch-handler"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": "button.ot-obj-leg-btn-handler"
                  }
                },
                "selector": ".category-item"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "falseAction": {
                      "type": "list",
                      "actions": [
                        {
                          "type": "click",
                          "target": {
                            "selector": ":scope > input"
                          }
                        },
                        {
                          "type": "click",
                          "target": {
                            "selector": "button.ot-obj-leg-btn-handler"
                          }
                        }
                      ]
                    },
                    "type": "X"
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".save-preference-btn-handler"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#onetrust-pc-sdk"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".onetrust-pc-dark-filter"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "onetrust_pctab": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "childFilter": {
                "target": {
                  "selector": ".otPcTab"
                }
              },
              "selector": "#onetrust-consent-sdk"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "childFilter": {
                "target": {
                  "selector": ".otPcTab",
                  "displayFilter": true
                }
              },
              "selector": "#onetrust-consent-sdk"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": ".ot-desc-cntr, .description-container"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "ifcss",
                "target": {
                  "selector": ".ot-grp-hdr1, .group-toggle",
                  "textFilter": [
                    "Opbevare og/eller tilgå oplysninger på en enhed",
                    "Store and/or access information on a device",
                    "Informationen auf einem Gerät speichern und/oder abrufen"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "type": "D"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": ".ot-grp-hdr1, .group-toggle",
                  "textFilter": [
                    "Tilpassede annoncer og tilpasset indhold, annonce- og indholdsmåling, målgruppeindsigter og produktudvikling",
                    "Personalised ads and content, ad and content measurement, audience insights and product development",
                    "Personalisierte Anzeigen und Inhalte, Anzeigen- und Inhaltsmessung, Erkenntnisse über Zielgruppen und Produktentwicklung",
                    "Personalised ads, and ad measurement"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": ".ot-grp-hdr1, .group-toggle",
                  "textFilter": [
                    "Performance Cookies",
                    "Leistungs-Cookies",
                    "Ydeevne og analytik cookies",
                    "Analytics Cookies"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "type": "B"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": ".ot-grp-hdr1, .group-toggle",
                  "textFilter": [
                    "Bruge præcise geoplaceringsoplysninger",
                    "Use precise geolocation data",
                    "Genaue Standortdaten verwenden"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "type": "D"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": ".ot-grp-hdr1, .group-toggle",
                  "textFilter": [
                    "Reklamecookies",
                    "Advertising Cookies",
                    "Werbe-Cookies"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": ".ot-grp-hdr1, .group-toggle",
                  "textFilter": [
                    "Funktionelle cookies",
                    "Functional Cookies",
                    "Funktionale Cookies",
                    "Funktionelle"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "type": "A"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": ".ot-grp-hdr1, .group-toggle",
                  "textFilter": [
                    "Personlig tilpasning cookies",
                    "Personalisation Cookies",
                    "Personalised content, content measurement, audience insights, and product development"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "type": "E"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": ".ot-grp-hdr1, .group-toggle",
                  "textFilter": [
                    "Målrettede cookies",
                    "Targeting cookies",
                    "Målrettede"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": ".ot-grp-hdr1, .group-toggle",
                  "textFilter": [
                    "Site monitoring cookies",
                    "Performance"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "type": "B"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": ".ot-grp-hdr1, .group-toggle",
                  "textFilter": [
                    "Third-party privacy enhanced cookies",
                    "Sociale medier"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": ".ot-grp-hdr1 input, .group-toggle input"
                        }
                      },
                      "type": "X"
                    }
                  ]
                }
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".save-preference-btn-handler"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#onetrust-pc-sdk"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".onetrust-pc-dark-filter"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "optanon-alternative": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "parent": null,
            "target": {
              "selector": "#optanon-popup-body-content"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "parent": null,
            "target": {
              "displayFilter": true,
              "selector": ".optanon-alert-box-wrapper"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "actions": [
            {
              "target": {
                "selector": ".optanon-alert-box-wrapper .optanon-toggle-display"
              },
              "type": "click"
            }
          ],
          "type": "list"
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "consents": [
            {
              "description": "Performance Cookies",
              "matcher": {
                "parent": {
                  "selector": "#optanon-popup-body-content",
                  "textFilter": "Performance Cookies"
                },
                "target": {
                  "selector": "input"
                },
                "type": "checkbox"
              },
              "toggleAction": {
                "parent": {
                  "selector": "#optanon-popup-body-content",
                  "textFilter": "Performance Cookies"
                },
                "target": {
                  "selector": "label"
                },
                "type": "click"
              },
              "type": "B"
            },
            {
              "description": "Functional Cookies",
              "matcher": {
                "parent": {
                  "selector": "#optanon-popup-body-content",
                  "textFilter": "Functional Cookies"
                },
                "target": {
                  "selector": "input"
                },
                "type": "checkbox"
              },
              "toggleAction": {
                "parent": {
                  "selector": "#optanon-popup-body-content",
                  "textFilter": "Functional Cookies"
                },
                "target": {
                  "selector": "label"
                },
                "type": "click"
              },
              "type": "A"
            },
            {
              "description": "Targeting Cookies",
              "matcher": {
                "parent": {
                  "selector": "#optanon-popup-body-content",
                  "textFilter": "Targeting Cookies"
                },
                "target": {
                  "selector": "input"
                },
                "type": "checkbox"
              },
              "toggleAction": {
                "parent": {
                  "selector": "#optanon-popup-body-content",
                  "textFilter": "Targeting Cookies"
                },
                "target": {
                  "selector": "label"
                },
                "type": "click"
              },
              "type": "F"
            }
          ],
          "type": "consent"
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "parent": {
            "selector": ".optanon-save-settings-button"
          },
          "target": {
            "selector": ".optanon-white-button-middle"
          },
          "type": "click"
        },
        "name": "SAVE_CONSENT"
      }
    ]
  },
  "optanon_springernature": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cc-preferences[data-cc-preferences]"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cc-preferences[data-cc-preferences] .cc-preferences__dialog"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".cc-banner[data-cc-banner]"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".cc-preferences[data-cc-preferences]"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": ".cc-preferences__category"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "ifcss",
                "target": {
                  "selector": ".cc-preferences__category-header",
                  "textFilter": [
                    "Cookies that measure website use"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "css",
                        "target": {
                          "selector": ".cc-radio__input[value=\"on\"][checked]"
                        }
                      },
                      "trueAction": {
                        "type": "click",
                        "target": {
                          "selector": ".cc-radio__input[value=\"on\"]"
                        }
                      },
                      "falseAction": {
                        "type": "click",
                        "target": {
                          "selector": ".cc-radio__input[value=\"off\"]"
                        }
                      },
                      "type": "B"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": ".cc-preferences__category-header",
                  "textFilter": [
                    "Cookies that help with our communications and marketing"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "css",
                        "target": {
                          "selector": ".cc-radio__input[value=\"on\"][checked]"
                        }
                      },
                      "trueAction": {
                        "type": "click",
                        "target": {
                          "selector": ".cc-radio__input[value=\"on\"]"
                        }
                      },
                      "falseAction": {
                        "type": "click",
                        "target": {
                          "selector": ".cc-radio__input[value=\"off\"]"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": ".cc-preferences__category-header",
                  "textFilter": [
                    "Cookies that help show personalised advertising"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "css",
                        "target": {
                          "selector": ".cc-radio__input[value=\"on\"][checked]"
                        }
                      },
                      "trueAction": {
                        "type": "click",
                        "target": {
                          "selector": ".cc-radio__input[value=\"on\"]"
                        }
                      },
                      "falseAction": {
                        "type": "click",
                        "target": {
                          "selector": ".cc-radio__input[value=\"off\"]"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".cc-button[data-cc-action=\"save\"]"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "optanon": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#optanon-menu, .optanon-alert-box-wrapper"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".optanon-alert-box-wrapper",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": ".optanon-alert-box-wrapper .optanon-toggle-display, a[onclick*='OneTrust.ToggleInfoDisplay()'], a[onclick*='Optanon.ToggleInfoDisplay()'], .optanon-alert-box-wrapper .cookie-settings-button"
              }
            }
          ]
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": ".preference-menu-item #Your-privacy"
              }
            },
            {
              "type": "click",
              "target": {
                "selector": "#optanon-vendor-consent-text"
              }
            },
            {
              "type": "foreach",
              "target": {
                "selector": "#optanon-vendor-consent-list .vendor-item"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "input"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "label"
                      }
                    },
                    "type": "X"
                  }
                ]
              }
            },
            {
              "type": "click",
              "target": {
                "selector": ".vendor-consent-back-link"
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-performance"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-performance"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "B"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-functional"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-functional"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "A"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-advertising"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-advertising"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "F"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-social"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-social"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "B"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Social Media Cookies"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Social Media Cookies"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "B"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Personalisation"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Personalisation"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "E"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Site monitoring cookies"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Site monitoring cookies"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "B"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Third party privacy-enhanced content"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Third party privacy-enhanced content"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "X"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Performance & Advertising Cookies"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Performance & Advertising Cookies"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "F"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Information storage and access"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Information storage and access"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "D"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Ad selection, delivery, reporting"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Ad selection, delivery, reporting"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "F"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Content selection, delivery, reporting"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Content selection, delivery, reporting"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "E"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Measurement"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Measurement"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "B"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Recommended Cookies"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Recommended Cookies"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "X"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Unclassified Cookies"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Unclassified Cookies"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "X"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Analytical Cookies"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Analytical Cookies"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "B"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Marketing Cookies"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Marketing Cookies"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "F"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Personalization"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Personalization"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "E"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Ad Selection, Delivery & Reporting"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Ad Selection, Delivery & Reporting"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "F"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".menu-item-necessary",
                "textFilter": "Content Selection, Delivery & Reporting"
              },
              "parent": {
                "selector": "#optanon-menu, .optanon-menu"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".menu-item-necessary",
                      "textFilter": "Content Selection, Delivery & Reporting"
                    },
                    "parent": {
                      "selector": "#optanon-menu, .optanon-menu"
                    }
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": ".optanon-status input"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".optanon-status label"
                          },
                          "parent": {
                            "selector": "#optanon-popup-body-right"
                          }
                        },
                        "type": "E"
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".optanon-white-button-middle"
          },
          "parent": {
            "selector": ".optanon-save-settings-button"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#optanon-popup-wrapper"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#optanon-popup-bg"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".optanon-alert-box-wrapper"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "osano": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".osano-cm-window"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".osano-cm-window__dialog",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".osano-cm-window__dialog"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".osano-cm-window__info-dialog"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".osano-cm-manage"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "wait",
              "waitTime": 2500
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#osano-cm-drawer-toggle--category_MARKETING, #osano-cm-dialog-toggle--category_MARKETING"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#osano-cm-drawer-toggle--category_MARKETING, #osano-cm-dialog-toggle--category_MARKETING"
                    }
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#osano-cm-drawer-toggle--category_PERSONALIZATION, #osano-cm-dialog-toggle--category_PERSONALIZATION"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#osano-cm-drawer-toggle--category_PERSONALIZATION, #osano-cm-dialog-toggle--category_PERSONALIZATION"
                    }
                  },
                  "type": "A"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#osano-cm-drawer-toggle--category_ANALYTICS, #osano-cm-dialog-toggle--category_ANALYTICS"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#osano-cm-drawer-toggle--category_ANALYTICS, #osano-cm-dialog-toggle--category_ANALYTICS"
                    }
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#osano-cm-drawer-toggle--category_STORAGE, #osano-cm-dialog-toggle--category_STORAGE"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#osano-cm-drawer-toggle--category_STORAGE, #osano-cm-dialog-toggle--category_STORAGE"
                    }
                  },
                  "type": "B"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".osano-cm-save"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "paypal_banner": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#gdprCookieBanner #manageCookiesLink"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#gdprCookieBanner #manageCookiesLink"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "ifallownone",
          "trueAction": {
            "type": "click",
            "target": {
              "selector": "#gdprCookieBanner #bannerDeclineButton"
            }
          },
          "falseAction": {
            "type": "click",
            "target": {
              "selector": "#gdprCookieBanner #manageCookiesLink"
            }
          }
        },
        "name": "UTILITY"
      }
    ]
  },
  "phpipam.net": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".container.cookies"
            },
            "parent": {
              "selector": "#cookie"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".container.cookies"
            },
            "parent": {
              "selector": "#cookie"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#cAgree"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "paypal_page": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "section.privacy-modal-content"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "section.privacy-modal-content p#cookieTitle"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "consent",
          "consents": [
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "input#marketing"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "input#marketing"
                }
              },
              "type": "F"
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "input#functional"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "input#functional"
                }
              },
              "type": "A"
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "input#performance"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "input#performance"
                }
              },
              "type": "B"
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#submitCookiesBtn"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "quantcast": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "target": {
              "selector": ".qc-cmp-ui-container"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "target": {
              "selector": ".qc-cmp-ui-container.qc-cmp-showing"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "actions": [
            {
              "target": {
                "selector": "#qc-cmp-purpose-button"
              },
              "type": "click"
            }
          ],
          "type": "list"
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "actions": [
            {
              "target": {
                "selector": "a[onclick*='updateConsentUi\",3'], a[onclick*='updateConsentUi\\',3']"
              },
              "type": "click"
            },
            {
              "action": {
                "consents": [
                  {
                    "matcher": {
                      "target": {
                        "selector": ".qc-cmp-toggle.qc-cmp-toggle-on"
                      },
                      "type": "css"
                    },
                    "toggleAction": {
                      "target": {
                        "selector": ".qc-cmp-toggle"
                      },
                      "type": "click"
                    },
                    "type": "X"
                  }
                ],
                "type": "consent"
              },
              "parent": {
                "selector": ".qc-cmp-vendor-list-body"
              },
              "target": {
                "selector": ".qc-cmp-toggle-cell"
              },
              "type": "foreach"
            },
            {
              "target": {
                "selector": "a[onclick*='updateConsentUi\",2'], a[onclick*='updateConsentUi\\',2']"
              },
              "type": "click"
            },
            {
              "consents": [
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Information storage and access",
                            "Opbevaring af og adgang til oplysninger"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-publisher-purposes-table .qc-cmp-purpose-info"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle.qc-cmp-toggle-on"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Information storage and access",
                            "Opbevaring af og adgang til oplysninger"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-publisher-purposes-table .qc-cmp-purpose-info"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle"
                    },
                    "type": "click"
                  },
                  "type": "D"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Ad selection, delivery, reporting",
                            "Annoncevalg, levering og rapportering"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-publisher-purposes-table .qc-cmp-purpose-info"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle.qc-cmp-toggle-on"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Ad selection, delivery, reporting",
                            "Annoncevalg, levering og rapportering"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-publisher-purposes-table .qc-cmp-purpose-info"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Content selection, delivery, reporting",
                            "Indholdsvalg, levering og rapportering"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-publisher-purposes-table .qc-cmp-purpose-info"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle.qc-cmp-toggle-on"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Content selection, delivery, reporting",
                            "Indholdsvalg, levering og rapportering"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-publisher-purposes-table .qc-cmp-purpose-info"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle"
                    },
                    "type": "click"
                  },
                  "type": "E"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Personalisation",
                            "Personalisering"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-publisher-purposes-table .qc-cmp-purpose-info"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle.qc-cmp-toggle-on"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Personalisation",
                            "Personalisering"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-publisher-purposes-table .qc-cmp-purpose-info"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle"
                    },
                    "type": "click"
                  },
                  "type": "E"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Measurement",
                            "Måling"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-publisher-purposes-table .qc-cmp-purpose-info"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle.qc-cmp-toggle-on"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Measurement",
                            "Måling"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-publisher-purposes-table .qc-cmp-purpose-info"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle"
                    },
                    "type": "click"
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Information storage and access",
                            "Opbevaring af og adgang til oplysninger"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-vendors-purposes-table .qc-cmp-purpose-info, .qc-cmp-vendors-purposes-table .qc-cmp-purpose-infoEDIT"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle.qc-cmp-toggle-on"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Information storage and access",
                            "Opbevaring af og adgang til oplysninger"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-vendors-purposes-table .qc-cmp-purpose-info, .qc-cmp-vendors-purposes-table .qc-cmp-purpose-infoEDIT"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle"
                    },
                    "type": "click"
                  },
                  "type": "D"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Personalisation",
                            "Personalisering"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-vendors-purposes-table .qc-cmp-purpose-info, .qc-cmp-vendors-purposes-table .qc-cmp-purpose-infoEDIT"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle.qc-cmp-toggle-on"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Personalisation",
                            "Personalisering"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-vendors-purposes-table .qc-cmp-purpose-info, .qc-cmp-vendors-purposes-table .qc-cmp-purpose-infoEDIT"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle"
                    },
                    "type": "click"
                  },
                  "type": "E"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Content selection, delivery, reporting",
                            "Indholdsvalg, levering og rapportering"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-vendors-purposes-table .qc-cmp-purpose-info, .qc-cmp-vendors-purposes-table .qc-cmp-purpose-infoEDIT"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle.qc-cmp-toggle-on"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Content selection, delivery, reporting",
                            "Indholdsvalg, levering og rapportering"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-vendors-purposes-table .qc-cmp-purpose-info, .qc-cmp-vendors-purposes-table .qc-cmp-purpose-infoEDIT"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle"
                    },
                    "type": "click"
                  },
                  "type": "E"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Ad selection, delivery, reporting",
                            "Annoncevalg, levering og rapportering"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-vendors-purposes-table .qc-cmp-purpose-info, .qc-cmp-vendors-purposes-table .qc-cmp-purpose-infoEDIT"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle.qc-cmp-toggle-on"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Ad selection, delivery, reporting",
                            "Annoncevalg, levering og rapportering"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-vendors-purposes-table .qc-cmp-purpose-info, .qc-cmp-vendors-purposes-table .qc-cmp-purpose-infoEDIT"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Measurement",
                            "Måling"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-vendors-purposes-table .qc-cmp-purpose-info, .qc-cmp-vendors-purposes-table .qc-cmp-purpose-infoEDIT"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle.qc-cmp-toggle-on"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Measurement",
                            "Måling"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-vendors-purposes-table .qc-cmp-purpose-info, .qc-cmp-vendors-purposes-table .qc-cmp-purpose-infoEDIT"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle"
                    },
                    "type": "click"
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Google"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-google-purposes-table .qc-cmp-purpose-info, .qc-cmp-google-purposes-table .qc-cmp-purpose-infoEDIT"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle.qc-cmp-toggle-on"
                    },
                    "type": "css"
                  },
                  "toggleAction": {
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "h4",
                          "textFilter": [
                            "Google"
                          ]
                        }
                      },
                      "selector": ".qc-cmp-google-purposes-table .qc-cmp-purpose-info, .qc-cmp-google-purposes-table .qc-cmp-purpose-infoEDIT"
                    },
                    "target": {
                      "selector": ".qc-cmp-toggle"
                    },
                    "type": "click"
                  },
                  "type": "F"
                }
              ],
              "type": "consent"
            }
          ],
          "type": "list"
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "target": {
            "selector": ".qc-cmp-save-and-exit"
          },
          "type": "click"
        },
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "target": {
            "selector": ".qc-cmp-ui-container"
          },
          "type": "hide"
        },
        "name": "HIDE_CMP"
      }
    ]
  },
  "quantcast2": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[data-tracking-opt-in-overlay]"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[data-tracking-opt-in-overlay] [data-tracking-opt-in-learn-more]"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": "[data-tracking-opt-in-overlay] [data-tracking-opt-in-learn-more]"
              }
            },
            {
              "type": "wait",
              "waitTime": 500
            },
            {
              "type": "multiclick",
              "target": {
                "selector": "._1hNWKDVJf2Z0Wsp4jQFbmV"
              }
            }
          ]
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": "input"
                  }
                },
                "selector": ":scope > div"
              },
              "parent": {
                "childFilter": {
                  "target": {
                    "selector": "input"
                  }
                },
                "selector": "[data-tracking-opt-in-overlay] > div > div"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "div",
                      "textFilter": [
                        "Information storage and access",
                        "Opbevare og/eller tilgå oplysninger på en enhed"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "label"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "div",
                      "textFilter": [
                        "Personalization",
                        "Vælge tilpassede annoncer",
                        "Oprette en tilpasset annonceprofil"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "label"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "div",
                      "textFilter": [
                        "Ad selection, delivery, reporting",
                        "Vælge basisannoncer",
                        "Måle annonceeffektivitet",
                        "Anvende markedsundersøgelser til at generere målgruppeindsigter"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "label"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "div",
                      "textFilter": [
                        "Content selection, delivery, reporting",
                        "Oprette en tilpasset indholdsprofil",
                        "Vælge tilpasset indhold",
                        "Content personalization"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "label"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "div",
                      "textFilter": [
                        "Measurement",
                        "Måle indholdseffektivitet",
                        "Udvikle og forbedre produkter",
                        "Aktivt scanne enhedskarakteristika til identifikation"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "label"
                            }
                          },
                          "type": "B"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "div",
                      "textFilter": [
                        "Other Partners",
                        "Bruge præcise geoplaceringsoplysninger"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "label"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[data-tracking-opt-in-overlay] [data-tracking-opt-in-save]"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "quantcast2b": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".qc-cmp2-container"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".qc-cmp2-container #qc-cmp2-ui",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "waitcss",
              "target": {
                "selector": ".qc-cmp2-summary-buttons button[mode=\"secondary\"]"
              },
              "retries": 10,
              "waitTime": 250
            },
            {
              "type": "click",
              "target": {
                "selector": ".qc-cmp2-summary-buttons button[mode=\"secondary\"]",
                "textFilter": [
                  "Indstillinger",
                  "MORE OPTIONS",
                  "FLERE MULIGHEDER",
                  "Paramétrer les cookies",
                  "PIÙ OPZIONI",
                  "ΠΕΡΙΣΣΟΤΕΡΕΣ ΕΠΙΛΟΓΕΣ"
                ]
              }
            }
          ]
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "selector": ".qc-cmp2-list-item"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ":scope > button"
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".qc-cmp2-list-item-title",
                      "textFilter": [
                        "Store and/or access information on a device",
                        "Use precise geolocation data",
                        "Actively scan device characteristics for identification",
                        "Præcise geoplaceringsoplysninger og identifikation gennem enhedsscanning",
                        "Opbevare og/eller tilgå oplysninger på en enhed",
                        "Precise geolocation data, and identification through device scanning",
                        "Bruge præcise geoplaceringsoplysninger",
                        "Aktivt scanne enhedskarakteristika til identifikation",
                        "Stocker et/ou accéder à des informations sur un terminal",
                        "Utiliser des données de géolocalisation précises",
                        "Analyser activement les caractéristiques du terminal pour l’identification",
                        "Archiviare e/o accedere a informazioni su un dispositivo",
                        "Utilizzare dati di geolocalizzazione precisi",
                        "Scansione attiva delle caratteristiche del dispositivo ai fini dell’identificazione",
                        "Αποθήκευση ή/και πρόσβαση στα δεδομένα μιας συσκευής",
                        "Χρήση ακριβών δεδομένων γεω-εντοπισμού",
                        "Ακριβής σάρωση χαρακτηριστικών συσκευής για αναγνώριση ταυτότητας"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": "button[role='switch'][aria-checked='true']"
                            },
                            "parent": {
                              "selector": ".qc-cmp2-toggle-switch:nth-of-type(1)"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".qc-cmp2-toggle-switch:nth-of-type(1) button"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".qc-cmp2-list-item-title",
                      "textFilter": [
                        "Create a personalised ads profile",
                        "Select personalised ads",
                        "Select basic ads",
                        "Measure ad performance",
                        "Apply market research to generate audience insights",
                        "Tilpassede annoncer og tilpasset indhold, annonce- og indholdsmåling, målgruppeindsigter og produktudvikling",
                        "Personalised ads and content, ad and content measurement, audience insights and product development",
                        "Vælge basisannoncer",
                        "Oprette en tilpasset annonceprofil",
                        "Vælge tilpassede annoncer",
                        "Måle annonceeffektivitet",
                        "Anvende markedsundersøgelser til at generere målgruppeindsigter",
                        "Sélectionner des publicités standard",
                        "Créer un profil personnalisé de publicités",
                        "Sélectionner des publicités personnalisées",
                        "Mesurer la performance des publicités",
                        "Selezionare annunci basici (basic ads)",
                        "Creare un profilo di annunci personalizzati",
                        "Selezionare annunci personalizzati",
                        "Valutare le performance degli annunci",
                        "Επιλογή βασικών διαφημίσεων",
                        "Δημιουργία προφίλ εξατομικευμένων διαφημίσεων",
                        "Επιλογή εξατομικευμένων διαφημίσεων",
                        "Μέτρηση απόδοσης διαφημίσεων"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": "button[role='switch'][aria-checked='true']"
                            },
                            "parent": {
                              "selector": ".qc-cmp2-toggle-switch:nth-of-type(1)"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".qc-cmp2-toggle-switch:nth-of-type(1) button"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".qc-cmp2-list-item-title",
                      "textFilter": [
                        "Create a personalised content profile",
                        "Select personalised content",
                        "Measure content performance",
                        "Oprette en tilpasset indholdsprofil",
                        "Vælge tilpasset indhold",
                        "Måle indholdseffektivitet",
                        "Créer un profil pour afficher un contenu personnalisé",
                        "Sélectionner du contenu personnalisé",
                        "Mesurer la performance du contenu",
                        "Exploiter des études de marché afin de générer des données d’audience",
                        "Creare un profilo di contenuto personalizzato",
                        "Selezionare contenuti personalizzati",
                        "Valutare le performance dei contenuti",
                        "Δημιουργία προφίλ εξατομικευμένου περιεχομένου",
                        "Επιλογή εξατομικευμένου περιεχομένου",
                        "Μέτρηση απόδοσης περιεχομένου"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": "button[role='switch'][aria-checked='true']"
                            },
                            "parent": {
                              "selector": ".qc-cmp2-toggle-switch:nth-of-type(1)"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".qc-cmp2-toggle-switch:nth-of-type(1) button"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".qc-cmp2-list-item-title",
                      "textFilter": [
                        "Applicare ricerche di mercato per generare approfondimenti sul pubblico",
                        "Πραγματοποίηση έρευνας αγοράς και άντληση πληροφοριών για το κοινό"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": "button[role='switch'][aria-checked='true']"
                            },
                            "parent": {
                              "selector": ".qc-cmp2-toggle-switch:nth-of-type(1)"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".qc-cmp2-toggle-switch:nth-of-type(1) button"
                            }
                          },
                          "type": "B"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".qc-cmp2-list-item-title",
                      "textFilter": [
                        "Develop and improve products",
                        "Udvikle og forbedre produkter",
                        "Développer et améliorer les produits",
                        "Sviluppare e perfezionare i prodotti",
                        "Δημιουργία και βελτίωση προϊόντων"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": "button[role='switch'][aria-checked='true']"
                            },
                            "parent": {
                              "selector": ".qc-cmp2-toggle-switch:nth-of-type(1)"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".qc-cmp2-toggle-switch:nth-of-type(1) button"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              "type": "click",
              "target": {
                "selector": ".qc-cmp2-footer-links button",
                "textFilter": [
                  "Legitime interesser",
                  "LEGITIMATE INTEREST",
                  "ΘΕΜΙΤΟ ΕΝΔΙΑΦΕΡΟΝ"
                ]
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "trueAction": {
                    "type": "click",
                    "target": {
                      "selector": ".qc-cmp2-container button",
                      "textFilter": [
                        "ACCEPT ALL",
                        "Fjern indsigelse",
                        "ΑΠΟΔΕΧΟΜΑΙ ΤΑ ΠΑΝΤΑ"
                      ]
                    }
                  },
                  "falseAction": {
                    "type": "click",
                    "target": {
                      "selector": ".qc-cmp2-container button",
                      "textFilter": [
                        "OBJECT ALL",
                        "Gør indsigelse mod alt",
                        "ΑΠΟΡΡΙΠΤΩ ΤΑ ΠΑΝΤΑ"
                      ]
                    }
                  },
                  "type": "X"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".qc-cmp2-footer button[mode=\"primary\"]"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": ".qc-cmp-cleanslate"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "saturn.de": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#mms-consent-portal-container"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".sc-g0yhcr-0",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": ".sc-g0yhcr-0.fAIKwq"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": ".sc-g0yhcr-7.jnrwjZ"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "ifcss",
                "target": {
                  "selector": "span",
                  "textFilter": [
                    "Komfort"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "A"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "span",
                  "textFilter": [
                    "Marketing"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[data-test='pwa-consent-layer-save-settings']"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "sfbx_appconsent": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".frame-root .frame-content .banner .button__openPrivacyCenter"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".frame-root .frame-content .banner .button__openPrivacyCenter"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".frame-root .frame-content .banner .button__openPrivacyCenter"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "selector": ".frame-root .frame-content .consentableItem"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "trueAction": {
                          "type": "click",
                          "target": {
                            "selector": ".switch__allow"
                          }
                        },
                        "falseAction": {
                          "type": "click",
                          "target": {
                            "selector": ".switch__disallow"
                          }
                        },
                        "type": "X"
                      }
                    ]
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "article",
                      "textFilter": [
                        "Store and/or access information on a device",
                        "Stocker et/ou accéder à des informations sur un terminal"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": ".consentableItem__switchGroup--allowed"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".consentableItem__switchGroup"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "article",
                      "textFilter": "Personalised ads"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": ".consentableItem__switchGroup--allowed"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".consentableItem__switchGroup"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "article",
                      "textFilter": "Personalised content"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": ".consentableItem__switchGroup--allowed"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".consentableItem__switchGroup"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "article",
                      "textFilter": "Ad measurement, and audience insights"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": ".consentableItem__switchGroup--allowed"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".consentableItem__switchGroup"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "article",
                      "textFilter": [
                        "Content measurement, and product development",
                        "Publicités et contenu personnalisés, mesure de performance des publicités et du contenu, données d’audience et développement de produit"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": ".consentableItem__switchGroup--allowed"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".consentableItem__switchGroup"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "article",
                      "textFilter": "Use precise geolocation data"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": ".consentableItem__switchGroup--allowed"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".consentableItem__switchGroup"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "article",
                      "textFilter": "Actively scan device characteristics for identification"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "selector": ".consentableItem__switchGroup--allowed"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": ".consentableItem__switchGroup"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": ".frame-root .frame-content button",
                "textFilter": [
                  "Save",
                  "Enregistrer"
                ]
              }
            },
            {
              "type": "click",
              "target": {
                "selector": ".frame-root .frame-content button",
                "textFilter": [
                  "Close",
                  "Fermer"
                ]
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "SFR": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "parent": null,
            "target": {
              "selector": "#CkC"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "parent": null,
            "target": {
              "displayFilter": true,
              "selector": "#CkC"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "parent": null,
          "target": {
            "selector": "#CkC .P",
            "textFilter": "Je paramètre"
          },
          "type": "click"
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "actions": [
            {
              "retries": 50,
              "target": {
                "selector": "#ac_notice._acc_visible"
              },
              "type": "waitcss",
              "waitTime": 10
            },
            {
              "consents": [
                {
                  "description": "Information storage and access",
                  "falseAction": {
                    "target": {
                      "selector": "#R3V1"
                    },
                    "type": "click"
                  },
                  "trueAction": {
                    "target": {
                      "selector": "#A3V1"
                    },
                    "type": "click"
                  },
                  "type": "D"
                },
                {
                  "description": "Preferences and Functionality",
                  "falseAction": {
                    "target": {
                      "selector": "#R3V2"
                    },
                    "type": "click"
                  },
                  "trueAction": {
                    "target": {
                      "selector": "#A3V2"
                    },
                    "type": "click"
                  },
                  "type": "A"
                },
                {
                  "description": "Ad selection, delivery, reporting",
                  "falseAction": {
                    "target": {
                      "selector": "#R3V4"
                    },
                    "type": "click"
                  },
                  "trueAction": {
                    "target": {
                      "selector": "#A3V4"
                    },
                    "type": "click"
                  },
                  "type": "B"
                },
                {
                  "description": "Content selection, delivery, reporting",
                  "falseAction": {
                    "target": {
                      "selector": "#R3V8"
                    },
                    "type": "click"
                  },
                  "trueAction": {
                    "target": {
                      "selector": "#A3V8"
                    },
                    "type": "click"
                  },
                  "type": "E"
                },
                {
                  "description": "Measurement",
                  "falseAction": {
                    "target": {
                      "selector": "#R3V16"
                    },
                    "type": "click"
                  },
                  "trueAction": {
                    "target": {
                      "selector": "#A3V16"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "description": "Statistiques",
                  "falseAction": {
                    "target": {
                      "selector": "#R2V1"
                    },
                    "type": "click"
                  },
                  "trueAction": {
                    "target": {
                      "selector": "#A2V1"
                    },
                    "type": "click"
                  },
                  "type": "X"
                },
                {
                  "description": "Personalisation de l'expérience SFR",
                  "falseAction": {
                    "target": {
                      "selector": "#R2V2"
                    },
                    "type": "click"
                  },
                  "trueAction": {
                    "target": {
                      "selector": "#A2V2"
                    },
                    "type": "click"
                  },
                  "type": "X"
                },
                {
                  "description": "Publicitée ciblée",
                  "falseAction": {
                    "target": {
                      "selector": "#R2V4"
                    },
                    "type": "click"
                  },
                  "trueAction": {
                    "target": {
                      "selector": "#A2V4"
                    },
                    "type": "click"
                  },
                  "type": "X"
                }
              ],
              "type": "consent"
            }
          ],
          "type": "list"
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "parent": null,
          "target": {
            "selector": "#eTcP .P",
            "textFilter": "Valider"
          },
          "type": "click"
        },
        "name": "SAVE_CONSENT"
      }
    ]
  },
  "sharethis": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "parent": null,
            "target": {
              "selector": ".app_gdpr"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "parent": null,
            "target": {
              "selector": ".app_gdpr .popup_popup"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "actions": [
            {
              "parent": null,
              "target": {
                "selector": ".app_gdpr .intro_showPurposes"
              },
              "type": "click"
            }
          ],
          "type": "list"
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "consents": [
            {
              "description": "Vendor - Information storage and access",
              "matcher": {
                "parent": {
                  "selector": ".purposes_purposes",
                  "textFilter": "Information storage and access"
                },
                "target": {
                  "selector": ".switch_switch input"
                },
                "type": "checkbox"
              },
              "toggleAction": {
                "parent": {
                  "selector": ".purposes_purposes",
                  "textFilter": "Information storage and access"
                },
                "target": {
                  "selector": ".switch_switch"
                },
                "type": "click"
              },
              "type": "D"
            },
            {
              "description": "Vendor - Ad selection, delivery, reporting",
              "matcher": {
                "parent": {
                  "selector": ".purposes_purposes",
                  "textFilter": "Ad selection, delivery, reporting"
                },
                "target": {
                  "selector": ".switch_switch input"
                },
                "type": "checkbox"
              },
              "toggleAction": {
                "parent": {
                  "selector": ".purposes_purposes",
                  "textFilter": "Ad selection, delivery, reporting"
                },
                "target": {
                  "selector": ".switch_switch"
                },
                "type": "click"
              },
              "type": "F"
            },
            {
              "description": "Vendor - Personalisation",
              "matcher": {
                "parent": {
                  "selector": ".purposes_purposes",
                  "textFilter": "Personalisation"
                },
                "target": {
                  "selector": ".switch_switch input"
                },
                "type": "checkbox"
              },
              "toggleAction": {
                "parent": {
                  "selector": ".purposes_purposes",
                  "textFilter": "Personalisation"
                },
                "target": {
                  "selector": ".switch_switch"
                },
                "type": "click"
              },
              "type": "E"
            },
            {
              "description": "Vendor - Content selection, delivery, reporting",
              "matcher": {
                "parent": {
                  "selector": ".purposes_purposes",
                  "textFilter": "Content selection, delivery, reporting"
                },
                "target": {
                  "selector": ".switch_switch input"
                },
                "type": "checkbox"
              },
              "toggleAction": {
                "parent": {
                  "selector": ".purposes_purposes",
                  "textFilter": "Content selection, delivery, reporting"
                },
                "target": {
                  "selector": ".switch_switch"
                },
                "type": "click"
              },
              "type": "E"
            },
            {
              "description": "Vendor - Measurement",
              "matcher": {
                "parent": {
                  "selector": ".purposes_purposes",
                  "textFilter": "Measurement"
                },
                "target": {
                  "selector": ".switch_switch input"
                },
                "type": "checkbox"
              },
              "toggleAction": {
                "parent": {
                  "selector": ".purposes_purposes",
                  "textFilter": "Measurement"
                },
                "target": {
                  "selector": ".switch_switch"
                },
                "type": "click"
              },
              "type": "B"
            }
          ],
          "type": "consent"
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "parent": null,
          "target": {
            "selector": ".app_gdpr .details_save"
          },
          "type": "click"
        },
        "name": "SAVE_CONSENT"
      }
    ]
  },
  "Sirdata": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#sd-cmp"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#sd-cmp"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "selector": ".sd-cmp-2riLW"
              },
              "action": {
                "type": "hide",
                "target": {
                  "selector": ":scope"
                }
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".sd-cmp-2riLW"
              },
              "forceHide": true
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "ifcss",
              "target": {
                "selector": "span[class^=\"sd-cmp\"]",
                "textFilter": [
                  "Set your choices",
                  "Paramétrer vos choix"
                ]
              },
              "trueAction": {
                "type": "click",
                "target": {
                  "selector": "span[class^=\"sd-cmp\"]",
                  "textFilter": [
                    "Set your choices",
                    "Paramétrer vos choix"
                  ]
                }
              },
              "falseAction": {
                "type": "click",
                "target": {
                  "selector": ".sd-cmp-16t61.sd-cmp-2JYyd.sd-cmp-18g3C"
                }
              }
            },
            {
              "type": "waitcss",
              "target": {
                "selector": ".sd-cmp-RkFPb"
              },
              "retries": 10,
              "waitTime": 250
            }
          ]
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "runrooted",
              "target": {
                "selector": "#sd-cmp"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "foreach",
                    "target": {
                      "selector": ".sd-cmp-RkFPb"
                    },
                    "action": {
                      "type": "foreach",
                      "target": {
                        "selector": "input"
                      },
                      "action": {
                        "type": "consent",
                        "consents": [
                          {
                            "matcher": {
                              "type": "checkbox",
                              "target": {
                                "selector": ":scope"
                              }
                            },
                            "toggleAction": {
                              "type": "click",
                              "target": {
                                "selector": ":scope"
                              }
                            },
                            "type": "X"
                          }
                        ]
                      }
                    }
                  },
                  {
                    "type": "foreach",
                    "target": {
                      "selector": ".sd-cmp-RkFPb"
                    },
                    "action": {
                      "type": "list",
                      "actions": [
                        {
                          "type": "ifcss",
                          "target": {
                            "selector": ".sd-cmp-vi0HZ",
                            "textFilter": [
                              "Personalized content",
                              "Create a personalised content profile",
                              "Select personalised content",
                              "Measure content performance",
                              "Contenu personnalisé",
                              "Mesurer la performance du contenu"
                            ]
                          },
                          "trueAction": {
                            "type": "foreach",
                            "target": {
                              "selector": "input"
                            },
                            "action": {
                              "type": "consent",
                              "consents": [
                                {
                                  "matcher": {
                                    "type": "checkbox",
                                    "target": {
                                      "selector": ":scope"
                                    }
                                  },
                                  "toggleAction": {
                                    "type": "click",
                                    "target": {
                                      "selector": ":scope"
                                    }
                                  },
                                  "type": "E"
                                }
                              ]
                            }
                          }
                        },
                        {
                          "type": "ifcss",
                          "target": {
                            "selector": ".sd-cmp-vi0HZ",
                            "textFilter": [
                              "Non-personalized advertising",
                              "Personalized advertising",
                              "Select personalised ads",
                              "Create a personalised ads profile",
                              "Select basic ads",
                              "Measure ad performance",
                              "Publicité standard",
                              "Publicité personnalisée",
                              "Sélectionner des publicités standard",
                              "Créer un profil personnalisé de publicités",
                              "Sélectionner des publicités personnalisées",
                              "Mesurer la performance des publicités"
                            ]
                          },
                          "trueAction": {
                            "type": "foreach",
                            "target": {
                              "selector": "input"
                            },
                            "action": {
                              "type": "consent",
                              "consents": [
                                {
                                  "matcher": {
                                    "type": "checkbox",
                                    "target": {
                                      "selector": ":scope"
                                    }
                                  },
                                  "toggleAction": {
                                    "type": "click",
                                    "target": {
                                      "selector": ":scope"
                                    }
                                  },
                                  "type": "F"
                                }
                              ]
                            }
                          }
                        },
                        {
                          "type": "ifcss",
                          "target": {
                            "selector": ".sd-cmp-vi0HZ",
                            "textFilter": [
                              "Audience measurement",
                              "Apply market research to generate audience insights",
                              "Develop and improve products",
                              "Mesure d'audience",
                              "Exploiter des études de marché afin de générer des données d’audience",
                              "Développer et améliorer les produits"
                            ]
                          },
                          "trueAction": {
                            "type": "foreach",
                            "target": {
                              "selector": "input"
                            },
                            "action": {
                              "type": "consent",
                              "consents": [
                                {
                                  "matcher": {
                                    "type": "checkbox",
                                    "target": {
                                      "selector": ":scope"
                                    }
                                  },
                                  "toggleAction": {
                                    "type": "click",
                                    "target": {
                                      "selector": ":scope"
                                    }
                                  },
                                  "type": "B"
                                }
                              ]
                            }
                          }
                        },
                        {
                          "type": "ifcss",
                          "target": {
                            "selector": ".sd-cmp-vi0HZ",
                            "textFilter": [
                              "Store and/or access information on a device",
                              "Stocker et/ou accéder à des informations sur un terminal"
                            ]
                          },
                          "trueAction": {
                            "type": "foreach",
                            "target": {
                              "selector": "input"
                            },
                            "action": {
                              "type": "consent",
                              "consents": [
                                {
                                  "matcher": {
                                    "type": "checkbox",
                                    "target": {
                                      "selector": ":scope"
                                    }
                                  },
                                  "toggleAction": {
                                    "type": "click",
                                    "target": {
                                      "selector": ":scope"
                                    }
                                  },
                                  "type": "D"
                                }
                              ]
                            }
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "button[class^=\"sd-cmp\"]",
            "textFilter": [
              "Save",
              "Enregistrer"
            ]
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "snigel": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#snigel-cmp-framework"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#snigel-cmp-framework",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "#snigel-cmp-framework"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#sn-b-custom"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "selector": ".sn-collapsible"
              },
              "parent": {
                "selector": ".purposes"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "h3",
                      "textFilter": [
                        "Personalisierte Anzeigen und Inhalte, Anzeigen- und Inhaltsmessungen, Erkenntnisse über Zielgruppen und Produktentwicklungen"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "h3",
                      "textFilter": [
                        "Informationen auf einem Gerät speichern und/oder abrufen",
                        "Geräteeigenschaften zur Identifikation aktiv abfragen"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "h3",
                      "textFilter": [
                        "Genaue Standortdaten verwenden"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "h3"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "B"
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              "type": "click",
              "target": {
                "selector": "[data-attr='vendor'].sn-header-selector"
              }
            },
            {
              "type": "ifallowall",
              "trueAction": {
                "type": "click",
                "target": {
                  "selector": "#enable_all_v"
                }
              },
              "falseAction": {
                "type": "click",
                "target": {
                  "selector": "#disable_all_v"
                }
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#sn-b-save"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "suchenmobile.de": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#consentPageContentHolder"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#consentPageContentHolder"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "selector": "._1qQsRL3d"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": "#purpose-1-toggle"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": "#purpose-1-toggle"
                          }
                        },
                        "type": "D"
                      }
                    ]
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": "#purpose-5-toggle, #purpose-6-toggle, #purpose-8-toggle, #purpose-9-toggle, #purpose-10-toggle"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": "#purpose-5-toggle, #purpose-6-toggle, #purpose-8-toggle, #purpose-9-toggle, #purpose-10-toggle"
                          }
                        },
                        "type": "E"
                      },
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": "#purpose-9-li-toggle, #purpose-10-li-toggle"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": "#purpose-9-li-toggle, #purpose-10-li-toggle"
                          }
                        },
                        "type": "E"
                      }
                    ]
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": "#purpose-1-toggle"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": "#purpose-1-toggle"
                          }
                        },
                        "type": "B"
                      }
                    ]
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": "#purpose-2-toggle, #purpose-3-toggle, #purpose-4-toggle, #purpose-7-toggle, #purpose-29-toggle, #purpose-31-toggle, #purpose-25-toggle"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": "#purpose-2-toggle, #purpose-3-toggle, #purpose-4-toggle, #purpose-7-toggle, #purpose-29-toggle, #purpose-31-toggle, #purpose-25-toggle"
                          }
                        },
                        "type": "F"
                      },
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": "#purpose-2-li-toggle, #purpose-7-li-toggle"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": "#purpose-2-li-toggle, #purpose-7-li-toggle"
                          }
                        },
                        "type": "F"
                      }
                    ]
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": "#purpose-24-toggle, #purpose-26-toggle, #purpose-30-toggle"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": "#purpose-24-toggle, #purpose-26-toggle, #purpose-30-toggle"
                          }
                        },
                        "type": "X"
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#agree-bottom"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "opensuchenmobile.de": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#mde-consent-modal-container"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#mde-consent-modal-container",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "ifallowall",
          "trueAction": {
            "type": "click",
            "target": {
              "selector": ".mde-consent-accept-btn"
            }
          },
          "falseAction": {
            "type": "click",
            "target": {
              "selector": ".sc-bczRLJ.sc-gsnTZi.iBneUr.hteZdj"
            }
          }
        },
        "name": "UTILITY"
      }
    ]
  },
  "sourcepointframe": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "target": {
              "selector": "html.w-mod-js .privacy-container"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "target": {
              "selector": "html.w-mod-js .privacy-container"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "actions": [
            {
              "falseAction": {
                "consents": [
                  {
                    "matcher": {
                      "target": {
                        "selector": ".priv-purpose-container a#personalisation[value='ON']"
                      },
                      "type": "css"
                    },
                    "toggleAction": {
                      "target": {
                        "selector": ".priv-purpose-container a#personalisation"
                      },
                      "type": "click"
                    },
                    "type": "E"
                  },
                  {
                    "matcher": {
                      "target": {
                        "selector": ".priv-purpose-container a#ad-selection-delivery-reporting[value='ON']"
                      },
                      "type": "css"
                    },
                    "toggleAction": {
                      "target": {
                        "selector": ".priv-purpose-container a#ad-selection-delivery-reporting"
                      },
                      "type": "click"
                    },
                    "type": "F"
                  },
                  {
                    "matcher": {
                      "target": {
                        "selector": ".priv-purpose-container a#measurement[value='ON']"
                      },
                      "type": "css"
                    },
                    "toggleAction": {
                      "target": {
                        "selector": ".priv-purpose-container a#measurement"
                      },
                      "type": "click"
                    },
                    "type": "B"
                  },
                  {
                    "matcher": {
                      "target": {
                        "selector": ".priv-purpose-container a#information-storage-andaaccess[value='ON']"
                      },
                      "type": "css"
                    },
                    "toggleAction": {
                      "target": {
                        "selector": ".priv-purpose-container a#information-storage-andaaccess"
                      },
                      "type": "click"
                    },
                    "type": "D"
                  },
                  {
                    "matcher": {
                      "target": {
                        "selector": ".priv-purpose-container a#content-sselection-delivery-reporting[value='ON']"
                      },
                      "type": "css"
                    },
                    "toggleAction": {
                      "target": {
                        "selector": ".priv-purpose-container a#content-sselection-delivery-reporting"
                      },
                      "type": "click"
                    },
                    "type": "E"
                  }
                ],
                "type": "consent"
              },
              "target": {
                "selector": ".priv-vendor-block"
              },
              "trueAction": {
                "action": {
                  "actions": [
                    {
                      "target": {
                        "selector": ".purpose-title",
                        "textFilter": [
                          "Opbevaring af og adgang til oplysninger",
                          "Information storage and access"
                        ]
                      },
                      "trueAction": {
                        "falseAction": {
                          "consents": [
                            {
                              "falseAction": {
                                "parent": {
                                  "selector": "a.neutral"
                                },
                                "target": {
                                  "selector": "div",
                                  "textFilter": "off"
                                },
                                "type": "click"
                              },
                              "matcher": {
                                "target": {
                                  "selector": "a.neutral.on"
                                },
                                "type": "css"
                              },
                              "trueAction": {
                                "parent": {
                                  "selector": "a.neutral"
                                },
                                "target": {
                                  "selector": "div",
                                  "textFilter": "on"
                                },
                                "type": "click"
                              },
                              "type": "D"
                            }
                          ],
                          "type": "consent"
                        },
                        "target": {
                          "selector": "a.switch-bg"
                        },
                        "trueAction": {
                          "consents": [
                            {
                              "matcher": {
                                "target": {
                                  "selector": "a.switch-bg.on"
                                },
                                "type": "css"
                              },
                              "toggleAction": {
                                "target": {
                                  "selector": "a.switch-bg"
                                },
                                "type": "click"
                              },
                              "type": "D"
                            }
                          ],
                          "type": "consent"
                        },
                        "type": "ifcss"
                      },
                      "type": "ifcss"
                    },
                    {
                      "target": {
                        "selector": ".purpose-title",
                        "textFilter": [
                          "Personalisering",
                          "Personalisation"
                        ]
                      },
                      "trueAction": {
                        "falseAction": {
                          "consents": [
                            {
                              "falseAction": {
                                "parent": {
                                  "selector": "a.neutral"
                                },
                                "target": {
                                  "selector": "div",
                                  "textFilter": "off"
                                },
                                "type": "click"
                              },
                              "matcher": {
                                "target": {
                                  "selector": "a.neutral.on"
                                },
                                "type": "css"
                              },
                              "trueAction": {
                                "parent": {
                                  "selector": "a.neutral"
                                },
                                "target": {
                                  "selector": "div",
                                  "textFilter": "on"
                                },
                                "type": "click"
                              },
                              "type": "F"
                            }
                          ],
                          "type": "consent"
                        },
                        "target": {
                          "selector": "a.switch-bg"
                        },
                        "trueAction": {
                          "consents": [
                            {
                              "matcher": {
                                "target": {
                                  "selector": "a.switch-bg.on"
                                },
                                "type": "css"
                              },
                              "toggleAction": {
                                "target": {
                                  "selector": "a.switch-bg"
                                },
                                "type": "click"
                              },
                              "type": "F"
                            }
                          ],
                          "type": "consent"
                        },
                        "type": "ifcss"
                      },
                      "type": "ifcss"
                    },
                    {
                      "target": {
                        "selector": ".purpose-title",
                        "textFilter": [
                          "Annoncevalg, levering og rapportering",
                          "Ad selection, delivery, reporting"
                        ]
                      },
                      "trueAction": {
                        "falseAction": {
                          "consents": [
                            {
                              "falseAction": {
                                "parent": {
                                  "selector": "a.neutral"
                                },
                                "target": {
                                  "selector": "div",
                                  "textFilter": "off"
                                },
                                "type": "click"
                              },
                              "matcher": {
                                "target": {
                                  "selector": "a.neutral.on"
                                },
                                "type": "css"
                              },
                              "trueAction": {
                                "parent": {
                                  "selector": "a.neutral"
                                },
                                "target": {
                                  "selector": "div",
                                  "textFilter": "on"
                                },
                                "type": "click"
                              },
                              "type": "F"
                            }
                          ],
                          "type": "consent"
                        },
                        "target": {
                          "selector": "a.switch-bg"
                        },
                        "trueAction": {
                          "consents": [
                            {
                              "matcher": {
                                "target": {
                                  "selector": "a.switch-bg.on"
                                },
                                "type": "css"
                              },
                              "toggleAction": {
                                "target": {
                                  "selector": "a.switch-bg"
                                },
                                "type": "click"
                              },
                              "type": "F"
                            }
                          ],
                          "type": "consent"
                        },
                        "type": "ifcss"
                      },
                      "type": "ifcss"
                    },
                    {
                      "target": {
                        "selector": ".purpose-title",
                        "textFilter": [
                          "Måling",
                          "Measurement"
                        ]
                      },
                      "trueAction": {
                        "falseAction": {
                          "consents": [
                            {
                              "falseAction": {
                                "parent": {
                                  "selector": "a.neutral"
                                },
                                "target": {
                                  "selector": "div",
                                  "textFilter": "off"
                                },
                                "type": "click"
                              },
                              "matcher": {
                                "target": {
                                  "selector": "a.neutral.on"
                                },
                                "type": "css"
                              },
                              "trueAction": {
                                "parent": {
                                  "selector": "a.neutral"
                                },
                                "target": {
                                  "selector": "div",
                                  "textFilter": "on"
                                },
                                "type": "click"
                              },
                              "type": "B"
                            }
                          ],
                          "type": "consent"
                        },
                        "target": {
                          "selector": "a.switch-bg"
                        },
                        "trueAction": {
                          "consents": [
                            {
                              "matcher": {
                                "target": {
                                  "selector": "a.switch-bg.on"
                                },
                                "type": "css"
                              },
                              "toggleAction": {
                                "target": {
                                  "selector": "a.switch-bg"
                                },
                                "type": "click"
                              },
                              "type": "B"
                            }
                          ],
                          "type": "consent"
                        },
                        "type": "ifcss"
                      },
                      "type": "ifcss"
                    },
                    {
                      "target": {
                        "selector": ".purpose-title",
                        "textFilter": [
                          "Indholdsvalg, levering og rapportering",
                          "Content selection, delivery, reporting"
                        ]
                      },
                      "trueAction": {
                        "falseAction": {
                          "consents": [
                            {
                              "falseAction": {
                                "parent": {
                                  "selector": "a.neutral"
                                },
                                "target": {
                                  "selector": "div",
                                  "textFilter": "off"
                                },
                                "type": "click"
                              },
                              "matcher": {
                                "target": {
                                  "selector": "a.neutral.on"
                                },
                                "type": "css"
                              },
                              "trueAction": {
                                "parent": {
                                  "selector": "a.neutral"
                                },
                                "target": {
                                  "selector": "div",
                                  "textFilter": "on"
                                },
                                "type": "click"
                              },
                              "type": "E"
                            }
                          ],
                          "type": "consent"
                        },
                        "target": {
                          "selector": "a.switch-bg"
                        },
                        "trueAction": {
                          "consents": [
                            {
                              "matcher": {
                                "target": {
                                  "selector": "a.switch-bg.on"
                                },
                                "type": "css"
                              },
                              "toggleAction": {
                                "target": {
                                  "selector": "a.switch-bg"
                                },
                                "type": "click"
                              },
                              "type": "E"
                            }
                          ],
                          "type": "consent"
                        },
                        "type": "ifcss"
                      },
                      "type": "ifcss"
                    }
                  ],
                  "type": "list"
                },
                "target": {
                  "selector": ".priv-vendor-block .accordian-parent"
                },
                "type": "foreach"
              },
              "type": "ifcss"
            }
          ],
          "type": "list"
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "target": {
            "selector": ".priv-save-btn"
          },
          "type": "click"
        },
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "target": {
            "selector": ".bg-overlay"
          },
          "type": "hide"
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      }
    ]
  },
  "sourcepoint_frame_2022": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".message-container .message.type-modal",
              "iframeFilter": true
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".message-container .message.type-modal",
              "iframeFilter": true,
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".message.type-modal"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".message-overlay"
              },
              "forceHide": true
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "ifcss",
              "target": {
                "selector": "button.message-button",
                "textFilter": [
                  "Manage Cookies",
                  "Customize",
                  "Konfigurieren",
                  "Asetukset"
                ]
              },
              "trueAction": {
                "type": "click",
                "target": {
                  "selector": "button.message-button",
                  "textFilter": [
                    "Manage Cookies",
                    "Customize",
                    "Konfigurieren",
                    "Asetukset"
                  ]
                }
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": "p.message-component a",
                "textFilter": [
                  "Einstellungen anpassen"
                ]
              },
              "trueAction": {
                "type": "click",
                "target": {
                  "selector": "p.message-component a",
                  "textFilter": [
                    "Einstellungen anpassen"
                  ]
                }
              }
            }
          ]
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "ifcss",
          "target": {
            "selector": ".pm-tabs .pm-tab"
          },
          "trueAction": {
            "type": "foreach",
            "target": {
              "selector": ".pm-tabs .pm-tab"
            },
            "action": {
              "type": "ifcss",
              "target": {
                "selector": ":scope",
                "textFilter": [
                  "\"NOT USED ATM\""
                ]
              },
              "falseAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ":scope"
                    }
                  },
                  {
                    "type": "runrooted",
                    "target": {
                      "selector": "body"
                    },
                    "action": {
                      "type": "list",
                      "actions": [
                        {
                          "type": "runmethod",
                          "method": "HANDLE_TAB"
                        },
                        {
                          "type": "ifcss",
                          "target": {
                            "selector": ".pm-type-toggle > div",
                            "textFilter": [
                              "Legitimate Interest"
                            ]
                          },
                          "trueAction": {
                            "type": "list",
                            "actions": [
                              {
                                "type": "click",
                                "target": {
                                  "selector": ".pm-type-toggle > div",
                                  "textFilter": [
                                    "Legitimate Interest"
                                  ]
                                }
                              },
                              {
                                "type": "runmethod",
                                "method": "HANDLE_TAB"
                              }
                            ]
                          }
                        }
                      ]
                    },
                    "ignoreOldRoot": true
                  }
                ]
              }
            }
          },
          "falseAction": {
            "type": "list",
            "actions": [
              {
                "type": "runmethod",
                "method": "HANDLE_TAB"
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": ".pm-type-toggle > div",
                  "textFilter": [
                    "Legitimate Interest"
                  ]
                },
                "trueAction": {
                  "type": "list",
                  "actions": [
                    {
                      "type": "click",
                      "target": {
                        "selector": ".pm-type-toggle > div",
                        "textFilter": [
                          "Legitimate Interest"
                        ]
                      }
                    },
                    {
                      "type": "runmethod",
                      "method": "HANDLE_TAB"
                    }
                  ]
                }
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "button.sp_choice_type_SAVE_AND_EXIT"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "multiclick",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": "[role=\"switch\"]"
                  }
                },
                "selector": ".tcfv2-stack .accordion:not(.active)",
                "childFilterNegate": true
              }
            },
            {
              "type": "wait",
              "waitTime": 250
            },
            {
              "type": "foreach",
              "target": {
                "selector": ".tcfv2-stack"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "foreach",
                    "target": {
                      "selector": ".stack-row"
                    },
                    "action": {
                      "type": "ifcss",
                      "target": {
                        "selector": "span.on"
                      },
                      "trueAction": {
                        "type": "consent",
                        "consents": [
                          {
                            "matcher": {
                              "type": "onoff",
                              "onMatcher": {
                                "target": {
                                  "selector": "button[role=\"switch\"][aria-checked=\"true\"]"
                                }
                              },
                              "offMatcher": {
                                "target": {
                                  "selector": "button[role=\"switch\"][aria-checked=\"false\"]"
                                }
                              }
                            },
                            "trueAction": {
                              "type": "click",
                              "target": {
                                "selector": "span.on"
                              },
                              "noTimeout": true
                            },
                            "falseAction": {
                              "type": "click",
                              "target": {
                                "selector": "span.off"
                              },
                              "noTimeout": true
                            },
                            "type": "X"
                          }
                        ]
                      },
                      "falseAction": {
                        "type": "ifcss",
                        "target": {
                          "selector": ".stack-toggles"
                        },
                        "trueAction": {
                          "type": "consent",
                          "consents": [
                            {
                              "matcher": {
                                "type": "onoff",
                                "onMatcher": {
                                  "target": {
                                    "selector": ".accept-toggle.choice"
                                  }
                                },
                                "offMatcher": {
                                  "target": {
                                    "selector": ".reject-toggle.choice"
                                  }
                                }
                              },
                              "trueAction": {
                                "type": "click",
                                "target": {
                                  "selector": ".accept-toggle"
                                }
                              },
                              "falseAction": {
                                "type": "click",
                                "target": {
                                  "selector": ".reject-toggle"
                                }
                              },
                              "type": "X"
                            }
                          ]
                        },
                        "falseAction": {
                          "type": "consent",
                          "consents": [
                            {
                              "matcher": {
                                "type": "onoff",
                                "onMatcher": {
                                  "target": {
                                    "selector": "button[role=\"switch\"][aria-checked=\"true\"]"
                                  }
                                },
                                "offMatcher": {
                                  "target": {
                                    "selector": "button[role=\"switch\"][aria-checked=\"false\"]"
                                  }
                                }
                              },
                              "toggleAction": {
                                "type": "click",
                                "target": {
                                  "selector": "span.slider"
                                },
                                "noTimeout": true
                              },
                              "type": "X"
                            }
                          ]
                        }
                      }
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".accordion",
                      "textFilter": [
                        "Store and/or access information on a device",
                        "Use precise geolocation data",
                        "Actively scan device characteristics for identification"
                      ]
                    },
                    "trueAction": {
                      "type": "foreach",
                      "target": {
                        "selector": ".stack-row"
                      },
                      "action": {
                        "type": "ifcss",
                        "target": {
                          "selector": "span.on"
                        },
                        "trueAction": {
                          "type": "consent",
                          "consents": [
                            {
                              "matcher": {
                                "type": "onoff",
                                "onMatcher": {
                                  "target": {
                                    "selector": "button[role=\"switch\"][aria-checked=\"true\"]"
                                  }
                                },
                                "offMatcher": {
                                  "target": {
                                    "selector": "button[role=\"switch\"][aria-checked=\"false\"]"
                                  }
                                }
                              },
                              "trueAction": {
                                "type": "click",
                                "target": {
                                  "selector": "span.on"
                                },
                                "noTimeout": true
                              },
                              "falseAction": {
                                "type": "click",
                                "target": {
                                  "selector": "span.off"
                                },
                                "noTimeout": true
                              },
                              "type": "D"
                            }
                          ]
                        },
                        "falseAction": {
                          "type": "ifcss",
                          "target": {
                            "selector": ".stack-toggles"
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "onoff",
                                  "onMatcher": {
                                    "target": {
                                      "selector": ".accept-toggle.choice"
                                    }
                                  },
                                  "offMatcher": {
                                    "target": {
                                      "selector": ".reject-toggle.choice"
                                    }
                                  }
                                },
                                "trueAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": ".accept-toggle"
                                  }
                                },
                                "falseAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": ".reject-toggle"
                                  }
                                },
                                "type": "D"
                              }
                            ]
                          },
                          "falseAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "onoff",
                                  "onMatcher": {
                                    "target": {
                                      "selector": "button[role=\"switch\"][aria-checked=\"true\"]"
                                    }
                                  },
                                  "offMatcher": {
                                    "target": {
                                      "selector": "button[role=\"switch\"][aria-checked=\"false\"]"
                                    }
                                  }
                                },
                                "toggleAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": "span.slider"
                                  },
                                  "noTimeout": true
                                },
                                "type": "D"
                              }
                            ]
                          }
                        }
                      }
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".accordion",
                      "textFilter": [
                        "Personalised ads and content, ad and content measurement, audience insights and product development",
                        "Select personalised ads",
                        "Select basic ads",
                        "Create a personalised ads profile",
                        "Measure ad performance",
                        "Apply market research to generate audience insights",
                        "Marketing-cookies",
                        "Cookies brugt af reklamepartnere (IAB)"
                      ]
                    },
                    "trueAction": {
                      "type": "foreach",
                      "target": {
                        "selector": ".stack-row"
                      },
                      "action": {
                        "type": "ifcss",
                        "target": {
                          "selector": "span.on"
                        },
                        "trueAction": {
                          "type": "consent",
                          "consents": [
                            {
                              "matcher": {
                                "type": "onoff",
                                "onMatcher": {
                                  "target": {
                                    "selector": "button[role=\"switch\"][aria-checked=\"true\"]"
                                  }
                                },
                                "offMatcher": {
                                  "target": {
                                    "selector": "button[role=\"switch\"][aria-checked=\"false\"]"
                                  }
                                }
                              },
                              "trueAction": {
                                "type": "click",
                                "target": {
                                  "selector": "span.on"
                                },
                                "noTimeout": true
                              },
                              "falseAction": {
                                "type": "click",
                                "target": {
                                  "selector": "span.off"
                                },
                                "noTimeout": true
                              },
                              "type": "F"
                            }
                          ]
                        },
                        "falseAction": {
                          "type": "ifcss",
                          "target": {
                            "selector": ".stack-toggles"
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "onoff",
                                  "onMatcher": {
                                    "target": {
                                      "selector": ".accept-toggle.choice"
                                    }
                                  },
                                  "offMatcher": {
                                    "target": {
                                      "selector": ".reject-toggle.choice"
                                    }
                                  }
                                },
                                "trueAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": ".accept-toggle"
                                  }
                                },
                                "falseAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": ".reject-toggle"
                                  }
                                },
                                "type": "F"
                              }
                            ]
                          },
                          "falseAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "onoff",
                                  "onMatcher": {
                                    "target": {
                                      "selector": "button[role=\"switch\"][aria-checked=\"true\"]"
                                    }
                                  },
                                  "offMatcher": {
                                    "target": {
                                      "selector": "button[role=\"switch\"][aria-checked=\"false\"]"
                                    }
                                  }
                                },
                                "toggleAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": "span.slider"
                                  },
                                  "noTimeout": true
                                },
                                "type": "F"
                              }
                            ]
                          }
                        }
                      }
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".accordion",
                      "textFilter": [
                        "Share pseudonymised user data between platforms",
                        "Develop and improve products"
                      ]
                    },
                    "trueAction": {
                      "type": "foreach",
                      "target": {
                        "selector": ".stack-row"
                      },
                      "action": {
                        "type": "ifcss",
                        "target": {
                          "selector": "span.on"
                        },
                        "trueAction": {
                          "type": "consent",
                          "consents": [
                            {
                              "matcher": {
                                "type": "onoff",
                                "onMatcher": {
                                  "target": {
                                    "selector": "button[role=\"switch\"][aria-checked=\"true\"]"
                                  }
                                },
                                "offMatcher": {
                                  "target": {
                                    "selector": "button[role=\"switch\"][aria-checked=\"false\"]"
                                  }
                                }
                              },
                              "trueAction": {
                                "type": "click",
                                "target": {
                                  "selector": "span.on"
                                },
                                "noTimeout": true
                              },
                              "falseAction": {
                                "type": "click",
                                "target": {
                                  "selector": "span.off"
                                },
                                "noTimeout": true
                              },
                              "type": "X"
                            }
                          ]
                        },
                        "falseAction": {
                          "type": "ifcss",
                          "target": {
                            "selector": ".stack-toggles"
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "onoff",
                                  "onMatcher": {
                                    "target": {
                                      "selector": ".accept-toggle.choice"
                                    }
                                  },
                                  "offMatcher": {
                                    "target": {
                                      "selector": ".reject-toggle.choice"
                                    }
                                  }
                                },
                                "trueAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": ".accept-toggle"
                                  }
                                },
                                "falseAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": ".reject-toggle"
                                  }
                                },
                                "type": "X"
                              }
                            ]
                          },
                          "falseAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "onoff",
                                  "onMatcher": {
                                    "target": {
                                      "selector": "button[role=\"switch\"][aria-checked=\"true\"]"
                                    }
                                  },
                                  "offMatcher": {
                                    "target": {
                                      "selector": "button[role=\"switch\"][aria-checked=\"false\"]"
                                    }
                                  }
                                },
                                "toggleAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": "span.slider"
                                  },
                                  "noTimeout": true
                                },
                                "type": "X"
                              }
                            ]
                          }
                        }
                      }
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".accordion",
                      "textFilter": [
                        "Select personalised content",
                        "Create a personalised content profile",
                        "Measure content performance",
                        "Tilpas tjenester"
                      ]
                    },
                    "trueAction": {
                      "type": "foreach",
                      "target": {
                        "selector": ".stack-row"
                      },
                      "action": {
                        "type": "ifcss",
                        "target": {
                          "selector": "span.on"
                        },
                        "trueAction": {
                          "type": "consent",
                          "consents": [
                            {
                              "matcher": {
                                "type": "onoff",
                                "onMatcher": {
                                  "target": {
                                    "selector": "button[role=\"switch\"][aria-checked=\"true\"]"
                                  }
                                },
                                "offMatcher": {
                                  "target": {
                                    "selector": "button[role=\"switch\"][aria-checked=\"false\"]"
                                  }
                                }
                              },
                              "trueAction": {
                                "type": "click",
                                "target": {
                                  "selector": "span.on"
                                },
                                "noTimeout": true
                              },
                              "falseAction": {
                                "type": "click",
                                "target": {
                                  "selector": "span.off"
                                },
                                "noTimeout": true
                              },
                              "type": "E"
                            }
                          ]
                        },
                        "falseAction": {
                          "type": "ifcss",
                          "target": {
                            "selector": ".stack-toggles"
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "onoff",
                                  "onMatcher": {
                                    "target": {
                                      "selector": ".accept-toggle.choice"
                                    }
                                  },
                                  "offMatcher": {
                                    "target": {
                                      "selector": ".reject-toggle.choice"
                                    }
                                  }
                                },
                                "trueAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": ".accept-toggle"
                                  }
                                },
                                "falseAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": ".reject-toggle"
                                  }
                                },
                                "type": "E"
                              }
                            ]
                          },
                          "falseAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "onoff",
                                  "onMatcher": {
                                    "target": {
                                      "selector": "button[role=\"switch\"][aria-checked=\"true\"]"
                                    }
                                  },
                                  "offMatcher": {
                                    "target": {
                                      "selector": "button[role=\"switch\"][aria-checked=\"false\"]"
                                    }
                                  }
                                },
                                "toggleAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": "span.slider"
                                  },
                                  "noTimeout": true
                                },
                                "type": "E"
                              }
                            ]
                          }
                        }
                      }
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".accordion",
                      "textFilter": [
                        "Analyse og produktudvikling"
                      ]
                    },
                    "trueAction": {
                      "type": "foreach",
                      "target": {
                        "selector": ".stack-row"
                      },
                      "action": {
                        "type": "ifcss",
                        "target": {
                          "selector": "span.on"
                        },
                        "trueAction": {
                          "type": "consent",
                          "consents": [
                            {
                              "matcher": {
                                "type": "onoff",
                                "onMatcher": {
                                  "target": {
                                    "selector": "button[role=\"switch\"][aria-checked=\"true\"]"
                                  }
                                },
                                "offMatcher": {
                                  "target": {
                                    "selector": "button[role=\"switch\"][aria-checked=\"false\"]"
                                  }
                                }
                              },
                              "trueAction": {
                                "type": "click",
                                "target": {
                                  "selector": "span.on"
                                },
                                "noTimeout": true
                              },
                              "falseAction": {
                                "type": "click",
                                "target": {
                                  "selector": "span.off"
                                },
                                "noTimeout": true
                              },
                              "type": "B"
                            }
                          ]
                        },
                        "falseAction": {
                          "type": "ifcss",
                          "target": {
                            "selector": ".stack-toggles"
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "onoff",
                                  "onMatcher": {
                                    "target": {
                                      "selector": ".accept-toggle.choice"
                                    }
                                  },
                                  "offMatcher": {
                                    "target": {
                                      "selector": ".reject-toggle.choice"
                                    }
                                  }
                                },
                                "trueAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": ".accept-toggle"
                                  }
                                },
                                "falseAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": ".reject-toggle"
                                  }
                                },
                                "type": "B"
                              }
                            ]
                          },
                          "falseAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "onoff",
                                  "onMatcher": {
                                    "target": {
                                      "selector": "button[role=\"switch\"][aria-checked=\"true\"]"
                                    }
                                  },
                                  "offMatcher": {
                                    "target": {
                                      "selector": "button[role=\"switch\"][aria-checked=\"false\"]"
                                    }
                                  }
                                },
                                "toggleAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": "span.slider"
                                  },
                                  "noTimeout": true
                                },
                                "type": "B"
                              }
                            ]
                          }
                        }
                      }
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".accordion",
                      "textFilter": [
                        "Datenübermittlung an Partner in den USA"
                      ]
                    },
                    "trueAction": {
                      "type": "foreach",
                      "target": {
                        "selector": ".stack-row"
                      },
                      "action": {
                        "type": "ifcss",
                        "target": {
                          "selector": "span.on"
                        },
                        "trueAction": {
                          "type": "consent",
                          "consents": [
                            {
                              "matcher": {
                                "type": "onoff",
                                "onMatcher": {
                                  "target": {
                                    "selector": "button[role=\"switch\"][aria-checked=\"true\"]"
                                  }
                                },
                                "offMatcher": {
                                  "target": {
                                    "selector": "button[role=\"switch\"][aria-checked=\"false\"]"
                                  }
                                }
                              },
                              "trueAction": {
                                "type": "click",
                                "target": {
                                  "selector": "span.on"
                                },
                                "noTimeout": true
                              },
                              "falseAction": {
                                "type": "click",
                                "target": {
                                  "selector": "span.off"
                                },
                                "noTimeout": true
                              },
                              "type": "E"
                            }
                          ]
                        },
                        "falseAction": {
                          "type": "ifcss",
                          "target": {
                            "selector": ".stack-toggles"
                          },
                          "trueAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "onoff",
                                  "onMatcher": {
                                    "target": {
                                      "selector": ".accept-toggle.choice"
                                    }
                                  },
                                  "offMatcher": {
                                    "target": {
                                      "selector": ".reject-toggle.choice"
                                    }
                                  }
                                },
                                "trueAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": ".accept-toggle"
                                  }
                                },
                                "falseAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": ".reject-toggle"
                                  }
                                },
                                "type": "E"
                              }
                            ]
                          },
                          "falseAction": {
                            "type": "consent",
                            "consents": [
                              {
                                "matcher": {
                                  "type": "onoff",
                                  "onMatcher": {
                                    "target": {
                                      "selector": "button[role=\"switch\"][aria-checked=\"true\"]"
                                    }
                                  },
                                  "offMatcher": {
                                    "target": {
                                      "selector": "button[role=\"switch\"][aria-checked=\"false\"]"
                                    }
                                  }
                                },
                                "toggleAction": {
                                  "type": "click",
                                  "target": {
                                    "selector": "span.slider"
                                  },
                                  "noTimeout": true
                                },
                                "type": "E"
                              }
                            ]
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          ]
        },
        "name": "HANDLE_TAB",
        "custom": true
      }
    ]
  },
  "sourcepointpopup": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".message-container .message-button",
              "textFilter": [
                "Ret indstillinger",
                "Cookie Settings",
                "Voir les paramètres",
                "Options",
                "Manage my cookies",
                "Settings",
                "Einstellungen",
                "Instellen",
                "Mijn instellingen beheren",
                "Hantera cookies",
                "Manage",
                "Configure Preferences"
              ],
              "displayFilter": true
            }
          }
        ],
        "showingMatcher": [
          null
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "wait",
              "waitTime": 250
            },
            {
              "type": "click",
              "target": {
                "selector": ".message-container .message-button.cmp-cta-manage"
              }
            },
            {
              "type": "click",
              "target": {
                "selector": ".message-container .message-button",
                "textFilter": [
                  "Ret indstillinger",
                  "Cookie Settings",
                  "Voir les paramètres",
                  "Options",
                  "Manage my cookies",
                  "Settings",
                  "Einstellungen",
                  "Instellen",
                  "Mijn instellingen beheren",
                  "Hantera cookies",
                  "Manage",
                  "Configure Preferences"
                ]
              }
            }
          ]
        },
        "name": "UTILITY"
      }
    ]
  },
  "sourcepoint": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "parent": null,
            "target": {
              "selector": "[class^='sp_message_container']"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "parent": null,
            "target": {
              "selector": "[class^='sp_message_container']"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "parent": null,
          "target": {
            "selector": "[class^='sp_message_container'] button",
            "textFilter": [
              "Consent",
              "Options"
            ]
          },
          "type": "click"
        },
        "name": "UTILITY"
      }
    ]
  },
  "springer": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "parent": null,
            "target": {
              "selector": ".cmp-app_gdpr"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "parent": null,
            "target": {
              "displayFilter": true,
              "selector": ".cmp-popup_popup"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "actions": [
            {
              "target": {
                "selector": ".cmp-intro_rejectAll"
              },
              "type": "click"
            },
            {
              "type": "wait",
              "waitTime": 250
            },
            {
              "target": {
                "selector": ".cmp-purposes_purposeItem:not(.cmp-purposes_selectedPurpose)"
              },
              "type": "click"
            }
          ],
          "type": "list"
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "consents": [
            {
              "matcher": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Przechowywanie informacji na urządzeniu lub dostęp do nich",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch .cmp-switch_isSelected"
                },
                "type": "css"
              },
              "toggleAction": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Przechowywanie informacji na urządzeniu lub dostęp do nich",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch:not(.cmp-switch_isSelected)"
                },
                "type": "click"
              },
              "type": "D"
            },
            {
              "matcher": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Wybór podstawowych reklam",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch .cmp-switch_isSelected"
                },
                "type": "css"
              },
              "toggleAction": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Wybór podstawowych reklam",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch:not(.cmp-switch_isSelected)"
                },
                "type": "click"
              },
              "type": "F"
            },
            {
              "matcher": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Tworzenie profilu spersonalizowanych reklam",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch .cmp-switch_isSelected"
                },
                "type": "css"
              },
              "toggleAction": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Tworzenie profilu spersonalizowanych reklam",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch:not(.cmp-switch_isSelected)"
                },
                "type": "click"
              },
              "type": "F"
            },
            {
              "matcher": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Wybór spersonalizowanych reklam",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch .cmp-switch_isSelected"
                },
                "type": "css"
              },
              "toggleAction": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Wybór spersonalizowanych reklam",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch:not(.cmp-switch_isSelected)"
                },
                "type": "click"
              },
              "type": "E"
            },
            {
              "matcher": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Tworzenie profilu spersonalizowanych treści",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch .cmp-switch_isSelected"
                },
                "type": "css"
              },
              "toggleAction": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Tworzenie profilu spersonalizowanych treści",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch:not(.cmp-switch_isSelected)"
                },
                "type": "click"
              },
              "type": "E"
            },
            {
              "matcher": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Wybór spersonalizowanych treści",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch .cmp-switch_isSelected"
                },
                "type": "css"
              },
              "toggleAction": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Wybór spersonalizowanych treści",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch:not(.cmp-switch_isSelected)"
                },
                "type": "click"
              },
              "type": "B"
            },
            {
              "matcher": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Pomiar wydajności reklam",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch .cmp-switch_isSelected"
                },
                "type": "css"
              },
              "toggleAction": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Pomiar wydajności reklam",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch:not(.cmp-switch_isSelected)"
                },
                "type": "click"
              },
              "type": "B"
            },
            {
              "matcher": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Pomiar wydajności treści",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch .cmp-switch_isSelected"
                },
                "type": "css"
              },
              "toggleAction": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Pomiar wydajności treści",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch:not(.cmp-switch_isSelected)"
                },
                "type": "click"
              },
              "type": "B"
            },
            {
              "matcher": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Stosowanie badań rynkowych w celu generowania opinii odbiorców",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch .cmp-switch_isSelected"
                },
                "type": "css"
              },
              "toggleAction": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Stosowanie badań rynkowych w celu generowania opinii odbiorców",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch:not(.cmp-switch_isSelected)"
                },
                "type": "click"
              },
              "type": "X"
            },
            {
              "matcher": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Opracowywanie i ulepszanie produktów",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch .cmp-switch_isSelected"
                },
                "type": "css"
              },
              "toggleAction": {
                "parent": {
                  "selector": ".cmp-purposes_detailHeader",
                  "textFilter": "Opracowywanie i ulepszanie produktów",
                  "childFilter": {
                    "target": {
                      "selector": ".cmp-switch_switch"
                    }
                  }
                },
                "target": {
                  "selector": ".cmp-switch_switch:not(.cmp-switch_isSelected)"
                },
                "type": "click"
              },
              "type": "X"
            }
          ],
          "type": "consent"
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "target": {
            "selector": ".cmp-details_save"
          },
          "type": "click"
        },
        "name": "SAVE_CONSENT"
      }
    ]
  },
  "thenextwebopen": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookie-consent-banner"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cookie-consent-banner__btn-wrap"
            },
            "parent": {
              "selector": "#cookie-consent-banner",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".cookie-consent-banner__btn-secondary"
          }
        },
        "name": "UTILITY"
      }
    ]
  },
  "thenextweb": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cookie-consent-form__body"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cookie-consent-form__body",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "consent",
          "consents": [
            {
              "matcher": {
                "type": "css",
                "target": {
                  "selector": "#cookie-consent-form__input--granted"
                }
              },
              "trueAction": {
                "type": "click",
                "target": {
                  "selector": "#cookie-consent-form__input--granted"
                }
              },
              "falseAction": {
                "type": "click",
                "target": {
                  "selector": "#cookie-consent-form__input--denied"
                }
              },
              "type": "F"
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".cookie-consent-form__btn-primary"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "tumblr.com": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".frame-content .cmp__dialog",
              "iframeFilter": true
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".frame-content .cmp__dialog",
              "iframeFilter": true,
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".components-button.is-secondary",
            "textFilter": [
              "Learn More"
            ]
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": ".components-checkbox-control__input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "strong",
                          "textFilter": [
                            "Analytics"
                          ]
                        }
                      },
                      "selector": "label"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": ".components-checkbox-control__input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "strong",
                          "textFilter": [
                            "Analytics"
                          ]
                        }
                      },
                      "selector": "label"
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": ".components-checkbox-control__input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "strong",
                          "textFilter": [
                            "Advertising"
                          ]
                        }
                      },
                      "selector": "label"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": ".components-checkbox-control__input"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "strong",
                          "textFilter": [
                            "Advertising"
                          ]
                        }
                      },
                      "selector": "label"
                    }
                  },
                  "type": "F"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".components-button.is-primary",
            "textFilter": [
              "Agree to Selected"
            ]
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "tealium.com": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#__tealiumGDPRecModal, #__tealiumDNS_banner, script[id^=tealium]"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#__tealiumGDPRecModal > *, #__tealiumDNS_banner > *",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#__tealiumGDPRecModal .consent_prefs_button, #sliding-popup .popup-actions .eu-cookie-change-settings, #prefslink, #gdpr_change_settings, #advanced_consent_options, #__tealiumGDPRecModal a[href*='showConsentPreferences'], #__tealiumGDPRecModal a[href*='goToPreferences()'], .details-button, #__tealiumGDPRecModal a[onclick*='goToPreferences()'], #__tealiumGDPRecModal a[onclick*='showConsentPreferences'], #open_preferences, #editSettingsBtn"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "waitcss",
              "target": {
                "selector": "#__tealiumGDPRcpPrefs > *",
                "displayFilter": true
              },
              "retries": 50,
              "waitTime": 50
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#__tealiumGDPRcpPrefs #toggle_cat1, [data-consent-num='1']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label[for=toggle_cat1], [data-consent-num='1']"
                    }
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#__tealiumGDPRcpPrefs #toggle_cat2"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label[for=toggle_cat2]"
                    }
                  },
                  "type": "X"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#__tealiumGDPRcpPrefs #toggle_cat3, [data-consent-num='3']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label[for=toggle_cat3], [data-consent-num='3']"
                    }
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#__tealiumGDPRcpPrefs #toggle_cat4"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label[for=toggle_cat4]"
                    }
                  },
                  "type": "E"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#__tealiumGDPRcpPrefs #toggle_cat5"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label[for=toggle_cat5]"
                    }
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#__tealiumGDPRcpPrefs #toggle_cat6"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label[for=toggle_cat6]"
                    }
                  },
                  "type": "E"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#__tealiumGDPRcpPrefs #toggle_cat7, [data-consent-num='7']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label[for=toggle_cat7], [data-consent-num='7']"
                    }
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#__tealiumGDPRcpPrefs #toggle_cat8"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label[for=toggle_cat8]"
                    }
                  },
                  "type": "E"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#__tealiumGDPRcpPrefs #toggle_cat9"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label[for=toggle_cat9]"
                    }
                  },
                  "type": "E"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#__tealiumGDPRcpPrefs #toggle_cat10"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label[for=toggle_cat10]"
                    }
                  },
                  "type": "F"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#__tealiumGDPRcpPrefs #toggle_cat11"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label[for=toggle_cat11]"
                    }
                  },
                  "type": "D"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#__tealiumGDPRcpPrefs #toggle_cat15"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "label[for=toggle_cat15]"
                    }
                  },
                  "type": "F"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "textFilter": [
                        "Allow functional cookies?"
                      ]
                    }
                  },
                  "trueAction": {
                    "type": "click",
                    "target": {
                      "selector": "#personalization_yes"
                    }
                  },
                  "falseAction": {
                    "type": "click",
                    "target": {
                      "selector": "#personalization_no"
                    }
                  },
                  "type": "A"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "textFilter": [
                        "Allow performance cookies?"
                      ]
                    }
                  },
                  "trueAction": {
                    "type": "click",
                    "target": {
                      "selector": "#analytics_yes"
                    }
                  },
                  "falseAction": {
                    "type": "click",
                    "target": {
                      "selector": "#analytics_no"
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "textFilter": [
                        "Allow advertising cookies?"
                      ]
                    }
                  },
                  "trueAction": {
                    "type": "click",
                    "target": {
                      "selector": "#display_ads_yes"
                    }
                  },
                  "falseAction": {
                    "type": "click",
                    "target": {
                      "selector": "#display_ads_no"
                    }
                  },
                  "type": "F"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#__tealiumGDPRcpPrefs #preferences_prompt_submit, #preferences_prompt_settings_submit, #__tealiumGDPRcpPrefs .t_cm_save_button, #consentAcceptChoice"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "trustarcbar": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "parent": null,
            "target": {
              "selector": "#truste-consent-content, .truste-consent-content, #truste-consent-track"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "parent": null,
            "target": {
              "selector": "#truste-consent-content, .truste-consent-content, #truste-consent-track"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "actions": [
            {
              "parent": null,
              "target": {
                "displayFilter": true,
                "selector": "#truste-show-consent"
              },
              "type": "waitcss"
            },
            {
              "parent": null,
              "target": {
                "selector": "#truste-show-consent"
              },
              "type": "click"
            }
          ],
          "type": "list"
        },
        "name": "UTILITY"
      }
    ]
  },
  "trustarc_popup_hider": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".truste_box_overlay"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".truste_box_overlay",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".truste_box_overlay"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".truste_overlay"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "waitcss",
          "target": {
            "selector": ".truste_box_overlay",
            "displayFilter": true
          },
          "retries": 100,
          "waitTime": 250,
          "negated": true
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "trustarcframe_2022": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "title",
              "textFilter": "TrustArc Preference Manager"
            },
            "parent": {
              "childFilter": {
                "target": {
                  "selector": ".iab_managePanel"
                }
              },
              "selector": "html"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".iab_managePanel"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "waitcss",
              "target": {
                "selector": ".switchContainer"
              },
              "retries": 10,
              "waitTime": 250
            },
            {
              "type": "wait",
              "waitTime": 500
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": ".switchContainer"
                  }
                },
                "selector": ".cookiecat"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "trueAction": {
                      "type": "click",
                      "target": {
                        "selector": ".consentyes"
                      }
                    },
                    "falseAction": {
                      "type": "click",
                      "target": {
                        "selector": ".consentno"
                      }
                    },
                    "type": "X"
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": ".categoryTitle",
                    "textFilter": "Functional Cookies"
                  }
                },
                "selector": ".cookiecat"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "css",
                      "target": {
                        "selector": ".consentyes.activeConsent"
                      }
                    },
                    "trueAction": {
                      "type": "click",
                      "target": {
                        "selector": ".consentyes"
                      }
                    },
                    "falseAction": {
                      "type": "click",
                      "target": {
                        "selector": ".consentyes",
                        "textFilter": ".consentno"
                      }
                    },
                    "type": "A"
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": ".categoryTitle",
                    "textFilter": "Advertising Cookies"
                  }
                },
                "selector": ".cookiecat"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "css",
                      "target": {
                        "selector": ".consentyes.activeConsent"
                      }
                    },
                    "trueAction": {
                      "type": "click",
                      "target": {
                        "selector": ".consentyes"
                      }
                    },
                    "falseAction": {
                      "type": "click",
                      "target": {
                        "selector": ".consentyes",
                        "textFilter": ".consentno"
                      }
                    },
                    "type": "F"
                  }
                ]
              }
            },
            {
              "type": "wait",
              "waitTime": 1
            },
            {
              "type": "foreach",
              "target": {
                "selector": ".manageListItem"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "css",
                          "target": {
                            "selector": ".consentyes.activeConsent"
                          }
                        },
                        "trueAction": {
                          "type": "click",
                          "target": {
                            "selector": ".consentyes"
                          }
                        },
                        "falseAction": {
                          "type": "click",
                          "target": {
                            "selector": ".consentno"
                          }
                        },
                        "type": "X"
                      }
                    ]
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "trueAction": {
                          "type": "click",
                          "target": {
                            "selector": ".legintyes"
                          }
                        },
                        "falseAction": {
                          "type": "click",
                          "target": {
                            "selector": ".legintno"
                          }
                        },
                        "type": "X"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": ".managePurposeListText",
                    "textFilter": [
                      "Store and/or access information on a device",
                      "Use precise geolocation data",
                      "Actively scan device characteristics for identification"
                    ]
                  }
                },
                "selector": ".manageListItem"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "css",
                          "target": {
                            "selector": ".consentyes.activeConsent"
                          }
                        },
                        "trueAction": {
                          "type": "click",
                          "target": {
                            "selector": ".consentyes"
                          }
                        },
                        "falseAction": {
                          "type": "click",
                          "target": {
                            "selector": ".consentno"
                          }
                        },
                        "type": "D"
                      }
                    ]
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "trueAction": {
                          "type": "click",
                          "target": {
                            "selector": ".legintyes"
                          }
                        },
                        "falseAction": {
                          "type": "click",
                          "target": {
                            "selector": ".legintno"
                          }
                        },
                        "type": "D"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": ".managePurposeListText",
                    "textFilter": [
                      "Select basic ads",
                      "Create a personalised ads profile",
                      "Select personalised ads",
                      "Measure ad performance"
                    ]
                  }
                },
                "selector": ".manageListItem"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "css",
                          "target": {
                            "selector": ".consentyes.activeConsent"
                          }
                        },
                        "trueAction": {
                          "type": "click",
                          "target": {
                            "selector": ".consentyes"
                          }
                        },
                        "falseAction": {
                          "type": "click",
                          "target": {
                            "selector": ".consentno"
                          }
                        },
                        "type": "F"
                      }
                    ]
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "trueAction": {
                          "type": "click",
                          "target": {
                            "selector": ".legintyes"
                          }
                        },
                        "falseAction": {
                          "type": "click",
                          "target": {
                            "selector": ".legintno"
                          }
                        },
                        "type": "D"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": ".managePurposeListText",
                    "textFilter": [
                      "Create a personalised content profile",
                      "Select personalised content",
                      "Measure content performance"
                    ]
                  }
                },
                "selector": ".manageListItem"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "css",
                          "target": {
                            "selector": ".consentyes.activeConsent"
                          }
                        },
                        "trueAction": {
                          "type": "click",
                          "target": {
                            "selector": ".consentyes"
                          }
                        },
                        "falseAction": {
                          "type": "click",
                          "target": {
                            "selector": ".consentno"
                          }
                        },
                        "type": "E"
                      }
                    ]
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "trueAction": {
                          "type": "click",
                          "target": {
                            "selector": ".legintyes"
                          }
                        },
                        "falseAction": {
                          "type": "click",
                          "target": {
                            "selector": ".legintno"
                          }
                        },
                        "type": "D"
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".saveAndExit"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "trustarcframe": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "title",
              "textFilter": [
                "TrustArc Preference Manager"
              ]
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".gdpr .switch span.on, .pdynamicbutton a, .gwt-InlineHTML"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "waitcss",
              "target": {
                "selector": ".shp"
              },
              "retries": 10,
              "waitTime": 250
            },
            {
              "type": "click",
              "target": {
                "selector": ".shp"
              },
              "parent": {
                "selector": ".pdynamicbutton"
              }
            },
            {
              "type": "waitcss",
              "target": {
                "selector": ".cookiecat, .pdynamicbutton .advance, .listItem"
              },
              "retries": 10,
              "waitTime": 250
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".pdynamicbutton .advance"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": ".pdynamicbutton .advance"
                    }
                  },
                  {
                    "type": "waitcss",
                    "target": {
                      "selector": ".switch span.on"
                    },
                    "retries": 20,
                    "waitTime": 250
                  }
                ]
              }
            }
          ]
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "wait",
              "waitTime": 250
            },
            {
              "type": "foreach",
              "target": {
                "selector": ".cookiecat, .listItem"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".gwt-InlineHTML",
                      "textFilter": [
                        "Functional",
                        "Funktionalitets",
                        "Funktionelle Cookies",
                        "Funktionalitets- og profilcookies"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "childFilter": {
                                "target": {
                                  "selector": "span[role='option'].active",
                                  "textFilter": [
                                    "On",
                                    "Ja",
                                    "Yes",
                                    "Tilvælg"
                                  ]
                                }
                              },
                              "selector": ".switch"
                            }
                          },
                          "trueAction": {
                            "type": "click",
                            "target": {
                              "selector": ".switch span.off[role='option'], span.consentyes"
                            }
                          },
                          "falseAction": {
                            "type": "click",
                            "target": {
                              "selector": ".switch span.on[role='option'], span.consentno"
                            }
                          },
                          "type": "A"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".gwt-InlineHTML",
                      "textFilter": [
                        "Marketing",
                        "Annonceringscookies",
                        "Werbe-Cookies",
                        "Advertising"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "childFilter": {
                                "target": {
                                  "selector": "span[role='option'].active",
                                  "textFilter": [
                                    "On",
                                    "Ja",
                                    "Yes",
                                    "Tilvælg"
                                  ]
                                }
                              },
                              "selector": ".switch"
                            }
                          },
                          "trueAction": {
                            "type": "click",
                            "target": {
                              "selector": ".switch span.off[role='option'], span.consentyes"
                            }
                          },
                          "falseAction": {
                            "type": "click",
                            "target": {
                              "selector": ".switch span.on[role='option'], span.consentno"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".gwt-InlineHTML",
                      "textFilter": [
                        "Store and/or access information on a device"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "childFilter": {
                                "target": {
                                  "selector": "span[role='option'].active",
                                  "textFilter": [
                                    "On",
                                    "Ja",
                                    "Yes",
                                    "Tilvælg"
                                  ]
                                }
                              },
                              "selector": ".switch"
                            }
                          },
                          "trueAction": {
                            "type": "click",
                            "target": {
                              "selector": ".switch span.off[role='option'], span.consentyes"
                            }
                          },
                          "falseAction": {
                            "type": "click",
                            "target": {
                              "selector": ".switch span.on[role='option'], span.consentno"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".gwt-InlineHTML",
                      "textFilter": [
                        "Personalised ads, ad measurement, and audience insights",
                        "Reklame- og Targetingcookies"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "childFilter": {
                                "target": {
                                  "selector": "span[role='option'].active",
                                  "textFilter": [
                                    "On",
                                    "Ja",
                                    "Yes",
                                    "Tilvælg"
                                  ]
                                }
                              },
                              "selector": ".switch"
                            }
                          },
                          "trueAction": {
                            "type": "click",
                            "target": {
                              "selector": ".switch span.off[role='option'], span.consentyes"
                            }
                          },
                          "falseAction": {
                            "type": "click",
                            "target": {
                              "selector": ".switch span.on[role='option'], span.consentno"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".gwt-InlineHTML",
                      "textFilter": [
                        "Personalised content, and content measurement"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "childFilter": {
                                "target": {
                                  "selector": "span[role='option'].active",
                                  "textFilter": [
                                    "On",
                                    "Ja",
                                    "Yes",
                                    "Tilvælg"
                                  ]
                                }
                              },
                              "selector": ".switch"
                            }
                          },
                          "trueAction": {
                            "type": "click",
                            "target": {
                              "selector": ".switch span.off[role='option'], span.consentyes"
                            }
                          },
                          "falseAction": {
                            "type": "click",
                            "target": {
                              "selector": ".switch span.on[role='option'], span.consentno"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".gwt-InlineHTML",
                      "textFilter": [
                        "Develop and improve products",
                        "Analytics Cookies"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "css",
                            "target": {
                              "childFilter": {
                                "target": {
                                  "selector": "span[role='option'].active",
                                  "textFilter": [
                                    "On",
                                    "Ja",
                                    "Yes",
                                    "Tilvælg"
                                  ]
                                }
                              },
                              "selector": ".switch"
                            }
                          },
                          "trueAction": {
                            "type": "click",
                            "target": {
                              "selector": ".switch span.off[role='option'], span.consentyes"
                            }
                          },
                          "falseAction": {
                            "type": "click",
                            "target": {
                              "selector": ".switch span.on[role='option'], span.consentno"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": ".prefPanel > div[role~='group']"
              },
              "trueAction": {
                "type": "foreach",
                "target": {
                  "selector": ".prefPanel > div[role~='group']"
                },
                "action": {
                  "type": "list",
                  "actions": [
                    {
                      "type": "ifcss",
                      "target": {
                        "selector": "h3",
                        "textFilter": [
                          "Functional",
                          "Funktionalitets"
                        ]
                      },
                      "trueAction": {
                        "type": "consent",
                        "consents": [
                          {
                            "matcher": {
                              "type": "css",
                              "target": {
                                "selector": "span.off.active"
                              },
                              "parent": {
                                "selector": ".cookiecat"
                              }
                            },
                            "trueAction": {
                              "type": "click",
                              "target": {
                                "selector": ".switch span.off"
                              }
                            },
                            "falseAction": {
                              "type": "click",
                              "target": {
                                "selector": ".switch span.on"
                              }
                            },
                            "type": "A"
                          }
                        ]
                      }
                    },
                    {
                      "type": "ifcss",
                      "target": {
                        "selector": "h3",
                        "textFilter": [
                          "Analytics"
                        ]
                      },
                      "trueAction": {
                        "type": "consent",
                        "consents": [
                          {
                            "matcher": {
                              "type": "css",
                              "target": {
                                "selector": "span.off.active"
                              },
                              "parent": {
                                "selector": ".cookiecat"
                              }
                            },
                            "trueAction": {
                              "type": "click",
                              "target": {
                                "selector": ".switch span.off"
                              }
                            },
                            "falseAction": {
                              "type": "click",
                              "target": {
                                "selector": ".switch span.on"
                              }
                            },
                            "type": "B"
                          }
                        ]
                      }
                    },
                    {
                      "type": "ifcss",
                      "target": {
                        "selector": "h3",
                        "textFilter": [
                          "marketing and advertising"
                        ]
                      },
                      "trueAction": {
                        "type": "consent",
                        "consents": [
                          {
                            "matcher": {
                              "type": "css",
                              "target": {
                                "selector": "span.off.active"
                              },
                              "parent": {
                                "selector": ".cookiecat"
                              }
                            },
                            "trueAction": {
                              "type": "click",
                              "target": {
                                "selector": ".switch span.off"
                              }
                            },
                            "falseAction": {
                              "type": "click",
                              "target": {
                                "selector": ".switch span.on"
                              }
                            },
                            "type": "F"
                          }
                        ]
                      }
                    },
                    {
                      "type": "ifcss",
                      "target": {
                        "selector": "h3",
                        "textFilter": [
                          "advertising",
                          "Annonceringscookies"
                        ]
                      },
                      "trueAction": {
                        "type": "consent",
                        "consents": [
                          {
                            "matcher": {
                              "type": "css",
                              "target": {
                                "selector": "span.off.active"
                              },
                              "parent": {
                                "selector": ".cookiecat"
                              }
                            },
                            "trueAction": {
                              "type": "click",
                              "target": {
                                "selector": ".switch span.off"
                              }
                            },
                            "falseAction": {
                              "type": "click",
                              "target": {
                                "selector": ".switch span.on"
                              }
                            },
                            "type": "F"
                          }
                        ]
                      }
                    },
                    {
                      "type": "ifcss",
                      "target": {
                        "selector": "h3",
                        "textFilter": [
                          "Personalised email marketing"
                        ]
                      },
                      "trueAction": {
                        "type": "consent",
                        "consents": [
                          {
                            "matcher": {
                              "type": "css",
                              "target": {
                                "selector": "span.off.active"
                              },
                              "parent": {
                                "selector": ".cookiecat"
                              }
                            },
                            "trueAction": {
                              "type": "click",
                              "target": {
                                "selector": ".switch span.off"
                              }
                            },
                            "falseAction": {
                              "type": "click",
                              "target": {
                                "selector": ".switch span.on"
                              }
                            },
                            "type": "F"
                          }
                        ]
                      }
                    },
                    {
                      "type": "ifcss",
                      "target": {
                        "selector": "h3",
                        "textFilter": [
                          "Social media & marketing"
                        ]
                      },
                      "trueAction": {
                        "type": "consent",
                        "consents": [
                          {
                            "matcher": {
                              "type": "css",
                              "target": {
                                "selector": "span.off.active"
                              },
                              "parent": {
                                "selector": ".cookiecat"
                              }
                            },
                            "trueAction": {
                              "type": "click",
                              "target": {
                                "selector": ".switch span.off"
                              }
                            },
                            "falseAction": {
                              "type": "click",
                              "target": {
                                "selector": ".switch span.on"
                              }
                            },
                            "type": "F"
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              "falseAction": {
                "type": "slide",
                "target": {
                  "target": {
                    "selector": "div[role=slider]"
                  }
                },
                "dragTarget": {
                  "target": {
                    "selector": ".options h2",
                    "textFilter": [
                      "Required Cookies",
                      "NØDVENDIGE COOKIES",
                      "PÅKRÆVEDE COOKIES"
                    ]
                  }
                },
                "axis": "y"
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": ".submit, .saveAndExit"
              }
            },
            {
              "type": "waitcss",
              "target": {
                "selector": ".close"
              },
              "retries": 1000,
              "waitTime": 250
            },
            {
              "type": "click",
              "target": {
                "selector": ".close"
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "theregister.com": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".RegCTBWF_wrapper #all_show_regfc_custom"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#RegCTBWF",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": ".RegCTBWF_wrapper"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#RegCTBWFBSC"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "[name=tailored_ads]"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "[name=tailored_ads]"
                    }
                  },
                  "type": "F"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "[name=analytics]"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "[name=analytics]"
                    }
                  },
                  "type": "B"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#RegCTBWFBAC"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "TheVerge": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".duet--cta--cookie-banner"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".duet--cta--cookie-banner",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": ".duet--cta--cookie-banner"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "ifallowall",
          "trueAction": {
            "type": "click",
            "target": {
              "selector": "button",
              "textFilter": [
                "I Accept"
              ]
            }
          },
          "falseAction": {
            "type": "click",
            "target": {
              "childFilter": {
                "target": {
                  "selector": "span",
                  "textFilter": [
                    "I Do Not Accept"
                  ]
                }
              },
              "selector": "button"
            }
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "tui": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cmNotifyBanner[aria-label='Consent Banner']"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cmNotifyBanner[aria-label='Consent Banner']",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#cmNotifyBanner"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#__tealiumGDPRcpPrefs"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#cmManage"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#PersonalisationSlide"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#PersonalisationSlide"
                    }
                  },
                  "type": "A"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "[id='Targeting and AdvertisingSlide']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "[id='Targeting and AdvertisingSlide']"
                    }
                  },
                  "type": "F"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#cmSave"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "Twitch.tv": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div.consent-banner__content--gdpr-v2"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div.consent-banner__content--gdpr-v2",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".consent-banner"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".ReactModal__Overlay.ReactModal__Overlay--after-open.modal__backdrop.js-modal-backdrop"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "button[data-a-target=consent-banner-manage-preferences]"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "waitcss",
              "target": {
                "selector": ".Layout-sc-1xcs6mc-0.hZLfAO"
              },
              "retries": 10,
              "waitTime": 250
            },
            {
              "type": "ifallownone",
              "trueAction": {
                "type": "click",
                "target": {
                  "selector": "button[data-a-target=consent-modal-save]"
                }
              },
              "falseAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "foreach",
                    "target": {
                      "selector": ".Layout-sc-1xcs6mc-0.hZLfAO"
                    },
                    "action": {
                      "type": "list",
                      "actions": [
                        {
                          "type": "consent",
                          "consents": [
                            {
                              "matcher": {
                                "type": "checkbox",
                                "target": {
                                  "selector": "[data-a-target=tw-checkbox]"
                                },
                                "parent": {
                                  "childFilter": {
                                    "target": {
                                      "selector": "p",
                                      "textFilter": [
                                        "Analytics cookies and data usage:",
                                        "Analyse-cookies og dataanvendelse:",
                                        "Cookies und Datennutzung:",
                                        "Cookies de análisis y uso de datos:",
                                        "Cookies de analítica y uso de datos:",
                                        "Cookies d'analyse et utilisation des données :",
                                        "Cookie analitici e utilizzo dei dati:",
                                        "Analitikai sütik és adathasználat:",
                                        "Analytische cookies en datagebruik:",
                                        "Informasjonskapsler for analyse og databruk:",
                                        "Analityczne pliki cookie i wykorzystanie danych:",
                                        "Cookies analíticos e utilização de dados:",
                                        "Cookies de análise e uso de dados:",
                                        "Cookie-uri analitice și utilizarea datelor:",
                                        "Analytické cookies a používanie dát",
                                        "Analyyttiset evästeet ja tiedon käyttö:",
                                        "Statistikcookies och dataanvändning:",
                                        "Cookie phân tích và sử dụng dữ liệu:",
                                        "Analiz çerezleri ve veri kullanımı:",
                                        "Analytické cookeis a využití dat:",
                                        "Cookie ανάλυσης και χρήσης δεδομένων:",
                                        "Аналитични бисквитки и употреба на данни:",
                                        "Аналитические файлы cookie и использование данных:",
                                        "คุกกี้ในส่วนของการวิเคราะห์และการใช้ข้อมูล:",
                                        "分析 Cookie 和数据使用情况：",
                                        "广告 Cookie 和数据使用情况：",
                                        "アナリティクスクッキーとデータの利用:",
                                        "분석 쿠키 및 데이터 사용:"
                                      ]
                                    }
                                  },
                                  "selector": ".Layout-sc-1xcs6mc-0.hkmaKt.fixed-width-title-and-toggle"
                                }
                              },
                              "toggleAction": {
                                "type": "click",
                                "target": {
                                  "selector": "[data-a-target=tw-checkbox]"
                                },
                                "parent": {
                                  "childFilter": {
                                    "target": {
                                      "selector": "p",
                                      "textFilter": [
                                        "Analytics cookies and data usage:",
                                        "Analyse-cookies og dataanvendelse:",
                                        "Cookies und Datennutzung:",
                                        "Cookies de análisis y uso de datos:",
                                        "Cookies de analítica y uso de datos:",
                                        "Cookies d'analyse et utilisation des données :",
                                        "Cookie analitici e utilizzo dei dati:",
                                        "Analitikai sütik és adathasználat:",
                                        "Analytische cookies en datagebruik:",
                                        "Informasjonskapsler for analyse og databruk:",
                                        "Analityczne pliki cookie i wykorzystanie danych:",
                                        "Cookies analíticos e utilização de dados:",
                                        "Cookies de análise e uso de dados:",
                                        "Cookie-uri analitice și utilizarea datelor:",
                                        "Analytické cookies a používanie dát",
                                        "Analyyttiset evästeet ja tiedon käyttö:",
                                        "Statistikcookies och dataanvändning:",
                                        "Cookie phân tích và sử dụng dữ liệu:",
                                        "Analiz çerezleri ve veri kullanımı:",
                                        "Analytické cookeis a využití dat:",
                                        "Cookie ανάλυσης και χρήσης δεδομένων:",
                                        "Аналитични бисквитки и употреба на данни:",
                                        "Аналитические файлы cookie и использование данных:",
                                        "คุกกี้ในส่วนของการวิเคราะห์และการใช้ข้อมูล:",
                                        "分析 Cookie 和数据使用情况：",
                                        "广告 Cookie 和数据使用情况：",
                                        "アナリティクスクッキーとデータの利用:",
                                        "분석 쿠키 및 데이터 사용:"
                                      ]
                                    }
                                  },
                                  "selector": ".Layout-sc-1xcs6mc-0.hkmaKt.fixed-width-title-and-toggle"
                                }
                              },
                              "type": "B"
                            }
                          ]
                        },
                        {
                          "type": "consent",
                          "consents": [
                            {
                              "matcher": {
                                "type": "checkbox",
                                "target": {
                                  "selector": "[data-a-target=tw-checkbox]"
                                },
                                "parent": {
                                  "childFilter": {
                                    "target": {
                                      "selector": "p",
                                      "textFilter": [
                                        "Advertising cookies and data usage:",
                                        "Reklame-cookies og dataanvendelse:",
                                        "Werbe-Cookies und Datennutzung:",
                                        "Cookies publicitarias y uso de datos:",
                                        "Cookies de publicidad y uso de datos:",
                                        "Cookies publicitaires et utilisation des données :",
                                        "Cookie pubblicitari e utilizzo dei dati:",
                                        "Hirdetési sütik és adathasználat:",
                                        "Reclamecookies en datagebruik:",
                                        "Informasjonskapsler for reklame og databruk:",
                                        "Cookie reklamowe i wykorzystanie danych:",
                                        "Cookies de análise e uso de dados:",
                                        "Cookies de publicidade e uso de dados:",
                                        "Cookie-uri publicitare și utilizarea datelor:",
                                        "Reklamné súbory cookies a používanie dát:",
                                        "Markkinointievästeet ja tiedon käyttö:",
                                        "Reklamcookies och dataanvändning:",
                                        "Sử dụng cookie và dữ liệu quảng cáo:",
                                        "Reklam çerezleri ve veri kullanımı:",
                                        "Reklamní cookies a využití dat:",
                                        "Χρήση cookie και δεδομένων:",
                                        "Бисквитки за реклами и употреба на данни:",
                                        "Рекламные файлы cookie и использование данных:",
                                        "คุกกี้สำหรับโฆษณาและการใช้ข้อมูล:",
                                        "广告 Cookie 和数据使用情况：",
                                        "广告 Cookie 和数据使用情况：",
                                        "広告クッキーとデータの利用:",
                                        "광고 쿠키 및 데이터 사용:"
                                      ]
                                    }
                                  },
                                  "selector": ".Layout-sc-1xcs6mc-0.hkmaKt.fixed-width-title-and-toggle"
                                }
                              },
                              "toggleAction": {
                                "type": "click",
                                "target": {
                                  "selector": "[data-a-target=tw-checkbox]"
                                },
                                "parent": {
                                  "childFilter": {
                                    "target": {
                                      "selector": "p",
                                      "textFilter": [
                                        "Advertising cookies and data usage:",
                                        "Reklame-cookies og dataanvendelse:",
                                        "Werbe-Cookies und Datennutzung:",
                                        "Cookies publicitarias y uso de datos:",
                                        "Cookies de publicidad y uso de datos:",
                                        "Cookies publicitaires et utilisation des données :",
                                        "Cookie pubblicitari e utilizzo dei dati:",
                                        "Hirdetési sütik és adathasználat:",
                                        "Reclamecookies en datagebruik:",
                                        "Informasjonskapsler for reklame og databruk:",
                                        "Cookie reklamowe i wykorzystanie danych:",
                                        "Cookies de análise e uso de dados:",
                                        "Cookies de publicidade e uso de dados:",
                                        "Cookie-uri publicitare și utilizarea datelor:",
                                        "Reklamné súbory cookies a používanie dát:",
                                        "Markkinointievästeet ja tiedon käyttö:",
                                        "Reklamcookies och dataanvändning:",
                                        "Sử dụng cookie và dữ liệu quảng cáo:",
                                        "Reklam çerezleri ve veri kullanımı:",
                                        "Reklamní cookies a využití dat:",
                                        "Χρήση cookie και δεδομένων:",
                                        "Бисквитки за реклами и употреба на данни:",
                                        "Рекламные файлы cookie и использование данных:",
                                        "คุกกี้สำหรับโฆษณาและการใช้ข้อมูล:",
                                        "广告 Cookie 和数据使用情况：",
                                        "广告 Cookie 和数据使用情况：",
                                        "広告クッキーとデータの利用:",
                                        "광고 쿠키 및 데이터 사용:"
                                      ]
                                    }
                                  },
                                  "selector": ".Layout-sc-1xcs6mc-0.hkmaKt.fixed-width-title-and-toggle"
                                }
                              },
                              "type": "F"
                            }
                          ]
                        }
                      ]
                    }
                  },
                  {
                    "type": "click",
                    "target": {
                      "selector": "div[data-a-target=tw-core-button-label-text].Layout-sc-1xcs6mc-0.phMMp",
                      "textFilter": [
                        "Set Cookies by Purpose",
                        "Indstil cookies efter formål",
                        "Cookies nach Zweck setzen",
                        "Configurar cookies por finalidad",
                        "Establecer cookies por propósitos",
                        "Définir les cookies par finalité",
                        "Imposta i Cookie per finalità",
                        "Sütik beállítása cél szerint",
                        "Cookies instellen per doel",
                        "Sett informasjonskapsler etter formål",
                        "Ustaw pliki cookie według celu",
                        "Definir cookies por finalidade",
                        "Configurar cookies por finalidade",
                        "Setează Cookie-urile în funcție de scop",
                        "Nastaviť súbory cookie podľa účelu",
                        "Aseta evästeet tarkoituksen mukaan",
                        "Ställ in cookies efter syfte",
                        "Đặt Cookie theo mục đích",
                        "Amacına göre çerez ayarları",
                        "Nastavit soubory cookie podle účelu",
                        "Ορισμός Cookie ανά σκοπό",
                        "Задаване на бисквитки спрямо цел",
                        "Установить файлы cookie по назначению",
                        "ตั้งค่าคุกกี้ตามวัตถุประสงค์",
                        "按目的设置 Cookie",
                        "依照目的設定 Cookie",
                        "目的別にクッキーを設定",
                        "목적에 따른 쿠키 설정"
                      ]
                    }
                  },
                  {
                    "type": "waitcss",
                    "target": {
                      "selector": "[data-a-target=tw-checkbox]"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": "p",
                          "textFilter": [
                            "Create a personalised ads profile",
                            "Select personalised ads"
                          ]
                        }
                      },
                      "selector": ".Layout-sc-1xcs6mc-0.hkmaKt.fixed-width-title-and-toggle"
                    },
                    "retries": 10,
                    "waitTime": 250
                  },
                  {
                    "type": "foreach",
                    "target": {
                      "selector": ".Layout-sc-1xcs6mc-0.bSoSIm"
                    },
                    "action": {
                      "type": "list",
                      "actions": [
                        {
                          "type": "consent",
                          "consents": [
                            {
                              "matcher": {
                                "type": "checkbox",
                                "target": {
                                  "selector": "[data-a-target=tw-checkbox]"
                                },
                                "parent": {
                                  "childFilter": {
                                    "target": {
                                      "selector": "p",
                                      "textFilter": [
                                        "Store and/or access information on a device"
                                      ]
                                    }
                                  },
                                  "selector": ".Layout-sc-1xcs6mc-0.hkmaKt.fixed-width-title-and-toggle"
                                }
                              },
                              "toggleAction": {
                                "type": "click",
                                "target": {
                                  "selector": "[data-a-target=tw-checkbox]"
                                },
                                "parent": {
                                  "childFilter": {
                                    "target": {
                                      "selector": "p",
                                      "textFilter": [
                                        "Store and/or access information on a device"
                                      ]
                                    }
                                  },
                                  "selector": ".Layout-sc-1xcs6mc-0.hkmaKt.fixed-width-title-and-toggle"
                                }
                              },
                              "type": "D"
                            }
                          ]
                        },
                        {
                          "type": "consent",
                          "consents": [
                            {
                              "matcher": {
                                "type": "checkbox",
                                "target": {
                                  "selector": "[data-a-target=tw-checkbox]"
                                },
                                "parent": {
                                  "childFilter": {
                                    "target": {
                                      "selector": "p",
                                      "textFilter": [
                                        "Create a personalised ads profile",
                                        "Select personalised ads",
                                        "Measure ad performance",
                                        "Apply market research to generate audience insights"
                                      ]
                                    }
                                  },
                                  "selector": ".Layout-sc-1xcs6mc-0.hkmaKt.fixed-width-title-and-toggle"
                                }
                              },
                              "toggleAction": {
                                "type": "click",
                                "target": {
                                  "selector": "[data-a-target=tw-checkbox]"
                                },
                                "parent": {
                                  "childFilter": {
                                    "target": {
                                      "selector": "p",
                                      "textFilter": [
                                        "Create a personalised ads profile",
                                        "Select personalised ads",
                                        "Measure ad performance",
                                        "Apply market research to generate audience insights"
                                      ]
                                    }
                                  },
                                  "selector": ".Layout-sc-1xcs6mc-0.hkmaKt.fixed-width-title-and-toggle"
                                }
                              },
                              "type": "F"
                            }
                          ]
                        },
                        {
                          "type": "consent",
                          "consents": [
                            {
                              "matcher": {
                                "type": "checkbox",
                                "target": {
                                  "selector": "[data-a-target=tw-checkbox]"
                                },
                                "parent": {
                                  "childFilter": {
                                    "target": {
                                      "selector": "p",
                                      "textFilter": [
                                        "Create a personalised content profile",
                                        "Select personalised content",
                                        "Measure content performance"
                                      ]
                                    }
                                  },
                                  "selector": ".Layout-sc-1xcs6mc-0.hkmaKt.fixed-width-title-and-toggle"
                                }
                              },
                              "toggleAction": {
                                "type": "click",
                                "target": {
                                  "selector": "[data-a-target=tw-checkbox]"
                                },
                                "parent": {
                                  "childFilter": {
                                    "target": {
                                      "selector": "p",
                                      "textFilter": [
                                        "Create a personalised content profile",
                                        "Select personalised content",
                                        "Measure content performance"
                                      ]
                                    }
                                  },
                                  "selector": ".Layout-sc-1xcs6mc-0.hkmaKt.fixed-width-title-and-toggle"
                                }
                              },
                              "type": "E"
                            }
                          ]
                        },
                        {
                          "type": "consent",
                          "consents": [
                            {
                              "matcher": {
                                "type": "checkbox",
                                "target": {
                                  "selector": "[data-a-target=tw-checkbox]"
                                },
                                "parent": {
                                  "childFilter": {
                                    "target": {
                                      "selector": "p",
                                      "textFilter": [
                                        "Develop and improve products",
                                        "Actively scan device characteristics for identification"
                                      ]
                                    }
                                  },
                                  "selector": ".Layout-sc-1xcs6mc-0.hkmaKt.fixed-width-title-and-toggle"
                                }
                              },
                              "toggleAction": {
                                "type": "click",
                                "target": {
                                  "selector": "[data-a-target=tw-checkbox]"
                                },
                                "parent": {
                                  "childFilter": {
                                    "target": {
                                      "selector": "p",
                                      "textFilter": [
                                        "Develop and improve products",
                                        "Actively scan device characteristics for identification"
                                      ]
                                    }
                                  },
                                  "selector": ".Layout-sc-1xcs6mc-0.hkmaKt.fixed-width-title-and-toggle"
                                }
                              },
                              "type": "B"
                            }
                          ]
                        },
                        {
                          "type": "consent",
                          "consents": [
                            {
                              "matcher": {
                                "type": "checkbox",
                                "target": {
                                  "selector": "[data-a-target=tw-checkbox]"
                                },
                                "parent": {
                                  "childFilter": {
                                    "target": {
                                      "selector": "p",
                                      "textFilter": [
                                        "Use precise geolocation data"
                                      ]
                                    }
                                  },
                                  "selector": ".Layout-sc-1xcs6mc-0.hkmaKt.fixed-width-title-and-toggle"
                                }
                              },
                              "toggleAction": {
                                "type": "click",
                                "target": {
                                  "selector": "[data-a-target=tw-checkbox]"
                                },
                                "parent": {
                                  "childFilter": {
                                    "target": {
                                      "selector": "p",
                                      "textFilter": [
                                        "Use precise geolocation data"
                                      ]
                                    }
                                  },
                                  "selector": ".Layout-sc-1xcs6mc-0.hkmaKt.fixed-width-title-and-toggle"
                                }
                              },
                              "type": "X"
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": "[data-a-target=consent-modal-save]"
              }
            },
            {
              "type": "waitcss",
              "target": {
                "selector": "[data-a-target=consent-modal-save]"
              },
              "retries": 10,
              "waitTime": 250
            },
            {
              "type": "click",
              "target": {
                "selector": "[data-a-target=consent-modal-save]"
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "Ubuntu.com": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "dialog.cookie-policy #modal"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "dialog.cookie-policy #modal",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".cookie-policy"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".p-modal__dialog"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".js-manage"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": "div.u-sv3"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "list",
                "actions": [
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "h4",
                      "textFilter": [
                        "Performance"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "B"
                        }
                      ]
                    }
                  }
                ]
              },
              {
                "type": "list",
                "actions": [
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "h4",
                      "textFilter": [
                        "Functionality"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "A"
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".p-button.js-save-preferences"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "usercentrics": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".uc-banner-wrapper"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".uc-banner-wrapper",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#uc-btn-more-info-banner"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "waitcss",
              "target": {
                "selector": ".uc-inner-content"
              },
              "retries": 10,
              "waitTime": 250
            },
            {
              "type": "list",
              "actions": [
                {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": ".toggle-category-functional"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": ".toggle-category-functional"
                        }
                      },
                      "type": "A"
                    }
                  ]
                },
                {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": ".toggle-category-marketing"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": ".toggle-category-marketing"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "umf.dk": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "parent": null,
            "target": {
              "selector": "#portal-cookieoptout"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "parent": null,
            "target": {
              "selector": "#portal-cookieoptout"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "consents": [
            {
              "falseAction": {
                "target": {
                  "selector": "#portal-cookieoptout a[href='./#cookieoptout']"
                },
                "type": "click"
              },
              "trueAction": {
                "target": {
                  "selector": "#portal-cookieoptout a[href='./#cookieoptin']"
                },
                "type": "click"
              },
              "type": "B"
            }
          ],
          "type": "consent"
        },
        "name": "DO_CONSENT"
      }
    ]
  },
  "uniconsent": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "parent": null,
            "target": {
              "selector": ".unic .unic-box, .unic .unic-bar"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "parent": null,
            "target": {
              "selector": ".unic .unic-box, .unic .unic-bar"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "actions": [
            {
              "parent": null,
              "target": {
                "selector": ".unic .unic-box button, .unic .unic-bar button",
                "textFilter": "Manage Options"
              },
              "type": "waitcss"
            },
            {
              "parent": null,
              "target": {
                "selector": ".unic .unic-box button, .unic .unic-bar button",
                "textFilter": "Manage Options"
              },
              "type": "click"
            }
          ],
          "type": "list"
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "action": {
            "actions": [
              {
                "consents": [
                  {
                    "description": "Information storage and access",
                    "matcher": {
                      "parent": {
                        "selector": ".columns",
                        "textFilter": "Information storage and access"
                      },
                      "target": {
                        "selector": "input"
                      },
                      "type": "checkbox"
                    },
                    "toggleAction": {
                      "parent": {
                        "selector": ".columns",
                        "textFilter": "Information storage and access"
                      },
                      "target": {
                        "selector": "label"
                      },
                      "type": "click"
                    },
                    "type": "D"
                  },
                  {
                    "description": "Personalisation",
                    "matcher": {
                      "parent": {
                        "selector": ".columns",
                        "textFilter": "Personalisation"
                      },
                      "target": {
                        "selector": "input"
                      },
                      "type": "checkbox"
                    },
                    "toggleAction": {
                      "parent": {
                        "selector": ".columns",
                        "textFilter": "Personalisation"
                      },
                      "target": {
                        "selector": "label"
                      },
                      "type": "click"
                    },
                    "type": "E"
                  },
                  {
                    "description": "Ad selection, delivery, reporting",
                    "matcher": {
                      "parent": {
                        "selector": ".columns",
                        "textFilter": "Ad selection, delivery, reporting"
                      },
                      "target": {
                        "selector": "input"
                      },
                      "type": "checkbox"
                    },
                    "toggleAction": {
                      "parent": {
                        "selector": ".columns",
                        "textFilter": "Ad selection, delivery, reporting"
                      },
                      "target": {
                        "selector": "label"
                      },
                      "type": "click"
                    },
                    "type": "F"
                  },
                  {
                    "description": "Content selection, delivery, reporting",
                    "matcher": {
                      "parent": {
                        "selector": ".columns",
                        "textFilter": "Content selection, delivery, reporting"
                      },
                      "target": {
                        "selector": "input"
                      },
                      "type": "checkbox"
                    },
                    "toggleAction": {
                      "parent": {
                        "selector": ".columns",
                        "textFilter": "Content selection, delivery, reporting"
                      },
                      "target": {
                        "selector": "label"
                      },
                      "type": "click"
                    },
                    "type": "E"
                  },
                  {
                    "description": "Measurement",
                    "matcher": {
                      "parent": {
                        "selector": ".columns",
                        "textFilter": "Measurement"
                      },
                      "target": {
                        "selector": "input"
                      },
                      "type": "checkbox"
                    },
                    "toggleAction": {
                      "parent": {
                        "selector": ".columns",
                        "textFilter": "Measurement"
                      },
                      "target": {
                        "selector": "label"
                      },
                      "type": "click"
                    },
                    "type": "B"
                  }
                ],
                "type": "consent"
              },
              {
                "target": {
                  "selector": ".column",
                  "textFilter": "Google Personalization"
                },
                "trueAction": {
                  "consents": [
                    {
                      "description": "Google Personalization",
                      "matcher": {
                        "target": {
                          "selector": "input"
                        },
                        "type": "checkbox"
                      },
                      "toggleAction": {
                        "target": {
                          "selector": "label"
                        },
                        "type": "click"
                      },
                      "type": "F"
                    }
                  ],
                  "type": "consent"
                },
                "type": "ifcss"
              }
            ],
            "type": "list"
          },
          "target": {
            "selector": ".unic-purposes"
          },
          "type": "foreach"
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "parent": null,
          "target": {
            "selector": ".unic .unic-box button, .unic .unic-bar button",
            "textFilter": "Save Choices"
          },
          "type": "click"
        },
        "name": "SAVE_CONSENT"
      }
    ]
  },
  "Webedia": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "parent": null,
            "target": {
              "selector": ".app_gdpr--2k2uB"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "parent": null,
            "target": {
              "displayFilter": true,
              "selector": ".banner_banner--3pjXd"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "parent": null,
          "target": {
            "selector": ".banner_consent--2qj6F .button_invert--1bse9",
            "textFilter": "Gérer mes choix"
          },
          "type": "click"
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "actions": [
            {
              "retries": 50,
              "target": {
                "selector": ".popup_popup--1TXMW"
              },
              "type": "waitcss",
              "waitTime": 10
            },
            {
              "consents": [
                {
                  "description": "Information Storage and Access",
                  "matcher": {
                    "parent": {
                      "selector": ".summary_purposeItem--3WVlI",
                      "textFilter": "Conservation et accès aux informations"
                    },
                    "target": {
                      "selector": ".switch_native--3vL1-"
                    },
                    "type": "checkbox"
                  },
                  "toggleAction": {
                    "parent": {
                      "selector": ".summary_purposeItem--3WVlI",
                      "textFilter": "Conservation et accès aux informations"
                    },
                    "target": {
                      "selector": ".switch_native--3vL1-"
                    },
                    "type": "click"
                  },
                  "type": "D"
                },
                {
                  "description": "Preferences and Functionality",
                  "matcher": {
                    "parent": {
                      "selector": ".summary_purposeItem--3WVlI",
                      "textFilter": "Personnalisation"
                    },
                    "target": {
                      "selector": ".switch_native--3vL1-"
                    },
                    "type": "checkbox"
                  },
                  "toggleAction": {
                    "parent": {
                      "selector": ".summary_purposeItem--3WVlI",
                      "textFilter": "Personnalisation"
                    },
                    "target": {
                      "selector": ".switch_native--3vL1-"
                    },
                    "type": "click"
                  },
                  "type": "A"
                },
                {
                  "description": "Ad selection, delivery, and reporting",
                  "matcher": {
                    "parent": {
                      "selector": ".summary_purposeItem--3WVlI",
                      "textFilter": "Sélection, diffusion et signalement de publicités"
                    },
                    "target": {
                      "selector": ".switch_native--3vL1-"
                    },
                    "type": "checkbox"
                  },
                  "toggleAction": {
                    "parent": {
                      "selector": ".summary_purposeItem--3WVlI",
                      "textFilter": "Sélection, diffusion et signalement de publicités"
                    },
                    "target": {
                      "selector": ".switch_native--3vL1-"
                    },
                    "type": "click"
                  },
                  "type": "F"
                },
                {
                  "description": "Content selection, delivery, and reporting",
                  "matcher": {
                    "parent": {
                      "selector": ".summary_purposeItem--3WVlI",
                      "textFilter": "Sélection, diffusion et signalement de contenu"
                    },
                    "target": {
                      "selector": ".switch_native--3vL1-"
                    },
                    "type": "checkbox"
                  },
                  "toggleAction": {
                    "parent": {
                      "selector": ".summary_purposeItem--3WVlI",
                      "textFilter": "Sélection, diffusion et signalement de contenu"
                    },
                    "target": {
                      "selector": ".switch_native--3vL1-"
                    },
                    "type": "click"
                  },
                  "type": "E"
                },
                {
                  "description": "Performance and Analytics",
                  "matcher": {
                    "parent": {
                      "selector": ".summary_purposeItem--3WVlI",
                      "textFilter": "Évaluation"
                    },
                    "target": {
                      "selector": ".switch_native--3vL1-"
                    },
                    "type": "checkbox"
                  },
                  "toggleAction": {
                    "parent": {
                      "selector": ".summary_purposeItem--3WVlI",
                      "textFilter": "Évaluation"
                    },
                    "target": {
                      "selector": ".switch_native--3vL1-"
                    },
                    "type": "click"
                  },
                  "type": "B"
                }
              ],
              "type": "consent"
            }
          ],
          "type": "list"
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "parent": null,
          "target": {
            "selector": ".popup_content--2JBXA .details_save--1ja7w",
            "textFilter": "Valider et continuer sur le site"
          },
          "type": "click"
        },
        "name": "SAVE_CONSENT"
      }
    ]
  },
  "wordpressgdpr": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "parent": null,
            "target": {
              "selector": ".wpgdprc-consent-bar"
            },
            "type": "css"
          }
        ],
        "showingMatcher": [
          {
            "parent": null,
            "target": {
              "displayFilter": true,
              "selector": ".wpgdprc-consent-bar"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "parent": null,
          "target": {
            "selector": ".wpgdprc-consent-bar .wpgdprc-consent-bar__settings"
          },
          "type": "click"
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "actions": [
            {
              "target": {
                "selector": ".wpgdprc-consent-modal .wpgdprc-button",
                "textFilter": "Eyeota"
              },
              "type": "click"
            },
            {
              "consents": [
                {
                  "description": "Eyeota Cookies",
                  "matcher": {
                    "parent": {
                      "selector": ".wpgdprc-consent-modal__description",
                      "textFilter": "Eyeota"
                    },
                    "target": {
                      "selector": "input"
                    },
                    "type": "checkbox"
                  },
                  "toggleAction": {
                    "parent": {
                      "selector": ".wpgdprc-consent-modal__description",
                      "textFilter": "Eyeota"
                    },
                    "target": {
                      "selector": "label"
                    },
                    "type": "click"
                  },
                  "type": "X"
                }
              ],
              "type": "consent"
            },
            {
              "target": {
                "selector": ".wpgdprc-consent-modal .wpgdprc-button",
                "textFilter": "Advertising"
              },
              "type": "click"
            },
            {
              "consents": [
                {
                  "description": "Advertising Cookies",
                  "matcher": {
                    "parent": {
                      "selector": ".wpgdprc-consent-modal__description",
                      "textFilter": "Advertising"
                    },
                    "target": {
                      "selector": "input"
                    },
                    "type": "checkbox"
                  },
                  "toggleAction": {
                    "parent": {
                      "selector": ".wpgdprc-consent-modal__description",
                      "textFilter": "Advertising"
                    },
                    "target": {
                      "selector": "label"
                    },
                    "type": "click"
                  },
                  "type": "F"
                }
              ],
              "type": "consent"
            }
          ],
          "type": "list"
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "parent": null,
          "target": {
            "selector": ".wpgdprc-button",
            "textFilter": "Save my settings"
          },
          "type": "click"
        },
        "name": "SAVE_CONSENT"
      }
    ]
  },
  "whatsapp": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[data-testid='wa_cookies_banner_modal']"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[data-testid='wa_cookies_banner_modal']",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[data-cookiebanner='accept_button']"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "yahoo_popup": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#consent-page .con-wizard .consent-text",
              "textFilter": "Yahoo"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#consent-page a.manage-settings"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#consent-page a.manage-settings"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "yahoo_consent": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#consent-page .consent-form"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#consent-page .consent-form .title",
              "textFilter": "Yahoo"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": ".contentPersonalization .control input"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": ".contentPersonalization .control input"
                    }
                  },
                  "type": "E"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": ".accountMatching .control input"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": ".accountMatching .control input"
                    }
                  },
                  "type": "F"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": ".crossDeviceMapping .control input"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": ".crossDeviceMapping .control input"
                    }
                  },
                  "type": "D"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": ".oathAsThirdParty .control input"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": ".oathAsThirdParty .control input"
                    }
                  },
                  "type": "F"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": ".preciseGeolocation .control input"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": ".preciseGeolocation .control input"
                    }
                  },
                  "type": "D"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": ".firstPartyAds .control input"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": ".firstPartyAds .control input"
                    }
                  },
                  "type": "F"
                }
              ]
            },
            {
              "type": "foreach",
              "target": {
                "selector": ".iab-purposes-features .iab-purpose div[id^=\"purpose-\"], .iab-purposes-features .iab-special-feature div[id^=\"purpose-\"]"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": "input[data-toggle-type=\"legit\"]"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": "input[data-toggle-type=\"legit\"]"
                          }
                        },
                        "type": "X"
                      }
                    ]
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "checkbox",
                          "target": {
                            "selector": "input[data-toggle-type=\"consent\"]"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": "input[data-toggle-type=\"consent\"]"
                          }
                        },
                        "type": "X"
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".page-footer .actions button.secondary[value=\"save\"]"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "Metro.co.uk": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".overlay_el5_B .container_1gQfi.desktop_2jEgC"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".overlay_el5_B .container_1gQfi.desktop_2jEgC",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".container_rq1VM.desktop_3Chuh"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".content_2esEX"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".overlay_el5_B.fullHeight_1lRn9"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".button_127GD.basic_2XCed",
            "textFilter": [
              "Cookie Settings"
            ]
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": ".tab_WaV61",
                "textFilter": [
                  "Vendors"
                ]
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": ".toggle_CCyja.enabled_dYBnu"
                    },
                    "parent": {
                      "childFilter": {
                        "target": {
                          "selector": ".rowName_2bgmG",
                          "textFilter": [
                            "Exponential Interactive, Inc d/b/a VDX.tv"
                          ]
                        }
                      },
                      "selector": ".row_1uv8J"
                    }
                  },
                  "trueAction": {
                    "type": "click",
                    "target": {
                      "selector": "button",
                      "textFilter": [
                        "All On"
                      ]
                    },
                    "parent": {
                      "selector": ".toogleAllVendorsBtns_1X-b-"
                    }
                  },
                  "falseAction": {
                    "type": "click",
                    "target": {
                      "selector": "button",
                      "textFilter": [
                        "All off"
                      ]
                    },
                    "parent": {
                      "selector": ".toogleAllVendorsBtns_1X-b-"
                    }
                  },
                  "type": "X"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": ".tab_WaV61",
                "textFilter": [
                  "Purposes / Features"
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": ".rowName_2bgmG",
                    "textFilter": [
                      "Store and/or access information on a device"
                    ]
                  }
                },
                "selector": ".row_1uv8J"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "css",
                      "target": {
                        "selector": ".toggle_CCyja.enabled_dYBnu"
                      },
                      "parent": {
                        "childFilter": {
                          "target": {
                            "selector": ".toggleLabel_q9ZHS",
                            "textFilter": [
                              "Consent"
                            ]
                          }
                        },
                        "selector": ".toggleLabelWrapper_YUDu2"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": ".toggle_CCyja"
                      }
                    },
                    "type": "D"
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": ".rowName_2bgmG",
                    "textFilter": [
                      "Personalised ads and content, ad and content measurement, audience insights and product development"
                    ]
                  }
                },
                "selector": ".row_1uv8J"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "css",
                          "target": {
                            "selector": ".toggle_CCyja.enabled_dYBnu"
                          },
                          "parent": {
                            "childFilter": {
                              "target": {
                                "selector": ".toggleLabel_q9ZHS",
                                "textFilter": [
                                  "Legitimate interest"
                                ]
                              }
                            },
                            "selector": ".toggleLabelWrapper_YUDu2"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".toggle_CCyja.enabled_dYBnu"
                          },
                          "parent": {
                            "childFilter": {
                              "target": {
                                "selector": ".toggleLabel_q9ZHS",
                                "textFilter": [
                                  "Legitimate interest"
                                ]
                              }
                            },
                            "selector": ".toggleLabelWrapper_YUDu2"
                          }
                        },
                        "type": "F"
                      }
                    ]
                  },
                  {
                    "type": "consent",
                    "consents": [
                      {
                        "matcher": {
                          "type": "css",
                          "target": {
                            "selector": ".toggle_CCyja.enabled_dYBnu"
                          },
                          "parent": {
                            "childFilter": {
                              "target": {
                                "selector": ".toggleLabel_q9ZHS",
                                "textFilter": [
                                  "Consent"
                                ]
                              }
                            },
                            "selector": ".toggleLabelWrapper_YUDu2"
                          }
                        },
                        "toggleAction": {
                          "type": "click",
                          "target": {
                            "selector": ".toggle_CCyja"
                          },
                          "parent": {
                            "childFilter": {
                              "target": {
                                "selector": ".toggleLabel_q9ZHS",
                                "textFilter": [
                                  "Consent"
                                ]
                              }
                            },
                            "selector": ".toggleLabelWrapper_YUDu2"
                          }
                        },
                        "type": "F"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": ".rowName_2bgmG",
                    "textFilter": [
                      "Use precise geolocation data"
                    ]
                  }
                },
                "selector": ".row_1uv8J"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "css",
                      "target": {
                        "selector": ".toggle_CCyja.enabled_dYBnu"
                      },
                      "parent": {
                        "selector": ".toggleLabelWrapper_YUDu2"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": ".toggle_CCyja"
                      }
                    },
                    "type": "X"
                  }
                ]
              }
            },
            {
              "type": "foreach",
              "target": {
                "childFilter": {
                  "target": {
                    "selector": ".rowName_2bgmG",
                    "textFilter": [
                      "Actively scan device characteristics for identification"
                    ]
                  }
                },
                "selector": ".row_1uv8J"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "css",
                      "target": {
                        "selector": ".toggle_CCyja.enabled_dYBnu"
                      },
                      "parent": {
                        "selector": ".toggleLabelWrapper_YUDu2"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": ".toggle_CCyja"
                      }
                    },
                    "type": "X"
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".button_127GD",
            "textFilter": [
              "Save & Exit"
            ]
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "mitid": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#mitid-shared--cookie-warning-popup-modal-wrapper"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#mitid-shared--cookie-warning-popup-modal-wrapper",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "#mitid-shared--cookie-warning-popup-modal-wrapper, #mitid-shared--cookie-warning-popup-overlay"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#button-accept-cookie-policy"
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "mindfactory": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookieModalOverlay"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookieModalOverlay",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "#cookieModalOverlay"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".btn-default.collapsible"
          },
          "parent": {
            "selector": "#cookieModalOverlay"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "consent",
          "consents": [
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "[name='piwik']"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "[name='piwik']"
                }
              },
              "type": "F"
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#saveSettings"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "moneysavingexpert": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cookie-consent"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[data-testid='accept-our-cookies-dialog'], [aria-label='Cookie Notification']",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".blackout"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "[data-testid='accept-our-cookies-dialog']"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".preference-centre"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".cookie--btn-secondary"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": "[aria-controls^='panel-Analytics & tracking'], [aria-controls^='panel-Analytics & Tracking']"
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "[name='Analytics & tracking'], [name='Analytics & Tracking']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "[name='Analytics & tracking'], [name='Analytics & Tracking']"
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": "[aria-controls^='panel-Functional cookies']"
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "[name='Functional cookies']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "[name='Functional cookies']"
                    }
                  },
                  "type": "A"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": "[aria-controls^='panel-Marketing or advertising'], [aria-controls^='panel-Advertising']"
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "[name='Marketing or advertising'],[name='Advertising']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "[name='Marketing or advertising'],[name='Advertising']"
                    }
                  },
                  "type": "F"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": "[aria-controls^='panel-Social media cookies-4}']"
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "[name='Social media cookies']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "[name='Social media cookies']"
                    }
                  },
                  "type": "E"
                }
              ]
            },
            {
              "type": "click",
              "target": {
                "selector": "[aria-controls^='panel-Performance & Testing']"
              }
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "[name='Performance & Testing']"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "[name='Performance & Testing']"
                    }
                  },
                  "type": "B"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#pc-confirm"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "pricerunnerdk": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#consent",
              "textFilter": "Cookiepolitik"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#consent",
              "textFilter": "Cookiepolitik",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#consent button",
            "textFilter": "Indstillinger"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "childFilter": {
              "target": {
                "selector": ":scope > label > input[type=\"checkbox\"]"
              }
            },
            "selector": "div"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "ifcss",
                "target": {
                  "selector": "h2",
                  "textFilter": "Funktionelle cookies"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input[type=checkbox]"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input[type=checkbox]"
                        }
                      },
                      "type": "A"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "h2",
                  "textFilter": "Statistikcookies"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input[type=checkbox]"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input[type=checkbox]"
                        }
                      },
                      "type": "B"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "h2",
                  "textFilter": "Markedsføringscookies"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input[type=checkbox]"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input[type=checkbox]"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "div > div > div > div > div > div > button",
            "textFilter": "Gem indstillinger"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "pouch": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".container.cookie-notice-container"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".container.cookie-notice-container"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".cookie-notice"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".modal.is-active"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".cookie-notice-dismiss .is-default"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": ".choice.is-active .choice-label",
                      "textFilter": [
                        "Targeting"
                      ]
                    }
                  },
                  "trueAction": {
                    "type": "click",
                    "target": {
                      "selector": ".choice .choice-label",
                      "textFilter": [
                        "Targeting"
                      ]
                    }
                  },
                  "falseAction": {
                    "type": "click",
                    "target": {
                      "selector": ".choice .choice-label",
                      "textFilter": [
                        "Analytics & Performance"
                      ]
                    }
                  },
                  "type": "F"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": ".choice.is-active .choice-label",
                      "textFilter": [
                        "Analytics & Performance"
                      ]
                    }
                  },
                  "falseAction": {
                    "type": "click",
                    "target": {
                      "selector": ".choice .choice-label",
                      "textFilter": [
                        "Functionality"
                      ]
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": ".choice.is-active .choice-label",
                      "textFilter": [
                        "Functionality"
                      ]
                    }
                  },
                  "falseAction": {
                    "type": "click",
                    "target": {
                      "selector": ".choice .choice-label",
                      "textFilter": [
                        "Tracking"
                      ]
                    }
                  },
                  "type": "A"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": ".choice.is-active .choice-label",
                      "textFilter": [
                        "Functionality"
                      ]
                    }
                  },
                  "falseAction": {
                    "type": "click",
                    "target": {
                      "selector": ".choice .choice-label",
                      "textFilter": [
                        "Necessary"
                      ]
                    }
                  },
                  "type": "X"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".modal.is-active .button.is-primary"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "nordnetdk": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div[role=dialog][aria-labelledby=\"cookie-consent-title\"]"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div[role=dialog][aria-labelledby=\"cookie-consent-title\"]",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "div[role=dialog][aria-labelledby=\"cookie-consent-title\"] button",
            "textFilter": "Læs mere og tilpas mine præferencer"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": "li[class*=\"CookieConsentModal__StyledListItem\"]"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "ifcss",
                "target": {
                  "selector": "h4",
                  "textFilter": "Funktionelle cookies"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "css",
                        "target": {
                          "selector": "button[role=switch][aria-checked=true]"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "button[role=switch]"
                        }
                      },
                      "type": "A"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "h4",
                  "textFilter": "Analytiske cookies"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "css",
                        "target": {
                          "selector": "button[role=switch][aria-checked=true]"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "button[role=switch]"
                        }
                      },
                      "type": "B"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "h4",
                  "textFilter": "Cookies for markedsføring"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "css",
                        "target": {
                          "selector": "button[role=switch][aria-checked=true]"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "button[role=switch]"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "button",
            "textFilter": "Gem præferencer"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "nouvelobs": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".gdpr-glm-standard"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".gdpr-glm-standard"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".gdpr-glm-standard"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".gdpr-glm-params"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[data-gdpr-action='settings'].gdpr-glm-button"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": ".gdpr-glm-params__purpose"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "[data-gdpr-params-purpose='analytics']"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "[data-gdpr-params-purpose='analytics']"
                      }
                    },
                    "type": "B"
                  }
                ]
              },
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "[data-gdpr-params-purpose='social']"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "[data-gdpr-params-purpose='social']"
                      }
                    },
                    "type": "F"
                  }
                ]
              },
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "[data-gdpr-params-purpose='personalization']"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "[data-gdpr-params-purpose='personalization']"
                      }
                    },
                    "type": "E"
                  }
                ]
              },
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "[data-gdpr-params-purpose='ads']"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "[data-gdpr-params-purpose='ads']"
                      }
                    },
                    "type": "F"
                  }
                ]
              },
              {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "checkbox",
                      "target": {
                        "selector": "[data-gdpr-params-purpose='mediaPlatforms']"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": "[data-gdpr-params-purpose='mediaPlatforms']"
                      }
                    },
                    "type": "A"
                  }
                ]
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[data-gdpr-action='save']"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "nd.nl": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookieconsent.cookie-banner"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookieconsent.cookie-banner",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#cookieconsent"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".cookie-banner__inner"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".cookie-banner__inner__content__toolbar__settings"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#consent-analytics"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#consent-analytics"
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#consent-socialmedia"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#consent-socialmedia"
                    }
                  },
                  "type": "X"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#consent-advertisements"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#consent-advertisements"
                    }
                  },
                  "type": "F"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".cookie-banner__inner__content__settings__save"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "nordpoolgroup": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[ng-controller='CookieConsentKitController as cookieConsentCtrl'][id='main-content']"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[ng-controller='CookieConsentKitController as cookieConsentCtrl'][id='main-content']",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": ".cookie-button.active[ng-click*='persistent'][ng-click*='true']"
                    }
                  },
                  "trueAction": {
                    "type": "click",
                    "target": {
                      "selector": ".cookie-button[ng-click*='persistent'][ng-click*='true']"
                    }
                  },
                  "falseAction": {
                    "type": "click",
                    "target": {
                      "selector": ".cookie-button[ng-click*='persistent'][ng-click*='false']"
                    }
                  },
                  "type": "A"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": ".cookie-button.active[ng-click*='3rdparty'][ng-click*='true']"
                    }
                  },
                  "trueAction": {
                    "type": "click",
                    "target": {
                      "selector": ".cookie-button[ng-click*='3rdparty'][ng-click*='true']"
                    }
                  },
                  "falseAction": {
                    "type": "click",
                    "target": {
                      "selector": ".cookie-button[ng-click*='3rdparty'][ng-click*='false']"
                    }
                  },
                  "type": "F"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "multiclick",
          "target": {
            "selector": "[href='/en/']"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "nordpoolgroupopen": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookie-consent[ng-controller='CookieConsentKitController as cookieConsentCtrl']"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookie-consent[ng-controller='CookieConsentKitController as cookieConsentCtrl']",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "action": {
          "type": "ifcss",
          "target": {
            "selector": "[ng-controller='CookieConsentKitController as cookieConsentCtrl'][id='main-content']"
          },
          "falseAction": {
            "type": "click",
            "target": {
              "selector": "a[href]"
            }
          }
        },
        "name": "UTILITY"
      }
    ]
  },
  "danskebank": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div.cookie-consent-banner-modal"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div.cookie-consent-banner-modal",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": "#cookie-categories .input-set"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "ifcss",
                "target": {
                  "selector": "label",
                  "textFilter": "Funktionelle"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "A"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "label",
                  "textFilter": "Statistiske"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "B"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "label",
                  "textFilter": "Marketing"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "click",
              "target": {
                "selector": "#button-accept-selected",
                "displayFilter": true
              }
            },
            {
              "type": "click",
              "target": {
                "selector": "#button-accept-necessary",
                "displayFilter": true
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "june": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".modal-guts .cookie-headline"
            },
            "parent": {
              "selector": "#modal-tracking"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".modal-guts .cookie-headline",
              "displayFilter": true
            },
            "parent": {
              "selector": "#modal-tracking",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#modal-tracking"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#modal-overlay"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": ".flex-container"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "ifcss",
                "target": {
                  "selector": "#functional-cookies"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "A"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "#stats-cookies"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "B"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "#marketing-cookies"
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "E"
                    }
                  ]
                }
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#agreepartialbtn"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "kucmp": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "main.container.ccc-popup"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".ccc-popup-header"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#check-0"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#check-0"
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#check-1"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#check-1"
                    }
                  },
                  "type": "F"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "ifcss",
              "target": {
                "selector": ".btn",
                "textFilter": "Accept selected|Acceptér valgte"
              },
              "trueAction": {
                "type": "click",
                "target": {
                  "selector": ".btn",
                  "textFilter": "Accept selected|Acceptér valgte"
                }
              },
              "falseAction": {
                "type": "click",
                "target": {
                  "selector": ".btn",
                  "textFilter": "Reject all|Afslå alle"
                }
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "k-m.de": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".my_cookielayer_overlay"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".my_cookielayer_overlay",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".my_cookielayer_overlay"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".my_cookielayer"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#my_cookielayer_input_analyse"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#my_cookielayer_input_analyse"
                    }
                  },
                  "type": "B"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#my_cookielayer_input_marketing"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#my_cookielayer_input_marketing"
                    }
                  },
                  "type": "F"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".button.my_cookielayer_button_save"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "kk.dk": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".eu-cookie-compliance-banner"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".eu-cookie-compliance-banner",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "#sliding-popup"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#cookie-category-functional"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#cookie-category-functional"
                    }
                  },
                  "type": "A"
                }
              ]
            },
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#cookie-category-statistics"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#cookie-category-statistics"
                    }
                  },
                  "type": "B"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": ".eu-cookie-compliance-save-preferences-button"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "cookiewow": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cwc-banner-container"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cwc-banner-container",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "OPEN_OPTIONS",
        "action": {
          "type": "click",
          "target": {
            "selector": ".cwc-setting-button"
          }
        }
      },
      {
        "name": "DO_CONSENT",
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "type": "B",
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "selector": ".cwc-category-item",
                      "childFilter": {
                        "target": {
                          "selector": ".cwc-category-item-title",
                          "textFilter": [
                            "Analytics",
                            "คุกกี้ในส่วนวิเคราะห์",
                            "访问分析Cookie",
                            "トラフィック分析Cookie"
                          ]
                        }
                      }
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": ".cwc-switch"
                    },
                    "parent": {
                      "selector": ".cwc-category-item",
                      "childFilter": {
                        "target": {
                          "selector": ".cwc-category-item-title",
                          "textFilter": [
                            "Analytics",
                            "คุกกี้ในส่วนวิเคราะห์",
                            "访问分析Cookie",
                            "トラフィック分析Cookie"
                          ]
                        }
                      }
                    }
                  }
                },
                {
                  "type": "F",
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "input"
                    },
                    "parent": {
                      "selector": ".cwc-category-item",
                      "childFilter": {
                        "target": {
                          "selector": ".cwc-category-item-title",
                          "textFilter": [
                            "Marketing",
                            "คุกกี้ในส่วนการตลาด",
                            "访问分析Cookie",
                            "トラフィック分析Cookie"
                          ]
                        }
                      }
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": ".cwc-switch"
                    },
                    "parent": {
                      "selector": ".cwc-category-item",
                      "childFilter": {
                        "target": {
                          "selector": ".cwc-category-item-title",
                          "textFilter": [
                            "Marketing",
                            "คุกกี้ในส่วนการตลาด",
                            "访问分析Cookie",
                            "トラフィック分析Cookie"
                          ]
                        }
                      }
                    }
                  }
                }
              ]
            },
            {
              "type": "wait",
              "waitTime": 250
            }
          ]
        }
      },
      {
        "name": "SAVE_CONSENT",
        "action": {
          "type": "click",
          "target": {
            "selector": ".cwc-save-setting-wrapper button"
          }
        }
      },
      {
        "name": "HIDE_CMP",
        "action": {
          "type": "hide",
          "target": {
            "selector": ".cwc-sdk-container"
          }
        }
      }
    ]
  },
  "designilpdpa": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".dpdpa--popup"
            }
          }
        ],
        "showingMatcher": [
          {
            "target": {
              "selector": ".dpdpa--popup.active"
            },
            "type": "css"
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "OPEN_OPTIONS",
        "action": {
          "type": "click",
          "parent": {
            "selector": ".dpdpa--popup"
          },
          "target": {
            "selector": "#dpdpa--popup-button-settings"
          }
        }
      },
      {
        "name": "DO_CONSENT",
        "action": {
          "type": "consent",
          "consents": [
            {
              "type": "B",
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "input[type=checkbox]"
                },
                "parent": {
                  "selector": ".dpdpa--popup-header",
                  "childFilter": {
                    "target": {
                      "selector": ".dpdpa--popup-title",
                      "textFilter": [
                        "คุกกี้เพื่อการวิเคราะห์",
                        "Performance"
                      ]
                    }
                  }
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": ".dpdpa--popup-switch"
                },
                "parent": {
                  "selector": ".dpdpa--popup-header",
                  "childFilter": {
                    "target": {
                      "selector": ".dpdpa--popup-title",
                      "textFilter": [
                        "คุกกี้เพื่อการวิเคราะห์",
                        "Performance"
                      ]
                    }
                  }
                }
              }
            },
            {
              "type": "F",
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "input[type=checkbox]"
                },
                "parent": {
                  "selector": ".dpdpa--popup-header",
                  "childFilter": {
                    "target": {
                      "selector": ".dpdpa--popup-title",
                      "textFilter": [
                        "กลุ่มเป้าหมาย",
                        "Targeting"
                      ]
                    }
                  }
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": ".dpdpa--popup-switch"
                },
                "parent": {
                  "selector": ".dpdpa--popup-header",
                  "childFilter": {
                    "target": {
                      "selector": ".dpdpa--popup-title",
                      "textFilter": [
                        "กลุ่มเป้าหมาย",
                        "Targeting"
                      ]
                    }
                  }
                }
              }
            },
            {
              "type": "A",
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "input[type=checkbox]"
                },
                "parent": {
                  "selector": ".dpdpa--popup-header",
                  "childFilter": {
                    "target": {
                      "selector": ".dpdpa--popup-title",
                      "textFilter": [
                        "การใช้งานเว็บไซต์",
                        "Functional"
                      ]
                    }
                  }
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": ".dpdpa--popup-switch"
                },
                "parent": {
                  "selector": ".dpdpa--popup-header",
                  "childFilter": {
                    "target": {
                      "selector": ".dpdpa--popup-title",
                      "textFilter": [
                        "การใช้งานเว็บไซต์",
                        "Functional"
                      ]
                    }
                  }
                }
              }
            }
          ]
        }
      },
      {
        "name": "SAVE_CONSENT",
        "action": {
          "type": "click",
          "target": {
            "selector": "#pdpa_settings_confirm"
          }
        }
      },
      {
        "name": "HIDE_CMP",
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": ".dpdpa--alwayson"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".dpdpa--popup-sidebar"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": ".dpdpa--popup-bg"
              }
            }
          ]
        }
      }
    ]
  },
  "Facebook": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[data-testid=\"cookie-policy-manage-dialog\"]"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[data-testid=\"cookie-policy-manage-dialog\"]",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "[data-testid=\"cookie-policy-manage-dialog\"]"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "ifallowall",
          "trueAction": {
            "type": "click",
            "target": {
              "selector": "[data-cookiebanner=\"accept_only_essential_button\"]"
            }
          },
          "falseAction": {
            "type": "click",
            "target": {
              "selector": "[data-cookiebanner=\"accept_button\"]"
            }
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "gravito": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cmp-modal"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "[class^=gravito][class$=CMP-background-overlay]"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "[class^='gravito'][class*='CMP-background-overlay']"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "[class^='gravitoCMP-modal-layer']"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#modalSettingBtn"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "foreach",
              "target": {
                "selector": ".gravitoCMP-box,[class^='gravito'][class*='CMP-accordion-div']"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".gravitoCMP-box__title,[class^='gravito'][class*='box-title']",
                      "textFilter": [
                        "Tietojen tallennus laitteelle ja/tai laitteella olevien tietojen käyttö",
                        "Laitteen ominaisuuksien aktiivinen skannaus tunnistamista varten",
                        "Lagra och/eller få åtkomst till information på en enhet",
                        "Läsa av enhetens egenskaper aktivt för identifiering"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "D"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".gravitoCMP-box__title,[class^='gravito'][class*='box-title']",
                      "textFilter": [
                        "Tilastolliset evästeet",
                        "Yksilöivä analytiikka ja markkinointi",
                        "Yksilöivä analytiikka",
                        "Tarkkojen sijaintitietojen käyttö",
                        "Insamling av data",
                        "Utveckla och förbättra produkter",
                        "Statistical cookies",
                        "Analytics Cookies",
                        "Analytik",
                        "Analyytikkaevästeet",
                        "Análisis",
                        "Analytique"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "B"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[id*='LegitimateInterests']"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "[id*='LegitimateInterests']"
                            }
                          },
                          "type": "B"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".gravitoCMP-box__title,[class^='gravito'][class*='box-title']",
                      "textFilter": [
                        "Toiminnalliset evästeet",
                        "Functional cookies",
                        "Preference Cookies",
                        "Benutzereinstellungen",
                        "Asetusevästeet",
                        "Preferencia",
                        "Préférence"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "A"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".gravitoCMP-box__title,[class^='gravito'][class*='box-title']",
                      "textFilter": [
                        "Markkinointi",
                        "Markkinoinnin evästeet",
                        "Målgruppsanpassning och personifiering",
                        "Personoitu sisältö, sisällön mittaus, käyttäjäymmärrys ja tuotekehitys"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "E"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[id*='LegitimateInterests']"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "[id*='LegitimateInterests']"
                            }
                          },
                          "type": "E"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".gravitoCMP-box__title,[class^='gravito'][class*='box-title']",
                      "textFilter": [
                        "Personoitujen mainosten ja sisällön näyttäminen, mainonnan ja sisällön mittaus, käyttäjäymmärrys sekä tuotekehitys",
                        "Tavalliset mainokset ja mainonnan mittaus",
                        "Personoitu mainosprofiili ja personoitujen mainosten näyttäminen",
                        "Personanpassade annonser och innehåll, annons- och innehållsmätning samt målgruppsinsikter",
                        "Marketing & advertising cookies",
                        "Advertising Cookies",
                        "Marketing",
                        "Mainosevästeet",
                        "Publicitarias",
                        "Publicité"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "F"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[id*='LegitimateInterests']"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "[id*='LegitimateInterests']"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": ".gravitoCMP-box__title,[class^='gravito'][class*='box-title']",
                      "textFilter": [
                        "Använda exakta uppgifter om geografisk positionering"
                      ]
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "X"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[id*='LegitimateInterests']"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "[id*='LegitimateInterests']"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": "#gravitoCMP-tab-button-vendors"
              },
              "trueAction": {
                "type": "list",
                "actions": [
                  {
                    "type": "click",
                    "target": {
                      "selector": "#gravitoCMP-tab-button-vendors"
                    }
                  },
                  {
                    "type": "foreach",
                    "target": {
                      "selector": ".gravitoCMP-box"
                    },
                    "action": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[id^='vendorConsents'], [id^='nonTCFVendorsConsents']"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "[id^='vendorConsents'], [id^='nonTCFVendorsConsents']"
                            }
                          },
                          "type": "X"
                        },
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "[id^='vendorLegitimateInterests']"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "[id^='vendorLegitimateInterests']"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "ifcss",
              "target": {
                "selector": "#modalAcceptSelectedBtn"
              },
              "trueAction": {
                "type": "click",
                "target": {
                  "selector": "#modalAcceptSelectedBtn"
                }
              }
            },
            {
              "type": "ifcss",
              "target": {
                "selector": "#selectedSettingBtn"
              },
              "trueAction": {
                "type": "click",
                "target": {
                  "selector": "#selectedSettingBtn"
                }
              }
            }
          ]
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "Reddit": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "section a[href=\"https://www.redditinc.com/policies/cookie-notice\"]"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "section a[href=\"https://www.redditinc.com/policies/cookie-notice\"]",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "ifallowall",
          "trueAction": {
            "type": "click",
            "target": {
              "selector": "button",
              "textFilter": [
                "Accept all"
              ]
            },
            "parent": {
              "childFilter": {
                "target": {
                  "selector": "a[href=\"https://www.redditinc.com/policies/cookie-notice\"]"
                }
              },
              "selector": "section"
            }
          },
          "falseAction": {
            "type": "click",
            "target": {
              "selector": "button",
              "textFilter": [
                "Reject non-essential"
              ]
            },
            "parent": {
              "childFilter": {
                "target": {
                  "selector": "a[href=\"https://www.redditinc.com/policies/cookie-notice\"]"
                }
              },
              "selector": "section"
            }
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "Riadaljana": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "childFilter": {
                "target": {
                  "selector": ".refuse"
                }
              },
              "selector": ".content"
            },
            "parent": {
              "selector": ".cookies"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "childFilter": {
                "target": {
                  "selector": ".refuse"
                }
              },
              "selector": ".content",
              "displayFilter": true
            },
            "parent": {
              "selector": ".cookies"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "ifallowall",
          "trueAction": {
            "type": "click",
            "target": {
              "selector": ".ok"
            }
          },
          "falseAction": {
            "type": "click",
            "target": {
              "selector": ".refuse"
            }
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "Twitter": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div#layers span",
              "textFilter": [
                "Did someone say … cookies?"
              ]
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div#layers span",
              "textFilter": [
                "Did someone say … cookies?"
              ],
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "ifallowall",
          "trueAction": {
            "type": "click",
            "target": {
              "selector": "div[role=\"button\"]",
              "textFilter": [
                "Accept all cookies"
              ]
            },
            "parent": {
              "childFilter": {
                "target": {
                  "selector": "div > div > span",
                  "textFilter": [
                    "Did someone say … cookies?"
                  ]
                }
              },
              "selector": "div#layers"
            }
          },
          "falseAction": {
            "type": "click",
            "target": {
              "selector": "div[role=\"button\"]",
              "textFilter": [
                "Refuse non-essential cookies"
              ]
            },
            "parent": {
              "childFilter": {
                "target": {
                  "selector": "div > div > span",
                  "textFilter": [
                    "Did someone say … cookies?"
                  ]
                }
              },
              "selector": "div#layers"
            }
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "Volkswagen": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookiemgmt #ensModalWrapper"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookiemgmt #ensModalWrapper",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "#cookiemgmt #ensModalWrapper"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "consent",
          "consents": [
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#cookiemgmt #FunctionalSlide"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#cookiemgmt #FunctionalSlide"
                }
              },
              "type": "A"
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#cookiemgmt #StatisticsSlide"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#cookiemgmt #StatisticsSlide"
                }
              },
              "type": "B"
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#cookiemgmt #MarketingSlide"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#cookiemgmt #MarketingSlide"
                }
              },
              "type": "F"
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#cookiemgmt #ensSave",
            "displayFilter": true
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "wshop.com": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#cookiesLightbox.notAccepted"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#shadCookie.actif"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#shadCookie.actif"
              }
            },
            {
              "type": "hide",
              "target": {
                "selector": "#cookiesLightbox.notAccepted"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#cookiesLightbox .toggleCookiePrefs"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "consent",
          "consents": [
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#cookiesLightbox input[value=\"analytics\"]"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#cookiesLightbox input[value=\"analytics\"]"
                }
              },
              "type": "B"
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#cookiesLightbox input[value=\"marketing\"]"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#cookiesLightbox input[value=\"marketing\"]"
                }
              },
              "type": "X"
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "ifallownone",
          "trueAction": {
            "type": "click",
            "target": {
              "selector": "#cookiesLightbox #js_cookie_refuse"
            }
          },
          "falseAction": {
            "type": "click",
            "target": {
              "selector": "#cookiesLightbox #js_cookie_accept"
            }
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "Truendo": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#truendo_container div[class*=\"tru_cookie-dialog\"]"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#truendo_container div[class*=\"tru_cookie-dialog\"]",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "#truendo_container .truendo_panel"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#truendo_container #tru_options_btn"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "foreach",
          "target": {
            "selector": "#truendo_container .tru-expand"
          },
          "action": {
            "type": "list",
            "actions": [
              {
                "type": "ifcss",
                "target": {
                  "selector": "span",
                  "textFilter": [
                    "Marketing"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "F"
                    }
                  ]
                }
              },
              {
                "type": "ifcss",
                "target": {
                  "selector": "span",
                  "textFilter": [
                    "Social Sharing"
                  ]
                },
                "trueAction": {
                  "type": "consent",
                  "consents": [
                    {
                      "matcher": {
                        "type": "checkbox",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "toggleAction": {
                        "type": "click",
                        "target": {
                          "selector": "input"
                        }
                      },
                      "type": "A"
                    }
                  ]
                }
              }
            ]
          }
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#truendo_container [data-cy=\"action-button-save\"]"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "Fanatical": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div.cookie-collapsible div.cookie-collapsible-wrapper"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div.cookie-collapsible div.cookie-collapsible-wrapper",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "hide",
              "target": {
                "selector": "div.cookie-collapsible"
              }
            }
          ]
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "div.cookie-collapsible .settings-cookies-btn"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "waitcss",
              "target": {
                "selector": ".cookie-decleration-columns .column-tab-container"
              },
              "retries": 10,
              "waitTime": 250
            },
            {
              "type": "foreach",
              "target": {
                "selector": ".cookie-decleration-columns .column-tab-container"
              },
              "action": {
                "type": "list",
                "actions": [
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "input[name=\"preferences\"]"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "A"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "input[name=\"statistics\"]"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "B"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "input[name=\"marketing\"]"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "F"
                        }
                      ]
                    }
                  },
                  {
                    "type": "ifcss",
                    "target": {
                      "selector": "input[name=\"unclassified\"]"
                    },
                    "trueAction": {
                      "type": "consent",
                      "consents": [
                        {
                          "matcher": {
                            "type": "checkbox",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "toggleAction": {
                            "type": "click",
                            "target": {
                              "selector": "input"
                            }
                          },
                          "type": "X"
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "div.cookie-collapsible .accept-cookies-btn"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "Sundhed.dk": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "sdk-layout-main-cookiebox"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cookie-box",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "ifallowall",
          "trueAction": {
            "type": "click",
            "target": {
              "selector": "[ng-click='vm.acceptCookie()']"
            }
          },
          "falseAction": {
            "type": "click",
            "target": {
              "selector": "[ng-click='vm.rejectCookie()']"
            }
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "Setono Sylius": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "form#ws-consent"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "form#ws-consent",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "form#ws-consent"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "consent",
          "consents": [
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#ws-consent-f-togglePreferences input"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#ws-consent-f-togglePreferences input"
                }
              },
              "type": "A"
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#ws-consent-f-toggleStatistics input"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#ws-consent-f-toggleStatistics input"
                }
              },
              "type": "B"
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#ws-consent-f-toggleMarketing input"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#ws-consent-f-toggleMarketing input"
                }
              },
              "type": "F"
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "button#ws-consent-f-buttonUpdate"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "begadi.com": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cookie-footer"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".cookie-footer",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#cookies-filter-2"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#cookies-filter-2"
                    }
                  },
                  "type": "A"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#cookies-filter-3"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#cookies-filter-3"
                    }
                  },
                  "type": "B"
                },
                {
                  "matcher": {
                    "type": "checkbox",
                    "target": {
                      "selector": "#cookies-filter-4"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "#cookies-filter-4"
                    }
                  },
                  "type": "D"
                }
              ]
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "#cookie-right",
            "displayFilter": true
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "tweakers.net": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div#koekieBar"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "div#koekieBar:not(.koekie_bar_inactive)"
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "div#koekieBar button[data-action=\"configure\"]"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "list",
          "actions": [
            {
              "type": "consent",
              "consents": [
                {
                  "matcher": {
                    "type": "css",
                    "target": {
                      "selector": "div#koekieBar div.relevantAds .toggleSwitch:not(.on)"
                    }
                  },
                  "toggleAction": {
                    "type": "click",
                    "target": {
                      "selector": "div#koekieBar div.relevantAds .toggleSwitch"
                    }
                  },
                  "type": "F"
                }
              ]
            },
            {
              "type": "foreach",
              "target": {
                "selector": "div#koekieBar ul.vendors.optional li"
              },
              "action": {
                "type": "consent",
                "consents": [
                  {
                    "matcher": {
                      "type": "css",
                      "target": {
                        "selector": ".toggleSwitch:not(.on)"
                      }
                    },
                    "toggleAction": {
                      "type": "click",
                      "target": {
                        "selector": ".toggleSwitch"
                      }
                    },
                    "type": "X"
                  }
                ]
              }
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "div#koekieBar button[data-action=\"saveConfigured\"]"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  },
  "yle.fi": {
    "detectors": [
      {
        "presentMatcher": [
          {
            "type": "css",
            "target": {
              "selector": "#yle-consent-sdk-container"
            }
          }
        ],
        "showingMatcher": [
          {
            "type": "css",
            "target": {
              "selector": ".ycd-background",
              "displayFilter": true
            }
          }
        ]
      }
    ],
    "methods": [
      {
        "action": {
          "type": "hide",
          "target": {
            "selector": "#yle-consent-sdk-container .ycd-background"
          }
        },
        "name": "HIDE_CMP"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[name=select-consents]"
          }
        },
        "name": "OPEN_OPTIONS"
      },
      {
        "action": {
          "type": "consent",
          "consents": [
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#ycd_personalization"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#ycd_personalization"
                }
              },
              "type": "E"
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#ycd_development"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#ycd_development"
                }
              },
              "type": "B"
            },
            {
              "matcher": {
                "type": "checkbox",
                "target": {
                  "selector": "#ycd_embedded_social_media"
                }
              },
              "toggleAction": {
                "type": "click",
                "target": {
                  "selector": "#ycd_embedded_social_media"
                }
              },
              "type": "E"
            }
          ]
        },
        "name": "DO_CONSENT"
      },
      {
        "action": {
          "type": "click",
          "target": {
            "selector": "[name=accept-all-consents]"
          }
        },
        "name": "SAVE_CONSENT"
      },
      {
        "name": "UTILITY"
      }
    ]
  }
};
class Tools {
    static setBase(base) {
        Tools.base = base;
    }

    static getBase() {
        return Tools.base;
    }

    static findElement(options, parent = null, multiple = false) {
        let possibleTargets = null;

        if(options.selector.trim() === ":scope") {
            //Select current root
            if(parent != null) {
                possibleTargets = [parent];
            } else {
                if (Tools.base != null) {
                    possibleTargets = [Tools.base];
                } else {
                    possibleTargets = [document];
                }

            }

            if(ConsentEngine.debugValues.debugLog) {
                console.log("Special :scope handling, selecting current root:", possibleTargets);
            }
        } else {
            if (parent != null) {
                possibleTargets = Array.from(parent.querySelectorAll(options.selector));
            } else {
                if (Tools.base != null) {
                    possibleTargets = Array.from(Tools.base.querySelectorAll(options.selector));
                } else {
                    possibleTargets = Array.from(document.querySelectorAll(options.selector));
                }
            }
        }

        const clonedPossibleTargets = possibleTargets.slice();

        if (options.textFilter != null) {
            let filterMultipleSpacesRegex = /\s{2,}/gm;

            possibleTargets = possibleTargets.filter((possibleTarget) => {
                let textContent = possibleTarget.textContent.toLowerCase().replace(filterMultipleSpacesRegex, " ");

                if (Array.isArray(options.textFilter)) {
                    let foundText = false;

                    for (let text of options.textFilter) {
                        if (textContent.indexOf(text.toLowerCase().replace(filterMultipleSpacesRegex, " ")) !== -1) {
                            foundText = true;
                            break;
                        }
                    }

                    return foundText;
                } else if (options.textFilter != null) {
                    return textContent.indexOf(options.textFilter.toLowerCase()) !== -1;
                }
            });
        }

        if (options.styleFilters != null) {
            possibleTargets = possibleTargets.filter((possibleTarget) => {
                let styles = window.getComputedStyle(possibleTarget);

                let keep = true;

                for (let styleFilter of options.styleFilters) {
                    let option = styles[styleFilter.option]

                    if (styleFilter.negated) {
                        keep = keep && (option !== styleFilter.value);
                    } else {
                        keep = keep && (option === styleFilter.value);
                    }
                }

                return keep;
            });
        }

        if (options.displayFilter != null) {
            possibleTargets = possibleTargets.filter((possibleTarget) => {
                if(possibleTarget.matches(".ConsentOMatic-CMP-NoDetect")) {
                    return !options.displayFilter;
                }

                if(options.displayFilter) {
                    //We should be displayed
                    return possibleTarget.offsetHeight !== 0;
                } else {
                    //We should not be displayed
                    return possibleTarget.offsetHeight === 0;
                }
            });
        }

        if (options.iframeFilter != null) {
            possibleTargets = possibleTargets.filter((possibleTarget) => {
                if(options.iframeFilter) {
                    //We should be inside an iframe
                    return window.location !== window.parent.location;
                } else {
                    //We should not be inside an iframe
                    return window.location === window.parent.location;
                }
            });
        }

        if(options.childFilter != null) {
            possibleTargets = possibleTargets.filter((possibleTarget) => {
                let oldBase = Tools.base;
                Tools.setBase(possibleTarget);
                let childResults = Tools.find(options.childFilter);
                Tools.setBase(oldBase);
                if(options.childFilterNegated) {
                    return childResults.target == null;
                } else {
                    return childResults.target != null;
                }
            });
        }

        if(ConsentEngine.debugValues.debugLog) {
            console.groupCollapsed("findElement:", options.selector, possibleTargets.length);
            console.log("Options:", options, "Parent:", parent);
            console.log("Possible targets before filter: ", clonedPossibleTargets);
            console.log("Possible targets after filter: ", possibleTargets);
            console.log("Returned result:", multiple?possibleTargets:possibleTargets[0]);
            console.groupEnd();
        }

        if (multiple) {
            return possibleTargets;
        } else {
            if (possibleTargets.length > 1) {
                if(ConsentEngine.debugValues.debugLog) {
                    console.warn("Multiple possible targets: ", possibleTargets, options, parent);
                }
            }

            return possibleTargets[0];
        }
    }

    static find(options, multiple = false) {
        let results = [];
        if (options.parent != null) {
            let parent = Tools.findElement(options.parent, null, multiple);
            if (parent != null) {
                if (parent instanceof Array) {
                    parent.forEach((p) => {
                        let targets = Tools.findElement(options.target, p, multiple);
                        if (targets instanceof Array) {
                            targets.forEach((target) => {
                                results.push({
                                    "parent": p,
                                    "target": target
                                });
                            });
                        } else {
                            results.push({
                                "parent": p,
                                "target": targets
                            });
                        }
                    });

                    return results;
                } else {
                    let targets = Tools.findElement(options.target, parent, multiple);
                    if (targets instanceof Array) {
                        targets.forEach((target) => {
                            results.push({
                                "parent": parent,
                                "target": target
                            });
                        });
                    } else {
                        results.push({
                            "parent": parent,
                            "target": targets
                        });
                    }
                }
            }
        } else {
            let targets = Tools.findElement(options.target, null, multiple);
            if (targets instanceof Array) {
                targets.forEach((target) => {
                    results.push({
                        "parent": null,
                        "target": target
                    });
                });
            } else {
                results.push({
                    "parent": null,
                    "target": targets
                });
            }
        }

        if (results.length === 0) {
            results.push({
                "parent": null,
                "target": null
            });
        }

        if (multiple) {
            return results;
        } else {
            if (results.length !== 1) {
                console.warn("Multiple results found, even though multiple false", results);
            }

            return results[0];
        }
    }
}

Tools.base = null;
class Consent {
    constructor(config, cmp) {
        this.config = config;
        this.cmp = cmp;

        if(this.config.toggleAction != null) {
            this.toggleAction = Action.createAction(this.config.toggleAction, cmp);
        }

        if(this.config.matcher != null) {
            this.enabledMatcher = Matcher.createMatcher(this.config.matcher);
        }

        if(this.config.falseAction != null) {
            this.falseAction = Action.createAction(this.config.falseAction, cmp);
        }

        if(this.config.trueAction != null) {
            this.trueAction = Action.createAction(this.config.trueAction, cmp);
        }
    }

    async toggle() {
        return await this.toggleAction.execute();
    }

    isEnabled() {
        return this.enabledMatcher.matches();
    }

    async setEnabled(enabled) {
        if(this.toggleAction != null) {
            if(this.enabledMatcher == null) {
                //Toggle is only supported with a matcher
                if (ConsentEngine.debugValues.debugLog) {
                    throw new Error("Toggle consent action, without a matcher: "+JSON.stringify(this.config));
                }
                return;
            }
            try {
                if(this.isEnabled() !== enabled) {
                    await this.toggle();
                }
            } catch(e) {
                if (ConsentEngine.debugValues.debugLog) {
                    console.error("Error toggling:", e, this.config);
                }
            }
        } else {
            let handled = false;

            //If we have OnOffMatcher, we can reduce clicks to only happen when state is wrong
            if(this.enabledMatcher != null && this.enabledMatcher instanceof OnOffMatcher) {
                try {
                    if(this.isEnabled() && !enabled) {
                        await this.falseAction.execute();
                    } else if(!this.isEnabled() && enabled) {
                        await this.trueAction.execute();
                    }
                    handled = true;
                } catch(e) {
                    if (ConsentEngine.debugValues.debugLog) {
                        console.error("Error pushing on/off:", e, this.config);
                    }
                }
            }

            if(!handled) {
                if(enabled) {
                    await this.trueAction.execute();
                } else {
                    await this.falseAction.execute();
                }
            }
        }

        if (ConsentEngine.debugValues.paintMatchers) {
            if(this.enabledMatcher != null) {
                //Debug if state is correct
                await this.enabledMatcher.debug(enabled);
            }
        }
    }

    get type() {
        return this.config.type;
    }
}
class Action {
    static createAction(config, cmp) {
        try {
            switch (config.type) {
                case "click": return new ClickAction(config, cmp);
                case "multiclick": return new MultiClickAction(config, cmp);
                case "list": return new ListAction(config, cmp);
                case "consent": return new ConsentAction(config, cmp);
                case "ifcss": return new IfCssAction(config, cmp);
                case "waitcss": return new WaitCssAction(config, cmp);
                case "foreach": return new ForEachAction(config, cmp);
                case "hide": return new HideAction(config, cmp);
                case "slide": return new SlideAction(config, cmp);
                case "close": return new CloseAction(config, cmp);
                case "wait": return new WaitAction(config, cmp);
                case "ifallowall": return new IfAllowAllAction(config, cmp);
                case "ifallownone": return new IfAllowNoneAction(config, cmp);
                case "runrooted": return new RunRootedAction(config, cmp);
                case "runmethod": return new RunMethodAction(config, cmp);
                default: throw "Unknown action type: " + config.type;
            }
        } catch (e) {
            if(ConsentEngine.debugValues.debugLog) {
                console.error(e);
            }
            return new NopAction(config, cmp);
        }
    }

    constructor(config) {
        const self = this;

        this.config = config;

        if(ConsentEngine.debugValues.debugLog) {
            //Override execute, with logging variant
            let realExecute = this.execute;

            this.execute = async function (param) {
                self.logStart(param);
                try {
                    await realExecute.call(self, param);
                } catch (e) {
                    console.error(e);
                }
                self.logEnd();
            }
        }
    }

    get timeout() {
        if (this.config.timeout != null) {
            return this.config.timeout;
        } else {
            if (ConsentEngine.debugValues.clickDelay) {
                return 150;
            } else if(ConsentEngine.singleton.pipEnabled) {
                // Reduce click wait based on number of clicks
                if (ConsentEngine.singleton.getClicksSoFar()>100) return 0;
                if (ConsentEngine.singleton.getClicksSoFar()>20) return 1;
                if (ConsentEngine.singleton.getClicksSoFar()>5) return 10;
                return 100;
            } else {
                return 0;
            }
        }
    }

    logStart(param) {
        if (ConsentEngine.debugValues.debugLog) {
            console.group(this.constructor.name + ":", this.config, param);
        }
    }

    logEnd() {
        if (ConsentEngine.debugValues.debugLog) {
            console.groupEnd();
        }
    }

    async execute(param) {
        console.log("Remember to overrride execute()", this.constructor.name);
    }

    async waitTimeout(timeout) {
        return new Promise((resolve) => {
            setTimeout(() => { resolve(); }, timeout);
        });
    }

    getNumSteps() {
        console.warn("Missing getNumSteps on: "+this.constructor.name);
        return 0;
    }
}

class ListAction extends Action {
    constructor(config, cmp) {
        super(config);

        this.actions = [];
        config.actions.forEach((actionConfig) => {
            this.actions.push(Action.createAction(actionConfig, cmp));
        });
    }

    async execute(param) {
        for (let action of this.actions) {
            await action.execute(param);
        }
    }

    getNumSteps() {
        let steps = 0;

        this.actions.forEach((action)=>{
            steps += action.getNumSteps();
        });

        return steps;
    }
}

class CloseAction extends Action {
    constructor(config, cmp) {
        super(config);
    }

    async execute(param) {
        window.close();
        return 1; // Closing window counts as a click
    }

    getNumSteps() {
        return 1;
    }
}

class WaitAction extends Action {
    constructor(config, cmp) {
        super(config);
    }

    async execute(param) {
        let self = this;
        await new Promise((resolve, reject) => {
            setTimeout(() => { resolve() }, self.config.waitTime);
        });
    }

    getNumSteps() {
        return 1;
    }
}

class ClickAction extends Action {
    constructor(config, cmp) {
        super(config);
        this.cmp = cmp;
    }

    async execute(param) {
        let result = Tools.find(this.config);

        if (result.target != null) {
            let pipScroll = false;
            if(ConsentEngine.singleton.pipEnabled) {
                pipScroll = result.target.closest(".ConsentOMatic-CMP-PIP") != null;
            }
    
            let isShowing = result.target.offsetHeight !== 0;

            if (isShowing && (ConsentEngine.debugValues.clickDelay || pipScroll)) {
                result.target.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "center"
                });
            }

            if(isShowing && this.config.noTimeout !== true) {
                await this.waitTimeout(this.timeout);
            }

            if (ConsentEngine.debugValues.debugClicks) {
                console.log("Clicking: [openInTab: " + this.config.openInTab + "]", result.target);
            }

            if (ConsentEngine.debugValues.clickDelay || pipScroll) {
                result.target.focus({ preventScroll: true });
            }

            if (this.config.openInTab) {
                //Handle osx behaving differently?
                result.target.dispatchEvent(new MouseEvent("click", { ctrlKey: true, shiftKey: true }));
            } else {
                result.target.click();
            }

            ConsentEngine.singleton.registerClick();

            if(isShowing && this.config.noTimeout !== true) {
                await this.waitTimeout(this.timeout);
            }
        }
    }

    getNumSteps() {
        return 1;
    }
}

class MultiClickAction extends Action {
    constructor(config, cmp) {
        super(config);
        this.cmp = cmp;
    }

    async execute(param) {
        let results = Tools.find(this.config, true);
        if (ConsentEngine.debugValues.debugClicks) {
            console.log("MultiClicking:", results);
        }
	results.forEach(result=>{
	    if (result.target!=null){
		result.target.click();
	    }
	});
        
        // TODO: Register more clicks simultaneously
	results.forEach(result=>{
	    if (result.target!=null){
    		ConsentEngine.singleton.registerClick();
    	    }
    	});
        
        // TODO: Consider how this should be shown in PiP?
    }

    getNumSteps() {
        return 50; // STUB: Poor estimate
    }
}

class ConsentAction extends Action {
    constructor(config, cmp) {
        super(config);

        let self = this;

        this.consents = [];

        this.config.consents.forEach((consentConfig) => {
            self.consents.push(new Consent(consentConfig, cmp));
        });
    }

    async execute(consentTypes) {
        for (let consent of this.consents) {
            let shouldBeEnabled = false;

            if (consentTypes.hasOwnProperty(consent.type)) {
                shouldBeEnabled = consentTypes[consent.type];
            }

            await consent.setEnabled(shouldBeEnabled);
        }
    }

    getNumSteps() {
        return 1;
    }
}

class IfCssAction extends Action {
    constructor(config, cmp) {
        super(config);

        if (config.trueAction != null) {
            this.trueAction = Action.createAction(config.trueAction, cmp);
        }

        if (config.falseAction != null) {
            this.falseAction = Action.createAction(config.falseAction, cmp);
        }
    }

    async execute(param) {
        let result = Tools.find(this.config);

        if (result.target != null) {
            if (this.trueAction != null) {
                await this.trueAction.execute(param);
            }
        } else {
            if (this.falseAction != null) {
                await this.falseAction.execute(param);
            }
        }
    }

    getNumSteps() {
        let steps = 0;

        if(this.trueAction != null) {
            steps += this.trueAction.getNumSteps();
        }

        if(this.falseAction != null) {
            steps += this.falseAction.getNumSteps();
        }

        return Math.round(steps / 2);
    }
}

class WaitCssAction extends Action {
    constructor(config, cmp) {
        super(config);
    }

    async execute(param) {
        let self = this;
        let negated = false;

        if (self.config.negated) {
            negated = self.config.negated;
        }

        if (ConsentEngine.debugValues.debugLog) {
            console.time("Waiting [" + negated + "]:" + this.config.target.selector);
        }

        await new Promise((resolve) => {
            let numRetries = 10;
            let waitTime = 250;

            if (self.config.retries) {
                numRetries = self.config.retries;
            }

            if (self.config.waitTime) {
                waitTime = self.config.waitTime;
            }

            function checkCss() {
                let result = Tools.find(self.config);

                if (negated) {
                    if (result.target != null) {
                        if (numRetries > 0) {
                            numRetries--;
                            setTimeout(checkCss, waitTime);
                        } else {
                            if (ConsentEngine.debugValues.debugLog) {
                                console.timeEnd("Waiting [" + negated + "]:" + self.config.target.selector);
                            }
                            resolve();
                        }
                    } else {
                        if (ConsentEngine.debugValues.debugLog) {
                            console.timeEnd("Waiting [" + negated + "]:" + self.config.target.selector);
                        }
                        resolve();
                    }
                } else {
                    if (result.target != null) {
                        if (ConsentEngine.debugValues.debugLog) {
                            console.timeEnd("Waiting [" + negated + "]:" + self.config.target.selector);
                        }
                        resolve();
                    } else {
                        if (numRetries > 0) {
                            numRetries--;
                            setTimeout(checkCss, waitTime);
                        } else {
                            if (ConsentEngine.debugValues.debugLog) {
                                console.timeEnd("Waiting [" + negated + "]:" + self.config.target.selector);
                            }
                            resolve();
                        }
                    }
                }
            }

            checkCss();
        });
    }

    getNumSteps() {
        return 1;
    }
}

class NopAction extends Action {
    constructor(config, cmp) {
        super(config);
    }

    async execute(param) {
        //NOP
    }

    getNumSteps() {
        return 0;
    }
}

class ForEachAction extends Action {
    constructor(config, cmp) {
        super(config);

        if(this.config.action != null) {
            this.action = Action.createAction(this.config.action, cmp);
        } else {
            console.warn("Missing action on ForEach: ", this);
        }
    }

    async execute(param) {
        if(this.action != null) {
            let results = Tools.find(this.config, true);
            let oldBase = Tools.base;

            for (let result of results) {
                if (result.target != null) {
                    Tools.setBase(result.target);
                    await this.action.execute(param);
                }
            }

            Tools.setBase(oldBase);
        }
    }

    getNumSteps() {
        if(this.action != null) {
            return this.action.getNumSteps();
        }

        return 0;
    }
}

class HideAction extends Action {
    constructor(config, cmp) {
        super(config);
        this.cmp = cmp;
    }

    async execute(param) {
        if(ConsentEngine.debugValues.skipHideMethod) {
            return;
        }

        let self = this;
        let result = Tools.find(this.config);

        if (result.target != null) {
            this.cmp.hiddenTargets.push(result.target);

            if(this.config.hideFromDetection === true) {
                result.target.classList.add("ConsentOMatic-CMP-NoDetect");
            }

            if(ConsentEngine.generalSettings.hideInsteadOfPIP || this.config.forceHide === true) {
                result.target.classList.add("ConsentOMatic-CMP-Hider");
            } else {
                ConsentEngine.singleton.enablePip();
                result.target.classList.add("ConsentOMatic-CMP-PIP");
                
                if(typeof result.target.savedStyles === "undefined") {
                    result.target.savedStyles = result.target.getAttribute("style");
                }

                function setStyles() {
                    if(!result.target.matches(".ConsentOMatic-CMP-PIP")) {
                        return;
                    }

                    let preview = document.querySelector(".ConsentOMatic-Progres-Preview");
                    let scale = 0.25;
                    if(preview != null) {
                        let width = preview.offsetWidth - 4;
                        let height = preview.offsetHeight - 4;
    
                        let targetWidth = result.target.offsetWidth;
                        let targetHeight = result.target.offsetHeight;
    
                        if(result.target.offsetHeight === 0) {
                            result.target.style.setProperty("height", "100%", "important");
                            targetHeight = result.target.offsetHeight;
                        }

                        let widthScale = width / targetWidth;
                        let heightScale = height / targetHeight;
    
                        scale = Math.min(widthScale, heightScale);
                    }
    
                    result.target.style.setProperty("position", "fixed", "important");
                    result.target.style.setProperty("left", "initial","important");
                    result.target.style.setProperty("top","initial","important");
                    result.target.style.setProperty("right",  "0px", "important");
                    result.target.style.setProperty("bottom", "2px", "important");
                    result.target.style.setProperty("transform", "translateY(-4rem) scale("+scale+")", "important");
                    result.target.style.setProperty("transform-origin", "right bottom", "important");
                    result.target.style.setProperty("transition", "transform 0.15s ease-in-out", "important");
                    result.target.style.setProperty("contain", "paint", "important");
                    result.target.style.setProperty("border", "none", "important");
                    result.target.style.setProperty("box-shadow", "none", "important");
                    result.target.style.setProperty("z-index", "2147483647", "important");
                    result.target.style.setProperty("grid-column", "none", "important");
                    result.target.style.setProperty("grid-row", "none", "important");
                }

                setStyles();

                await new Promise((resolve)=>{
                    requestAnimationFrame(()=>{
                        resolve();
                    });
                });

                let entriesSeen = new Set();

                let observer = new ResizeObserver((entries)=>{
                    for(let entry of entries) {
                        if(!entriesSeen.has(entry.target)) {
                            entriesSeen.add(entry.target);
                        } else {
                            setStyles();
                        }
                    }
                });

                startObserver();

                function startObserver() {
                    entriesSeen.clear();
                    observer.observe(result.target);
                }

                this.cmp.observers.push(observer);

                let observer2 = new MutationObserver((mutations)=>{
                    setStyles();
                });

                this.cmp.observers.push(observer2);
                observer2.observe(result.target, {
                    attributes: true,
                    attributeFilter: ["style"]
                });
            }
        }
    }

    getNumSteps() {
        return 1;
    }
}

class SlideAction extends Action {
    constructor(config, cmp) {
        super(config);
        this.cmp = cmp;
    }

    async execute(param) {
        let result = Tools.find(this.config);

        let dragResult = Tools.find(this.config.dragTarget);

        if (result.target != null) {
            let targetBounds = result.target.getBoundingClientRect();
            let dragTargetBounds = dragResult.target.getBoundingClientRect();

            let yDiff = dragTargetBounds.top - targetBounds.top;
            let xDiff = dragTargetBounds.left - targetBounds.left;

            if (this.config.axis.toLowerCase() === "y") {
                xDiff = 0;
            }
            if (this.config.axis.toLowerCase() === "x") {
                yDiff = 0;
            }

            let screenX = window.screenX + targetBounds.left + targetBounds.width / 2.0;
            let screenY = window.screenY + targetBounds.top + targetBounds.height / 2.0;
            let clientX = targetBounds.left + targetBounds.width / 2.0;
            let clientY = targetBounds.top + targetBounds.height / 2.0;

            let mouseDown = document.createEvent("MouseEvents");
            mouseDown.initMouseEvent(
                "mousedown",
                true,
                true,
                window,
                0,
                screenX,
                screenY,
                clientX,
                clientY,
                false,
                false,
                false,
                false,
                0,
                result.target
            );

            let mouseMove = document.createEvent("MouseEvents");
            mouseMove.initMouseEvent(
                "mousemove",
                true,
                true,
                window,
                0,
                screenX + xDiff,
                screenY + yDiff,
                clientX + xDiff,
                clientY + yDiff,
                false,
                false,
                false,
                false,
                0,
                result.target
            );

            let mouseUp = document.createEvent("MouseEvents");
            mouseUp.initMouseEvent(
                "mouseup",
                true,
                true,
                window,
                0,
                screenX + xDiff,
                screenY + yDiff,
                clientX + xDiff,
                clientY + yDiff,
                false,
                false,
                false,
                false,
                0,
                result.target
            );

            result.target.dispatchEvent(mouseDown);
            await this.waitTimeout(10);
            result.target.dispatchEvent(mouseMove);
            await this.waitTimeout(10);
            result.target.dispatchEvent(mouseUp);
            ConsentEngine.singleton.registerClick();
        }
    }

    getNumSteps() {
        return 1;
    }
}

class IfAllowAllAction extends Action {
    constructor(config, cmp) {
        super(config);
        this.cmp = cmp;
 
        if (config.trueAction != null) {
            this.trueAction = Action.createAction(config.trueAction, cmp);
        }

        if (config.falseAction != null) {
            this.falseAction = Action.createAction(config.falseAction, cmp);
        }
    }

    async execute(consentTypes) {
        let allTrue = true;
        Object.keys(consentTypes).forEach((key)=>{
            let value = consentTypes[key];

            if(value === false) {
                allTrue = false;
            }
        });

        if (allTrue) {
            if (this.trueAction != null) {
                await this.trueAction.execute(consentTypes);
            }
        } else {
            if (this.falseAction != null) {
                await this.falseAction.execute(consentTypes);
            }
        }
    }

    getNumSteps() {
        let steps = 0;

        if(this.trueAction != null) {
            steps += this.trueAction.getNumSteps();
        }

        if(this.falseAction != null) {
            steps += this.falseAction.getNumSteps();
        }

        return Math.round(steps / 2);
    }
}

class IfAllowNoneAction extends Action {
    constructor(config, cmp) {
        super(config);
        this.cmp = cmp;
 
        if (config.trueAction != null) {
            this.trueAction = Action.createAction(config.trueAction, cmp);
        }

        if (config.falseAction != null) {
            this.falseAction = Action.createAction(config.falseAction, cmp);
        }
    }

    async execute(consentTypes) {
        let allFalse = true;

        Object.keys(consentTypes).forEach((key)=>{
            let value = consentTypes[key];

            if(value === true) {
                allFalse = false;
            }
        });

        if (allFalse) {
            if (this.trueAction != null) {
                await this.trueAction.execute(consentTypes);
            }
        } else {
            if (this.falseAction != null) {
                await this.falseAction.execute(consentTypes);
            }
        }
    }

    getNumSteps() {
        let steps = 0;

        if(this.trueAction != null) {
            steps += this.trueAction.getNumSteps();
        }

        if(this.falseAction != null) {
            steps += this.falseAction.getNumSteps();
        }

        return Math.round(steps / 2);
    }
}

class RunRootedAction extends Action {
    constructor(config, cmp) {
        super(config);
        this.cmp = cmp;

        if(this.config.action != null) {
            this.action = Action.createAction(this.config.action, cmp);
        } else {
            console.warn("Missing action on RunRooted: ", this);
        }
    }

    async execute(params) {
        if(this.config.action != null) {

            //Save root
            let oldRoot = Tools.getBase();

            //Reset to null root
            if(this.config.ignoreOldRoot === true) {
                Tools.setBase(null);
            }

            //Find new root
            let result = Tools.find(this.config);

            if(result.target != null) {
                //Set new root
                Tools.setBase(result.target);
                
                //RUN
                await this.action.execute(params);
            }

            //Set old base back
            Tools.setBase(oldRoot);
        }
    }

    getNumSteps() {
        if(this.action != null) {
            return this.action.getNumSteps();
        }

        return 0;
    }
}

class RunMethodAction extends Action {
    constructor(config, cmp) {
        super(config);
        this.cmp = cmp;
    }

    async execute(params) {
        if(this.config.method == null) {
            console.warn("Missing option 'method' on RunMethodAction");
            return;
        }

        let methodName = this.config.method.toUpperCase();

        if(!this.cmp.hasMethod(methodName)) {
            console.warn("CMP does not have method ["+methodName+"]", this.cmp);
            return;
        }

        if(!this.cmp.isCustomMethod(methodName)) {
            console.warn("CMP method ["+methodName+"] is not a custom method!");
            return;
        }

        await this.cmp.runMethod(methodName, params);
    }

    getNumSteps() {
        if(this.cmp.hasMethod(this.config.method)) {
            return this.cmp.getNumStepsForMethod(this.config.method);
        }

        return 0;
    }
}class Matcher {
    static createMatcher(config) {
        switch(config.type) {
            case "css": return new CssMatcher(config);
            case "checkbox": return new CheckboxMatcher(config);
            case "url": return new URLMatcher(config);
            case "onoff": return new OnOffMatcher(config);
            default: {
                throw new Error("Unknown matcher type: "+config.type);
            }
        }
    }

    constructor(config) {
        this.config = config;
    }

    matches() {
        console.log("Remember to override matches()");
    }

    async debug(shouldMatch) {
        let result = Tools.find(this.config);

        let blinker = result.parent || result.target;

        if(blinker != null) {
            if(blinker.matches("input")) {
                blinker = blinker.parentNode;
            }

            let matches = this.matches();
            let correct = shouldMatch === matches;

            if (ConsentEngine.debugValues.clickDelay) {
                blinker.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "center"
                });
            }

            if(correct) {
                blinker.style.border = "2px solid lime";
                blinker.style.backgroundColor = "lime";
            } else {
                blinker.style.border = "2px solid pink";
                blinker.style.backgroundColor = "pink";
            }

            await new Promise((resolve, reject)=>{
                if (ConsentEngine.debugValues.clickDelay) {
                        setTimeout(()=>{
                        resolve();
                    }, 10);
                } else {
                    resolve();
                }
            });
        }
    }
}

class OnOffMatcher extends Matcher {
    constructor(config) {
        super(config);
    }

    matches() {
        if(this.config.onMatcher == null || this.config.offMatcher == null) {
            throw new Error("Missing onMatcher/offMatcher on OnOffMatcher: "+JSON.stringify(this.config));
        }

        let onResult = Tools.find(this.config.onMatcher);
        let offResult = Tools.find(this.config.offMatcher);

        if(onResult.target == null && offResult.target == null) {
            throw new Error("Did not find neither on or off targets: "+JSON.stringify(this.config));
        }

        if(onResult.target != null && offResult.target != null) {
            throw new Error("Found both on and off targets: "+JSON.stringify(this.config));
        }

        return onResult.target != null;
    }

    async debug(shouldMatch) {
        let onResult = Tools.find(this.config.onMatcher);
        let offResult = Tools.find(this.config.offMatcher);

        let blinker = [];

        if(onResult.target == null && offResult.target == null) {
            //Neither On nor Off was found, this is wrong, but we have nothing to highlight.
            return;
        }

        if(onResult.target != null && offResult.target != null) {
            //Both On and Off was found, this is wrong!
            blinker.push({target: onResult.target, currect: false});
            blinker.push({target: offResult.target, currect: false});
        } else {
            //Since not both was null, and not both was not null, excactly 1 is not null

            if(shouldMatch) {
                if(onResult.target != null) {
                    blinker.push({target: onResult.target, correct: true});
                } else {
                    blinker.push({target: offResult.target, correct: false});
                }
            } else {
                if(onResult.target != null) {
                    blinker.push({target: onResult.target, correct: false});
                } else {
                    blinker.push({target: offResult.target, correct: true});
                }
            }
        }

        for(let result of blinker) {
            if(result.correct) {
                result.target.style.setProperty("border", "2px solid lime", "important");
                result.target.style.setProperty("background-color", "lime", "important");
            } else {
                result.target.style.setProperty("border", "2px solid pink", "important");
                result.target.style.setProperty("background-color", "pink", "important");
            }

            await new Promise((resolve, reject)=>{
                if (ConsentEngine.debugValues.clickDelay) {
                        setTimeout(()=>{
                        resolve();
                    }, 10);
                } else {
                    resolve();
                }
            });
        }
    }
}

class CssMatcher extends Matcher {
    constructor(config) {
        super(config);
    }

    matches() {
        let result = Tools.find(this.config);

        return result.target != null;
    }
}

class CheckboxMatcher extends Matcher {
    constructor(config) {
        super(config);
    }

    matches() {
        let result = Tools.find(this.config);
        
        if(result.target == null) {
            //No checkbox found, error
            throw new Error("No checkbox found, cannot check state");
        }

        if(this.config.negated) {
            return !result.target.checked;
        }

        return result.target.checked;
    }
}

class URLMatcher extends Matcher {
    constructor(config) {
        super(config);
    }

    debug() {
        //Overriden to disable
    }

    matches() {
        if (ConsentEngine.debugValues.debugLog) {
            console.log("URL Matcher:", ConsentEngine.topFrameUrl, this.config);
        }

        let urls = this.config.url;
        if(!Array.isArray(urls)) {
            urls = [urls];
        }

        let matched = false;
        
        if(this.config.regexp) {
            for(let url of urls) {
                let regexp = new RegExp(url);
                if(regexp.exec(ConsentEngine.topFrameUrl) !== null) {
                    if (ConsentEngine.debugValues.debugLog) {
                        console.log("Matched URL regexp:", url);
                    }
                    matched = true;
                    break;
                }
            }
        } else {
            for(let url of urls) {
                if(ConsentEngine.topFrameUrl.indexOf(url) > -1) {
                    if (ConsentEngine.debugValues.debugLog) {
                        console.log("Matched URL:", url);
                    }
                    matched = true;
                    break;
                }
            }
        }

        if(this.config.negated) {
            //If the matcher should be negated, negate matched
            matched = !matched;
        }

        if (ConsentEngine.debugValues.debugLog) {
            console.log("Did URLMatcher match (after negate):", matched);
        }

        return matched;
    }
}
class Detector {
    constructor(config) {
        this.config = config;

        this.presentMatchers = [];
        this.showingMatchers = [];

        if(!Array.isArray(this.config.presentMatcher)) {
            this.config.presentMatcher = [this.config.presentMatcher];
        }
        if(!Array.isArray(this.config.showingMatcher)) {
            this.config.showingMatcher = [this.config.showingMatcher];
        }

        this.config.presentMatcher.forEach((matcher)=>{
            if(matcher != null) {
                this.presentMatchers.push(Matcher.createMatcher(matcher));
            }
        });
        this.config.showingMatcher.forEach((matcher)=>{
            if(matcher != null) {
                this.showingMatchers.push(Matcher.createMatcher(matcher));
            }
        });
    }

    detect() {
        if(this.presentMatchers.length === 0) {
            return false;
        }

        return this.presentMatchers.every((matcher)=>{
            return matcher.matches();
        });
    }

    isShowing() {
        if(this.showingMatchers.length === 0) {
            return true;
        }

        return this.showingMatchers.every((matcher)=>{
            return matcher.matches();
        });
    }
}
class CMP {
    constructor(name, config) {
        let self = this;

        this.name = name;

        this.detectors = [];
        config.detectors.forEach((detectorConfig)=>{
            self.detectors.push(new Detector(detectorConfig));
        });

        this.methods = new Map();
        config.methods.forEach((methodConfig)=>{
            if(methodConfig.action != null) {
                let action = Action.createAction(methodConfig.action, this);
                action.customMethod = methodConfig.custom;
                self.methods.set(methodConfig.name, action);
            }
        });

        this.hiddenTargets = [];
        this.observers = [];
    }

    stopObservers() {
        this.observers.forEach((observer)=>{
            observer.disconnect();
        });
    }

    unHideAll() {
        let ourStyles = [
            "position",
            "left",
            "top",
            "right",
            "bottom",
            "transform",
            "transform-origin",
            "transition",
            "contain",
            "border",
            "box-shadow",
            "z-index",
            "animation",
            "grid-column",
            "grid-row"
        ];

        this.hiddenTargets.forEach((target)=>{
            target.classList.remove("ConsentOMatic-CMP-Hider");
            target.classList.remove("ConsentOMatic-CMP-PIP");

            //Find styles we have not set

            if(typeof target.savedStyles !== "undefined") {
                let styleAttrSplit = target.getAttribute("style").split(";").filter((style)=>{return style.trim().length > 0});

                let notOurStyles = [];

                styleAttrSplit.forEach((style)=>{
                    style = style.trim();
                    if(style.length > 0 && style.indexOf(":") !== -1) {
                        let styleSplit = style.split(":");
                        let name = styleSplit[0].trim();
                        let value = styleSplit[1].trim();

                        if(!ourStyles.includes(name)) {
                            notOurStyles.push({name, value});
                        }
                    }
                });

                //Reload saved styles
                if(target.savedStyles === null) {
                    target.removeAttribute("style");
                }
                target.setAttribute("style", target.savedStyles);

                //Set styles again, we did not set
                notOurStyles.forEach(({name, value})=>{
                    target.style.setProperty(name, value);
                });
            }
        });
    }

    detect() {
        if(ConsentEngine.debugValues.debugLog) {
            console.groupCollapsed("Testing:", this.name);
        }
        try {
            let detector = this.detectors.find((detector)=>{
                return detector.detect();
            });

            if(detector != null && ConsentEngine.debugValues.debugLog) {
                console.log("Triggered detector: ", detector);
            }

            if(ConsentEngine.debugValues.debugLog) {
                console.groupEnd();
            }
    
            return detector != null;
        } catch(e) {
            if(ConsentEngine.debugValues.debugLog) {
                console.warn(e);
                console.groupEnd();
            }
        }

        return false;
    }

    isShowing() {
        let detector = this.detectors.find((detector)=>{
            return detector.detect();
        });

        return detector.isShowing();
    }

    isUtility() {
        return this.methods.has("UTILITY") && this.methods.size === 1;
    }

    hasMethod(name) {
        return this.methods.has(name);
    }

    isCustomMethod(name) {
        let action = this.methods.get(name);

        if(action != null) {
            return action.customMethod === true;
        }

        return false;
    }

    async runMethod(name, param = null) {
        let action = this.methods.get(name);

        if(action != null) {
            if(!this.isCustomMethod(name)) {
                ConsentEngine.singleton.currentMethodStepsTotal = this.getNumStepsForMethod(name);
            }

            if(ConsentEngine.debugValues.debugLog) {
                console.log("Triggering method: ", name);
            }
            await action.execute(param);

            if(!this.isCustomMethod(name)) {
                ConsentEngine.singleton.currentMethodDone();
            }


        } else {
            //Make no method behave as if an action was called, IE. push os back on the task stack
            await new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve();
                }, 0);
            });
        }
    }

    getNumStepsForMethod(method) {
        let action = this.methods.get(method);

        if(action != null) {
            return action.getNumSteps();
        }

        return 0;
    }

    getNumSteps() {
        let totalSteps = 0;

        this.methods.forEach((action, name)=>{
            if(name !== "UTILITY") {
                let steps = action.getNumSteps();

                if(name === "HIDE_CMP") {
                    //Hide CMP is called twice
                    totalSteps += (2 * steps);
                } else {
                    totalSteps += steps;
                }
            }
        });

        return totalSteps;
    }
}
class ConsentEngine {
    constructor(config, consentTypes, handledCallback) {
        let self = this;

        this.consentTypes = consentTypes;

        this.cmps = [];

        this.handledCallback = handledCallback;

        this.triedCMPs = new Set();

        this.numClicks = 0;
        this.pipEnabled = false;

        Object.keys(config).forEach((key) => {
            try {
                self.cmps.push(new CMP(key, config[key]));
            } catch (err) {
                console.groupCollapsed("Invalid CMP (" + key + ") detected, please update GDPR consent engine or fix the rule generating this error:");
                console.error(err);
                console.groupEnd();
            }
        });

        this.cmps.sort((cmp1, cmp2) => {
            if (cmp1.isUtility()) {
                return -1;
            } else if (cmp2.isUtility()) {
                return 1;
            } else {
                return 0;
            }
        })

        this.setupObserver();
        this.startObserver();

        this.startStopTimeout();

        window.addEventListener("DOMContentLoaded", ()=>{
            self.handleMutations([]);
        });
        this.domScannerIntervalID = setInterval(()=>{
            self.handleMutations([]);
        }, 500);
    }


    /**
     * Generates or removes a temporary custom stylesheet that enforces the currently stored scroll behaviours
     */
    static enforceScrollBehaviours(shouldEnforce) {
        //Make sure we enforce on parent if inside iframe
        let insideIframe = window !== window.parent;
    
        if(insideIframe) {
            //find top most window
            let top = window.parent;
            while(top !== top.parent){
                top = top.parent;
            }

            chrome.runtime.sendMessage("GetTabUrl", (url)=>{
                url = url.substring(0, url.indexOf("/", 8));
                top.postMessage({"enforceScrollBehaviours": shouldEnforce}, url);
            });
        }
    
        let stylesheetElement = document.querySelector("#consent-scrollbehaviour-override");
        if (stylesheetElement) {
            stylesheetElement.textContent = "";
        }

        document.querySelector("html").classList.remove("consent-scrollbehaviour-override");
        document.querySelector("body").classList.remove("consent-scrollbehaviour-override");

        if (!shouldEnforce) return;

        document.querySelector("html").classList.add("consent-scrollbehaviour-override");
        document.querySelector("body").classList.add("consent-scrollbehaviour-override");

        if (!stylesheetElement) {
            stylesheetElement = document.createElement("style");
            stylesheetElement.id = "consent-scrollbehaviour-override";
            document.documentElement.appendChild(stylesheetElement);
        }
        let content = Object.entries(window.consentScrollBehaviours).map(entry => {
            const [element, rules] = entry;
            return element + "{" + rules.map(rule => {
                let hasImportant = rule.value.includes("important");
                return rule.property + ":" + rule.value + (hasImportant ? "" : "!important");
            }).join(";") + "}";
        }).join("");
        if (ConsentEngine.debugValues.debugLog) {
            console.log(content);
        }
        stylesheetElement.textContent = content;
    }


    enablePip() {
        this.pipEnabled = true;
        if (this.modal != null) {
            this.modal.classList.add("ConsentOMatic-PIP")
        }
        ConsentEngine.enforceScrollBehaviours(true);
    }

    registerClick() {
        let clickFraction = 1 / this.currentMethodStepsTotal;

        this.numClicks++;

        if (this.currentMethodFraction == 0) {
            this.currentMethodFraction = clickFraction;
        } else {
            let rest = 1 - this.currentMethodFraction;

            this.currentMethodFraction += rest * (clickFraction / 2.0);
        }

        this.calculateProgress();
    }

    getClicksSoFar() {
        return this.numClicks;
    }

    currentMethodDone() {
        this.completedSteps += this.currentMethodStepsTotal;
        this.currentMethodFraction = 1;
        this.calculateProgress();
        this.currentMethodStepsTotal = 0;
        this.currentMethodFraction = 0;
    }

    startStopTimeout() {
        const self = this;

        if (this.stopEngineId != null) {
            clearTimeout(this.stopEngineId);
        }

        this.stopEngineId = setTimeout(() => {
            if (ConsentEngine.debugValues.debugLog) {
                console.log("No CMP detected in 5 seconds, stopping engine...");
            }

            if(self.queueId != null) {
                clearTimeout(self.queueId);
            }

            clearInterval(self.domScannerIntervalID);

            self.handledCallback({
                handled: false
            });
            this.stopObserver();
        }, 5000);
    }

    async handleMutations(mutations) {
        const self = this;

        if (this.queueId == null && !self.checkRunning) {
            this.queueId = setTimeout(async () => {
                self.queueId = null;
                try {
                    self.checkForCMPs();
                } catch (e) {
                    console.error(e);
                }
            }, 250);
        }
    }

    async checkForCMPs() {
        const self = this;

        self.checkRunning = true;

        //Wait for a super small while, to make async
        await new Promise((resolve)=>{
            setTimeout(()=>{
                resolve();
            }, 0);
        });

        if (ConsentEngine.debugValues.debugLog) {
            console.groupCollapsed("findCMP");
        }
        let cmps = this.findCMP();
        if (ConsentEngine.debugValues.debugLog) {
            console.groupEnd();
        }

        cmps = cmps.filter((cmp) => {
            return !self.triedCMPs.has(cmp.name);
        });

        if (cmps.length > 0) {
            this.stopObserver();

            if (cmps.length > 1) {
                console.warn("Found multiple CMPS's maybee rewise detection rules...", cmps);
            }

            let cmp = cmps[0];

            if (ConsentEngine.debugValues.debugLog) {
                console.log("CMP Detected: ", cmp.name);
                console.groupCollapsed(cmp.name + " - isShowing?");
            }

            this.triedCMPs.add(cmp.name);

            //Check if popup shows, then do consent stuff
            let numberOfTries = 5;
            async function checkIsShowing() {
                if (cmp.isShowing()) {
                    self.currentCMP = cmp;
                    if (ConsentEngine.debugValues.debugLog) {
                        console.groupEnd();
                        console.log(cmp.name + " - Showing");
                    }
                    setTimeout(async () => {
                        if (cmp.isUtility()) {
                            if (ConsentEngine.debugValues.debugLog) {
                                console.groupCollapsed(cmp.name + " - UTILITY");
                            }
                            await cmp.runMethod("UTILITY", self.consentTypes);
                            if (ConsentEngine.debugValues.debugLog) {
                                console.groupEnd();
                            }
                            if (!ConsentEngine.debugValues.skipHideMethod) {
                                if (!ConsentEngine.debugValues.dontHideProgressDialog) {
                                    cmp.stopObservers();
                                }
                            }

                            self.checkRunning = false;

                            self.startObserver();
                            self.handleMutations([]);
                        } else {
                            try {
                                self.numClicks = 0;

                                if (!ConsentEngine.debugValues.skipHideMethod) {
                                    self.showProgressDialog("Handling " + cmp.name + "...");
                                }

                                self.totalSteps = cmp.getNumSteps();
                                self.completedSteps = 0;
                                self.currentMethodStepsTotal = 0;
                                self.currentMethodFraction = 0;
                                self.updateProgress(0);

                                if (!ConsentEngine.debugValues.skipHideMethod) {
                                    if (ConsentEngine.debugValues.debugLog) {
                                        console.groupCollapsed(cmp.name + " - HIDE_CMP");
                                    }
                                    await cmp.runMethod("HIDE_CMP", self.consentTypes);

                                    if (ConsentEngine.debugValues.debugLog) {
                                        console.groupEnd();
                                    }
                                }

                                if (ConsentEngine.debugValues.debugLog) {
                                    console.groupCollapsed(cmp.name + " - OPEN_OPTIONS");
                                }
                                await cmp.runMethod("OPEN_OPTIONS", self.consentTypes);
                                if (ConsentEngine.debugValues.debugLog) {
                                    console.groupEnd();
                                }

                                if (!ConsentEngine.debugValues.skipHideMethod) {
                                    if (ConsentEngine.debugValues.debugLog) {
                                        console.groupCollapsed(cmp.name + " - HIDE_CMP");
                                    }
                                    await cmp.runMethod("HIDE_CMP", self.consentTypes);
                                    if (ConsentEngine.debugValues.debugLog) {
                                        console.groupEnd();
                                    }
                                }

                                if (ConsentEngine.debugValues.debugLog) {
                                    console.groupCollapsed(cmp.name + " - DO_CONSENT");
                                }
                                await cmp.runMethod("DO_CONSENT", self.consentTypes);
                                if (ConsentEngine.debugValues.debugLog) {
                                    console.groupEnd();
                                }

                                if (!ConsentEngine.debugValues.skipSubmit) {
                                    if (ConsentEngine.debugValues.debugLog) {
                                        console.groupCollapsed(cmp.name + " - SAVE_CONSENT");
                                    }
                                    await cmp.runMethod("SAVE_CONSENT", self.consentTypes);
                                    if (ConsentEngine.debugValues.debugLog) {
                                        console.groupEnd();
                                    }
                                }
                                if (!(self.numClicks > 0)) {
                                    if (ConsentEngine.debugValues.debugLog) {
                                        console.log("Consent-O-Matic click count was 0 for CMP:", self.numClicks, cmp.name);
                                    }
                                    self.numClicks = 0; // Catch-all for NaN, negative numbers etc.
                                }

                                self.updateProgress(1.0);

                                self.handledCallback({
                                    handled: true,
                                    cmpName: cmp.name,
                                    clicks: self.numClicks
                                });
                            } catch (e) {
                                console.log("Error during consent handling:", e);
                                self.handledCallback({
                                    handled: false,
                                    error: true
                                });
                            }
                            if (!ConsentEngine.debugValues.skipHideMethod) {
                                if (!ConsentEngine.debugValues.dontHideProgressDialog) {
                                    self.currentCMP = null;
                                    self.hideProgressDialog();
                                    cmp.stopObservers();
                                    cmp.unHideAll();
                                }
                            }
                            clearTimeout(self.stopEngineId);
                            clearInterval(self.domScannerIntervalID);

                            self.checkRunning = false;
                        }
                    }, 0);
                } else {
                    if (numberOfTries > 0) {
                        numberOfTries--;
                        setTimeout(checkIsShowing, 250);
                    } else {
                        if (ConsentEngine.debugValues.debugLog) {
                            console.groupEnd();
                            console.log(cmp.name + " - Not showing");
                        }
                        self.checkRunning = false;
                        self.startObserver();
                        self.startStopTimeout()
                        self.handleMutations([]);
                    }
                }
            }

            await checkIsShowing();
        } else {
            self.checkRunning = false;
        }
    }

    unHideAll() {
        if (this.currentCMP != null) {
            this.currentCMP.stopObservers();
            this.currentCMP.unHideAll();
        }
    }

    showProgressDialog(text) {
        const self = this;

        if (ConsentEngine.debugValues.debugLog) {
            console.log("Showing progress...");
        }
        if (this.dialogTimeoutId != null) {
            clearTimeout(this.dialogTimeoutId);
            this.dialogTimeoutId = null;
            if (this.dialog != null) {
                this.dialog.remove();
                this.dialog = null;
            }
            if (this.modal != null) {
                this.modal.remove();
                this.modal = null;
            }
        }

        this.modal = document.createElement("div");
        this.modal.classList.add("ConsentOMatic-Progress-Dialog-Modal");
        this.dialog = document.createElement("div");
        this.dialog.classList.add("ConsentOMatic-Progress-Dialog");

        this.preview = document.createElement("div");
        this.preview.classList.add("ConsentOMatic-Progres-Preview");
        this.modal.appendChild(this.preview);

        let contents = document.createElement("p");
        contents.innerText = text;
        this.dialog.appendChild(contents);
        document.body.appendChild(this.modal);
        this.modal.appendChild(this.dialog);

        this.dialog.addEventListener("click", () => {
            self.unHideAll();
        });

        setTimeout(() => {
            this.modal.classList.add("ConsentOMatic-Progress-Started");
        }, 0);
    }

    calculateProgress() {
        let fraction = (this.completedSteps + this.currentMethodStepsTotal * this.currentMethodFraction) / this.totalSteps;
        this.updateProgress(fraction);
    }

    updateProgress(fraction) {
        if (this.modal != null) {
            this.modal.style.setProperty("--progress", fraction);
        }
    }

    hideProgressDialog() {
        let self = this;
        if (ConsentEngine.debugValues.debugLog) {
            console.log("Hiding progress...");
        }
        this.modal.classList.add("ConsentOMatic-Progress-Complete");
        this.dialogTimeoutId = setTimeout(() => {
            self.modal.remove();
            self.dialog.remove();
            self.dialog = null;
        }, 1000);
        ConsentEngine.enforceScrollBehaviours(false);
    }

    setupObserver() {
        let self = this;

        this.observer = new MutationObserver((mutations) => {
            this.handleMutations(mutations);
        });
    }

    startObserver() {
        if (document.body != null) {
            this.observer.observe(document.body, {
                childList: true,
                attributes: true,
                subtree: true
            });
        }
    }

    stopObserver() {
        this.observer.disconnect();
    }

    findCMP() {
        return this.cmps.filter((cmp) => {
            return cmp.detect();
        });
    }
}

ConsentEngine.singleton = null;ConsentEngine.generalSettings = {
    "hideInsteadOfPIP": false
};

ConsentEngine.debugValues = {
    "clickDelay": false,
    "skipSubmit": true,
    "paintMatchers": false,
    "debugClicks": false,
    "alwaysForceRulesUpdate": false,
    "skipHideMethod": false,
    "debugLog": true,
    "debugTranslations": false,
    "skipSubmitConfirmation": false,
    "dontHideProgressDialog": false
};
            ConsentEngine.singleton = new ConsentEngine(ruleConfig, {
                "A": false,
                "B": false,
                "D": false,
                "E": false,
                "F": false,
                "X": false
                }, (evt)=>{
                    resolve(evt);
            });

        });
    }

    async onPageWait(scraper) {
        this.result = await scraper.page.evaluate(this.runCoM);
        if (this.result && this.result.handled) return;

        // Handle IFRAMES
        let urlsHandled = [];
        while(true) {
            let iframes = await scraper.page.$$("iframe");
            let allHandled = true;
            for (let iframe of iframes){
                let src = await ((await iframe.getProperty('src')).jsonValue());
                let alreadyTested = await ((await iframe.getProperty('tested')).jsonValue());
                console.log("checking iframe: "+src);
                if (alreadyTested && urlsHandled.includes(src)) continue;
                allHandled = false;
                urlsHandled.push(src);
                await iframe.evaluate((theFrame)=>{theFrame.tested=true}, iframe);

                let frame = await iframe.contentFrame();
                if(!frame._hasStartedLoading) {
                    console.log("Skipping not loaded frame:", frame);
                    continue;
                }

                this.result = await frame.evaluate(this.runCoM);
                console.log(this.result);
                if (this.result && this.result.handled) {
                    this.result.iframe=true;
                    return;
                }
            }
            if (allHandled) break;
        }
    }

    getResult() {
        return this.result;
    }
}
