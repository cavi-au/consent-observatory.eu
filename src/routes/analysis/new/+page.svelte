<script>
    import { enhance } from '$app/forms';
    import CopyToClipboard from "$lib/client/components/CopyToClipboard.svelte";
    import { formAutoFocus } from "$lib/client/components/actions.js";

    export let data;
    export let form;

    let selectedOptions = new Set();

    let selectedRuleset;

    setSelectedRuleset(data.rulesets[0].name);

    $: {
        if (form?.rulesetName) {
            setSelectedRuleset(form.rulesetName, form);
        }
    }

    function setSelectedRuleset(rulesetName, form) {
        if (selectedRuleset) {
            for (let rulesetOption of selectedRuleset.options) {
                selectedOptions.delete(rulesetOption.key);
            }
            selectedOptionsChanged();
        }
        for (let ruleset of data.rulesets) {
            if (ruleset.name === rulesetName) {
                selectedRuleset = ruleset;
                break;
            }
        }

        if (form) {
            // TODO set currently selected options in the set
            // also includeScreenshots if set...

            selectedOptionsChanged();
        }
    }

    function selectedOptionsChanged() {
        selectedOptions = selectedOptions; // make it update
    }
    function selectedAllOptions(selectAll) {
        if (selectAll) {
            selectedOptions.add('includeScreenshots');
            for (let rulesetOption of selectedRuleset.options) {
                selectedOptions.add(`rulesetOption.${rulesetOption.key}`);
            }
        } else {
            selectedOptions.clear();
        }
        selectedOptionsChanged();
    }

</script>

<svelte:head>
    <title>Consent Observatory - New Analysis</title>
    <meta name="description" content="" />
</svelte:head>

TODO test errors for ruleset and ruleset options ...

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

        {#if data.rulesets.length === 1}
            <input type="hidden" name="rulesetName" value="{data.rulesets[0].name}" />
        {:else}
            <div class="mb-3">
                <label for="rulesetName-field" class="form-label">Ruleset</label>
                <select class="form-select" class:is-invalid={form?.errors?.rulesetName} name="rulesetName" id="rulesetName-field"
                        aria-describedby="rulesetName-field-info rulesetName-field-error" on:change={(event) => setSelectedRuleset(event.target.value)}>
                    {#each data.rulesets as ruleset}
                        <option value="{ruleset.name}">{ruleset.name}</option>
                    {/each}
                </select>
                {#if form?.errors?.rulesetName}
                    <div id="rulesetName-field-error" class="invalid-feedback">{form?.errors?.rulesetName}</div>
                {:else}
                    <div id="rulesetName-field-info" class="form-text">{selectedRuleset.description}</div>
                {/if}
            </div>
        {/if}

        <legend>Options
            <button class="btn btn-sm ms-2" title="Select All" on:click|preventDefault={() => selectedAllOptions(true)}><i class="bi bi-check2-square"></i></button>
            <button class="btn btn-sm" title="Deselect All" on:click|preventDefault={() => selectedAllOptions(false)}><i class="bi bi-square"></i></button>
        </legend>

        <div class="mb-3 form-check">
            <input type="checkbox" checked={selectedOptions.has('includeScreenshots')} class="form-check-input" name="includeScreenshots" id="include-screenshots-checkbox">
            <label class="form-check-label" for="include-screenshots-checkbox" aria-describedby="include-screenshots-checkbox-info">Include Screenshots</label>
            <div id="include-screenshots-checkbox-info" class="form-text">If selected a screenshot of each url analyzed will be included in the result</div>
        </div>

        {#each selectedRuleset.options as rulesetOption}
            {@const optionKey = `rulesetOption.${rulesetOption.key}`}
            {#if rulesetOption.label}
                <label class="form-label">{rulesetOption.label}</label>
            {/if}
            {#if rulesetOption.type === 'checkbox'}
                <div class="mb-3 form-check">
                    <input type="checkbox" checked={selectedOptions.has(optionKey)} class="form-check-input" name="{optionKey}" id="{optionKey}">
                    <label class="form-check-label" for="{optionKey}">{rulesetOption.name}</label>
                    {#if rulesetOption.description}
                        <div id="{optionKey}-info" class="form-text">{rulesetOption.description}</div>
                    {/if}
                </div>
            {:else if rulesetOption.value === 'radio'}

            {/if}

            create option, chech or radio, add label if label set, add errors if set <br>
        {/each}


        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
{/if}

