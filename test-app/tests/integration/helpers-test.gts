import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, type TestContext } from '@ember/test-helpers';
import { numbers } from 'test-app/utils/constants';
import {
  clickTrigger,
  typeInSearch,
  findContains,
} from 'ember-power-select/test-support/helpers';
import PowerSelect from 'ember-power-select/components/power-select';
import PowerSelectMultiple from 'ember-power-select/components/power-select-multiple';

interface Context extends TestContext {
  numbers: string[];
  fooMultiple: () => void;
  foo: () => void;
}

module('Integration | Helpers', function (hooks) {
  setupRenderingTest(hooks);

  test<Context>('typeInSearch inputs the provided search string', async function (assert) {
    const self = this;

    this.numbers = numbers;
    this.foo = () => {};

    await render<Context>(
      <template>
        <PowerSelect
          @options={{self.numbers}}
          @onChange={{self.foo}}
          @searchEnabled={{true}}
          as |number|
        >
          {{number}}
        </PowerSelect>
      </template>,
    );

    await clickTrigger();
    await typeInSearch('one');

    assert.ok(findContains('.ember-power-select-option', 'one'));
  });

  test<Context>('typeInSearch scopes the input to the provided one if the passed arguments are two', async function (assert) {
    const self = this;

    this.numbers = numbers;
    this.fooMultiple = () => {};
    this.foo = () => {};

    await render<Context>(
      <template>
        <PowerSelectMultiple
          @options={{self.numbers}}
          @onChange={{self.fooMultiple}}
          @searchEnabled={{true}}
          as |number|
        >
          {{number}}
        </PowerSelectMultiple>
        <div id="single-select">
          <PowerSelect
            @options={{self.numbers}}
            @renderInPlace={{true}}
            @onChange={{self.foo}}
            @searchEnabled={{true}}
            as |number|
          >
            {{number}}
          </PowerSelect>
        </div>
      </template>,
    );

    await clickTrigger('#single-select');
    await typeInSearch('#single-select', 'one');

    assert.ok(findContains('#single-select .ember-power-select-option', 'one'));
  });
});
