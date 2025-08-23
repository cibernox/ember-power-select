import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { render, triggerEvent, triggerKeyEvent, type TestContext } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { numbers, groupedNumbers, countries, countriesWithDisabled, type Country } from '../constants';
import {
  clickTrigger,
  findContains,
} from 'ember-power-select/test-support/helpers';
import type { Selected } from 'ember-power-select/components/power-select';
import type { Selected as MultipleSelected } from 'ember-power-select/components/power-select-multiple';

interface GroupedNumbersContext extends TestContext {
  foo: (selected: string | null | undefined) => void;
  groupedNumbers: typeof groupedNumbers
}

interface GroupedNumbersMultipleContext extends TestContext {
  foo: (selected: string[] | null | undefined) => void;
  groupedNumbers: typeof groupedNumbers
}

interface NumbersContext extends TestContext {
  numbers: typeof numbers
  selected: Selected<string>;
  role?: string;
  onChange: (selection: Selected<string>) => void;
}

interface NumbersMultipleContext extends TestContext {
  numbers: typeof numbers;
  selected: MultipleSelected<string>;
  onChange: (selection: MultipleSelected<string>) => void;
}

interface CountriesContext extends TestContext {
  countries: typeof countries;
  role: string;
  country: Selected<Country>;
  foo: (selected: Selected<Country>) => void;
}

interface CountriesWithDisabledContext extends TestContext {
  countriesWithDisabled: typeof countriesWithDisabled
  foo: (selected: Selected<Country>) => void;
}

interface CountriesWithDisabledMultipleContext extends TestContext {
  countriesWithDisabled: typeof countriesWithDisabled
  foo: (selected: MultipleSelected<Country>) => void;
}

module(
  'Integration | Component | Ember Power Select (Accessibility)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<GroupedNumbersContext>('Single-select: The top-level options list have `role=listbox` and nested lists have `role=presentation`', async function (assert) {
      assert.expect(6);

      this.groupedNumbers = groupedNumbers;
      this.foo = () => {};
      await render<GroupedNumbersContext>(hbs`
      <PowerSelect @options={{this.groupedNumbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown > .ember-power-select-options')
        .hasAttribute(
          'role',
          'listbox',
          'The top-level list has `role=listbox`',
        );
      const nestedOptionList = document.querySelectorAll(
        '.ember-power-select-options .ember-power-select-options',
      );
      [].slice
        .call(nestedOptionList)
        .forEach((e) => assert.dom(e).hasAttribute('role', 'presentation'));
    });

    test<GroupedNumbersMultipleContext>('Multiple-select: The top-level options list have `role=listbox` and nested lists have `role=presentation`', async function (assert) {
      assert.expect(6);

      this.groupedNumbers = groupedNumbers;
      this.foo = () => {};
      await render<GroupedNumbersMultipleContext>(hbs`
      <PowerSelectMultiple @options={{this.groupedNumbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown > .ember-power-select-options')
        .hasAttribute(
          'role',
          'listbox',
          'The top-level list has `role=listbox`',
        );
      const nestedOptionList = document.querySelectorAll(
        '.ember-power-select-options .ember-power-select-options',
      );
      [].slice
        .call(nestedOptionList)
        .forEach((e) => assert.dom(e).hasAttribute('role', 'presentation'));
    });

    test<GroupedNumbersContext>('Single-select: All options have `role=option`', async function (assert) {
      assert.expect(15);

      this.groupedNumbers = groupedNumbers;
      this.foo = () => {};
      await render<GroupedNumbersContext>(hbs`
      <PowerSelect @options={{this.groupedNumbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();

      [].slice
        .call(document.querySelectorAll('.ember-power-select-option'))
        .forEach((e) => assert.dom(e).hasAttribute('role', 'option'));
    });

    test<GroupedNumbersContext>('Multiple-select: All options have `role=option`', async function (assert) {
      assert.expect(15);

      this.groupedNumbers = groupedNumbers;
      this.foo = () => {};
      await render<GroupedNumbersContext>(hbs`
      <PowerSelect @options={{this.groupedNumbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();

      [].slice
        .call(document.querySelectorAll('.ember-power-select-option'))
        .forEach((e) => assert.dom(e).hasAttribute('role', 'option'));
    });

    test<NumbersContext>('Single-select: The selected option has `aria-selected=true` and the rest `aria-selected=false`', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.selected = 'two';
      this.onChange = (selection: Selected<string>) => this.selected = selection;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.onChange}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom(findContains('.ember-power-select-option', 'two'))
        .hasAttribute(
          'aria-selected',
          'true',
          'the selected option has aria-selected=true',
        );
      assert
        .dom('.ember-power-select-option[aria-selected="false"]')
        .exists(
          { count: numbers.length - 1 },
          'All other options have aria-selected=false',
        );
    });

    test<NumbersMultipleContext>('Multiple-select: The selected options have `aria-selected=true` and the rest `aria-selected=false`', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.selected = ['two', 'four'];
      this.onChange = (selection: MultipleSelected<string>) => this.selected = selection;
      await render<NumbersMultipleContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.onChange}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom(findContains('.ember-power-select-option', 'two'))
        .hasAttribute(
          'aria-selected',
          'true',
          'the first selected option has aria-selected=true',
        );
      assert
        .dom(findContains('.ember-power-select-option', 'four'))
        .hasAttribute(
          'aria-selected',
          'true',
          'the second selected option has aria-selected=true',
        );
      assert
        .dom('.ember-power-select-option[aria-selected="false"]')
        .exists(
          { count: numbers.length - 2 },
          'All other options have aria-selected=false',
        );
    });

    test<NumbersContext>('Single-select: The highlighted option has `aria-current=true` and the rest not have `aria-current`', async function (assert) {
      assert.expect(4);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom(findContains('.ember-power-select-option', 'one'))
        .hasAttribute(
          'aria-current',
          'true',
          'the highlighted option has aria-current=true',
        );
      assert
        .dom('.ember-power-select-option[aria-current="false"]')
        .exists(
          { count: numbers.length - 1 },
          'All other options have aria-current=false',
        );
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
      assert
        .dom(findContains('.ember-power-select-option', 'one'))
        .hasAttribute(
          'aria-current',
          'false',
          'the first option has now aria-current=false',
        );
      assert
        .dom(findContains('.ember-power-select-option', 'two'))
        .hasAttribute(
          'aria-current',
          'true',
          'the second option has now aria-current=false',
        );
    });

    test<NumbersContext>('Multiple-select: The highlighted option has `aria-current=true` and the rest `aria-current=false`', async function (assert) {
      assert.expect(4);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom(findContains('.ember-power-select-option', 'one'))
        .hasAttribute(
          'aria-current',
          'true',
          'the highlighted option has aria-current=true',
        );
      assert
        .dom('.ember-power-select-option[aria-current="false"]')
        .exists(
          { count: numbers.length - 1 },
          'All other options have aria-current=false',
        );
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
      assert
        .dom(findContains('.ember-power-select-option', 'one'))
        .hasAttribute(
          'aria-current',
          'false',
          'the first option has now aria-current=false',
        );
      assert
        .dom(findContains('.ember-power-select-option', 'two'))
        .hasAttribute(
          'aria-current',
          'true',
          'the second option has now aria-current=false',
        );
    });

    test<CountriesWithDisabledContext>('Single-select: Options with a disabled field have `aria-disabled=true`', async function (assert) {
      assert.expect(1);

      this.countriesWithDisabled = countriesWithDisabled;
      this.foo = () => {};
      await render<CountriesWithDisabledContext>(hbs`
      <PowerSelect @options={{this.countriesWithDisabled}} @onChange={{this.foo}} as |option|>
        {{option.code}}: {{option.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-disabled=true]')
        .exists({ count: 3 }, 'Three of them are disabled');
    });

    test<CountriesWithDisabledMultipleContext>('Multiple-select: Options with a disabled field have `aria-disabled=true`', async function (assert) {
      assert.expect(1);

      this.countriesWithDisabled = countriesWithDisabled;
      this.foo = () => {};
      await render<CountriesWithDisabledMultipleContext>(hbs`
      <PowerSelectMultiple @options={{this.countriesWithDisabled}} @onChange={{this.foo}} as |option|>
        {{option.code}}: {{option.name}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-disabled=true]')
        .exists({ count: 3 }, 'Three of them are disabled');
    });

    test<NumbersContext>('Single-select: The trigger has `role=combobox`', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('role', 'combobox', 'The trigger has role combobox');
    });

    test<NumbersMultipleContext>('Multiple-select: The trigger has `role=combobox`', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersMultipleContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('role', 'combobox', 'The trigger has role combobox');
    });

    test<NumbersContext>('Single-select: The trigger attribute `aria-expanded` is true when the dropdown is opened', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('aria-expanded', 'false', 'Not expanded');
      await clickTrigger();
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('aria-expanded', 'true', 'Expanded');
    });

    test<NumbersMultipleContext>('Multiple-select: The trigger attribute `aria-expanded` is true when the dropdown is opened', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersMultipleContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('aria-expanded', 'false', 'Not expanded');
      await clickTrigger();
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('aria-expanded', 'true', 'Expanded');
    });

    test<NumbersContext>('Single-select: The listbox has a unique id`', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-options')
        .hasAttribute(
          'id',
          /^ember-power-select-options-ember\d+$/,
          'The search has a unique id',
        );
    });

    test<NumbersMultipleContext>('Multiple-select: The listbox has a unique id`', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersMultipleContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-options')
        .hasAttribute(
          'id',
          /^ember-power-select-options-ember\d+$/,
          'The search has a unique id',
        );
    });

    test<NumbersContext>('Single-select: The searchbox has type `search` and `aria-controls=<id-of-listbox>`', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-search-input')
        .hasAttribute('type', 'search', 'The type of the input is `search`');
      assert
        .dom('.ember-power-select-search-input')
        .hasAttribute(
          'aria-controls',
          /^ember-power-select-options-ember\d+$/,
          'The `aria-controls` points to the id of the listbox',
        );
    });

    test<NumbersMultipleContext>('Multiple-select: The searchbox has type `search` and `aria-controls=<id-of-listbox>`', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersMultipleContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute('type', 'search', 'The type of the input is `search`');
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute(
          'aria-controls',
          /^ember-power-select-options-ember\d+$/,
          'The `aria-controls` points to the id of the listbox',
        );
    });

    test<NumbersMultipleContext>('Multiple-select: The selected elements are <li>s inside an <ul>, and have an item with `role=button` with `aria-label="remove element"`', async function (assert) {
      assert.expect(12);

      this.numbers = numbers;
      this.selected = ['two', 'four', 'six'];
      await render<NumbersMultipleContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      [].slice
        .call(document.querySelectorAll('.ember-power-select-multiple-option'))
        .forEach((e: HTMLElement) => {
          assert.strictEqual(e.tagName, 'LI', 'The element is a list item');
          assert.strictEqual(
            e.parentElement?.tagName,
            'UL',
            'The parent element is a list',
          );
          const closeButton = e.querySelector(
            '.ember-power-select-multiple-remove-btn',
          );
          assert
            .dom(closeButton)
            .hasAttribute(
              'role',
              'button',
              'The role of the close button is "button"',
            );
          assert
            .dom(closeButton)
            .hasAttribute(
              'aria-label',
              'remove element',
              'The close button has a helpful aria label',
            );
        });
    });

    test<NumbersContext>('Single-select: The trigger element correctly passes through WAI-ARIA widget attributes', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect
        @ariaInvalid="true"
        @ariaLabel="ariaLabelString"
        @onChange={{fn (mut this.selected)}}
        @options={{this.numbers}}
        @required="true"
        @selected={{this.selected}}
        as |option|>
        {{option}}
      </PowerSelect>
    `);
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-label',
          'ariaLabelString',
          'aria-label set correctly',
        );
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('aria-invalid', 'true', 'aria-invalid set correctly');
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('aria-required', 'true', 'aria-required set correctly');
    });

    test<NumbersMultipleContext>('Multiple-select: The trigger element correctly passes through WAI-ARIA widget attributes', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render<NumbersMultipleContext>(hbs`
      <PowerSelectMultiple
        @ariaLabel="ariaLabelString"
        @ariaInvalid="true"
        @onChange={{fn (mut this.selected)}}
        @options={{this.numbers}}
        @required="true"
        @selected={{this.selected}}
        as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-label',
          'ariaLabelString',
          'aria-label set correctly',
        );
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('aria-invalid', 'true', 'aria-invalid set correctly');
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('aria-required', 'true', 'aria-required set correctly');
    });

    test<NumbersContext>('Single-select: The trigger element correctly passes through WAI-ARIA relationship attributes', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect
        @ariaDescribedBy="ariaDescribedByString"
        @ariaLabelledBy="ariaLabelledByString"
        @onChange={{fn (mut this.selected)}}
        @options={{this.numbers}}
        @selected={{this.selected}}
        as |option|>
        {{option}}
      </PowerSelect>
    `);
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-describedby',
          'ariaDescribedByString',
          'aria-describedby set correctly',
        );
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-labelledby',
          'ariaLabelledByString',
          'aria-required set correctly',
        );
    });

    test<NumbersMultipleContext>('Multiple-select: The trigger element correctly passes through WAI-ARIA relationship attributes', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersMultipleContext>(hbs`
      <PowerSelectMultiple
        @ariaDescribedBy="ariaDescribedByString"
        @ariaLabelledBy="ariaLabelledByString"
        @onChange={{fn (mut this.selected)}}
        @options={{this.numbers}}
        @selected={{this.selected}}
        as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-describedby',
          'ariaDescribedByString',
          'aria-describedby set correctly',
        );
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-labelledby',
          'ariaLabelledByString',
          'aria-required set correctly',
        );
    });

    test<CountriesContext>('Trigger can have a custom aria-role passing @triggerRole', async function (assert) {
      assert.expect(2);
      const role = 'my-role';
      this.role = role;

      this.countries = countries;
      this.foo = () => {};

      await render<CountriesContext>(hbs`
      <PowerSelect @options={{this.countries}} @selected={{this.country}} @onChange={{this.foo}} @triggerRole={{this.role}} as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('role', role, 'The `role` was added.');
      this.set('role', undefined);
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'role',
          'combobox',
          'The `role` was defaults to `combobox`.',
        );
    });

    test<NumbersContext>('Dropdown with search disabled has proper aria attributes to associate trigger with the options', async function (assert) {
      assert.expect(3);
      this.numbers = numbers;

      await render<NumbersContext>(hbs`
      <PowerSelect
        @options={{this.numbers}}
        @selected={{this.selected}}
        @searchEnabled={{false}}
        @onChange={{fn (mut this.selected)}}
        as |number|
      >
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('aria-haspopup', 'listbox');
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-owns',
          document.querySelector(
            '.ember-power-select-dropdown .ember-power-select-options',
          )?.id ?? '',
        );
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-controls',
          document.querySelector(
            '.ember-power-select-dropdown .ember-power-select-options',
          )?.id ?? '',
        );
    });

    test<NumbersContext>('Dropdown with search enabled has proper aria attributes to associate search box with the options', async function (assert) {
      assert.expect(4);
      this.numbers = numbers;

      await render<NumbersContext>(hbs`
      <PowerSelect
        @options={{this.numbers}}
        @selected={{this.selected}}
        @searchEnabled={{true}}
        @onChange={{fn (mut this.selected)}}
        as |number|
      >
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();

      assert.dom('.ember-power-select-trigger').hasNoAttribute('aria-haspopup');
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-controls',
          document.querySelector('.ember-power-select-dropdown')?.id ?? '',
        );

      assert
        .dom('.ember-power-select-search-input')
        .hasAttribute('aria-haspopup', 'listbox');
      assert
        .dom('.ember-power-select-search-input')
        .hasAttribute(
          'aria-controls',
          document.querySelector('.ember-power-select-options')?.id ?? '',
        );
    });

    test<NumbersContext>('Trigger has aria-activedescendant attribute for the highlighted option', async function (assert) {
      assert.expect(5);
      this.numbers = numbers;

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasNoAttribute(
          'aria-activedescendant',
          'aria-activedescendant is not present when the dropdown is closed',
        );

      await clickTrigger();

      // by default, the first option is highlighted and marked as aria-activedescendant
      assert
        .dom('.ember-power-select-option')
        .hasAttribute(
          'aria-current',
          'true',
          'The first element is highlighted',
        );
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-activedescendant',
          document.querySelector('.ember-power-select-option:nth-child(1)')?.id ?? '',
          'The first element is the aria-activedescendant',
        );

      await triggerEvent(
        '.ember-power-select-option:nth-child(4)',
        'mouseover',
      );

      assert
        .dom('.ember-power-select-option:nth-child(4)')
        .hasAttribute('aria-current', 'true', 'The 4th element is highlighted');
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-activedescendant',
          document.querySelector('.ember-power-select-option:nth-child(4)')?.id ?? '',
          'The 4th element is the aria-activedescendant',
        );
    });

    test<NumbersMultipleContext>('PowerSelectMultiple with search disabled has proper aria attributes', async function (assert) {
      assert.expect(7);
      this.numbers = numbers;

      await render<NumbersMultipleContext>(hbs`
      <PowerSelectMultiple
        @options={{this.numbers}}
        @selected={{this.selected}}
        @searchEnabled={{false}}
        @onChange={{fn (mut this.selected)}}
        as |number|
      >
        {{number}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasNoAttribute(
          'aria-activedescendant',
          'aria-activedescendant is not present when the dropdown is closed',
        );
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-haspopup',
          'listbox',
          'aria-haspopup is present on the trigger',
        );

      await clickTrigger();

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-controls',
          /^ember-power-select-options-ember\d+$/,
          'The trigger has aria-controls value',
        );

      // by default, the first option is highlighted and marked as aria-activedescendant
      assert
        .dom('.ember-power-select-option')
        .hasAttribute(
          'aria-current',
          'true',
          'The first element is highlighted',
        );
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-activedescendant',
          document.querySelector('.ember-power-select-option:nth-child(1)')?.id ?? '',
          'The first element is the aria-activedescendant',
        );

      await triggerEvent(
        '.ember-power-select-option:nth-child(4)',
        'mouseover',
      );

      assert
        .dom('.ember-power-select-option:nth-child(4)')
        .hasAttribute('aria-current', 'true', 'The 4th element is highlighted');
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-activedescendant',
          document.querySelector('.ember-power-select-option:nth-child(4)')?.id ?? '',
          'The 4th element is the aria-activedescendant',
        );
    });

    test<NumbersMultipleContext>('PowerSelectMultiple with search enabled has proper aria attributes', async function (assert) {
      assert.expect(10);
      this.numbers = numbers;

      await render<NumbersMultipleContext>(hbs`
      <PowerSelectMultiple
        @options={{this.numbers}}
        @selected={{this.selected}}
        @searchEnabled={{true}}
        @onChange={{fn (mut this.selected)}}
        as |number|
      >
        {{number}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'aria-controls',
          /^ember-basic-dropdown-content-ember\d+$/,
          'The trigger has aria-controls value',
        );
      assert
        .dom('.ember-power-select-trigger')
        .hasNoAttribute(
          'aria-activedescendant',
          'aria-activedescendant is not present on the trigger',
        );
      assert
        .dom('.ember-power-select-trigger')
        .hasNoAttribute(
          'aria-haspopup',
          'aria-haspopup is not present on the trigger',
        );

      await clickTrigger();

      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute(
          'aria-controls',
          /^ember-power-select-options-ember\d+$/,
          'Multi select search box has aria-controls value',
        );
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute(
          'aria-haspopup',
          'listbox',
          'Multi select search box has aria-haspopup value',
        );
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute(
          'aria-expanded',
          'true',
          'Multi select search box has aria-expanded value',
        );

      // by default, the first option is highlighted and marked as aria-activedescendant
      assert
        .dom('.ember-power-select-option')
        .hasAttribute(
          'aria-current',
          'true',
          'The first element is highlighted',
        );
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute(
          'aria-activedescendant',
          document.querySelector('.ember-power-select-option:nth-child(1)')?.id ?? '',
          'The first element is the aria-activedescendant',
        );

      await triggerEvent(
        '.ember-power-select-option:nth-child(4)',
        'mouseover',
      );

      assert
        .dom('.ember-power-select-option:nth-child(4)')
        .hasAttribute('aria-current', 'true', 'The 4th element is highlighted');
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute(
          'aria-activedescendant',
          document.querySelector('.ember-power-select-option:nth-child(4)')?.id ?? '',
          'The 4th element is the aria-activedescendant',
        );
    });
  },
);
