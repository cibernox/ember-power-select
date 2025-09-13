import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { render, click, triggerKeyEvent, focus } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  clickTrigger,
  typeInSearch,
} from 'ember-power-select/test-support/helpers';
import { names, numbers } from 'test-app/utils/constants';
import { tracked } from '@glimmer/tracking';
import type { TestContext } from '@ember/test-helpers';
import type { Select, Selected } from 'ember-power-select/components/power-select';

interface NumbersContext<IsMultiple extends boolean = false>
  extends TestContext {
  numbers: string[];
  options: string[];
  selected: Selected<string, IsMultiple>;
  selectAPI: Select<string, IsMultiple>;
  handleSearch: (term: string, select: Select<string, IsMultiple>) => string[] | Promise<string[]>;
  handleChange: (
    selection: Selected<string, IsMultiple>,
    select: Select<string, IsMultiple>,
    event?: Event,
  ) => void;
  onKeydown?: (
    select: Select<string, IsMultiple>,
    e: KeyboardEvent,
  ) => boolean | void | undefined;
  onFocus?: (select: Select<string, IsMultiple>, event: FocusEvent) => void;
  onBlur?: (select: Select<string, IsMultiple>, event: FocusEvent) => void;
  onOpen?: (select: Select<string, IsMultiple>, event: Event | undefined) => boolean | void | undefined;
  onClose?: (select: Select<string, IsMultiple>, event: Event | undefined) => boolean | void | undefined;
  onInput?: (term: string, select: Select<string, IsMultiple>, e: Event) => string | false | void;
  registerAPI?: (select: Select<string, IsMultiple>) => void;
  scrollTo?: (option: Selected<string>, select: Select<string, IsMultiple>) => void;
}

class User {
  @tracked name: string;

  constructor(name: string) {
    this.name = name;
  }

  isEqual(other: User | undefined) {
    return this.name === other?.name;
  }
}

interface UserContext
  extends TestContext {
  users: User[];
  selected: Selected<User>;
  onOpen?: (select: Select<User>, event: Event | undefined) => boolean | void | undefined;
}

function assertPublicAPIShape<IsMultiple extends boolean = false>(assert: Assert, select: Select<string, IsMultiple>) {
  assert.strictEqual(
    typeof select.uniqueId,
    'string',
    'select.uniqueId is a string',
  );
  assert.strictEqual(
    typeof select.isOpen,
    'boolean',
    'select.isOpen is a boolean',
  );
  assert.strictEqual(
    typeof select.disabled,
    'boolean',
    'select.disabled is a boolean',
  );
  assert.strictEqual(
    typeof select.isActive,
    'boolean',
    'select.isActive is a boolean',
  );
  assert.strictEqual(
    typeof select.loading,
    'boolean',
    'select.loading is a boolean',
  );
  assert.ok(select.options instanceof Array, 'select.options is an array');
  assert.ok(select.results instanceof Array, 'select.results is an array');
  assert.strictEqual(
    typeof select.resultsCount,
    'number',
    'select.resultsCount is a number',
  );
  assert.ok(Object.prototype.hasOwnProperty.call(select, 'selected'));
  assert.ok(Object.prototype.hasOwnProperty.call(select, 'highlighted'));
  assert.strictEqual(
    typeof select.searchText,
    'string',
    'select.searchText is a string',
  );
  assert.strictEqual(
    typeof select.lastSearchedText,
    'string',
    'select.lastSearchedText is a string',
  );
  assert.strictEqual(
    typeof select.actions.open,
    'function',
    'select.actions.open is a function',
  );
  assert.strictEqual(
    typeof select.actions.close,
    'function',
    'select.actions.close is a function',
  );
  assert.strictEqual(
    typeof select.actions.toggle,
    'function',
    'select.actions.toggle is a function',
  );
  assert.strictEqual(
    typeof select.actions.reposition,
    'function',
    'select.actions.reposition is a function',
  );
  assert.strictEqual(
    typeof select.actions.search,
    'function',
    'select.actions.search is a function',
  );
  assert.strictEqual(
    typeof select.actions.highlight,
    'function',
    'select.actions.highlight is a function',
  );
  assert.strictEqual(
    typeof select.actions.select,
    'function',
    'select.actions.select is a function',
  );
  assert.strictEqual(
    typeof select.actions.choose,
    'function',
    'select.actions.choose is a function',
  );
  assert.strictEqual(
    typeof select.actions.scrollTo,
    'function',
    'select.actions.scrollTo is a function',
  );
}

module(
  'Integration | Component | Ember Power Select (Public actions)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<NumbersContext>('The search action of single selects action receives the search term and the public API', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.handleSearch = (term: string, select: Select<string>) => {
        assert.strictEqual(
          term,
          'el',
          'The search term is received as 1st argument',
        );
        assertPublicAPIShape(assert, select);

        return numbers;
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @search={{this.handleSearch}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('el');
    });

    test<NumbersContext<true>>('The search action of multiple selects action receives the search term and the public API', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.handleSearch = (term, select) => {
        assert.strictEqual(
          term,
          'el',
          'The search term is received as 1st argument',
        );
        assertPublicAPIShape(assert, select);

        return numbers;
      };

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @search={{this.handleSearch}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await typeInSearch('el');
    });

    test<NumbersContext>('The onchange of single selects action receives the selection and the public API', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.handleChange = (selected, select) => {
        assert.strictEqual(selected, 'one', 'The first option is the selected');
        assertPublicAPIShape(assert, select);

        return numbers;
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.handleChange}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      await click('.ember-power-select-option');
    });

    test<NumbersContext<true>>('The onchange of multiple selects action receives the selection and the public API', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.handleChange = (selected, select) => {
        assert.strictEqual(selected ? selected[0] : '', 'one', 'The first option is the selected');
        assertPublicAPIShape(assert, select);
      };

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.handleChange}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await click('.ember-power-select-option');
    });

    test<NumbersContext>('The onKeydown of single selects action receives the public API and the keydown event when fired on the searchbox', async function (assert) {
      assert.expect(44);

      this.numbers = numbers;
      this.onKeydown = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onKeydown={{this.onKeydown}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 65);
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 13);
    });

    test<NumbersContext>('The `@onKeydown` can be used to easily allow to select on tab', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.onKeydown = (select, e) => {
        if (e.keyCode === 9) {
          select.actions.select(select.highlighted);
          select.actions.close();
        }
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onKeydown={{this.onKeydown}} @onChange={{fn (mut this.selected)}} as |number|>
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

    test<NumbersContext<true>>('The onKeydown of multiple selects action receives the public API and the keydown event', async function (assert) {
      assert.expect(44);

      this.numbers = numbers;
      this.onKeydown = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onKeydown={{this.onKeydown}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        13,
      );
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        65,
      );
    });

    test<NumbersContext>('returning false from the `@onKeydown` action prevents the default behaviour in single selects', async function (assert) {
      assert.expect(48);

      this.numbers = numbers;
      this.onKeydown = (select, e) => {
        assert.false(select.isOpen, 'select.isOpen is still false');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
        return false;
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @onKeydown={{this.onKeydown}} as |option|>
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

    test<NumbersContext<true>>('returning false from the `@onKeydown` action prevents the default behaviour in multiple selects', async function (assert) {
      assert.expect(24);

      this.numbers = numbers;
      this.onKeydown = (select, e) => {
        assert.false(select.isOpen, 'select.isOpen is still false');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
        return false;
      };

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @onKeydown={{this.onKeydown}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is still closed');
    });

    test<NumbersContext>('The onFocus of single selects action receives the public API and the focus event', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.onFocus = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onFocus={{this.onFocus}} @onChange={{fn (mut this.selected)}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await focus('.ember-power-select-trigger');
    });

    // Weird failure in Ember 4
    skip<NumbersContext<true>>('The onFocus of multiple selects action receives the public API and the focus event', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.onFocus = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onFocus={{this.onFocus}} @onChange={{fn (mut this.selected)}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await focus('.ember-power-select-trigger');
    });

    // Weird failure in Ember 4
    skip<NumbersContext<true>>('The onFocus of multiple selects also gets called when the thing getting the focus is the searbox', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.onFocus = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render<NumbersContext<true>>(hbs`
      <input type="text" autofocus>
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onFocus={{this.onFocus}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await focus('.ember-power-select-trigger-multiple-input');
    });

    test<NumbersContext>('The onBlur of single selects action receives the public API and the event', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.onBlur = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onBlur={{this.onBlur}} @onChange={{fn (mut this.selected)}} as |number|>
        {{number}}
      </PowerSelect>
      <input type="text" id="other-element"/>
    `);

      await focus('.ember-power-select-trigger');
      await focus('#other-element');
    });

    test<NumbersContext<true>>('The onBlur of multiple selects action receives the public API and the focus event', async function (assert) {
      assert.expect(22);

      this.numbers = numbers;
      this.onBlur = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onBlur={{this.onBlur}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
      <input type="text" id="other-element"/>
    `);

      await focus('.ember-power-select-trigger-multiple-input');
      await focus('#other-element');
    });

    test<NumbersContext>('The onBlur of multiple selects also gets called when the thing getting the focus is the searbox', async function (assert) {
      this.numbers = numbers;
      this.onBlur = (select, e) => {
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onBlur={{this.onBlur}} @onChange={{fn (mut this.selected)}} as |number|>
        {{number}}
      </PowerSelect>
      <input type="text" id="other-element"/>
    `);

      await clickTrigger();
      await focus('#other-element');
    });

    test<NumbersContext>('the `@onOpen` action is invoked just before the dropdown opens', async function (assert) {
      assert.expect(24);

      this.numbers = numbers;
      this.onOpen = (select, e) => {
        assert.false(select.isOpen, 'select.isOpen is still false');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{fn (mut this.selected)}} @onOpen={{this.onOpen}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is opened');
    });

    test<NumbersContext>('returning false from the `@onOpen` action prevents the single select from opening', async function (assert) {
      assert.expect(24);

      this.numbers = numbers;
      this.onOpen = (select, e) => {
        assert.false(select.isOpen, 'select.isOpen is still false');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
        return false;
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{fn (mut this.selected)}} @onOpen={{this.onOpen}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist("Dropdown didn't open");
    });

    test<NumbersContext<true>>('returning false from the `@onOpen` action prevents the multiple select from opening', async function (assert) {
      assert.expect(24);

      this.numbers = numbers;
      this.onOpen = (select, e) => {
        assert.false(select.isOpen, 'select.isOpen is still false');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
        return false;
      };

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{fn (mut this.selected)}} @onOpen={{this.onOpen}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist("Dropdown didn't open");
    });

    test<NumbersContext>('the `@onClose` action is invoked just before the dropdown closes', async function (assert) {
      assert.expect(24);

      this.numbers = numbers;
      this.onClose = (select, e) => {
        assert.true(select.isOpen, 'select.isOpen is still true');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{fn (mut this.selected)}} @onClose={{this.onClose}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is closed');
    });

    test<NumbersContext>('returning false from the `@onClose` action prevents the single select from closing', async function (assert) {
      assert.expect(25);

      this.numbers = numbers;
      this.onClose = (select, e) => {
        assert.true(select.isOpen, 'select.isOpen is still true');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
        return false;
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{fn (mut this.selected)}} @onClose={{this.onClose}} as |option|>
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

    test<NumbersContext<true>>('returning false from the `@onClose` action prevents the multiple select from closing', async function (assert) {
      assert.expect(25);

      this.numbers = numbers;
      this.onClose = (select, e) => {
        assert.true(select.isOpen, 'select.isOpen is still true');
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The second argument is an event');
        return false;
      };

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{fn (mut this.selected)}} @onClose={{this.onClose}} as |option|>
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

    test<NumbersContext>('the `oninput` action is invoked when the user modifies the text of the search input on single selects, and the search happens', async function (assert) {
      assert.expect(28);

      this.numbers = numbers;
      this.onInput = (value, select, e) => {
        assert.strictEqual(
          value,
          'tw',
          'The first argument is the value of the input',
        );
        assert.strictEqual(
          select.searchText,
          '',
          'select.searchText is still empty',
        );
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The third argument is an event');
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onInput={{this.onInput}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |number|>
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

    test<NumbersContext<true>>('the `oninput` action is invoked when the user modifies the text of the search input on multiple selects, and the search happens', async function (assert) {
      assert.expect(28);

      this.numbers = numbers;
      this.onInput = (value, select, e) => {
        assert.strictEqual(
          value,
          'tw',
          'The first argument is the value of the input',
        );
        assert.strictEqual(
          select.searchText,
          '',
          'select.searchText is still empty',
        );
        assertPublicAPIShape(assert, select);
        assert.ok(e instanceof window.Event, 'The third argument is an event');
      };

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onInput={{this.onInput}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |number|>
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

    test<NumbersContext>('if the `oninput` action of single selects returns false the search is cancelled', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.onInput = (/* value, select, e */) => {
        return false;
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onInput={{this.onInput}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('tw');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 20 }, 'There is the same options than before');
    });

    test<NumbersContext<true>>('if `oninput` action of multiple selects returns false the search is cancelled', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.onInput = (/* value, select, e */) => {
        return false;
      };

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onInput={{this.onInput}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await typeInSearch('tw');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 20 }, 'There is the same options than before');
    });

    test<NumbersContext>('the `highlight` action of the public api passed to the public actions works as expected', async function (assert) {
      assert.expect(2);
      this.options = ['foo', 'bar', 'baz'];
      this.onOpen = (select) => {
        select.actions.highlight('baz');
      };
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.options}} @onChange={{fn (mut this.selected)}} @onOpen={{this.onOpen}} as |option|>
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

    test<NumbersContext>('The programmer can use the received public API to perform searches in single selects', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.onOpen = (select) => {
        assert.ok(true, 'The onopen action is fired');
        select.actions.search('hello');
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onOpen={{this.onOpen}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-search-input')
        .hasValue('hello', 'The search text contains the searched string');
    });

    test<NumbersContext<true>>('The programmer can use the received public API to perform searches in mutiple selects', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.onOpen = (select) => {
        assert.ok(true, 'The onopen action is fired');
        select.actions.search('hello');
      };

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onOpen={{this.onOpen}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasValue('hello', 'The search text contains the searched string');
    });

    test<NumbersContext<true>>('The search action of multiple selects has the searchText set to the up-to-date value', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.handleSearch = (term, select) => {
        assert.strictEqual(
          term,
          'el',
          'The search term is received as 1st argument',
        );
        assert.strictEqual(
          select.searchText,
          'el',
          'the public API object has the searchText up to date',
        );

        return numbers;
      };

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @search={{this.handleSearch}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await typeInSearch('el');
    });

    test<NumbersContext>('The single component invokes the `registerAPI` action with the public API object', async function (assert) {
      this.numbers = numbers;
      this.registerAPI = function (select) {
        if (select) {
          assertPublicAPIShape(assert, select);
        }
      };
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @registerAPI={{this.registerAPI}} as |number|>
        {{number}}
      </PowerSelect>
    `);
    });

    test<NumbersContext<true>>('The multiple component invokes the `registerAPI` action with the public API object', async function (assert) {
      this.numbers = numbers;
      this.registerAPI = function (select) {
        if (select) {
          assertPublicAPIShape(assert, select);
        }
      };
      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @registerAPI={{this.registerAPI}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);
    });

    test<NumbersContext>('The given `scrollTo` function is invoked when a single select wants to scroll to an element', async function (assert) {
      assert.expect(22);
      this.numbers = numbers;
      this.registerAPI = (select) => {
        this.selectAPI = select;
      };
      this.scrollTo = (opt, select) => {
        assert.strictEqual(
          opt,
          'three',
          'It receives the element we want to scroll to as first argument',
        );
        assertPublicAPIShape(assert, select);
      };
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @registerAPI={{this.registerAPI}} @scrollTo={{this.scrollTo}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      this.selectAPI.actions.scrollTo('three');
    });

    test<NumbersContext<true>>('The given `scrollTo` function is invoked when a multiple select wants to scroll to an element', async function (assert) {
      assert.expect(22);
      this.numbers = numbers;
      this.registerAPI = (select) => {
        this.selectAPI = select;
      };
      this.scrollTo = (opt, select) => {
        console.log(opt);
        assert.strictEqual(
          opt,
          'three',
          'It receives the element we want to scroll to as first argument',
        );
        assertPublicAPIShape(assert, select);
      };
      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @registerAPI={{this.registerAPI}} @scrollTo={{this.scrollTo}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      this.selectAPI.actions.scrollTo('three');
    });

    test<NumbersContext<true>>('The programmer can use the received public API to highlight an option', async function (assert) {
      this.numbers = numbers;
      const highlightedOption = numbers[1];
      this.onOpen = (select) => {
        select.actions.highlight(highlightedOption);
      };

      await render<NumbersContext<true>>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onOpen={{this.onOpen}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();

      assert
        .dom('[aria-current="true"]')
        .hasText(
          highlightedOption ?? '',
          'The current option is the one highlighted programmatically',
        );
    });

    test<UserContext>('if the options of a single select implement `isEqual`, it is possible to highlight it programmatically', async function (assert) {
      const users = names.map((name) => new User(name));
      const highlightedOption = users[1];

      this.users = users;
      this.onOpen = (select) => {
        select.actions.highlight(new User(highlightedOption?.name ?? ''));
      };

      await render<UserContext>(hbs`
      <PowerSelect
        @options={{this.users}}
        @selected={{this.selected}}
        @onOpen={{this.onOpen}}
        @onChange={{fn (mut this.selected)}}
        as |user|
      >
        {{user.name}}
      </PowerSelect>
    `);

      await clickTrigger();

      assert
        .dom('[aria-current="true"]')
        .hasText(
          highlightedOption?.name ?? '',
          'The current option is the one highlighted programmatically',
        );
    });
  },
);
