<script>
    import { createEventDispatcher, onMount } from "svelte";

    export let targetId;
    export let show = false;

    let target;
    let inProgress = false;

    const dispatch = createEventDispatcher();

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
        target.classList.remove('collapse')
        let height = target.getBoundingClientRect().height;
        target.style.height = '0px';
        window.requestAnimationFrame(() => {
            target.style.height = `${height}px`;
            target.classList.add('collapsing');
        });
    }

    function runHide() {
        let height = target.getBoundingClientRect().height;
        target.style.height = `${height}px`;
        target.classList.remove('collapse');
        window.requestAnimationFrame(() => {
            target.style.height = '0px';
            target.classList.add('collapsing');
        })
    }

    function transitionEndEventListener() {
        if (show) {
            target.classList.add('show');
        } else {
            target.classList.remove('show');
        }
        target.classList.remove('collapsing');
        target.classList.add('collapse');
        target.style.height = '';
        inProgress = false;
        setTimeout(() => { // wait until css animations has finished
            dispatch('transitionEnd', { show });
        }, 0);
    }

    onMount(() => {
        target = document.querySelector(`#${targetId}`);
        target.addEventListener('transitionend', transitionEndEventListener);

        return () => {
            target.removeEventListener('transitionend', transitionEndEventListener);
        };
    });
</script>