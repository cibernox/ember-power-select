import { module, test } from 'qunit';
import { setupRenderingTest } from '../../../helpers';
import { render, type TestContext } from '@ember/test-helpers';
import { numbers } from '../../../../demo-app/utils/constants';
import type { Select, Selected } from '#src/types.ts';
import PowerSelect from '#src/components/power-select.gts';
import HostWrapper from '../../../../demo-app/components/host-wrapper.gts';

interface NumbersContext<
  IsMultiple extends boolean = false,
> extends TestContext {
  element: HTMLElement;
  numbers: typeof numbers;
  foo: (
    selection: Selected<string, IsMultiple>,
    select: Select<string, IsMultiple>,
    event?: Event,
  ) => void;
}

function getRootNode(element: Element): HTMLElement {
  const shadowRoot = element.querySelector('[data-host-wrapper]')?.shadowRoot;
  if (shadowRoot) {
    return shadowRoot as unknown as HTMLElement;
  }

  return element.getRootNode() as HTMLElement;
}

module(
  'Integration | Component | Ember Power Select (The opened property)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<NumbersContext>('the select can be rendered already opened by passing `@initiallyOpened={{true}}`', async function (assert) {
      const self = this;

      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @onChange={{self.foo}}
              @initiallyOpened={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('Dropdown is opened');
    });

    test<NumbersContext>('[BUGFIX] the select can be rendered already opened by passing `@initiallyOpened={{true}}` AND `@selected`', async function (assert) {
      const self = this;

      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @onChange={{self.foo}}
              @initiallyOpened={{true}}
              @selected="seven"
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('Dropdown is opened');
    });
  },
);
