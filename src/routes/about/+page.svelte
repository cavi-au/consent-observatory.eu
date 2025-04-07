<script>
    import auLogo from '$lib/client/assets/images/au-logo.png';
    import chcLogo from '$lib/client/assets/images/chc-logo.png';
    import caviLogo from '$lib/client/assets/images/cavi-logo.png';

    import {onMount} from 'svelte';

    onMount(() => {
        /* 1. define variables */
        let emailName = "midasnouwens";
        let host = "cc.au.dk";

        /* 2. find email link to replace */
        let mailElement = document.getElementById("mail");

        /* 3. replace link href with variables  */
        mailElement.href = `mailto:${emailName}@${host}`;
    });
</script>


<svelte:head>
    <title>Consent Observatory - About</title>
    <meta name="description" content="" />
</svelte:head>

<main class="mt-5">
    <div>
        <h3 class="mb-3">About this service</h3>

        <h5 class="mt-34">Why did we create the Consent Observatory?</h5>
        <p>We created the Consent Observatory to make it easier for more people to study consent interfaces on the web.</p>

        <p>
            Consent pop-ups have become ubiquitous on the web as companies whose business models rely on personal data processing try to grapple with data protection regulation across the world.
            Researchers, regulators, and policy makers have become interested in understanding whether those interfaces actually comply with the regulation, how they evolve over time, what geographic differences are, etc.
            However, studying consent banners at scale requires extensive computational infrastructure and domain expertise, and this complexity is currently a barrier for many people.
            By making our data gathering tools public, we hope to make it easier for more people to study this topic and to prevent unnecessary and time-consuming duplication of software.
        </p>
        <h5 class="mt-4" id="methodology">Methodology</h5>
        <p>The data is collected using a scraper with custom detection scripts.</p>
        <h6>Scraper</h6>
        <p>The scraper is open source and can be found <a href="https://github.com/cavi-au/consent-observatory.eu/">here</a>.</p>
        <p>
            The scraper is built using a combination of <a href="https://github.com/puppeteer/puppeteer">puppeteer</a> (a Google scraping library) and custom Node JS code.
            The scraper is run with the following specifications:
        </p>
        <ul>
            <li>Headless</li>
            <li>Concurrency: 15 URLs (to balance speed with anti-scraper protections)</li>
            <li>Time-out: 90 seconds without HTTP response</li>
            <li>Puppeteer v. 18</li>
            <li>Chromium v. 107.0.5296.0</li>
<!--            <li>Node v ??? </li>-->
            <li>Server: located in Denmark and managed by Aarhus University</li>
        </ul>

        <p></p>
        <h6>Detection scripts</h6>
        <p>The analysis of each consent pop-up is done on the basis of a custom-built script. You can read about it in more detail in our paper: <a href="https://arxiv.org/abs/2503.19655">A Cross-Country Analysis of GDPR Cookie Banners and Flexible Methods for Scraping Them</a>.</p>
        <ul>
            <li><em>Consent Interface</em>: looks for all elements with a z-index > 10 and position='fixed' that contains one of the words in the multi-lingual <a href="https://github.com/cavi-au/consent-observatory.eu/blob/master/rules/Gatherers/WordBoxGatherer.js#L23">word corpus</a></li>
            <li><em>CMP name</em>: looks inside the detected consent interface for elements that match a regex pattern of <a href="https://github.com/cavi-au/consent-observatory.eu/blob/master/rules/Gatherers/CMPGatherer.js#L78">known CMP selectors</a>.</li>
            <li><em>IAB CMP info</em>: pings the IAB TCF <a href="https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md#pingreturn">__tcfapi</a> to get their <a href="https://iabeurope.eu/cmp-list/">ID</a></li>
            <li><em>User options</em>: looks at the inner text and attribute values of elements inside detected consent interfaces and, after normalising, checks whether it matches a <a href="https://github.com/cavi-au/consent-observatory.eu/blob/d61d0b6b825197a5a659c7d0fb321231eea384e1/rules/Gatherers/NormalizedWordButtonGatherer.js#L179">word corpus</a> within a levenshtein distance of 1.</li>
            <li><em>Toggles</em>: looks for all elements with input[type='checkbox'] or [role='checkbox'] and returns their checked and disabled status.</li>
            <li><em>DOM</em>: returns a copy of the html element 10 seconds after the DOM is fully loaded.</li>
            <li><em>Cookies placed</em>: returns all first and third party cookies present 10 seconds after the DOM is fully loaded.</li>
            <li><em>Elements with event listeners</em>: looks for all visible elements that have some text and which are inside a detected consent interfaces that have event listeners attached listening for a click event.</li>
            <li><em>Button elements</em>: finds all visible elements inside a detected consent interface that matches a <a href="https://github.com/cavi-au/consent-observatory.eu/blob/d61d0b6b825197a5a659c7d0fb321231eea384e1/rules/Gatherers/ButtonGatherer.js#L19C31-L19C209">button selector</a>. </li>
            <li><em>Visibility analyser</em>: scores the visibility of an element based on its size, the contrast between its colour and the background, its border, font styling, and text decoration</li>
            <li><em>Click listener analyser</em>: scores how interactive an element is by evaluating if the element has any click event listeners, how many, and how far up the DOM tree they are.</li>
        </ul>

        <div class="collapse" id="collapseExample">
            <div class="card card-body">
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
            </div>
        </div>

        <p></p>

        <h6>Limitations</h6>
        <p>There are a number of limitations that affect the reliability and validity of our analysis, which should be considered when using this service for research.</p>
        <ul>
            <li>
                <em>We can only detect what we know.</em> Because some of our detection scripts are based on text or selector matching, there might be some interfaces and features that we cannot detect. However, our accuracy rates are very high (see p.6 of the paper).</li>
            <li>
                <em>Updates can break our scripts.</em> Because of our approach described above, it is possible that a previously working script breaks when a pop-up provider changes the part of their code that we use to detect or interact with.
            </li>
            <li>
                <em>Anti-scraper protection.</em> Some websites use specific methods to detect scrapers and can block us from analysing this website. This means that a human visiting a site will see something else than our analysis indicates.
            </li>
            <li>
                <em>Server location.</em> Websites sometimes infer the location of the visitor and adapt their interface, even within the same legal jurisdictions. Our servers are located in Denmark, and this might mean we see a different version of the website.
            </li>
<!--            delays?    -->
<!--            Multiple pop-ups-->
        </ul>





<!--        <h5 class="mt-4">Custom analysis?</h5>-->
<!--        <p>-->
<!--            If you have any specific needs that are not supported (e.g., more urls, location-specific data collection, other features), reach out and we can discuss a custom solution.-->
<!--        </p>-->
    </div>

    <hr class="my-4">

    <div >
        <h3>About us</h3>
        <p>This service is created and maintained by workers at Aarhus University, Denmark.</p>
        <p>If you want to talk about Consent Observatory, how it could be used for your research, or if you have any issues, please contact <a id="mail">midasnouwens@cc.au.dk</a></p>
    </div>


    <div class="subsection mt-auto">
        <div class="container">
            <div class="row sponsor-logos">
                <div class="col-sm-3 mb-5 mb-sm-0 p-3 mx-5 text-center"><a href="https://bachelor.au.dk/informationsvidenskab"><img class="img-fluid" src={auLogo} alt="au-logo"></a></div>
                <div class="col-sm-2 mb-sm-1 p-3 mx-5 text-center"><a href="https://cavi.au.dk/"><img class="img-fluid" src={caviLogo} alt="cavi-logo"></a></div>
                <div class="col-sm-3 p-3 mx-5 text-center"><a href="https://chc.au.dk"><img class="img-fluid" src={chcLogo} alt="chc-logo"></a></div>
            </div>
        </div>
    </div>
</main>

