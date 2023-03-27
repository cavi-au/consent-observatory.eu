<script>
    // TODO lav meta description for hver side

    import {onMount} from 'svelte';

    let allCards = ["one", "two", "three"]

    onMount(() => {
        const allNextControls = document.querySelectorAll('.control-next')
        const allPreviousControls = document.querySelectorAll('.control-previous')


        allNextControls.forEach( control => {
            control.addEventListener("click", function(e) {
               controlPopup(e)
            })
        })

        allPreviousControls.forEach( control => {
            control.addEventListener("click", function(e) {
                controlPopup(e)
            })
        })

        function controlPopup(e) {
            let direction;
            console.log(e.target.classList)
            if (e.target.classList.contains('control-next')) {
                direction = 1
            } else if (e.target.classList.contains('control-previous')) {
                direction = -1
                console.log(direction)
            }

            const cardParent = e.target.closest('.card-body')
            cardParent.classList.toggle('hide');
            let nextScreenId = allCards[allCards.indexOf(cardParent.id) + direction];
            console.log(nextScreenId)
            document.getElementById(nextScreenId).classList.toggle('hide');
        }

        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

        let allNestedToggles = document.querySelectorAll( '[data-bs-toggle="tooltip"] [data-bs-toggle="tooltip"]');


        allNestedToggles.forEach(element => {
            element.addEventListener('mouseenter', function(e) {
                let t = e.target.parentElement.closest( '[data-bs-toggle="tooltip"]' )
                let parentTooltip = t.getAttribute('aria-describedby')
                document.getElementById(parentTooltip).style.opacity = "0";
            })

            element.addEventListener('mouseleave', function(e){
                let t = e.target.parentElement.closest( '[data-bs-toggle="tooltip"]' );
                let parentTooltip = t.getAttribute('aria-describedby')
                document.getElementById(parentTooltip).style.opacity = "1";
            })
        })

        let codeOutput = document.getElementById('JSONoutput')
        let d = new Date()
        let JSONtime = d.toISOString()
        let JSONcode = {"time":JSONtime,"url":"example.eu","data":
                {
                    provider: "Consentify",
                    acceptAll: true,
                    acceptAllLabel: "Accept all",
                    acceptAllClicks: 0,
                    rejectAll: true,
                    rejectAllLabel: "Reject all",
                    rejectAllClicks: 0,
                    purposes: [
                        {
                            label: "Necessary",
                            description: "Necessary cookies help make a website usable by enabling basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.",
                            defaultStatus: "on",
                            disabled: true,
                            clicks: 1
                        },
                        {
                            label: "Preferences",
                            description: "Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region that you are in.",
                            defaultStatus: "off",
                            disabled: false,
                            clicks: 1
                        },
                        {
                            label: "Statistics",
                            description: "Statistic cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously.",
                            defaultStatus: "off",
                            disabled: false,
                            clicks: 1
                        },
                        {
                            label: "Advertising",
                            description: "Advertising cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.",
                            defaultStatus: "off",
                            disabled: false,
                            clicks: 1
                        }
                    ]
                }
            }
        codeOutput.innerHTML = JSON.stringify(JSONcode, null, 4)
    });
</script>

<svelte:head>
    <title>Consent Observatory</title>
    <meta name="description" content=""/>
    <style>
        .hide {
            display: none
        }

        .form-switch {
            scale: 1.3;
        }
    </style>
</svelte:head>

<div class="pt-5 pb-2 my-5 bg-light border border-secondary-subtle rounded-3 text-center">
    <h2 class="fw-bold">Consent Observatory</h2>
    <p class="lead">Automated analysis of consent pop-ups on the web</p>
    <p id="credits"><small>by Midas Nouwens</small></p>
    <a href="/analysis/new" class="btn btn-primary btn-md mt-2">Start a new analysis</a>
    <div class="pt-3">
        <p><small><small class="text-muted"><a href="#citeCollapse" aria-expanded="false" aria-controls="citeCollapse" class="link-secondary" data-bs-toggle="collapse">How to cite?</a></small></small></p>
        <div class="row justify-content-center">
            <div class="col-8 collapse" id="citeCollapse">
                <small>
                <p class="card card-body mt-auto">
                    Nouwens, Midas. (2023). "Consent Observatory: Automated analysis of consent pop-ups on the web". Version 1.0. Retrieved from https://consent-observatory.eu
                </p>
                </small>
            </div>
        </div>
    </div>
</div>

<hr class="my-4">

<div class="py-2 mb-5">
    <h3>What are consent pop-ups?</h3>
    <p>
        Consent pop-ups are interfaces that collect your permission to read and write data on your device, and permission to collect, process, or store any personal data.
        Many websites and apps used consent pop-ups.
        Unfortunately, most do not comply with data protection regulation.
        This website lets you automatically extract design features from those pop-ups.
    </p>
    <p>
        Here is an <mark>interactive</mark> example of a common consent pop-up design:
    </p>

    <div class="card offset-md-2 col-md-8 my-5 text-center shadow">
        <!--      BULK          -->
        <div id="one" class="card-body my-2" data-bs-toggle="tooltip" data-bs-placement="right" title="The 'bulk consent' page, which is the first thing users see and where they can accept or reject all.">
            <div class="row justify-content-end">
                <div class="col-3 text-muted lh-1"><small>Powered by Consentify</small></div>
            </div>
            <div class="row">
                <div class="col">
                    <h4 class="card-title">We care about your privacy</h4>
                </div>
            </div>
            <div class="row my-4 mx-4">
                <div class="col ">
                    <p class="card-text" data-bs-toggle="tooltip" data-bs-placement="left" title="The basic description of the kinds of processing that the website would like to do.">
                        We use cookies to personalise content and ads, to provide social media features and to analyse our traffic.
                        We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services.
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="col align-self-end">
                    <button class="btn btn-primary m-2" data-bs-toggle="tooltip" data-bs-placement="left" title="An accept all button.">Accept all</button>
                    <button class="btn btn-primary m-2" data-bs-toggle="tooltip" data-bs-placement="right" title="A reject all button.">Reject all</button>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <a href="javascript:void(0);" class="control-next" data-bs-toggle="tooltip" data-bs-placement="bottom" title="A button that will take you to more granular options. Click to see more!">More options</a>
                </div>
            </div>
        </div>

        <!--      PURPOSES          -->
        <div id="two" class="card-body my-2 hide" data-bs-toggle="tooltip" data-bs-placement="right" title="The 'purpose-level consent' page, where users can control what kind of reasons for processing they allow">
            <div class="row justify-content-end">
                <div class="col-3 text-muted lh-1"><small>Powered by Consentify</small></div>
            </div>
            <div class="row border-bottom pb-3 px-4">
                <div class="col">
                    <h4 class="card-title">Purposes</h4>
                    <p class="text-muted">We collect data for a number of different reasons, as described below. You can click to consent to processing for these purposes.</p>
                </div>
            </div>
            <div class="row" style="max-height: 15rem; overflow: scroll">

                <div class="row py-3 ps-5 border-bottom">
                    <div class="col-11 text-start" data-bs-toggle="tooltip" data-bs-placement="left" title="A processing purpose, with some information explaining what it is for. Most websites have the same purposes: necessary, preferences, statistics, and advertising.">
                        <h6>Necessary</h6>
                        <p class="card-text">
                            Necessary cookies help make a website usable by enabling basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch" data-bs-toggle="tooltip" data-bs-placement="right" title="A slider to turn on or off your consent.">
                            <input class="form-check-input" type="checkbox" checked disabled>
                        </div>
                    </div>
                </div>

                <div class="row py-3 ps-5 border-bottom">
                    <div class="col-11 text-start">
                        <h6>Preferences</h6>
                        <p class="card-text">
                            Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region that you are in.
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-3 ps-5 border-bottom">
                    <div class="col-11 text-start">
                        <h6>Statistics</h6>
                        <p class="card-text">
                            Statistic cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously.
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-3 ps-5">
                    <div class="col-11 text-start">
                        <h6>Advertising</h6>
                        <p class="card-text">
                            Advertising cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

            </div>

            <div class="row pt-3 border-top">
                <div class="col align-self-end">
                    <button class="btn btn-primary m-2">Accept all</button>
                    <button class="btn btn-primary m-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="A button to save your custom settings.">Save selection</button>
                    <button class="btn btn-primary m-2">Reject all</button>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <a class="control-previous" href="javascript:void(0);">Previous options</a>
                </div>
                <div class="col">
                    <a class="control-next" href="javascript:void(0);">More options</a>
                </div>
            </div>
        </div>

        <!--      VENDORS          -->
        <div id="three" class="card-body my-2 hide" data-bs-toggle="tooltip" data-bs-placement="right" title="The 'vendor consent' page, where users can control which organisation they are willing to let process their data.">
            <div class="row justify-content-end">
                <div class="col-3 text-muted lh-1"><small>Powered by Consentify</small></div>
            </div>
            <div class="row border-bottom pb-3 px-4">
                <div class="col">
                    <h4 class="card-title">Vendors</h4>
                    <p class="text-muted">We process data on behalf of various vendors. You can click to consent to sharing data with these partners.</p>
                </div>
            </div>
            <div class="row" style="max-height: 15rem; overflow: scroll">

                <div class="row py-2 ps-5 border-bottom">
                    <div class="col-11 text-start" data-bs-toggle="tooltip" data-bs-placement="left" title="A specific organisation that wants access to your data.">
                        <span class="align-middle">152 Media LLC</span>
                        <p class="card-text">
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch" data-bs-toggle="tooltip" data-bs-placement="bottom" title="A slider to turn on or off your consent for this organisation.">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-2 ps-5 border-bottom">
                    <div class="col-11 text-start">
                        <span class="align-middle">LinkedIn</span>
                        <p class="card-text">
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-2 ps-5 border-bottom">
                    <div class="col-11 text-start">
                        <span class="align-middle">Zendesk</span>
                        <p class="card-text">
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-2 ps-5 border-bottom">
                    <div class="col-11 text-start">
                        <span class="align-middle">play.google.com</span>
                        <p class="card-text">
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-2 ps-5 border-bottom">
                    <div class="col-11 text-start">
                        <span class="align-middle">browser.sentry-cdn.com</span>
                        <p class="card-text">
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-2 ps-5 border-bottom">
                    <div class="col-11 text-start">
                        <span class="align-middle">Meta Platforms, Inc.</span>
                        <p class="card-text">
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-2 ps-5 border-bottom">
                    <div class="col-11 text-start">
                        <span class="align-middle">152 Media LLC</span>
                        <p class="card-text">
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-2 ps-5 border-bottom">
                    <div class="col-11 text-start">
                        <span class="align-middle">AdServing Factory srl</span>
                        <p class="card-text">
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-2 ps-5 border-bottom">
                    <div class="col-11 text-start">
                        <span class="align-middle">Baidu USA</span>
                        <p class="card-text">
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-2 ps-5 border-bottom">
                    <div class="col-11 text-start">
                        <span class="align-middle">CleverPush GmbH</span>
                        <p class="card-text">
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-2 ps-5 border-bottom">
                    <div class="col-11 text-start">
                        <span class="align-middle">Extreme Reach, Inc</span>
                        <p class="card-text">
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-2 ps-5 border-bottom">
                    <div class="col-11 text-start">
                        <span class="align-middle">Infolinks Media, LLC</span>
                        <p class="card-text">
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-2 ps-5 border-bottom">
                    <div class="col-11 text-start">
                        <span class="align-middle">Live Data Solutions SL</span>
                        <p class="card-text">
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-2 ps-5 border-bottom">
                    <div class="col-11 text-start">
                        <span class="align-middle">Microsoft Advertising</span>
                        <p class="card-text">
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

                <div class="row py-2 ps-5">
                    <div class="col-11 text-start">
                        <span class="align-middle">Playrcart Limited</span>
                        <p class="card-text">
                        </p>
                    </div>
                    <div class="col-1">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox">
                        </div>
                    </div>
                </div>

            </div>

            <div class="row pt-3 border-top">
                <div class="col align-self-end">
                    <button class="btn btn-primary m-2">Accept all</button>
                    <button class="btn btn-primary m-2">Save selection</button>
                    <button class="btn btn-primary m-2">Reject all</button>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <a class="control-previous" href="javascript:void(0);">Previous options</a>
                </div>
            </div>
        </div>
    </div>

</div>

<hr class="my-4">

<div class="py-2 mb-5">
    <h3>What data can I get?</h3>
    <p>
        Using the Consent Observatory automated analysis, you are able to extract information about the design of these consent pop-ups from any URL you submit.
    </p>
    <p>Analysing the pop-up above would give you the following result:</p>
    <pre><code id="JSONoutput"></code></pre>
</div>

<!--        <h4>History of Consent Pop-ups</h4>-->
<!--        <p>-->
<!--            In the early 2000s, companies started to install invasive software on people's computers to track their usage of intellectual property.-->
<!--            European regulators thought this shouldn't be allowed, so amended the ePrivacy Directive, now requiring these companies to have your consent for something like this.-->
<!--            Then, in 2018, the General Data Protection Regulation went into effect, which made the requirements for legally valid consent stricter, requiring it to be "freely given, specific, informed and unambiguous".-->
<!--        <p>-->

<!--    </div>-->
