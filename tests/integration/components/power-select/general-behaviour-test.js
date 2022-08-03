import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  triggerKeyEvent,
  focus,
  settled,
  waitFor,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  typeInSearch,
  clickTrigger,
  findContains,
} from 'ember-power-select/test-support/helpers';
import RSVP from 'rsvp';
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import { run, later } from '@ember/runloop';
import { numbers, names, countries } from '../constants';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import ArrayProxy from '@ember/array/proxy';
import ObjectProxy from '@ember/object/proxy';

const PromiseArrayProxy = ArrayProxy.extend(PromiseProxyMixin);
const PromiseObject = ObjectProxy.extend(PromiseProxyMixin);

module(
  'Integration | Component | Ember Power Select (General behavior)',
  function (hooks) {
    setupRenderingTest(hooks);

    test('Click in the trigger of a closed select opens the dropdown', async function (assert) {
      assert.expect(2);
      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-dropdown')
        .doesNotExist('Dropdown is not rendered');

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
    });

    test('Click in the trigger of an opened select closes the dropdown', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
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

    test('Search functionality is disabled by default', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-search')
        .doesNotExist('The search box is NOT rendered');
    });

    test('The search functionality can be enabled by passing `@searchEnabled={{true}}`', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @searchEnabled={{true}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
      assert
        .dom('.ember-power-select-search')
        .exists('The search box is rendered');
    });

    test("The search box shouldn't gain focus if autofocus is disabled", async function (assert) {
      assert.expect(1);
      this.numbers = numbers;

      await render(hbs`
      <PowerSelect
        @options={{this.numbers}}
        @onChange={{action (mut this.foo)}}
        @searchEnabled={{true}}
        @beforeOptionsComponent={{component "power-select/before-options" autofocus=false}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-search-input')
        .isNotFocused('The search box is not focused after opening select');
    });

    test('Each option of the select is the result of yielding an item', async function (assert) {
      assert.expect(4);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option')
        .exists(
          { count: numbers.length },
          'There is as many options in the markup as in the supplied array'
        );
      assert.dom('.ember-power-select-option:nth-child(1)').hasText('one');
      assert.dom('.ember-power-select-option:nth-child(10)').hasText('ten');
      assert
        .dom('.ember-power-select-option:nth-child(14)')
        .hasText('fourteen');
    });

    test("If the passed options is a promise and it's not resolved the component shows a Loading message", async function (assert) {
      assert.expect(4);

      this.numbersPromise = [];
      await render(hbs`
      <PowerSelect @options={{this.numbersPromise}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      this.set(
        'numbersPromise',
        new RSVP.Promise(function (resolve) {
          later(function () {
            resolve(numbers);
          }, 150);
        })
      );

      clickTrigger();
      await waitFor('.ember-power-select-options');
      assert
        .dom('.ember-power-select-option')
        .hasText(
          'Loading options...',
          'The loading message appears while the promise is pending'
        );
      assert
        .dom('.ember-power-select-option')
        .hasClass(
          'ember-power-select-option--loading-message',
          'The row has a special class to differentiate it from regular options'
        );
      await settled();
      assert
        .dom('.ember-power-select-option')
        .doesNotIncludeText('Loading options', 'The loading message is gone');
      assert
        .dom('.ember-power-select-option')
        .exists(
          { count: 20 },
          'The results appear when the promise is resolved'
        );
    });

    test("If the passed options is a promise and it's not resolved but the `loadingMessage` attribute is false, no loading message is shown", async function (assert) {
      assert.expect(2);
      this.numbersPromise = [];

      await render(hbs`
      <PowerSelect @options={{this.numbersPromise}} @onChange={{action (mut this.foo)}} @loadingMessage={{false}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      this.set(
        'numbersPromise',
        new RSVP.Promise(function (resolve) {
          later(function () {
            resolve(numbers);
          }, 100);
        })
      );
      clickTrigger();

      assert
        .dom('.ember-power-select-option')
        .doesNotExist('No loading options message is displayed');
      await settled();
      assert
        .dom('.ember-power-select-option')
        .exists(
          { count: 20 },
          'The results appear when the promise is resolved'
        );
    });

    test('If a placeholder is provided, it shows while no element is selected', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @placeholder="abracadabra" @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger .ember-power-select-placeholder')
        .hasText(
          'abracadabra',
          'The placeholder is rendered when there is no element'
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

    test('If a `@searchPlaceholder` is provided, it shows on the searchbox of single selects while nothing is there', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @searchEnabled={{true}} @searchPlaceholder="foobar yo!" @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-search-input')
        .hasAttribute(
          'placeholder',
          'foobar yo!',
          'The searchbox has the proper placeholder'
        );
    });

    test("If the `@selected` value changes the select gets updated, but the `@onChange` action doesn't fire", async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.selected = null;
      this.foo = function () {
        assert.ok(false, 'The onchange action is never fired');
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action this.foo}} @selected={{this.selected}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      run(() => this.set('selected', 'three'));
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

    test('If the user selects a value and later on the selected value changes from the outside, the components updates too', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.selected = null;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.selected)}} as |option|>
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
      run(() => this.set('selected', 'three'));
      assert
        .dom('.ember-power-select-trigger')
        .hasText(
          'three',
          '"three" has been selected because a change came from the outside'
        );
    });

    test('If the user passes `@renderInPlace={{true}}` the dropdown is added below the trigger instead of in the root', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @renderInPlace={{true}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .exists('The dropdown is inside the component');
    });

    test('If the user passes `@closeOnSelect={{false}}` the dropdown remains visible after selecting an option with the mouse', async function (assert) {
      assert.expect(4);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @closeOnSelect={{false}} @onChange={{action (mut this.foo)}} as |option|>
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

    test('If the user passes `@closeOnSelect={{false}}` the dropdown remains visible after selecting an option with the with the keyboard', async function (assert) {
      assert.expect(4);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @closeOnSelect={{false}} @onChange={{action (mut this.foo)}} @searchEnabled={{true}} as |option|>
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

    test('If the content of the options is refreshed (starting with empty array proxy) the available options should also refresh', async function (assert) {
      let done = assert.async();
      assert.expect(2);

      let data = [];
      this.proxy = A(data);
      this.search = () => {
        return new RSVP.Promise(function (resolve) {
          resolve(data);
          later(function () {
            data.pushObject('one'); // eslint-disable-line ember/no-array-prototype-extensions
          }, 100);
        });
      };

      await render(hbs`
      <PowerSelect
        @options={{this.proxy}}
        @search={{action this.search}}
        @searchEnabled={{true}}
        @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>`);

      await clickTrigger();
      typeInSearch('o');

      setTimeout(function () {
        assert
          .dom('.ember-power-select-option')
          .exists(
            { count: 1 },
            'The dropdown is opened and results shown after proxy is updated'
          );
        assert.dom('.ember-power-select-option').hasText('one');
        done();
      }, 150);
    });

    test('If the content of the options is updated (starting with populated array proxy) the available options should also refresh', async function (assert) {
      let done = assert.async();
      assert.expect(5);

      let data = ['one'];
      this.proxy = A(data);
      this.search = () => {
        return new RSVP.Promise(function (resolve) {
          resolve(data);
          later(function () {
            data.pushObject('owner'); // eslint-disable-line ember/no-array-prototype-extensions
          }, 100);
        });
      };

      await render(
        hbs`<PowerSelect @options={{this.proxy}} @searchEnabled={{true}} @search={{action this.search}} @onChange={{action (mut this.foo)}} as |option|> {{option}} </PowerSelect>`
      );

      await clickTrigger();

      assert
        .dom('.ember-power-select-option')
        .exists(
          'The dropdown is opened and results shown with initial proxy contents'
        );
      assert.dom('.ember-power-select-option').hasText('one');

      typeInSearch('o');

      setTimeout(function () {
        assert
          .dom('.ember-power-select-option')
          .exists(
            { count: 2 },
            'The dropdown is opened and results shown after proxy is updated'
          );
        assert.dom('.ember-power-select-option:nth-child(1)').hasText('one');
        assert.dom('.ember-power-select-option:nth-child(2)').hasText('owner');
        done();
      }, 150);
    });

    test('If the content of the options is refreshed while opened the first element of the list gets highlighted', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @searchEnabled={{true}} @closeOnSelect={{false}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);
      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('two', 'The second options is highlighted');
      run(() => this.set('numbers', ['foo', 'bar', 'baz']));
      await settled();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('foo', 'The first element is highlighted');
    });

    test('If the user passes `dropdownClass` the dropdown content should have that class', async function (assert) {
      assert.expect(1);

      this.options = [];
      await render(hbs`
      <PowerSelect @options={{this.options}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} @dropdownClass="this-is-a-test-class" as |option|>
        {{option}}
      </PowerSelect>
    `);
      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .hasClass('this-is-a-test-class', 'dropdownClass can be customized');
    });

    test('The filtering is reverted after closing the select', async function (assert) {
      assert.expect(2);
      this.numbers = numbers;
      await render(hbs`
      <div id="outside-div"></div>
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @searchEnabled={{true}} @onChange={{action (mut this.foo)}} as |option|>
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
          'the dropdown has shows all results'
        );
    });

    test('The publicAPI is yielded as second argument in single selects', async function (assert) {
      assert.expect(2);
      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @searchEnabled={{true}} @onChange={{action (mut this.foo)}} as |option select|>
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

    test('If there is no search action and the options is empty the select shows the default "no options" message', async function (assert) {
      this.options = [];
      await render(hbs`
      <PowerSelect @options={{this.options}} @onChange={{action (mut this.foo)}} as |option|>
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
          'The row has a special class to differentiate it from regular options'
        );
    });

    test('If there is a search action and the options is empty it shows the `searchMessage`, and if after searching there is no results, it shows the `noResults` message', async function (assert) {
      this.options = [];
      this.search = () => [];
      await render(hbs`
      <PowerSelect @search={{this.search}} @options={{this.options}} @searchEnabled={{true}} @onChange={{action (mut this.foo)}} as |option|>
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

    test('The default "no options" message can be customized passing `noMatchesMessage="other message"`', async function (assert) {
      this.options = [];
      await render(hbs`
      <PowerSelect @options={{this.options}} @noMatchesMessage="Nope" @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);
      await clickTrigger();
      assert.dom('.ember-power-select-option').exists({ count: 1 });
      assert.dom('.ember-power-select-option').hasText('Nope');
    });

    test("If there is a search action, the options are empty and the `searchMessage` in intentionally empty, it doesn't show anything, and if you search and there is no results it shows the `noResultsMessage`", async function (assert) {
      this.options = [];
      this.search = () => [];
      await render(hbs`
      <PowerSelect @search={{this.search}} @searchMessage={{false}} @searchEnabled={{true}} @options={{this.options}} @onChange={{action (mut this.foo)}} as |option|>
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
    //     <PowerSelect @options={{this.options}} @noMatchesMessage="Nope" @onChange={{action (mut this.foo)}} as |option|>
    //       {{option}}
    //     {{else}}
    //       <span class="empty-option-foo">Foo bar</span>
    //     </PowerSelect>
    //   `);
    //   await clickTrigger();
    //   assert.dom('.ember-power-select-option').doesNotExist('No list elements, just the given alternate block');
    //   assert.dom('.empty-option-foo').exists();
    // });

    test('When no `selected` is provided, the first item in the dropdown is highlighted', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
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

    test('When `selected` option is provided, it appears in the trigger yielded with the same block as the options', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @selected="three" @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasText('three', 'The selected option show in the trigger');

      await render(hbs`
      <PowerSelect @selected="three" @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
        Selected: {{option}}
      </PowerSelect>
    `);
      assert
        .dom('.ember-power-select-trigger')
        .hasText(
          'Selected: three',
          'The selected option uses the same yielded block as the options'
        );
    });

    test('When `selected` option is provided, it is highlighted when the dropdown opens (string options)', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @selected="three" @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
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

    test('When `selected` option is provided, that option is marked as `.selected`', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @selected="three" @options={{this.numbers}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option:nth-child(3)')
        .hasAttribute(
          'aria-selected',
          'true',
          'The third option is marked as selected'
        );
    });

    test('The default search strategy matches disregarding diacritics differences and capitalization', async function (assert) {
      assert.expect(8);

      this.names = names;
      await render(hbs`
      <PowerSelect @options={{this.names}} @searchEnabled={{true}} @onChange={{action (mut this.foo)}} as |option|>
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

    test('You can pass a custom marcher with `matcher=myFn` to customize the search strategy', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.endsWithMatcher = function (option, text) {
        return option.slice(text.length * -1) === text ? 0 : -1;
      };

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @matcher={{this.endsWithMatcher}} @searchEnabled={{true}} @onChange={{action (mut this.foo)}} as |option|>
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

    test('When no `selected` is provided, the first item in the dropdown is highlighted', async function (assert) {
      assert.expect(3);

      this.countries = countries;
      await render(hbs`
      <PowerSelect @options={{this.countries}} @onChange={{action (mut this.foo)}} as |option|>
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

    test('When a option is provided that options is rendered in the trigger using the same block as the options', async function (assert) {
      assert.expect(1);

      this.countries = countries;
      this.country = countries[1]; // Spain
      await render(hbs`
      <PowerSelect @options={{this.countries}} @selected={{this.country}} @onChange={{action (mut this.foo)}} as |option|>
        {{option.code}}: {{option.name}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasText(
          'ES: Spain',
          'The selected country is rendered in the trigger'
        );
    });

    test('When `selected` option is provided, it is highlighted when the dropdown opens (object options)', async function (assert) {
      assert.expect(2);

      this.countries = countries;
      this.country = countries[1]; // Spain
      await render(hbs`
      <PowerSelect @options={{this.countries}} @selected={{this.country}} @onChange={{action (mut this.country)}} as |option|>
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

    test('When `selected` option (object) is provided, that option is marked as `.selected`', async function (assert) {
      assert.expect(1);

      this.countries = countries;
      this.country = countries[1]; // Spain
      await render(hbs`
      <PowerSelect @options={{this.countries}} @selected={{this.country}} @onChange={{action (mut this.foo)}} as |option|>
        {{option.code}}: {{option.name}}
      </PowerSelect>
    `);

      await clickTrigger();
      let selectedOption = findContains(
        '.ember-power-select-option',
        'ES: Spain'
      );
      assert
        .dom(selectedOption)
        .hasAttribute(
          'aria-selected',
          'true',
          'The second option is marked as selected'
        );
    });

    test('The default search strategy matches disregarding diacritics differences and capitalization', async function (assert) {
      assert.expect(8);

      this.people = [
        { name: 'María', surname: 'Murray' },
        { name: 'Søren', surname: 'Williams' },
        { name: 'João', surname: 'Jin' },
        { name: 'Miguel', surname: 'Camba' },
        { name: 'Marta', surname: 'Stinson' },
        { name: 'Lisa', surname: 'Simpson' },
      ];

      await render(hbs`
      <PowerSelect @options={{this.people}} @searchField="name" @searchEnabled={{true}} @onChange={{action (mut this.foo)}} as |person|>
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

    test('You can pass a custom marcher with `matcher=myFn` to customize the search strategy', async function (assert) {
      assert.expect(4);

      this.people = [
        { name: 'María', surname: 'Murray' },
        { name: 'Søren', surname: 'Williams' },
        { name: 'João', surname: 'Jin' },
        { name: 'Miguel', surname: 'Camba' },
        { name: 'Marta', surname: 'Stinson' },
        { name: 'Lisa', surname: 'Simpson' },
      ];

      this.nameOrSurnameNoDiacriticsCaseSensitive = function (person, term) {
        return `${person.name} ${person.surname}`.indexOf(term);
      };

      await render(hbs`
      <PowerSelect @options={{this.people}} @searchEnabled={{true}} @matcher={{this.nameOrSurnameNoDiacriticsCaseSensitive}} @onChange={{action (mut this.foo)}} as |person|>
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

    test('BUGFIX: The highlighted element is reset when single selects are closed', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.foo = 'three';
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @searchEnabled={{true}} @onChange={{action (mut this.foo)}} as |option|>
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

    test('BUGFIX: The highlighted element is reset when multiple selects are closed', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @searchEnabled={{true}} @onChange={{action (mut this.foo)}} as |option|>
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
        40
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

    test('If the passed options is a promise that is resolved, searching should filter the results from a promise', async function (assert) {
      assert.expect(5);

      this.numbersPromise = new RSVP.Promise(function (resolve) {
        later(function () {
          resolve(numbers);
        }, 100);
      });

      await render(hbs`
      <PowerSelect @options={{this.numbersPromise}} @searchEnabled={{true}} @onChange={{action (mut this.foo)}} as |option|>
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

    test("Disabled single selects don't have a clear button even if `allowClear` is true", async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      this.foo = numbers[2];
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.foo}} @onChange={{action (mut this.foo)}} @allowClear={{true}} disabled=true as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('ember-power-select-clear-btn')
        .doesNotExist('There is no clear button');
    });

    test('If the passed selected element is a pending promise, the first element is highlighted and the trigger is empty', async function (assert) {
      assert.expect(3);
      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      this.set(
        'selected',
        new RSVP.Promise(function (resolve) {
          later(resolve, numbers[3], 100);
        })
      );
      clickTrigger();
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

    test('If the passed selected element is a resolved promise, that element is selected and the trigger contains the proper text', async function (assert) {
      assert.expect(3);

      this.numbers = numbers;
      this.selected = RSVP.resolve(numbers[3]);

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.foo)}} as |option|>
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

    test('If the passed selected element is a pending promise that resolves while the select is opened, the highlighted & selected elements get updated, along with the trigger', async function (assert) {
      assert.expect(6);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);
      this.set(
        'selected',
        new RSVP.Promise(function (resolve) {
          later(resolve, numbers[3], 100);
        })
      );

      clickTrigger();
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

    test("When a promise resolves it doesn't overwrite a previous value if it isn't the same promise it resolved from", async function (assert) {
      assert.expect(5);
      this.numbers = numbers;

      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      let promise1 = new RSVP.Promise(function (resolve) {
        later(resolve, numbers[3], 400);
      });

      let promise2 = new RSVP.Promise(function (resolve) {
        later(resolve, numbers[4], 300);
      });

      this.set('selected', promise1);
      await new RSVP.Promise((resolve) => later(resolve, 20));
      this.set('selected', promise2);

      clickTrigger();
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
    //     <PowerSelect options=asyncOptions selected=asyncSelected @onChange={{action (mut this.foo)}} as |option|>
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
    //     <PowerSelect options=asyncOptions selected=asyncSelected @onChange={{action (mut this.foo)}} as |option|>
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

    test('When the input inside the select gets focused the entire component gains the `ember-power-select-trigger--active` class', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @searchEnabled={{true}} @onChange={{action (mut this.foo)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .doesNotHaveClass(
          'ember-power-select-trigger--active',
          "The select doesn't have the class yet"
        );
      await clickTrigger();
      await focus('.ember-power-select-search-input');
      assert
        .dom('.ember-power-select-trigger')
        .hasClass(
          'ember-power-select-trigger--active',
          'The select has the class now'
        );
    });

    test('[BUGFIX] When the component opens, if the selected option is not visible the list is scrolled to make it visible', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected="nine" @onChange={{action (mut this.selected)}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('nine');
      assert.ok(
        document.querySelector('.ember-power-select-options').scrollTop > 0,
        'The list has scrolled'
      );
    });

    test('The destination where the content is rendered can be customized by passing a `destination=id-of-the-destination`', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} @destination="alternative-destination" as |option|>
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

    test('[BUGFIX] When the component is open and it has a `search` action, if options get updated the highlighted items is reset', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.selected = null;
      this.search = () => [];
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @selected={{this.selected}} @searchEnabled={{true}} @onChange={{action (mut this.selected)}} @search={{this.search}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 40);
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('two');
      run(() => this.set('numbers', ['one', 'three', 'five', 'seven', 'nine']));
      assert
        .dom('.ember-power-select-option[aria-current="true"]')
        .hasText('one');
    });

    test('the item that is highlighted by default can be customized passing a value to `@defaultHighlighted`', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.defaultHighlighted = numbers[4];
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} @defaultHighlighted={{this.defaultHighlighted}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText(
          'five',
          'the given element is highlighted instead of the first, as usual'
        );
    });

    test('the item that is highlighted by default can be customized passing a function to `@defaultHighlighted`', async function (assert) {
      assert.expect(6);

      this.numbers = numbers;
      this.selected = numbers[1];

      this.defaultHighlighted = function ({ selected, results }) {
        assert.ok(results instanceof Array, 'select.results is an array');
        assert.strictEqual(selected, numbers[1]);
        return 'five';
      };
      await render(hbs`
      <PowerSelect @selected={{this.selected}} @options={{this.numbers}} @onChange={{action (mut this.foo)}} @defaultHighlighted={{this.defaultHighlighted}} as |option|>
        {{option}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-dropdown').exists('Dropdown is rendered');
      assert
        .dom('.ember-power-select-option[aria-current=true]')
        .hasText(
          'five',
          'the given element is highlighted instead of the first, as usual'
        );
    });

    test('If the options of a single select implement `isEqual`, that option is used to determine whether or not two items are the same', async function (assert) {
      let User = EmberObject.extend({
        isEqual(other) {
          return this.name === other.name;
        },
      });

      this.search = (term) => {
        return names
          .filter((n) => n.indexOf(term) > -1)
          .map((name) => User.create({ name }));
      };

      let onChangeInvocationsCount = 0;
      this.onChange = (selected) => {
        onChangeInvocationsCount++;
        this.set('selected', selected);
      };

      await render(hbs`
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
          'The item in the list is marked as selected'
        );
      await click('.ember-power-select-option:nth-child(1)');
      assert.strictEqual(onChangeInvocationsCount, 1);
    });

    test('If the select receives a `@calculatePosition` option, it uses it to calculate the position of the floating content', async function (assert) {
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
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @renderInPlace={{this.renderInPlace}} @selected={{this.selected}} @onChange={{action (mut this.selected)}} @calculatePosition={{this.calculatePosition}} as |num|>
       {{num}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .hasClass(
          'ember-basic-dropdown-content--above',
          'The dropdown is above'
        );
      assert
        .dom('.ember-power-select-dropdown')
        .hasClass(
          'ember-basic-dropdown-content--right',
          'The dropdown is in the right'
        );
      assert
        .dom('.ember-power-select-dropdown')
        .hasAttribute(
          'style',
          /top: 111px; right: 222px;/,
          'The style attribute is the expected one'
        );
      await clickTrigger();

      run(() => this.set('renderInPlace', true));
      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .hasClass(
          'ember-basic-dropdown-content--below',
          'The dropdown is below'
        );
      assert
        .dom('.ember-power-select-dropdown')
        .hasClass(
          'ember-basic-dropdown-content--left',
          'The dropdown is in the left'
        );
      assert
        .dom('.ember-power-select-dropdown')
        .hasAttribute(
          'style',
          /top: 333px; right: 444px;/,
          'The style attribute is the expected one'
        );
    });

    test('The `selected` option can be a thenable', async function (assert) {
      assert.expect(6);
      let pets = [
        { name: 'Toby' },
        { name: 'Rex' },
        { name: 'Lucius' },
        { name: 'Donatello' },
      ];
      this.mainUser = { pets, bestie: null };

      await render(hbs`
      <PowerSelect @options={{this.mainUser.pets}} @selected={{this.mainUser.bestie}} @searchField="name" @onChange={{action (mut this.foo)}} as |option|>
        {{option.name}}
      </PowerSelect>
    `);

      this.set(
        'mainUser.bestie',
        new RSVP.Promise(function (resolve) {
          setTimeout(() => resolve(pets[2]), 90);
        })
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

      await this.mainUser.bestie;
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

    test('If the options change and the new value is PromiseArrayProxy, the content of that proxy is set immediately while the promise resolves', async function (assert) {
      this.options = ['initial', 'options'];
      this.refreshCollection = () => {
        let promise = new RSVP.Promise((resolve) => {
          setTimeout(() => resolve(['one', 'two', 'three']), 500);
        });
        this.set('options', PromiseArrayProxy.create({ promise }));
      };

      await render(hbs`
      <button id="refresh-collection-btn" onclick={{action this.refreshCollection}}>Refresh collection</button>
      <br>
      <PowerSelect @options={{this.options}} @selected={{this.selected}} @onChange={{action (mut this.selected)}} as |name|>
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

    test('The title is rendered in the trigger', async function (assert) {
      assert.expect(1);

      this.numbers = numbers;
      await render(hbs`
      <PowerSelect @options={{this.numbers}} @onChange={{action (mut this.foo)}} @title="The title" as |option|>
        {{option}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('title', 'The title');
    });

    test('Constant PromiseProxy references are tracked when .content changes', async function (assert) {
      let initial = null;
      this.proxy = PromiseObject.create({ promise: Promise.resolve(initial) });
      this.countries = countries;
      this.updateProxy = () => {
        this.proxy.set('content', countries[0]);
      };

      await render(hbs`
      <button id="update-proxy-btn" {{on "click" this.updateProxy}}>Update proxy content</button>
      <br>
      <PowerSelect @selected={{this.proxy}} @options={{this.countries}} @onChange={{action (mut this.foo)}} as |option|>
        {{option.name}}
      </PowerSelect>
    `);

      assert
        .dom('.ember-power-select-option[aria-selected="true"]')
        .doesNotExist('no element is selected');
      assert
        .dom('.ember-power-select-trigger')
        .hasText(initial ? initial.name : '', 'Nothing is selected yet');

      await click('#update-proxy-btn');
      assert
        .dom('.ember-power-select-trigger')
        .hasText(countries[0].name, 'The trigger has the proper content');

      //TODO: also try starting from non-null value and maybe also going back to null?
    });
  }
);
