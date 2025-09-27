import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import {
  render,
  click,
  triggerKeyEvent,
  focus,
  settled,
  waitFor,
  type TestContext,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  typeInSearch,
  clickTrigger,
  findContains,
} from 'ember-power-select/test-support/helpers';
import RSVP from 'rsvp';
import { tracked } from '@glimmer/tracking';
import { runTask } from 'ember-lifeline';
import {
  numbers,
  names,
  countries,
  digits,
  type Country,
} from 'test-app/utils/constants';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import ArrayProxy from '@ember/array/proxy';
import ObjectProxy from '@ember/object/proxy';
import { TrackedArray } from 'tracked-built-ins';
import { modifier } from 'ember-modifier';
import PowerSelectBeforeOptionsComponent, {
  type PowerSelectBeforeOptionsSignature,
} from 'ember-power-select/components/power-select/before-options';
import type { ComponentLike } from '@glint/template';
import type {
  DefaultHighlightedParams,
  MatcherFn,
} from 'ember-power-select/utils/group-utils';
import type {
  PromiseProxy,
  Selected,
} from 'ember-power-select/components/power-select';
import type { CalculatePosition } from 'ember-basic-dropdown/utils/calculate-position';

interface NumbersContext<IsMultiple extends boolean = false>
  extends TestContext {
  numbers: string[] | Promise<string[]>;
  selected: string | null | undefined | Promise<string | null | undefined>;
  search: () => Promise<string[]> | string[];
  proxy: string[] | Promise<string[]>;
  endsWithMatcher: MatcherFn<string>;
  defaultHighlighted?:
    | string
    | ((params: DefaultHighlightedParams<string>) => string);
  destinationElement?: HTMLElement | undefined;
  ref: any;
  foo: () => void;
  renderInPlace?: boolean;
  calculatePosition: CalculatePosition;
  beforeOptionsComponent: ComponentLike<
    PowerSelectBeforeOptionsSignature<string, unknown, IsMultiple>
  >;
}

interface NamesContext extends TestContext {
  names: string[];
  foo: () => void;
}

interface CountriesContext extends TestContext {
  countries: Country[];
  country: Selected<Country>;
  proxy: PromiseProxy<Country | null | undefined>;
  foo: () => void;
  updateProxy: () => void;
}

interface Person {
  name: string;
  surname: string;
}

interface PeopleContext extends TestContext {
  people: Person[];
  nameOrSurnameNoDiacriticsCaseSensitive: MatcherFn<Person>;
  foo: () => void;
}

interface UserContext extends TestContext {
  selected: Selected<User>;
  search: (term: string) => User[];
  onChange: (user: Selected<User>) => void;
}

interface OptionContext extends TestContext {
  options: string[];
  selected: Selected<string>;
  refreshCollection: () => void;
}

interface DigitsContext extends TestContext {
  digits: typeof digits;
  selected: Selected<typeof digits>;
}

interface Pet {
  name: string;
}

interface MainUserContext extends TestContext {
  mainUser: {
    pets: Pet[];
    selected: Selected<Pet> | Promise<Selected<Pet>>;
  };
  foo: (selected: Selected<Pet>) => void;
}

const PromiseArrayProxy = ArrayProxy.extend(PromiseProxyMixin);
const PromiseObject = ObjectProxy.extend(PromiseProxyMixin);

class User {
  @tracked name: string;

  constructor(name: string) {
    this.name = name;
  }

  isEqual(other: User | undefined) {
    return this.name === other?.name;
  }
}

module(
  'Integration | Component | Ember Power Select (General behavior)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<NumbersContext>('Click in the trigger of a closed select opens the dropdown', async function (assert) {
      assert.expect(2);
      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is not rendered');

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
    });

    test<NumbersContext>('Click in the trigger of an opened select closes the dropdown', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is not rendered');
    });

    test<NumbersContext>('Search functionality is disabled by default', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-search')
        .doesNotExist('The search box is NOT rendered');
    });

    test<NumbersContext>('The label was rendered when it was passed with `@labelText="Label for select` and is matching with trigger id', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @labelText="Label for select" @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert.dom('.ember-power-select-label').exists('Label is present');

      assert.dom('.ember-power-select-label').hasText('Label for select');

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

    test<NumbersContext>('The search functionality can be enabled by passing `@searchEnabled={{true}}`', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @searchEnabled={{true}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
      assert
        .dom('.ember-power-select-search')
        .exists('The search box is rendered');
    });

    test<NumbersContext>('The search box position is inside the trigger by passing `@searchFieldPosition="trigger"`', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @searchEnabled={{true}} @searchFieldPosition="trigger" @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger input[type="search"]')
        .exists('The search box is rendered in trigger');

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
      assert
        .dom('.ember-power-select-search')
        .doesNotExist('The search box does not exists in dropdown');
    });

    test<NumbersContext>("The search box shouldn't gain focus if autofocus is disabled", async function (assert) {
      assert.expect(1);
      this.numbers = numbers;
      this.foo = () => {};

      this.beforeOptionsComponent = PowerSelectBeforeOptionsComponent;

      await render<NumbersContext>(hbs`
      {{#let (component (ensure-safe-component this.beforeOptionsComponent) autofocus=false) as |BeforeOptionsComponent|}}
        <PowerSelect
          @options={{this.numbers}}
          @onChange={{this.foo}}
          @searchEnabled={{true}}
          @beforeOptionsComponent={{BeforeOptionsComponent}} as |option|>
          {{option}}
        </PowerSelect>
      {{/let}}
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-search-input')
        .isNotFocused('The search box is not focused after opening select');
    });

    test<NumbersContext>('Each option of the select is the result of yielding an item', async function (assert) {
      assert.expect(4);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option')
        .exists(
          { count: numbers.length },
          'There is as many options in the markup as in the supplied array',
        );
      assert.dom('.ember-power-select-option:nth-child(1)').hasText('one');
      assert.dom('.ember-power-select-option:nth-child(10)').hasText('ten');
      assert
        .dom('.ember-power-select-option:nth-child(14)')
        .hasText('fourteen');
    });

    test<NumbersContext>("If the passed options is a promise and it's not resolved the component shows a Loading message", async function (assert) {
      assert.expect(4);

      this.numbers = [];
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      this.set(
        'numbers',
        new RSVP.Promise((resolve) => {
          runTask(
            this,
            function () {
              resolve(numbers);
            },
            150,
          );
        }),
      );

      void clickTrigger();
      await waitFor('.ember-power-select-options');
      assert
        .dom('.ember-power-select-option')
        .hasText(
          'Loading options...',
          'The loading message appears while the promise is pending',
        );
      assert
        .dom('.ember-power-select-option')
        .hasClass(
          'ember-power-select-option--loading-message',
          'The row has a special class to differentiate it from regular options',
        );
      await settled();
      assert
        .dom('.ember-power-select-option')
        .doesNotIncludeText('Loading options', 'The loading message is gone');
      assert
        .dom('.ember-power-select-option')
        .exists(
          { count: 20 },
          'The results appear when the promise is resolved',
        );
    });

    // loadingMessage with false brings default text, so the test and checks are incorrect
    // test<NumbersContext>("If the passed options is a promise and it's not resolved but the `loadingMessage` attribute is false, no loading message is shown", async function (assert) {
    //   assert.expect(2);
    //   this.numbers = [];
    //   this.foo = () => {};

    //   await render<NumbersContext>(hbs`
    //   <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} @loadingMessage={{false}} as |option|>
    //     {{option}}
    //   </PowerSelect>
    // `);

    //   this.set(
    //     'numbers',
    //     new RSVP.Promise((resolve) => {
    //       runTask(
    //         this,
    //         function () {
    //           resolve(numbers);
    //         },
    //         100,
    //       );
    //     }),
    //   );
    //   clickTrigger();

    //   assert
    //     .dom('.ember-power-select-option')
    //     .doesNotExist('No loading options message is displayed');
    //   await settled();
    //   assert
    //     .dom('.ember-power-select-option')
    //     .exists(
    //       { count: 20 },
    //       'The results appear when the promise is resolved',
    //     );
    // });

    test<NumbersContext>('If a placeholder is provided, it shows while no element is selected', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @placeholder="abracadabra" @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger .ember-power-select-placeholder')
        .hasText(
          'abracadabra',
          'The placeholder is rendered when there is no element',
        );
      await clickTrigger();
      await click('.ember-power-select-option:nth-child(4)');
      assert
        .dom('.ember-power-select-trigger .ember-power-select-placeholder')
        .doesNotExist('The placeholder is gone');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('four', 'The selected item replaced it');
    });

    test<NumbersContext>('If a `@searchPlaceholder` is provided, it shows on the searchbox of single selects while nothing is there', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @searchEnabled={{true}} @searchPlaceholder="foobar yo!" @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-search-input')
        .hasAttribute(
          'placeholder',
          'foobar yo!',
          'The searchbox has the proper placeholder',
        );
    });

    test<NumbersContext>("If the `@selected` value changes the select gets updated, but the `@onChange` action doesn't fire", async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.selected = null;
      this.foo = function () {
        assert.ok(false, 'The onchange action is never fired');
      };

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} @selected={{this.selected}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      this.set('selected', 'three');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('three', 'The `three` element is selected');
      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('three', 'The proper option gets highlighed');
      assert
        .dom('.ember-power-select-option[aria-selected="true"]')
        .hasText('three', 'The proper option gets selected');
    });

    test<NumbersContext>('If the user selects a value and later on the selected value changes from the outside, the components updates too', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.selected = null;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'Nothing is selected');
      await clickTrigger();
      await click('.ember-power-select-option:nth-child(4)');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('four', '"four" has been selected');
      this.set('selected', 'three');
      assert
        .dom('.ember-power-select-trigger')
        .hasText(
          'three',
          '"three" has been selected because a change came from the outside',
        );
    });

    test<NumbersContext>('If the user passes `@renderInPlace={{true}}` the dropdown is added below the trigger instead of in the root', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @renderInPlace={{true}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is inside the component');
    });

    test<NumbersContext>('If the user passes `@closeOnSelect={{false}}` the dropdown remains visible after selecting an option with the mouse', async function (assert) {
      assert.expect(4);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @closeOnSelect={{false}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is not rendered');
      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
      await click('.ember-power-select-option:nth-child(4)');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('four', '"four" has been selected');
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
    });

    test<NumbersContext>('If the user passes `@closeOnSelect={{false}}` the dropdown remains visible after selecting an option with the with the keyboard', async function (assert) {
      assert.expect(4);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @closeOnSelect={{false}} @onChange={{fn (mut this.selected)}} @searchEnabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is not rendered');
      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 13);
      assert
        .dom('.ember-power-select-trigger')
        .hasText('one', '"one" has been selected');
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
    });

    test<NumbersContext>('If the content of the options is refreshed (starting with empty array proxy) the available options should also refresh', async function (assert) {
      const done = assert.async();
      assert.expect(2);

      const data: string[] = new TrackedArray();
      this.proxy = data;
      this.search = () => {
        return new RSVP.Promise((resolve) => {
          resolve(data);
          runTask(
            this,
            function () {
              data.push('one');
            },
            100,
          );
        });
      };

      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect
        @options={{this.proxy}}
        @search={{this.search}}
        @searchEnabled={{true}}
        @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>`);

      await clickTrigger();
      void typeInSearch('o');

      setTimeout(function () {
        assert
          .dom('.ember-power-select-option')
          .exists(
            { count: 1 },
            'The dropdown is opened and results shown after proxy is updated',
          );
        assert.dom('.ember-power-select-option').hasText('one');
        done();
      }, 150);
    });

    test<NumbersContext>('If the content of the options is updated (starting with populated array proxy) the available options should also refresh', async function (assert) {
      const done = assert.async();
      assert.expect(5);

      const data = new TrackedArray(['one']);
      this.proxy = data;
      this.search = () => {
        return new RSVP.Promise((resolve) => {
          resolve(data);
          runTask(
            this,
            function () {
              data.push('owner');
            },
            100,
          );
        });
      };

      this.foo = () => {};

      await render<NumbersContext>(
        hbs`<PowerSelect @options={{this.proxy}} @searchEnabled={{true}} @search={{this.search}} @onChange={{this.foo}} as |option|> {{option}} </PowerSelect>`,
      );

      await clickTrigger();

      assert
        .dom('.ember-power-select-option')
        .exists(
          'The dropdown is opened and results shown with initial proxy contents',
        );
      assert.dom('.ember-power-select-option').hasText('one');

      void typeInSearch('o');

      setTimeout(function () {
        assert
          .dom('.ember-power-select-option')
          .exists(
            { count: 2 },
            'The dropdown is opened and results shown after proxy is updated',
          );
        assert.dom('.ember-power-select-option:nth-child(1)').hasText('one');
        assert.dom('.ember-power-select-option:nth-child(2)').hasText('owner');
        done();
      }, 150);
    });

    test<NumbersContext>('If the content of the options is refreshed while opened the first element of the list gets highlighted', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @searchEnabled={{true}} @closeOnSelect={{false}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);
      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('two', 'The second options is highlighted');
      this.set('numbers', ['foo', 'bar', 'baz']);
      await settled();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('foo', 'The first element is highlighted');
    });

    test<NumbersContext>('If the user passes `dropdownClass` the dropdown content should have that class', async function (assert) {
      assert.expect(1);

      this.numbers = [];
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @dropdownClass="this-is-a-test-class" as |option|>
        {{option}}
      </PowerSelect>
    `);
      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .hasClass('this-is-a-test-class', 'dropdownClass can be customized');
    });

    test<NumbersContext>('The filtering is reverted after closing the select', async function (assert) {
      assert.expect(2);
      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <div id="outside-div"></div>
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @searchEnabled={{true}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('th');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 2 }, 'the dropdown has filtered the results');
      await click('#outside-div');
      await clickTrigger();
      assert
        .dom('.ember-power-select-option')
        .exists(
          { count: numbers.length },
          'the dropdown has shows all results',
        );
    });

    test<NumbersContext>('The publicAPI is yielded as second argument in single selects', async function (assert) {
      assert.expect(2);
      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @searchEnabled={{true}} @onChange={{fn (mut this.selected)}} as |option select|>
        {{select.lastSearchedText}}:{{option}}
      </PowerSelect>
    `);
      await clickTrigger();
      await typeInSearch('tw');
      assert
        .dom('.ember-power-select-option')
        .hasText('tw:two', 'Each option receives the public API');
      await click('.ember-power-select-option');
      await clickTrigger();
      await typeInSearch('thr');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('thr:two', 'The trigger also receives the public API');
    });

    test<NumbersContext>('If there is no search action and the options is empty the select shows the default "No results found" message', async function (assert) {
      this.numbers = [];
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);
      await clickTrigger();
      assert.dom('.ember-power-select-option').exists({ count: 1 });
      assert.dom('.ember-power-select-option').hasText('No results found');
      assert
        .dom('.ember-power-select-option')
        .hasClass(
          'ember-power-select-option--no-matches-message',
          'The row has a special class to differentiate it from regular options',
        );
    });

    test<NumbersContext>('If there is a search action and the options is empty it shows the `searchMessage`, and if after searching there is no results, it shows the `noResults` message', async function (assert) {
      this.numbers = [];
      this.search = () => [];
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @search={{this.search}} @options={{this.numbers}} @searchEnabled={{true}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);
      await clickTrigger();
      assert.dom('.ember-power-select-option').exists({ count: 1 });
      assert.dom('.ember-power-select-option').hasText('Type to search');
      await typeInSearch('foo');
      assert.dom('.ember-power-select-option').exists({ count: 1 });
      assert.dom('.ember-power-select-option').hasText('No results found');
    });

    test<NumbersContext>('The default "no options" message can be customized passing `noMatchesMessage="other message"`', async function (assert) {
      this.numbers = [];
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @noMatchesMessage="Nope" @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);
      await clickTrigger();
      assert.dom('.ember-power-select-option').exists({ count: 1 });
      assert.dom('.ember-power-select-option').hasText('Nope');
    });

    test<NumbersContext>("If there is a search action, the options are empty and the `searchMessage` in intentionally empty, it doesn't show anything, and if you search and there is no results it shows the `noResultsMessage`", async function (assert) {
      this.numbers = [];
      this.search = () => [];
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @search={{this.search}} @searchMessage="" @searchEnabled={{true}} @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);
      await clickTrigger();
      assert.dom('.ember-power-select-option').exists({ count: 0 });
      await typeInSearch('foo');
      assert.dom('.ember-power-select-option').exists({ count: 1 });
      assert.dom('.ember-power-select-option').hasText('No results found');
    });

    // skip('The content of the dropdown when there are no options can be completely customized using the inverse block', async function(assert) {
    //   this.options = [];
    //   await render(hbs`
    //     <PowerSelect @options={{this.options}} @noMatchesMessage="Nope" @onChange={{fn (mut this.foo)}} as |option|>
    //       {{option}}
    //     {{else}}
    //       <span class="empty-option-foo">Foo bar</span>
    //     </PowerSelect>
    //   `);
    //   await clickTrigger();
    //   assert.dom('.ember-power-select-option').doesNotExist('No list elements, just the given alternate block');
    //   assert.dom('.empty-option-foo').exists();
    // });

    test<NumbersContext>('When no `selected` is provided, the first item in the dropdown is highlighted', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .exists({ count: 1 }, 'One element is highlighted');
      assert
        .dom('.ember-power-select-option')
        .hasAttribute('aria-current', 'true', 'The first one to be precise');
    });

    test<NumbersContext>('When `selected` option is provided, it appears in the trigger yielded with the same block as the options', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @selected="three" @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasText('three', 'The selected option show in the trigger');

      await render<NumbersContext>(hbs`
      <PowerSelect @selected="three" @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        Selected: {{option}}
      </PowerSelect>
    `);
      assert
        .dom('.ember-power-select-trigger')
        .hasText(
          'Selected: three',
          'The selected option uses the same yielded block as the options',
        );
    });

    test<NumbersContext>('When `selected` option is provided, it is highlighted when the dropdown opens (string options)', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @selected="three" @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .exists({ count: 1 }, 'One element is highlighted');
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('three', 'The third option is highlighted');
    });

    test<NumbersContext>('When `selected` option is provided, that option is marked as `.selected`', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @selected="three" @options={{this.numbers}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option:nth-child(3)')
        .hasAttribute(
          'aria-selected',
          'true',
          'The third option is marked as selected',
        );
    });

    test<NamesContext>('The default search strategy matches disregarding diacritics differences and capitalization', async function (assert) {
      assert.expect(8);

      this.names = names;
      this.foo = () => {};
      await render<NamesContext>(hbs`
      <PowerSelect @options={{this.names}} @searchEnabled={{true}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('mar');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 2 }, 'Only 2 results match the search');
      assert.dom('.ember-power-select-option:nth-child(1)').hasText('María');
      assert.dom('.ember-power-select-option:nth-child(2)').hasText('Marta');
      await typeInSearch('mari');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 1 }, 'Only 1 results match the search');
      assert.dom('.ember-power-select-option:nth-child(1)').hasText('María');
      await typeInSearch('o');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 2 }, 'Only 2 results match the search');
      assert
        .dom('.ember-power-select-option:nth-child(1)')
        .hasText('Søren Larsen');
      assert.dom('.ember-power-select-option:nth-child(2)').hasText('João');
    });

    test<NumbersContext>('You can pass a custom marcher with `matcher=myFn` to customize the search strategy', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.endsWithMatcher = function (
        option: string | undefined,
        text: string,
      ) {
        return option?.slice(text.length * -1) === text ? 0 : -1;
      };
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @matcher={{this.endsWithMatcher}} @searchEnabled={{true}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
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

    test<CountriesContext>('When no `selected` is provided, the first item in the dropdown is highlighted', async function (assert) {
      assert.expect(3);

      this.countries = countries;
      this.foo = () => {};
      await render<CountriesContext>(hbs`
      <PowerSelect @options={{this.countries}} @onChange={{this.foo}} as |option|>
        {{option.code}}: {{option.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .exists({ count: 1 }, 'One element is highlighted');
      assert
        .dom('.ember-power-select-option:nth-child(1)')
        .hasAttribute('aria-current', 'true', 'The first one to be precise');
    });

    test<CountriesContext>('When a option is provided that options is rendered in the trigger using the same block as the options', async function (assert) {
      assert.expect(1);

      this.countries = countries;
      this.country = countries[1]; // Spain
      this.foo = () => {};
      await render<CountriesContext>(hbs`
      <PowerSelect @options={{this.countries}} @selected={{this.country}} @onChange={{this.foo}} as |option|>
        {{option.code}}: {{option.name}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasText(
          'ES: Spain',
          'The selected country is rendered in the trigger',
        );
    });

    test<CountriesContext>('When `selected` option is provided, it is highlighted when the dropdown opens (object options)', async function (assert) {
      assert.expect(2);

      this.countries = countries;
      this.country = countries[1]; // Spain
      await render<CountriesContext>(hbs`
      <PowerSelect @options={{this.countries}} @selected={{this.country}} @onChange={{fn (mut this.country)}} as |option|>
        {{option.code}}: {{option.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .exists('One element is highlighted');
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('ES: Spain', 'The second option is highlighted');
    });

    test<CountriesContext>('When `selected` option (object) is provided, that option is marked as `.selected`', async function (assert) {
      assert.expect(1);

      this.countries = countries;
      this.country = countries[1]; // Spain
      await render<CountriesContext>(hbs`
      <PowerSelect @options={{this.countries}} @selected={{this.country}} @onChange={{fn (mut this.country)}} as |option|>
        {{option.code}}: {{option.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      const selectedOption = findContains(
        '.ember-power-select-option',
        'ES: Spain',
      );
      assert
        .dom(selectedOption)
        .hasAttribute(
          'aria-selected',
          'true',
          'The second option is marked as selected',
        );
    });

    test<PeopleContext>('The default search strategy matches disregarding diacritics differences and capitalization', async function (assert) {
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
      <PowerSelect @options={{this.people}} @searchField="name" @searchEnabled={{true}} @onChange={{this.foo}} as |person|>
        {{person.name}} {{person.surname}}
      </PowerSelect>
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
      assert
        .dom('.ember-power-select-option:nth-child(1)')
        .hasText('María Murray');
      await typeInSearch('o');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 2 }, 'Only 2 results match the search');
      assert
        .dom('.ember-power-select-option:nth-child(1)')
        .hasText('Søren Williams');
      assert.dom('.ember-power-select-option:nth-child(2)').hasText('João Jin');
    });

    test<PeopleContext>('You can pass a custom marcher with `matcher=myFn` to customize the search strategy', async function (assert) {
      assert.expect(4);

      this.people = [
        { name: 'María', surname: 'Murray' },
        { name: 'Søren', surname: 'Williams' },
        { name: 'João', surname: 'Jin' },
        { name: 'Miguel', surname: 'Camba' },
        { name: 'Marta', surname: 'Stinson' },
        { name: 'Lisa', surname: 'Simpson' },
      ];

      this.nameOrSurnameNoDiacriticsCaseSensitive = function (
        person: Person | undefined,
        term: string,
      ) {
        return `${person?.name} ${person?.surname}`.indexOf(term);
      };

      this.foo = () => {};

      await render<PeopleContext>(hbs`
      <PowerSelect @options={{this.people}} @searchEnabled={{true}} @matcher={{this.nameOrSurnameNoDiacriticsCaseSensitive}} @onChange={{this.foo}} as |person|>
        {{person.name}} {{person.surname}}
      </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('s');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 3 }, 'Only 3 results match the search');
      assert
        .dom('.ember-power-select-option:nth-child(1)')
        .hasText('Søren Williams');
      assert
        .dom('.ember-power-select-option:nth-child(2)')
        .hasText('Marta Stinson');
      assert
        .dom('.ember-power-select-option:nth-child(3)')
        .hasText('Lisa Simpson');
    });

    test<NumbersContext>('BUGFIX: The highlighted element is reset when single selects are closed', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.selected = 'three';
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @searchEnabled={{true}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('three', 'The third element is highlighted');
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('four', 'The forth element is highlighted');
      await clickTrigger();
      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('three', 'The third element is highlighted again');
    });

    test<NumbersContext>('BUGFIX: The highlighted element is reset when multiple selects are closed', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @searchEnabled={{true}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('one', 'The first element is highlighted');
      await triggerKeyEvent(
        '.ember-power-select-trigger-multiple-input',
        'keydown',
        40,
      );
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('two', 'The second element is highlighted');
      await clickTrigger();
      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('one', 'The first element is highlighted again');
    });

    test<NumbersContext>('If the passed options is a promise that is resolved, searching should filter the results from a promise', async function (assert) {
      assert.expect(5);

      this.numbers = new RSVP.Promise((resolve) => {
        runTask(
          this,
          function () {
            resolve(numbers);
          },
          100,
        );
      });

      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @searchEnabled={{true}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await new RSVP.Promise((resolve) => setTimeout(resolve, 150));

      await clickTrigger();
      await typeInSearch('o');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 4 }, 'The dropdown is opened and results shown.');
      assert.dom('.ember-power-select-option:nth-child(1)').hasText('one');
      assert.dom('.ember-power-select-option:nth-child(2)').hasText('two');
      assert.dom('.ember-power-select-option:nth-child(3)').hasText('four');
      assert.dom('.ember-power-select-option:nth-child(4)').hasText('fourteen');
    });

    test<NumbersContext>("Disabled single selects don't have a clear button even if `allowClear` is true", async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.selected = numbers[2];
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @allowClear={{true}} disabled={{true}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('ember-power-select-clear-btn')
        .doesNotExist('There is no clear button');
    });

    test<NumbersContext>('If the passed selected element is a pending promise, the first element is highlighted and the trigger is empty', async function (assert) {
      assert.expect(3);
      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      this.set(
        'selected',
        new RSVP.Promise((resolve) => {
          runTask(
            this,
            function () {
              resolve(numbers[3]);
            },
            100,
          );
        }),
      );
      void clickTrigger();
      await waitFor('.ember-power-select-options');
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('one', 'The first element is highlighted');
      assert
        .dom('.ember-power-select-option[aria-selected="true"]')
        .doesNotExist('no element is selected');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'Nothing is selected yet');
    });

    test<NumbersContext>('If the passed selected element is a resolved promise, that element is selected and the trigger contains the proper text', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.selected = RSVP.resolve(numbers[3]);
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('four', 'The 4th element is highlighted');
      assert
        .dom('.ember-power-select-option[aria-selected="true"]')
        .hasText('four', 'The 4th element is highlighted');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('four', 'The trigger has the proper content');
    });

    test<NumbersContext>('If the passed selected element is a pending promise that resolves while the select is opened, the highlighted & selected elements get updated, along with the trigger', async function (assert) {
      assert.expect(6);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);
      this.set(
        'selected',
        new RSVP.Promise((resolve) => {
          runTask(
            this,
            function () {
              resolve(numbers[3]);
            },
            100,
          );
        }),
      );

      void clickTrigger();
      await waitFor('.ember-power-select-options');
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('one', 'The first element is highlighted');
      assert
        .dom('.ember-power-select-option[aria-selected="true"]')
        .doesNotExist('no element is selected');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'Nothing is selected yet');

      await this.selected;
      await waitFor('.ember-power-select-options');
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('four', 'The 4th element is highlighted');
      assert
        .dom('.ember-power-select-option[aria-selected="true"]')
        .hasText('four', 'The 4th element is highlighted');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('four', 'The trigger has the proper content');
    });

    test<NumbersContext>("When a promise resolves it doesn't overwrite a previous value if it isn't the same promise it resolved from", async function (assert) {
      assert.expect(5);
      this.numbers = numbers;
      this.foo = () => {};

      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      const promise1 = new RSVP.Promise((resolve) => {
        runTask(
          this,
          function () {
            resolve(numbers[3]);
          },
          400,
        );
      });

      const promise2 = new RSVP.Promise((resolve) => {
        runTask(
          this,
          function () {
            resolve(numbers[4]);
          },
          300,
        );
      });

      this.set('selected', promise1);
      await new RSVP.Promise((resolve) => {
        runTask(
          this,
          () => {
            resolve();
          },
          20,
        );
      });
      this.set('selected', promise2);

      void clickTrigger();
      await waitFor('.ember-power-select-options');
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('one', 'The first element is highlighted');
      assert
        .dom('.ember-power-select-option[aria-selected="true"]')
        .doesNotExist('no element is selected');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'Nothing is selected yet');

      await promise1;
      assert
        .dom('.ember-power-select-option[aria-selected="true"]')
        .hasText('five', 'The 5th element is markes as selected');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('five', 'The trigger has the proper content');
    });

    // This test also fails randomly. Refactor.
    // test('When both `selected` and `options` are async, and `selected` resolves before `options`, the proper options are selected/highlighted after each resolution', function(assert) {
    //   let done = assert.async();
    //   assert.expect(6);

    //   this.asyncOptions = new Ember.RSVP.Promise((resolve) => {
    //     setTimeout(() => resolve(numbers), 200);
    //   });
    //   this.asyncSelected = new Ember.RSVP.Promise((resolve) => {
    //     setTimeout(() => resolve('four'), 10);
    //   });

    //   this.render(hbs`
    //     <PowerSelect options=asyncOptions selected=asyncSelected @onChange={{fn (mut this.foo)}} as |option|>
    //       {{option}}
    //     </PowerSelect>
    //   `);

    //   await clickTrigger();

    //   assert.dom('.ember-power-select-option[aria-selected="true"]').doesNotExist('no element is selected');
    //   assert.dom('.ember-power-select-trigger').hasText('', 'Nothing is selected yet');

    //   setTimeout(function() {
    //     assert.dom('.ember-power-select-trigger').hasText('four', 'The trigger has the proper content');
    //   }, 20);

    //   setTimeout(function() {
    //     assert.dom('.ember-power-select-option[aria-current="true"]').hasText('four', 'The 4th element is highlighted');
    //     assert.dom('.ember-power-select-option[aria-selected="true"]').hasText('four', 'The 4th element is selected');
    //     assert.dom('.ember-power-select-trigger').hasText('four', 'The trigger has the proper content');
    //     done();
    //   }, 220);
    // });

    // This test has been commented because it was randomly failing. It's still a valuable test,
    // and I should revisit it to fix it.

    // test('When both `selected` and `options` are async, and `options` resolves before `selected`, the proper options are selected/highlighted after each resolution', function(assert) {
    //   let done = assert.async();
    //   assert.expect(7);

    //   this.asyncOptions = new Ember.RSVP.Promise((resolve) => {
    //     setTimeout(() => resolve(numbers), 10);
    //   });
    //   this.asyncSelected = new Ember.RSVP.Promise((resolve) => {
    //     setTimeout(() => resolve('four'), 300);
    //   });

    //   this.render(hbs`
    //     <PowerSelect options=asyncOptions selected=asyncSelected @onChange={{fn (mut this.foo)}} as |option|>
    //       {{option}}
    //     </PowerSelect>
    //   `);

    //   await clickTrigger();

    //   assert.dom('.ember-power-select-option[aria-selected="true"]').doesNotExist('no element is selected');
    //   assert.dom('.ember-power-select-trigger').hasText('', 'Nothing is selected yet');

    //   setTimeout(function() {
    //     assert.dom('.ember-power-select-trigger').hasText('', 'The trigger is still empty');
    //     assert.dom('.ember-power-select-option[aria-current="true"]').hasText('one', 'The 1st element is highlighted');
    //   }, 100);

    //   setTimeout(function() {
    //     assert.dom('.ember-power-select-option[aria-current="true"]').hasText('four', 'The 4th element is highlighted');
    //     assert.dom('.ember-power-select-option[aria-selected="true"]').hasText('four', 'The 4th element is selected');
    //     assert.dom('.ember-power-select-trigger').hasText('four', 'The trigger has the proper content');
    //     done();
    //   }, 350);
    // });

    test<NumbersContext>('When the input inside the select gets focused the entire component gains the `ember-power-select-trigger--active` class', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @searchEnabled={{true}} @onChange={{this.foo}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .doesNotHaveClass(
          'ember-power-select-trigger--active',
          "The select doesn't have the class yet",
        );
      await clickTrigger();
      await focus('.ember-power-select-search-input');
      assert
        .dom('.ember-power-select-trigger')
        .hasClass(
          'ember-power-select-trigger--active',
          'The select has the class now',
        );
    });

    test<NumbersContext>('[BUGFIX] When the component opens, if the selected option is not visible the list is scrolled to make it visible', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected="nine" @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('nine');
      assert.ok(
        (document.querySelector('.ember-power-select-options')?.scrollTop ??
          0) > 0,
        'The list has scrolled',
      );
    });

    test<NumbersContext>('The destination where the content is rendered can be customized by passing a `destination=id-of-the-destination`', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} @destination="alternative-destination" as |option|>
        {{option}}
      </PowerSelect>
      <div id="alternative-destination"></div>
    `);

      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is not rendered');

      await clickTrigger();
      assert
        .dom('#alternative-destination .ember-power-select-dropdown')
        .exists('Dropdown is rendered inside the destination element');
    });

    test<NumbersContext>('The destination where the content is rendered can be customized by passing a `destinationElement=element`', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.ref = modifier((element) => {
        this.set('destinationElement', element);
      });
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} @destinationElement={{this.destinationElement}} as |option|>
        {{option}}
      </PowerSelect>
      <div class="alternative-destination" {{this.ref}}></div>
    `);

      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is not rendered');

      await clickTrigger();
      assert
        .dom('.alternative-destination .ember-power-select-dropdown')
        .exists('Dropdown is rendered inside the destination element');
    });

    test<NumbersContext>('[BUGFIX] When the component is open and it has a `search` action, if options get updated the highlighted items is reset', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.selected = null;
      this.search = () => [];
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @searchEnabled={{true}} @onChange={{fn (mut this.selected)}} @search={{this.search}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('two');
      this.set('numbers', ['one', 'three', 'five', 'seven', 'nine']);
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('one');
    });

    test<NumbersContext>('the item that is highlighted by default can be customized passing a value to `@defaultHighlighted`', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.defaultHighlighted = numbers[4];
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} @defaultHighlighted={{this.defaultHighlighted}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText(
          'five',
          'the given element is highlighted instead of the first, as usual',
        );
    });

    test<NumbersContext>('the item that is highlighted by default can be customized passing a function to `@defaultHighlighted`', async function (assert) {
      assert.expect(6);

      this.numbers = numbers;
      this.selected = numbers[1];

      this.defaultHighlighted = (
        params: DefaultHighlightedParams<string>,
      ): string => {
        const { selected, results } = params;
        assert.ok(results instanceof Array, 'select.results is an array');
        assert.strictEqual(selected, numbers[1]);
        return 'five';
      };
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @selected={{this.selected}} @options={{this.numbers}} @onChange={{this.foo}} @defaultHighlighted={{this.defaultHighlighted}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText(
          'five',
          'the given element is highlighted instead of the first, as usual',
        );
    });

    test<UserContext>('If the options of a single select implement `isEqual`, that option is used to determine whether or not two items are the same', async function (assert) {
      this.search = (term: string) => {
        return names
          .filter((n) => n.indexOf(term) > -1)
          .map((name) => new User(name));
      };

      let onChangeInvocationsCount = 0;
      this.onChange = (selected) => {
        onChangeInvocationsCount++;
        this.set('selected', selected);
      };

      await render<UserContext>(hbs`
      <PowerSelect
        @selected={{this.selected}}
        @onChange={{this.onChange}}
        @searchEnabled={{true}}
        @search={{this.search}} as |user|>
        {{user.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('M');
      await click('.ember-power-select-option:nth-child(2)');
      await clickTrigger();
      await typeInSearch('i');
      assert
        .dom('.ember-power-select-option:nth-child(1)')
        .hasAttribute(
          'aria-selected',
          'true',
          'The item in the list is marked as selected',
        );
      await click('.ember-power-select-option:nth-child(1)');
      assert.strictEqual(onChangeInvocationsCount, 1);
    });

    test<NumbersContext>('If the select receives a `@calculatePosition` option, it uses it to calculate the position of the floating content', async function (assert) {
      this.numbers = numbers;
      this.renderInPlace = false;
      this.calculatePosition = function (_, _2, _3, { renderInPlace }) {
        if (renderInPlace) {
          return {
            horizontalPosition: 'left',
            verticalPosition: 'below',
            style: {
              top: 333,
              right: 444,
            },
          };
        } else {
          return {
            horizontalPosition: 'right',
            verticalPosition: 'above',
            style: {
              top: 111,
              right: 222,
            },
          };
        }
      };
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @renderInPlace={{this.renderInPlace}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} @calculatePosition={{this.calculatePosition}} as |num|>
       {{num}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .hasClass(
          'ember-basic-dropdown-content--above',
          'The dropdown is above',
        );
      assert
        .dom('.ember-power-select-dropdown')
        .hasClass(
          'ember-basic-dropdown-content--right',
          'The dropdown is in the right',
        );
      assert
        .dom('.ember-power-select-dropdown')
        .hasAttribute(
          'style',
          /top: 111px; right: 222px;/,
          'The style attribute is the expected one',
        );
      await clickTrigger();

      this.set('renderInPlace', true);
      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .hasClass(
          'ember-basic-dropdown-content--below',
          'The dropdown is below',
        );
      assert
        .dom('.ember-power-select-dropdown')
        .hasClass(
          'ember-basic-dropdown-content--left',
          'The dropdown is in the left',
        );
      assert
        .dom('.ember-power-select-dropdown')
        .hasAttribute(
          'style',
          /top: 333px; right: 444px;/,
          'The style attribute is the expected one',
        );
    });

    test<MainUserContext>('The `selected` option can be a thenable', async function (assert) {
      assert.expect(6);
      const pets = [
        { name: 'Toby' },
        { name: 'Rex' },
        { name: 'Lucius' },
        { name: 'Donatello' },
      ];
      this.mainUser = { pets, selected: null };
      this.foo = () => {};

      await render<MainUserContext>(hbs`
      <PowerSelect @options={{this.mainUser.pets}} @selected={{this.mainUser.selected}} @searchField="name" @onChange={{this.foo}} as |option|>
        {{option.name}}
      </PowerSelect>
    `);

      this.set(
        'mainUser.selected',
        new RSVP.Promise((resolve) => {
          setTimeout(() => resolve(pets[2]), 90);
        }),
      );

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('Toby', 'The first element is highlighted');
      assert
        .dom('.ember-power-select-option[aria-selected="true"]')
        .doesNotExist('no element is selected');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('', 'Nothing is selected yet');

      await this.mainUser.selected;
      await settled();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('Lucius', 'The 4th element is highlighted');
      assert
        .dom('.ember-power-select-option[aria-selected="true"]')
        .hasText('Lucius', 'The 4th element is highlighted');
      assert
        .dom('.ember-power-select-trigger')
        .hasText('Lucius', 'The trigger has the proper content');
    });

    test<OptionContext>('If the options change and the new value is PromiseArrayProxy, the content of that proxy is set immediately while the promise resolves', async function (assert) {
      this.options = ['initial', 'options'];
      this.refreshCollection = () => {
        const promise = new RSVP.Promise((resolve) => {
          setTimeout(() => resolve(['one', 'two', 'three']), 500);
        });
        // @ts-expect-error Object literal may only specify known properties, and 'promise' does not exist in type
        this.set('options', PromiseArrayProxy.create({ promise }));
      };

      await render<OptionContext>(hbs`
      <button type="button" id="refresh-collection-btn" {{on "click" this.refreshCollection}}>Refresh collection</button>
      <br>
      <PowerSelect @options={{this.options}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |name|>
        {{name}}
      </PowerSelect>
    `);

      await click('#refresh-collection-btn');
      await clickTrigger();
      assert.dom('.ember-power-select-option').exists({ count: 1 });
      assert
        .dom('.ember-power-select-option')
        .hasClass('ember-power-select-option--loading-message');
    });

    test<NumbersContext>('The title is rendered in the trigger', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.foo = () => {};
      await render<NumbersContext>(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{this.foo}} @title="The title" as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('title', 'The title');
    });

    test<CountriesContext>('Constant PromiseProxy references are tracked when .content changes', async function (assert) {
      const initial: Country | null = null;
      // @ts-expect-error Expected 0 arguments, but got 1.
      this.proxy = PromiseObject.create<Country | null | undefined>({
        promise: Promise.resolve(initial),
      }) as PromiseProxy<Country | null | undefined>;
      this.countries = countries;
      this.updateProxy = () => {
        // @ts-expect-error Property 'set' does not exist on type 'PromiseProxy<Country | null | undefined>'.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.proxy.set<keyof ObjectProxy<Country | null | undefined>>(
          'content',
          countries[0],
        );
      };

      this.foo = () => {};

      await render<CountriesContext>(hbs`
      <button type="button" id="update-proxy-btn" {{on "click" this.updateProxy}}>Update proxy content</button>
      <br>
      <PowerSelect @selected={{this.proxy}} @options={{this.countries}} @onChange={{this.foo}} as |option|>
        {{option.name}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-option[aria-selected="true"]')
        .doesNotExist('no element is selected');
      assert
        .dom('.ember-power-select-trigger')
        .hasText(
          initial ? (initial as Country).name : '',
          'Nothing is selected yet',
        );

      await click('#update-proxy-btn');
      assert
        .dom('.ember-power-select-trigger')
        .hasText(
          countries[0]?.name ?? '',
          'The trigger has the proper content',
        );

      //TODO: also try starting from non-null value and maybe also going back to null?
    });

    test<DigitsContext>('works with numbers', async function (assert) {
      assert.expect(3);

      this.selected = digits[0];
      this.digits = digits;
      await render<DigitsContext>(hbs`
      <PowerSelect @options={{this.digits}} @selected={{this.selected}} @onChange={{fn (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasText(`${digits[0]}`, 'number "0" is shown in the trigger');

      await clickTrigger();

      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText(
          `${digits[0]}`,
          'The option containing "0" has been highlighted',
        );

      await click('.ember-power-select-option:nth-child(4)');

      assert
        .dom('.ember-power-select-trigger')
        .hasText(`${digits[3]}`, 'number "5" is shown in the trigger');
    });
  },
);
