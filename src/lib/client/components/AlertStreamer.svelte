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
        initIfRequired();
    }

    function initIfRequired() {
        if (!show && !showing) {
            let hasNext = queueNext();
            if (hasNext) {
                show = true;
            }
        }
    }

    function dismissActiveAlert() {
        if (!showing) { // do not make it possible to dismiss while transitioning
            return;
        }
        let hasNext = queueNext();
        if (!hasNext) {
            show = false;
        }
    }

    function transitionEnd(e) {
        showing = e.detail.show;
        if (!show) {
            if (queue.length > 0) {
                initIfRequired();
            } else {
                activeAlert = undefined;
            }
        }
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