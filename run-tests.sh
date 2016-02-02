ember fastboot --no-build &
FASTBOOT_SERVER_PID=$!
sleep 5
node fastboot-tests/runner.js && kill -9 $FASTBOOT_SERVER_PID
