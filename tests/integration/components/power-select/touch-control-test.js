import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, tap } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { numbers } from '../constants';

module('Integration | Component | Ember Power Select (Touch control)', function(hooks) {
  setupRenderingTest(hooks);

  test('Touch on trigger should open the dropdown', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    await tap('.ember-power-select-trigger');
    assert.dom('.ember-power-select-options').exists('The dropdown is shown');
  });

  test('Touch on option should select it', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    await tap('.ember-power-select-trigger');
    await tap(document.querySelectorAll('.ember-power-select-option')[3]);
    assert.dom('.ember-power-select-selected-item').hasText('four');
  });

  test('Touch on custom option should select it', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        <div class="super-fancy">{{option}}</div>
      {{/power-select}}
    `);

    await tap('.ember-power-select-trigger');
    await tap(document.querySelectorAll('.super-fancy')[3]);
    assert.dom('.ember-power-select-selected-item').hasText('four');
  });

  test('Touch on clear button should deselect it', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    this.foo = 'one';
    await render(hbs`
      {{#power-select options=numbers selected=foo allowClear=true onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    await tap('.ember-power-select-clear-btn');
    assert.dom('.ember-power-select-selected-item').doesNotExist();
  });
});
