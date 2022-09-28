<script>
    import { enhance } from '$app/forms';

    export let form;

    $: {
        console.log(form?.errors?.email)
    }
</script>

<h1>Submit a New Analysis</h1>

{#if form?.success}
    <h2>Success TODO AND SOME ICON HERE</h2>
    <p>
        Your job was successfully submitted to the queue and will be processed as soon as possible. There are currently XXX jobs in the queue before yours.
        An email with a <a href="/analysis/status?jobId={form.jobId}">status link</a> has been sent to your email address. You can always visit this link to see the current status of job.
    </p>
    <p>
        You will receive an email when the job is completed and your analysis result is ready for download.
    </p>
{:else}
    <form use:enhance>
        <div class="mb-3">
            <label for="email-field" class="form-label">Your Email address</label>
            <input type="email" class="form-control" class:is-invalid={form?.errors?.email} name="email" id="email-field" aria-describedby="email-field-info email-field-error" placeholder="example@example.eu" value="{form?.data?.email ?? ''}">
            {#if form?.errors?.email}
                <div id="email-field-error" class="invalid-feedback">{form?.errors?.email}</div>
            {:else}
                <div id="email-field-info" class="form-text">Email is only used for sending you the information about your analysis. We'll never share your email with anyone else.</div>
            {/if}
        </div>
        <div class="mb-3">
            <label for="urls-field" class="form-label">Urls (Maximum 10)</label>
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



Desuden tjek om bruger er tilladt at lave request. Hvis på whitelist -> OK ellers hvis de har pending/processing nej.
Lav så man konfigurere hvor whitelist fil findes i env-vars, hvis den ikke findes er listen bare tom..., skriv warning til konsol ved opstart...

<!--

 website with

A textbox for people to type/(copy/paste) URLs (with some kind of regex to check formatting)
// max limit of urls = 10?`if not on whitelist... I user already have a pending/running job, no new jobs can be submitted
Radio buttons to set
- Include Screenshots [ ]
- Page-timeout
Box to type in email to receive link to where to download result
Submit button
-->