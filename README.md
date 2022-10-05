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
