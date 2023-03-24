<script>
    import { setContext } from "svelte";
    import { page } from "$app/stores";
    import BoostrapCollapse from "$lib/client/components/bootstrap/BoostrapCollapse.svelte";
    import AlertStreamer from "$lib/client/components/AlertStreamer.svelte";
    import ConfirmDialog from "$lib/client/components/bootstrap/ConfirmDialog.svelte";
    import coLogo from '$lib/client/assets/images/co-logo.png';

    let alertStreamer;
    let confirmDialogContext;

    let appContext = {};
    appContext.showAlert = (title, message, type) => {
        if (!alertStreamer) { // if this happens make a buffer and then add the messages to the streamer onMount
            console.error("Alert streamer got message before mounted");
        } else {
            alertStreamer.addAlert(title, message, type);
        }
    };

    appContext.showConfirmDialog = async (title, message) => {
        return new Promise((resolve) => {
            confirmDialogContext = {
                title,
                message,
                promiseResolve: resolve
            };
        });
    };

    function onConfirmDialogResult(result) {
        let promiseResolve = confirmDialogContext.promiseResolve;
        confirmDialogContext = undefined;
        promiseResolve(result.detail);
    }

    setContext('appContext', appContext);

    let showMainMenuMobile = false;

    function isMenuItemActive(basePath, pathname) {
        return pathname === basePath || (basePath !== '/' && pathname.startsWith(basePath));
    }
</script>


{#if confirmDialogContext}
    <ConfirmDialog title={confirmDialogContext.title} message={confirmDialogContext.message} on:action={onConfirmDialogResult}/>
{/if}

<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
        <a class="navbar-brand" href="/">
            <img src={coLogo} alt="Logo" height="24" class="d-inline-block align-text-top">
            <span class="ms-2">Consent Observatory</span>
        </a>

        <BoostrapCollapse targetId="navbarSupportedContent" show={showMainMenuMobile}/>
        <button class="navbar-toggler" type="button" on:click={() => showMainMenuMobile = !showMainMenuMobile}>
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="navbar-collapse collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a href="/" class="nav-link" class:active={isMenuItemActive('/', $page.url.pathname)}>Home</a>
                </li>
                <li class="nav-item">
                    <a href="/analysis/new" class="nav-link" class:active={isMenuItemActive('/analysis/new', $page.url.pathname)}>New analysis</a>
                </li>
<!--                <li class="nav-item">-->
<!--                    <a href="/methodology" class="nav-link" class:active={isMenuItemActive('/methodology', $page.url.pathname)}>Methodology</a>-->
<!--                </li>-->
    <!--            <li class="nav-item">-->
    <!--                <a href="/help" class="nav-link" class:active={isMenuItemActive('/help', $page.url.pathname)}>help</a>-->
    <!--            </li>-->
                <li class="nav-item">
                    <a href="/about" class="nav-link" class:active={isMenuItemActive('/about', $page.url.pathname)}>About</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<main>
    <div class="container">
        <AlertStreamer bind:this={alertStreamer}/>
        <slot></slot>
    </div>
</main>



<footer class="d-flex flex-wrap mt-auto text-muted">
    <span class="col d-flex px-5">
        <small>Created by <a href="https://chc.au.dk" class="link-secondary">chc.au.dk</a> & Midas Nouwens 2022</small>
    </span>
    <span class="col d-flex justify-content-end px-5">
        <small><a href="/privacy-policy" class="link-secondary">Privacy policy</a></small>
    </span>
</footer>

