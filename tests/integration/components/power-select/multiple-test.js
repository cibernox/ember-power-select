import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { typeInSearch, clickTrigger } from 'ember-power-select/test-support/helpers';
import { numbers, names, countries, countriesWithDisabled } from '../constants';
import { click, tap, triggerKeyEvent, focus } from '@ember/test-helpers';
import RSVP from 'rsvp';
import EmberObject, { get } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { run, later } from '@ember/runloop';
import { A } from '@ember/array';

module('Integration | Component | Ember Power Select (Multiple)', function(hooks) {
  setupRenderingTest(hooks);

  test('Multiple selects don\'t have a search box', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-search').doesNotExist('There is no search box');
  });

  test('When the select opens, the search input in the trigger gets the focus', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-trigger-multiple-input').isFocused();
  });

  test('Click on an element selects it and closes the dropdown and focuses the trigger\'s input', async function(assert) {
    assert.expect(5);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-trigger-multiple-input').isFocused();
    await click('.ember-power-select-option:nth-child(2)');
    assert.dom('.ember-power-select-dropdown').doesNotExist('The dropdown is closed');
    assert.dom('.ember-power-select-multiple-option').exists({ count: 1 }, 'There is 1 option selected');
    assert.dom('.ember-power-select-multiple-option').includesText('two', 'The clicked element has been selected');
    assert.dom('.ember-power-select-trigger-multiple-input').isFocused();
  });

  test('Selecting an element triggers the onchange action with the list of selected options', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    this.change = (values) => {
      assert.deepEqual(values, ['two'], 'The onchange action is fired with the list of values');
    };

    await render(hbs`
      {{#power-select-multiple options=numbers onchange=change as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    await click('.ember-power-select-option:nth-child(2)');
  });

  test('Click an option when there is already another selects both, and triggers the onchange action with them', async function(assert) {
    assert.expect(5);

    this.numbers = numbers;
    this.selectedNumbers = ['four'];
    this.change = (values) => {
      assert.deepEqual(values, ['four', 'two'], 'The onchange action is fired with the list of values');
      this.set('selectedNumbers', values);
    };

    await render(hbs`
      {{#power-select-multiple options=numbers selected=selectedNumbers onchange=change as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-multiple-option').exists({ count: 1 }, 'There is 1 option selected');
    await clickTrigger();
    await click('.ember-power-select-option:nth-child(2)');
    assert.dom('.ember-power-select-multiple-option').exists({ count: 2 }, 'There is 2 options selected');
    assert.dom('.ember-power-select-multiple-option:nth-child(1)').includesText('four', 'The first option is the provided one');
    assert.dom('.ember-power-select-multiple-option:nth-child(2)').includesText('two', 'The second option is the one just selected');
  });

  test('If there is many selections, all those options are styled as `selected`', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    this.selectedNumbers = ['four', 'two'];

    await render(hbs`
      {{#power-select-multiple options=numbers selected=selectedNumbers onchange=(action (mut selectedNumbers)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-option:nth-child(2)').hasAttribute('aria-selected', 'true', 'The second option is styled as selected');
    assert.dom('.ember-power-select-option:nth-child(4)').hasAttribute('aria-selected', 'true', 'The 4th option is styled as selected');
  });

  test('When the popup opens, the first items is highlighed, even if there is only one selection', async function(assert) {
    assert.expect(4);

    this.numbers = numbers;
    this.selectedNumbers = ['four'];

    await render(hbs`
      {{#power-select-multiple options=numbers selected=selectedNumbers onchange=(action (mut selectedNumbers)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-option[aria-current="true"]').exists({ count: 1 }, 'There is one element highlighted');
    assert.dom('.ember-power-select-option[aria-selected="true"]').exists({ count: 1 }, 'There is one element selected');
    assert.dom('.ember-power-select-option[aria-current="true"][aria-selected="true"]').doesNotExist('They are not the same');
    assert.dom('.ember-power-select-option[aria-current="true"]').hasText('one', 'The highlighted element is the first one');
  });

  test('Clicking on an option that is already selected unselects it, closes the select and triggers the `onchange` action', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    this.selectedNumbers = ['four'];
    this.change = (selected) => {
      assert.ok(isEmpty(selected), 'No elements are selected');
      this.set('selectedNumbers', selected);
    };

    await render(hbs`
      {{#power-select-multiple options=numbers selected=selectedNumbers onchange=change as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-multiple-option').exists({ count: 1 }, 'There is 1 option selected');
    await clickTrigger();
    await click('.ember-power-select-option[aria-selected="true"]');
    assert.dom('.ember-power-select-multiple-option').exists({ count: 0 }, 'There is no options selected');
  });

  test('The default filtering works in multiple mode', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    await typeInSearch('four');
    assert.dom('.ember-power-select-option').exists({ count: 2 }, 'Only two items matched the criteria');
  });

  test('The filtering specifying a searchkey works in multiple model', async function(assert) {
    assert.expect(8);

    this.people = [
      { name: 'María',  surname: 'Murray' },
      { name: 'Søren',  surname: 'Williams' },
      { name: 'João',   surname: 'Jin' },
      { name: 'Miguel', surname: 'Camba' },
      { name: 'Marta',  surname: 'Stinson' },
      { name: 'Lisa',   surname: 'Simpson' }
    ];

    await render(hbs`
      {{#power-select-multiple options=people searchField="name" onchange=(action (mut foo)) as |person|}}
        {{person.name}} {{person.surname}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    await typeInSearch('mar');
    assert.dom('.ember-power-select-option').exists({ count: 2 }, 'Only 2 results match the search');
    assert.dom('.ember-power-select-option:nth-child(1)').hasText('María Murray');
    assert.dom('.ember-power-select-option:nth-child(2)').hasText('Marta Stinson');
    await typeInSearch('mari');
    assert.dom('.ember-power-select-option').exists({ count: 1 }, 'Only 1 results match the search');
    assert.dom('.ember-power-select-option').hasText('María Murray');
    await typeInSearch('o');
    assert.dom('.ember-power-select-option').exists({ count: 2 }, 'Only 2 results match the search');
    assert.dom('.ember-power-select-option:nth-child(1)').hasText('Søren Williams');
    assert.dom('.ember-power-select-option:nth-child(2)').hasText('João Jin');
  });

  test('The filtering specifying a custom matcher works in multiple model', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    this.endsWithMatcher = function(value, text) {
      return value.slice(text.length * -1) === text ? 0 : -1;
    };

    await render(hbs`
      {{#power-select-multiple options=numbers matcher=endsWithMatcher onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    await typeInSearch('on');
    assert.dom('.ember-power-select-option').hasText('No results found', 'No number ends in "on"');
    await typeInSearch('teen');
    assert.dom('.ember-power-select-option').exists({ count: 7 }, 'There is 7 number that end in "teen"');
  });

  test('The search using a custom action works int multiple mode', async function(assert) {
    let done = assert.async();
    assert.expect(1);

    this.searchFn = function(term) {
      return new RSVP.Promise(function(resolve) {
        later(function() {
          resolve(numbers.filter((str) => str.indexOf(term) > -1));
        }, 100);
      });
    };

    await render(hbs`
      {{#power-select-multiple search=searchFn onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    await typeInSearch('teen');

    setTimeout(function() {
      assert.dom('.ember-power-select-option').exists({ count: 7 });
      done();
    }, 150);
  });

  test('Pressing ENTER when the select is closed opens and nothing is written on the box opens it', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    await triggerKeyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 27);
    assert.dom('.ember-power-select-dropdown').doesNotExist('Dropdown is not rendered');
    assert.dom('.ember-power-select-trigger-multiple-input').isFocused();
    await triggerKeyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 13);
    assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
  });

  test('Pressing ENTER on a multiple select with `searchEnabled=false` when it is closed opens it', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple searchEnabled=false options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await focus('.ember-power-select-trigger');
    assert.dom('.ember-power-select-dropdown').doesNotExist('Dropdown is not rendered');
    await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 13);
    assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
  });

  test('Pressing ENTER over a highlighted element selects it', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    this.change = (selected) => {
      assert.deepEqual(selected, ['two']);
      this.set('foo', selected);
    };
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=change as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    await triggerKeyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 40);
    await triggerKeyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 13);
    assert.dom('.ember-power-select-trigger').includesText('two', 'The element was selected');
  });

  test('Pressing ENTER over a highlighted element on a multiple select with `searchEnabled=false` selects it', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple searchEnabled=false options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
    await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
    await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 13);
    assert.dom('.ember-power-select-trigger').includesText('two', 'The element was selected');
  });

  test('Pressing ENTER over a highlighted element on a select with `searchEnabled=false` selects it', async function(assert) {
    assert.expect(4);

    this.numbers = numbers;
    this.change = (selected) => {
      assert.deepEqual(selected, ['two']);
      this.set('foo', selected);
    };
    await render(hbs`
      {{#power-select-multiple searchEnabled=false options=numbers selected=foo onchange=change as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-multiple-option').exists({ count: 0 }, 'There is no elements selected');
    await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
    await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 13);
    assert.dom('.ember-power-select-multiple-option').exists({ count: 1 }, 'There is one element selected');
    assert.dom('.ember-power-select-trigger').includesText('two', 'The element was selected');
  });

  test('Pressing ENTER over a highlighted element what is already selected closes the select without doing anything and focuses the trigger', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    this.selected = ['two'];
    this.didChange = (val) => {
      assert.ok(false, 'This should never be invoked');
      this.set('selected', val);
    };
    await render(hbs`
      {{#power-select-multiple options=numbers selected=selected onchange=didChange as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    await triggerKeyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 40);
    await triggerKeyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 13);
    assert.dom('.ember-power-select-trigger').includesText('two', 'The element is still selected');
    assert.dom('.ember-power-select-dropdown').doesNotExist('Dropdown is not rendered');
    assert.dom('.ember-power-select-trigger-multiple-input').isFocused();
  });

  test('Pressing BACKSPACE on the search input when there is text on it does nothing special', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    this.selected = ['two'];
    this.didChange = (val) => {
      assert.ok(false, 'This should not be called');
      this.set('selected', val);
    };
    await render(hbs`
      {{#power-select-multiple options=numbers selected=selected onchange=didChange as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    await typeInSearch('four');
    await triggerKeyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 8);
    assert.dom('.ember-power-select-dropdown').exists('The dropown is still opened');
  });

  test('Pressing BACKSPACE on the search input when it\'s empty removes the last selection and performs a search for that text immediatly, opening the select if closed', async function(assert) {
    assert.expect(9);

    this.numbers = numbers;
    this.selected = ['two'];
    this.didChange = (val, dropdown) => {
      assert.deepEqual(val, [], 'The selected item was unselected');
      this.set('selected', val);
      assert.ok(dropdown.actions.close, 'The dropdown API is received as second argument');
    };
    await render(hbs`
      {{#power-select-multiple options=numbers onchange=didChange selected=selected as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-multiple-option').exists({ count: 1 }, 'There is one element selected');
    await triggerKeyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 8);
    assert.dom('.ember-power-select-multiple-option').exists({ count: 0 }, 'There is no elements selected');
    assert.dom('.ember-power-select-trigger-multiple-input').hasValue('two', 'The text of the seach input is two now');
    assert.dom('.ember-power-select-dropdown').exists('The dropown has been opened');
    assert.dom('.ember-power-select-option').exists({ count: 1 }, 'The list has been filtered');
    let input = this.element.querySelector('.ember-power-select-trigger-multiple-input');
    assert.equal(input.selectionStart, 3);
    assert.equal(input.selectionEnd, 3);
  });

  test('Pressing BACKSPACE on the search input when it\'s empty removes the last selection and performs a search for that text immediatly (when options are not strings)', async function(assert) {
    assert.expect(7);

    this.contries = countries;
    this.country = [countries[2], countries[4]];
    this.didChange = (val, dropdown) => {
      assert.deepEqual(val, [countries[2]], 'The selected item was unselected');
      this.set('country', val);
      assert.ok(dropdown.actions.close, 'The dropdown API is received as second argument');
    };
    await render(hbs`
      {{#power-select-multiple options=contries selected=country onchange=didChange searchField="name" as |c|}}
        {{c.name}}
      {{/power-select-multiple}}
    `);
    await clickTrigger();
    assert.dom('.ember-power-select-multiple-option').exists({ count: 2 }, 'There is two elements selected');
    await triggerKeyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 8);
    assert.dom('.ember-power-select-multiple-option').exists({ count: 1 }, 'There is one element selected');
    assert.dom('.ember-power-select-trigger-multiple-input').hasValue('Latvia', 'The text of the seach input is two "Latvia"');
    assert.dom('.ember-power-select-dropdown').exists('The dropown is still opened');
    assert.dom('.ember-power-select-option').exists({ count: 1 }, 'The list has been filtered');
  });

  test('Pressing BACKSPACE on the search input when it\'s empty removes the last selection ALSO when that option didn\'t come from the outside', async function(assert) {
    assert.expect(5);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    await click('.ember-power-select-option:nth-child(3)');
    await clickTrigger();
    assert.dom('.ember-power-select-multiple-option').exists({ count: 1 }, 'There is one element selected');
    await triggerKeyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 8);
    assert.dom('.ember-power-select-multiple-option').exists({ count: 0 }, 'There is no elements selected');
    assert.dom('.ember-power-select-trigger-multiple-input').hasValue('three', 'The text of the seach input is three now');
    assert.dom('.ember-power-select-dropdown').exists('The dropown is still opened');
    assert.dom('.ember-power-select-option').exists({ count: 1 }, 'The list has been filtered');
  });

  test('If the multiple component is focused, pressing KEYDOWN opens it', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    await triggerKeyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 27);
    assert.dom('.ember-power-select-dropdown').doesNotExist('The select is closed');
    await triggerKeyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 40);
    assert.dom('.ember-power-select-dropdown').exists('The select is opened');
  });

  test('If the multiple component is focused, pressing KEYUP opens it', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    await triggerKeyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 27);
    assert.dom('.ember-power-select-dropdown').doesNotExist('The select is closed');
    await triggerKeyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 38);
    assert.dom('.ember-power-select-dropdown').exists('The select is opened');
  });

  test('The placeholder is only visible when no options are selected', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) placeholder="Select stuff here" as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-trigger-multiple-input').hasAttribute('placeholder', 'Select stuff here', 'There is a placeholder');
    await clickTrigger();
    await click('.ember-power-select-option:nth-child(2)');
    assert.dom('.ember-power-select-trigger-multiple-input').hasAttribute('placeholder', '', 'The placeholder is gone');
  });

  test('The placeholder is visible when no options are selected and search is disabled', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple searchEnabled=false options=numbers selected=foo onchange=(action (mut foo)) placeholder="Select stuff here" as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-placeholder').hasText('Select stuff here', 'There is a placeholder');
    await clickTrigger();
    await click('.ember-power-select-option:nth-child(2)');
    assert.dom('.ember-power-select-placeholder').doesNotExist('The placeholder is gone');
  });

  test('If the placeholder is null the placeholders shouldn\'t be "null" (issue #94)', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-trigger-multiple-input').hasAttribute('placeholder', '', 'Input does not have a placeholder');
    await clickTrigger();
    await click('.ember-power-select-option:nth-child(2)');
    assert.dom('.ember-power-select-trigger-multiple-input').hasAttribute('placeholder', '', 'Input still does not have a placeholder');
    await click('.ember-power-select-multiple-remove-btn');
    assert.dom('.ember-power-select-trigger-multiple-input').hasAttribute('placeholder', '', 'Input still does not have a placeholder');
  });

  test('Selecting and removing should result in desired behavior', async function(assert) {
    assert.expect(3);
    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);
    await clickTrigger();
    await click('.ember-power-select-option:nth-child(2)');
    assert.dom('.ember-power-select-multiple-option').exists({ count: 1 }, 'Should add selected option');
    await click('.ember-power-select-multiple-remove-btn');
    assert.dom('.ember-power-select-trigger-multiple-input').hasAttribute('placeholder', '', 'Input still does not have a placeholder');
    assert.dom('.ember-power-select-multiple-option').exists({ count: 0 }, 'Should remove selected option');
  });

  test('Selecting and removing can also be done with touch events', async function(assert) {
    assert.expect(3);
    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);
    await clickTrigger();
    await click('.ember-power-select-option:nth-child(2)');
    assert.dom('.ember-power-select-multiple-option').exists({ count: 1 }, 'Should add selected option');
    await tap('.ember-power-select-multiple-remove-btn');
    assert.dom('.ember-power-select-trigger-multiple-input').hasAttribute('placeholder', '', 'Input still does not have a placeholder');
    assert.dom('.ember-power-select-multiple-option').exists({ count: 0 }, 'Should remove selected option');
  });

  test('Typing in the input opens the component and filters the options', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await typeInSearch('fo');
    assert.dom('.ember-power-select-option').exists({ count: 2 }, 'The dropdown is opened and results filtered');
  });

  test('Typing in the input opens the component and filters the options also with async searches', async function(assert) {
    assert.expect(1);

    this.search = (term) => {
      return new RSVP.Promise(function(resolve) {
        later(function() {
          resolve(numbers.filter((str) => str.indexOf(term) > -1));
        }, 100);
      });
    };

    await render(hbs`
      {{#power-select-multiple selected=foo onchange=(action (mut foo)) search=(action search) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await typeInSearch('fo');
    let done = assert.async();

    setTimeout(function() {
      assert.dom('.ember-power-select-option').exists({ count: 2 }, 'The dropdown is opened and results filtered');
      done();
    }, 150);
  });

  test('The publicAPI is yielded as second argument in multiple selects', async function(assert) {
    assert.expect(2);
    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option select|}}
        {{select.lastSearchedText}}:{{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    await typeInSearch('tw');
    assert.dom('.ember-power-select-option').hasText('tw:two');
    await click('.ember-power-select-option');
    await clickTrigger();
    await typeInSearch('thr');
    assert.dom('.ember-power-select-trigger').includesText('thr:two', 'The trigger also receives the public API');
  });

  test('The search input is cleared when the component is closed', async function(assert) {
    assert.expect(3);
    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
      <div id="other-thing">Other div</div>
    `);

    await clickTrigger();
    await typeInSearch('asjdnah');
    assert.dom('.ember-power-select-option').hasText('No results found');
    assert.dom('.ember-power-select-trigger-multiple-input').hasValue('asjdnah');
    await click('#other-thing');
    assert.dom('.ember-power-select-trigger-multiple-input').hasValue('');
  });

  test('When hitting ENTER after a search with no results, the component is closed but the onchange function is not invoked', async function(assert) {
    assert.expect(3);
    this.numbers = numbers;
    this.handleChange = () => {
      assert.ok(false, 'The handle change should not be called');
    };
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action handleChange) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    await typeInSearch('asjdnah');
    assert.dom('.ember-power-select-option').hasText('No results found');
    await triggerKeyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 13);
    assert.dom('.ember-power-select-dropdown').doesNotExist('The dropdown is closed');
    assert.dom('.ember-power-select-trigger-multiple-input').isFocused();
  });

  test('The trigger of multiple selects have a special class to distinguish them from regular ones, even if you pass them another one', async function(assert) {
    assert.expect(2);
    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers triggerClass="foobar-trigger" selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-trigger').hasClass('ember-power-select-multiple-trigger', 'The trigger has the default class');
    assert.dom('.ember-power-select-trigger').hasClass('foobar-trigger', 'The trigger has the given class');
  });

  test('The component works when the array of selected elements is mutated in place instead of replaced', async function(assert) {
    assert.expect(1);
    this.numbers = numbers;
    this.selected = A();
    await render(hbs`
      {{#power-select-multiple options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);
    await clickTrigger();
    run(() => this.get('selected').pushObject(numbers[3]));
    await click('.ember-power-select-option');
    assert.dom('.ember-power-select-multiple-option').exists({ count: 2 }, 'Two elements are selected');
  });

  test('When the input inside the multiple select gets focused, the trigger and the dropdown gain special `--active` classes', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-trigger').doesNotHaveClass('ember-power-select-trigger--active', 'The trigger does not have the class');
    await clickTrigger();
    assert.dom('.ember-power-select-trigger').hasClass('ember-power-select-trigger--active', 'The trigger has the class');
    assert.dom('.ember-power-select-dropdown').hasClass('ember-power-select-dropdown--active', 'The dropdown has the class');
  });

  test('When the power select multiple uses the default component and the search is enabled, the trigger has `tabindex=-1`', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-trigger').hasAttribute('tabindex', '-1', 'The trigger has tabindex=-1');
  });

  test('When the power select multiple uses the default component and the search is disabled, the trigger has `tabindex=0`', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) searchEnabled=false as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-trigger').hasAttribute('tabindex', '0', 'The trigger has tabindex=0');
  });

  test('When the power select multiple uses the default component and the search is enabled, and the component receives an specific tabindex, the trigger has tabindex=-1, and the tabindex is applied to the searchbox inside', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) tabindex=3 as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-trigger').hasAttribute('tabindex', '-1', 'The trigger has tabindex=1');
    assert.dom('.ember-power-select-trigger-multiple-input').hasAttribute('tabindex', '3', 'The searchbox has tabindex=3');
  });

  test('Multiple selects honor the `defaultHighlighted` option', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    this.defaultHighlighted = numbers[3];
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) defaultHighlighted=defaultHighlighted as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-option[aria-current=true]').hasText('four', 'the given defaultHighlighted element is highlighted instead of the first, as usual');
  });

  test('If the options of a multiple select implement `isEqual`, that option is used to determine whether or not two items are the same', async function(assert) {
    let User = EmberObject.extend({
      isEqual(other) {
        return get(this, 'name') === get(other, 'name');
      }
    });

    this.search = (term) => {
      return names.filter((n) => n.indexOf(term) > -1).map((name) => User.create({ name }));
    };

    await render(hbs`
      {{#power-select-multiple
        selected=selected
        onchange=(action (mut selected))
        search=search as |user|}}
        {{user.name}}
      {{/power-select-multiple}}
    `);

    await typeInSearch('M');
    await click('.ember-power-select-option:nth-child(2)');
    await typeInSearch('Mi');
    assert.dom('.ember-power-select-option').hasAttribute('aria-selected', 'true', 'The item in the list is marked as selected');
    await click('.ember-power-select-option'); // select the same user again should remove it
    assert.dom('.ember-power-select-multiple-option').exists({ count: 0 });
  });

  test('When there is an option which is disabled the css class "ember-power-select-multiple-option--disabled" should be added', async function(assert) {
    assert.expect(2);

    this.countriesWithDisabled = countriesWithDisabled;
    let countriesWithDisabledLength = this.countriesWithDisabled.length;
    let disabledNumCountries = 0;
    for (let i = 0; i < countriesWithDisabledLength; i++) {
      if (this.countriesWithDisabled[i].disabled) {
        disabledNumCountries++;
      }
    }

    assert.notEqual(disabledNumCountries, 0, 'There is at least one disabled option');
    this.foo = countriesWithDisabled;
    await render(hbs`
      {{#power-select-multiple options=countriesWithDisabled selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);
    assert.dom('.ember-power-select-multiple-options .ember-power-select-multiple-option--disabled').exists({ count: disabledNumCountries }, 'The class "ember-power-select-multiple-option--disabled" is added to disabled options');
  });

  test('The title is rendered in the trigger of multiple selects', async function (assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers onchange=(action (mut foo)) title="The title" as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-trigger').hasAttribute('title', 'The title');
  });
});
