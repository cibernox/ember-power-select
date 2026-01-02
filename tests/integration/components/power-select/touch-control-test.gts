import { module, test } from 'qunit';
import { setupRenderingTest } from '../../../helpers';
import {
  render,
  tap,
  triggerEvent,
  type TestContext,
} from '@ember/test-helpers';
import { numbers } from '../../../../demo-app/utils/constants';
import type { Select, Selected } from '#src/types.ts';
import PowerSelect from '#src/components/power-select.gts';
import { fn, hash } from '@ember/helper';
import HostWrapper from '../../../../demo-app/components/host-wrapper.gts';

interface NumbersContext<
  IsMultiple extends boolean = false,
> extends TestContext {
  element: HTMLElement;
  numbers: typeof numbers;
  selected: Selected<string, IsMultiple>;
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
  'Integration | Component | Ember Power Select (Touch control)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<NumbersContext>('Touch on trigger should open the dropdown', async function (assert) {
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
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await tap(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-options', getRootNode(this.element))
        .exists('The dropdown is shown');
    });

    test<NumbersContext>('Touch on option should select it', async function (assert) {
      const self = this;

      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await tap(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      const element = getRootNode(this.element).querySelectorAll(
        '.ember-power-select-option',
      )[3];
      if (element) {
        await tap(element);
      }
      assert
        .dom('.ember-power-select-selected-item', getRootNode(this.element))
        .hasText('four');
    });

    test<NumbersContext>('Touch on custom option should select it', async function (assert) {
      const self = this;

      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
              as |option|
            >
              <div class="super-fancy">{{option}}</div>
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await tap(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      const element = getRootNode(this.element).querySelectorAll(
        '.super-fancy',
      )[3];
      if (element) {
        await tap(element);
      }
      assert
        .dom('.ember-power-select-selected-item', getRootNode(this.element))
        .hasText('four');
    });

    test<NumbersContext>('Touch on clear button should deselect it', async function (assert) {
      const self = this;

      assert.expect(1);

      this.numbers = numbers;
      this.selected = 'one';
      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @allowClear={{true}}
              @onChange={{fn (mut self.selected)}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await tap(
        getRootNode(this.element).querySelector(
          '.ember-power-select-clear-btn',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-selected-item', getRootNode(this.element))
        .doesNotExist();
    });

    test<NumbersContext>('Scrolling (touchstart + touchmove + touchend) should not select the option', async function (assert) {
      const self = this;

      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @extra={{hash _isTouchDevice=true}}
              @onChange={{fn (mut self.selected)}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await tap(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      const option = getRootNode(this.element).querySelectorAll(
        '.ember-power-select-option',
      )[3];
      if (option) {
        await triggerEvent(option, 'touchstart');
        await triggerEvent(option, 'touchmove', {
          changedTouches: [{ touchType: 'direct', pageX: 0, pageY: 0 }],
        });
        await triggerEvent(option, 'touchend', {
          changedTouches: [{ touchType: 'direct', pageX: 0, pageY: 10 }],
        });
      }
      assert
        .dom('.ember-power-select-selected-item', getRootNode(this.element))
        .doesNotExist();
    });

    test<NumbersContext>('Using stylus on touch device should select the option', async function (assert) {
      const self = this;

      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @extra={{hash _isTouchDevice=true}}
              @onChange={{fn (mut self.selected)}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await tap(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      const option = getRootNode(this.element).querySelectorAll(
        '.ember-power-select-option',
      )[3];

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
      assert
        .dom('.ember-power-select-selected-item', getRootNode(this.element))
        .doesNotExist();

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
      assert
        .dom('.ember-power-select-selected-item', getRootNode(this.element))
        .hasText('four');
    });
  },
);
