import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
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
} from '../constants';
import { triggerKeyEvent, focus } from '@ember/test-helpers';
import RSVP from 'rsvp';
import { A } from '@ember/array';

module(
  'Integration | Component | Ember Power Select (Keyboard control)',
  function (hooks) {
    setupRenderingTest(hooks);

    test('Pressing keydown highlights the next option', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |option|>
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

    test('Pressing keyup highlights the previous option', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected="three" @onChange={{action (mut this.selected)}} @searchEnabled={{true}} as |option|>
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

    test("When the last option is highlighted, pressing keydown doesn't change the highlighted", async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.lastNumber = numbers[numbers.length - 1];
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.lastNumber}} @onChange={{action (mut this.lastNumber)}} @searchEnabled={{true}} as |option|>
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

    test("When the first option is highlighted, pressing keyup doesn't change the highlighted", async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.firstNumber = numbers[0];
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.firstNumber}} @onChange={{action (mut this.firstNumber)}} @searchEnabled={{true}} as |option|>
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

    test('The arrow keys also scroll the list if the new highlighted element if it is outside of the viewport of the list', async function (assert) {
      assert.expect(4);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected="seven" @onChange={{action (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('seven');
      assert.strictEqual(
        document.querySelector('.ember-power-select-options').scrollTop,
        0,
        'The list is not scrolled'
      );
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('eight', 'The next option is highlighted now');
      assert.ok(
        document.querySelector('.ember-power-select-options').scrollTop > 0,
        'The list has scrolled'
      );
    });

    test('Pressing ENTER selects the highlighted element, closes the dropdown and focuses the trigger', async function (assert) {
      assert.expect(5);

      this.numbers = numbers;
      this.changed = (val, dropdown) => {
        assert.strictEqual(
          val,
          'two',
          'The onchange action is triggered with the selected value'
        );
        this.set('selected', val);
        assert.ok(
          dropdown.actions.close,
          'The action receives the dropdown as second argument'
        );
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action this.changed}} @searchEnabled={{true}} as |option|>
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

    test('Pressing ENTER on a single select with search disabled selects the highlighted element, closes the dropdown and focuses the trigger', async function (assert) {
      assert.expect(5);

      this.numbers = numbers;
      this.changed = (val, dropdown) => {
        assert.strictEqual(
          val,
          'two',
          'The onchange action is triggered with the selected value'
        );
        this.set('selected', val);
        assert.ok(
          dropdown.actions.close,
          'The action receives the dropdown as second argument'
        );
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.changed}} as |option|>
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

    test('Pressing ENTER when there is no highlighted element, closes the dropdown and focuses the trigger without calling the onchange function', async function (assert) {
      assert.expect(4);
      this.numbers = numbers;
      this.selected = 'two';
      this.handleChange = () => {
        assert.ok(false, 'The handle change should not be called');
      };
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action this.handleChange}} @searchEnabled={{true}} as |option|>
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

    test('Pressing SPACE on a select without a searchbox selects the highlighted element, closes the dropdown and focuses the trigger without scrolling the page', async function (assert) {
      assert.expect(6);

      this.numbers = numbers;
      this.changed = (val, dropdown, e) => {
        assert.strictEqual(
          val,
          'two',
          'The onchange action is triggered with the selected value'
        );
        this.set('selected', val);
        assert.ok(
          e.defaultPrevented,
          'The event has been defaultPrevented to avoid page scroll'
        );
        assert.ok(
          dropdown.actions.close,
          'The action receives the dropdown as second argument'
        );
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action this.changed}} as |option|>
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

    test('Pressing TAB closes the select WITHOUT selecting the highlighted element and focuses the trigger', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |option|>
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

    test('The component is focusable using the TAB key as any other kind of input', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('tabindex', '0', 'The trigger is reachable with TAB');
    });

    test('If the component is focused, pressing ENTER toggles it', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
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

    test('If the single component is focused and has no search, pressing SPACE toggles it', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
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

    test('If the single component is focused, pressing KEYDOWN opens it', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |option|>
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

    test('If the single component is focused, pressing KEYUP opens it', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
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

    test('Pressing ESC while the component is opened closes it and focuses the trigger', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
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

    test('In single-mode, when the user presses a key being the search input focused the passes `@onKeydown` action is invoked with the public API and the event', async function (assert) {
      assert.expect(9);

      this.numbers = numbers;
      this.selected = null;
      this.handleKeydown = (select, e) => {
        assert.ok(
          Object.prototype.hasOwnProperty.call(select, 'isOpen'),
          'The yieded object has the `isOpen` key'
        );
        assert.ok(
          select.actions.open,
          'The yieded object has an `actions.open` key'
        );
        assert.ok(
          select.actions.close,
          'The yieded object has an `actions.close` key'
        );
        assert.ok(
          select.actions.select,
          'The yieded object has an `actions.select` key'
        );
        assert.ok(
          select.actions.highlight,
          'The yieded object has an `actions.highlight` key'
        );
        assert.ok(
          select.actions.search,
          'The yieded object has an `actions.search` key'
        );
        assert.strictEqual(
          e.keyCode,
          13,
          'The event is received as second argument'
        );
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.foo)}} @onKeydown={{this.handleKeydown}} @searchEnabled={{true}} as |option|>
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

    test('In single-mode, when the user presses SPACE on the searchbox, the highlighted option is not selected, and that space is part of the search', async function (assert) {
      assert.expect(10);

      this.numbers = numbers;
      this.selected = null;
      this.handleKeydown = (select, e) => {
        assert.ok(
          Object.prototype.hasOwnProperty.call(select, 'isOpen'),
          'The yieded object has the `isOpen` key'
        );
        assert.ok(
          select.actions.open,
          'The yieded object has an `actions.open` key'
        );
        assert.ok(
          select.actions.close,
          'The yieded object has an `actions.close` key'
        );
        assert.ok(
          select.actions.select,
          'The yieded object has an `actions.select` key'
        );
        assert.ok(
          select.actions.highlight,
          'The yieded object has an `actions.highlight` key'
        );
        assert.ok(
          select.actions.search,
          'The yieded object has an `actions.search` key'
        );
        assert.strictEqual(
          e.keyCode,
          32,
          'The event is received as second argument'
        );
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.foo)}} @onKeydown={{action this.handleKeydown}} @searchEnabled={{true}} as |option|>
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

    test('In multiple-mode, when the user presses SPACE on the searchbox, the highlighted option is not selected, and that space is part of the search', async function (assert) {
      assert.expect(10);

      this.numbers = numbers;
      this.selected = null;
      this.handleKeydown = (select, e) => {
        assert.ok(
          Object.prototype.hasOwnProperty.call(select, 'isOpen'),
          'The yieded object has the `isOpen` key'
        );
        assert.ok(
          select.actions.open,
          'The yieded object has an `actions.open` key'
        );
        assert.ok(
          select.actions.close,
          'The yieded object has an `actions.close` key'
        );
        assert.ok(
          select.actions.select,
          'The yieded object has an `actions.select` key'
        );
        assert.ok(
          select.actions.highlight,
          'The yieded object has an `actions.highlight` key'
        );
        assert.ok(
          select.actions.search,
          'The yieded object has an `actions.search` key'
        );
        assert.strictEqual(
          e.keyCode,
          32,
          'The event is received as second argument'
        );
      };

      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.foo)}} @onKeydown={{action this.handleKeydown}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        32
      );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The select is still opened');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'Nothing was selected');
    });

    test('in single-mode if the users returns false in the `@onKeydown` action it prevents the component to do the usual thing', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.selected = null;
      this.handleKeydown = () => {
        return false;
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.foo)}} @onKeydown={{action this.handleKeydown}} @searchEnabled={{true}} as |option|>
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

    test('In multiple-mode, when the user presses a key being the search input focused the passes `@onKeydown` action is invoked with the public API and the event', async function (assert) {
      assert.expect(9);

      this.numbers = numbers;
      this.selectedNumbers = [];
      this.handleKeydown = (select, e) => {
        assert.ok(
          Object.prototype.hasOwnProperty.call(select, 'isOpen'),
          'The yieded object has the `isOpen` key'
        );
        assert.ok(
          select.actions.open,
          'The yieded object has an `actions.open` key'
        );
        assert.ok(
          select.actions.close,
          'The yieded object has an `actions.close` key'
        );
        assert.ok(
          select.actions.select,
          'The yieded object has an `actions.select` key'
        );
        assert.ok(
          select.actions.highlight,
          'The yieded object has an `actions.highlight` key'
        );
        assert.ok(
          select.actions.search,
          'The yieded object has an `actions.search` key'
        );
        assert.strictEqual(
          e.keyCode,
          13,
          'The event is received as second argument'
        );
      };

      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selectedNumbers}} @onChange={{action (mut this.foo)}} @onKeydown={{action this.handleKeydown}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        13
      );
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed');
    });

    test('in multiple-mode if the users returns false in the `@onKeydown` action it prevents the component to do the usual thing', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.selectedNumbers = [];
      this.handleKeydown = () => false;

      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selectedNumbers}} @onChange={{action (mut this.foo)}} @onKeydown={{action this.handleKeydown}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        13
      );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The select is still opened');
    });

    test('Typing on a closed single select selects the value that matches the string typed so far', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await focus('.ember-power-select-trigger');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is closed');

      triggerKeyEvent('.ember-power-select-trigger', 'keydown', 78); // n
      triggerKeyEvent('.ember-power-select-trigger', 'keydown', 73); // i
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 78); // n
      assert
        .dom('.ember-power-select-trigger')
        .hasText('nine', '"nine" has been selected');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is still closed');
    });

    test('Typing with modifier keys on a closed single select does not select the value that matches the string typed so far', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.selected)}} as |option|>
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

    test('Typing on an opened single select highlights the first value that matches the string typed so far, scrolling if needed', async function (assert) {
      assert.expect(6);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The dropdown is open');
      assert.strictEqual(
        document.querySelector('.ember-power-select-options').scrollTop,
        0,
        'The list is not scrolled'
      );
      triggerKeydown('.ember-power-select-trigger', 78); // n
      triggerKeydown('.ember-power-select-trigger', 73); // i
      await triggerKeydown('.ember-power-select-trigger', 78); // n
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'nothing has been selected');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText('nine', 'The option containing "nine" has been highlighted');
      assert.ok(
        document.querySelector('.ember-power-select-options').scrollTop > 0,
        'The list has scrolled'
      );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is still open');
    });

    test('Typing from the Numpad on an opened single select highlights the first value that matches the string typed so far, scrolling if needed', async function (assert) {
      assert.expect(6);

      this.numerals = numerals;
      await render(hbs`
      <PowerSelect @options={{this.numerals}} @selected={{this.selected}} @onChange={{action (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The dropdown is open');
      assert.strictEqual(
        document.querySelector('.ember-power-select-options').scrollTop,
        0,
        'The list is not scrolled'
      );
      await triggerKeydown('.ember-power-select-trigger', 104); // Numpad 8
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'nothing has been selected');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText('853', 'The option containing "853" has been highlighted');
      assert.ok(
        document.querySelector('.ember-power-select-options').scrollTop > 0,
        'The list has scrolled'
      );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is still closed');
    });

    test('Typing on an opened multiple select highlights the value that matches the string typed so far, scrolling if needed', async function (assert) {
      assert.expect(6);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The dropdown is open');
      assert.strictEqual(
        document.querySelector('.ember-power-select-options').scrollTop,
        0,
        'The list is not scrolled'
      );
      triggerKeydown('.ember-power-select-trigger', 78); // n
      triggerKeydown('.ember-power-select-trigger', 73); // i
      await triggerKeydown('.ember-power-select-trigger', 78); // n
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'nothing has been selected');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText('nine', 'The option containing "nine" has been highlighted');
      assert.ok(
        document.querySelector('.ember-power-select-options').scrollTop > 0,
        'The list has scrolled'
      );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is still closed');
    });

    test('The typed string gets reset after 1s idle', async function (assert) {
      assert.expect(5);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.selected)}} as |option|>
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
          '"one" has been selected, instead of "two", because the typing started over'
        );
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is still closed');
    });

    test("Type something that doesn't give you any result leaves the current selection", async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await focus('.ember-power-select-trigger');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'nothing is selected');
      triggerKeydown('.ember-power-select-trigger', 78); // n
      triggerKeydown('.ember-power-select-trigger', 73); // i
      triggerKeydown('.ember-power-select-trigger', 78); // n
      await triggerKeydown('.ember-power-select-trigger', 69); // e
      assert
        .dom('.ember-power-select-trigger')
        .hasText('nine', 'nine has been selected');
      await triggerKeydown('.ember-power-select-trigger', 87); // w
      assert
        .dom('.ember-power-select-trigger')
        .hasText(
          'nine',
          'nine is still selected because "ninew" gave no results'
        );
    });

    test('Typing on an opened single select highlights the value that matches the string, also when the options are complex, using the `searchField` for that', async function (assert) {
      assert.expect(4);

      this.countries = countries;
      await render(hbs`
      <PowerSelect @options={{this.countries}} @selected={{this.selected}} @onChange={{action (mut this.selected)}} @searchField="name" as |country|>
        {{country.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The dropdown is open');
      triggerKeydown('.ember-power-select-trigger', 80); // p
      await triggerKeydown('.ember-power-select-trigger', 79); // o
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'nothing has been selected');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText(
          'Portugal',
          'The option containing "Portugal" has been highlighted'
        );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is still closed');
    });

    test('Typing on an opened single select containing groups highlights the value that matches the string', async function (assert) {
      assert.expect(4);

      this.groupedNumbers = groupedNumbers;
      await render(hbs`
      <PowerSelect @options={{this.groupedNumbers}} @selected={{this.selected}} @onChange={{action (mut this.selected)}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The dropdown is open');
      triggerKeydown('.ember-power-select-trigger', 69); // e
      await triggerKeydown('.ember-power-select-trigger', 76); // l
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'nothing has been selected');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText(
          'eleven',
          'The option containing "eleven" has been highlighted'
        );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is still closed');
    });

    test('Typing on an opened single select highlights skips disabled options', async function (assert) {
      assert.expect(4);

      this.countries = countriesWithDisabled.map((country) =>
        Object.assign({}, country)
      );
      this.countries[0].disabled = true;
      await render(hbs`
      <PowerSelect @options={{this.countries}} @selected={{this.selected}} @onChange={{action (mut this.selected)}} @searchField="name" as |country|>
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
          'The option containing "United Kingdom" has been highlighted'
        );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is still closed');
    });

    test('Typing on an opened single select highlights skips disabled groups', async function (assert) {
      assert.expect(4);

      this.numbers = groupedNumbersWithDisabled;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.selected)}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The dropdown is open');
      triggerKeydown('.ember-power-select-trigger', 84); // t
      await triggerKeydown('.ember-power-select-trigger', 87); // w
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'nothing has been selected');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText(
          'twelve',
          'The option containing "United Kingdom" has been highlighted'
        );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is still closed');
    });

    test('BUGFIX: If pressing up/down arrow on a single select open the dropdown, the event is defaultPrevented', async function (assert) {
      assert.expect(2);
      let done = assert.async();

      this.numbers = numbers;
      let events = [];
      this.handleOpen = function (_, e) {
        if (e.type === 'keydown') {
          events.push(e);
        }
      };
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} @onOpen={{this.handleOpen}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 38);

      setTimeout(function () {
        assert.ok(
          events[0].defaultPrevented,
          'The first event was default prevented'
        );
        assert.ok(
          events[1].defaultPrevented,
          'The second event was default prevented'
        );
        done();
      }, 50);
    });

    test('BUGFIX: If pressing up/down arrow on a single select DOES NOT the dropdown, the event is defaultPrevented', async function (assert) {
      assert.expect(2);
      let done = assert.async();

      this.numbers = numbers;
      let events = [];
      this.handleOpen = function (_, e) {
        if (e.type === 'keydown') {
          events.push(e);
        }
        return false; // prevent the dropdown from opening
      };
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} @onOpen={{action this.handleOpen}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 38);

      setTimeout(function () {
        assert.notOk(
          events[0].defaultPrevented,
          'The first event was default prevented'
        );
        assert.notOk(
          events[1].defaultPrevented,
          'The second event was default prevented'
        );
        done();
      }, 50);
    });

    test('BUGFIX: If pressing up/down arrow on a multiple select opens the select, the event is defaultPrevented', async function (assert) {
      assert.expect(2);
      let done = assert.async();

      this.numbers = numbers;
      let events = [];
      this.handleOpen = function (_, e) {
        if (e.type === 'keydown') {
          events.push(e);
        }
      };
      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{action (mut this.foo)}} @onOpen={{action this.handleOpen}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 38);

      setTimeout(function () {
        assert.ok(
          events[0].defaultPrevented,
          'The first event was default prevented'
        );
        assert.ok(
          events[1].defaultPrevented,
          'The second event was default prevented'
        );
        done();
      }, 50);
    });

    test('BUGFIX: If pressing up/down arrow on a multiple select DOES NOT open the select, the event is defaultPrevented', async function (assert) {
      assert.expect(2);
      let done = assert.async();

      this.numbers = numbers;
      let events = [];
      this.handleOpen = function (_, e) {
        if (e.type === 'keydown') {
          events.push(e);
        }
        return false; // prevent the dropdown from opening
      };
      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{action (mut this.foo)}} @onOpen={{action this.handleOpen}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 38);

      setTimeout(function () {
        assert.notOk(
          events[0].defaultPrevented,
          'The first event was default prevented'
        );
        assert.notOk(
          events[1].defaultPrevented,
          'The second event was default prevented'
        );
        done();
      }, 50);
    });

    test('BUGFIX: when using ENTER to select an option in multiple select, the next ARROWDOWN should select the option after it', async function (assert) {
      this.numbers = numbers;
      this.selected = A();

      await render(hbs`
      <PowerSelectMultiple
        @options={{this.numbers}}
        @closeOnSelect={{false}}
        @onChange={{action (mut this.selected)}}
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
        'ArrowDown'
      );
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'ArrowDown'
      );
      // Select second option (data-index=1)
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'Enter'
      );
      assert.dom('[data-option-index="1"][aria-current="true"]').exists();
      // Next ArrowDown should highlight (data-index=2)
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'ArrowDown'
      );
      assert.dom('[data-option-index="2"][aria-current="true"]').exists();
    });

    test('BUGFIX: when pressing enter multiple times on the same selected element in a multiple select', async function (assert) {
      this.numbers = numbers;
      this.selected = null;
      this.onChange = (selected) => {
        this.set('selected', selected);
      };

      await render(hbs`
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
        'ArrowDown'
      );
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'Enter'
      );
      // select first
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'ArrowDown'
      );
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'ArrowDown'
      );
      // Select second option
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'Enter'
      );
      assert.strictEqual(this.selected.length, 2);
      // Select second option 2 more times with Enter keydown
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'Enter'
      );
      await triggerKeyEvent(
        '.ember-power-select-multiple-trigger',
        'keydown',
        'Enter'
      );

      assert.strictEqual(
        this.selected.length,
        2,
        'it does not add additional elements to the selected array'
      );
      assert.false(
        this.selected.some((selection) => Array.isArray(selection)),
        'it does not add empty arrays to the selected array'
      );
    });
  }
);
