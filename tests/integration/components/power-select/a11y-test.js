import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerKeyEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { numbers, groupedNumbers, countriesWithDisabled } from '../constants';
import { clickTrigger, findContains } from 'ember-power-select/test-support/helpers';

module('Integration | Component | Ember Power Select (Accesibility)', function(hooks) {
  setupRenderingTest(hooks);

  test('Single-select: The top-level options list have `role=listbox` and nested lists have `role=group`', async function(assert) {
    assert.expect(6);

    this.groupedNumbers = groupedNumbers;
    await render(hbs`
      <PowerSelect @options={{groupedNumbers}} @onChange={{action (mut foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-dropdown > .ember-power-select-options').hasAttribute('role', 'listbox', 'The top-level list has `role=listbox`');
    let nestedOptionList = document.querySelectorAll('.ember-power-select-options .ember-power-select-options');
    [].slice.call(nestedOptionList).forEach((e) => assert.dom(e).hasAttribute('role', 'group'));
  });

  test('Multiple-select: The top-level options list have `role=listbox` and nested lists have `role=group`', async function(assert) {
    assert.expect(6);

    this.groupedNumbers = groupedNumbers;
    await render(hbs`
      <PowerSelectMultiple @options={{groupedNumbers}} @onChange={{action (mut foo)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-dropdown > .ember-power-select-options').hasAttribute('role', 'listbox', 'The top-level list has `role=listbox`');
    let nestedOptionList = document.querySelectorAll('.ember-power-select-options .ember-power-select-options');
    [].slice.call(nestedOptionList).forEach((e) => assert.dom(e).hasAttribute('role', 'group'));
  });

  test('Single-select: All options have `role=option` except highlighted options which have `role=alert`', async function(assert) {
    assert.expect(15);

    this.groupedNumbers = groupedNumbers;
    await render(hbs`
      <PowerSelect @options={{groupedNumbers}} @onChange={{action (mut foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    await clickTrigger();

    [].slice.call(document.querySelectorAll('li.ember-power-select-option[aria-current="true"]')).forEach((e) => {
      assert.dom(e).hasAttribute('role', 'alert');
    });

    [].slice.call(document.querySelectorAll('li.ember-power-select-option[aria-current="false"]')).forEach((e) => {
      assert.dom(e).hasAttribute('role', 'option');
    });
  });

  test('Multiple-select: All options have `role=option` except highlighted options which have `role=alert`', async function(assert) {
    assert.expect(15);

    this.groupedNumbers = groupedNumbers;
    await render(hbs`
      <PowerSelect @options={{groupedNumbers}} @onChange={{action (mut foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    await clickTrigger();

    [].slice.call(document.querySelectorAll('li.ember-power-select-option[aria-current="true"]')).forEach((e) => {
      assert.dom(e).hasAttribute('role', 'alert');
    });

    [].slice.call(document.querySelectorAll('li.ember-power-select-option[aria-current="false"]')).forEach((e) => {
      assert.dom(e).hasAttribute('role', 'option');
    });
  });

  test('Single-select: The selected option has `aria-selected=true` and the rest `aria-selected=false`', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    this.selected = 'two';
    await render(hbs`
      <PowerSelect @options={{numbers}} @selected={{selected}} @onChange={{action (mut selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    await clickTrigger();
    assert.dom(findContains('.ember-power-select-option', 'two')).hasAttribute('aria-selected', 'true', 'the selected option has aria-selected=true');
    assert.dom('.ember-power-select-option[aria-selected="false"]').exists({ count: numbers.length - 1 }, 'All other options have aria-selected=false');
  });

  test('Multiple-select: The selected options have `aria-selected=true` and the rest `aria-selected=false`', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    this.selected = ['two', 'four'];
    await render(hbs`
      <PowerSelectMultiple @options={{numbers}} @selected={{selected}} @onChange={{action (mut selected)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

    await clickTrigger();
    assert.dom(findContains('.ember-power-select-option', 'two')).hasAttribute('aria-selected', 'true', 'the first selected option has aria-selected=true');
    assert.dom(findContains('.ember-power-select-option', 'four')).hasAttribute('aria-selected', 'true', 'the second selected option has aria-selected=true');
    assert.dom('.ember-power-select-option[aria-selected="false"]').exists({ count: numbers.length - 2 }, 'All other options have aria-selected=false');
  });

  test('Single-select: The highlighted option has `aria-current=true` and the rest not have `aria-current`', async function(assert) {
    assert.expect(4);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelect @options={{numbers}} @selected={{selected}} @onChange={{action (mut selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    await clickTrigger();
    assert.dom(findContains('.ember-power-select-option', 'one')).hasAttribute('aria-current', 'true', 'the highlighted option has aria-current=true');
    assert.dom('.ember-power-select-option[aria-current="false"]').exists({ count: numbers.length - 1 }, 'All other options have aria-current=false');
    await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
    assert.dom(findContains('.ember-power-select-option', 'one')).hasAttribute('aria-current', 'false', 'the first option has now aria-current=false');
    assert.dom(findContains('.ember-power-select-option', 'two')).hasAttribute('aria-current', 'true', 'the second option has now aria-current=false');
  });

  test('Multiple-select: The highlighted option has `aria-current=true` and the rest `aria-current=false`', async function(assert) {
    assert.expect(4);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelect @options={{numbers}} @selected={{selected}} @onChange={{action (mut selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    await clickTrigger();
    assert.dom(findContains('.ember-power-select-option', 'one')).hasAttribute('aria-current', 'true', 'the highlighted option has aria-current=true');
    assert.dom('.ember-power-select-option[aria-current="false"]').exists({ count: numbers.length - 1 }, 'All other options have aria-current=false');
    await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
    assert.dom(findContains('.ember-power-select-option', 'one')).hasAttribute('aria-current', 'false', 'the first option has now aria-current=false');
    assert.dom(findContains('.ember-power-select-option', 'two')).hasAttribute('aria-current', 'true', 'the second option has now aria-current=false');
  });

  test('Single-select: The highlighted option has `role=alert` and the rest have `role=option`', async function(assert) {
    assert.expect(4);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelect @options={{numbers}} @selected={{selected}} @onChange={{action (mut selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    await clickTrigger();
    assert.dom(findContains('.ember-power-select-option', 'one')).hasAttribute('role', 'alert', 'the highlighted option has role=alert');
    assert.dom('.ember-power-select-option[role="option"]').exists({ count: numbers.length - 1 }, 'All other options have role=option');
    await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
    assert.dom(findContains('.ember-power-select-option', 'one')).hasAttribute('role', 'option', 'the first option now has role=option');
    assert.dom(findContains('.ember-power-select-option', 'two')).hasAttribute('role', 'alert', 'the second option now has role=alert');
  });

  test('Multiple-select: The highlighted option has `role=alert` and the rest `role=option`', async function(assert) {
    assert.expect(4);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelect @options={{numbers}} @selected={{selected}} @onChange={{action (mut selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    await clickTrigger();
    assert.dom(findContains('.ember-power-select-option', 'one')).hasAttribute('role', 'alert', 'the highlighted option has role=alert');
    assert.dom('.ember-power-select-option[role="option"]').exists({ count: numbers.length - 1 }, 'All other options have role=option');
    await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
    assert.dom(findContains('.ember-power-select-option', 'one')).hasAttribute('role', 'option', 'the first option now has role=option');
    assert.dom(findContains('.ember-power-select-option', 'two')).hasAttribute('role', 'alert', 'the second option now has role=alert');
  });

  test('Single-select: Options with a disabled field have `aria-disabled=true`', async function(assert) {
    assert.expect(1);

    this.countriesWithDisabled = countriesWithDisabled;
    await render(hbs`
      <PowerSelect @options={{countriesWithDisabled}} @onChange={{action (mut foo)}} as |option|>
        {{option.code}}: {{option.name}}
      </PowerSelect>
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-option[aria-disabled=true]').exists({ count: 3 }, 'Three of them are disabled');
  });

  test('Multiple-select: Options with a disabled field have `aria-disabled=true`', async function(assert) {
    assert.expect(1);

    this.countriesWithDisabled = countriesWithDisabled;
    await render(hbs`
      <PowerSelectMultiple @options={{countriesWithDisabled}} @onChange={{action (mut foo)}} as |option|>
        {{option.code}}: {{option.name}}
      </PowerSelectMultiple>
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-option[aria-disabled=true]').exists({ count: 3 }, 'Three of them are disabled');
  });

  test('Single-select: The trigger has `role=button` and `aria-owns=<id-of-dropdown>`', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelect @options={{numbers}} @selected={{selected}} @onChange={{action (mut foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-trigger').hasAttribute('role', 'button', 'The trigger has role button');
    assert.dom('.ember-power-select-trigger').hasAttribute('aria-owns', /^ember-basic-dropdown-content-ember\d+$/, 'aria-owns points to the dropdown');
  });

  test('Multiple-select: The trigger has `role=button` and `aria-owns=<id-of-dropdown>`', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelectMultiple @options={{numbers}} @selected={{selected}} @onChange={{action (mut foo)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-trigger').hasAttribute('role', 'button', 'The trigger has role button');
    assert.dom('.ember-power-select-trigger').hasAttribute('aria-owns', /^ember-basic-dropdown-content-ember\d+$/, 'aria-owns points to the dropdown');
  });

  test('Single-select: The trigger attribute `aria-expanded` is true when the dropdown is opened', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelect @options={{numbers}} @selected={{selected}} @onChange={{action (mut foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    assert.dom('.ember-power-select-trigger').hasAttribute('aria-expanded', 'false', 'Not expanded');
    await clickTrigger();
    assert.dom('.ember-power-select-trigger').hasAttribute('aria-expanded', 'true', 'Expanded');
  });

  test('Multiple-select: The trigger attribute `aria-expanded` is true when the dropdown is opened', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelectMultiple @options={{numbers}} @selected={{selected}} @onChange={{action (mut foo)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

    assert.dom('.ember-power-select-trigger').hasAttribute('aria-expanded', 'false', 'Not expanded');
    await clickTrigger();
    assert.dom('.ember-power-select-trigger').hasAttribute('aria-expanded', 'true', 'Expanded');
  });

  test('Single-select: The listbox has a unique id`', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-options').hasAttribute('id', /^ember-power-select-options-ember\d+$/, 'The search has a unique id');
  });

  test('Multiple-select: The listbox has a unique id`', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelectMultiple @options={{numbers}} @selected={{selected}} @onChange={{action (mut foo)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-options').hasAttribute('id', /^ember-power-select-options-ember\d+$/, 'The search has a unique id');
  });

  test('Single-select: The searchbox has type `search` and `aria-controls=<id-of-listbox>`', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut foo)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-search-input').hasAttribute('type', 'search', 'The type of the input is `search`');
    assert.dom('.ember-power-select-search-input').hasAttribute('aria-controls', /^ember-power-select-options-ember\d+$/, 'The `aria-controls` points to the id of the listbox');
  });

  test('Multiple-select: The searchbox has type `search` and `aria-controls=<id-of-listbox>`', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelectMultiple @options={{numbers}} @selected={{selected}} @onChange={{action (mut foo)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-trigger-multiple-input').hasAttribute('type', 'search', 'The type of the input is `search`');
    assert.dom('.ember-power-select-trigger-multiple-input').hasAttribute('aria-controls', /^ember-power-select-options-ember\d+$/, 'The `aria-controls` points to the id of the listbox');
  });

  test('Single-select: The listbox has `aria-controls=<id-of-the-trigger>`', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelect @options={{numbers}} @selected={{selected}} @onChange={{action (mut foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-options').hasAttribute('aria-controls', /^ember-power-select-trigger-ember\d+$/, 'The listbox controls the trigger');
  });

  test('Multiple-select: The listbox has `aria-controls=<id-of-the-trigger>`', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelectMultiple @options={{numbers}} @selected={{selected}} @onChange={{action (mut foo)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-options').hasAttribute('aria-controls', /^ember-power-select-trigger-ember\d+$/, 'The listbox controls the trigger');
  });

  test('Multiple-select: The selected elements are <li>s inside an <ul>, and have an item with `role=button` with `aria-label="remove element"`', async function(assert) {
    assert.expect(12);

    this.numbers = numbers;
    this.selected = ['two', 'four', 'six'];
    await render(hbs`
      <PowerSelectMultiple @options={{numbers}} @selected={{selected}} @onChange={{action (mut foo)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

    [].slice.call(document.querySelectorAll('.ember-power-select-multiple-option')).forEach((e) => {
      assert.equal(e.tagName, 'LI', 'The element is a list item');
      assert.equal(e.parentElement.tagName, 'UL', 'The parent element is a list');
      let closeButton = e.querySelector('.ember-power-select-multiple-remove-btn');
      assert.dom(closeButton).hasAttribute('role', 'button', 'The role of the close button is "button"');
      assert.dom(closeButton).hasAttribute('aria-label', 'remove element', 'The close button has a helpful aria label');
    });
  });

  test('Single-select: The trigger element correctly passes through WAI-ARIA widget attributes', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelect
        @ariaInvalid="true"
        @ariaLabel="ariaLabelString"
        @onChange={{action (mut foo)}}
        @options={{numbers}}
        @required="true"
        @selected={{selected}}
        as |option|>
        {{option}}
      </PowerSelect>
    `);
    assert.dom('.ember-power-select-trigger').hasAttribute('aria-label', 'ariaLabelString', 'aria-label set correctly');
    assert.dom('.ember-power-select-trigger').hasAttribute('aria-invalid', 'true', 'aria-invalid set correctly');
    assert.dom('.ember-power-select-trigger').hasAttribute('aria-required', 'true', 'aria-required set correctly');
  });

  test('Multiple-select: The trigger element correctly passes through WAI-ARIA widget attributes', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelectMultiple
        @ariaLabel="ariaLabelString"
        @ariaInvalid="true"
        @onChange={{action (mut foo)}}
        @options={{numbers}}
        @required="true"
        @selected={{selected}}
        as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);
    assert.dom('.ember-power-select-trigger').hasAttribute('aria-label', 'ariaLabelString', 'aria-label set correctly');
    assert.dom('.ember-power-select-trigger').hasAttribute('aria-invalid', 'true', 'aria-invalid set correctly');
    assert.dom('.ember-power-select-trigger').hasAttribute('aria-required', 'true', 'aria-required set correctly');
  });

  test('Single-select: The trigger element correctly passes through WAI-ARIA relationship attributes', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelect
        @ariaDescribedBy="ariaDescribedByString"
        @ariaLabelledBy="ariaLabelledByString"
        @onChange={{action (mut foo)}}
        @options={{numbers}}
        @selected={{selected}}
        as |option|>
        {{option}}
      </PowerSelect>
    `);
    assert.dom('.ember-power-select-trigger').hasAttribute('aria-describedby', 'ariaDescribedByString', 'aria-describedby set correctly');
    assert.dom('.ember-power-select-trigger').hasAttribute('aria-labelledby', 'ariaLabelledByString', 'aria-required set correctly');
  });

  test('Multiple-select: The trigger element correctly passes through WAI-ARIA relationship attributes', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    await render(hbs`
      <PowerSelectMultiple
        @ariaDescribedBy="ariaDescribedByString"
        @ariaLabelledBy="ariaLabelledByString"
        @onChange={{action (mut foo)}}
        @options={{numbers}}
        @selected={{selected}}
        as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);
    assert.dom('.ember-power-select-trigger').hasAttribute('aria-describedby', 'ariaDescribedByString', 'aria-describedby set correctly');
    assert.dom('.ember-power-select-trigger').hasAttribute('aria-labelledby', 'ariaLabelledByString', 'aria-required set correctly');
  });

  test('Trigger can have a custom aria-role passing @triggerRole', async function(assert) {
    assert.expect(2);
    let role = 'my-role';
    this.role = role;

    this.numbers = numbers;

    await render(hbs`
      <PowerSelect @options={{countries}} @selected={{country}} @onChange={{action (mut foo)}} @triggerRole={{role}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

    assert.dom('.ember-power-select-trigger').hasAttribute('role', role, 'The `role` was added.');
    this.set('role', undefined);
    assert.dom('.ember-power-select-trigger').hasAttribute('role', 'button', 'The `role` was defaults to `button`.');
  });
});
