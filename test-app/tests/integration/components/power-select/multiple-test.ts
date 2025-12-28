import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  typeInSearch,
  clickTrigger,
} from 'ember-power-select/test-support/helpers';
import {
  numbers,
  names,
  countries,
  countriesWithDisabled,
  type Country,
} from 'test-app/utils/constants';
import {
  click,
  tap,
  triggerKeyEvent,
  focus,
  render,
  type TestContext,
} from '@ember/test-helpers';
import RSVP from 'rsvp';
import { tracked } from '@glimmer/tracking';
import { isEmpty } from '@ember/utils';
import { runTask } from 'ember-lifeline';
import { TrackedArray } from 'tracked-built-ins';
import type {
  DefaultHighlightedParams,
  MatcherFn,
  MultipleSelect,
  MultipleSelected,
} from 'ember-power-select/types';

interface NumbersContext extends TestContext {
  element: HTMLElement;
  numbers: string[] | Promise<string[]>;
  selected: MultipleSelected<string>;
  searchFn: (term: string) => string[] | Promise<string[]>;
  endsWithMatcher: MatcherFn<string>;
  defaultHighlighted?:
    | string
    | ((params: DefaultHighlightedParams<string>) => string);
  foo: () => void;
  onChange: (
    selection: MultipleSelected<string>,
    select: MultipleSelect<string>,
  ) => void;
}

interface Person {
  name: string;
  surname: string;
}

interface PeopleContext extends TestContext {
  people: Person[] | Promise<Person[]>;
  selected: MultipleSelected<Person>;
  foo: () => void;
  onChange: (selected: MultipleSelected<Person>) => void;
}

interface UserContext extends TestContext {
  selected: MultipleSelected<User>;
  search: (term: string) => User[];
  onChange: (user: MultipleSelected<User>) => void;
}

interface StateContext extends TestContext {
  state: State;
  sort: (arr: string[]) => string[];
  selected: MultipleSelected<string>;
}

interface CountryContext extends TestContext {
  countries: Country[];
  selected: MultipleSelected<typeof countries>;
  foo: () => void;
  onChange: (
    selection: MultipleSelected<Country>,
    select: MultipleSelect<Country>,
  ) => void;
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

class State {
  @tracked selected: string[] | undefined = ['a'];
}

module(
  'Integration | Component | Ember Power Select (Multiple)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<NumbersContext>("Multiple selects don't have a search box by default", async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-search')
        .doesNotExist('There is no search box');
    });

    test<NumbersContext>('Multiple selects have a search box in the trigger when the search is enabled', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-trigger input').exists();
      assert.dom('.ember-power-select-dropdown input').doesNotExist();
    });

    test<NumbersContext>('Multiple selects have a search box in the dropdown when the search is enabled and search position is `after-options`', async function (assert) {
      assert.expect(2);
      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} @searchFieldPosition="before-options" as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);
      await clickTrigger();
      assert.dom('.ember-power-select-trigger input').doesNotExist();
      assert.dom('.ember-power-select-dropdown input').exists();
    });

    test<NumbersContext>('The searchbox of multiple selects has type="search" and a form attribute to prevent submitting the wrapper form when pressing enter', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-trigger input')
        .hasAttribute('type', 'search');
      assert.dom('.ember-power-select-trigger input').hasAttribute('form');
    });

    test<NumbersContext>('When the select opens, the search input (if any) in the trigger gets the focus', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-trigger-multiple-input').isFocused();
    });

    test<NumbersContext>('When the select opens and search position is `after-options`, the search input (if any) in the dropdown gets the focus', async function (assert) {
      assert.expect(1);
      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} @searchFieldPosition="before-options" as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);
      await clickTrigger();
      assert.dom('.ember-power-select-search-input').isFocused();
    });

    test<NumbersContext>("Click on an element selects it and closes the dropdown and focuses the trigger's input", async function (assert) {
      assert.expect(4);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-trigger-multiple-input').isFocused();

      await click('.ember-power-select-option:nth-child(2)');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is closed');
      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 1 }, 'There is 1 option selected');
      assert
        .dom('.ember-power-select-multiple-option')
        .includesText('two', 'The clicked element has been selected');
    });

    test<NumbersContext>('Selecting an element triggers the onchange action with the list of selected options', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.onChange = (values) => {
        assert.deepEqual(
          values,
          ['two'],
          'The onchange action is fired with the list of values',
        );
      };

      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{this.onChange}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await click('.ember-power-select-option:nth-child(2)');
    });

    test<NumbersContext>('Click an option when there is already another selects both, and triggers the onchange action with them', async function (assert) {
      assert.expect(5);

      this.numbers = numbers;
      this.selected = ['four'];
      this.onChange = (values) => {
        assert.deepEqual(
          values,
          ['four', 'two'],
          'The onchange action is fired with the list of values',
        );
        this.set('selected', values);
      };

      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.onChange}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 1 }, 'There is 1 option selected');
      await clickTrigger();
      await click('.ember-power-select-option:nth-child(2)');
      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 2 }, 'There is 2 options selected');
      assert
        .dom('.ember-power-select-multiple-option:nth-child(1)')
        .includesText('four', 'The first option is the provided one');
      assert
        .dom('.ember-power-select-multiple-option:nth-child(2)')
        .includesText('two', 'The second option is the one just selected');
    });

    test<NumbersContext>('If there is many selections, all those options are styled as `selected`', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.selected = ['four', 'two'];

      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option:nth-child(2)')
        .hasAttribute(
          'aria-selected',
          'true',
          'The second option is styled as selected',
        );
      assert
        .dom('.ember-power-select-option:nth-child(4)')
        .hasAttribute(
          'aria-selected',
          'true',
          'The 4th option is styled as selected',
        );
    });

    test<NumbersContext>('When the popup opens, the first items is highlighed, even if there is only one selection', async function (assert) {
      assert.expect(4);

      this.numbers = numbers;
      this.selected = ['four'];

      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .exists({ count: 1 }, 'There is one element highlighted');
      assert
        .dom('.ember-power-select-option[aria-selected="true"]')
        .exists({ count: 1 }, 'There is one element selected');
      assert
        .dom(
          '.ember-power-select-option[aria-current="true"][aria-selected="true"]',
        )
        .doesNotExist('They are not the same');
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('one', 'The highlighted element is the first one');
    });

    test<NumbersContext>('Clicking on an option that is already selected unselects it, closes the select and triggers the `onchange` action', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.selected = ['four'];
      this.onChange = (selected) => {
        assert.ok(isEmpty(selected), 'No elements are selected');
        this.set('selected', selected);
      };

      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.onChange}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 1 }, 'There is 1 option selected');
      await clickTrigger();
      await click('.ember-power-select-option[aria-selected="true"]');
      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 0 }, 'There is no options selected');
    });

    test<NumbersContext>('The default filtering works in multiple mode', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{this.foo}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await typeInSearch('four');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 2 }, 'Only two items matched the criteria');
    });

    test<PeopleContext>('The filtering specifying a searchkey works in multiple model', async function (assert) {
      assert.expect(8);

      this.people = [
        { name: 'María', surname: 'Murray' },
        { name: 'Søren', surname: 'Williams' },
        { name: 'João', surname: 'Jin' },
        { name: 'Miguel', surname: 'Camba' },
        { name: 'Marta', surname: 'Stinson' },
        { name: 'Lisa', surname: 'Simpson' },
      ];
      this.foo = () => {};

      await render<PeopleContext>(hbs`
      <PowerSelectMultiple @options={{this.people}} @searchField="name" @onChange={{this.foo}} @searchEnabled={{true}} as |person|>
        {{person.name}} {{person.surname}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await typeInSearch('mar');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 2 }, 'Only 2 results match the search');
      assert
        .dom('.ember-power-select-option:nth-child(1)')
        .hasText('María Murray');
      assert
        .dom('.ember-power-select-option:nth-child(2)')
        .hasText('Marta Stinson');
      await typeInSearch('mari');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 1 }, 'Only 1 results match the search');
      assert.dom('.ember-power-select-option').hasText('María Murray');
      await typeInSearch('o');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 2 }, 'Only 2 results match the search');
      assert
        .dom('.ember-power-select-option:nth-child(1)')
        .hasText('Søren Williams');
      assert.dom('.ember-power-select-option:nth-child(2)').hasText('João Jin');
    });

    test<NumbersContext>('The filtering specifying a custom matcher works in multiple model', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.endsWithMatcher = function (value, text) {
        return value?.slice(text.length * -1) === text ? 0 : -1;
      };
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @matcher={{this.endsWithMatcher}} @onChange={{this.foo}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await typeInSearch('on');
      assert
        .dom('.ember-power-select-option')
        .hasText('No results found', 'No number ends in "on"');
      await typeInSearch('teen');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 7 }, 'There is 7 number that end in "teen"');
    });

    test<NumbersContext>('The search using a custom action works int multiple mode', async function (assert) {
      const done = assert.async();
      assert.expect(1);

      this.searchFn = function (term: string) {
        return new RSVP.Promise((resolve) => {
          runTask(
            this,
            function () {
              resolve(numbers.filter((str) => str.indexOf(term) > -1));
            },
            100,
          );
        });
      };
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await typeInSearch('teen');

      setTimeout(function () {
        assert.dom('.ember-power-select-option').exists({ count: 7 });
        done();
      }, 150);
    });

    test<NumbersContext>('Pressing ENTER when the select is closed opens and nothing is written on the box opens it', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        27,
      );
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is not rendered');
      assert.dom('.ember-power-select-trigger-multiple-input').isFocused();
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        13,
      );
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
    });

    test<NumbersContext>('Pressing ENTER on a multiple select with `searchEnabled=false` when it is closed opens it', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await focus('.ember-power-select-trigger');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is not rendered');
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 13);
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
    });

    test<NumbersContext>('Pressing ENTER over a highlighted element selects it', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.onChange = (selected) => {
        assert.deepEqual(selected, ['two']);
        this.set('selected', selected);
      };
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.onChange}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        40,
      );
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-trigger')
        .includesText('two', 'The element was selected');
    });

    test<NumbersContext>('Pressing ENTER over a highlighted element on a multiple select without a searchbox selects it', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 13);
      assert
        .dom('.ember-power-select-trigger')
        .includesText('two', 'The element was selected');
    });

    test<NumbersContext>('Pressing ENTER over a highlighted element on a select without a searchbox selects it', async function (assert) {
      assert.expect(4);

      this.numbers = numbers;
      this.onChange = (selected) => {
        assert.deepEqual(selected, ['two']);
        this.set('selected', selected);
      };
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.onChange}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 0 }, 'There is no elements selected');
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 40);
      await triggerKeyEvent('.ember-power-select-trigger', 'keydown', 13);
      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 1 }, 'There is one element selected');
      assert
        .dom('.ember-power-select-trigger')
        .includesText('two', 'The element was selected');
    });

    test<NumbersContext>('Pressing ENTER over a highlighted element what is already selected closes the select without doing anything and focuses the trigger', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.selected = ['two'];
      this.onChange = (val) => {
        assert.ok(false, 'This should never be invoked');
        this.set('selected', val);
      };
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.onChange}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        40,
      );
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-trigger')
        .includesText('two', 'The element is still selected');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is not rendered');
      assert.dom('.ember-power-select-trigger-multiple-input').isFocused();
    });

    test<NumbersContext>('Pressing BACKSPACE on the search input when there is text on it does nothing special', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.selected = ['two'];
      this.onChange = (val) => {
        assert.ok(false, 'This should not be called');
        this.set('selected', val);
      };
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.onChange}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await typeInSearch('four');
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        8,
      );
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropown is still opened');
    });

    test<NumbersContext>("Pressing BACKSPACE on the search input when it's empty removes the last selection and performs a search for that text immediately, opening the select if closed", async function (assert) {
      assert.expect(9);

      this.numbers = numbers;
      this.selected = ['two'];
      this.onChange = (val, dropdown) => {
        assert.deepEqual(val, [], 'The selected item was unselected');
        this.set('selected', val);
        assert.ok(
          dropdown.actions.close,
          'The dropdown API is received as second argument',
        );
      };
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{this.onChange}} @selected={{this.selected}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 1 }, 'There is one element selected');
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        8,
      );
      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 0 }, 'There is no elements selected');
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasValue('two', 'The text of the seach input is two now');
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropown has been opened');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 1 }, 'The list has been filtered');
      const input = this.element?.querySelector(
        '.ember-power-select-trigger-multiple-input',
      ) as HTMLInputElement | undefined;
      assert.strictEqual(input?.selectionStart ?? 0, 3);
      assert.strictEqual(input?.selectionEnd ?? 0, 3);
    });

    test<CountryContext>("Pressing BACKSPACE on the search input when it's empty removes the last selection and performs a search for that text immediatly (when options are not strings)", async function (assert) {
      assert.expect(7);

      this.countries = countries;
      if (countries[2] && countries[4]) {
        this.selected = [countries[2], countries[4]];
      }
      this.onChange = (val, dropdown) => {
        assert.deepEqual(
          val,
          [countries[2]],
          'The selected item was unselected',
        );
        this.set('selected', val);
        assert.ok(
          dropdown.actions.close,
          'The dropdown API is received as second argument',
        );
      };
      await render<CountryContext>(hbs`
      <PowerSelectMultiple @options={{this.countries}} @selected={{this.selected}} @onChange={{this.onChange}} @searchField="name" @searchEnabled={{true}} as |c|>
        {{c.name}}
      </PowerSelectMultiple>
    `);
      await clickTrigger();
      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 2 }, 'There is two elements selected');
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        8,
      );
      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 1 }, 'There is one element selected');
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasValue('Latvia', 'The text of the seach input is two "Latvia"');
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropown is still opened');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 1 }, 'The list has been filtered');
    });

    test<NumbersContext>("Pressing BACKSPACE on the search input when it's empty removes the last selection ALSO when that option didn't come from the outside", async function (assert) {
      assert.expect(5);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await click('.ember-power-select-option:nth-child(3)');
      await clickTrigger();
      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 1 }, 'There is one element selected');
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        8,
      );
      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 0 }, 'There is no elements selected');
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasValue('three', 'The text of the seach input is three now');
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropown is still opened');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 1 }, 'The list has been filtered');
    });

    test<NumbersContext>("Pressing BACKSPACE on the search input when it's empty doesnt trigger error", async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
        <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
          {{option}}
        </PowerSelectMultiple>
      `);

      await clickTrigger();
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        8,
      );

      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 0 }, 'There is no elements selected');
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is still opened');
    });

    test<NumbersContext>('If the multiple component is focused, pressing KEYDOWN opens it', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{this.foo}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        27,
      );
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed');
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        40,
      );
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
    });

    test<NumbersContext>('If the multiple component is focused, pressing KEYUP opens it', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{this.foo}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        27,
      );
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The select is closed');
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        38,
      );
      assert.dom('.ember-power-select-dropdown').exists('The select is opened');
    });

    test<NumbersContext>('The placeholder is only visible when no options are selected', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @placeholder="Select stuff here" @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute(
          'placeholder',
          'Select stuff here',
          'There is a placeholder',
        );
      await clickTrigger();
      await click('.ember-power-select-option:nth-child(2)');
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute('placeholder', '', 'The placeholder is gone');
    });

    test<NumbersContext>('The placeholder is visible when no options are selected and search is disabled', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @placeholder="Select stuff here" as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-placeholder')
        .hasText('Select stuff here', 'There is a placeholder');
      await clickTrigger();
      await click('.ember-power-select-option:nth-child(2)');
      assert
        .dom('.ember-power-select-placeholder')
        .doesNotExist('The placeholder is gone');
    });

    test<NumbersContext>('If the placeholder is null the placeholders shouldn\'t be "null" (issue #94)', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute('placeholder', '', 'Input does not have a placeholder');
      await clickTrigger();
      await click('.ember-power-select-option:nth-child(2)');
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute(
          'placeholder',
          '',
          'Input still does not have a placeholder',
        );
      await click('.ember-power-select-multiple-remove-btn');
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute(
          'placeholder',
          '',
          'Input still does not have a placeholder',
        );
    });

    test<NumbersContext>('Selecting and removing should result in desired behavior', async function (assert) {
      assert.expect(3);
      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);
      await clickTrigger();
      await click('.ember-power-select-option:nth-child(2)');
      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 1 }, 'Should add selected option');
      await click('.ember-power-select-multiple-remove-btn');
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute(
          'placeholder',
          '',
          'Input still does not have a placeholder',
        );
      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 0 }, 'Should remove selected option');
    });

    test<NumbersContext>('Selecting and removing can also be done with touch events', async function (assert) {
      assert.expect(3);
      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);
      await clickTrigger();
      await click('.ember-power-select-option:nth-child(2)');
      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 1 }, 'Should add selected option');
      await tap('.ember-power-select-multiple-remove-btn');
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute(
          'placeholder',
          '',
          'Input still does not have a placeholder',
        );
      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 0 }, 'Should remove selected option');
    });

    test<NumbersContext>('Typing in the input opens the component and filters the options', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await typeInSearch('fo');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 2 }, 'The dropdown is opened and results filtered');
    });

    test<NumbersContext>('Typing in the input opens the component and filters the options also with async searches', async function (assert) {
      assert.expect(1);

      this.searchFn = (term) => {
        return new RSVP.Promise((resolve) => {
          runTask(
            this,
            function () {
              resolve(numbers.filter((str) => str.indexOf(term) > -1));
            },
            100,
          );
        });
      };

      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @search={{this.searchFn}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await typeInSearch('fo');
      const done = assert.async();

      setTimeout(function () {
        assert
          .dom('.ember-power-select-option')
          .exists({ count: 2 }, 'The dropdown is opened and results filtered');
        done();
      }, 150);
    });

    test<NumbersContext>('The publicAPI is yielded as second argument in multiple selects', async function (assert) {
      assert.expect(2);
      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option select|>
        {{select.lastSearchedText}}:{{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await typeInSearch('tw');
      assert.dom('.ember-power-select-option').hasText('tw:two');
      await click('.ember-power-select-option');
      await clickTrigger();
      await typeInSearch('thr');
      assert
        .dom('.ember-power-select-trigger')
        .includesText('thr:two', 'The trigger also receives the public API');
    });

    test<NumbersContext>('The search input is cleared when the component is closed', async function (assert) {
      assert.expect(3);
      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
      <div id="other-thing">Other div</div>
    `);

      await clickTrigger();
      await typeInSearch('asjdnah');
      assert.dom('.ember-power-select-option').hasText('No results found');
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasValue('asjdnah');
      await click('#other-thing');
      assert.dom('.ember-power-select-trigger-multiple-input').hasValue('');
    });

    test<NumbersContext>('When hitting ENTER after a search with no results, the component is closed but the onchange function is not invoked', async function (assert) {
      assert.expect(3);
      this.numbers = numbers;
      this.onChange = () => {
        assert.ok(false, 'The handle change should not be called');
      };
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.onChange}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await typeInSearch('asjdnah');
      assert.dom('.ember-power-select-option').hasText('No results found');
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        13,
      );
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('The dropdown is closed');
      assert.dom('.ember-power-select-trigger-multiple-input').isFocused();
    });

    test<NumbersContext>('The trigger of multiple selects have a special class to distinguish them from regular ones, even if you pass them another one', async function (assert) {
      assert.expect(2);
      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @triggerClass="foobar-trigger" @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasClass(
          'ember-power-select-multiple-trigger',
          'The trigger has the default class',
        );
      assert
        .dom('.ember-power-select-trigger')
        .hasClass('foobar-trigger', 'The trigger has the given class');
    });

    test<NumbersContext>('The component works when the array of selected elements is mutated in place instead of replaced', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.selected = new TrackedArray();
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);
      await clickTrigger();
      if (numbers[3]) {
        this.selected.push(numbers[3]);
      }
      await click('.ember-power-select-option');
      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 2 }, 'Two elements are selected');
    });

    test<NumbersContext>('When the input inside the multiple select gets focused, the trigger and the dropdown gain special `--active` classes', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .doesNotHaveClass(
          'ember-power-select-trigger--active',
          'The trigger does not have the class',
        );
      await clickTrigger();
      assert
        .dom('.ember-power-select-trigger')
        .hasClass(
          'ember-power-select-trigger--active',
          'The trigger has the class',
        );
      assert
        .dom('.ember-power-select-dropdown')
        .hasClass(
          'ember-power-select-dropdown--active',
          'The dropdown has the class',
        );
    });

    test<NumbersContext>('When the power select multiple uses the default component and the search is enabled, the trigger has `tabindex=-1`', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('tabindex', '-1', 'The trigger has tabindex=-1');
    });

    test<NumbersContext>('When the power select multiple uses the default component and the search is disabled, the trigger has `tabindex=0`', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('tabindex', '0', 'The trigger has tabindex=0');
    });

    test<NumbersContext>('When the power select multiple uses the default component and the search is enabled, and the component receives an specific tabindex, the trigger has tabindex=-1, and the tabindex is applied to the searchbox inside', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @tabindex="3" @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('tabindex', '-1', 'The trigger has tabindex=1');
      assert
        .dom('.ember-power-select-trigger-multiple-input')
        .hasAttribute('tabindex', '3', 'The searchbox has tabindex=3');
    });

    test<NumbersContext>('Multiple selects honor the `defaultHighlighted` option', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.defaultHighlighted = numbers[3];
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @defaultHighlighted={{this.defaultHighlighted}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText(
          'four',
          'the given defaultHighlighted element is highlighted instead of the first, as usual',
        );
    });

    test<UserContext>('If the options of a multiple select implement `isEqual`, that option is used to determine whether or not two items are the same', async function (assert) {
      this.search = (term: string) => {
        return names
          .filter((n) => n.indexOf(term) > -1)
          .map((name) => new User(name));
      };

      await render<UserContext>(hbs`
      <PowerSelectMultiple
        @selected={{this.selected}}
        @onChange={{fn (mut this.selected)}}
        @searchEnabled={{true}}
        @search={{this.search}} as |user|>
        {{user.name}}
      </PowerSelectMultiple>
    `);

      await typeInSearch('M');
      await click('.ember-power-select-option:nth-child(2)');
      await typeInSearch('Mi');
      assert
        .dom('.ember-power-select-option')
        .hasAttribute(
          'aria-selected',
          'true',
          'The item in the list is marked as selected',
        );
      await click('.ember-power-select-option'); // select the same user again should remove it
      assert.dom('.ember-power-select-multiple-option').exists({ count: 0 });
    });

    test<CountryContext>('When there is an option which is disabled the css class "ember-power-select-multiple-option--disabled" should be added', async function (assert) {
      assert.expect(2);

      this.countries = countriesWithDisabled;
      const countriesWithDisabledLength = this.countries.length;
      let disabledNumCountries = 0;
      for (let i = 0; i < countriesWithDisabledLength; i++) {
        if (this.countries[i]?.disabled) {
          disabledNumCountries++;
        }
      }

      assert.notEqual(
        disabledNumCountries,
        0,
        'There is at least one disabled option',
      );
      this.selected = countriesWithDisabled;
      await render<CountryContext>(hbs`
      <PowerSelectMultiple @options={{this.countries}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option.name}}
      </PowerSelectMultiple>
    `);
      assert
        .dom(
          '.ember-power-select-multiple-options .ember-power-select-multiple-option--disabled',
        )
        .exists(
          { count: disabledNumCountries },
          'The class "ember-power-select-multiple-option--disabled" is added to disabled options',
        );
    });

    test<NumbersContext>('The title is rendered in the trigger of multiple selects', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @onChange={{this.foo}} @title="The title" as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('title', 'The title');
    });

    test<NumbersContext>('triggerComponent argument could be passed with undefined', async function (assert) {
      this.numbers = numbers;
      this.selected = numbers.slice(0, 1);

      await render<NumbersContext>(hbs`
      <PowerSelectMultiple
        @triggerComponent={{undefined}}
        @options={{this.numbers}}
        @onChange={{fn (mut this.selected)}}
        @selected={{this.selected}}
        as |option|
      >
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 1 }, 'Shows selected option');
    });

    test<NumbersContext>('buildSelection argument could be passed with undefined', async function (assert) {
      this.numbers = numbers;

      await render<NumbersContext>(hbs`
      <PowerSelectMultiple
        @buildSelection={{undefined}}
        @options={{this.numbers}}
        @onChange={{fn (mut this.selected)}}
        @selected={{this.selected}}
        as |option|
      >
        {{option}}
      </PowerSelectMultiple>
    `);
      await clickTrigger();
      await click('.ember-power-select-option');

      assert
        .dom('.ember-power-select-multiple-option')
        .exists({ count: 1 }, 'Shows selected option');
    });

    test<NumbersContext>('Multiple selects: The label was rendered when it was passed with `@labelText="Label for select` and is matching with trigger id', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @labelText="Label for select" @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert.dom('.ember-power-select-label').exists('Label is present');

      assert.dom('.ember-power-select-label').hasText('Label for select');

      assert
        .dom('.ember-power-select-label')
        .hasTagName('div');
    });

    test<NumbersContext>('Multiple selects: The label was rendered when it was passed with `@labelText="Label for select`, `@labelTag="label"` and is matching with trigger id', async function (assert) {
      assert.expect(4);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @labelText="Label for select" @labelTag="label" @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert.dom('.ember-power-select-label').exists('Label is present');

      assert.dom('.ember-power-select-label').hasText('Label for select');

      assert
        .dom('.ember-power-select-label')
        .hasTagName('label');

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute(
          'id',
          document
            .querySelector('.ember-power-select-label')
            ?.getAttribute('for') ?? '',
          'The for from label is matching with id of trigger',
        );
    });

    test<NumbersContext>('Multiple selects: The default label is rendered as a label element when @labelTag is not provided', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @labelText="Label for select" @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      const labelElement = document.querySelector('.ember-power-select-label');

      assert.equal(
        labelElement?.tagName,
        'DIV',
        'The label is rendered as a div element by default',
      );
    });

    test<NumbersContext>('Multiple selects: Test `@placeholder` and `@searchPlaceholder` with `@searchEnabled={{true}}` and `@searchFieldPosition="before-options"`', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @labelText="Label for select" @placeholder="Placeholder" @searchEnabled={{true}} @searchPlaceholder="Search Placeholder" @searchFieldPosition="before-options" @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      assert
        .dom('.ember-power-select-placeholder')
        .exists('Placeholder is present');

      assert.dom('.ember-power-select-placeholder').hasText('Placeholder');

      await clickTrigger();

      assert
        .dom('.ember-power-select-search-input')
        .hasAttribute(
          'placeholder',
          'Search Placeholder',
          'The placeholder in input field is present and has value "Search Placeholder"',
        );
    });

    test<StateContext>('BUGFIX: Rendering issue, when input field is in trigger and complete power select component will be destroyed (issue #1954)', async function (assert) {
      assert.expect(1);

      this.state = new State();

      this.sort = <T>(arr: T[]): T[] => arr.sort();

      await render<StateContext>(hbs`
      {{#if this.state.selected}}
        <PowerSelect
          @multiple={{true}}
          @options={{array "a" "b" "c"}}
          @selected={{this.sort this.state.selected}}
          @searchEnabled={{true}}
          @onChange={{fn (mut this.state.selected)}}
          as |option|
        >
          {{option}}
        </PowerSelect>
      {{/if}}
    `);

      this.state.selected = undefined;

      assert.ok(true);
    });
  },
);
