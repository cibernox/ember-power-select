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
import HostWrapper from '../../demo-app/components/host-wrapper.gts';

interface Context extends TestContext {
  element: HTMLElement;
  numbers: string[];
  fooMultiple: () => void;
  foo: () => void;
}

function getRootNode(element: Element): HTMLElement {
  const shadowRoot = element.querySelector('[data-host-wrapper]')?.shadowRoot;
  if (shadowRoot) {
    return shadowRoot as unknown as HTMLElement;
  }

  return element.getRootNode() as HTMLElement;
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

    await clickTrigger(
      getRootNode(this.element).querySelector(
        '.ember-power-select-trigger',
      ) as HTMLElement,
    );
    await typeInSearch('', 'one', getRootNode(this.element));

    assert.ok(
      findContains(
        '.ember-power-select-option',
        'one',
        getRootNode(this.element),
      ),
    );
  });

  test<Context>('typeInSearch scopes the input to the provided one if the passed arguments are two', async function (assert) {
    const self = this;

    this.numbers = numbers;
    this.fooMultiple = () => {};
    this.foo = () => {};

    await render<Context>(
      <template>
        <HostWrapper>
          <PowerSelect
            @multiple={{true}}
            @options={{self.numbers}}
            @onChange={{self.fooMultiple}}
            @searchEnabled={{true}}
            as |number|
          >
            {{number}}
          </PowerSelect>
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

    await clickTrigger(
      getRootNode(this.element).querySelector(
        '#single-select .ember-power-select-trigger',
      ) as HTMLElement,
    );
    await typeInSearch('#single-select', 'one', getRootNode(this.element));

    assert.ok(
      findContains(
        '#single-select .ember-power-select-option',
        'one',
        getRootNode(this.element),
      ),
    );
  });
});
