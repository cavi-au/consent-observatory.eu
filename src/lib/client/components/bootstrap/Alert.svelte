<script>
    import { createEventDispatcher } from 'svelte';

    export let type = 'primary';
    export let title = '';
    export let message = '';

    let alertClass = `alert-${type}`;

    const dispatch = createEventDispatcher();

    function dismiss() {
        dispatch('dismiss');
    }
</script>

<div class="alert alert-dismissible {alertClass}" role="alert">
    {#if title !== ''}
        <strong>{title}</strong>
    {/if}
    {message}
    <button type="button" class="btn-close" aria-label="Close" on:click={() => dismiss()}></button>
</div>