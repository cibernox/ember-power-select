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

  QUnit.module('Fastboot: ' + name, {
    beforeEach: function() {
      this.app = express();
      this.appPort = 3211;
      this.app.get('/*', server.middleware());
      this.app.listen(3211);
      if (opts.beforeEach) {
        opts.beforeEach.call(this);
      }
      var context = this;

      this.visit = function(path) {
        context._document = null;
        return request('http://localhost:' + context.appPort + path)
          .then(function(response) {
            context.statusCode = response.statusCode;
            context.headers = response.headers;
            context.body = response.body;
            return response;
          });
      }
      Object.defineProperties(context, {
        document: {
          get: function() {
            if (this._document) {
              return this._document;
            } else {
              return this._document = jsdom(this.body).defaultView.document;
            }
          },
          configurable: true,
          enumerable: true
        }
      });
    },

    afterEach() {
      // Kill the app
      if (opts.beforeEach) {
        opts.beforeEach.call(this);
      }
    }
  });
}