<script>
    import * as formatUtils from '$lib/client/utils/format-utils.js';
    import { createEventDispatcher, getContext } from "svelte";

    export let job;

    const dispatch = createEventDispatcher();

    let appContext = getContext('appContext');

    let buttonsDisabled = false;

    async function deleteJob() {
        try {
            buttonsDisabled = true;
            let confirm = await appContext.showConfirmDialog('Delete', 'Are you sure you want to delete this Analysis?');

            if (confirm) {
                let response = await fetch('/analysis/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ jobId: job.id })
                });

                let jsonResponse = await response.json();
                if (jsonResponse.status === 'success' || jsonResponse?.error?.status === 404) {
                    dispatch('delete');
                } else {
                    appContext.showAlert('Error', jsonResponse?.error?.message, 'danger');
                }
            }
            buttonsDisabled = false;
        } catch (e) {
            console.error(e);
            appContext.showAlert('Unknown error', e.message, 'danger');
            buttonsDisabled = false;
        }

    }
</script>

<div class="container-fluid px-0 job-status">
    <div class="row">
        <div class="col-lg-6">
            <table class="table table-sm table-striped border-dark">
                <tbody>
                    <tr><td>Id</td><td class="text-end"><code>{job.id}</code></td></tr>
                    <tr><td>User Email</td><td class="text-end"><code>{job.userEmail}</code></td></tr>
                    <tr><td>Status</td><td class="text-end">{job.status}</td></tr>
                    <tr><td>Url Count</td><td class="text-end">{job.urlCount}</td></tr>
                    <tr><td>Ruleset</td><td class="text-end">{job.rulesetName}</td></tr>
                </tbody>
            </table>
        </div>
        <div class="col-lg-6">
            <table class="table table-sm table-striped border-dark">
                <tbody>
                    <tr><td>File Size</td><td class="text-end">{job.dataFileSize !== -1 ? formatUtils.formatBytes(job.dataFileSize) : ''}</td></tr>
                    <tr><td>Submitted</td><td class="text-end">{job.submittedTime ? formatUtils.formatDateTime(job.submittedTime) : ''}</td></tr>
                    <tr><td>Analysis Started</td><td class="text-end">{job.processingStartTime ? formatUtils.formatDateTime(job.processingStartTime) : ''}</td></tr>
                    <tr><td>Completed</td><td class="text-end">{job.completedTime ? formatUtils.formatDateTime(job.completedTime) : ''}</td></tr>
                    <tr><td>Expires</td><td class="text-end">{job.expiresTime ? formatUtils.formatDateTime(job.expiresTime) : ''}</td></tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="row">
        <div class="col-12 d-flex justify-content-end">

            {#if job.status !== 'processing'}
                <button class="btn btn-danger" class:disabled={buttonsDisabled} on:click|preventDefault={() => deleteJob()}>Delete</button>
            {/if}
            {#if job.status === 'completed' && job.dataFileSize > 0}
                <form method="POST" action="/analysis/download" class="ms-2">
                    <input type="hidden" name="jobId" value="{job.id}">
                    <input type="submit" class="btn btn-primary" class:disabled={buttonsDisabled} value="Download" />
                </form>
            {/if}
        </div>
    </div>

</div>