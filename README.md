# Consent Observatory
TODO SOME INFO ABOUT THE PROJECT

## Env Variables
create a `.env` file in the root of the project or set them using the host environment.
- `JOBS_ROOT_DIR [required]` where should pending, running and finished jobs be stored?
- `RULES_DIR [required]` where are the rules files located for the `web-extractor`?
- `JOBS_COMPLETED_EXPIRATION_TIME_MS [default=604800000]` how long should completed jobs (and their data) jobs be kept?
- `USER_DEFAULT_MAX_URLS [default=10]` How many urls can a regular user submit for analysis?
- `USER_DEFAULT_MAX_JOBS [default=1]` How many jobs can a regular user have registered?
- `USER_WHITELIST_MAX_URLS [default=100]` How many urls can a whitelisted user submit for analysis?
- `USER_WHITELIST_MAX_JOBS [default=1]` How many jobs can a whitelisted user have registered?
- `USER_EMAIL_WHITELIST_FILE_PATH [default=]` The path for a newline delimited list of whitelisted user emails
