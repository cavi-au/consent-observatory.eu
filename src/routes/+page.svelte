<script>
    import popup from '$lib/client/assets/images/popup.png';
    // TODO lav meta description for hver side
</script>

<svelte:head>
    <title>Consent Observatory</title>
    <meta name="description" content=""/>
</svelte:head>

<section>
    <div  id="landing-abstract" class="subsection">
        <h1 class="bold-header">Consent-Observatory.eu</h1>
        <p class="subtitle">Automated analysis of consent pop-ups on the web</p>
        <a href="/analysis/new" class="btn btn-primary btn-lg">New analysis</a>
    </div>

    <div class="subsection long-text">
        <h2 class="bold-subheader text-center">Anatomy of a Consent Pop-up</h2>
        <p>
            Consent pop-ups are interfaces that collect your permission to read and write data on your device.
            Many websites and apps used them.
            Unfortunately, most do not comply with European regulation.
            This website lets you automatically extract design features from those pop-ups.
        </p>
        <div class="text-center">
            <img id="popup" src={popup}>
            <p class="image-caption">Fig. 1: Basic design of a consent pop-up (2022)</p>
        </div>

        <h4 class="text-center accent accent-header mt-5">Common Design Features</h4>
        <p>
            Most consent pop-ups look the same.
            They often consist of three layers:
        </p>
        <ol>
            <li>Bulk page</li>
            <li>Purpose-level consent</li>
            <li>Vendor-level consent</li>
        </ol>
        <p>In the first screen, the user gets some basic information, and can choose to either accept or reject <b>all</b> personal data processing and/or device reading and writing (see Fig. 1).
            However, often there is no reject button at all, or it is given much less visual prominence than the accept button.
        </p>
        <p>
            In the second screen, the user can make more granular decisions, and choose to give consent to the processing of data for specific <b>purposes</b>. For example, for advertising purposes or website performance analytics.
            Often purposes are already toggled on by default -- which is not allowed -- and there might even be some that cannot be turned off.
        </p>
        <p>
            In the third and final screen, the user can choose to give or withhold consent from specific <b>companies</b>, often called "vendors".
            This is often a list of at least 100 different companies, and sometimes it's not even the company name that is listed but some random string of numbers and characters.
        </p>

<!--        <h4>History of Consent Pop-ups</h4>-->
<!--        <p>-->
<!--            In the early 2000s, companies started to install invasive software on people's computers to track their usage of intellectual property.-->
<!--            European regulators thought this shouldn't be allowed, so amended the ePrivacy Directive, now requiring these companies to have your consent for something like this.-->
<!--            Then, in 2018, the General Data Protection Regulation went into effect, which made the requirements for legally valid consent stricter, requiring it to be "freely given, specific, informed and unambiguous".-->
<!--        <p>-->

    </div>
</section>

