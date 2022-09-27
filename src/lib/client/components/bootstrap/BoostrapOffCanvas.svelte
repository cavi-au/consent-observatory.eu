<script>

    import { onMount } from "svelte";

    export let show;
    export let targetId;

    let target;
    let inProgress = false;

    $: toggle(show);

    function toggle() {
        if (!target || inProgress) {
            return;
        }
        inProgress = true;
        if (show) {
            runShow();
        } else {
            runHide();
        }
    }

    function runShow() {
        target.classList.add('show');
        target.classList.add('showing');
    }

    function runHide() {
        target.classList.remove('show');
        target.classList.add('hiding');
    }

    function transitionEndEventListener() {
        target.classList.remove('showing');
        target.classList.remove('hiding');
        inProgress = false;
    }

    onMount(() => {
        target = document.querySelector(`#${targetId}`);
        target.addEventListener('transitionend', transitionEndEventListener);
        return () => {
            target.removeEventListener('transitionend', transitionEndEventListener);
        }
    });
</script>