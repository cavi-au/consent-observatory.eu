<script>
    import { scale } from 'svelte/transition';
    import Alert from "$lib/client/components/bootstrap/Alert.svelte";
    import BoostrapCollapse from "$lib/client/components/bootstrap/BoostrapCollapse.svelte";

    let queue = [];
    let activeAlert;
    let show = false;
    let showing = false;

    export function addAlert(title, message, type = 'primary') {
        queue.push({ title, message, type });
        if (!show) {
            queueNext();
        }
        show = true;
    }

    function dismissActiveAlert() {
        if (!showing) { // do not make it possible to dismiss while transitioning
            return;
        }
        let hasNext = queueNext();
        if (!hasNext) {
            show = false;
            showing = false;
        }
    }

    function transitionEnd(e) {
        if (!show) {
            activeAlert = undefined;
        }
        showing = e.detail.show;

    }

    function queueNext() {
        if (queue.length > 0) {
            activeAlert = queue.shift();
            return true;
        }
        return false;
    }
</script>

<BoostrapCollapse targetId="alert-streamer-body" show={show} on:transitionEnd={transitionEnd} />

<div id="alert-streamer-body" class="collapse">
    {#if activeAlert}
        <Alert title={activeAlert.title} message={activeAlert.message} type={activeAlert.type} on:dismiss={() => dismissActiveAlert()} />
    {/if}
</div>