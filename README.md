# Consent Observatory
TODO SOME INFO ABOUT THE PROJECT

## Env Variables
create a `.env` file in the root of the project or set them using the host environment.
- `JOBS_ROOT_DIR` **[required]** where should pending, running and finished jobs be stored?
- `RULES_DIR` **[required]** where are the rules files located for the `web-extractor`?
- `JOBS_COMPLETED_EXPIRATION_TIME_MS [default=604800000]` how long should completed jobs (and their data) be kept?
- `USER_DEFAULT_MAX_URLS [default=10]` How many urls can a regular user submit for analysis?
- `USER_DEFAULT_MAX_JOBS [default=1]` How many jobs can a regular user have registered?
- `USER_WHITELIST_MAX_URLS [default=100]` How many urls can a whitelisted user submit for analysis?
- `USER_WHITELIST_MAX_JOBS [default=1]` How many jobs can a whitelisted user have registered?
- `USER_EMAIL_WHITELIST_FILE_PATH [default=]` The path for a newline delimited list of whitelisted user emails
- `MAIL_SMTP_HOST` **[required]** SMTP-server hostname (e.g. `smtp.example.com`)
- `MAIL_SMTP_PORT` **[required]** SMTP-server port
- `MAIL_SMTP_USER` **[required]** SMTP-server username (most likely the email address)
- `MAIL_SMTP_PASS` **[required]** SMTP-server password (most likely password for the email address)
- `MAIL_MESSAGE_FROM` **[required]** the email to set as the `from` field (e.g. `info@example.com` or `"John Doe" <info@example.com>`)
- `MAIL_SMTP_DISABLE_VERIFICATION [default=false]` set to `true` disable the verification check when server starts, disable this during development for faster restart times 

## Configuring Rules (Rulesets)
Rules are defined in rulesets which is one or more rule-files as described in the [Web-Extractor documentation](https://github.com/centre-for-humanities-computing/web-extractor)
and a `__ui.json` file. Rulesets can be defined in `RULES_DIR` directory as well as direct subdirectories of the `RULES_DIR`directory. 
At least one ruleset must be present for the application to start.

**Example Structure**
```shell
/example/path/rules
├─ __ui.json
├─ general-rule1.js
├─ general-rule2.js
├─ denmark
   ├─ _ui.json
   ├─ dk-rule.js
├─ germany
   ├─ __ui.json
   ├─ germany-rule.js    
```

### __ui.json
The `__ui.json` files has the following structure and is used for configuring the user-interface for the given ruleset and define which
options should be passed to the `init()` method of the rules in the ruleset making it possible to have different options for each ruleset.

```json5
{
  "name": "Example Name", // [REQUIRED] name shown in ui, this must be unique
  "description": "Description of the ruleset", // [REQUIRED] description shown in the ui, what is the ruleset typically used for
  "sortKey": 1, // a number to compare this ruleset to other rulesets, if not defined the name will be used for sorting
  "options": [ // zero or more option objects
    {
      "type": "checkbox", // [REQUIRED]
      "key": "includeParagraph", // [REQUIRED] the key will be used as property in the options object
      "label": "Include paragraphs in the result", // [REQUIRED] the label of the checkbox 
      "description": "If selected paragraphs will be extracted", // an optional description which will be shown below the checkbox in the ui
    },
    {
      "type": "radio", // [REQUIRED] 
      "key": "extractType", // [REQUIRED] the key will be used as property in the options object
      "title": "Extraction Type", // an optional title to show above the radio buttons
      "description": "What should be included in the result?", // an optional description which will be shown below the radio buttons in the ui
      "options": [
        {
          "label": "Deep Search",
          "value": "deep"
        },
        {
          "label": "Shallow Search",
          "value": "shallow"
        }
      ]
    }
  ],
}
```


TODO mere beskrivelse og visning screenshot af ui.

TODO beskriv hvordan init() bliver kaldt og med hvad

## Ruleset Example
// TODO lav færdig
The following ruleset will make it possible to choose which heading to include in the output.
// TODO make a __ui.json for h1,h2,h3,h4,h5,h6 options and a rule working with these options vis med init osv.
