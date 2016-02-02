#!/bin/bash
ember fastboot --no-build &
FASTBOOT_SERVER_PID=$!
sleep 5
node fastboot-tests/runner.js
# TESTS_EXIT_CODE=$!
kill -9 $FASTBOOT_SERVER_PID
# if $TESTS_EXIT_CODE != 0; then
#   exit 0
# fi
