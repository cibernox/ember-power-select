var moduleForFastboot = require('./module-for-fastboot');

moduleForFastboot('Basic rendering');

QUnit.test('it renders', function(assert) {
  assert.expect(15);

  return this.visit('/fastboot-test').then(function() {
    assert.equal(this.statusCode, 200, 'Request is successful');
    assert.equal(this.headers["content-type"], "text/html; charset=utf-8", 'Content type is correct');
    var select;

    // Single select without selected
    select = this.document.querySelector('#single-select-without-selected .ember-power-select');
    assert.ok(select, 'The select has been rendered');
    assert.ok(select.querySelector('.ember-power-select-trigger'), 'It contains a trigger');
    assert.equal(select.textContent.trim(), '', 'Nothing is selected');

    // Single select with selected
    select = this.document.querySelector('#single-select-with-selected .ember-power-select');
    assert.ok(select, 'The select has been rendered');
    assert.ok(select.querySelector('.ember-power-select-trigger'), 'It contains a trigger');
    assert.equal(select.textContent.trim(), 'four', 'The forth option is selected');

    // Multiple select without selected
    select = this.document.querySelector('#multiple-select-without-selected .ember-power-select');
    assert.ok(select, 'The select has been rendered');
    assert.ok(select.querySelector('.ember-power-select-trigger'), 'It contains a trigger');
    assert.equal(select.textContent.trim(), '', 'Nothing is selected');

    // Multiple select with selected
    select = this.document.querySelector('#multiple-select-with-selected .ember-power-select');
    assert.ok(select, 'The select has been rendered');
    assert.ok(select.querySelector('.ember-power-select-trigger'), 'It contains a trigger');
    assert.equal(select.querySelectorAll('.ember-power-select-multiple-option').length, 2, 'There is 2 selected options');
    assert.ok(/two/.test(select.textContent.trim()), 'Two and six are selected');
  }.bind(this));
});
