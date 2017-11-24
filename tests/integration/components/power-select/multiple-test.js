import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { typeInSearch, clickTrigger } from 'ember-power-select/test-support/helpers';
import { numbers, names, countries, countriesWithDisabled } from '../constants';
import { find, findAll, click, tap, keyEvent } from 'ember-native-dom-helpers';
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

    clickTrigger();
    assert.notOk(find('.ember-power-select-search'), 'There is no search box');
  });

  test('When the select opens, the search input in the trigger gets the focus', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    clickTrigger();
    assert.ok(find('.ember-power-select-trigger-multiple-input') === document.activeElement, 'The search input is focused');
  });

  test('Click on an element selects it and closes the dropdown and focuses the trigger\'s input', async function(assert) {
    assert.expect(5);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    clickTrigger();
    assert.ok(find('.ember-power-select-trigger-multiple-input') === document.activeElement, 'The input of the trigger is focused');
    click(findAll('.ember-power-select-option')[1]);
    assert.notOk(find('.ember-power-select-dropdown'), 'The dropdown is closed');
    assert.equal(findAll('.ember-power-select-multiple-option').length, 1, 'There is 1 option selected');
    assert.ok(/two/.test(find('.ember-power-select-multiple-option').textContent), 'The clicked element has been selected');
    assert.ok(find('.ember-power-select-trigger-multiple-input') === document.activeElement, 'The input of the trigger is focused again');
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

    clickTrigger();
    click(findAll('.ember-power-select-option')[1]);
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

    assert.equal(findAll('.ember-power-select-multiple-option').length, 1, 'There is 1 option selected');
    clickTrigger();
    click(findAll('.ember-power-select-option')[1]);
    let selectedTriggerOptions = findAll('.ember-power-select-multiple-option');
    assert.equal(selectedTriggerOptions.length, 2, 'There is 2 options selected');
    assert.ok(/four/.test(selectedTriggerOptions[0].textContent), 'The first option is the provided one');
    assert.ok(/two/.test(selectedTriggerOptions[1].textContent), 'The second option is the one just selected');
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

    clickTrigger();
    let options = findAll('.ember-power-select-option');
    assert.equal(options[1].attributes['aria-selected'].value, 'true', 'The second option is styled as selected');
    assert.equal(options[3].attributes['aria-selected'].value, 'true', 'The 4th option is styled as selected');
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

    clickTrigger();
    assert.equal(findAll('.ember-power-select-option[aria-current="true"]').length, 1, 'There is one element highlighted');
    assert.equal(findAll('.ember-power-select-option[aria-selected="true"]').length, 1, 'There is one element selected');
    assert.equal(findAll('.ember-power-select-option[aria-current="true"][aria-selected="true"]').length, 0, 'They are not the same');
    assert.equal(find('.ember-power-select-option[aria-current="true"]').textContent.trim(), 'one', 'The highlighted element is the first one');
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

    assert.equal(findAll('.ember-power-select-multiple-option').length, 1, 'There is 1 option selected');
    clickTrigger();
    click('.ember-power-select-option[aria-selected="true"]');
    assert.equal(findAll('.ember-power-select-multiple-option').length, 0, 'There is no options selected');
  });

  test('The default filtering works in multiple mode', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    clickTrigger();
    typeInSearch('four');
    assert.equal(findAll('.ember-power-select-option').length, 2, 'Only two items matched the criteria');
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

    clickTrigger();
    typeInSearch('mar');
    let options = findAll('.ember-power-select-option');
    assert.equal(options.length, 2, 'Only 2 results match the search');
    assert.equal(options[0].textContent.trim(), 'María Murray');
    assert.equal(options[1].textContent.trim(), 'Marta Stinson');
    typeInSearch('mari');
    assert.equal(findAll('.ember-power-select-option').length, 1, 'Only 1 results match the search');
    assert.equal(find('.ember-power-select-option').textContent.trim(), 'María Murray');
    typeInSearch('o');
    options = findAll('.ember-power-select-option');
    assert.equal(options.length, 2, 'Only 2 results match the search');
    assert.equal(options[0].textContent.trim(), 'Søren Williams');
    assert.equal(options[1].textContent.trim(), 'João Jin');
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

    clickTrigger();
    typeInSearch('on');
    assert.equal(find('.ember-power-select-option').textContent.trim(), 'No results found', 'No number ends in "on"');
    typeInSearch('teen');
    assert.equal(findAll('.ember-power-select-option').length, 7, 'There is 7 number that end in "teen"');
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

    clickTrigger();
    typeInSearch('teen');

    setTimeout(function() {
      assert.equal(findAll('.ember-power-select-option').length, 7);
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

    clickTrigger();
    keyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 27);
    assert.notOk(find('.ember-power-select-dropdown'), 'Dropdown is not rendered');
    assert.ok(find('.ember-power-select-trigger-multiple-input') === document.activeElement, 'The trigger is focused');
    keyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 13);
    assert.ok(find('.ember-power-select-dropdown'), 'Dropdown is rendered');
  });

  test('Pressing ENTER on a multiple select with `searchEnabled=false` when it is closed opens it', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple searchEnabled=false options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    let trigger = find('.ember-power-select-trigger');
    trigger.focus();
    assert.notOk(find('.ember-power-select-dropdown'), 'Dropdown is not rendered');
    keyEvent(trigger, 'keydown', 13);
    assert.ok(find('.ember-power-select-dropdown'), 'Dropdown is rendered');
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

    clickTrigger();
    keyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 40);
    keyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 13);
    assert.ok(/two/.test(find('.ember-power-select-trigger').textContent.trim()), 'The element was selected');
  });

  test('Pressing ENTER over a highlighted element on a multiple select with `searchEnabled=false` selects it', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple searchEnabled=false options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    clickTrigger();
    assert.ok(find('.ember-power-select-dropdown'), 'Dropdown is rendered');
    let trigger = find('.ember-power-select-trigger');
    keyEvent(trigger, 'keydown', 40);
    keyEvent(trigger, 'keydown', 13);
    assert.ok(/two/.test(find('.ember-power-select-trigger').textContent.trim()), 'The element was selected');
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

    clickTrigger();
    assert.equal(findAll('.ember-power-select-multiple-option').length, 0, 'There is no elements selected');
    let trigger = find('.ember-power-select-trigger');
    keyEvent(trigger, 'keydown', 40);
    keyEvent(trigger, 'keydown', 13);
    assert.equal(findAll('.ember-power-select-multiple-option').length, 1, 'There is one element selected');
    assert.ok(/two/.test(find('.ember-power-select-trigger').textContent.trim()), 'The element is "two"');
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

    clickTrigger();
    keyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 40);
    keyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 13);
    assert.ok(/two/.test(find('.ember-power-select-trigger').textContent.trim()), 'The element is still selected');
    assert.notOk(find('.ember-power-select-dropdown'), 'Dropdown is not rendered');
    assert.ok(find('.ember-power-select-trigger-multiple-input') === document.activeElement, 'The trigger is focused');
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

    clickTrigger();
    typeInSearch('four');
    keyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 8);
    assert.ok(find('.ember-power-select-dropdown'), 'The dropown is still opened');
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

    let input = find('.ember-power-select-trigger-multiple-input');
    assert.equal(findAll('.ember-power-select-multiple-option').length, 1, 'There is one element selected');
    keyEvent(input, 'keydown', 8);
    assert.equal(findAll('.ember-power-select-multiple-option').length, 0, 'There is no elements selected');
    assert.equal(find('.ember-power-select-trigger-multiple-input').value, 'two', 'The text of the seach input is two now');
    assert.ok(find('.ember-power-select-dropdown'), 'The dropown has been opened');
    assert.equal(findAll('.ember-power-select-option').length, 1, 'The list has been filtered');
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
    clickTrigger();
    assert.equal(findAll('.ember-power-select-multiple-option').length, 2, 'There is two elements selected');
    keyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 8);
    assert.equal(findAll('.ember-power-select-multiple-option').length, 1, 'There is one element selected');
    assert.equal(find('.ember-power-select-trigger-multiple-input').value, 'Latvia', 'The text of the seach input is two "Latvia"');
    assert.ok(find('.ember-power-select-dropdown'), 'The dropown is still opened');
    assert.equal(findAll('.ember-power-select-option').length, 1, 'The list has been filtered');
  });

  test('Pressing BACKSPACE on the search input when it\'s empty removes the last selection ALSO when that option didn\'t come from the outside', async function(assert) {
    assert.expect(5);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    clickTrigger();
    click(findAll('.ember-power-select-option')[2]);
    clickTrigger();
    assert.equal(findAll('.ember-power-select-multiple-option').length, 1, 'There is one element selected');
    keyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 8);
    assert.equal(findAll('.ember-power-select-multiple-option').length, 0, 'There is no elements selected');
    assert.equal(find('.ember-power-select-trigger-multiple-input').value, 'three', 'The text of the seach input is three now');
    assert.ok(find('.ember-power-select-dropdown'), 'The dropown is still opened');
    assert.equal(findAll('.ember-power-select-option').length, 1, 'The list has been filtered');
  });

  test('If the multiple component is focused, pressing KEYDOWN opens it', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    clickTrigger();
    keyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 27);
    assert.notOk(find('.ember-power-select-dropdown'), 'The select is closed');
    keyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 40);
    assert.ok(find('.ember-power-select-dropdown'), 'The select is opened');
  });

  test('If the multiple component is focused, pressing KEYUP opens it', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    clickTrigger();
    keyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 27);
    assert.notOk(find('.ember-power-select-dropdown'), 'The select is closed');
    keyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 38);
    assert.ok(find('.ember-power-select-dropdown'), 'The select is opened');
  });

  test('The placeholder is only visible when no options are selected', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) placeholder="Select stuff here" as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.equal(find('.ember-power-select-trigger-multiple-input').attributes.placeholder.value, 'Select stuff here', 'There is a placeholder');
    clickTrigger();
    click(findAll('.ember-power-select-option')[1]);
    assert.equal(find('.ember-power-select-trigger-multiple-input').attributes.placeholder.value, '', 'The placeholder is gone');
  });

  test('The placeholder is visible when no options are selected and search is disabled', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple searchEnabled=false options=numbers selected=foo onchange=(action (mut foo)) placeholder="Select stuff here" as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.equal(find('.ember-power-select-placeholder').textContent, 'Select stuff here', 'There is a placeholder');
    clickTrigger();
    click(findAll('.ember-power-select-option')[1]);
    assert.notOk(find('.ember-power-select-placeholder'), 'The placeholder is gone');
  });

  test('If the placeholder is null the placeholders shouldn\'t be "null" (issue #94)', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.equal(find('.ember-power-select-trigger-multiple-input').attributes.placeholder.value, '', 'Input does not have a placeholder');
    clickTrigger();
    click(findAll('.ember-power-select-option')[1]);
    assert.equal(find('.ember-power-select-trigger-multiple-input').attributes.placeholder.value, '', 'Input still does not have a placeholder');
    click('.ember-power-select-multiple-remove-btn');
    assert.equal(find('.ember-power-select-trigger-multiple-input').attributes.placeholder.value, '', 'Input still does not have a placeholder');
  });

  test('Selecting and removing should result in desired behavior', async function(assert) {
    assert.expect(3);
    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);
    clickTrigger();
    click(findAll('.ember-power-select-option')[1]);
    assert.equal(findAll('.ember-power-select-multiple-option').length, 1, 'Should add selected option');
    click('.ember-power-select-multiple-remove-btn');
    assert.equal(find('.ember-power-select-trigger-multiple-input').attributes.placeholder.value, '', 'Input still does not have a placeholder');
    assert.equal(findAll('.ember-power-select-multiple-option').length, 0, 'Should remove selected option');
  });

  test('Selecting and removing can also be done with touch events', async function(assert) {
    assert.expect(3);
    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);
    clickTrigger();
    click(findAll('.ember-power-select-option')[1]);
    assert.equal(findAll('.ember-power-select-multiple-option').length, 1, 'Should add selected option');
    tap('.ember-power-select-multiple-remove-btn');
    assert.equal(find('.ember-power-select-trigger-multiple-input').attributes.placeholder.value, '', 'Input still does not have a placeholder');
    assert.equal(findAll('.ember-power-select-multiple-option').length, 0, 'Should remove selected option');
  });

  test('Typing in the input opens the component and filters the options', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    typeInSearch('fo');
    assert.equal(findAll('.ember-power-select-option').length, 2, 'The dropdown is opened and results filtered');
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

    typeInSearch('fo');
    let done = assert.async();

    setTimeout(function() {
      assert.equal(findAll('.ember-power-select-option').length, 2, 'The dropdown is opened and results filtered');
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

    clickTrigger();
    typeInSearch('tw');
    assert.equal(find('.ember-power-select-option').textContent.trim(), 'tw:two');
    click(findAll('.ember-power-select-option')[0]);
    clickTrigger();
    typeInSearch('thr');
    assert.ok(/thr:two/.test(find('.ember-power-select-trigger').textContent.trim()), 'The trigger also receives the public API');
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

    clickTrigger();
    typeInSearch('asjdnah');
    assert.equal(find('.ember-power-select-option').textContent.trim(), 'No results found');
    assert.equal(find('.ember-power-select-trigger-multiple-input').value, 'asjdnah');
    click('#other-thing');
    assert.equal(find('.ember-power-select-trigger-multiple-input').value, '');
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

    clickTrigger();
    typeInSearch('asjdnah');
    assert.equal(find('.ember-power-select-option').textContent.trim(), 'No results found');
    keyEvent('.ember-power-select-trigger-multiple-input', 'keydown', 13);
    assert.notOk(find('.ember-power-select-dropdown'), 'The dropdown is closed');
    assert.ok(find('.ember-power-select-trigger-multiple-input') === document.activeElement, 'The input is focused');
  });

  test('The trigger of multiple selects have a special class to distinguish them from regular ones, even if you pass them another one', async function(assert) {
    assert.expect(2);
    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers triggerClass="foobar-trigger" selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.ok(find('.ember-power-select-trigger').classList.contains('ember-power-select-multiple-trigger'), 'The trigger has the default class');
    assert.ok(find('.ember-power-select-trigger').classList.contains('foobar-trigger'), 'The trigger has the given class');
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
    clickTrigger();
    run(() => this.get('selected').pushObject(numbers[3]));
    click(findAll('.ember-power-select-option')[0]);
    assert.equal(findAll('.ember-power-select-multiple-option').length, 2, 'Two elements are selected');
  });

  test('When the input inside the multiple select gets focused, the trigger and the dropdown gain special `--active` classes', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.ok(!find('.ember-power-select-trigger').classList.contains('ember-power-select-trigger--active'), 'The trigger does not have the class');
    clickTrigger();
    assert.ok(find('.ember-power-select-trigger').classList.contains('ember-power-select-trigger--active'), 'The trigger has the class');
    assert.ok(find('.ember-power-select-dropdown').classList.contains('ember-power-select-dropdown--active'), 'The dropdown has the class');
  });

  test('When the power select multiple uses the default component and the search is enabled, the trigger has `tabindex=-1`', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.equal(find('.ember-power-select-trigger').attributes.tabindex.value, '-1', 'The trigger has tabindex=-1');
  });

  test('When the power select multiple uses the default component and the search is disabled, the trigger has `tabindex=0`', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) searchEnabled=false as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.equal(find('.ember-power-select-trigger').attributes.tabindex.value, '0', 'The trigger has tabindex=0');
  });

  test('When the power select multiple uses the default component and the search is enabled, and the component receives an specific tabindex, the trigger has tabindex=-1, and the tabindex is applied to the searchbox inside', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) tabindex=3 as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.equal(find('.ember-power-select-trigger').attributes.tabindex.value, '-1', 'The trigger has tabindex=1');
    assert.equal(find('.ember-power-select-trigger-multiple-input').attributes.tabindex.value, '3', 'The searchbox has tabindex=3');
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

    clickTrigger();
    assert.equal(find('.ember-power-select-option[aria-current=true]').textContent.trim(), 'four', 'the given defaultHighlighted element is highlighted instead of the first, as usual');
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

    typeInSearch('M');
    click(findAll('.ember-power-select-option')[1]);
    typeInSearch('Mi');
    assert.equal(findAll('.ember-power-select-option')[0].attributes['aria-selected'].value, 'true', 'The item in the list is marked as selected');
    click(findAll('.ember-power-select-option')[0]); // select the same user again should  i[0])t
    assert.equal(findAll('.ember-power-select-multiple-option').length, 0);
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
    assert.equal(findAll('.ember-power-select-multiple-options .ember-power-select-multiple-option--disabled').length, disabledNumCountries, 'The class "ember-power-select-multiple-option--disabled" is added to disabled options');
  });
});
