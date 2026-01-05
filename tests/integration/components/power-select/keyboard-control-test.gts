import { module, test } from 'qunit';
import { setupRenderingTest } from '../../../helpers';
import { render, type TestContext } from '@ember/test-helpers';
import {
  triggerKeydown,
  clickTrigger,
  typeInSearch,
} from '#src/test-support/helpers.ts';
import {
  numbers,
  numerals,
  countries,
  countriesWithDisabled,
  groupedNumbers,
  groupedNumbersWithDisabled,
  type GroupedNumberWithDisabled,
} from '../../../../demo-app/utils/constants';
import { triggerKeyEvent, focus } from '@ember/test-helpers';
import RSVP from 'rsvp';
import type { Select, Selected } from '#src/types.ts';
import PowerSelect from '#src/components/power-select.gts';
import { fn } from '@ember/helper';
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
  onChange: (
    selection: Selected<string, IsMultiple>,
    select: Select<string, IsMultiple>,
    event?: Event,
  ) => void;
  onKeydown?: (
    select: Select<string, IsMultiple>,
    e: KeyboardEvent,
  ) => boolean | void | undefined;
  onOpen?: (
    select: Select<string, IsMultiple>,
    e: Event | undefined,
  ) => boolean | void | undefined;
}

interface CountryContext<
  IsMultiple extends boolean = false,
> extends TestContext {
  element: HTMLElement;
  // matcherFn: MatcherFn<Country>;
  countries: typeof countries;
  selected: Selected<typeof countries, IsMultiple>;
  foo: () => void;
}

interface GroupedNumbersContext<
  IsMultiple extends boolean = false,
> extends TestContext {
  element: HTMLElement;
  foo: (selected: string | undefined) => void;
  groupedNumbers: typeof groupedNumbers;
  selected: Selected<typeof groupedNumbers, IsMultiple>;
}

interface GroupedNumbersWithDisabledContext extends TestContext {
  element: HTMLElement;
  numbers: GroupedNumberWithDisabled[];
  selected: Selected<GroupedNumberWithDisabled>;
  foo: (selected: Selected<GroupedNumberWithDisabled>) => void;
}

function getRootNode(element: Element): HTMLElement {
  const shadowRoot = element.querySelector('[data-host-wrapper]')?.shadowRoot;
  if (shadowRoot) {
    return shadowRoot as unknown as HTMLElement;
  }

  return element.getRootNode() as HTMLElement;
}

module(
  'Integration | Component | Ember Power Select (Keyboard control)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<NumbersContext>('Pressing keydown highlights the next option', async function (assert) {
      const self = this;

      assert.expect(2);

      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @onChange={{self.foo}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .hasText('one');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-search-input',
        ) as HTMLElement,
        'keydown',
        40,
      );
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .hasText('two', 'The next options is highlighted now');
    });

    test<NumbersContext>('Pressing keyup highlights the previous option', async function (assert) {
      const self = this;

      assert.expect(2);

      this.numbers = numbers;

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected="three"
              @onChange={{fn (mut self.selected)}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .hasText('three');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-search-input',
        ) as HTMLElement,
        'keydown',
        38,
      );
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .hasText('two', 'The previous options is highlighted now');
    });

    test<NumbersContext>("When the last option is highlighted, pressing keydown doesn't change the highlighted", async function (assert) {
      const self = this;

      assert.expect(2);

      this.numbers = numbers;
      this.selected = numbers[numbers.length - 1];

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .hasText('twenty');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-search-input',
        ) as HTMLElement,
        'keydown',
        40,
      );
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .hasText('twenty', 'The last option is still the highlighted one');
    });

    test<NumbersContext>("When the first option is highlighted, pressing keyup doesn't change the highlighted", async function (assert) {
      const self = this;

      assert.expect(2);

      this.numbers = numbers;
      this.selected = numbers[0];

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .hasText('one');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-search-input',
        ) as HTMLElement,
        'keydown',
        38,
      );
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .hasText('one', 'The first option is still the highlighted one');
    });

    test<NumbersContext>('The arrow keys also scroll the list if the new highlighted element if it is outside of the viewport of the list', async function (assert) {
      const self = this;

      assert.expect(4);

      this.numbers = numbers;

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected="seven"
              @onChange={{fn (mut self.selected)}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .hasText('seven');
      assert.strictEqual(
        getRootNode(this.element).querySelector('.ember-power-select-options')
          ?.scrollTop ?? '',
        0,
        'The list is not scrolled',
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-search-input',
        ) as HTMLElement,
        'keydown',
        40,
      );
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .hasText('eight', 'The next option is highlighted now');
      assert.ok(
        (getRootNode(this.element).querySelector('.ember-power-select-options')
          ?.scrollTop ?? 0) > 0,
        'The list has scrolled',
      );
    });

    test<NumbersContext>('Pressing ENTER selects the highlighted element, closes the dropdown and focuses the trigger', async function (assert) {
      const self = this;

      assert.expect(5);

      this.numbers = numbers;
      this.onChange = (val, dropdown) => {
        assert.strictEqual(
          val,
          'two',
          'The onchange action is triggered with the selected value',
        );
        this.set('selected', val);
        assert.ok(
          dropdown.actions.close,
          'The action receives the dropdown as second argument',
        );
      };

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{self.onChange}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-search-input',
        ) as HTMLElement,
        'keydown',
        40,
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-search-input',
        ) as HTMLElement,
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('two', 'The highlighted element was selected');
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The dropdown is closed');
      assert.ok(
        (getRootNode(this.element) as unknown as ShadowRoot).activeElement ===
          getRootNode(this.element).querySelector(
            '.ember-power-select-trigger',
          ),
        'The trigger is focused',
      );
    });

    test<NumbersContext>('Pressing ENTER on a single select with search disabled selects the highlighted element, closes the dropdown and focuses the trigger', async function (assert) {
      const self = this;

      assert.expect(5);

      this.numbers = numbers;
      this.onChange = (val, dropdown) => {
        assert.strictEqual(
          val,
          'two',
          'The onchange action is triggered with the selected value',
        );
        this.set('selected', val);
        assert.ok(
          dropdown.actions.close,
          'The action receives the dropdown as second argument',
        );
      };

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{self.onChange}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        40,
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('two', 'The highlighted element was selected');
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The dropdown is closed');
      assert.ok(
        (getRootNode(this.element) as unknown as ShadowRoot).activeElement ===
          getRootNode(this.element).querySelector(
            '.ember-power-select-trigger',
          ),
        'The trigger is focused',
      );
    });

    test<NumbersContext>('Pressing ENTER when there is no highlighted element, closes the dropdown and focuses the trigger without calling the onchange function', async function (assert) {
      const self = this;

      assert.expect(4);
      this.numbers = numbers;
      this.selected = 'two';
      this.onChange = () => {
        assert.ok(false, 'The handle change should not be called');
      };
      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{self.onChange}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      await typeInSearch('', 'asjdnah', getRootNode(this.element));
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('two', 'Two is selected');
      assert
        .dom('.ember-power-select-option', getRootNode(this.element))
        .hasText('No results found');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-search-input',
        ) as HTMLElement,
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The dropdown is closed');
      assert.ok(
        (getRootNode(this.element) as unknown as ShadowRoot).activeElement ===
          getRootNode(this.element).querySelector(
            '.ember-power-select-trigger',
          ),
        'The trigger is focused',
      );
    });

    test<NumbersContext>('Pressing SPACE on a select without a searchbox selects the highlighted element, closes the dropdown and focuses the trigger without scrolling the page', async function (assert) {
      const self = this;

      assert.expect(6);

      this.numbers = numbers;
      this.onChange = (val, dropdown, e) => {
        assert.strictEqual(
          val,
          'two',
          'The onchange action is triggered with the selected value',
        );
        this.set('selected', val);
        assert.ok(
          e?.defaultPrevented,
          'The event has been defaultPrevented to avoid page scroll',
        );
        assert.ok(
          dropdown.actions.close,
          'The action receives the dropdown as second argument',
        );
      };

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{self.onChange}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        40,
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        32,
      ); // Space
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('two', 'The highlighted element was selected');
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The dropdown is closed');
      assert.ok(
        (getRootNode(this.element) as unknown as ShadowRoot).activeElement ===
          getRootNode(this.element).querySelector(
            '.ember-power-select-trigger',
          ),
        'The trigger is focused',
      );
    });

    test<NumbersContext>('Pressing TAB closes the select WITHOUT selecting the highlighted element and focuses the trigger', async function (assert) {
      const self = this;

      assert.expect(3);

      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @onChange={{self.foo}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-search-input',
        ) as HTMLElement,
        'keydown',
        40,
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-search-input',
        ) as HTMLElement,
        'keydown',
        9,
      );
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('', "The highlighted element wasn't selected");
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The dropdown is closed');
      assert.ok(
        (getRootNode(this.element) as unknown as ShadowRoot).activeElement ===
          getRootNode(this.element).querySelector(
            '.ember-power-select-trigger',
          ),
        'The trigger is focused',
      );
    });

    test<NumbersContext>('The component is focusable using the TAB key as any other kind of input', async function (assert) {
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
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasAttribute('tabindex', '0', 'The trigger is reachable with TAB');
    });

    test<NumbersContext>('If the component is focused, pressing ENTER toggles it', async function (assert) {
      const self = this;

      assert.expect(3);

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

      await focus(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The select is closed');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is opened');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The select is closed again');
    });

    test<NumbersContext>('If the single component is focused and has no search, pressing SPACE toggles it', async function (assert) {
      const self = this;

      assert.expect(3);

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

      await focus(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The select is closed');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        32,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is opened');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        32,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The select is closed again');
    });

    test<NumbersContext>('If the single component is focused, pressing KEYDOWN opens it', async function (assert) {
      const self = this;

      assert.expect(2);

      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @onChange={{self.foo}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await focus(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The select is closed');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        40,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is opened');
    });

    test<NumbersContext>('If the single component is focused, pressing KEYUP opens it', async function (assert) {
      const self = this;

      assert.expect(2);

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

      await focus(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The select is closed');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        38,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is opened');
    });

    test<NumbersContext>('Pressing ESC while the component is opened closes it and focuses the trigger', async function (assert) {
      const self = this;

      assert.expect(3);

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

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is opened');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        27,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The select is closed');
      assert.ok(
        (getRootNode(this.element) as unknown as ShadowRoot).activeElement ===
          getRootNode(this.element).querySelector(
            '.ember-power-select-trigger',
          ),
        'The trigger is focused',
      );
    });

    test<NumbersContext>('In single-mode, when the user presses a key being the search input focused the passes `@onKeydown` action is invoked with the public API and the event', async function (assert) {
      const self = this;

      assert.expect(9);

      this.numbers = numbers;
      this.selected = undefined;
      this.onKeydown = (select, e) => {
        assert.ok(
          Object.prototype.hasOwnProperty.call(select, 'isOpen'),
          'The yieded object has the `isOpen` key',
        );
        assert.ok(
          select.actions.open,
          'The yieded object has an `actions.open` key',
        );
        assert.ok(
          select.actions.close,
          'The yieded object has an `actions.close` key',
        );
        assert.ok(
          select.actions.select,
          'The yieded object has an `actions.select` key',
        );
        assert.ok(
          select.actions.highlight,
          'The yieded object has an `actions.highlight` key',
        );
        assert.ok(
          select.actions.search,
          'The yieded object has an `actions.search` key',
        );
        assert.strictEqual(
          e.keyCode,
          13,
          'The event is received as second argument',
        );
      };
      this.foo = () => {};

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{self.foo}}
              @onKeydown={{self.onKeydown}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is opened');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-search-input',
        ) as HTMLElement,
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The select is closed');
    });

    test<NumbersContext>('In single-mode, when the user presses SPACE on the searchbox, the highlighted option is not selected, and that space is part of the search', async function (assert) {
      const self = this;

      assert.expect(10);

      this.numbers = numbers;
      this.selected = undefined;
      this.onKeydown = (select, e) => {
        assert.ok(
          Object.prototype.hasOwnProperty.call(select, 'isOpen'),
          'The yieded object has the `isOpen` key',
        );
        assert.ok(
          select.actions.open,
          'The yieded object has an `actions.open` key',
        );
        assert.ok(
          select.actions.close,
          'The yieded object has an `actions.close` key',
        );
        assert.ok(
          select.actions.select,
          'The yieded object has an `actions.select` key',
        );
        assert.ok(
          select.actions.highlight,
          'The yieded object has an `actions.highlight` key',
        );
        assert.ok(
          select.actions.search,
          'The yieded object has an `actions.search` key',
        );
        assert.strictEqual(
          e.keyCode,
          32,
          'The event is received as second argument',
        );
      };
      this.foo = () => {};

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{self.foo}}
              @onKeydown={{self.onKeydown}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is opened');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-search-input',
        ) as HTMLElement,
        'keydown',
        32,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is still opened');
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('', 'Nothing was selected');
    });

    test<
      NumbersContext<true>
    >('In multiple-mode, when the user presses SPACE on the searchbox, the highlighted option is not selected, and that space is part of the search', async function (assert) {
      const self = this;

      assert.expect(10);

      this.numbers = numbers;
      this.selected = [];
      this.onKeydown = (select, e) => {
        assert.ok(
          Object.prototype.hasOwnProperty.call(select, 'isOpen'),
          'The yieded object has the `isOpen` key',
        );
        assert.ok(
          select.actions.open,
          'The yieded object has an `actions.open` key',
        );
        assert.ok(
          select.actions.close,
          'The yieded object has an `actions.close` key',
        );
        assert.ok(
          select.actions.select,
          'The yieded object has an `actions.select` key',
        );
        assert.ok(
          select.actions.highlight,
          'The yieded object has an `actions.highlight` key',
        );
        assert.ok(
          select.actions.search,
          'The yieded object has an `actions.search` key',
        );
        assert.strictEqual(
          e.keyCode,
          32,
          'The event is received as second argument',
        );
      };
      this.foo = () => {};

      await render<NumbersContext<true>>(
        <template>
          <HostWrapper>
            <PowerSelect
              @multiple={{true}}
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{self.foo}}
              @onKeydown={{self.onKeydown}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is opened');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger-multiple-input',
        ) as HTMLElement,
        'keydown',
        32,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is still opened');
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('', 'Nothing was selected');
    });

    test<NumbersContext>('in single-mode if the users returns false in the `@onKeydown` action it prevents the component to do the usual thing', async function (assert) {
      const self = this;

      assert.expect(2);

      this.numbers = numbers;
      this.selected = undefined;
      this.onKeydown = () => {
        return false;
      };
      this.foo = () => {};

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{self.foo}}
              @onKeydown={{self.onKeydown}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is opened');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-search-input',
        ) as HTMLElement,
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is still opened');
    });

    test<
      NumbersContext<true>
    >('In multiple-mode, when the user presses a key being the search input focused the passes `@onKeydown` action is invoked with the public API and the event', async function (assert) {
      const self = this;

      assert.expect(9);

      this.numbers = numbers;
      this.selected = [];
      this.onKeydown = (select, e) => {
        assert.ok(
          Object.prototype.hasOwnProperty.call(select, 'isOpen'),
          'The yieded object has the `isOpen` key',
        );
        assert.ok(
          select.actions.open,
          'The yieded object has an `actions.open` key',
        );
        assert.ok(
          select.actions.close,
          'The yieded object has an `actions.close` key',
        );
        assert.ok(
          select.actions.select,
          'The yieded object has an `actions.select` key',
        );
        assert.ok(
          select.actions.highlight,
          'The yieded object has an `actions.highlight` key',
        );
        assert.ok(
          select.actions.search,
          'The yieded object has an `actions.search` key',
        );
        assert.strictEqual(
          e.keyCode,
          13,
          'The event is received as second argument',
        );
      };
      this.foo = () => {};

      await render<NumbersContext<true>>(
        <template>
          <HostWrapper>
            <PowerSelect
              @multiple={{true}}
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{self.foo}}
              @onKeydown={{self.onKeydown}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is opened');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger-multiple-input',
        ) as HTMLElement,
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The select is closed');
    });

    test<
      NumbersContext<true>
    >('in multiple-mode if the users returns false in the `@onKeydown` action it prevents the component to do the usual thing', async function (assert) {
      const self = this;

      assert.expect(2);

      this.numbers = numbers;
      this.selected = [];
      this.onKeydown = () => false;
      this.foo = () => {};

      await render<NumbersContext<true>>(
        <template>
          <HostWrapper>
            <PowerSelect
              @multiple={{true}}
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{self.foo}}
              @onKeydown={{self.onKeydown}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is opened');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger-multiple-input',
        ) as HTMLElement,
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is still opened');
    });

    test<NumbersContext>('Typing on a closed single select selects the value that matches the string typed so far', async function (assert) {
      const self = this;

      assert.expect(3);

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

      await focus(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The dropdown is closed');

      void triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        78,
      ); // n
      void triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        73,
      ); // i
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        78,
      ); // n
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('nine', '"nine" has been selected');
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The dropdown is still closed');
    });

    test<NumbersContext>('Typing with modifier keys on a closed single select does not select the value that matches the string typed so far', async function (assert) {
      const self = this;

      assert.expect(3);

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

      await focus(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The dropdown is closed');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        82,
        {
          ctrlKey: true,
        },
      ); // r
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .doesNotIncludeText('three', '"three" is not selected');
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The dropdown is still closed');
    });

    //
    // I'm actually not sure what multiple selects closed should do when typing on them.
    // For now they just do nothing
    //
    // test('Typing on a closed multiple select with no searchbox does nothing', function(assert) {
    // });

    test<NumbersContext>('Typing on an opened single select highlights the first value that matches the string typed so far, scrolling if needed', async function (assert) {
      const self = this;

      assert.expect(6);

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

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The dropdown is open');
      assert.strictEqual(
        getRootNode(this.element).querySelector('.ember-power-select-options')
          ?.scrollTop ?? -1,
        0,
        'The list is not scrolled',
      );
      void triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        78,
      ); // n
      void triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        73,
      ); // i
      await triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        78,
      ); // n
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('', 'nothing has been selected');
      assert
        .dom(
          '.ember-power-select-option[aria-current=true]',
          getRootNode(this.element),
        )
        .hasText('nine', 'The option containing "nine" has been highlighted');
      assert.ok(
        (getRootNode(this.element).querySelector('.ember-power-select-options')
          ?.scrollTop ?? 0) > 0,
        'The list has scrolled',
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The dropdown is still open');
    });

    test<NumbersContext>('Typing from the Numpad on an opened single select highlights the first value that matches the string typed so far, scrolling if needed', async function (assert) {
      const self = this;

      assert.expect(6);

      this.numbers = numerals;

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

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The dropdown is open');
      assert.strictEqual(
        getRootNode(this.element).querySelector('.ember-power-select-options')
          ?.scrollTop ?? -1,
        0,
        'The list is not scrolled',
      );
      await triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        56,
      ); // 8
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('', 'nothing has been selected');
      assert
        .dom(
          '.ember-power-select-option[aria-current=true]',
          getRootNode(this.element),
        )
        .hasText('853', 'The option containing "853" has been highlighted');
      assert.ok(
        (getRootNode(this.element).querySelector('.ember-power-select-options')
          ?.scrollTop ?? 0) > 0,
        'The list has scrolled',
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The dropdown is still closed');
    });

    test<
      NumbersContext<true>
    >('Typing on an opened multiple select highlights the value that matches the string typed so far, scrolling if needed', async function (assert) {
      const self = this;

      assert.expect(6);

      this.numbers = numbers;
      await render<NumbersContext<true>>(
        <template>
          <HostWrapper>
            <PowerSelect
              @multiple={{true}}
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

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The dropdown is open');
      assert.strictEqual(
        getRootNode(this.element).querySelector('.ember-power-select-options')
          ?.scrollTop ?? -1,
        0,
        'The list is not scrolled',
      );
      void triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        78,
      ); // n
      void triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        73,
      ); // i
      await triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        78,
      ); // n
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('', 'nothing has been selected');
      assert
        .dom(
          '.ember-power-select-option[aria-current=true]',
          getRootNode(this.element),
        )
        .hasText('nine', 'The option containing "nine" has been highlighted');
      assert.ok(
        (getRootNode(this.element).querySelector('.ember-power-select-options')
          ?.scrollTop ?? 0) > 0,
        'The list has scrolled',
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The dropdown is still closed');
    });

    test<NumbersContext>('The typed string gets reset after 1s idle', async function (assert) {
      const self = this;

      assert.expect(5);

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

      await focus(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The dropdown is closed');
      await triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        84,
      ); // t
      await triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        87,
      ); // w
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('two', '"two" has been selected');
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The dropdown is still closed');
      await new RSVP.Promise((resolve) => setTimeout(resolve, 1100));
      await triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        79,
      ); // o
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText(
          'one',
          '"one" has been selected, instead of "two", because the typing started over',
        );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The dropdown is still closed');
    });

    test<NumbersContext>("Type something that doesn't give you any result leaves the current selection", async function (assert) {
      const self = this;

      assert.expect(3);

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

      await focus(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('', 'nothing is selected');
      void triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        78,
      ); // n
      void triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        73,
      ); // i
      void triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        78,
      ); // n
      await triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        69,
      ); // e
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('nine', 'nine has been selected');
      await triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        87,
      ); // w
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText(
          'nine',
          'nine is still selected because "ninew" gave no results',
        );
    });

    test<CountryContext>('Typing on an opened single select highlights the value that matches the string, also when the options are complex, using the `searchField` for that', async function (assert) {
      const self = this;

      assert.expect(4);

      this.countries = countries;
      await render<CountryContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.countries}}
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
              @searchField="name"
              as |country|
            >
              {{country.name}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The dropdown is open');
      void triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        80,
      ); // p
      await triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        79,
      ); // o
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('', 'nothing has been selected');
      assert
        .dom(
          '.ember-power-select-option[aria-current=true]',
          getRootNode(this.element),
        )
        .hasText(
          'Portugal',
          'The option containing "Portugal" has been highlighted',
        );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The dropdown is still closed');
    });

    test<GroupedNumbersContext>('Typing on an opened single select containing groups highlights the value that matches the string', async function (assert) {
      const self = this;

      assert.expect(4);

      this.groupedNumbers = groupedNumbers;
      await render<GroupedNumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.groupedNumbers}}
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
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
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The dropdown is open');
      void triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        69,
      ); // e
      await triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        76,
      ); // l
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('', 'nothing has been selected');
      assert
        .dom(
          '.ember-power-select-option[aria-current=true]',
          getRootNode(this.element),
        )
        .hasText(
          'eleven',
          'The option containing "eleven" has been highlighted',
        );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The dropdown is still closed');
    });

    test<CountryContext>('Typing on an opened single select highlights skips disabled options', async function (assert) {
      const self = this;

      assert.expect(4);

      this.countries = countriesWithDisabled.map((country) =>
        Object.assign({}, country),
      );
      if (this.countries[0]) {
        this.countries[0].disabled = true;
      }
      await render<CountryContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.countries}}
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
              @searchField="name"
              as |country|
            >
              {{country.name}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The dropdown is open');
      await triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        85,
      ); // u
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('', 'nothing has been selected');
      assert
        .dom(
          '.ember-power-select-option[aria-current=true]',
          getRootNode(this.element),
        )
        .hasText(
          'United Kingdom',
          'The option containing "United Kingdom" has been highlighted',
        );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The dropdown is still closed');
    });

    test<GroupedNumbersWithDisabledContext>('Typing on an opened single select highlights skips disabled groups', async function (assert) {
      const self = this;

      assert.expect(4);

      this.numbers = groupedNumbersWithDisabled;
      await render<GroupedNumbersWithDisabledContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
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
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The dropdown is open');
      void triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        84,
      ); // t
      await triggerKeydown(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        87,
      ); // w
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('', 'nothing has been selected');
      assert
        .dom(
          '.ember-power-select-option[aria-current=true]',
          getRootNode(this.element),
        )
        .hasText(
          'twelve',
          'The option containing "United Kingdom" has been highlighted',
        );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The dropdown is still closed');
    });

    test<NumbersContext>('BUGFIX: If pressing up/down arrow on a single select open the dropdown, the event is defaultPrevented', async function (assert) {
      const self = this;

      assert.expect(2);
      const done = assert.async();

      this.numbers = numbers;
      const events: Event[] = [];
      this.onOpen = function (_, e) {
        if (e?.type === 'keydown') {
          events.push(e);
        }
      };
      this.foo = () => {};

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @onChange={{self.foo}}
              @onOpen={{self.onOpen}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        40,
      );
      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        38,
      );
      setTimeout(function () {
        assert.ok(
          events[0]?.defaultPrevented,
          'The first event was default prevented',
        );
        assert.ok(
          events[1]?.defaultPrevented,
          'The second event was default prevented',
        );
        done();
      }, 50);
    });

    test<NumbersContext>('BUGFIX: If pressing up/down arrow on a single select DOES NOT the dropdown, the event is defaultPrevented', async function (assert) {
      const self = this;

      assert.expect(2);
      const done = assert.async();

      this.numbers = numbers;
      const events: Event[] = [];
      this.onOpen = function (_, e) {
        if (e?.type === 'keydown') {
          events.push(e);
        }
        return false; // prevent the dropdown from opening
      };
      this.foo = () => {};

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @onChange={{self.foo}}
              @onOpen={{self.onOpen}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        40,
      );
      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        38,
      );

      setTimeout(function () {
        assert.notOk(
          events[0]?.defaultPrevented,
          'The first event was default prevented',
        );
        assert.notOk(
          events[1]?.defaultPrevented,
          'The second event was default prevented',
        );
        done();
      }, 50);
    });

    test<
      NumbersContext<true>
    >('BUGFIX: If pressing up/down arrow on a multiple select opens the select, the event is defaultPrevented', async function (assert) {
      const self = this;

      assert.expect(2);
      const done = assert.async();

      this.numbers = numbers;
      const events: Event[] = [];
      this.onOpen = function (_, e) {
        if (e?.type === 'keydown') {
          events.push(e);
        }
      };
      this.foo = () => {};

      await render<NumbersContext<true>>(
        <template>
          <HostWrapper>
            <PowerSelect
              @multiple={{true}}
              @options={{self.numbers}}
              @onChange={{self.foo}}
              @onOpen={{self.onOpen}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        40,
      );
      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        38,
      );
      setTimeout(function () {
        assert.ok(
          events[0]?.defaultPrevented,
          'The first event was default prevented',
        );
        assert.ok(
          events[1]?.defaultPrevented,
          'The second event was default prevented',
        );
        done();
      }, 50);
    });

    test<
      NumbersContext<true>
    >('BUGFIX: If pressing up/down arrow on a multiple select DOES NOT open the select, the event is defaultPrevented', async function (assert) {
      const self = this;

      assert.expect(2);
      const done = assert.async();

      this.numbers = numbers;
      const events: Event[] = [];
      this.onOpen = function (_, e) {
        if (e?.type === 'keydown') {
          events.push(e);
        }
        return false; // prevent the dropdown from opening
      };
      this.foo = () => {};

      await render<NumbersContext<true>>(
        <template>
          <HostWrapper>
            <PowerSelect
              @multiple={{true}}
              @options={{self.numbers}}
              @onChange={{self.foo}}
              @onOpen={{self.onOpen}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        40,
      );
      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        38,
      );
      setTimeout(function () {
        assert.notOk(
          events[0]?.defaultPrevented,
          'The first event was default prevented',
        );
        assert.notOk(
          events[1]?.defaultPrevented,
          'The second event was default prevented',
        );
        done();
      }, 50);
    });

    test<
      NumbersContext<true>
    >('BUGFIX: when using ENTER to select an option in multiple select, the next ARROWDOWN should select the option after it', async function (assert) {
      const self = this;

      this.numbers = numbers;
      this.selected = [];

      await render<NumbersContext<true>>(
        <template>
          <HostWrapper>
            <PowerSelect
              @multiple={{true}}
              @options={{self.numbers}}
              @closeOnSelect={{false}}
              @onChange={{fn (mut self.selected)}}
              @selected={{self.selected}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await focus(
        getRootNode(this.element).querySelector(
          '.ember-power-select-multiple-trigger',
        ) as HTMLElement,
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-multiple-trigger',
        ) as HTMLElement,
        'keydown',
        'ArrowDown',
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-multiple-trigger',
        ) as HTMLElement,
        'keydown',
        'ArrowDown',
      );
      // Select second option (data-index=1)
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-multiple-trigger',
        ) as HTMLElement,
        'keydown',
        'Enter',
      );
      assert
        .dom(
          '[data-option-index="1"][aria-current="true"]',
          getRootNode(this.element),
        )
        .exists();
      // Next ArrowDown should highlight (data-index=2)
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-multiple-trigger',
        ) as HTMLElement,
        'keydown',
        'ArrowDown',
      );
      assert
        .dom(
          '[data-option-index="2"][aria-current="true"]',
          getRootNode(this.element),
        )
        .exists();
    });

    test<
      NumbersContext<true>
    >('BUGFIX: when pressing enter multiple times on the same selected element in a multiple select', async function (assert) {
      const self = this;

      this.numbers = numbers;
      this.selected = [];
      this.onChange = (selected) => {
        this.set('selected', selected);
      };

      await render<NumbersContext<true>>(
        <template>
          <HostWrapper>
            <PowerSelect
              @multiple={{true}}
              @options={{self.numbers}}
              @closeOnSelect={{false}}
              @onChange={{self.onChange}}
              @selected={{self.selected}}
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await focus(
        getRootNode(this.element).querySelector(
          '.ember-power-select-multiple-trigger',
        ) as HTMLElement,
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-multiple-trigger',
        ) as HTMLElement,
        'keydown',
        'ArrowDown',
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-multiple-trigger',
        ) as HTMLElement,
        'keydown',
        'Enter',
      );
      // select first
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-multiple-trigger',
        ) as HTMLElement,
        'keydown',
        'ArrowDown',
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-multiple-trigger',
        ) as HTMLElement,
        'keydown',
        'ArrowDown',
      );
      // Select second option
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-multiple-trigger',
        ) as HTMLElement,
        'keydown',
        'Enter',
      );
      assert.strictEqual(this.selected?.length ?? 0, 2);
      // Select second option 2 more times with Enter keydown
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-multiple-trigger',
        ) as HTMLElement,
        'keydown',
        'Enter',
      );
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-multiple-trigger',
        ) as HTMLElement,
        'keydown',
        'Enter',
      );

      assert.strictEqual(
        this.selected?.length ?? 0,
        2,
        'it does not add additional elements to the selected array',
      );
      assert.false(
        this.selected?.some((selection) => Array.isArray(selection)),
        'it does not add empty arrays to the selected array',
      );
    });
  },
);
