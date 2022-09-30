<script>
    import { enhance } from '$app/forms';
    import Job from "$lib/client/components/Job.svelte";

    export let form;

    let job;
    $: {
        job = form?.job;
    }


    // TODO lav så job hentes fra server, og hvis den ikke findes laves en "danger" alert.
    //TODO server skulle gerne send en form?.error med ved fejl som vi bare kan vise... i en alert box
    //TODO lav så hvis der vist et job hedder knappen refresh i stedet for submit, ved delete event fra Job opdateres knap vel igen, da vi kalder invalidateAll() ???
    //håndter "delete" event fra Job

</script>

<svelte:head>
    <title>Consent Observatory - Analysis Status</title>
    <meta name="description" content="" />
</svelte:head>

<h1>Analysis Status</h1>

<form method="POST" class="mb-3" use:enhance>
    <div class="input-group">
        <input type="text" class="form-control" name="jobId" id="analysis-id-field" aria-describedby="analysis-id-field-info" placeholder="Analysis Id">
        <button class="btn btn-primary" type="submit" id="button-addon1">Submit/REFRESK</button>
    </div>
    <div id="analysis-id-field-info" class="form-text">Insert the analysis id you received when submitting the analysis (also sent by email) to see the current status</div>
</form>

{#if job}
    <Job job={job} />
{/if}