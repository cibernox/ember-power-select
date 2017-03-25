import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import { currentURL, find, findAll, click, visit } from 'ember-native-dom-helpers';

moduleForAcceptance('Acceptance | helpers | selectChoose');

test('selectChoose helper opens the select and selects the option with the given text', async function(assert) {
  await visit('/helpers-testing');

  assert.equal(currentURL(), '/helpers-testing');
  await selectChoose('.select-choose', 'three');

  assert.equal(find('.select-choose .ember-power-select-trigger').textContent.trim(), 'three', 'The proper value has been selected');
  assert.notOk(find('.ember-power-select-options'), 'The selectis closed');
  assert.equal(find('.select-choose-target').textContent.trim(), 'You\'ve selected: three');
});

test('selectChoose selects the option with the given text on an already opened select', async function(assert) {
  await visit('/helpers-testing');

  assert.equal(currentURL(), '/helpers-testing');
  await click('.select-choose .ember-power-select-trigger');

  await selectChoose('.select-choose', 'three');
  assert.equal(find('.select-choose .ember-power-select-trigger').textContent.trim(), 'three', 'The proper value has been selected');
  assert.notOk(find('.ember-power-select-options'), 'The selectis closed');
  assert.equal(find('.select-choose-target').textContent.trim(), 'You\'ve selected: three');
});

test('the selectChoose helper works with an onopen function that fetches data async on single selects', async function(assert) {
  await visit('/helpers-testing');
  assert.equal(currentURL(), '/helpers-testing');

  await selectChoose('.select-choose-onopen', 'three');
  assert.equal(find('.select-choose-onopen .ember-power-select-trigger').textContent.trim().split(' ')[0].trim(), 'three', 'The proper value has been selected');
  assert.notOk(find('.ember-power-select-options'), 'The select is closed');
  assert.equal(find('.select-choose-target').textContent.trim(), 'You\'ve selected: three');
});

test('the selectChoose helper works with an onopen function that fetches data async on multiple selects', async function(assert) {
  await visit('/helpers-testing');
  assert.equal(currentURL(), '/helpers-testing');

  await selectChoose('.select-choose-onopen-multiple', 'three');
  assert.equal(findAll('.select-choose-onopen-multiple .ember-power-select-multiple-option').length, 1, 'One options has been selected');
  assert.ok(/three/.test(find('.select-choose-onopen-multiple .ember-power-select-multiple-option').textContent.trim()), 'The proper value has been selected');
  assert.notOk(find('.ember-power-select-options'), 'The selectis closed');
});

test('the selectChoose helper works when it receives the class of the trigger', async function(assert) {
  await visit('/helpers-testing');
  assert.equal(currentURL(), '/helpers-testing');

  await selectChoose('.select-with-class-in-trigger', 'three');
  assert.equal(find('.select-with-class-in-trigger').textContent.trim(), 'three', 'The proper value has been selected');
  assert.notOk(find('.ember-power-select-options'), 'The selectis closed');
  assert.equal(find('.select-choose-target').textContent.trim(), 'You\'ve selected: three');
});

test('the selectChoose helper works when it receives the css selector of the chosen option as second arguments', async function(assert) {
  await visit('/helpers-testing');
  assert.equal(currentURL(), '/helpers-testing');

  await selectChoose('.select-with-class-in-trigger', '.ember-power-select-option:eq(2)');
  assert.equal(find('.select-choose').textContent.trim(), 'three', 'The proper value has been selected');
  assert.notOk(find('.ember-power-select-options'), 'The selectis closed');
  assert.equal(find('.select-choose-target').textContent.trim(), 'You\'ve selected: three');
});

test('the selectChoose helper works when it receives a wildcard css class', async function(assert) {
  await visit('/helpers-testing-single-power-select');
  assert.equal(currentURL(), '/helpers-testing-single-power-select');

  await selectChoose('*', 'three');
  assert.equal(find('.select-choose').textContent.trim(), 'three', 'The proper value has been selected');
  assert.notOk(find('.ember-power-select-options'), 'The selectis closed');
  assert.equal(find('.select-choose-target').textContent.trim(), 'You\'ve selected: three');
});

test('selectChoose helper throws an explicative error when no select is found in the given scope', async function(assert) {
  assert.expect(2);
  await visit('/helpers-testing');

  assert.equal(currentURL(), '/helpers-testing');
  try {
    await selectChoose('.there-is-no-select', 'three');
  } catch(error) {
    assert.equal(error.message, 'You called "selectChoose(\'.there-is-no-select\', \'three\')" but no select was found using selector ".there-is-no-select"');
  }
});

test('selectChoose helper throws an explicative error when no option matches the given value', async function(assert) {
  assert.expect(2);
  await visit('/helpers-testing');

  assert.equal(currentURL(), '/helpers-testing');
  try {
    await selectChoose('.select-choose', 'non-existent-option');
  } catch(error) {
    assert.equal(error.message, 'You called "selectChoose(\'.select-choose\', \'non-existent-option\')" but "non-existent-option" didn\'t match any option');
  }
});

moduleForAcceptance('Acceptance | helpers | selectSearch');

test('selectSearch helper searches in the given single select if it is already opened', async function(assert) {
  await visit('/helpers-testing');
  assert.equal(currentURL(), '/helpers-testing');

  await click('.select-async .ember-power-select-trigger');
  await selectSearch('.select-async', 'three');
  assert.equal(find('.ember-power-select-options').textContent.trim(), 'three');
});

test('selectSearch helper searches an opened select if using a wildcard css selector', async function(assert) {
  await visit('/helpers-testing-single-power-select');
  assert.equal(currentURL(), '/helpers-testing-single-power-select');

  await click('.ember-power-select-trigger');
  await selectSearch('*', 'three');
  assert.equal(find('.ember-power-select-options').textContent.trim(), 'three');
});

test('selectSearch helper opens and searches select if using a wildcard css selector', async function(assert) {
  await visit('/helpers-testing-single-power-select');
  assert.equal(currentURL(), '/helpers-testing-single-power-select');

  await click('.ember-power-select-trigger');
  await selectSearch('*', 'three');
  assert.equal(find('.ember-power-select-options').textContent.trim(), 'three');
});

test('selectSearch helper searches in the given single select, opening it if needed', async function(assert) {
  await visit('/helpers-testing');
  assert.equal(currentURL(), '/helpers-testing');

  await selectSearch('.select-async', 'three');
  assert.equal(find('.ember-power-select-options').textContent.trim(), 'three');
});

test('selectSearch helper searches in the given multiple select opened', async function(assert) {
  await visit('/helpers-testing');
  assert.equal(currentURL(), '/helpers-testing');

  await click('.select-multiple .ember-power-select-trigger');
  await selectSearch('.select-multiple', 'three');
  assert.equal(find('.ember-power-select-options').textContent.trim(), 'three');
});

test('selectSearch helper searches in the given multiple select closed', async function(assert) {
  await visit('/helpers-testing');
  assert.equal(currentURL(), '/helpers-testing');
  await selectSearch('.select-multiple', 'three');
  assert.equal(find('.ember-power-select-options').textContent.trim(), 'three');
});

test('selectSearch helper works even with custom components as long as the input has [type=searcg]', async function(assert) {
  await visit('/helpers-testing');
  assert.equal(currentURL(), '/helpers-testing');
  await click('.select-custom-search .ember-power-select-trigger');
  await selectSearch('.select-custom-search', 'three');
  assert.equal(find('.ember-power-select-options').textContent.trim(), 'three');
});

test('the selectSearch helper works when it receives the class of the trigger', async function(assert) {
  await visit('/helpers-testing');
  assert.equal(currentURL(), '/helpers-testing');
  await selectSearch('.select-with-class-in-trigger', 'three');
  assert.equal(find('.ember-power-select-options').textContent.trim(), 'three');
});

test('the selectSearch helper throws an explicative error when no select is found in the given scope', async function(assert) {
  assert.expect(2);
  await visit('/helpers-testing');
  assert.equal(currentURL(), '/helpers-testing');
  try {
    await selectSearch('.there-is-no-select', 'three');
  } catch(error) {
    assert.equal(error.message, 'You called "selectSearch(\'.there-is-no-select\', \'three\')" but no select was found using selector ".there-is-no-select"');
  }
});

moduleForAcceptance('Acceptance | helpers | removeMultipleOption');

test('removeMultipleOption removes selected option', async function(assert) {
  await visit('/helpers-testing');

  await selectChoose('.select-choose-onopen-multiple', 'three');
  await selectChoose('.select-choose-onopen-multiple', 'four');
  assert.equal(findAll('.select-choose-onopen-multiple .ember-power-select-trigger > .ember-power-select-multiple-options > li').length, 2, 'Multiple options selected');

  await removeMultipleOption('.select-choose-onopen-multiple', 'three');
  assert.equal(findAll('.select-choose-onopen-multiple .ember-power-select-trigger > .ember-power-select-multiple-options > li').length, 1, 'One option removed');

  await removeMultipleOption('.select-choose-onopen-multiple', 'four');
  assert.equal(findAll('.select-choose-onopen-multiple .ember-power-select-trigger > .ember-power-select-multiple-options > li').length, 0, 'Last option removed');
});

test('removeMultipleOption works with async onchange action', async function(assert) {
  await visit('/helpers-testing');

  await selectChoose('#select-multiple-async', 'three');
  await selectChoose('#select-multiple-async', 'four');
  assert.equal(findAll('#select-multiple-async .ember-power-select-multiple-option').length, 2, 'Multiple options selected');

  await removeMultipleOption('#select-multiple-async', 'three');
  assert.equal(findAll('#select-multiple-async .ember-power-select-multiple-option').length, 1, 'One option removed');
});

moduleForAcceptance('Acceptance | helpers | clearSelected');

test('clearSelected removes selected option', async function(assert) {
  await visit('/helpers-testing');
  assert.notOk(find('.select-choose-onopen .ember-power-select-clear-btn'));

  await selectChoose('.select-choose-onopen', 'three');
  assert.ok(find('.select-choose-onopen .ember-power-select-clear-btn'));
  assert.ok(find('.select-choose-onopen .ember-power-select-selected-item').textContent.trim(), 'three', 'The proper value has been selected');

  await clearSelected('.select-choose-onopen', 'three');
  assert.notOk(find('.select-choose-onopen .ember-power-select-clear-btn'));
});

test('clearSelected works with async onchange action', async function(assert) {
  await visit('/helpers-testing');

  assert.notOk(find('.select-deselect-async .ember-power-select-clear-btn'));

  await selectChoose('.select-deselect-async', 'three');
  assert.ok(find('.select-deselect-async .ember-power-select-clear-btn'));
  assert.ok(find('.select-deselect-async .ember-power-select-selected-item').textContent.trim(), 'three', 'The proper value has been selected');

  await clearSelected('.select-deselect-async', 'three');
  assert.notOk(find('.select-deselect-async .ember-power-select-clear-btn'));
});
