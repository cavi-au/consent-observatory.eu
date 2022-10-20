# Consent Observatory
TODO SOME INFO ABOUT THE PROJECT

## Installation
* Clone this repository
* `cd`to the project root and run `npm install`
* Configure the required `env` variables described below
* For development run `npm run dev` for production run `npm run build` and then run the server application 
  using node `build/index.js` (use e.g. `pm2` for running the server in production, see below example)

### Env Variables
For development create a `.env` file in the root of the project or set them using the host environment. 
For the production build the variables must be set in the host environment.
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
- `MAIL_DISABLED [default=false]` set to `true` disable sending emails
- `PORT [default=3000]` (only used for production) the port the server should use
- `ORIGIN` (only used for production) the host name the server is running on, e.g. https://my.example

for the full list of production `env` variables see https://github.com/sveltejs/kit/tree/master/packages/adapter-node

### Server Setup With PM2 for Production
The following is a full guide for installing and running the project on an linux (unbuntu) server. The example 
will run most commands ass a system user called `apps` (instructions below), so multiple users are able to start/stop/deploy the
app and so the app is not running as `root`.

#### Requirements
* git is installed
* node.js >= 16.x is installed

#### installation
* install pm2 `sudo npm install pm2@latest -g`
* create a user "apps" for running our app `sudo adduser --system --shell /bin/bash --group apps`
* create a startup script for pm2 to run as the "apps" user `sudo -u apps pm2 startup` copy the generated line and run it
* create a directory for the installation and pm2 scripts `sudo mkdir /apps && sudo chown apps:apps /apps`
* switch to apps user `sudo su apps`
* clone the git repo `git clone https://github.com/centre-for-humanities-computing/consent-observatory.eu.git`
  * To update the existing git repo `cd /apps/consent-observatory.eu` and run `git pull origin master`
* create a directory for the pm2 scripts `mkdir -p /apps/run-scripts/consent-observatory.eu`
* copy the pm2 scripts and make them executable `cp /apps/consent-observatory.eu/server-scripts/pm2/ /apps/run-scripts/consent-observatory.eu/`
* make the scripts executable `cd /apps/run-scripts/consent-observatory.eu && chmod ug+x start.sh stop.sh build.sh deploy.sh`
* edit the `env.sh` file and add the missing values (and change paths if required)
* **TODO SETUP APACHE 2, inkluder også fil til config af site for den**

#### Usage
> **NOTE** All commands should be run as the "apps" user unless explicitly stated
* change to the "apps" user `sudo su apps`
* navigate to the "run-scripts" dir `cd /apps/run-scripts/consent-observatory.eu`
* start and stop the application using `./start.sh` and `./stop.sh`
* After and update of the project (from git) use `./deploy.sh` (which will run `stop.sh`, `build.sh` and `start.sh`)

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
  "name": "Extract Text", // [REQUIRED] name shown in ui, this must be unique
  "description": "A general rule for extraction headings and paragraphs", // [REQUIRED] description shown in the ui, what is the ruleset typically used for
  "sortKey": 1, // a number to compare this ruleset to other rulesets, if not defined the name will be used for sorting
  "options": [ // an optional set of option objects
    {
      "type": "checkbox", // [REQUIRED]
      "key": "includeParagraph", // [REQUIRED] the key will be used as property in the options object
      "label": "Include paragraphs in the result", // [REQUIRED] the label of the checkbox 
      "description": "If selected paragraphs will be extracted" // an optional description which will be shown below the checkbox in the ui
    },
    { // another checkbox, same rules as above apply
      "type": "checkbox",
      "key": "includeHeadings",
      "label": "Include headings in the result",
      "description": "If selected headings (h1-h6) will be extracted"
    },
    {
      "type": "radio", // [REQUIRED] 
      "key": "extractType", // [REQUIRED] the key will be used as property in the options object
      "title": "Extraction Type", // an optional title to show above the radio buttons
      "description": "What should be included in the result?", // an optional description which will be shown below the radio buttons in the ui
      "options": [ // [REQUIRED] at least one radio button must be present
        {
          "label": "Only Text", // [REQUIRED] the label of the radio button
          "value": "textOnly" // [REQUIRED] the value so set for the "key" in the options object if this radio button is selected
        },
        {
          "label": "Text and HTML", // [REQUIRED] the label of the radio button
          "value": "textAndHTML" // [REQUIRED] the value so set for the "key" in the options object if this radio button is selected
        }
      ]
    }
  ]
}
```

#### Option Sections
Options can be divided into sections with ther own title and sections can include other sections to create nested structures.

```json5
{
  "name": "Some Name",
  "description": "Some desc...",
  "options": [
    { // options defined here will be at the root level
      "type": "checkbox",
      "key": "someKey",
      "label": "someLabel",
    },
    { // create a section with its own title and options
      "type": "section", // [REQUIRED]
      "title": "Extract the Following Element Types", // [REQUIRED] the title of the section
      "options": [
        {
          "type": "checkbox",
          "key": "includeH1",
          "label": "H1"
        },
        {
          "type": "checkbox",
          "key": "includeH2",
          "label": "H2"
        },
        {
          "type": "checkbox",
          "key": "includeH3",
          "label": "H3"
        }
      ]
    }
  ]
}
```

### Rule Init Options
The `init()` method (if defined) will for each rule, before extraction, be called with an object in the following format, where the `ruleset` property
will correspond the chosen ruleset and options for the ruleset selected by the user.

```js
{
  destDir: "/some/path", // the path where the result will be stored, can be used to include additional data
  ruleset: {
    name: "name-of-ruleset", // the name of the chosen ruleset
    options: { // the options defined in __ui.json file for this ruleset and the values selected by the user
      key1: "someValue",
      key2: "someValue"
    }
  }
}
```

### Ruleset Example

The following ruleset will make it possible to choose which text content to extract and what format should be included in the output in the output.


**__ui.json**

```json5
{
  "name": "Text Content",
  "description": "Use this rule for extracting text elements",
  "options": [
    {
      "type": "radio",
      "key": "extractScope",
      "title": "What should be extracted?",
      "options": [
        {
          "label": "Text",
          "value": "text"
        },
        {
          "label": "HTML",
          "value": "html"
        },
        {
          "label": "Text and HTML",
          "value": "textAndHTML"
        }
      ]
    },
    {
      "type": "section",
      "title": "Elements to Extract",
      "options": [
        {
          "type": "checkbox",
          "key": "extractParagraphs",
          "label": "Extract Paragraphs",
          "description": "Extract all p-elements"
        },
        {
          "type": "checkbox",
          "key": "extractH1",
          "label": "Extract H1",
          "description": "Extract all h1-elements"
        },
        {
          "type": "checkbox",
          "key": "extractH2",
          "label": "Extract H2",
          "description": "Extract all h2-elements"
        },
        // ... etc ...
      ]
    }
  ]
}
```

**text-content-rule.js**
```js
export default {
    init(options) {
        this.options = options;
    },
    extractorOptions() {
        return this.options;
    },
    extractor: {
        extract(template = {}, url, options) {
            const rulesetOptions = options.ruleset.options;
            function saveData(key, elements) {
                elements = [...elements]; // turn into an array of elements, so we can use array methods
                let result = {};
                if (rulesetOptions.extractScope.includes('text')) {
                    result.text = elements.map(element => element.textContent);
                }
                if (rulesetOptions.extractScope.includes('HTML')) {
                    result.HTML = elements.map(element => element.outerHTML);
                }
                template[key] = result;
            }
            if (rulesetOptions.extractParagraphs) {
                saveData('p', document.querySelectorAll('p'));
            }
            for (let x = 1; x <= 6; x++) {
                if (rulesetOptions[`extractH${x}`]) {
                    saveData(`h${x}`, document.querySelectorAll(`h${x}`));
                }
            }
            return template;
        }
    }
};
```
