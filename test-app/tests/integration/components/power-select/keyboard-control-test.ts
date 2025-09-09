import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { render, type TestContext } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  triggerKeydown,
  clickTrigger,
  typeInSearch,
} from 'ember-power-select/test-support/helpers';
import {
  numbers,
  numerals,
  countries,
  countriesWithDisabled,
  groupedNumbers,
  groupedNumbersWithDisabled,
  type GroupedNumberWithDisabled,
} from 'test-app/utils/constants';
import { triggerKeyEvent, focus } from '@ember/test-helpers';
import RSVP from 'rsvp';
import type { Selected, Select } from 'ember-power-select/components/power-select';

interface NumbersContext<IsMultiple extends boolean = false> extends TestContext {
  numbers: typeof numbers;
  selected: Selected<string, IsMultiple>;
  foo: (selection: Selected<string, IsMultiple>, select: Select<string, IsMultiple>, event?: Event) => void;
  onChange: (selection: Selected<string, IsMultiple>, select: Select<string, IsMultiple>, event?: Event) => void;
  onKeydown?: (select: Select<string, IsMultiple>, e: KeyboardEvent) => boolean | void | undefined;
  onOpen?: (select: Select<string, IsMultiple>, e: Event | undefined) => boolean | void | undefined;
};

interface CountryContext<IsMultiple extends boolean = false> extends TestContext {
  // matcherFn: MatcherFn<Country>;
  countries: typeof countries;
  selected: Selected<typeof countries, IsMultiple>;
  foo: () => void;
}

interface GroupedNumbersContext<IsMultiple extends boolean = false> extends TestContext {
  foo: (selected: string | null | undefined) => void;
  groupedNumbers: typeof groupedNumbers;
  selected: Selected<typeof groupedNumbers, IsMultiple>;
}

interface GroupedNumbersWithDisabledContext extends TestContext {
  numbers: GroupedNumberWithDisabled[];
  selected: Selected<GroupedNumberWithDisabled>;
  foo: (selected: Selected<GroupedNumberWithDisabled>) => void;
}

module(
  'Integration | Component | Ember Power Select (Keyboard control)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<NumbersContext>('Pressing keydown highlights the next option', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('one');
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('two', 'The next options is highlighted now');
    });

    test<NumbersContext>('Pressing keyup highlights the previous option', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected="three" @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('three');
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 38);
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('two', 'The previous options is highlighted now');
    });

    test<NumbersContext>("When the last option is highlighted, pressing keydown doesn't change the highlighted", async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.selected = numbers[numbers.length - 1];

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('twenty');
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('twenty', 'The last option is still the highlighted one');
    });

    test<NumbersContext>("When the first option is highlighted, pressing keyup doesn't change the highlighted", async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.selected = numbers[0];

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('one');
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 38);
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('one', 'The first option is still the highlighted one');
    });

    test<NumbersContext>('The arrow keys also scroll the list if the new highlighted element if it is outside of the viewport of the list', async function (assert) {
      assert.expect(4);

      this.numbers = numbers;

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected="seven" @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('seven');
      assert.strictEqual(
        document.querySelector('.ember-power-select-options')?.scrollTop ?? '',
        0,
        'The list is not scrolled',
      );
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('eight', 'The next option is highlighted now');
      assert.ok(
        (document.querySelector('.ember-power-select-options')?.scrollTop ?? 0) > 0,
        'The list has scrolled',
      );
    });

    test<NumbersContext>('Pressing ENTER selects the highlighted element, closes the dropdown and focuses the trigger', async function (assert) {
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

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.onChange}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 13);
      assert
        .dom('.ember-power-select-trigger')
        .hasText('two', 'The highlighted element was selected');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is closed');
      assert
        .dom('.ember-power-select-trigger')
        .isFocused('The trigger is focused');
    });

    test<NumbersContext>('Pressing ENTER on a single select with search disabled selects the highlighted element, closes the dropdown and focuses the trigger', async function (assert) {
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

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.onChange}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 13);
      assert
        .dom('.ember-power-select-trigger')
        .hasText('two', 'The highlighted element was selected');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is closed');
      assert
        .dom('.ember-power-select-trigger')
        .isFocused('The trigger is focused');
    });

    test<NumbersContext>('Pressing ENTER when there is no highlighted element, closes the dropdown and focuses the trigger without calling the onchange function', async function (assert) {
      assert.expect(4);
      this.numbers = numbers;
      this.selected = 'two';
      this.onChange = () => {
        assert.ok(false, 'The handle change should not be called');
      };
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.onChange}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('asjdnah');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('two', 'Two is selected');
      assert.dom('.ember-power-select-option').hasText('No results found');
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 13);
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is closed');
      assert
        .dom('.ember-power-select-trigger')
        .isFocused('The trigger is focused');
    });

    test<NumbersContext>('Pressing SPACE on a select without a searchbox selects the highlighted element, closes the dropdown and focuses the trigger without scrolling the page', async function (assert) {
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

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.onChange}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 32); // Space
      assert
        .dom('.ember-power-select-trigger')
        .hasText('two', 'The highlighted element was selected');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is closed');
      assert
        .dom('.ember-power-select-trigger')
        .isFocused('The trigger is focused');
    });

    test<NumbersContext>('Pressing TAB closes the select WITHOUT selecting the highlighted element and focuses the trigger', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 9);
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', "The highlighted element wasn't selected");
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is closed');
      assert
        .dom('.ember-power-select-trigger')
        .isFocused('The trigges is focused');
    });

    test<NumbersContext>('The component is focusable using the TAB key as any other kind of input', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('tabindex', '0', 'The trigger is reachable with TAB');
    });

    test<NumbersContext>('If the component is focused, pressing ENTER toggles it', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await focus('.ember-power-select-trigger');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed');
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 13);
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 13);
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed again');
    });

    test<NumbersContext>('If the single component is focused and has no search, pressing SPACE toggles it', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await focus('.ember-power-select-trigger');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed');
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 32);
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 32);
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed again');
    });

    test<NumbersContext>('If the single component is focused, pressing KEYDOWN opens it', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await focus('.ember-power-select-trigger');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed');
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
    });

    test<NumbersContext>('If the single component is focused, pressing KEYUP opens it', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await focus('.ember-power-select-trigger');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed');
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 38);
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
    });

    test<NumbersContext>('Pressing ESC while the component is opened closes it and focuses the trigger', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 27);
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed');
      assert
        .dom('.ember-power-select-trigger')
        .isFocused('The select is focused');
    });

    test<NumbersContext>('In single-mode, when the user presses a key being the search input focused the passes `@onKeydown` action is invoked with the public API and the event', async function (assert) {
      assert.expect(9);

      this.numbers = numbers;
      this.selected = null;
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

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.foo}} @onKeydown={{this.onKeydown}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 13);
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed');
    });

    test<NumbersContext>('In single-mode, when the user presses SPACE on the searchbox, the highlighted option is not selected, and that space is part of the search', async function (assert) {
      assert.expect(10);

      this.numbers = numbers;
      this.selected = null;
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

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.foo}} @onKeydown={{this.onKeydown}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 32);
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The select is still opened');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'Nothing was selected');
    });

    test<NumbersContext<true>>('In multiple-mode, when the user presses SPACE on the searchbox, the highlighted option is not selected, and that space is part of the search', async function (assert) {
      assert.expect(10);

      this.numbers = numbers;
      this.selected = null;
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

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.foo}} @onKeydown={{this.onKeydown}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        32,
      );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The select is still opened');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'Nothing was selected');
    });

    test<NumbersContext>('in single-mode if the users returns false in the `@onKeydown` action it prevents the component to do the usual thing', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.selected = null;
      this.onKeydown = () => {
        return false;
      };
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.foo}} @onKeydown={{this.onKeydown}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 13);
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The select is still opened');
    });

    test<NumbersContext<true>>('In multiple-mode, when the user presses a key being the search input focused the passes `@onKeydown` action is invoked with the public API and the event', async function (assert) {
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

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.foo}} @onKeydown={{this.onKeydown}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed');
    });

    test<NumbersContext<true>>('in multiple-mode if the users returns false in the `@onKeydown` action it prevents the component to do the usual thing', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.selected = [];
      this.onKeydown = () => false;
      this.foo = () => {};

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.foo}} @onKeydown={{this.onKeydown}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The select is still opened');
    });

    test<NumbersContext>('Typing on a closed single select selects the value that matches the string typed so far', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await focus('.ember-power-select-trigger');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is closed');

      void triggerKeyEvent('.ember-power-select-trigger', 'keydown', 78); // n
      void triggerKeyEvent('.ember-power-select-trigger', 'keydown', 73); // i
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 78); // n
      assert
        .dom('.ember-power-select-trigger')
        .hasText('nine', '"nine" has been selected');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is still closed');
    });

    test<NumbersContext>('Typing with modifier keys on a closed single select does not select the value that matches the string typed so far', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await focus('.ember-power-select-trigger');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is closed');
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 82, {
        ctrlKey: true,
      }); // r
      assert
        .dom('.ember-power-select-trigger')
        .doesNotIncludeText('three', '"three" is not selected');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is still closed');
    });

    //
    // I'm actually not sure what multiple selects closed should do when typing on them.
    // For now they just do nothing
    //
    // test('Typing on a closed multiple select with no searchbox does nothing', function(assert) {
    // });

    test<NumbersContext>('Typing on an opened single select highlights the first value that matches the string typed so far, scrolling if needed', async function (assert) {
      assert.expect(6);

      this.numbers = numbers;

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The dropdown is open');
      assert.strictEqual(
        document.querySelector('.ember-power-select-options')?.scrollTop ?? -1,
        0,
        'The list is not scrolled',
      );
      void triggerKeydown('.ember-power-select-trigger', 78); // n
      void triggerKeydown('.ember-power-select-trigger', 73); // i
      await triggerKeydown('.ember-power-select-trigger', 78); // n
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'nothing has been selected');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText('nine', 'The option containing "nine" has been highlighted');
      assert.ok(
        (document.querySelector('.ember-power-select-options')?.scrollTop ?? 0) > 0,
        'The list has scrolled',
      );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is still open');
    });

    test<NumbersContext>('Typing from the Numpad on an opened single select highlights the first value that matches the string typed so far, scrolling if needed', async function (assert) {
      assert.expect(6);

      this.numbers = numerals;

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The dropdown is open');
      assert.strictEqual(
        document.querySelector('.ember-power-select-options')?.scrollTop ?? -1,
        0,
        'The list is not scrolled',
      );
      await triggerKeydown('.ember-power-select-trigger', 104); // Numpad 8
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'nothing has been selected');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText('853', 'The option containing "853" has been highlighted');
      assert.ok(
        (document.querySelector('.ember-power-select-options')?.scrollTop ?? 0) > 0,
        'The list has scrolled',
      );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is still closed');
    });

    test<NumbersContext<true>>('Typing on an opened multiple select highlights the value that matches the string typed so far, scrolling if needed', async function (assert) {
      assert.expect(6);

      this.numbers = numbers;
      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The dropdown is open');
      assert.strictEqual(
        document.querySelector('.ember-power-select-options')?.scrollTop ?? -1,
        0,
        'The list is not scrolled',
      );
      void triggerKeydown('.ember-power-select-trigger', 78); // n
      void triggerKeydown('.ember-power-select-trigger', 73); // i
      await triggerKeydown('.ember-power-select-trigger', 78); // n
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'nothing has been selected');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText('nine', 'The option containing "nine" has been highlighted');
      assert.ok(
        (document.querySelector('.ember-power-select-options')?.scrollTop ?? 0) > 0,
        'The list has scrolled',
      );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is still closed');
    });

    test<NumbersContext>('The typed string gets reset after 1s idle', async function (assert) {
      assert.expect(5);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await focus('.ember-power-select-trigger');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is closed');
      await triggerKeydown('.ember-power-select-trigger', 84); // t
      await triggerKeydown('.ember-power-select-trigger', 87); // w
      assert
        .dom('.ember-power-select-trigger')
        .hasText('two', '"two" has been selected');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is still closed');
      await new RSVP.Promise((resolve) => setTimeout(resolve, 1100));
      await triggerKeydown('.ember-power-select-trigger', 79); // o
      assert
        .dom('.ember-power-select-trigger')
        .hasText(
          'one',
          '"one" has been selected, instead of "two", because the typing started over',
        );
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is still closed');
    });

    test<NumbersContext>("Type something that doesn't give you any result leaves the current selection", async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await focus('.ember-power-select-trigger');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'nothing is selected');
      void triggerKeydown('.ember-power-select-trigger', 78); // n
      void triggerKeydown('.ember-power-select-trigger', 73); // i
      void triggerKeydown('.ember-power-select-trigger', 78); // n
      await triggerKeydown('.ember-power-select-trigger', 69); // e
      assert
        .dom('.ember-power-select-trigger')
        .hasText('nine', 'nine has been selected');
      await triggerKeydown('.ember-power-select-trigger', 87); // w
      assert
        .dom('.ember-power-select-trigger')
        .hasText(
          'nine',
          'nine is still selected because "ninew" gave no results',
        );
    });

    test<CountryContext>('Typing on an opened single select highlights the value that matches the string, also when the options are complex, using the `searchField` for that', async function (assert) {
      assert.expect(4);

      this.countries = countries;
      await render<CountryContext>(hbs`
      <PowerSelect @options={{this.countries}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchField="name" as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The dropdown is open');
      void triggerKeydown('.ember-power-select-trigger', 80); // p
      await triggerKeydown('.ember-power-select-trigger', 79); // o
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'nothing has been selected');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText(
          'Portugal',
          'The option containing "Portugal" has been highlighted',
        );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is still closed');
    });

    test<GroupedNumbersContext>('Typing on an opened single select containing groups highlights the value that matches the string', async function (assert) {
      assert.expect(4);

      this.groupedNumbers = groupedNumbers;
      await render<GroupedNumbersContext>(hbs`
      <PowerSelect @options={{this.groupedNumbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The dropdown is open');
      void triggerKeydown('.ember-power-select-trigger', 69); // e
      await triggerKeydown('.ember-power-select-trigger', 76); // l
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'nothing has been selected');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText(
          'eleven',
          'The option containing "eleven" has been highlighted',
        );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is still closed');
    });

    test<CountryContext>('Typing on an opened single select highlights skips disabled options', async function (assert) {
      assert.expect(4);

      this.countries = countriesWithDisabled.map((country) =>
        Object.assign({}, country),
      );
      if (this.countries[0]) {
        this.countries[0].disabled = true;
      }
      await render<CountryContext>(hbs`
      <PowerSelect @options={{this.countries}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchField="name" as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The dropdown is open');
      await triggerKeydown('.ember-power-select-trigger', 85); // u
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'nothing has been selected');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText(
          'United Kingdom',
          'The option containing "United Kingdom" has been highlighted',
        );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is still closed');
    });

    test<GroupedNumbersWithDisabledContext>('Typing on an opened single select highlights skips disabled groups', async function (assert) {
      assert.expect(4);

      this.numbers = groupedNumbersWithDisabled;
      await render<GroupedNumbersWithDisabledContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The dropdown is open');
      void triggerKeydown('.ember-power-select-trigger', 84); // t
      await triggerKeydown('.ember-power-select-trigger', 87); // w
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'nothing has been selected');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText(
          'twelve',
          'The option containing "United Kingdom" has been highlighted',
        );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is still closed');
    });

    test<NumbersContext>('BUGFIX: If pressing up/down arrow on a single select open the dropdown, the event is defaultPrevented', async function (assert) {
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

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} @onOpen={{this.onOpen}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 38);

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

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} @onOpen={{this.onOpen}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 38);

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

    test<NumbersContext<true>>('BUGFIX: If pressing up/down arrow on a multiple select opens the select, the event is defaultPrevented', async function (assert) {
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

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{this.foo}} @onOpen={{this.onOpen}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 38);

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

    test<NumbersContext<true>>('BUGFIX: If pressing up/down arrow on a multiple select DOES NOT open the select, the event is defaultPrevented', async function (assert) {
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

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{this.foo}} @onOpen={{this.onOpen}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 38);

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

    test<NumbersContext<true>>('BUGFIX: when using ENTER to select an option in multiple select, the next ARROWDOWN should select the option after it', async function (assert) {
      this.numbers = numbers;
      this.selected = [];

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple
        @options={{this.numbers}}
        @closeOnSelect={{false}}
        @onChange={{fn (mut this.selected)}}
        @selected={{this.selected}}
        as |option|
      >
        {{option}}
      </PowerSelectMultiple>
    `);

      await focus('.ember-power-select-multiple-trigger');
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'ArrowDown',
      );
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'ArrowDown',
      );
      // Select second option (data-index=1)
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'Enter',
      );
      assert.dom('[data-option-index="1"][aria-current="true"]').exists();
      // Next ArrowDown should highlight (data-index=2)
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'ArrowDown',
      );
      assert.dom('[data-option-index="2"][aria-current="true"]').exists();
    });

    test<NumbersContext<true>>('BUGFIX: when pressing enter multiple times on the same selected element in a multiple select', async function (assert) {
      this.numbers = numbers;
      this.selected = [];
      this.onChange = (selected) => {
        this.set('selected', selected);
      };

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple
        @options={{this.numbers}}
        @closeOnSelect={{false}}
        @onChange={{this.onChange}}
        @selected={{this.selected}}
        as |option|
      >
        {{option}}
      </PowerSelectMultiple>
    `);

      await focus('.ember-power-select-multiple-trigger');
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'ArrowDown',
      );
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'Enter',
      );
      // select first
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'ArrowDown',
      );
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'ArrowDown',
      );
      // Select second option
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'Enter',
      );
      assert.strictEqual(this.selected?.length ?? 0, 2);
      // Select second option 2 more times with Enter keydown
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'Enter',
      );
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
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
