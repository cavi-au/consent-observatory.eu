#!/bin/bash

SCRIPT_ABSOLUTE_PATH=$(dirname "$(realpath $0)")

# the base script changes directory to the root of the app dir
source "$SCRIPT_ABSOLUTE_PATH/__base.sh"

$SCRIPT_ABSOLUTE_PATH/stop.sh > /dev/null # stop & remove running app to make sure we do a hard restart
pm2 start ./build/index.js --name "$APP_NAME" --max-restarts 10
pm2 save

