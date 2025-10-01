import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import {
  render,
  triggerEvent,
  triggerKeyEvent,
  click,
  focus,
  tap,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  clickTrigger,
  typeInSearch,
} from 'ember-power-select/test-support/helpers';
import {
  numbers,
  countriesWithDisabled,
  type Country,
} from 'test-app/utils/constants';
import type { Selected, MultipleSelected } from 'ember-power-select/types';
import type { TestContext } from '@ember/test-helpers';

interface NumbersContext extends TestContext {
  numbers: typeof numbers;
  selected: Selected<string>;
  isDisabled: boolean;
  foo: (selection: Selected<string>) => void;
}

interface NumbersMultipleContext extends TestContext {
  numbers: typeof numbers;
  selected: MultipleSelected<string>;
  shouldBeDisabled: boolean;
  onChange: (selection: MultipleSelected<string>) => void;
}

interface CountriesWithDisabledContext extends TestContext {
  countriesWithDisabled: typeof countriesWithDisabled;
  selected: Selected<Country>;
  foo: (selected: Selected<Country>) => void;
}

interface LocaleGroupedNumberContext extends TestContext {
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

module(
  'Integration | Component | Ember Power Select (Disabled)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<NumbersContext>("A disabled dropdown doesn't responds to mouse/keyboard events", async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @disabled={{true}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('aria-disabled', 'true');
      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is still closed');
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 13);
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is still closed');
    });

    test<NumbersContext>('A disabled dropdown is not focusable, and ignores the passed tabindex', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @disabled={{true}} @onChange={{this.foo}} @tabindex="123" as |option|>
        {{option}}
      </PowerSelect>
    `);
      assert
        .dom('.ember-power-select-trigger')
        .doesNotHaveAttribute(
          'tabindex',
          "The trigger has no tabindex so it can't be focused",
        );
    });

    test<CountriesWithDisabledContext>('Disabled options are not highlighted when hovered with the mouse', async function (assert) {
      assert.expect(1);

      this.countriesWithDisabled = countriesWithDisabled;
      this.foo = () => {};

      await render<CountriesWithDisabledContext>(hbs`
      <PowerSelect @options={{this.countriesWithDisabled}} @onChange={{this.foo}} as |option|>
        {{option.code}}: {{option.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      await triggerEvent(
        '.ember-power-select-option[aria-disabled="true"]',
        'mouseover',
      );
      assert
        .dom('.ember-power-select-option[aria-disabled="true"]')
        .hasAttribute(
          'aria-current',
          'false',
          "The hovered option was not highlighted because it's disabled",
        );
    });

    test<CountriesWithDisabledContext>('Disabled options are skipped when highlighting items with the keyboard', async function (assert) {
      assert.expect(1);

      this.countriesWithDisabled = countriesWithDisabled;
      this.foo = () => {};

      await render<CountriesWithDisabledContext>(hbs`
      <PowerSelect @options={{this.countriesWithDisabled}} @onChange={{this.foo}} @searchEnabled={{true}} as |option|>
        {{option.code}}: {{option.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText(
          'LV: Latvia',
          "The hovered option was not highlighted because it's disabled",
        );
    });

    test<NumbersMultipleContext>('When passed `@disabled={{true}}`, the input inside the trigger is also disabled', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersMultipleContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @disabled={{true}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute('disabled');
    });

    test<NumbersMultipleContext>('When passed `disabled=true`, the options cannot be removed', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      if (numbers[2] && numbers[4]) {
        this.selected = [numbers[2], numbers[4]];
      }

      await render<NumbersMultipleContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @disabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-multiple-remove-btn')
        .doesNotExist('There is no button to remove selected elements');
    });

    test<NumbersMultipleContext>('Multiple select: When passed `@disabled={{prop}}`, enabling and disabling that property changes the component', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      if (numbers[2] && numbers[4]) {
        this.selected = [numbers[2], numbers[4]];
      }
      this.set('shouldBeDisabled', true);

      await render<NumbersMultipleContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @disabled={{this.shouldBeDisabled}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-disabled',
          'true',
          'The trigger has `aria-disabled=true`',
        );
      this.set('shouldBeDisabled', false);
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('aria-expanded', 'false');
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .doesNotHaveAttribute('disabled');
    });

    test<CountriesWithDisabledContext>("BUGFIX: When after a search the only result is a disabled element, it isn't highlighted and cannot be selected", async function (assert) {
      assert.expect(3);
      this.countriesWithDisabled = countriesWithDisabled;

      await render<CountriesWithDisabledContext>(hbs`
     <PowerSelect @options={{this.countriesWithDisabled}} @searchField="name" @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |country|>
       {{country.name}}
     </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('Br');
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .doesNotExist('Nothing is highlighted');
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 13);
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'Nothing was selected');
    });

    test<CountriesWithDisabledContext>('BUGFIX: When after a search there is two results and the first one is a disabled element, the second one is highlighted', async function (assert) {
      assert.expect(4);
      this.countriesWithDisabled = countriesWithDisabled;

      await render<CountriesWithDisabledContext>(hbs`
     <PowerSelect @options={{this.countriesWithDisabled}} @searchField="name" @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |country|>
       {{country.name}}
     </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('o'); // Finds ["Portugal", "United Kingdom"]
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 2 }, 'There is two results');
      assert
        .dom('.ember-power-select-option[aria-disabled="true"]')
        .exists({ count: 1 }, 'One is disabled');
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .exists({ count: 1 }, 'One element is highlighted');
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText(
          'United Kingdom',
          'The first non-disabled element is highlighted',
        );
    });

    test<CountriesWithDisabledContext>('BUGFIX: When searching by pressing keys on a focused & closed select, disabled options are ignored', async function (assert) {
      assert.expect(3);
      this.countriesWithDisabled = countriesWithDisabled.map((country) =>
        Object.assign({}, country),
      );
      if (this.countriesWithDisabled[0]) {
        this.countriesWithDisabled[0].disabled = true;
      }

      await render<CountriesWithDisabledContext>(hbs`
     <PowerSelect @options={{this.countriesWithDisabled}} @searchField="name" @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |country|>
       {{country.name}}
     </PowerSelect>
    `);

      await focus('.ember-power-select-trigger');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is closed');
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 85); // u
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is still closed');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('United Kingdom', '"United Kingdom" has been selected');
    });

    test<LocaleGroupedNumberContext>('The title of a group can be marked as disabled, and it is still disabled after filtering', async function (assert) {
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
      await render<LocaleGroupedNumberContext>(hbs`
      <PowerSelect @options={{this.options}} @onChange={{this.foo}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-group[aria-disabled="true"]')
        .exists({ count: 1 }, 'one group is disabled');
      await typeInSearch('fiv');
      assert
        .dom('.ember-power-select-group[aria-disabled="true"]')
        .exists({ count: 1 }, 'one group is still disabled');
    });

    test<LocaleGroupedNumberContext>('If a group is disabled, any options inside cannot be interacted with mouse', async function (assert) {
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
      await render<LocaleGroupedNumberContext>(hbs`
      <PowerSelect @options={{this.options}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('one');
      assert
        .dom('.ember-power-select-option[aria-selected="true"]')
        .doesNotExist('No option is selected');
      await triggerEvent(
        document.querySelectorAll('.ember-power-select-option')[8] ?? '',
        'mouseover',
      );
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('one');
      await click(
        document.querySelectorAll('.ember-power-select-option')[9] ?? '',
      );
      assert
        .dom('.ember-power-select-option[aria-selected="true"]')
        .doesNotExist('Noting was selected');
    });

    test<NumbersContext>('If the value of `disabled` changes, the `disabled` property in the publicAPI matches it', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.isDisabled = false;
      this.selected = numbers[0];
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @disabled={{this.isDisabled}} @onChange={{fn (mut this.selected)}} as |option select|>
        {{if select.disabled 'disabled!' 'enabled!'}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasText(
          'enabled!',
          'The `disabled` attribute in the public API is false',
        );
      this.set('isDisabled', true);
      assert
        .dom('.ember-power-select-trigger')
        .hasText(
          'disabled!',
          'The `disabled` attribute in the public API is true',
        );
    });

    test<NumbersContext>("If a select gets disabled while it's open, it closes automatically", async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.isDisabled = false;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @disabled={{this.isDisabled}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The select is open');
      this.set('isDisabled', true);
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is now closed');
    });

    test<NumbersContext>('BUGFIX: A component can be disabled on selection', async function (assert) {
      assert.expect(2);
      this.numbers = numbers;

      await render<NumbersContext>(hbs`
     <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @disabled={{if this.selected true}} as |opt|>
       {{opt}}
     </PowerSelect>
    `);

      await clickTrigger();
      await click(document.querySelectorAll('.ember-power-select-option')[1]!);
      assert
        .dom('.ember-power-select-trigger')
        .hasText('two', 'The option is selected');
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('aria-disabled', 'true');
    });

    test<CountriesWithDisabledContext>('Disabled options cannot be selected', async function (assert) {
      assert.expect(4);
      this.countriesWithDisabled = countriesWithDisabled;

      await render<CountriesWithDisabledContext>(hbs`
     <PowerSelect @options={{this.countriesWithDisabled}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |country|>
       {{country.name}}
     </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The select is open');
      await click(document.querySelectorAll('.ember-power-select-option')[2]!);
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'Nothing is selected');
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The select is still open');
      await tap(document.querySelectorAll('.ember-power-select-option')[2]!);
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'Nothing is selected');
    });
  },
);
