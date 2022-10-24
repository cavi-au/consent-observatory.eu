<script>
    import auLogo from '$lib/client/assets/images/au-logo.png';
    import chcLogo from '$lib/client/assets/images/chc-logo.png';
</script>

<svelte:head>
    <title>Consent Observatory - About</title>
    <meta name="description" content="" />
</svelte:head>

<section>
    <div id="aboutpage" class="subsection">

        <h4  class="accent-header">This service is created and maintained by workers at Aarhus University, Denmark.</h4>

        <p>
            All servers – both for hosting the website and the collection of the data – are located in Denmark and managed by the university.
        </p>
        <p>
            If you have any specific needs that are not supported (e.g., more urls, location-specific data collection), reach out and we can find a custom solution.
        </p>
        <p>
            <i>midasnouwens at cc au dk</i>
        </p>
    </div>

    <div class="subsection">
        <div class="container">
            <div class="row sponsor-logos">
                <div class="col-sm-6 mb-5 mb-sm-0 p-3 text-center"><a href="https://bachelor.au.dk/informationsvidenskab"><img class="img-fluid" src={auLogo}></a></div>
                <div class="col-sm-6 p-3 text-center"><a href="https://chc.au.dk"><img class="img-fluid" src={chcLogo}></a></div>
            </div>
        </div>
    </div>
</section>


