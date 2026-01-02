import { module, test } from 'qunit';
import { setupRenderingTest } from '../../../helpers';
import {
  render,
  triggerEvent,
  triggerKeyEvent,
  click,
  focus,
  tap,
  settled,
} from '@ember/test-helpers';
import { clickTrigger, typeInSearch } from '#src/test-support/helpers.ts';
import {
  numbers,
  countriesWithDisabled,
  type Country,
} from '../../../../demo-app/utils/constants';
import type { Selected, MultipleSelected } from '#src/types.ts';
import type { TestContext } from '@ember/test-helpers';
import PowerSelect from '#src/components/power-select.gts';
import PowerSelectMultiple from '#src/components/power-select-multiple.gts';
import { fn } from '@ember/helper';
import HostWrapper from '../../../../demo-app/components/host-wrapper.gts';

interface NumbersContext extends TestContext {
  element: HTMLElement;
  numbers: typeof numbers;
  selected: Selected<string>;
  isDisabled: boolean;
  foo: (selection: Selected<string>) => void;
}

interface NumbersMultipleContext extends TestContext {
  element: HTMLElement;
  numbers: typeof numbers;
  selected: MultipleSelected<string>;
  shouldBeDisabled: boolean;
  onChange: (selection: MultipleSelected<string>) => void;
}

interface CountriesWithDisabledContext extends TestContext {
  element: HTMLElement;
  countriesWithDisabled: typeof countriesWithDisabled;
  selected: Selected<Country>;
  foo: (selected: Selected<Country>) => void;
}

interface LocaleGroupedNumberContext extends TestContext {
  element: HTMLElement;
  options: LocaleGroupedNumber[];
  selected: Selected<string>;
  foo: (selected: Selected<string>) => void;
}

type LocaleGroupedNumber =
  | {
      groupName: string;
      options: (
        | string
        | {
            groupName: string;
            options: string[];
            disabled?: boolean;
          }
      )[];
      disabled?: boolean;
    }
  | string;

function getRootNode(element: Element): HTMLElement {
  const shadowRoot = element.querySelector('[data-host-wrapper]')?.shadowRoot;
  if (shadowRoot) {
    return shadowRoot as unknown as HTMLElement;
  }

  return element.getRootNode() as HTMLElement;
}

module(
  'Integration | Component | Ember Power Select (Disabled)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<NumbersContext>("A disabled dropdown doesn't responds to mouse/keyboard events", async function (assert) {
      const self = this;

      assert.expect(3);

      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @disabled={{true}}
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
        .hasAttribute('aria-disabled', 'true');
      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The select is still closed');
      await triggerKeyEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The select is still closed');
    });

    test<NumbersContext>('A disabled dropdown is not focusable, and ignores the passed tabindex', async function (assert) {
      const self = this;

      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @disabled={{true}}
              @onChange={{self.foo}}
              @tabindex="123"
              as |option|
            >
              {{option}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .doesNotHaveAttribute(
          'tabindex',
          "The trigger has no tabindex so it can't be focused",
        );
    });

    test<CountriesWithDisabledContext>('Disabled options are not highlighted when hovered with the mouse', async function (assert) {
      const self = this;

      assert.expect(1);

      this.countriesWithDisabled = countriesWithDisabled;
      this.foo = () => {};

      await render<CountriesWithDisabledContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.countriesWithDisabled}}
              @onChange={{self.foo}}
              as |option|
            >
              {{option.code}}:
              {{option.name}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      await triggerEvent(
        getRootNode(this.element).querySelector(
          '.ember-power-select-option[aria-disabled="true"]',
        ) as HTMLElement,
        'mouseover',
      );
      assert
        .dom(
          '.ember-power-select-option[aria-disabled="true"]',
          getRootNode(this.element),
        )
        .hasAttribute(
          'aria-current',
          'false',
          "The hovered option was not highlighted because it's disabled",
        );
    });

    test<CountriesWithDisabledContext>('Disabled options are skipped when highlighting items with the keyboard', async function (assert) {
      const self = this;

      assert.expect(1);

      this.countriesWithDisabled = countriesWithDisabled;
      this.foo = () => {};

      await render<CountriesWithDisabledContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.countriesWithDisabled}}
              @onChange={{self.foo}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option.code}}:
              {{option.name}}
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
        40,
      );
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .hasText(
          'LV: Latvia',
          "The hovered option was not highlighted because it's disabled",
        );
    });

    test<NumbersMultipleContext>('When passed `@disabled={{true}}`, the input inside the trigger is also disabled', async function (assert) {
      const self = this;

      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersMultipleContext>(
        <template>
          <HostWrapper>
            <PowerSelectMultiple
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
              @disabled={{true}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelectMultiple>
          </HostWrapper>
        </template>,
      );

      assert
        .dom(
          '.ember-power-select-trigger-multiple-input',
          getRootNode(this.element),
        )
        .hasAttribute('disabled');
    });

    test<NumbersMultipleContext>('When passed `disabled=true`, the options cannot be removed', async function (assert) {
      const self = this;

      assert.expect(1);

      this.numbers = numbers;
      if (numbers[2] && numbers[4]) {
        this.selected = [numbers[2], numbers[4]];
      }

      await render<NumbersMultipleContext>(
        <template>
          <HostWrapper>
            <PowerSelectMultiple
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
              @disabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelectMultiple>
          </HostWrapper>
        </template>,
      );

      assert
        .dom(
          '.ember-power-select-multiple-remove-btn',
          getRootNode(this.element),
        )
        .doesNotExist('There is no button to remove selected elements');
    });

    test<NumbersMultipleContext>('Multiple select: When passed `@disabled={{prop}}`, enabling and disabling that property changes the component', async function (assert) {
      const self = this;

      assert.expect(3);

      this.numbers = numbers;
      if (numbers[2] && numbers[4]) {
        this.selected = [numbers[2], numbers[4]];
      }
      this.set('shouldBeDisabled', true);

      await render<NumbersMultipleContext>(
        <template>
          <HostWrapper>
            <PowerSelectMultiple
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
              @disabled={{self.shouldBeDisabled}}
              @searchEnabled={{true}}
              as |option|
            >
              {{option}}
            </PowerSelectMultiple>
          </HostWrapper>
        </template>,
      );

      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasAttribute(
          'aria-disabled',
          'true',
          'The trigger has `aria-disabled=true`',
        );
      this.set('shouldBeDisabled', false);
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasAttribute('aria-expanded', 'false');
      assert
        .dom(
          '.ember-power-select-trigger-multiple-input',
          getRootNode(this.element),
        )
        .doesNotHaveAttribute('disabled');
    });

    test<CountriesWithDisabledContext>("BUGFIX: When after a search the only result is a disabled element, it isn't highlighted and cannot be selected", async function (assert) {
      const self = this;

      assert.expect(3);
      this.countriesWithDisabled = countriesWithDisabled;

      await render<CountriesWithDisabledContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.countriesWithDisabled}}
              @searchField="name"
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
              @searchEnabled={{true}}
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
      await typeInSearch('', 'Br', getRootNode(this.element));
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .doesNotExist('Nothing is highlighted');
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
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('', 'Nothing was selected');
    });

    test<CountriesWithDisabledContext>('BUGFIX: When after a search there is two results and the first one is a disabled element, the second one is highlighted', async function (assert) {
      const self = this;

      assert.expect(4);
      this.countriesWithDisabled = countriesWithDisabled;

      await render<CountriesWithDisabledContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.countriesWithDisabled}}
              @searchField="name"
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
              @searchEnabled={{true}}
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
      await typeInSearch('', 'o', getRootNode(this.element)); // Finds ["Portugal", "United Kingdom"]
      assert
        .dom('.ember-power-select-option', getRootNode(this.element))
        .exists({ count: 2 }, 'There is two results');
      assert
        .dom(
          '.ember-power-select-option[aria-disabled="true"]',
          getRootNode(this.element),
        )
        .exists({ count: 1 }, 'One is disabled');
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .exists({ count: 1 }, 'One element is highlighted');
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .hasText(
          'United Kingdom',
          'The first non-disabled element is highlighted',
        );
    });

    test<CountriesWithDisabledContext>('BUGFIX: When searching by pressing keys on a focused & closed select, disabled options are ignored', async function (assert) {
      const self = this;

      assert.expect(3);
      this.countriesWithDisabled = countriesWithDisabled.map((country) =>
        Object.assign({}, country),
      );
      if (this.countriesWithDisabled[0]) {
        this.countriesWithDisabled[0].disabled = true;
      }

      await render<CountriesWithDisabledContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.countriesWithDisabled}}
              @searchField="name"
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
              as |country|
            >
              {{country.name}}
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
        85,
      ); // u
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The dropdown is still closed');
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('United Kingdom', '"United Kingdom" has been selected');
    });

    test<LocaleGroupedNumberContext>('The title of a group can be marked as disabled, and it is still disabled after filtering', async function (assert) {
      const self = this;

      assert.expect(2);

      const options: LocaleGroupedNumber[] = [
        { groupName: 'Smalls', options: ['one', 'two', 'three'] },
        {
          groupName: 'Mediums',
          disabled: true,
          options: ['four', 'five', 'six'],
        },
        {
          groupName: 'Bigs',
          options: [
            { groupName: 'Fairly big', options: ['seven', 'eight', 'nine'] },
            { groupName: 'Really big', options: ['ten', 'eleven', 'twelve'] },
            'thirteen',
          ],
        },
        'one hundred',
        'one thousand',
      ];

      this.options = options;
      this.foo = () => {};
      await render<LocaleGroupedNumberContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.options}}
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
          '.ember-power-select-group[aria-disabled="true"]',
          getRootNode(this.element),
        )
        .exists({ count: 1 }, 'one group is disabled');
      await typeInSearch('', 'fiv', getRootNode(this.element));
      assert
        .dom(
          '.ember-power-select-group[aria-disabled="true"]',
          getRootNode(this.element),
        )
        .exists({ count: 1 }, 'one group is still disabled');
    });

    test<LocaleGroupedNumberContext>('If a group is disabled, any options inside cannot be interacted with mouse', async function (assert) {
      const self = this;

      assert.expect(4);

      const options: LocaleGroupedNumber[] = [
        { groupName: 'Smalls', options: ['one', 'two', 'three'] },
        { groupName: 'Mediums', options: ['four', 'five', 'six'] },
        {
          groupName: 'Bigs',
          disabled: true,
          options: [
            { groupName: 'Fairly big', options: ['seven', 'eight', 'nine'] },
            { groupName: 'Really big', options: ['ten', 'eleven', 'twelve'] },
            'thirteen',
          ],
        },
        'one hundred',
        'one thousand',
      ];

      this.options = options;
      await render<LocaleGroupedNumberContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.options}}
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
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .hasText('one');
      assert
        .dom(
          '.ember-power-select-option[aria-selected="true"]',
          getRootNode(this.element),
        )
        .doesNotExist('No option is selected');
      await triggerEvent(
        getRootNode(this.element).querySelectorAll(
          '.ember-power-select-option',
        )[8] ?? '',
        'mouseover',
      );
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"]',
          getRootNode(this.element),
        )
        .hasText('one');
      await click(
        getRootNode(this.element).querySelectorAll(
          '.ember-power-select-option',
        )[9] ?? '',
      );
      assert
        .dom(
          '.ember-power-select-option[aria-selected="true"]',
          getRootNode(this.element),
        )
        .doesNotExist('Noting was selected');
    });

    test<NumbersContext>('If the value of `disabled` changes, the `disabled` property in the publicAPI matches it', async function (assert) {
      const self = this;

      assert.expect(2);

      this.numbers = numbers;
      this.isDisabled = false;
      this.selected = numbers[0];
      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @disabled={{self.isDisabled}}
              @onChange={{fn (mut self.selected)}}
              as |option select|
            >
              {{if select.disabled "disabled!" "enabled!"}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText(
          'enabled!',
          'The `disabled` attribute in the public API is false',
        );
      this.set('isDisabled', true);
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText(
          'disabled!',
          'The `disabled` attribute in the public API is true',
        );
    });

    test<NumbersContext>("If a select gets disabled while it's open, it closes automatically", async function (assert) {
      const self = this;

      assert.expect(2);

      this.numbers = numbers;
      this.isDisabled = false;
      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @disabled={{self.isDisabled}}
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
        .exists('The select is open');
      this.set('isDisabled', true);
      await settled();
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .doesNotExist('The select is now closed');
    });

    test<NumbersContext>('BUGFIX: A component can be disabled on selection', async function (assert) {
      const self = this;

      assert.expect(2);
      this.numbers = numbers;

      await render<NumbersContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.numbers}}
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
              @disabled={{if self.selected true}}
              as |opt|
            >
              {{opt}}
            </PowerSelect>
          </HostWrapper>
        </template>,
      );

      await clickTrigger(
        getRootNode(this.element).querySelector(
          '.ember-power-select-trigger',
        ) as HTMLElement,
      );
      await click(
        getRootNode(this.element).querySelectorAll(
          '.ember-power-select-option',
        )[1]!,
      );
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('two', 'The option is selected');
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasAttribute('aria-disabled', 'true');
    });

    test<CountriesWithDisabledContext>('Disabled options cannot be selected', async function (assert) {
      const self = this;

      assert.expect(4);
      this.countriesWithDisabled = countriesWithDisabled;

      await render<CountriesWithDisabledContext>(
        <template>
          <HostWrapper>
            <PowerSelect
              @options={{self.countriesWithDisabled}}
              @selected={{self.selected}}
              @onChange={{fn (mut self.selected)}}
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
        .exists('The select is open');
      await click(
        getRootNode(this.element).querySelectorAll(
          '.ember-power-select-option',
        )[2]!,
      );
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('', 'Nothing is selected');
      assert
        .dom('.ember-power-select-dropdown', getRootNode(this.element))
        .exists('The select is still open');
      await tap(
        getRootNode(this.element).querySelectorAll(
          '.ember-power-select-option',
        )[2]!,
      );
      assert
        .dom('.ember-power-select-trigger', getRootNode(this.element))
        .hasText('', 'Nothing is selected');
    });
  },
);
