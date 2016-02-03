var RSVP    = require('rsvp');
var request = RSVP.denodeify(require('request'));

QUnit.module('Fastboot render');

QUnit.test('it renders', function(assert) {
  assert.expect(1);

  return request('http://localhost:3000').then(function(response) {
    console.log(response.body);
    assert.equal(response.statusCode, 200, 'Request is successful');
    assert.equal(response.headers["content-type"], "text/html; charset=utf-8", 'Content type is correct');
    assert.equal(response.body);
  });
});