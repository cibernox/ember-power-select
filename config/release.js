/* jshint node:true */
// var RSVP = require('rsvp');

// For details on each option run `ember help release`
var simpleGit = require('simple-git')();

module.exports = {
  // local: true,
  // remote: 'some_remote',
  // annotation: "Release %@",
  // message: "Bumped version to %@",
  // manifest: [ 'package.json', 'bower.json', 'someconfig.json' ],
  // strategy: 'date',
  // format: 'YYYY-MM-DD',
  // timezone: 'America/Los_Angeles',
  //
  beforeCommit: function(project, versions) {
    require('../compile-css.js'); // Requiring the file compiles
    return new Promise(function(resolve) {
      simpleGit.add(['vendor/ember-power-select.css'], function() {
        resolve();
      });
    });
  }
};
