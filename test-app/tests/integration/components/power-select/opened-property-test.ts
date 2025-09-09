import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { render, type TestContext } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { numbers } from 'test-app/utils/constants';
import type { Select, Selected } from 'ember-power-select/components/power-select';

interface NumbersContext<IsMultiple extends boolean = false> extends TestContext {
  numbers: typeof numbers;
  foo: (selection: Selected<string, IsMultiple>, select: Select<string, IsMultiple>, event?: Event) => void;
};

module(
  'Integration | Component | Ember Power Select (The opened property)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<NumbersContext>('the select can be rendered already opened by passing `@initiallyOpened={{true}}`', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} @initiallyOpened={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert.dom('.ember-power-select-dropdown').exists('Dropdown is opened');
    });

    test<NumbersContext>('[BUGFIX] the select can be rendered already opened by passing `@initiallyOpened={{true}}` AND `@selected`', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} @initiallyOpened={{true}} @selected="seven" as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert.dom('.ember-power-select-dropdown').exists('Dropdown is opened');
    });
  },
);
