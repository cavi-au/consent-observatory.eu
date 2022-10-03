
<script>
    import { createEventDispatcher, onMount } from "svelte";

    const BACKDROP_ID = "backdrop-boostrap-232lidw912";

    export let title;
    export let message;

    let show = false;

    const dispatch = createEventDispatcher();

    function actionChosen(confirm) {
        dispatch('action', confirm);
    }

    //TODO  vi skal lave en focus trap så tab kører i ring inden for modal, se hvordan boostrap gør på det git repo
    // TODO skal vi lave så man sætte type

    onMount(() => {
        let backdropHtml = `<div class="modal-backdrop fade" id="${BACKDROP_ID}"></div>`;
        document.body.insertAdjacentHTML('beforeend', backdropHtml);
        let backdrop =  document.querySelector(`#${BACKDROP_ID}`);

        // TODO der skal nok nogle event listners på, så vi kan ryste modal ved click
        window.requestAnimationFrame(() => {
            show = true;
            backdrop.classList.add('show');

        });

        return () => {
            backdrop.remove();
        }
    });

</script>

<!-- Modal -->
<div class="modal fade" class:show style="display: block;" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
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
                        <button type="button" class="btn btn-primary col-2" autofocus on:click={() => actionChosen(true)}>Ok</button>
                        <button type="button" class="btn btn-secondary col-2 ms-2" on:click={() => actionChosen(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>