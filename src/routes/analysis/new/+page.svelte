<script>
    import {onMount} from 'svelte';

    onMount(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    });


    import { enhance } from '$app/forms';
    import CopyToClipboard from "$lib/client/components/CopyToClipboard.svelte";
    import { formAutoFocus } from "$lib/client/components/actions.js";
    import RulesetOptions from "$lib/client/components/RulesetOptions.svelte";

    export let data;
    export let form;

    let selectedCheckboxes = new Set();
    let selectedRadios = new Map();
    let selectedRuleset;
    let rulesetOptionsComp;
    let submitButtonEnabled = true;

    setSelectedRuleset(data.rulesets[0].name);

    $: if (form?.rulesetName) {
        setSelectedRuleset(form.rulesetName, form);
    }

    $: if (form) { // enable whenever form data is updated (after submit)
        submitButtonEnabled = true;
    }


    function setSelectedRuleset(rulesetName, form) {
        if (selectedRuleset) {
            for (let rulesetOption of selectedRuleset.options) {
                if (rulesetOption.type === 'checkbox') {
                    selectedCheckboxes.delete(`rulesetOption.${rulesetOption.key}`);
                } else if (rulesetOption.type === 'radio') {
                    selectedRadios.delete(`rulesetOption.${rulesetOption.key}`);
                }
            }
            selectedOptionsChanged();
        }
        for (let ruleset of data.rulesets) {
            if (ruleset.name === rulesetName) {
                selectedRuleset = ruleset;
                break;
            }
        }

        for (let rulesetOption of selectedRuleset.options) {
            if (rulesetOption.type === 'radio') {
                selectedRadios.set(`rulesetOption.${rulesetOption.key}`, rulesetOption.options[0].value);
            }
        }

        if (form?.data) {
            if (form.data.includeScreenshots) {
                selectedCheckboxes.add('includeScreenshots');
            }
            for (let rulesetOption of selectedRuleset.options) {
                let rulesetOptionFormValue = form.data.rulesetOptions[rulesetOption.key];
                if (rulesetOptionFormValue) {
                    if (rulesetOption.type === 'checkbox') {
                        selectedCheckboxes.add(`rulesetOption.${rulesetOption.key}`);
                    } else if (rulesetOption.type === 'radio') {
                        selectedRadios.set(`rulesetOption.${rulesetOption.key}`, rulesetOptionFormValue);
                    }
                }

            }
            selectedOptionsChanged();
        }
    }

    function selectedOptionsChanged() {
        selectedCheckboxes = selectedCheckboxes; // make it update
        selectedRadios = selectedRadios;
    }

    function checkboxChanged(key, selected) {
        if (selected) {
            selectedCheckboxes.add(key);
        } else {
            selectedCheckboxes.delete(key);
        }
        selectedOptionsChanged();
    }

    function radioChanged(key, value) {
        selectedRadios.set(key, value);
        selectedOptionsChanged();
    }

    function selectAllCheckboxes(selectAll) {
        if (selectAll) {
            selectedCheckboxes.add('includeScreenshots');
            rulesetOptionsComp.selectAllCheckboxes(selectAll);
        } else {
            selectedCheckboxes.clear();
        }
        selectedOptionsChanged();
    }

</script>

<svelte:head>
    <title>Consent Observatory - New Analysis</title>
    <meta name="description" content="" />
</svelte:head>

{#if form?.success}
<div class="py-5">
    <h3 class="mb-4">Success &mdash; Your request was submitted</h3>
    <p>
        Your analysis request was successfully submitted to the queue and will be processed as soon as possible.
    </p>
    <p>
        There are currently <span class="badge rounded-pill bg-primary">{form?.queueSize}</span> jobs in the queue before yours.
    </p>
    <p>
        Your analysis ID is <code>{form?.jobId}</code> <CopyToClipboard value={form?.jobId} />, which you have also been sent in an email (check your spam if you can't find it).
        You will need this ID to check the status of your request and download your files, which you can do via the <a href="/analysis/status?{form?.jobId}">status page</a>.
    </p>
    <p>
        You will receive a new email when the analysis is completed and your result is ready for download.
        When the analysis is completed you will have <span class="badge rounded-pill bg-primary">{form?.daysToExpiration}</span> day(s) to download the
        result before it is automatically deleted.
    </p>
</div>
{:else}
<div class="py-5">
    <h3>Request consent pop-up analysis</h3>
    <p class="lead">Configure your analysis below to retrieve the data you want.
    <br>
        <a href="/about#methodology">Read more about our data collection methodology.</a>
    </p>
</div>
    {#if form?.errors?.global}
        <div class="alert alert-danger" role="alert">
            {form?.errors?.global}
        </div>
    {/if}
<!--    <form method="POST" novalidate use:enhance use:formAutoFocus on:submit={() => submitButtonEnabled = false}>-->
    <form method="POST" novalidate use:enhance on:submit={() => submitButtonEnabled = false}>

        <!--        <legend>Options-->
        <!--            <br>-->
        <!--            <button class="btn btn-primary btn-sm ms-2" title="Select All" on:click|preventDefault={() => selectAllCheckboxes(true)}>Select all: <i class="bi bi-check-square"></i></button>-->
        <!--            <button class="btn btn-primary btn-sm" title="Deselect All" on:click|preventDefault={() => selectAllCheckboxes(false)}>Unselect all: <i class="bi bi-square"></i></button>-->
        <!--        </legend>-->



        <div class="mb-3">
            <h4>Features</h4>
            <p class="text-muted">Specify which pop-ups and which aspects of those pop-ups you want to extract.</p>

            <!-- DEFAULT CONFIGURATIONS  -->
            {#if data.rulesets.length === 1}
                <input type="hidden" name="rulesetName" value="{data.rulesets[0].name}" />
            {:else}
                <div>
                    <!--                PRESET LiSTS -->
                    <label for="rulesetName-field" class="form-label">Pre-defined configurations:</label>
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

        <RulesetOptions bind:this={rulesetOptionsComp} form={form} options={selectedRuleset.options} selectedCheckboxes={selectedCheckboxes} selectedRadios={selectedRadios} />
        </div>

        <div>
            <h6 class="sub-legend mt-4">Screenshots</h6>
            <div>
                <input type="checkbox" checked={selectedCheckboxes.has('includeScreenshots')} class="form-check-input" name="includeScreenshots"
                       id="include-screenshots-checkbox" on:click={(event) => checkboxChanged('includeScreenshots', event.target.checked)}>
                <label class="form-check-label ms-2" for="include-screenshots-checkbox" aria-describedby="include-screenshots-checkbox-info">Include screenshots</label>
                <small><i class="bi bi-question-circle" data-bs-toggle="tooltip" data-bs-placement="right" title="If selected, the results will include a screenshot of each website"></i></small>
            </div>
        </div>

        <hr class="my-4">

        <div class="mb-3">
            <h4>Targets</h4>
            <p class="text-muted">Specify which urls and (coming soon) from which location you want to gather data.</p>
            <label for="urls-field" class="form-label">Urls</label>
            <textarea class="form-control" class:is-invalid={form?.errors?.urls} name="urls" id="urls-field" rows="10" aria-describedby="urls-field-info urls-field-error" placeholder="{`example.eu
example2.eu`}">{form?.data?.urls ?? ''}</textarea>
            {#if form?.errors?.urls}
                <div id="url-field-error" class="invalid-feedback">{form?.errors?.urls}</div>
            {:else}
                <div id="urls-field-info" class="form-text">Each url should be on it's own line. Unless specified, we prepend your urls with "https://". Max urls = 1000 (reach out for more).</div>
            {/if}
        </div>

        <hr class="my-4">

        <div class="mb-3">
            <h4>Contact details</h4>
            <label for="email-field" class="form-label">Email address</label>
            <input type="email" class="form-control" class:is-invalid={form?.errors?.email} name="email" id="email-field" aria-describedby="email-field-info email-field-error"
                   placeholder="example@example.eu" value="{form?.data?.email ?? ''}">
            {#if form?.errors?.email}
                <div id="email-field-error" class="invalid-feedback">{form?.errors?.email}</div>
            {:else}
                <div id="email-field-info" class="form-text">Your email is only used to send you information about your analysis request. We'll never share your email with anyone else.</div>
            {/if}
        </div>
        <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary my-5" disabled={!submitButtonEnabled}>Submit</button>
        </div>
    </form>
{/if}
