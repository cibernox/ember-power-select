import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import {
  render,
  tap,
  triggerEvent,
  type TestContext,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { numbers } from 'test-app/utils/constants';
import type { Select, Selected } from 'ember-power-select/types';

interface NumbersContext<IsMultiple extends boolean = false>
  extends TestContext {
  numbers: typeof numbers;
  selected: Selected<string, IsMultiple>;
  foo: (
    selection: Selected<string, IsMultiple>,
    select: Select<string, IsMultiple>,
    event?: Event,
  ) => void;
}

module(
  'Integration | Component | Ember Power Select (Touch control)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<NumbersContext>('Touch on trigger should open the dropdown', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await tap('.ember-power-select-trigger');
      assert.dom('.ember-power-select-options').exists('The dropdown is shown');
    });

    test<NumbersContext>('Touch on option should select it', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await tap('.ember-power-select-trigger');
      const element = document.querySelectorAll(
        '.ember-power-select-option',
      )[3];
      if (element) {
        await tap(element);
      }
      assert.dom('.ember-power-select-selected-item').hasText('four');
    });

    test<NumbersContext>('Touch on custom option should select it', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        <div class="super-fancy">{{option}}</div>
      </PowerSelect>
    `);

      await tap('.ember-power-select-trigger');
      const element = document.querySelectorAll('.super-fancy')[3];
      if (element) {
        await tap(element);
      }
      assert.dom('.ember-power-select-selected-item').hasText('four');
    });

    test<NumbersContext>('Touch on clear button should deselect it', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.selected = 'one';
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @allowClear={{true}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await tap('.ember-power-select-clear-btn');
      assert.dom('.ember-power-select-selected-item').doesNotExist();
    });

    test<NumbersContext>('Scrolling (touchstart + touchmove + touchend) should not select the option', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
        <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @extra={{hash _isTouchDevice=true}} @onChange={{fn (mut this.selected)}} as |option|>
          {{option}}
        </PowerSelect>
      `);

      await tap('.ember-power-select-trigger');
      const option = document.querySelectorAll('.ember-power-select-option')[3];
      if (option) {
        await triggerEvent(option, 'touchstart');
        await triggerEvent(option, 'touchmove', {
          changedTouches: [{ touchType: 'direct', pageX: 0, pageY: 0 }],
        });
        await triggerEvent(option, 'touchend', {
          changedTouches: [{ touchType: 'direct', pageX: 0, pageY: 10 }],
        });
      }
      assert.dom('.ember-power-select-selected-item').doesNotExist();
    });

    test<NumbersContext>('Using stylus on touch device should select the option', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
        <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @extra={{hash _isTouchDevice=true}} @onChange={{fn (mut this.selected)}} as |option|>
          {{option}}
        </PowerSelect>
      `);

      await tap('.ember-power-select-trigger');
      const option = document.querySelectorAll('.ember-power-select-option')[3];

      if (option) {
        // scroll
        await triggerEvent(option, 'touchstart');
        await triggerEvent(option, 'touchmove', {
          changedTouches: [{ touchType: 'stylus', pageX: 0, pageY: 0 }],
        });
        await triggerEvent(option, 'touchend', {
          changedTouches: [{ touchType: 'stylus', pageX: 0, pageY: 10 }],
        });
      }
      assert.dom('.ember-power-select-selected-item').doesNotExist();

      if (option) {
        // tap
        await triggerEvent(option, 'touchstart');
        await triggerEvent(option, 'touchmove', {
          changedTouches: [{ touchType: 'stylus', pageX: 0, pageY: 0 }],
        });
        await triggerEvent(option, 'touchend', {
          changedTouches: [{ touchType: 'stylus', pageX: 4, pageY: 0 }],
        });
      }
      assert.dom('.ember-power-select-selected-item').hasText('four');
    });
  },
);
