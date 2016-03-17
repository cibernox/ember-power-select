import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | helpers | selectChoose');

test('selectChoose helper opens the select and selects the option with the given text', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    selectChoose('.select-choose', 'three');
  });

  andThen(function() {
    assert.equal(find('.select-choose .ember-power-select-trigger').text().trim(), 'three', 'The proper value has been selected');
    assert.equal($('.ember-power-select-options').length, 0, 'The selectis closed');
    assert.equal(find('.select-choose-target').text().trim(), 'You\'ve selected: three');
  });
});

test('selectChoose selects the option with the given text on an already opened select', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    click('.select-choose .ember-power-select-trigger');
  });

  andThen(function() {
    selectChoose('.select-choose', 'three');
  });

  andThen(function() {
    assert.equal(find('.select-choose .ember-power-select-trigger').text().trim(), 'three', 'The proper value has been selected');
    assert.equal($('.ember-power-select-options').length, 0, 'The selectis closed');
    assert.equal(find('.select-choose-target').text().trim(), 'You\'ve selected: three');
  });
});

test('the selectChoose helper works with an onopen function that fetches data async on single selects', function(assert) {
  visit('/helpers-testing');
  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    selectChoose('.select-choose-onopen', 'three');
  });
  andThen(function() {
    assert.equal(find('.select-choose-onopen .ember-power-select-trigger').text().trim(), 'three', 'The proper value has been selected');
    assert.equal($('.ember-power-select-options').length, 0, 'The selectis closed');
    assert.equal(find('.select-choose-target').text().trim(), 'You\'ve selected: three');
  });
});

test('the selectChoose helper works with an onopen function that fetches data async on multiple selects', function(assert) {
  visit('/helpers-testing');
  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    selectChoose('.select-choose-onopen-multiple', 'three');
  });
  andThen(function() {
    assert.equal(find('.select-choose-onopen-multiple .ember-power-select-multiple-option').length, 1, 'One options has been selected');
    assert.ok(/three/.test(find('.select-choose-onopen-multiple .ember-power-select-multiple-option:eq(0)').text().trim()), 'The proper value has been selected');
    assert.equal($('.ember-power-select-options').length, 0, 'The selectis closed');
  });
});

moduleForAcceptance('Acceptance | helpers | selectSearch');

test('selectSearch helper searches in the given single select if it is already opened', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    click('.select-async .ember-power-select-trigger');
    selectSearch('.select-async', 'three');
  });

  andThen(function() {
    assert.equal(find('.ember-power-select-options').text().trim(), 'three');
  });
});

test('selectSearch helper searches in the given single select, opening it if needed', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    selectSearch('.select-async', 'three');
  });

  andThen(function() {
    assert.equal(find('.ember-power-select-options').text().trim(), 'three');
  });
});

test('selectSearch helper searches in the given multiple select opened', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    click('.select-multiple .ember-power-select-trigger');
    selectSearch('.select-multiple', 'three');
  });

  andThen(function() {
    assert.equal(find('.ember-power-select-options').text().trim(), 'three');
  });
});

test('selectSearch helper searches in the given multiple select closed', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    selectSearch('.select-multiple', 'three');
  });

  andThen(function() {
    assert.equal(find('.ember-power-select-options').text().trim(), 'three');
  });
});