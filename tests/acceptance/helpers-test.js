import { test, module } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { selectChoose, selectSearch, removeMultipleOption, clearSelected } from 'ember-power-select/test-support/helpers';

module('Acceptance | helpers | selectChoose', function(hooks) {
  setupApplicationTest(hooks);

  test('selectChoose helper opens the select and selects the option with the given text', async function(assert) {
    await visit('/helpers-testing');

    assert.equal(currentURL(), '/helpers-testing');
    await selectChoose('.select-choose', 'three');

    assert.dom('.select-choose .ember-power-select-trigger').hasText('three', 'The proper value has been selected');
    assert.dom('.ember-power-select-options').doesNotExist('The selectis closed');
    assert.dom('.select-choose-target').hasText('You\'ve selected: three');
  });

  test('selectChoose selects the option with the given text on an already opened select', async function(assert) {
    await visit('/helpers-testing');

    assert.equal(currentURL(), '/helpers-testing');
    await click('.select-choose .ember-power-select-trigger');

    await selectChoose('.select-choose', 'three');
    assert.dom('.select-choose .ember-power-select-trigger').hasText('three', 'The proper value has been selected');
    assert.dom('.ember-power-select-options').doesNotExist('The selectis closed');
    assert.dom('.select-choose-target').hasText('You\'ve selected: three');
  });

  test('the selectChoose helper works with an onopen function that fetches data async on single selects', async function(assert) {
    await visit('/helpers-testing');
    assert.equal(currentURL(), '/helpers-testing');

    await selectChoose('.select-choose-onopen', 'three');
    assert.dom('.select-choose-onopen .ember-power-select-trigger').containsText('three', 'The proper value has been selected');
    assert.dom('.ember-power-select-options').doesNotExist('The select is closed');
    assert.dom('.select-choose-target').hasText('You\'ve selected: three');
  });

  test('the selectChoose helper works with an onopen function that fetches data async on multiple selects', async function(assert) {
    await visit('/helpers-testing');
    assert.equal(currentURL(), '/helpers-testing');

    await selectChoose('.select-choose-onopen-multiple', 'three');
    assert.dom('.select-choose-onopen-multiple .ember-power-select-multiple-option').exists({ count: 1 }, 'One options has been selected');
    assert.dom('.select-choose-onopen-multiple .ember-power-select-multiple-option').containsText('three', 'The proper value has been selected');
    assert.dom('.ember-power-select-options').doesNotExist('The selectis closed');
  });

  test('the selectChoose helper works when it receives the class of the trigger', async function(assert) {
    await visit('/helpers-testing');
    assert.equal(currentURL(), '/helpers-testing');

    await selectChoose('.select-with-class-in-trigger', 'three');
    assert.dom('.select-with-class-in-trigger').hasText('three', 'The proper value has been selected');
    assert.dom('.ember-power-select-options').doesNotExist('The selectis closed');
    assert.dom('.select-choose-target').hasText('You\'ve selected: three');
  });

  test('the selectChoose helper works when it receives the css selector of the chosen option as second arguments', async function(assert) {
    await visit('/helpers-testing');
    assert.equal(currentURL(), '/helpers-testing');

    await selectChoose('.select-with-class-in-trigger', '.ember-power-select-option:nth-child(3)');
    assert.dom('.select-choose').hasText('three', 'The proper value has been selected');
    assert.dom('.ember-power-select-options').doesNotExist('The selectis closed');
    assert.dom('.select-choose-target').hasText('You\'ve selected: three');
  });

  test('the selectChoose helper works when it receives a wildcard css class', async function(assert) {
    await visit('/helpers-testing-single-power-select');
    assert.equal(currentURL(), '/helpers-testing-single-power-select');

    await selectChoose('*', 'three');
    assert.dom('.select-choose').hasText('three', 'The proper value has been selected');
    assert.dom('.ember-power-select-options').doesNotExist('The selectis closed');
    assert.dom('.select-choose-target').hasText('You\'ve selected: three');
  });

  test('the selectChoose helper works when it receives a HTMLElement as first argument', async function(assert) {
    await visit('/helpers-testing');
    assert.equal(currentURL(), '/helpers-testing');

    await selectChoose(this.element.querySelector('.select-with-class-in-trigger'), 'three');
    assert.dom('.select-choose').hasText('three', 'The proper value has been selected');
    assert.dom('.ember-power-select-options').doesNotExist('The selectis closed');
    assert.dom('.select-choose-target').hasText('You\'ve selected: three');
  });

  test('the selectChoose helper can receive a number as third argument to select the :nth option', async function(assert) {
    await visit('/helpers-testing');
    assert.equal(currentURL(), '/helpers-testing');

    await selectChoose(this.element.querySelector('.select-with-class-in-trigger'), '.ember-power-select-option', 2);
    assert.dom('.select-choose').hasText('three', 'The proper value has been selected');
    assert.dom('.ember-power-select-options').doesNotExist('The selectis closed');
    assert.dom('.select-choose-target').hasText('You\'ve selected: three');
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
});

module('Acceptance | helpers | selectSearch', function(hooks) {
  setupApplicationTest(hooks);

  test('selectSearch helper searches in the given single select if it is already opened', async function(assert) {
    await visit('/helpers-testing');
    assert.equal(currentURL(), '/helpers-testing');

    await click('.select-async .ember-power-select-trigger');
    await selectSearch('.select-async', 'three');
    assert.dom('.ember-power-select-options').hasText('three');
  });

  test('selectSearch helper searches an opened select if using a wildcard css selector', async function(assert) {
    await visit('/helpers-testing-single-power-select');
    assert.equal(currentURL(), '/helpers-testing-single-power-select');

    await click('.ember-power-select-trigger');
    await selectSearch('*', 'three');
    assert.dom('.ember-power-select-options').hasText('three');
  });

  test('selectSearch helper opens and searches select if using a wildcard css selector', async function(assert) {
    await visit('/helpers-testing-single-power-select');
    assert.equal(currentURL(), '/helpers-testing-single-power-select');

    await click('.ember-power-select-trigger');
    await selectSearch('*', 'three');
    assert.dom('.ember-power-select-options').hasText('three');
  });

  test('selectSearch helper searches in the given single select, opening it if needed', async function(assert) {
    await visit('/helpers-testing');
    assert.equal(currentURL(), '/helpers-testing');

    await selectSearch('.select-async', 'three');
    assert.dom('.ember-power-select-options').hasText('three');
  });

  test('selectSearch helper searches in the given multiple select opened', async function(assert) {
    await visit('/helpers-testing');
    assert.equal(currentURL(), '/helpers-testing');

    await click('.select-multiple .ember-power-select-trigger');
    await selectSearch('.select-multiple', 'three');
    assert.dom('.ember-power-select-options').hasText('three');
  });

  test('selectSearch helper searches in the given multiple select closed', async function(assert) {
    await visit('/helpers-testing');
    assert.equal(currentURL(), '/helpers-testing');
    await selectSearch('.select-multiple', 'three');
    assert.dom('.ember-power-select-options').hasText('three');
  });

  test('selectSearch helper works even with custom components as long as the input has [type=search]', async function(assert) {
    await visit('/helpers-testing');
    assert.equal(currentURL(), '/helpers-testing');
    await click('.select-custom-search .ember-power-select-trigger');
    await selectSearch('.select-custom-search', 'three');
    assert.dom('.ember-power-select-options').hasText('three');
  });

  test('selectSearch helper can receive the HTMLElement of the trigger as first arguments', async function(assert) {
    await visit('/helpers-testing');
    assert.equal(currentURL(), '/helpers-testing');

    await selectSearch(this.element.querySelector('.select-multiple .ember-power-select-trigger'), 'three');
    assert.dom('.ember-power-select-options').hasText('three');
  });

  test('the selectSearch helper works when it receives the class of the trigger', async function(assert) {
    await visit('/helpers-testing');
    assert.equal(currentURL(), '/helpers-testing');
    await selectSearch('.select-with-class-in-trigger', 'three');
    assert.dom('.ember-power-select-options').hasText('three');
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
});

module('Acceptance | helpers | removeMultipleOption', function(hooks) {
  setupApplicationTest(hooks);

  test('removeMultipleOption removes selected option', async function(assert) {
    await visit('/helpers-testing');

    await selectChoose('.select-choose-onopen-multiple', 'three');
    await selectChoose('.select-choose-onopen-multiple', 'four');
    assert.dom('.select-choose-onopen-multiple .ember-power-select-trigger > .ember-power-select-multiple-options > li').exists({ count: 2 }, 'Multiple options selected');

    await removeMultipleOption('.select-choose-onopen-multiple', 'three');
    assert.dom('.select-choose-onopen-multiple .ember-power-select-trigger > .ember-power-select-multiple-options > li').exists({ count: 1 }, 'One option removed');

    await removeMultipleOption('.select-choose-onopen-multiple', 'four');
    assert.dom('.select-choose-onopen-multiple .ember-power-select-trigger > .ember-power-select-multiple-options > li').exists({ count: 0 }, 'Last option removed');
  });

  test('removeMultipleOption works with async onchange action', async function(assert) {
    await visit('/helpers-testing');

    await selectChoose('#select-multiple-async', 'three');
    await selectChoose('#select-multiple-async', 'four');
    assert.dom('#select-multiple-async .ember-power-select-multiple-option').exists({ count:  2 }, 'Multiple options selected');

    await removeMultipleOption('#select-multiple-async', 'three');
    assert.dom('#select-multiple-async .ember-power-select-multiple-option').exists({ count:  1 }, 'One option removed');
  });
});

module('Acceptance | helpers | clearSelected', function(hooks) {
  setupApplicationTest(hooks);

  test('clearSelected removes selected option', async function(assert) {
    await visit('/helpers-testing');
    assert.dom('.select-choose-onopen .ember-power-select-clear-btn').doesNotExist();

    await selectChoose('.select-choose-onopen', 'three');
    assert.dom('.select-choose-onopen .ember-power-select-clear-btn').exists();
    assert.dom('.select-choose-onopen .ember-power-select-selected-item').hasText('three', 'The proper value has been selected');

    await clearSelected('.select-choose-onopen', 'three');
    assert.dom('.select-choose-onopen .ember-power-select-clear-btn').doesNotExist();
  });

  test('clearSelected works with async onchange action', async function(assert) {
    await visit('/helpers-testing');

    assert.dom('.select-deselect-async .ember-power-select-clear-btn').doesNotExist();

    await selectChoose('.select-deselect-async', 'three');
    assert.dom('.select-deselect-async .ember-power-select-clear-btn').exists();
    assert.dom('.select-deselect-async .ember-power-select-selected-item').hasText('three', 'The proper value has been selected');

    await clearSelected('.select-deselect-async', 'three');
    assert.dom('.select-deselect-async .ember-power-select-clear-btn').doesNotExist();
  });
});
