<script>

   import Job from "$lib/client/components/Job.svelte";

   let job = {
       id: "e2e7530f-36fb-4101-b2ab-71d024796bd7",
       submitTime: Date.now(),
       processingStartTime: null,
       completedTime: null,
       urlCount: 7

   }

   // TODO lav så job hentes fra server, og hvis den ikke findes laves en "danger" alert.
   // lav så hvis der vist et job hedder knappen refresh i stedet for submit

</script>

<svelte:head>
    <title>Consent Observatory - Analysis Status</title>
    <meta name="description" content="" />
</svelte:head>

<h1>Analysis Status</h1>

<form method="POST" class="mb-3">
    <div class="input-group">
        <input type="text" class="form-control" name="jobId" id="analysis-id-field" aria-describedby="analysis-id-field-info" placeholder="Analysis Id">
        <button class="btn btn-primary" type="button" id="button-addon1">Submit/REFRESK</button>
    </div>
    <div id="analysis-id-field-info" class="form-text">Insert the analysis id you received when submitting the analysis (also sent by email) to see the current status</div>
</form>

<Job job={job} />
