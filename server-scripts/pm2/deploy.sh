#!/bin/bash

# Runs both build and start scripts
SCRIPT_ABSOLUTE_PATH=$(dirname "$(realpath $0)")

$SCRIPT_ABSOLUTE_PATH/build.sh
$SCRIPT_ABSOLUTE_PATH/start.sh
