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
    var context = this;
    this._document = this.statusCode = this.headers = this.body = null;
    return request('http://localhost:' + appPort + path)
      .then(function(response) {
        context.statusCode = response.statusCode;
        context.headers = response.headers;
        context.body = response.body;
        return response;
      });
  }

  QUnit.module('Fastboot: ' + name, {
    beforeEach: function() {
      this.app = app;
      this.visit = visit.bind(this);

      Object.defineProperties(this, {
        document: {
          get: function() {
            if (this._document) {
              return this._document;
            } else if (this.body) {
              return this._document = jsdom(this.body).defaultView.document;
            }
          },
          configurable: true,
          enumerable: true
        }
      });

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