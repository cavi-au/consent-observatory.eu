<script>
    import auLogo from '$lib/client/assets/images/au-logo.png';
    import chcLogo from '$lib/client/assets/images/chc-logo.png';
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
        <p>We created the Consent Observatory to make it easier for more people to study consent services on the web.</p>

        <p>
            Consent pop-ups have become ubiquitous on the web as companies whose business models rely on personal data processing try to grapple with data protection regulation across the world.
            Researchers, regulators, and policy makers have become interested in understanding whether those consent pop-us actually comply with the regulation, how they evolve over time, what geographic differences are, etc.
            However, studying consent pop-ups at scale requires extensive computational infrastructure and domain expertise, and this complexity is currently a barrier for many people.
            By making our data gathering tools public, we hope to make it easier for more people to study this topic and to prevent unnecessary and time-consuming duplication of software.
        </p>
        <h5 class="mt-4" id="methodology">Methodology</h5>
        <p>The data is collected using a scraper with custom detection scripts.</p>
        <h6>Scraper</h6>
        <p>The scraper is open source and can be found <a href="https://github.com/centre-for-humanities-computing/web-extractor">here</a>.</p>
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
        <p>The analysis of each consent pop-up is done on the basis of a custom-built script, which is partly based on our open-source extension <a href="https://consentomatic.au.dk/">Consent-O-Matic</a>.</p>
        <p>
            Pop-ups are first detected by checking the DOM for the presence of a specific CSS selector (e.g., <code>#cookiebanner</code>) within a period of 5 seconds after the page has completed loading,
            The presence, design, and labels of particular features of that pop-up (e.g., a reject button, a purpose description) are then detected using a combination of CSS selectors and JS.
        </p>

        <h6>Limitations</h6>
        <p>There are a number of limitations that affect the reliability and validity of our analysis, which should be considered when using this service for research.</p>
        <ul>
            <li>
                <em>We can only detect what we know.</em> Because our analysis scripts are based on hardcoded selectors, we can only detect pop-ups and features that we have seen before and designed for, which might result in false negatives.
                Alternative detection methods are also possible (for example, heuristic pattern detection), but we believe these suffer from false positives.</li>
            <li>
                <em>Updates can break our scripts.</em> Because of our approach described above, it is possible that a previously working script breaks when a pop-up provider changes the part of their code that we use to detect or interact with.
                This should in particular be taken into account when doing longitudinal studies. However, we test our scripts against manually verified pop-up designs every 3 months, to ensure they still work correctly.
            </li>
            <li>
                <em>Anti-scraper protection.</em> Some websites use specific methods to detect scrapers and can block us from analysing this website. This means that a human visiting a site will see something else than our analysis indicates.
                We try to mitigate this by, for example, only scraping 15 sites concurrently and setting a user agent, but cannot guarantee all websites are included.
            </li>
            <li>
                <em>Shadow DOM.</em> Some pop-ups are implemented in the shadow DOM, making it impossible for our scraper to detect. However, we have only seen a very small number of websites with this implementation, so we do not expect this to significantly affect the validity of larger analyses.
            </li>
<!--            delays?    -->
<!--            Multiple pop-ups-->
        </ul>





        <h5 class="mt-4">Custom analysis?</h5>
        <p>
            If you have any specific needs that are not supported (e.g., more urls, location-specific data collection, other features), reach out and we can discuss a custom solution.
        </p>
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
                <div class="col-sm-6 mb-5 mb-sm-0 p-3 text-center"><a href="https://bachelor.au.dk/informationsvidenskab"><img class="img-fluid" src={auLogo} alt="au-logo"></a></div>
                <div class="col-sm-6 p-3 text-center"><a href="https://chc.au.dk"><img class="img-fluid" src={chcLogo} alt="chc-logo"></a></div>
            </div>
        </div>
    </div>
</main>

