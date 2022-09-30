<script>
    import * as formatUtils from '$lib/client/utils/format-utils.js';

    export let job;

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
                    <tr><td>Submitted</td><td class="text-end">{job.submitTime ? formatUtils.formatDateTime(job.submittedTime) : ''}</td></tr>
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
                    <tr><td>File Size</td><td class="text-end">{job.dataSize !== -1 ? formatUtils.formatBytes(job.dataSize) : ''}</td></tr>
                    <tr><td>Expires</td><td class="text-end">2021-10-21 12:00:00</td></tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="row">
        <div class="col-12 d-flex justify-content-end">

            {#if (job.status !== 'processing')}
                <button class="btn btn-danger">Delete</button>
            {/if}

            <form method="POST" action="/analysis/download" class="ms-2">
                <input type="hidden" name="jobId" value="{job.id}">
                <input type="submit" class="btn btn-primary" value="Download" />
            </form>
        </div>
    </div>

</div>




TODO make the input field for job-id and submit button, on submit show results, see above...