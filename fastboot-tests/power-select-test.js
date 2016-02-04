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

var app = express();
app.get('/*', server.middleware());

app.listen(3210);

QUnit.module('Fastboot render');

QUnit.test('it renders', function(assert) {
  assert.expect(15);

  return request('http://localhost:3210/fastboot-test').then(function(response) {
    assert.equal(response.statusCode, 200, 'Request is successful');
    assert.equal(response.headers["content-type"], "text/html; charset=utf-8", 'Content type is correct');
    var document = jsdom(response.body).defaultView.document;
    var select;

    // Single select without selected
    select = document.querySelector('#single-select-without-selected .ember-power-select');
    assert.ok(select, 'The select has been rendered');
    assert.ok(select.querySelector('.ember-power-select-trigger'), 'It contains a trigger');
    assert.equal(select.textContent.trim(), '', 'Nothing is selected');

    // Single select with selected
    select = document.querySelector('#single-select-with-selected .ember-power-select');
    assert.ok(select, 'The select has been rendered');
    assert.ok(select.querySelector('.ember-power-select-trigger'), 'It contains a trigger');
    assert.equal(select.textContent.trim(), 'four', 'The forth option is selected');

    // Multiple select without selected
    select = document.querySelector('#multiple-select-without-selected .ember-power-select');
    assert.ok(select, 'The select has been rendered');
    assert.ok(select.querySelector('.ember-power-select-trigger'), 'It contains a trigger');
    assert.equal(select.textContent.trim(), '', 'Nothing is selected');

    // Multiple select with selected
    select = document.querySelector('#multiple-select-with-selected .ember-power-select');
    assert.ok(select, 'The select has been rendered');
    assert.ok(select.querySelector('.ember-power-select-trigger'), 'It contains a trigger');
    assert.equal(select.querySelectorAll('.ember-power-select-multiple-option').length, 2, 'There is 2 selected options');
    assert.ok(/two/.test(select.textContent.trim()), 'Two and six are selected');
  });
});