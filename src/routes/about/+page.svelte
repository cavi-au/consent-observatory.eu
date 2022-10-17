<script>
    import auLogo from '$lib/client/assets/images/au-logo.png';
    import chcLogo from '$lib/client/assets/images/chc-logo.png';

    let counter = 0;
</script>

<svelte:head>
    <title>Consent Observatory - About</title>
    <meta name="description" content="" />
</svelte:head>

<section>
    <div id="aboutpage" class="subsection">

        <h4>This service is created and maintained by researchers at Aarhus University, Denmark.</h4>

        <p>
            All servers – both for hosting the website and the collection of the data – are located in Denmark and managed by the university.
        </p>
        <p>
            If you have any specific requests that are not supported (e.g., more urls, from different locations), please contact us.
        </p>
        <p>
            <i>midasnouwens at cc au dk</i>
        </p>
    </div>

    <div class="subsection">
        <div class="container">
            <div class="row">
                <div class="col-sm-2"></div>
                <div class="col-sm-3 mb-5 mb-sm-0"><a href="https://bachelor.au.dk/informationsvidenskab"><img class="img-fluid" src={auLogo}></a></div>
                <div class="col-sm-2"></div>
                <div class="col-sm-3"><a href="https://chcaa.io/"><img class="img-fluid" src={chcLogo}></a></div>
                <div class="col-sm-2"></div>
            </div>
        </div>
    </div>
</section>


