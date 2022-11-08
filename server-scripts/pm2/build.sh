#!/bin/bash

SCRIPT_ABSOLUTE_PATH=$(dirname "$(realpath $0)")

# the base script changes directory to the root of the app dir
source "$SCRIPT_ABSOLUTE_PATH/__base.sh"

npm i # use package-lock.json to install the exact packages as in dev
npm run build
