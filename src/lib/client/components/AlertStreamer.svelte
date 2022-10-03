<script>
    import { scale } from 'svelte/transition';
    import Alert from "$lib/client/components/bootstrap/Alert.svelte";

    let queue = [];
    let activeAlert;

    export function addAlert(title, message, type = 'primary') {
        queue.push({ title, message, type });
        queueNext();
    }

    function dismissActiveAlert() {
        activeAlert = undefined;
        queueNext();
    }

    function queueNext() {
        if (!activeAlert && queue.length > 0) {
            activeAlert = queue.shift();
        }
    }
</script>

{#if activeAlert}
    <div transition:scale={{ start: 0, opacity: 1 }}>
        <Alert title={activeAlert.title}, message={activeAlert.message} type={activeAlert.type} on:dismiss={() => dismissActiveAlert()} />
    </div>
{/if}