import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, type TestContext } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { numbers } from 'test-app/utils/constants';
import {
  clickTrigger,
  typeInSearch,
  findContains,
} from 'ember-power-select/test-support/helpers';

interface Context extends TestContext {
  numbers: string[];
  fooMultiple: () => void;
  foo: () => void;
}

module('Integration | Helpers', function (hooks) {
  setupRenderingTest(hooks);

  test<Context>('typeInSearch inputs the provided search string', async function (assert) {
    this.numbers = numbers;
    this.foo = () => {};

    await render<Context>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

    await clickTrigger();
    await typeInSearch('one');

    assert.ok(findContains('.ember-power-select-option', 'one'));
  });

  test<Context>('typeInSearch scopes the input to the provided one if the passed arguments are two', async function (assert) {
    this.numbers = numbers;
    this.fooMultiple = () => {};
    this.foo = () => {};

    await render<Context>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{this.fooMultiple}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
      <div id="single-select">
        <PowerSelect @options={{this.numbers}} @renderInPlace={{true}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
          {{number}}
        </PowerSelect>
      </div>
    `);

    await clickTrigger('#single-select');
    await typeInSearch('#single-select', 'one');

    assert.ok(findContains('#single-select .ember-power-select-option', 'one'));
  });
});
