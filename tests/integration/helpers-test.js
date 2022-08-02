import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { numbers } from './components/constants';
import {
  clickTrigger,
  typeInSearch,
  findContains,
} from 'ember-power-select/test-support/helpers';

module('Integration | Helpers', function (hooks) {
  setupRenderingTest(hooks);

  test('typeInSearch inputs the provided search string', async function (assert) {
    this.numbers = numbers;

    await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

    await clickTrigger();
    await typeInSearch('one');

    assert.ok(findContains('.ember-power-select-option', 'one'));
  });

  test('typeInSearch scopes the input to the provided one if the passed arguments are two', async function (assert) {
    this.numbers = numbers;

    await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{action (mut this.fooMultiple)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
      <div id="single-select">
        <PowerSelect @options={{this.numbers}} @renderInPlace={{true}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |number|>
          {{number}}
        </PowerSelect>
      </div>
    `);

    await clickTrigger('#single-select');
    await typeInSearch('#single-select', 'one');

    assert.ok(findContains('#single-select .ember-power-select-option', 'one'));
  });
});
