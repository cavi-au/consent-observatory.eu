import { error } from '@sveltejs/kit';
import { jobService } from "../../../server-state.js";
import { JobService } from "$lib/server/analysis/job-service.js";

export async function POST({ request }) {

    let formData = await request.formData();
    let jobId = formData.get('jobId');

    if (!jobId) {
        throw error(400, 'The request must have a jobId');
    }
    let job = jobService.getJobById(jobId);
    if (!job) {
        throw error(400, `Unknown jobId: "${jobId}"`);
    }
    if (jobService.getJobStatus(job) !== JobService.jobStatus.COMPLETED) {
        throw error(400, 'Job is not completed yet');
    }

    let fileSize = jobService.getJobDataFileSize(job);
    if (fileSize < 0) {
        throw error(500, 'No file exists for job');
    }

    let stream = jobService.getJobDataReadStream(job);

    return new Response(stream, { headers: {
            'Content-Disposition': 'attachment; filename="consent-observatory-result.zip"',
            'Content-Type': 'application/zip',
            'Content-Length': `${fileSize}`
        }
    });


}