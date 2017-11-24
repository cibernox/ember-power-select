import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import { numbers } from '../constants';
import { find, findAll, click, triggerEvent } from 'ember-native-dom-helpers';

module('Integration | Component | Ember Power Select (Mouse control)', function(hooks) {
  setupRenderingTest(hooks);

  test('Mouseovering a list item highlights it', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    clickTrigger();
    assert.equal(find('.ember-power-select-option').attributes['aria-current'].value, 'true', 'The first element is highlighted');
    triggerEvent(findAll('.ember-power-select-option')[3], 'mouseover');
    assert.equal(findAll('.ember-power-select-option')[3].attributes['aria-current'].value, 'true', 'The 4th element is highlighted');
    assert.equal(findAll('.ember-power-select-option')[3].textContent.trim(), 'four');
  });

  test('Clicking an item selects it, closes the dropdown and focuses the trigger', async function(assert) {
    assert.expect(4);

    this.numbers = numbers;
    this.foo = (val, dropdown) => {
      assert.equal(val, 'four', 'The action is invoked with the selected value as first parameter');
      assert.ok(dropdown.actions.close, 'The action is invoked with the the dropdown object as second parameter');
    };
    await render(hbs`
      {{#power-select options=numbers onchange=foo as |option|}}
        {{option}}
      {{/power-select}}
    `);

    clickTrigger();
    click(findAll('.ember-power-select-option')[3]);
    assert.notOk(find('.ember-power-select-dropdown'), 'The select was closed');
    assert.ok(find('.ember-power-select-trigger') === document.activeElement, 'The trigger is focused');
  });

  test('Clicking the trigger while the select is opened closes it and and focuses the trigger', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    clickTrigger();
    assert.ok(find('.ember-power-select-dropdown'), 'The select is opened');
    clickTrigger();
    assert.notOk(find('.ember-power-select-dropdown'), 'The select is closed');
    assert.ok(find('.ember-power-select-trigger') === document.activeElement, 'The trigger is focused');
  });

  test('Doing mousedown the clear button removes the selection but does not open the select', async function(assert) {
    assert.expect(6);

    this.numbers = numbers;
    this.onChange = (selected, dropdown) => {
      assert.equal(selected, null, 'The onchange action was called with the new selection (null)');
      assert.ok(dropdown.actions.close, 'The onchange action was called with the dropdown object as second argument');
      this.set('selected', selected);
    };
    this.selected = 'three';
    await render(hbs`
      {{#power-select options=numbers selected=selected allowClear=true onchange=onChange as |option|}}
        {{option}}
      {{/power-select}}
    `);

    assert.notOk(find('.ember-power-select-dropdown'), 'The select is closed');
    assert.ok(/three/.test(find('.ember-power-select-trigger').textContent.trim()), 'A element is selected');
    click('.ember-power-select-clear-btn');
    assert.notOk(find('.ember-power-select-dropdown'), 'The select is still closed');
    assert.ok(!/three/.test(find('.ember-power-select-trigger').textContent.trim()), 'That element is not selected now');
  });

  test('Clicking anywhere outside the select while opened closes the component and doesn\'t focuses the trigger', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;
    await render(hbs`
      <input type="text" id="other-thing">
      {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    clickTrigger();
    assert.ok(find('.ember-power-select-dropdown'), 'The select is opened');
    click('#other-thing');
    assert.notOk(find('.ember-power-select-dropdown'), 'The select is closed');
    assert.ok(find('.ember-power-select-trigger') !== document.activeElement, 'The select is not focused');
  });

  test('Doing mouseup over an option less than 2px in the Y axis of where the mousedown that opened the component was triggered doesn\'t select the option', async function(assert) {
    assert.expect(4);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers inTesting=false selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    clickTrigger(null, { clientY: 123 });
    assert.ok(find('.ember-power-select-dropdown'), 'The select is opened');
    triggerEvent(findAll('.ember-power-select-option')[1], 'mouseup', { clientY: 124 });
    assert.ok(find('.ember-power-select-dropdown'), 'The select is still opened');
    triggerEvent(findAll('.ember-power-select-option')[1], 'mouseup', { clientY: 125 });
    assert.notOk(find('.ember-power-select-dropdown'), 'The select is closed now');
    assert.equal(find('.ember-power-select-trigger').textContent.trim(), 'two', 'The element has been selected');
  });

  test('Clicking on a wrapped option should select it', async function(assert) {
    assert.expect(3);

    this.numbers = numbers;

    this.foo = (val) => {
      assert.equal(val, 'four', 'The expected value was selected');
    };

    await render(hbs`
      {{#power-select options=numbers onchange=foo as |option|}}
        <span class="special-class">{{option}}</span>
      {{/power-select}}
    `);

    clickTrigger();
    click(findAll('.special-class')[3]);
    assert.notOk(find('.ember-power-select-dropdown'), 'The select was closed');
    assert.ok(find('.ember-power-select-trigger') === document.activeElement, 'The trigger is focused');
  });

  test('Mouse-overing on a wrapped option should select it', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;

    await render(hbs`
      {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        <span class="special-class">{{option}}</span>
      {{/power-select}}
    `);

    clickTrigger();
    assert.equal(find('.ember-power-select-option[aria-current="true"]').textContent.trim(), 'one', 'The first element is highlighted');
    triggerEvent(findAll('.special-class')[3], 'mouseover');
    assert.equal(find('.ember-power-select-option[aria-current="true"]').textContent.trim(), 'four', 'The fourth element is highlighted');
  });

  test('Mouse-overing the list itself doesn\'t crashes the app', async function(assert) {
    assert.expect(0); // NOTE: The fact that this tests runs without errors is the prove that it works

    this.numbers = numbers;

    await render(hbs`
      {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        <span class="special-class">{{option}}</span>
      {{/power-select}}
    `);

    clickTrigger();
    triggerEvent('ul', 'mouseover');
  });
});

