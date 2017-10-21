import { module, test } from 'qunit';
import { setupRenderingTest, render } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { numbers } from './components/constants';
import { clickTrigger, typeInSearch, findContains } from '../helpers/ember-power-select';

module('Integration | Helpers', function(hooks) {
  setupRenderingTest(hooks);

  test('typeInSearch inputs the provided search string', async function(assert) {
    this.numbers = numbers;

    await render(hbs`
      {{#power-select options=numbers onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    clickTrigger();
    typeInSearch('one');

    assert.ok(findContains('.ember-power-select-option', 'one'));
  });

  test('typeInSearch scopes the input to the provided one if the passed arguments are two', async function(assert) {
    this.numbers = numbers;

    await render(hbs`
      {{#power-select-multiple options=numbers onchange=(action (mut fooMultiple)) as |number|}}
        {{number}}
      {{/power-select-multiple}}
      <div id="single-select">
        {{#power-select options=numbers renderInPlace=true onchange=(action (mut foo)) as |number|}}
          {{number}}
        {{/power-select}}
      </div>
    `);

    clickTrigger('#single-select');
    typeInSearch('#single-select', 'one');

    assert.ok(findContains('#single-select .ember-power-select-option', 'one'));
  });
});
