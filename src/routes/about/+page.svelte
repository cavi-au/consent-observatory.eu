<script>
    import auLogo from '$lib/client/assets/images/au-logo.png';
    import chcLogo from '$lib/client/assets/images/chc-logo.png';

    let counter = 0;
</script>

<svelte:head>
    <title>Consent Observatory - About</title>
    <meta name="description" content="" />
</svelte:head>

TODO make me...

<button on:click={() => counter = counter + 1}>Click me</button>

<div class="container">
    <p>Counter is: {counter}</p>
    <p>Counter is: {counter}</p>
    <p>Counter is: {counter}</p>
    <p>Counter is: {counter}</p>
    <p>Counter is: {counter}</p>
    <p>Counter is: {counter}</p>
    <p>Counter is: {counter}</p>
    <p>Counter is: {counter}</p>
    <p>Counter is: {counter}</p>
    <p>Counter is: {counter}</p>
    <div class="row">
        <div class="col-sm-6 mb-5 mb-sm-0"><img class="img-fluid" src={auLogo}></div>
        <div class="col-sm-6"><img class="img-fluid" src={chcLogo}></div>
    </div>
</div>

