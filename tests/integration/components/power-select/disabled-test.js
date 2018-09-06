import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent, triggerKeyEvent, click, focus } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';
import { clickTrigger, typeInSearch } from 'ember-power-select/test-support/helpers';
import { numbers, countriesWithDisabled } from '../constants';

module('Integration | Component | Ember Power Select (Disabled)', function(hooks) {
  setupRenderingTest(hooks);

  test('A disabled dropdown doesn\'t responds to mouse/keyboard events', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers disabled=true onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    assert.dom('.ember-power-select-trigger').hasAttribute('aria-disabled', 'true');
    await clickTrigger();
    assert.dom('.ember-power-select-dropdown').doesNotExist('The select is still closed');
    await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 13);
    assert.dom('.ember-power-select-dropdown').doesNotExist('The select is still closed');
  });

  test('A disabled dropdown is not focusable, and ignores the passed tabindex', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers tabindex="123" disabled=true onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);
    assert.dom('.ember-power-select-trigger').doesNotHaveAttribute('tabindex', 'The trigger has no tabindex so it can\'t be focused');
  });

  test('Disabled options are not highlighted when hovered with the mouse', async function(assert) {
    assert.expect(1);

    this.countriesWithDisabled = countriesWithDisabled;
    await render(hbs`
      {{#power-select options=countriesWithDisabled onchange=(action (mut foo)) as |option|}}
        {{option.code}}: {{option.name}}
      {{/power-select}}
    `);

    await clickTrigger();
    await triggerEvent('.ember-power-select-option[aria-disabled="true"]', 'mouseover');
    assert.dom('.ember-power-select-option[aria-disabled="true"]').hasAttribute('aria-current', 'false', 'The hovered option was not highlighted because it\'s disabled');
  });

  test('Disabled options are skipped when highlighting items with the keyboard', async function(assert) {
    assert.expect(1);

    this.countriesWithDisabled = countriesWithDisabled;
    await render(hbs`
      {{#power-select options=countriesWithDisabled onchange=(action (mut foo)) as |option|}}
        {{option.code}}: {{option.name}}
      {{/power-select}}
    `);

    await clickTrigger();
    await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
    await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
    assert.dom('.ember-power-select-option[aria-current="true"]').hasText('LV: Latvia', 'The hovered option was not highlighted because it\'s disabled');
  });

  test('When passed `disabled=true`, the input inside the trigger is also disabled', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) disabled=true as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-trigger-multiple-input').hasAttribute('disabled');
  });

  test('When passed `disabled=true`, the options cannot be removed', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    this.selectedNumbers = [numbers[2], numbers[4]];

    await render(hbs`
      {{#power-select-multiple selected=selectedNumbers onchange=(action (mut foo)) options=numbers disabled=true as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-multiple-remove-btn').doesNotExist('There is no button to remove selected elements');
  });

  test('Multiple select: When passed `disabled=prop`, enabling and disabling that property changes the component', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    this.selectedNumbers = [numbers[2], numbers[4]];
    this.set('shouldBeDisabled', true);

    await render(hbs`
      {{#power-select-multiple selected=selectedNumbers onchange=(action (mut foo)) options=numbers disabled=shouldBeDisabled as |option|}}
        {{option}}
      {{/power-select-multiple}}
    `);

    assert.dom('.ember-power-select-trigger').hasAttribute('aria-disabled', 'true', 'The trigger has `aria-disabled=true`');
    this.set('shouldBeDisabled', false);
    assert.dom('.ember-power-select-trigger').doesNotHaveAttribute('aria-expanded')
    assert.dom('.ember-power-select-trigger-multiple-input').doesNotHaveAttribute('disabled');
  });

  test('BUGFIX: When after a search the only result is a disabled element, it isn\'t highlighted and cannot be selected', async function(assert) {
    assert.expect(3);
    this.countriesWithDisabled = countriesWithDisabled;

    await render(hbs`
     {{#power-select options=countriesWithDisabled searchField="name" selected=foo onchange=(action (mut foo)) as |country|}}
       {{country.name}}
     {{/power-select}}
    `);

    await clickTrigger();
    await typeInSearch('Br');
    assert.dom('.ember-power-select-option[aria-current="true"]').doesNotExist('Nothing is highlighted');
    await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 13);
    assert.dom('.ember-power-select-dropdown').doesNotExist('The select is closed');
    assert.dom('.ember-power-select-trigger').hasText('', 'Nothing was selected');
  });

  test('BUGFIX: When after a search there is two results and the first one is a disabled element, the second one is highlighted', async function(assert) {
    assert.expect(4);
    this.countriesWithDisabled = countriesWithDisabled;

    await render(hbs`
     {{#power-select options=countriesWithDisabled searchField="name" selected=foo onchange=(action (mut foo)) as |country|}}
       {{country.name}}
     {{/power-select}}
    `);

    await clickTrigger();
    await typeInSearch('o'); // Finds ["Portugal", "United Kingdom"]
    assert.dom('.ember-power-select-option').exists({ count: 2 }, 'There is two results');
    assert.dom('.ember-power-select-option[aria-disabled="true"]').exists({ count: 1 }, 'One is disabled');
    assert.dom('.ember-power-select-option[aria-current="true"]').exists({ count: 1 }, 'One element is highlighted');
    assert.dom('.ember-power-select-option[aria-current="true"]').hasText('United Kingdom', 'The first non-disabled element is highlighted');
  });

  test('BUGFIX: When searching by pressing keys on a focused & closed select, disabled options are ignored', async function(assert) {
    assert.expect(3);
    this.countriesWithDisabled = countriesWithDisabled.map((country) => Object.assign({}, country));
    this.countriesWithDisabled[0].disabled = true;

    await render(hbs`
     {{#power-select options=countriesWithDisabled searchField="name" selected=foo onchange=(action (mut foo)) as |country|}}
       {{country.name}}
     {{/power-select}}
    `);

    await focus('.ember-power-select-trigger');
    assert.dom('.ember-power-select-dropdown').doesNotExist('The dropdown is closed');
    await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 85); // u
    assert.dom('.ember-power-select-dropdown').doesNotExist('The dropdown is still closed');
    assert.dom('.ember-power-select-trigger').hasText('United Kingdom', '"United Kingdom" has been selected');
  });

  test('The title of a group can be marked as disabled, and it is still disabled after filtering', async function(assert) {
    assert.expect(2);

    let options = [
      { groupName: 'Smalls', options: ['one', 'two', 'three'] },
      { groupName: 'Mediums', disabled: true, options: ['four', 'five', 'six'] },
      {
        groupName: 'Bigs',
        options: [
          { groupName: 'Fairly big', options: ['seven', 'eight', 'nine'] },
          { groupName: 'Really big', options: ['ten', 'eleven', 'twelve'] },
          'thirteen'
        ]
      },
      'one hundred',
      'one thousand'
    ];

    this.options = options;
    await render(hbs`
      {{#power-select options=options onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-group[aria-disabled="true"]').exists({ count: 1 }, 'one group is disabled');
    await typeInSearch('fiv');
    assert.dom('.ember-power-select-group[aria-disabled="true"]').exists({ count: 1 }, 'one group is still disabled');
  });

  test('If a group is disabled, any options inside cannot be interacted with mouse', async function(assert) {
    assert.expect(4);

    let options = [
      { groupName: 'Smalls', options: ['one', 'two', 'three'] },
      { groupName: 'Mediums', options: ['four', 'five', 'six'] },
      {
        groupName: 'Bigs',
        disabled: true,
        options: [
          { groupName: 'Fairly big', options: ['seven', 'eight', 'nine'] },
          { groupName: 'Really big', options: ['ten', 'eleven', 'twelve'] },
          'thirteen'
        ]
      },
      'one hundred',
      'one thousand'
    ];

    this.options = options;
    await render(hbs`
      {{#power-select options=options selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-option[aria-current="true"]').hasText('one');
    assert.dom('.ember-power-select-option[aria-selected="true"]').doesNotExist('No option is selected');
    await triggerEvent(document.querySelectorAll('.ember-power-select-option')[8], 'mouseover');
    assert.dom('.ember-power-select-option[aria-current="true"]').hasText('one');
    await click(document.querySelectorAll('.ember-power-select-option')[9]);
    assert.dom('.ember-power-select-option[aria-selected="true"]').doesNotExist('Noting was selected');
  });

  test('If the value of `disabled` changes, the `disabled` property in the publicAPI matches it', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    this.isDisabled = false;
    this.foo = numbers[0];
    await render(hbs`
      {{#power-select options=numbers selected=foo disabled=isDisabled onchange=(action (mut foo)) as |option select|}}
        {{if select.disabled 'disabled!' 'enabled!'}}
      {{/power-select}}
    `);

    assert.dom('.ember-power-select-trigger').hasText('enabled!', 'The `disabled` attribute in the public API is false');
    run(() => this.set('isDisabled', true));
    assert.dom('.ember-power-select-trigger').hasText('disabled!', 'The `disabled` attribute in the public API is true');
  });

  test('If a select gets disabled while it\'s open, it closes automatically', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    this.isDisabled = false;
    await render(hbs`
      {{#power-select options=numbers disabled=isDisabled onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-dropdown').exists('The select is open');
    run(() => this.set('isDisabled', true));
    assert.dom('.ember-power-select-dropdown').doesNotExist('The select is now closed');
  });

  test('BUGFIX: A component can be disabled on selection', async function(assert) {
    assert.expect(2);
    this.numbers = numbers;

    await render(hbs`
     {{#power-select options=numbers selected=foo onchange=(action (mut foo)) disabled=foo  as |opt|}}
       {{opt}}
     {{/power-select}}
    `);

    await clickTrigger();
    await click(document.querySelectorAll('.ember-power-select-option')[1]);
    assert.dom('.ember-power-select-trigger').hasText('two', 'The option is selected');
    assert.dom('.ember-power-select-trigger').hasAttribute('aria-disabled', 'true');
  });
});
