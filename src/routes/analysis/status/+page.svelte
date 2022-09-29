<script>

   /* Make +page.server.js
   * if url contains jobid=dfdfdfd
   * fetch status and include as page data
   * If no jobid just show page
   * If jobid but not found, show form and warning, jobid not found
   * */

   let jobId = "e2e7530f-36fb-4101-b2ab-71d024796bd7";

</script>

<form method="POST" action="/analysis/download">
    <input type="hidden" name="jobId" value="{jobId}">
    <input type="submit" value="Download" />
</form>

TODO make the input field for job-id and submit button, on submit show results, see above...
