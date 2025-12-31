import { module, test } from 'qunit';
import { setupRenderingTest } from '../../../helpers';
import { render, type TestContext } from '@ember/test-helpers';
import { numbers } from '../../../../demo-app/utils/constants';
import type { Select, Selected } from '#src/types.ts';
import PowerSelect from '#src/components/power-select.gts';

interface NumbersContext<
  IsMultiple extends boolean = false,
> extends TestContext {
  numbers: typeof numbers;
  foo: (
    selection: Selected<string, IsMultiple>,
    select: Select<string, IsMultiple>,
    event?: Event,
  ) => void;
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
          <PowerSelect
            @options={{self.numbers}}
            @onChange={{self.foo}}
            @initiallyOpened={{true}}
            as |option|
          >
            {{option}}
          </PowerSelect>
        </template>,
      );

      assert.dom('.ember-power-select-dropdown').exists('Dropdown is opened');
    });

    test<NumbersContext>('[BUGFIX] the select can be rendered already opened by passing `@initiallyOpened={{true}}` AND `@selected`', async function (assert) {
      const self = this;

      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(
        <template>
          <PowerSelect
            @options={{self.numbers}}
            @onChange={{self.foo}}
            @initiallyOpened={{true}}
            @selected="seven"
            as |option|
          >
            {{option}}
          </PowerSelect>
        </template>,
      );

      assert.dom('.ember-power-select-dropdown').exists('Dropdown is opened');
    });
  },
);
