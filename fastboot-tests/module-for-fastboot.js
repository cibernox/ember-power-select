var RSVP    = require('rsvp');
var request = RSVP.denodeify(require('request'));
var jsdom   = require("jsdom").jsdom;
var express = require('express');
var FastBootServer = require('ember-fastboot-server');

var server = new FastBootServer({
  distPath: 'fastboot-dist',
  ui: {
    writeLine: function() {
      console.log.apply(console, arguments);
    }
  }
});

module.exports = function moduleForFastboot(name, opts) {
  var opts = opts || {};
  var app = express();
  var appPort = 3211;
  app.get('/*', server.middleware());
  app.listen(3211);

  function visit(path) {
    return request('http://localhost:' + appPort + path)
      .then(function(response) {
        return [
          response.statusCode,
          response.headers,
          jsdom(response.body).defaultView.document
        ];
      });
  }

  QUnit.module('Fastboot: ' + name, {
    beforeEach: function() {
      this.app = app;
      this.visit = visit.bind(this);

      if (opts.beforeEach) {
        opts.beforeEach.call(this);
      }

    },

    afterEach() {
      // Kill the app
      if (opts.beforeEach) {
        opts.beforeEach.call(this);
      }
    }
  });
}