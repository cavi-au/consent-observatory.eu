#!/bin/bash

SCRIPT_ABSOLUTE_PATH=$(dirname "$(realpath $0)")

source "$SCRIPT_ABSOLUTE_PATH/__base.sh"

# the base scripts changes directory to the root of the app dir

# Delete also removes configured environment variables so we can start with a clean slate
pm2 delete "$APP_NAME"
pm2 save # don't rerun the app when server reboots

