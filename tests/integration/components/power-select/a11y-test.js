import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { numbers, groupedNumbers, countriesWithDisabled } from '../constants';
import { clickTrigger, findContains } from 'ember-power-select/test-support/helpers';
import { find, findAll, keyEvent } from 'ember-native-dom-helpers';

module('Integration | Component | Ember Power Select (Accesibility)', function(hooks) {
  setupRenderingTest(hooks);

  test('Single-select: The top-level options list have `role=listbox` and nested lists have `role=group`', async function(assert) {
    assert.expect(6);

    this.groupedNumbers = groupedNumbers;
    await render(hbs`
      {{#power-select options=groupedNumbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    clickTrigger();
    let rootLevelOptionsList = find('.ember-power-select-dropdown > .ember-power-select-options');
    assert.equal(rootLevelOptionsList.attributes.role.value, 'listbox', 'The top-level list has `role=listbox`');
    let nestedOptionList = findAll('.ember-power-select-options .ember-power-select-options');
    [].slice.call(nestedOptionList).forEach((e) => assert.equal(e.attributes.role.value, 'group'));
  });

  test('Multiple-select: The top-level options list have `role=listbox` and nested lists have `role=group`', async function(assert) {
    assert.expect(6);

    this.groupedNumbers = groupedNumbers;
    await render(hbs`
      {{#power-select-multiple options=groupedNumbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    clickTrigger();
    let rootLevelOptionsList = find('.ember-power-select-dropdown > .ember-power-select-options');
    assert.equal(rootLevelOptionsList.attributes.role.value, 'listbox', 'The top-level list has `role=listbox`');
    let nestedOptionList = findAll('.ember-power-select-options .ember-power-select-options');
    [].slice.call(nestedOptionList).forEach((e) => assert.equal(e.attributes.role.value, 'group'));
  });

  test('Single-select: All options have `role=option`', async function(assert) {
    assert.expect(15);

    this.groupedNumbers = groupedNumbers;
    await render(hbs`
      {{#power-select options=groupedNumbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    clickTrigger();
    [].slice.call(findAll('.ember-power-select-option')).forEach((e) => assert.equal(e.attributes.role.value, 'option'));
  });

  test('Multiple-select: All options have `role=option`', async function(assert) {
    assert.expect(15);

    this.groupedNumbers = groupedNumbers;
    await render(hbs`
      {{#power-select options=groupedNumbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    clickTrigger();
    [].slice.call(findAll('.ember-power-select-option')).forEach((e) => assert.equal(e.attributes.role.value, 'option'));
  });

  test('Single-select: The selected option has `aria-selected=true` and the rest `aria-selected=false`', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    this.selected = 'two';
    await render(hbs`
      {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    clickTrigger();
    assert.equal(findContains('.ember-power-select-option', 'two').attributes['aria-selected'].value, 'true', 'the selected option has aria-selected=true');
    assert.equal(findAll('.ember-power-select-option[aria-selected="false"]').length, numbers.length - 1, 'All other options have aria-selected=false');
  });

  test('Multiple-select: The selected options have `aria-selected=true` and the rest `aria-selected=false`', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    this.selected = ['two', 'four'];
    await render(hbs`
      {{#power-select-multiple options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    clickTrigger();
    assert.equal(findContains('.ember-power-select-option', 'two').attributes['aria-selected'].value, 'true', 'the first selected option has aria-selected=true');
    assert.equal(findContains('.ember-power-select-option', 'four').attributes['aria-selected'].value, 'true', 'the second selected option has aria-selected=true');
    assert.equal(findAll('.ember-power-select-option[aria-selected="false"]').length, numbers.length - 2, 'All other options have aria-selected=false');
  });

  test('Single-select: The highlighted option has `aria-current=true` and the rest not have `aria-current`', async function(assert) {
    assert.expect(4);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    clickTrigger();
    assert.equal(findContains('.ember-power-select-option', 'one').attributes['aria-current'].value, 'true', 'the highlighted option has aria-current=true');
    assert.equal(findAll('.ember-power-select-option[aria-current="false"]').length, numbers.length - 1, 'All other options have aria-current=false');
    keyEvent('.ember-power-select-search-input', 'keydown', 40);
    assert.equal(findContains('.ember-power-select-option', 'one').attributes['aria-current'].value, 'false', 'the first option has now aria-current=false');
    assert.equal(findContains('.ember-power-select-option', 'two').attributes['aria-current'].value, 'true', 'the second option has now aria-current=false');
  });

  test('Multiple-select: The highlighted option has `aria-current=true` and the rest `aria-current=false`', async function(assert) {
    assert.expect(4);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    clickTrigger();
    assert.equal(findContains('.ember-power-select-option', 'one').attributes['aria-current'].value, 'true', 'the highlighted option has aria-current=true');
    assert.equal(findAll('.ember-power-select-option[aria-current="false"]').length, numbers.length - 1, 'All other options have aria-current=false');
    keyEvent('.ember-power-select-search-input', 'keydown', 40);
    assert.equal(findContains('.ember-power-select-option', 'one').attributes['aria-current'].value, 'false', 'the first option has now aria-current=false');
    assert.equal(findContains('.ember-power-select-option', 'two').attributes['aria-current'].value, 'true', 'the second option has now aria-current=false');
  });

  test('Single-select: Options with a disabled field have `aria-disabled=true`', async function(assert) {
    assert.expect(1);

    this.countriesWithDisabled = countriesWithDisabled;
    await render(hbs`
      {{#power-select options=countriesWithDisabled onchange=(action (mut foo)) as |option|}}
        {{option.code}}: {{option.name}}
      {{/power-select}}
    `);

    clickTrigger();
    assert.equal(findAll('.ember-power-select-option[aria-disabled=true]').length, 3, 'Three of them are disabled');
  });

  test('Multiple-select: Options with a disabled field have `aria-disabled=true`', async function(assert) {
    assert.expect(1);

    this.countriesWithDisabled = countriesWithDisabled;
    await render(hbs`
      {{#power-select-multiple options=countriesWithDisabled onchange=(action (mut foo)) as |option|}}
        {{option.code}}: {{option.name}}
      {{/power-select-multiple}}
    `);

    clickTrigger();
    assert.equal(findAll('.ember-power-select-option[aria-disabled=true]').length, 3, 'Three of them are disabled');
  });

  test('Single-select: The trigger has `role=button` and `aria-owns=<id-of-dropdown>`', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    clickTrigger();
    let trigger = find('.ember-power-select-trigger');
    assert.equal(trigger.attributes.role.value, 'button', 'The trigger has role button');
    assert.ok(/^ember-basic-dropdown-content-ember\d+$/.test(trigger.attributes['aria-owns'].value), 'aria-owns point to the dropdown');
  });

  test('Multiple-select: The trigger has `role=button` and `aria-owns=<id-of-dropdown>`', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    clickTrigger();
    let trigger = find('.ember-power-select-trigger');
    assert.equal(trigger.attributes.role.value, 'button', 'The trigger has role button');
    assert.ok(/^ember-basic-dropdown-content-ember\d+$/.test(trigger.attributes['aria-owns'].value), 'aria-owns point to the dropdown');
  });

  test('Single-select: The trigger attribute `aria-expanded` is true when the dropdown is opened', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    let trigger = find('.ember-power-select-trigger');
    assert.notOk(trigger.attributes['aria-expanded'], 'Not expanded');
    clickTrigger();
    assert.ok(trigger.attributes['aria-expanded'], 'Expanded');
  });

  test('Multiple-select: The trigger attribute `aria-expanded` is true when the dropdown is opened', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    let trigger = find('.ember-power-select-trigger');
    assert.notOk(trigger.attributes['aria-expanded'], 'Not expanded');
    clickTrigger();
    assert.ok(trigger.attributes['aria-expanded'], 'Expanded');
  });

  test('Single-select: The listbox has a unique id`', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    clickTrigger();
    assert.ok(/^ember-power-select-options-ember\d+$/.test(find('.ember-power-select-options').id), 'The search has a unique id');
  });

  test('Multiple-select: The listbox has a unique id`', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    clickTrigger();
    assert.ok(/^ember-power-select-options-ember\d+$/.test(find('.ember-power-select-options').id), 'The search has a unique id');
  });

  test('Single-select: The searchbox has type `search` and `aria-controls=<id-of-listbox>`', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    clickTrigger();
    assert.equal(find('.ember-power-select-search-input').type, 'search', 'The type of the input is `search`');
    assert.ok(/^ember-power-select-options-ember\d+$/.test(find('.ember-power-select-search-input').attributes['aria-controls'].value), 'The `aria-controls` points to the id of the listbox');
  });

  test('Multiple-select: The searchbox has type `search` and `aria-controls=<id-of-listbox>`', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    clickTrigger();
    assert.equal(find('.ember-power-select-trigger-multiple-input').type, 'search', 'The type of the input is `search`');
    assert.ok(/^ember-power-select-options-ember\d+$/.test(find('.ember-power-select-trigger-multiple-input').attributes['aria-controls'].value), 'The `aria-controls` points to the id of the listbox');
  });

  test('Single-select: The listbox has `aria-controls=<id-of-the-trigger>`', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    clickTrigger();
    assert.ok(/^ember-power-select-trigger-ember\d+$/.test(find('.ember-power-select-options').attributes['aria-controls'].value), 'The listbox controls the trigger');
  });

  test('Multiple-select: The listbox has `aria-controls=<id-of-the-trigger>`', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    clickTrigger();
    assert.ok(/^ember-power-select-trigger-ember\d+$/.test(find('.ember-power-select-options').attributes['aria-controls'].value), 'The listbox controls the trigger');
  });

  test('Multiple-select: The selected elements are <li>s inside an <ul>, and have an item with `role=button` with `aria-label="remove element"`', async function(assert) {
    assert.expect(12);

    this.numbers = numbers;
    this.selected = ['two', 'four', 'six'];
    await render(hbs`
      {{#power-select-multiple options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    [].slice.call(findAll('.ember-power-select-multiple-option')).forEach((e) => {
      assert.equal(e.tagName, 'LI', 'The element is a list item');
      assert.equal(e.parentElement.tagName, 'UL', 'The parent element is a list');
      let closeButton = e.querySelector('.ember-power-select-multiple-remove-btn');
      assert.equal(closeButton.attributes.role.value, 'button', 'The role of the close button is "button"');
      assert.equal(closeButton.attributes['aria-label'].value, 'remove element', 'The close button has a helpful aria label');
    });
  });

  test('Single-select: The trigger element correctly passes through WAI-ARIA widget attributes', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select
        ariaInvalid=true
        ariaLabel='ariaLabelString'
        onchange=(action (mut foo))
        options=numbers
        required=true
        selected=selected
        as |option|
      }}
        {{option}}
      {{/power-select}}
    `);
    let trigger = find('.ember-power-select-trigger');

    assert.equal(trigger.attributes['aria-label'].value, 'ariaLabelString', 'aria-label set correctly');
    assert.equal(trigger.attributes['aria-invalid'].value, 'true', 'aria-invalid set correctly');
    assert.equal(trigger.attributes['aria-required'].value, 'true', 'aria-required set correctly');
  });

  test('Multiple-select: The trigger element correctly passes through WAI-ARIA widget attributes', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple
        ariaLabel='ariaLabelString'
        ariaInvalid=true
        onchange=(action (mut foo))
        options=numbers
        required=true
        selected=selected
        as |option|
      }}
        {{option}}
      {{/power-select-multiple}}
    `);
    let trigger = find('.ember-power-select-trigger');

    assert.equal(trigger.attributes['aria-label'].value, 'ariaLabelString', 'aria-label set correctly');
    assert.equal(trigger.attributes['aria-invalid'].value, 'true', 'aria-invalid set correctly');
    assert.equal(trigger.attributes['aria-required'].value, 'true', 'aria-required set correctly');
  });

  test('Single-select: The trigger element correctly passes through WAI-ARIA relationship attributes', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select
        ariaDescribedBy='ariaDescribedByString'
        ariaLabelledBy='ariaLabelledByString'
        onchange=(action (mut foo))
        options=numbers
        selected=selected
        as |option|
      }}
        {{option}}
      {{/power-select}}
    `);
    let trigger = find('.ember-power-select-trigger');

    assert.equal(trigger.attributes['aria-describedby'].value, 'ariaDescribedByString', 'aria-describedby set correctly');
    assert.equal(trigger.attributes['aria-labelledby'].value, 'ariaLabelledByString', 'aria-required set correctly');
  });

  test('Multiple-select: The trigger element correctly passes through WAI-ARIA relationship attributes', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple
        ariaDescribedBy='ariaDescribedByString'
        ariaLabelledBy='ariaLabelledByString'
        onchange=(action (mut foo))
        options=numbers
        selected=selected
        as |option|
      }}
        {{option}}
      {{/power-select-multiple}}
    `);
    let trigger = find('.ember-power-select-trigger');

    assert.equal(trigger.attributes['aria-describedby'].value, 'ariaDescribedByString', 'aria-describedby set correctly');
    assert.equal(trigger.attributes['aria-labelledby'].value, 'ariaLabelledByString', 'aria-required set correctly');
  });

  test('Trigger can have a custom aria-role passing triggerRole', async function(assert) {
    assert.expect(2);
    let role = 'my-role';
    this.role = role;

    this.numbers = numbers;

    await render(hbs`
      {{#power-select options=countries selected=country onchange=(action (mut foo)) triggerRole=role as |country|}}
        {{country.name}}
      {{/power-select}}
    `);

    assert.equal(find('.ember-power-select-trigger').getAttribute('role'), role, 'The `role` was added.');

    this.set('role', undefined);
    assert.equal(find('.ember-power-select-trigger').getAttribute('role'), 'button', 'The `role` was defaults to `button`.');
  });
});
