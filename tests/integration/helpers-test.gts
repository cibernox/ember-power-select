import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, type TestContext } from '@ember/test-helpers';
import { numbers } from '../../demo-app/utils/constants';
import {
  clickTrigger,
  typeInSearch,
  findContains,
} from '#src/test-support/helpers.ts';
import PowerSelect from '#src/components/power-select.gts';
import PowerSelectMultiple from '#src/components/power-select-multiple.gts';
import HostWrapper from '../../demo-app/components/host-wrapper.gts';

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
        <HostWrapper>
          <PowerSelect
            @options={{self.numbers}}
            @onChange={{self.foo}}
            @searchEnabled={{true}}
            as |number|
          >
            {{number}}
          </PowerSelect>
        </HostWrapper>
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
        <HostWrapper>
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
        </HostWrapper>
      </template>,
    );

    await clickTrigger('#single-select');
    await typeInSearch('#single-select', 'one');

    assert.ok(findContains('#single-select .ember-power-select-option', 'one'));
  });
});
