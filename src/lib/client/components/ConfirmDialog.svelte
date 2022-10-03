

<script>
    import { onMount, tick } from "svelte";

    const BACKDROP_ID = "backdrop-boostrap-232lidw912";

let show = false;



// TODO den sætter også en class på body, så tjek nok lige deres js plugin og repliker hvad den gør

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
})

</script>

<!-- Modal -->
<div class="modal fade" class:show style="display: block;" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                ...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Understood</button>
            </div>
        </div>
    </div>
</div>