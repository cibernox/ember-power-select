import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import { numbers } from '../constants';
import { click, triggerEvent } from '@ember/test-helpers';

module(
  'Integration | Component | Ember Power Select (Mouse control)',
  function (hooks) {
    setupRenderingTest(hooks);

    test('Mouseovering a list item highlights it', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option')
        .hasAttribute(
          'aria-current',
          'true',
          'The first element is highlighted'
        );
      await triggerEvent(
        '.ember-power-select-option:nth-child(4)',
        'mouseover'
      );
      assert
        .dom('.ember-power-select-option:nth-child(4)')
        .hasAttribute('aria-current', 'true', 'The 4th element is highlighted');
      assert.dom('.ember-power-select-option:nth-child(4)').hasText('four');
    });

    test('Mouseovering a list item does not highlight it when highlightOnHover is false', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @highlightOnHover={{false}} @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option')
        .hasAttribute(
          'aria-current',
          'true',
          'The first element is highlighted'
        );
      await triggerEvent(
        '.ember-power-select-option:nth-child(4)',
        'mouseover'
      );

      assert
        .dom('.ember-power-select-option:nth-child(4)')
        .hasAttribute(
          'aria-current',
          'false',
          'The 4th element is not highlighted'
        );
      assert
        .dom('.ember-power-select-option:nth-child(1)')
        .hasAttribute(
          'aria-current',
          'true',
          'The 1st element is still highlighted'
        );
    });

    test('Clicking an item selects it, closes the dropdown and focuses the trigger', async function (assert) {
      assert.expect(5);

      this.numbers = numbers;
      this.foo = (val, dropdown, event) => {
        assert.strictEqual(
          val,
          'four',
          'The action is invoked with the selected value as first parameter'
        );
        assert.ok(
          dropdown.actions.close,
          'The action is invoked with the the dropdown object as second parameter'
        );
        assert.ok(
          event instanceof window.Event,
          'The third argument is an event'
        );
      };
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      await click('.ember-power-select-option:nth-child(4)');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select was closed');
      assert.dom('.ember-power-select-trigger').isFocused();
    });

    test('Clicking the trigger while the select is opened closes it and and focuses the trigger', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>f
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed');
      assert.dom('.ember-power-select-trigger').isFocused();
    });

    test('Doing mousedown the clear button removes the selection but does not open the select', async function (assert) {
      assert.expect(6);

      this.numbers = numbers;
      this.onChange = (selected, dropdown) => {
        assert.strictEqual(
          selected,
          null,
          'The onchange action was called with the new selection (null)'
        );
        assert.ok(
          dropdown.actions.close,
          'The onchange action was called with the dropdown object as second argument'
        );
        this.set('selected', selected);
      };
      this.selected = 'three';
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @allowClear={{true}} @onChange={{this.onChange}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed');
      assert
        .dom('.ember-power-select-trigger')
        .includesText('three', 'A element is selected');
      await click('.ember-power-select-clear-btn');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is still closed');
      assert
        .dom('.ember-power-select-trigger')
        .doesNotIncludeText('three', 'That element is not selected now');
    });

    test("Clicking anywhere outside the select while opened closes the component and doesn't focuses the trigger", async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render(hbs`
      <input type="text" id="other-thing">
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
      await click('#other-thing');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed');
      assert.dom('.ember-power-select-trigger').isNotFocused();
    });

    test("Doing mouseup over an option less than 2px in the Y axis of where the mousedown that opened the component was triggered doesn't select the option", async function (assert) {
      assert.expect(4);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @inTesting={{false}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger(null, { clientY: 123 });
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');

      await triggerEvent(
        '.ember-power-select-option:nth-child(2)',
        'mousedown',
        { clientY: 124 }
      );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The select is still opened');
      await triggerEvent('.ember-power-select-option:nth-child(2)', 'mouseup', {
        clientY: 125,
      });
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed now');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('two', 'The element has been selected');
    });

    test('Clicking on a wrapped option should select it', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;

      this.foo = (val) => {
        assert.strictEqual(val, 'four', 'The expected value was selected');
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        <span class="special-class">{{option}}</span>
      </PowerSelect>
    `);

      await clickTrigger();
      await click(document.querySelectorAll('.special-class')[3]);
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select was closed');
      assert.dom('.ember-power-select-trigger').isFocused();
    });

    test('Mouse-overing on a wrapped option should select it', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} as |option|>
        <span class="special-class">{{option}}</span>
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('one', 'The first element is highlighted');
      await triggerEvent(
        document.querySelectorAll('.special-class')[3],
        'mouseover'
      );
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('four', 'The fourth element is highlighted');
    });

    test("Mouse-overing the list itself doesn't crashes the app", async function (assert) {
      assert.expect(0); // NOTE: The fact that this tests runs without errors is the prove that it works

      this.numbers = numbers;

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} as |option|>
        <span class="special-class">{{option}}</span>
      </PowerSelect>
    `);

      await clickTrigger();
      await triggerEvent('ul', 'mouseover');
    });
  }
);
