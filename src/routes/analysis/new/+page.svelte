<script>

    let formValid = false;

    function validateForm() {

    }

</script>

<h1>Submit a New Analysis</h1>

<form>
    <div class="mb-3">
        <label for="email-field" class="form-label">Your Email address</label>
        <input type="email" class="form-control" id="email-field" aria-describedby="email-field-info" placeholder="example@example.eu">
        <div id="email-field-info" class="form-text">Email is only used for sending you the information about your analysis. We'll never share your email with anyone else.</div>
    </div>
    <div class="mb-3">
        <label for="urls-field" class="form-label">Urls (Maximum 10)</label>
        <textarea class="form-control" id="urls-field" rows="10" aria-describedby="urls-field-info" placeholder="{`https://example.eu
https://example2.eu`}"></textarea>
        <div id="urls-field-info" class="form-text">The urls to analyze. Each url should be on it's own line.</div>
    </div>
    <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="include-screenshots-checkbox">
        <label class="form-check-label" for="include-screenshots-checkbox" aria-describedby="include-screenshots-checkbox-info">Include Screenshots</label>
        <div id="include-screenshots-checkbox-info" class="form-text">If selected a screenshot of each url analyzed will be included in the result</div>
    </div>
    <button type="submit" class="btn btn-primary" disabled={!formValid}>Submit</button>
</form>

Følg bare sveltekits form guide og bruge use:enhance ,
Ved success viser vi bare en besked om tak for request, request status kan ses på link..., der er også blevet sendt en mail med linket til din email.

Og formen vises ikke... det gør den så når trykker på menu igen..

Lav validering på serveren. tjek email (for om det er en email), tjek om alle url er gyldige, og ellers skriv hvilke der ikke er er (som fejlbesked).
Antal url'es afhænger af om de på whitelist eller ej, tjek om de opfylder krav hvis ikke på whitelist
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