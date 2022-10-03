<script>
    import * as formatUtils from '$lib/client/utils/format-utils.js';
    import { createEventDispatcher, getContext } from "svelte";

    export let job;

    const dispatch = createEventDispatcher();

    let appContext = getContext('appContext');

    async function deleteJob() {
        try {

            // TODO fetch, if error and status !== 404, showAlert()

            // on success
            dispatch('delete');

        } catch (e) {
            console.error(e);
            appContext.showAlert('Unknown error', e.message, 'danger');
        }

    }

    // TODO only show buttons when job is finished
    // TODO make a checkbox / swith to enable delete button
    // TODO make all values (and missing values) come from the job
    // TODO lav så knapper virker

</script>


<div class="container-fluid px-0">
    <div class="row">
        <div class="col-lg-6">
            <table class="table table-sm table-striped">
                <tbody>
                    <tr><td>Id</td><td class="text-end"><code>{job.id}</code></td></tr>
                    <tr><td>Submitted</td><td class="text-end">{job.submittedTime ? formatUtils.formatDateTime(job.submittedTime) : ''}</td></tr>
                    <tr><td>Analysis Started</td><td class="text-end">{job.processingStartTime ? formatUtils.formatDateTime(job.processingStartTime) : ''}</td></tr>
                    <tr><td>Completed</td><td class="text-end">{job.completedTime ? formatUtils.formatDateTime(job.completedTime) : ''}</td></tr>

                </tbody>
            </table>
        </div>
        <div class="col-lg-6">
            <table class="table table-sm table-striped">
                <tbody>
                    <tr><td>Status</td><td class="text-end">{job.status}</td></tr>
                    <tr><td>Url Count</td><td class="text-end">{job.urlCount}</td></tr>
                    <tr><td>File Size</td><td class="text-end">{job.dataFileSize !== -1 ? formatUtils.formatBytes(job.dataFileSize) : ''}</td></tr>
                    <tr><td>Expires</td><td class="text-end">{job.expiresTime ? formatUtils.formatDateTime(job.expiresTime) : ''}</td></tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="row">
        <div class="col-12 d-flex justify-content-end">

            {#if job.status !== 'processing'}
                <button class="btn btn-danger">Delete</button>
            {/if}
            {#if job.status === 'completed' && job.dataFileSize > 0}
                <form method="POST" action="/analysis/download" class="ms-2">
                    <input type="hidden" name="jobId" value="{job.id}">
                    <input type="submit" class="btn btn-primary" value="Download" />
                </form>
            {/if}
        </div>
    </div>

</div>




TODO make delete button on:click action, and make a toggle to enable delete button.
On click call ajax POST delete request, and disable button. On result og success or 404 in json response, emit deleted event, so parent can remove and revalidate the page.
If anay other other, alert the error (how???) and enable the delete button...