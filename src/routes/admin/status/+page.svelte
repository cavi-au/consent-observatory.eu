<script>
    import { enhance } from '$app/forms';
    import Job from "$lib/client/components/Job.svelte";
    import { formAutoFocus } from "$lib/client/components/actions.js";

    export let form;

    let jobs;
    let adminAccessSecret = '';

    $: {
        jobs = form?.jobs;
    }

    async function jobDeleted(i) {
        jobs.splice(i, 1);
        jobs = jobs; // make svelte see the change
    }
</script>

<svelte:head>
    <title>Consent Observatory - Analysis Status</title>
    <meta name="description" content="" />
</svelte:head>

<h1 class="mb-3">Admin Analysis Status</h1>

<form method="POST" class="mb-3" use:enhance use:formAutoFocus>
    <div class="input-group" class:is-invalid={form?.errors?.adminAccessSecret}>
        <input type="text" class="form-control" class:is-invalid={form?.errors?.adminAccessSecret} name="adminAccessSecret" id="admin-access-secret-field" bind:value={adminAccessSecret}
               aria-describedby="admin-access-secret-field-info admin-access-secret-field-error" placeholder="Admin Access Secret">
        <button class="btn btn-primary" type="submit" id="submit-button">{jobs ? 'Refresh' : 'Submit'}</button>
    </div>
    {#if form?.errors?.adminAccessSecret}
        <div id="admin-access-secret-field-error" class="invalid-feedback">{form?.errors?.adminAccessSecret}</div>
    {:else}
        <div id="admin-access-secret-field-info" class="form-text">Insert admin access secret to see jobs</div>
    {/if}
</form>

{#if jobs}
    <h2>All Jobs</h2>
    {#each jobs as job, i}
        <div class="mb-3 pb-3 border-bottom border-dark" class:border-bottom-0={i === jobs.length - 1}>
            <Job job={job} on:delete={() => jobDeleted(i)} />
        </div>
    {:else}
        <p>No jobs on the server...</p>
    {/each}
{/if}