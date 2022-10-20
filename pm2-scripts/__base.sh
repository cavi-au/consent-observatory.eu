#!/bin/bash

BASE_SCRIPT_ABSOLUTE_PATH=$(dirname "$(realpath $0)")
REQUIRED_USER="apps"

if [ "$(whoami)" != "$REQUIRED_USER" ]; then
    echo "Script must be run as user: $REQUIRED_USER"
    exit 255
fi

source "$BASE_SCRIPT_ABSOLUTE_PATH/env.sh"

if [ -z "$APP_NAME" ]; then
   echo "APP_NAME must be set in env.sh"
   exit 255
fi


if [ -z "$APP_ROOT_DIR" ]; then
   echo "APP_ROOT_DIR must be set in env.sh"
   exit 255
fi

cd "$APP_ROOT_DIR"
