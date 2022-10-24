<script>
    import { enhance } from '$app/forms';
    import Job from "$lib/client/components/Job.svelte";
    import { goto } from "$app/navigation";
    import { formAutoFocus } from "$lib/client/components/actions.js";

    export let form;

    let job;
    let jobIdFieldValue = '';

    $: {
        job = form?.job;
        if (job) {
            setJobIdFieldValue(); // do not reference jobIdFieldValue directly here as it is reactive itself which will cause it to reset to job.id when user enters into the field
        }
    }

    function setJobIdFieldValue() {
        jobIdFieldValue = job.id;
    }

    async function jobDeleted() {
        jobIdFieldValue = '';
        await goto('');
    }

</script>

<svelte:head>
    <title>Consent Observatory - Analysis Status</title>
    <meta name="description" content="" />
</svelte:head>

<h1>Analysis Status</h1>

<form method="POST" class="mb-3" use:enhance use:formAutoFocus>
    <div class="input-group" class:is-invalid={form?.errors?.jobId}>
        <input type="text" class="form-control" class:is-invalid={form?.errors?.jobId} name="jobId" id="analysis-id-field" bind:value={jobIdFieldValue}
               aria-describedby="analysis-id-field-info analysis-id-field-error" placeholder="Analysis Id">
        <button class="btn btn-primary" type="submit" id="submit-button">{job && job.id === jobIdFieldValue ? 'Refresh' : 'Submit'}</button>
    </div>
    {#if form?.errors?.jobId}
        <div id="analysis-id-field-error" class="invalid-feedback">{form?.errors?.jobId}</div>
    {:else}
        <div id="analysis-id-field-info" class="form-text">Insert the analysis id you received when submitting the analysis (also sent by email) to see the current status</div>
    {/if}
</form>

{#if job}
    <Job job={job} on:delete={() => jobDeleted()} />
{/if}