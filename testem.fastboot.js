/* jshint node:true */
var tmpDistFolder = process.env['EMBER_CLI_TEST_OUTPUT'];

var options = {
  "framework": "qunit",
  "test_page": "tests/index.html?hidepassed",
  "disable_watching": true,
  "launchers": {
    "fastboot": {
      "command": "node node_modules/ember-cli-fastboot/app-test-runner.js " + tmpDistFolder
    }
  },
  "launch_in_ci": [
    "fastboot"
  ],
  "launch_in_dev": [
    "fastboot"
  ]
}

module.exports = options;