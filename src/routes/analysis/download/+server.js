import { error } from '@sveltejs/kit';
import { jobExecutor } from "../../../server-state.js";
import { JobExecutor } from "$lib/server/analysis/job-executor.js";

export async function POST({ request }) {

    let formData = await request.formData();
    let jobId = formData.get('jobId');

    if (!jobId) {
        throw error(400, 'The request must have a jobId');
    }
    let job = jobExecutor.getJobById(jobId);
    if (!job) {
        throw error(400, `Unknown jobId: "${jobId}"`);
    }
    if (jobExecutor.getJobStatus(job) !== JobExecutor.jobStatus.COMPLETED) {
        throw error(400, 'Job is not completed yet');
    }

    let fileSize = jobExecutor.getJobDataFileSize(job);
    if (fileSize < 0) {
        throw error(500, 'No file exists for job');
    }

    let stream = jobExecutor.getJobDataReadStream(job);

    return new Response(stream, { headers: {
            'Content-Disposition': 'attachment; filename="consent-observatory-result.zip"',
            'Content-Type': 'application/zip',
            'Content-Length': `${fileSize}`
        }
    });


}