import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { touchTrigger } from 'ember-power-select/test-support/helpers';
import { numbers } from '../constants';
import { find, findAll, tap } from 'ember-native-dom-helpers';

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

    touchTrigger();
    assert.ok(find('.ember-power-select-options'), 'The dropdown is shown');
  });

  test('Touch on option should select it', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    touchTrigger();

    tap(findAll('.ember-power-select-option')[3]);

    assert.equal(find('.ember-power-select-selected-item').textContent.trim(), 'four');
  });

  test('Touch on custom option should select it', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
        <div class="super-fancy">{{option}}</div>
      {{/power-select}}
    `);

    touchTrigger();
    tap(findAll('.super-fancy')[3]);

    assert.equal(find('.ember-power-select-selected-item').textContent.trim(), 'four');
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

    tap('.ember-power-select-clear-btn');

    assert.notOk(find('.ember-power-select-selected-item'), '');
  });
});
