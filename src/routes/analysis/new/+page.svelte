<script>
    import { enhance } from '$app/forms';
    import CopyToClipboard from "$lib/client/components/CopyToClipboard.svelte";
    import { formAutoFocus } from "$lib/client/components/actions.js";

    export let data;
    export let form;

    console.log(data.rulesets)
</script>

<svelte:head>
    <title>Consent Observatory - New Analysis</title>
    <meta name="description" content="" />
</svelte:head>

{#if form?.success}
    <h1>Success - Your Analysis Was Submitted <i class="bi-check2-square text-success"></i></h1>
    <p>
        Your analysis was successfully submitted to the queue and will be processed as soon as possible.
    </p>
    <p>
        There are currently <span class="badge rounded-pill text-bg-secondary">{form?.queueSize}</span> jobs in the queue before yours.
    </p>
    <p>
        An email with your analysis-id: <code>{form?.jobId}</code> <CopyToClipboard value={form?.jobId} /> has been sent to your email address. You can also copy the id:
        <code>{form?.jobId}</code> <CopyToClipboard value={form?.jobId} />
        and see the current status now by visiting the <a href="/analysis/status">status page</a>.
    </p>
    <p>
        You will receive a new email when the analysis is completed and your result is ready for download.
        When the analysis is completed you will have <span class="badge rounded-pill text-bg-secondary">{form?.daysToExpiration}</span> day(s) to download the
        result before it is automatically deleted.
    </p>
{:else}
    <h1>Submit a New Analysis</h1>
    {#if form?.errors?.global}
        <div class="alert alert-danger" role="alert">
            {form?.errors?.global}
        </div>
    {/if}
    <form method="POST" novalidate use:enhance use:formAutoFocus>
        <div class="mb-3">
            <label for="email-field" class="form-label">Your Email Address</label>
            <input type="email" class="form-control" class:is-invalid={form?.errors?.email} name="email" id="email-field" aria-describedby="email-field-info email-field-error"
                   placeholder="example@example.eu" value="{form?.data?.email ?? ''}">
            {#if form?.errors?.email}
                <div id="email-field-error" class="invalid-feedback">{form?.errors?.email}</div>
            {:else}
                <div id="email-field-info" class="form-text">Email is only used for sending you the information about your analysis. We'll never share your email with anyone else.</div>
            {/if}
        </div>
        <div class="mb-3">
            <label for="urls-field" class="form-label">Urls</label>
            <textarea class="form-control" class:is-invalid={form?.errors?.urls} name="urls" id="urls-field" rows="10" aria-describedby="urls-field-info urls-field-error" placeholder="{`https://example.eu
https://example2.eu`}">{form?.data?.urls ?? ''}</textarea>
            {#if form?.errors?.urls}
                <div id="url-field-error" class="invalid-feedback">{form?.errors?.urls}</div>
            {:else}
                <div id="urls-field-info" class="form-text">The urls to analyze. Each url should be on it's own line.</div>
            {/if}
        </div>
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" name="includeScreenshots" id="include-screenshots-checkbox">
            <label class="form-check-label" for="include-screenshots-checkbox" aria-describedby="include-screenshots-checkbox-info">Include Screenshots</label>
            <div id="include-screenshots-checkbox-info" class="form-text">If selected a screenshot of each url analyzed will be included in the result</div>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
{/if}
