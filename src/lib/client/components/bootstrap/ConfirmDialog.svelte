
<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { focusTrap } from "$lib/client/components/actions.js";

    const BACKDROP_ID = "backdrop-boostrap-232lidw912";

    export let title;
    export let message;

    let show = false;
    let primaryButton;
    let drawAttention = false;

    const dispatch = createEventDispatcher();

    function actionChosen(confirm) {
        dispatch('action', confirm);
    }

    onMount(() => {
        let backdropHtml = `<div class="modal-backdrop fade" id="${BACKDROP_ID}"></div>`;
        document.body.insertAdjacentHTML('beforeend', backdropHtml);
        let backdrop =  document.querySelector(`#${BACKDROP_ID}`);

        window.requestAnimationFrame(() => {
            show = true;
            backdrop.classList.add('show');

        });

        primaryButton.focus();

        return () => {
            backdrop.remove();
        }
    });
</script>

<!-- Modal -->
<div class="modal fade" class:modal-static={drawAttention} class:show style="display: block;" tabindex="-1"
     use:focusTrap on:click|self={() => drawAttention = true}>
    <div class="modal-dialog modal-dialog-centered" on:transitionend|self={() => drawAttention = false}>
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{title}</h5>
                <button type="button" class="btn-close" on:click={() => actionChosen(false)}></button>
            </div>
            <div class="modal-body">
                {message}
            </div>
            <div class="modal-footer">
                <div class="container">
                    <div class="row justify-content-end">
                        <button type="button" class="btn btn-primary col-2" bind:this={primaryButton} on:click={() => actionChosen(true)}>Ok</button>
                        <button type="button" class="btn btn-secondary col-2 ms-2" on:click={() => actionChosen(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>