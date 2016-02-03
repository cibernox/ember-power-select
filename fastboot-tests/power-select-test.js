var RSVP    = require('rsvp');
var request = RSVP.denodeify(require('request'));
var jsdom   = require("jsdom").jsdom;

QUnit.module('Fastboot render');

QUnit.test('it renders', function(assert) {
  assert.expect(3);

  return request('http://localhost:3000').then(function(response) {
    assert.equal(response.statusCode, 200, 'Request is successful');
    assert.equal(response.headers["content-type"], "text/html; charset=utf-8", 'Content type is correct');
    var document = jsdom(response.body).defaultView.document;
    var eps = document.querySelector('.ember-power-select');
    assert.ok(eps, 'The select has been rendered');
  });
});