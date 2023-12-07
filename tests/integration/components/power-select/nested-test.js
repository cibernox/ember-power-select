import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { clickTrigger as powerSelectClickTrigger } from 'ember-power-select/test-support/helpers';
import { clickTrigger as basicDropdownClickTrigger } from 'ember-basic-dropdown/test-support/helpers';
import { numbers } from '../constants';

module('Integration | Component | Ember Power Select (nested within basic-dropdown)', function(hooks) {
  setupRenderingTest(hooks);

  test('Clicking the trigger of a nested closed select opens the dropdown', async function(assert) {
    assert.expect(4);
    this.numbers = numbers;
    await render(hbs`
      <BasicDropdown as |dd|>
        <dd.Trigger data-role="parent-dropdown-trigger">Click me</dd.Trigger>
        <dd.Content>
          <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
            {{option}}
          </PowerSelect>
        </dd.Content>
      </BasicDropdown>
    `);

    assert.dom('.ember-power-select-trigger').doesNotExist('power-select trigger is not rendered');
    await basicDropdownClickTrigger('[data-role=parent-dropdown-trigger]');
    assert.dom('.ember-power-select-trigger').exists('power-select trigger is rendered');
    assert.dom('.ember-power-select-dropdown').doesNotExist('Dropdown is not rendered');
    await powerSelectClickTrigger();
    assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
  });

  test('Clicking the trigger of an opened nested select closes the dropdown', async function(assert) {
    assert.expect(4);

    this.numbers = numbers;
    await render(hbs`
      <BasicDropdown as |dd|>
        <dd.Trigger data-role="parent-dropdown-trigger">Click me</dd.Trigger>
        <dd.Content>
          <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
            {{option}}
          </PowerSelect>
        </dd.Content>
      </BasicDropdown>
    `);

    assert.dom('.ember-power-select-trigger').doesNotExist('power-select trigger is not rendered');
    await basicDropdownClickTrigger('[data-role=parent-dropdown-trigger]');
    assert.dom('.ember-power-select-trigger').exists('power-select trigger is rendered');
    await powerSelectClickTrigger();
    assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
    await powerSelectClickTrigger();
    assert.dom('.ember-power-select-dropdown').doesNotExist('Dropdown is not rendered');
  });

  test('The nested power-select trigger remains visible after selecting an option with the mouse', async function(assert) {
    assert.expect(5);

    this.numbers = numbers;
    await render(hbs`
      <BasicDropdown as |dd|>
        <dd.Trigger data-role="parent-dropdown-trigger">Click me</dd.Trigger>
        <dd.Content>
          <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} as |option|>
            {{option}}
          </PowerSelect>
        </dd.Content>
      </BasicDropdown>
    `);

    assert.dom('.ember-power-select-trigger').doesNotExist('power-select trigger is not rendered');
    await basicDropdownClickTrigger('[data-role=parent-dropdown-trigger]');
    assert.dom('.ember-power-select-trigger').exists('power-select trigger is rendered');
    assert.dom('.ember-power-select-dropdown').doesNotExist('Dropdown is not rendered');
    await powerSelectClickTrigger();
    assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
    await click('.ember-power-select-option:nth-child(4)');
    assert.dom('.ember-power-select-trigger').hasText('four', '"four" has been selected');
  });

  test('The nested power-select trgger remains visible after selecting an option with the keyboard', async function(assert) {
    assert.expect(5);

    this.numbers = numbers;
    await render(hbs`
      <BasicDropdown as |dd|>
        <dd.Trigger data-role="parent-dropdown-trigger">Click me</dd.Trigger>
        <dd.Content>
          <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |option|>
            {{option}}
          </PowerSelect>
        </dd.Content>
      </BasicDropdown>
    `);

    assert.dom('.ember-power-select-trigger').doesNotExist('power-select trigger is not rendered');
    await basicDropdownClickTrigger('[data-role=parent-dropdown-trigger]');
    assert.dom('.ember-power-select-trigger').exists('power-select trigger is rendered');
    assert.dom('.ember-power-select-dropdown').doesNotExist('Dropdown is not rendered');
    await powerSelectClickTrigger();
    assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
    await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 13);
    assert.dom('.ember-power-select-trigger').hasText('one', '"one" has been selected');
  });

  test('If the user passes `@closeOnSelect={{false}}` the dropdown remains visible after selecting an option with the mouse (nested)', async function(assert) {
    assert.expect(6);

    this.numbers = numbers;
    await render(hbs`
      <BasicDropdown as |dd|>
        <dd.Trigger data-role="parent-dropdown-trigger">Click me</dd.Trigger>
        <dd.Content>
          <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @closeOnSelect={{false}} @onChange={{action (mut this.foo)}} as |option|>
            {{option}}
          </PowerSelect>
        </dd.Content>
      </BasicDropdown>
    `);

    assert.dom('.ember-power-select-trigger').doesNotExist('power-select trigger is not rendered');
    await basicDropdownClickTrigger('[data-role=parent-dropdown-trigger]');
    assert.dom('.ember-power-select-trigger').exists('power-select trigger is rendered');
    assert.dom('.ember-power-select-dropdown').doesNotExist('Dropdown is not rendered');
    await powerSelectClickTrigger();
    assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
    await click('.ember-power-select-option:nth-child(4)');
    assert.dom('.ember-power-select-trigger').hasText('four', '"four" has been selected');
    assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
  });

  test('If the user passes `@closeOnSelect={{false}}` the dropdown remains visible after selecting an option with the keyboard (nested)', async function(assert) {
    assert.expect(6);

    this.numbers = numbers;
    await render(hbs`
      <BasicDropdown as |dd|>
        <dd.Trigger data-role="parent-dropdown-trigger">Click me</dd.Trigger>
        <dd.Content>
          <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @closeOnSelect={{false}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |option|>
            {{option}}
          </PowerSelect>
        </dd.Content>
      </BasicDropdown>
    `);

    assert.dom('.ember-power-select-trigger').doesNotExist('power-select trigger is not rendered');
    await basicDropdownClickTrigger('[data-role=parent-dropdown-trigger]');
    assert.dom('.ember-power-select-trigger').exists('power-select trigger is rendered');
    assert.dom('.ember-power-select-dropdown').doesNotExist('Dropdown is not rendered');
    await powerSelectClickTrigger();
    assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
    await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 13);
    assert.dom('.ember-power-select-trigger').hasText('one', '"one" has been selected');
    assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
  });
});
