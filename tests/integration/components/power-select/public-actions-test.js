import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent, focus } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  clickTrigger,
  typeInSearch,
} from 'ember-power-select/test-support/helpers';
import { numbers } from '../constants';
import { run } from '@ember/runloop';

function assertPublicAPIShape(assert, select) {
  assert.strictEqual(
    typeof select.uniqueId,
    'string',
    'select.uniqueId is a string'
  );
  assert.strictEqual(
    typeof select.isOpen,
    'boolean',
    'select.isOpen is a boolean'
  );
  assert.strictEqual(
    typeof select.disabled,
    'boolean',
    'select.disabled is a boolean'
  );
  assert.strictEqual(
    typeof select.isActive,
    'boolean',
    'select.isActive is a boolean'
  );
  assert.strictEqual(
    typeof select.loading,
    'boolean',
    'select.loading is a boolean'
  );
  assert.ok(select.options instanceof Array, 'select.options is an array');
  assert.ok(select.results instanceof Array, 'select.results is an array');
  assert.strictEqual(
    typeof select.resultsCount,
    'number',
    'select.resultsCount is a number'
  );
  assert.ok(Object.prototype.hasOwnProperty.call(select, 'selected'));
  assert.ok(Object.prototype.hasOwnProperty.call(select, 'highlighted'));
  assert.strictEqual(
    typeof select.searchText,
    'string',
    'select.searchText is a string'
  );
  assert.strictEqual(
    typeof select.lastSearchedText,
    'string',
    'select.lastSearchedText is a string'
  );
  assert.strictEqual(
    typeof select.actions.open,
    'function',
    'select.actions.open is a function'
  );
  assert.strictEqual(
    typeof select.actions.close,
    'function',
    'select.actions.close is a function'
  );
  assert.strictEqual(
    typeof select.actions.toggle,
    'function',
    'select.actions.toggle is a function'
  );
  assert.strictEqual(
    typeof select.actions.reposition,
    'function',
    'select.actions.reposition is a function'
  );
  assert.strictEqual(
    typeof select.actions.search,
    'function',
    'select.actions.search is a function'
  );
  assert.strictEqual(
    typeof select.actions.highlight,
    'function',
    'select.actions.highlight is a function'
  );
  assert.strictEqual(
    typeof select.actions.select,
    'function',
    'select.actions.select is a function'
  );
  assert.strictEqual(
    typeof select.actions.choose,
    'function',
    'select.actions.choose is a function'
  );
  assert.strictEqual(
    typeof select.actions.scrollTo,
    'function',
    'select.actions.scrollTo is a function'
  );
}

module(
  'Integration | Component | Ember Power Select (Public actions)',
  function (hooks) {
    setupRenderingTest(hooks);

    test('The search action of single selects action receives the search term and the public API', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.handleSearch = (term, select) => {
        assert.strictEqual(
          term,
          'el',
          'The search term is received as 1st argument'
        );
        assertPublicAPIShape(assert, select);
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} @search={{this.handleSearch}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('el');
    });

    test('The search action of multiple selects action receives the search term and the public API', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.handleSearch = (term, select) => {
        assert.strictEqual(
          term,
          'el',
          'The search term is received as 1st argument'
        );
        assertPublicAPIShape(assert, select);
      };

      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} @search={{this.handleSearch}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await typeInSearch('el');
    });

    test('The onchange of single selects action receives the selection and the public API', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.handleChange = (selected, select) => {
        assert.strictEqual(selected, 'one', 'The first option is the selected');
        assertPublicAPIShape(assert, select);
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onChange={{this.handleChange}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      await click('.ember-power-select-option');
    });

    test('The onchange of multiple selects action receives the selection and the public API', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.handleChange = ([selected], select) => {
        assert.strictEqual(selected, 'one', 'The first option is the selected');
        assertPublicAPIShape(assert, select);
      };

      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.foo}} @onChange={{this.handleChange}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await click('.ember-power-select-option');
    });

    test('The onKeydown of single selects action receives the public API and the keydown event when fired on the searchbox', async function (assert) {
      assert.expect(44);

      this.numbers = numbers;
      this.onKeyDown = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onKeydown={{this.onKeyDown}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 65);
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 13);
    });

    test('The `@onKeydown` can be used to easily allow to select on tab', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.onKeyDown = (select, e) => {
        if (e.keyCode === 9) {
          select.actions.select(select.highlighted);
          select.actions.close();
        }
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onKeydown={{this.onKeyDown}} @onChange={{action (mut this.foo)}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 9);
      assert
        .dom('.ember-power-select-trigger')
        .hasText('three', 'The highlighted options has been selected');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is opened');
    });

    test('The onKeydown of multiple selects action receives the public API and the keydown event', async function (assert) {
      assert.expect(44);

      this.numbers = numbers;
      this.onKeyDown = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.foo}} @onKeydown={{this.onKeyDown}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        13
      );
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        65
      );
    });

    test('returning false from the `@onKeydown` action prevents the default behaviour in single selects', async function (assert) {
      assert.expect(48);

      this.numbers = numbers;
      this.handleKeyDown = (select, e) => {
        assert.false(select.isOpen, 'select.isOpen is still false');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
        return false;
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} @onKeydown={{this.handleKeyDown}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 13);
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is still closed');
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 84); // 't'
      assert
        .dom('.ember-power-select-trigger')
        .doesNotIncludeText('two', 'nothing was selected');
    });

    test('returning false from the `@onKeydown` action prevents the default behaviour in multiple selects', async function (assert) {
      assert.expect(24);

      this.numbers = numbers;
      this.handleKeyDown = (select, e) => {
        assert.false(select.isOpen, 'select.isOpen is still false');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
        return false;
      };

      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} @onKeydown={{this.handleKeyDown}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        13
      );
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is still closed');
    });

    test('The onFocus of single selects action receives the public API and the focus event', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.handleFocus = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onFocus={{this.handleFocus}} @onChange={{action (mut this.foo)}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await focus('.ember-power-select-trigger');
    });

    // Weird failure in Ember 4
    skip('The onFocus of multiple selects action receives the public API and the focus event', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.handleFocus = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.foo}} @onFocus={{handleFocus}} @onChange={{action (mut this.foo)}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await focus('.ember-power-select-trigger');
    });

    // Weird failure in Ember 4
    skip('The onFocus of multiple selects also gets called when the thing getting the focus is the searbox', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.handleFocus = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render(hbs`
      <input type="text" autofocus>
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.foo}} @onFocus={{handleFocus}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await focus('.ember-power-select-trigger-multiple-input');
    });

    test('The onBlur of single selects action receives the public API and the event', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.handleBlur = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onBlur={{this.handleBlur}} @onChange={{action (mut this.foo)}} as |number|>
        {{number}}
      </PowerSelect>
      <input type="text" id="other-element"/>
    `);

      await focus('.ember-power-select-trigger');
      await focus('#other-element');
    });

    test('The onBlur of multiple selects action receives the public API and the focus event', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.handleBlur = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.foo}} @onBlur={{this.handleBlur}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
      <input type="text" id="other-element"/>
    `);

      await focus('.ember-power-select-trigger-multiple-input');
      await focus('#other-element');
    });

    test('The onBlur of multiple selects also gets called when the thing getting the focus is the searbox', async function (assert) {
      this.numbers = numbers;
      this.handleBlur = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onBlur={{this.handleBlur}} @onChange={{action (mut this.foo)}} as |number|>
        {{number}}
      </PowerSelect>
      <input type="text" id="other-element"/>
    `);

      await clickTrigger();
      await focus('#other-element');
    });

    test('the `@onOpen` action is invoked just before the dropdown opens', async function (assert) {
      assert.expect(24);

      this.numbers = numbers;
      this.handleOpen = (select, e) => {
        assert.false(select.isOpen, 'select.isOpen is still false');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} @onOpen={{this.handleOpen}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is opened');
    });

    test('returning false from the `@onOpen` action prevents the single select from opening', async function (assert) {
      assert.expect(24);

      this.numbers = numbers;
      this.handleOpen = (select, e) => {
        assert.false(select.isOpen, 'select.isOpen is still false');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
        return false;
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} @onOpen={{this.handleOpen}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist("Dropdown didn't open");
    });

    test('returning false from the `@onOpen` action prevents the multiple select from opening', async function (assert) {
      assert.expect(24);

      this.numbers = numbers;
      this.handleOpen = (select, e) => {
        assert.false(select.isOpen, 'select.isOpen is still false');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
        return false;
      };

      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{action (mut this.foo)}} @onOpen={{this.handleOpen}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist("Dropdown didn't open");
    });

    test('the `@onClose` action is invoked just before the dropdown closes', async function (assert) {
      assert.expect(24);

      this.numbers = numbers;
      this.handleClose = (select, e) => {
        assert.true(select.isOpen, 'select.isOpen is still true');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} @onClose={{this.handleClose}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is closed');
    });

    test('returning false from the `@onClose` action prevents the single select from closing', async function (assert) {
      assert.expect(25);

      this.numbers = numbers;
      this.handleClose = (select, e) => {
        assert.true(select.isOpen, 'select.isOpen is still true');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
        return false;
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} @onClose={{this.handleClose}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is open');
      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .exists("Dropdown didn't close");
    });

    test('returning false from the `@onClose` action prevents the multiple select from closing', async function (assert) {
      assert.expect(25);

      this.numbers = numbers;
      this.handleClose = (select, e) => {
        assert.true(select.isOpen, 'select.isOpen is still true');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
        return false;
      };

      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{action (mut this.foo)}} @onClose={{this.handleClose}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is open');
      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .exists("Dropdown didn't close");
    });

    test('the `oninput` action is invoked when the user modifies the text of the search input on single selects, and the search happens', async function (assert) {
      assert.expect(28);

      this.numbers = numbers;
      this.handleInput = (value, select, e) => {
        assert.strictEqual(
          value,
          'tw',
          'The first argument is the value of the input'
        );
        assert.strictEqual(
          select.searchText,
          '',
          'select.searchText is still empty'
        );
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The third argument is an event');
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onInput={{this.handleInput}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('tw');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 3 }, 'There is three options');
      assert.dom('.ember-power-select-option:nth-child(1)').hasText('two');
      assert.dom('.ember-power-select-option:nth-child(2)').hasText('twelve');
      assert.dom('.ember-power-select-option:nth-child(3)').hasText('twenty');
    });

    test('the `oninput` action is invoked when the user modifies the text of the search input on multiple selects, and the search happens', async function (assert) {
      assert.expect(28);

      this.numbers = numbers;
      this.handleInput = (value, select, e) => {
        assert.strictEqual(
          value,
          'tw',
          'The first argument is the value of the input'
        );
        assert.strictEqual(
          select.searchText,
          '',
          'select.searchText is still empty'
        );
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The third argument is an event');
      };

      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.foo}} @onInput={{this.handleInput}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await typeInSearch('tw');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 3 }, 'There is three options');
      assert.dom('.ember-power-select-option:nth-child(1)').hasText('two');
      assert.dom('.ember-power-select-option:nth-child(2)').hasText('twelve');
      assert.dom('.ember-power-select-option:nth-child(3)').hasText('twenty');
    });

    test('if the `oninput` action of single selects returns false the search is cancelled', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.handleInput = (/* value, select, e */) => {
        return false;
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onInput={{this.handleInput}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('tw');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 20 }, 'There is the same options than before');
    });

    test('if `oninput` action of multiple selects returns false the search is cancelled', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.handleInput = (/* value, select, e */) => {
        return false;
      };

      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.foo}} @onInput={{this.handleInput}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await typeInSearch('tw');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 20 }, 'There is the same options than before');
    });

    test('the `highlight` action of the public api passed to the public actions works as expected', async function (assert) {
      assert.expect(2);
      this.options = ['foo', 'bar', 'baz'];
      this.handleOpen = (select) => {
        select.actions.highlight('baz');
      };
      await render(hbs`
      <PowerSelect @options={{this.options}} @onChange={{action (mut this.foo)}} @onOpen={{this.handleOpen}} as |option|>
        {{option}}
      </PowerSelect>
    `);
      await clickTrigger();
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 3 }, 'There is three options');
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('baz', 'The third option is highlighted');
    });

    test('The programmer can use the received public API to perform searches in single selects', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.initSearch = (select) => {
        assert.ok(true, 'The onopen action is fired');
        select.actions.search('hello');
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onOpen={{this.initSearch}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-search-input')
        .hasValue('hello', 'The search text contains the searched string');
    });

    test('The programmer can use the received public API to perform searches in mutiple selects', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.initSearch = (select) => {
        assert.ok(true, 'The onopen action is fired');
        select.actions.search('hello');
      };

      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.foo}} @onOpen={{this.initSearch}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasValue('hello', 'The search text contains the searched string');
    });

    test('The search action of multiple selects has the searchText set to the up-to-date value', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.handleSearch = (term, select) => {
        assert.strictEqual(
          term,
          'el',
          'The search term is received as 1st argument'
        );
        assert.strictEqual(
          select.searchText,
          'el',
          'the public API object has the searchText up to date'
        );
      };

      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} @search={{this.handleSearch}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await typeInSearch('el');
    });

    test('The single component invokes the `registerAPI` action with the public API object', async function (assert) {
      this.numbers = numbers;
      this.storeAPI = function (select) {
        if (select) {
          assertPublicAPIShape(assert, select);
        }
      };
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} @registerAPI={{this.storeAPI}} as |number|>
        {{number}}
      </PowerSelect>
    `);
    });

    test('The multiple component invokes the `registerAPI` action with the public API object', async function (assert) {
      this.numbers = numbers;
      this.storeAPI = function (select) {
        if (select) {
          assertPublicAPIShape(assert, select);
        }
      };
      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} @registerAPI={{this.storeAPI}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);
    });

    test('The given `scrollTo` function is invoked when a single select wants to scroll to an element', async function (assert) {
      assert.expect(22);
      this.numbers = numbers;
      this.storeAPI = (select) => {
        this.selectAPI = select;
      };
      this.scrollTo = (opt, select) => {
        assert.strictEqual(
          opt,
          'three',
          'It receives the element we want to scroll to as first argument'
        );
        assertPublicAPIShape(assert, select);
      };
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} @registerAPI={{this.storeAPI}} @scrollTo={{this.scrollTo}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      run(() => this.selectAPI.actions.scrollTo('three'));
    });

    test('The given `scrollTo` function is invoked when a multiple select wants to scroll to an element', async function (assert) {
      assert.expect(22);
      this.numbers = numbers;
      this.storeAPI = (select) => {
        this.selectAPI = select;
      };
      this.scrollTo = (opt, select) => {
        assert.strictEqual(
          opt,
          'three',
          'It receives the element we want to scroll to as first argument'
        );
        assertPublicAPIShape(assert, select);
      };
      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} @registerAPI={{this.storeAPI}} @scrollTo={{this.scrollTo}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      run(() => this.selectAPI.actions.scrollTo('three'));
    });
  }
);
