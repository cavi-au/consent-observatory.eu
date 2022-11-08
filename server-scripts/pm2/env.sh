export APP_ROOT_DIR="/apps/consent-observatory.eu"
export APP_NAME="consent-observatory.eu"
export JOBS_ROOT_DIR="" # [REQUIRED] where should pending, running and finished jobs be stored?
export RULES_DIR="" # [REQUIRED] where are the rules files located for the `web-extractor`?
export JOBS_COMPLETED_EXPIRATION_TIME_MS="604800000" # how long should completed jobs (and their data) be kept?
export USER_DEFAULT_MAX_URLS="10" # How many urls can a regular user submit for analysis?
export USER_DEFAULT_MAX_JOBS="1" # How many jobs can a regular user have registered?
export USER_WHITELIST_MAX_URLS="100" # How many urls can a whitelisted user submit for analysis?
export USER_WHITELIST_MAX_JOBS="1" # How many jobs can a whitelisted user have registered?
export USER_EMAIL_WHITELIST_FILE_PATH="" # The path for a newline delimited list of whitelisted user emails
export MAIL_SMTP_HOST="" # [REQUIRED] SMTP-server hostname (e.g. `smtp.example.com`)
export MAIL_SMTP_PORT="" # [REQUIRED] SMTP-server port
export MAIL_SMTP_USER="" # [REQUIRED] SMTP-server username (most likely the email address)
export MAIL_SMTP_PASS="" # [REQUIRED] SMTP-server password (most likely password for the email address)
export MAIL_MESSAGE_FROM="" # [REQUIRED] the email to set as the `from` field (e.g. `info@example.com` or `"John Doe" <info@example.com>`)
export MAIL_SMTP_DISABLE_VERIFICATION="false" # set to `true` disable the verification check when server starts, disable this during development for faster restart times
export MAIL_DISABLED="false" # set to `true` disable sending emails
export PORT="3000" # the port the server should use
export ORIGIN="https://consent-observatory.eu" # the host name the server is running on, e.g. https://my.example

# chrome sandbox, see README.md file for details
export CHROME_DEVEL_SANDBOX="/usr/local/sbin/chrome-devel-sandbox"