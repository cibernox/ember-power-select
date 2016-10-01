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
    assert.equal(find('.ember-power-select-options').length, 0, 'The selectis closed');
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
    assert.equal(find('.ember-power-select-options').length, 0, 'The selectis closed');
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
    assert.equal(find('.select-choose-onopen .ember-power-select-trigger').text().trim().split(' ')[0].trim(), 'three', 'The proper value has been selected');
    assert.equal(find('.ember-power-select-options').length, 0, 'The select is closed');
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
    assert.equal(find('.ember-power-select-options').length, 0, 'The selectis closed');
  });
});

test('the selectChoose helper works when it receives the class of the trigger', function(assert) {
  visit('/helpers-testing');
  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    selectChoose('.select-with-class-in-trigger', 'three');
  });
  andThen(function() {
    assert.equal(find('.select-with-class-in-trigger').text().trim(), 'three', 'The proper value has been selected');
    assert.equal(find('.ember-power-select-options').length, 0, 'The selectis closed');
    assert.equal(find('.select-choose-target').text().trim(), 'You\'ve selected: three');
  });
});

test('the selectChoose helper works when it receives the css selector of the chosen option as second arguments', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    selectChoose('.select-with-class-in-trigger', '.ember-power-select-option:eq(2)');
  });

  andThen(function() {
    assert.equal(find('.select-choose').text().trim(), 'three', 'The proper value has been selected');
    assert.equal(find('.ember-power-select-options').length, 0, 'The selectis closed');
    assert.equal(find('.select-choose-target').text().trim(), 'You\'ve selected: three');
  });
});

test('the selectChoose helper works when it receives a wildcard css class', function(assert) {
  visit('/helpers-testing-single-power-select');
  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing-single-power-select');
    selectChoose('*', 'three');
  });
  andThen(function() {
    assert.equal(find('.select-choose').text().trim(), 'three', 'The proper value has been selected');
    assert.equal(find('.ember-power-select-options').length, 0, 'The selectis closed');
    assert.equal(find('.select-choose-target').text().trim(), 'You\'ve selected: three');
  });
});

test('selectChoose helper throws an explicative error when no select is found in the given scope', function(assert) {
  assert.expect(2);
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    selectChoose('.there-is-no-select', 'three').catch(function(error) {
      assert.equal(error.message, 'You called "selectChoose(\'.there-is-no-select\', \'three\')" but no select was found using selector ".there-is-no-select"');
    });
  });
});

test('selectChoose helper throws an explicative error when no option matches the given value', function(assert) {
  assert.expect(2);
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    selectChoose('.select-choose', 'non-existent-option').catch(function(error) {
      assert.equal(error.message, 'You called "selectChoose(\'.select-choose\', \'non-existent-option\')" but "non-existent-option" didn\'t match any option');
    });
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

test('selectSearch helper searches an opened select if using a wildcard css selector', function(assert) {
  visit('/helpers-testing-single-power-select');

  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing-single-power-select');
    click('.ember-power-select-trigger');
    selectSearch('*', 'three');
  });

  andThen(function() {
    assert.equal(find('.ember-power-select-options').text().trim(), 'three');
  });
});

test('selectSearch helper opens and searches select if using a wildcard css selector', function(assert) {
  visit('/helpers-testing-single-power-select');

  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing-single-power-select');
    click('.ember-power-select-trigger');
    selectSearch('*', 'three');
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

test('selectSearch helper works even with custom components as long as the input has [type=searcg]', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    click('.select-custom-search .ember-power-select-trigger');
    selectSearch('.select-custom-search', 'three');
  });

  andThen(function() {
    assert.equal(find('.ember-power-select-options').text().trim(), 'three');
  });
});

test('the selectSearch helper works when it receives the class of the trigger', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    selectSearch('.select-with-class-in-trigger', 'three');
  });

  andThen(function() {
    assert.equal(find('.ember-power-select-options').text().trim(), 'three');
  });
});

test('the selectSearch helper throws an explicative error when no select is found in the given scope', function(assert) {
  assert.expect(2);
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(currentURL(), '/helpers-testing');
    selectSearch('.there-is-no-select', 'three').catch(function(error) {
      assert.equal(error.message, 'You called "selectSearch(\'.there-is-no-select\', \'three\')" but no select was found using selector ".there-is-no-select"');
    });
  });
});

moduleForAcceptance('Acceptance | helpers | removeMultipleOption');

test('removeMultipleOption removes selected option', function(assert) {
  visit('/helpers-testing');

  selectChoose('.select-choose-onopen-multiple', 'three');
  selectChoose('.select-choose-onopen-multiple', 'four');
  andThen(function() {
    assert.equal(find('.select-choose-onopen-multiple .ember-power-select-trigger > .ember-power-select-multiple-options > li').length, 2, 'Multiple options selected');
  });

  removeMultipleOption('.select-choose-onopen-multiple', 'three');
  andThen(function() {
    assert.equal(find('.select-choose-onopen-multiple .ember-power-select-trigger > .ember-power-select-multiple-options > li').length, 1, 'One option removed');
  });

  removeMultipleOption('.select-choose-onopen-multiple', 'four');
  andThen(function() {
    assert.equal(find('.select-choose-onopen-multiple .ember-power-select-trigger > .ember-power-select-multiple-options > li').length, 0, 'Last option removed');
  });
});

test('removeMultipleOption works with async onchange action', function(assert) {
  visit('/helpers-testing');

  selectChoose('#select-multiple-async', 'three');
  selectChoose('#select-multiple-async', 'four');
  andThen(function() {
    assert.equal(find('#select-multiple-async .ember-power-select-multiple-option').length, 2, 'Multiple options selected');
  });

  removeMultipleOption('#select-multiple-async', 'three');
  andThen(function() {
    assert.equal(find('#select-multiple-async .ember-power-select-multiple-option').length, 1, 'One option removed');
  });
});

moduleForAcceptance('Acceptance | helpers | clearSelected');

test('clearSelected removes selected option', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.notOk(find('.select-choose-onopen .ember-power-select-clear-btn').text());
  });

  selectChoose('.select-choose-onopen', 'three');
  andThen(function() {
    assert.ok(find('.select-choose-onopen .ember-power-select-clear-btn').text());
    assert.ok(find('.select-choose-onopen .ember-power-select-selected-item').text(), 'three', 'The proper value has been selected');
  });

  clearSelected('.select-choose-onopen', 'three');
  andThen(function() {
    assert.notOk(find('.select-choose-onopen .ember-power-select-clear-btn').text());
  });
});

test('clearSelected works with async onchange action', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.notOk(find('.select-deselect-async .ember-power-select-clear-btn').text());
  });

  selectChoose('.select-deselect-async', 'three');
  andThen(function() {
    assert.ok(find('.select-deselect-async .ember-power-select-clear-btn').text());
    assert.ok(find('.select-deselect-async .ember-power-select-selected-item').text(), 'three', 'The proper value has been selected');
  });

  clearSelected('.select-deselect-async', 'three');
  andThen(function() {
    assert.notOk(find('.select-deselect-async .ember-power-select-clear-btn').text());
  });
});
