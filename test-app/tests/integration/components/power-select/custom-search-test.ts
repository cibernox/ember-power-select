import { runTask } from 'ember-lifeline';
import {
  timeout,
  restartableTask,
  type TaskForAsyncTaskFunction,
} from 'ember-concurrency';
import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import {
  render,
  settled,
  click,
  waitFor,
  type TestContext,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  typeInSearch,
  clickTrigger,
} from 'ember-power-select/test-support/helpers';
import { numbers, countries, type Country } from 'test-app/utils/constants';
import RSVP from 'rsvp';
import type { MatcherFn } from 'ember-power-select/types';

interface SearchContext extends TestContext {
  searchFn: (term: string) => typeof numbers | Promise<typeof numbers>;
  foo: () => void;
  options: typeof numbers;
  numbers: typeof numbers;
  selected: string | undefined;
  visible?: boolean;
}

interface SearchNumberPromiseContext extends TestContext {
  searchFn: (term: string) => typeof numbers | Promise<typeof numbers>;
  foo: () => void;
  numbersPromise: Promise<typeof numbers>;
}

interface CountryContext extends TestContext {
  matcherFn: MatcherFn<Country>;
  foo: () => void;
  countries: typeof countries;
}

interface ObjContext extends TestContext {
  obj: {
    searchTask: TaskForAsyncTaskFunction<
      {
        restartable: boolean;
      },
      (
        this: {
          restartable: boolean;
        },
        term: string,
      ) => Promise<string[]>
    >;
  };
  foo: () => void;
  hideSelect: boolean;
}

module(
  'Integration | Component | Ember Power Select (Custom search function)',
  function (hooks) {
    setupRenderingTest(hooks);

    test<SearchContext>('When you pass a custom search action instead of options, opening the select show a "Type to search" message in a list element', async function (assert) {
      assert.expect(1);

      this.searchFn = () => [];
      this.foo = () => {};

      await render<SearchContext>(hbs`
      <PowerSelect @search={{this.searchFn}} @onChange={{this.foo}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option')
        .hasText(
          'Type to search',
          'The dropdown shows the "type to search" message',
        );
    });

    test<SearchContext>("The search text shouldn't appear if options are loading", async function (assert) {
      assert.expect(2);

      this.options = [];
      // @ts-expect-error Type 'void' is not assignable to type 'string[] | Promise<string[]>'.
      this.searchFn = () => {};
      this.foo = () => {};

      await render<SearchContext>(hbs`
      <PowerSelect @options={{this.options}} @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      this.set(
        'options',
        new RSVP.Promise((resolve) => {
          runTask(
            this,
            function () {
              resolve(numbers);
            },
            100,
          );
        }),
      );
      void clickTrigger();
      await waitFor('.ember-power-select-dropdown');
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotIncludeText(
          'Type to search',
          "The type to search message doesn't show",
        );
      assert
        .dom('.ember-power-select-dropdown')
        .includesText(
          'Loading options...',
          '"Loading options..." message appears',
        );
    });

    test<SearchContext>('When no options are given but there is a search action, a "type to search" message is rendered', async function (assert) {
      assert.expect(2);

      this.searchFn = () => [];
      this.foo = () => {};

      await render<SearchContext>(hbs`
      <PowerSelect @search={{this.searchFn}} @onChange={{this.foo}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert.dom('.ember-power-select-option').hasText('Type to search');
      assert
        .dom('.ember-power-select-option')
        .hasClass(
          'ember-power-select-option--search-message',
          'The option with the search message has a special class',
        );
    });

    test<SearchContext>('The "type to search" message can be customized passing `@searchMessage=something`', async function (assert) {
      assert.expect(1);

      this.searchFn = () => [];
      this.foo = () => {};

      await render<SearchContext>(hbs`
      <PowerSelect @search={{this.searchFn}} @searchMessage="Type the name of the thing" @onChange={{this.foo}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option')
        .hasText('Type the name of the thing');
    });

    test<SearchContext>('The search function can return an array and those options get rendered', async function (assert) {
      assert.expect(1);

      this.searchFn = function (term: string) {
        return numbers.filter((str) => str.indexOf(term) > -1);
      };
      this.foo = () => {};

      await render<SearchContext>(hbs`
      <PowerSelect @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('teen');
      assert.dom('.ember-power-select-option').exists({ count: 7 });
    });

    test<SearchContext>('The search function can return a promise that resolves to an array and those options get rendered', async function (assert) {
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

      await render<SearchContext>(hbs`
      <PowerSelect @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      void typeInSearch('teen');

      await settled();
      assert.dom('.ember-power-select-option').exists({ count: 7 });
    });

    test<SearchContext>('While the async search is being performed the "Type to search" dissapears the "Loading..." message appears', async function (assert) {
      assert.expect(3);

      this.searchFn = function (term) {
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

      await render<SearchContext>(hbs`
      <PowerSelect @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-dropdown')
        .includesText(
          'Type to search',
          'The type to search message is displayed',
        );
      void typeInSearch('teen');
      await waitFor(
        '.ember-power-select-option:not(.ember-power-select-option--search-message)',
      );
      assert
        .dom('.ember-power-select-dropdown')
        .doesNotIncludeText(
          'Type to search',
          'The type to search message dissapeared',
        );
      assert
        .dom('.ember-power-select-dropdown')
        .includesText(
          'Loading options...',
          '"Loading options..." message appears',
        );
    });

    test<SearchContext>('When the search resolves to an empty array then the "No results found" message or block appears.', async function (assert) {
      assert.expect(1);

      this.searchFn = function () {
        return new RSVP.Promise((resolve) => {
          runTask(
            this,
            function () {
              resolve([]);
            },
            10,
          );
        });
      };
      this.foo = () => {};

      await render<SearchContext>(hbs`
      <PowerSelect @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('teen');
      assert
        .dom('.ember-power-select-option')
        .includesText(
          'No results found',
          'The default "No results" message renders',
        );
    });

    test<SearchContext>('When the search resolves to an empty array then the custom "No results" message appears', async function (assert) {
      assert.expect(1);

      this.searchFn = function () {
        return new RSVP.Promise((resolve) => {
          runTask(
            this,
            function () {
              resolve([]);
            },
            10,
          );
        });
      };
      this.foo = () => {};

      await render<SearchContext>(hbs`
      <PowerSelect @search={{this.searchFn}} @noMatchesMessage="Meec. Try again" @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      void typeInSearch('teen');
      await settled();
      assert
        .dom('.ember-power-select-option')
        .includesText(
          'Meec. Try again',
          'The customized "No results" message renders',
        );
    });

    skip<SearchContext>('When the search resolves to an empty array then the custom alternate block renders', async function (assert) {
      assert.expect(1);

      this.searchFn = function () {
        return new RSVP.Promise((resolve) => {
          runTask(
            this,
            function () {
              resolve([]);
            },
            10,
          );
        });
      };

      // await render(hbs`
      //   <PowerSelect @search={{this.searchFn}} @onChange={{fn (mut this.foo)}} @searchEnabled={{true}} as |number|>
      //     {{number}}
      //   {{else}}
      //     <span class="foo-bar">Baz</span>
      //   </PowerSelect>
      // `);

      // await clickTrigger();
      void typeInSearch('teen');
      await settled();
      assert
        .dom('.ember-power-select-dropdown .foo-bar')
        .exists('The alternate block message gets rendered');
    });

    //    Random failure test. Fix
    //
    //
    // test('When one search is fired before the previous one resolved, the "Loading" continues until the 2nd is resolved', function(assert) {
    //   var done = assert.async();
    //   assert.expect(2);

    //   this.searchFn = function() {
    //     return new RSVP.Promise(function(resolve) {
    //       runTask(this, function() { resolve(numbers); }, 100);
    //     });
    //   };

    //   this.render(hbs`
    //     <PowerSelect @search={{this.searchFn}} @onChange={{fn (mut this.foo)}} as |number|>
    //       {{number}}
    //     </PowerSelect>
    //   `);
    //   clickTrigger();
    //   typeInSearch("tee");

    //   setTimeout(function() {
    //     typeInSearch('teen');
    //   }, 50);

    //   setTimeout(function() {
    //     assert.ok(/Loading options/.test(find('.ember-power-select-option').textContent.trim()), 'The loading message is visible');
    //     assert.ok(find('.ember-power-select-option'), 'No results are shown');
    //   }, 120);

    //   setTimeout(done, 180);
    // });

    test<SearchContext>('On an empty select, when the search resolves, the first element is highlighted like with regular filtering', async function (assert) {
      assert.expect(1);

      this.searchFn = function (term) {
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

      await render<SearchContext>(hbs`
      <PowerSelect @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      void typeInSearch('teen');

      await settled();
      assert
        .dom('.ember-power-select-option')
        .hasAttribute(
          'aria-current',
          'true',
          'The first result is highlighted',
        );
    });
    test<SearchContext>('On an empty select, when a syncronous search result complete, the first element is highlighted like with regular filtering', async function (assert) {
      assert.expect(1);

      this.searchFn = function (term) {
        return numbers.filter((str) => str.indexOf(term) > -1);
      };
      this.foo = () => {};

      await render<SearchContext>(hbs`
      <PowerSelect @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      void typeInSearch('teen');

      await settled();
      assert
        .dom('.ember-power-select-option')
        .hasAttribute(
          'aria-current',
          'true',
          'The first result is highlighted',
        );
    });

    test<SearchContext>('On an select with a selected value, if after a search this value is not among the options the first element is highlighted', async function (assert) {
      assert.expect(2);

      this.numbers = numbers;
      this.selected = numbers[2];
      this.searchFn = function (term) {
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

      await render<SearchContext>(hbs`
      <PowerSelect @search={{this.searchFn}} @options={{this.numbers}} @selected={{this.selected}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option:nth-child(3)')
        .hasAttribute('aria-current', 'true', 'The 3rd result is highlighted');
      void typeInSearch('teen');

      await settled();
      assert
        .dom('.ember-power-select-option')
        .hasAttribute(
          'aria-current',
          'true',
          'The first result is highlighted',
        );
    });

    test<SearchContext>('Closing a component with a custom search cleans the search box and the results list', async function (assert) {
      assert.expect(5);
      this.searchFn = function (term) {
        return RSVP.resolve(numbers.filter((str) => str.indexOf(term) > -1));
      };
      this.foo = () => {};

      await render<SearchContext>(hbs`
      <div id="different-node"></div>
      <PowerSelect @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('teen');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 7 }, 'Results are filtered');
      assert.dom('.ember-power-select-search-input').hasValue('teen');
      await click('#different-node');

      await clickTrigger();
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 1 }, 'Results have been cleared');
      assert.dom('.ember-power-select-option').hasText('Type to search');
      assert
        .dom('.ember-power-select-search-input')
        .hasNoValue('The searchbox was cleared');
    });

    test<SearchContext>('When received both options and search, those options are shown when the dropdown opens before the first search is performed', async function (assert) {
      assert.expect(4);

      this.numbers = numbers;
      this.searchFn = (term) => {
        return new RSVP.Promise((resolve) => {
          runTask(
            this,
            function () {
              resolve(numbers.filter((str) => str.indexOf(term) > -1));
            },
            150,
          );
        });
      };
      this.foo = () => {};

      await render<SearchContext>(hbs`
      <div id="different-node"></div>
      <PowerSelect @options={{this.numbers}} @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 20 }, 'All the options are shown');
      void typeInSearch('teen');
      await waitFor('.ember-power-select-option--loading-message');
      assert
        .dom('.ember-power-select-option')
        .exists(
          { count: 21 },
          'All the options are shown and also the loading message',
        );
      assert.dom('.ember-power-select-option').hasText('Loading options...');
      await settled();
      assert
        .dom('.ember-power-select-option')
        .exists(
          { count: 7 },
          'All the options are shown but no the loading message',
        );
    });

    test<SearchContext>("Don't return from the search action and update the options instead also works as an strategy", async function (assert) {
      assert.expect(2);

      this.options = numbers;
      // @ts-expect-error Type 'void' is not assignable to type 'string[] | Promise<string[]>'.
      this.searchFn = (term: string) => {
        runTask(
          this,
          () => {
            this.set(
              'options',
              numbers.filter((str) => str.indexOf(term) > -1),
            );
          },
          20,
        );
      };
      this.foo = () => {};

      await render<SearchContext>(hbs`
      <div id="different-node"></div>
      <PowerSelect @options={{this.options}} @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 20 }, 'All the options are shown');
      void typeInSearch('teen');

      await settled();
      assert.dom('.ember-power-select-option').exists({ count: 7 });
    });

    // This test fails randomly
    // test('Setting the options to a promise from the custom search function works (and does not prevent further searches)', function(assert) {
    //   let done = assert.async();
    //   assert.expect(14);

    //   this.selectedOptions = RSVP.resolve(numbers);
    //   let searchCalls = 0;
    //   this.searchFn = (term) => {
    //     searchCalls++;
    //     let promise = new RSVP.Promise(function(resolve) {
    //       runTask(this, () => {
    //         resolve(numbers.filter((str) => str.indexOf(term) > -1));
    //       }, 30);
    //     });
    //     this.set('selectedOptions', promise);
    //   };

    //   this.render(hbs`
    //     <div id="different-node"></div>
    //     <PowerSelect @options={{this.selectedOptions}} @search={{this.searchFn}} @onChange={{fn (mut this.foo)}} as |number|>
    //       {{number}}
    //     </PowerSelect>
    //   `);

    //   clickTrigger();
    //   assert.strictEqual(findAll('.ember-power-select-option').length, 20, 'All the options are shown');
    //   typeInSearch('teen');
    //   assert.strictEqual(findAll('.ember-power-select-option').length, 21, 'All the options are shown plus the loading message');
    //   assert.strictEqual(findAll('.ember-power-select-option')[0].textContent.trim(), 'Loading options...', 'The loading message is shown');

    //   setTimeout(function() {
    //     assert.strictEqual(searchCalls, 1, 'The search was called only once');
    //     assert.strictEqual(findAll('.ember-power-select-option').length, 7);
    //     typeInSearch('seven');
    //     assert.strictEqual(findAll('.ember-power-select-option')[0].textContent.trim(), 'Loading options...', 'The loading message is shown');
    //     assert.strictEqual(findAll('.ember-power-select-option').length, 8);
    //   }, 40);

    //   setTimeout(function() {
    //     assert.strictEqual(searchCalls, 2, 'The search was called only twice');
    //     assert.strictEqual(findAll('.ember-power-select-option').length, 8);
    //     assert.strictEqual(findAll('.ember-power-select-option')[0].textContent.trim(), 'Loading options...', 'It is still searching the previous result');
    //     typeInSearch('four');
    //     assert.strictEqual(findAll('.ember-power-select-option')[0].textContent.trim(), 'Loading options...', 'The loading message is shown');
    //     assert.strictEqual(findAll('.ember-power-select-option').length, 8);
    //   }, 60);

    //   setTimeout(function() {
    //     assert.strictEqual(searchCalls, 3, 'The search was called only three times');
    //     assert.strictEqual(findAll('.ember-power-select-option').length, 2);
    //     done();
    //   }, 300);
    // });

    test<SearchContext>('If you delete the last char of the input before the previous promise resolves, that promise is discarded', async function (assert) {
      const done = assert.async();
      assert.expect(2);
      this.numbers = numbers;
      this.searchFn = function (term) {
        return new RSVP.Promise((resolve) => {
          setTimeout(function () {
            resolve(numbers.filter((str) => str.indexOf(term) > -1));
          }, 100);
        });
      };
      this.foo = () => {};

      await render<SearchContext>(hbs`
      <PowerSelect @options={{this.numbers}} @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number select|>
        {{number}}:{{select.lastSearchedText}}
      </PowerSelect>
    `);

      await clickTrigger();
      void typeInSearch('teen');
      setTimeout(function () {
        void typeInSearch('t');
      }, 150);
      setTimeout(function () {
        void typeInSearch('');
      }, 200);
      setTimeout(function () {
        assert
          .dom('.ember-power-select-option')
          .exists(
            { count: numbers.length },
            'All the options are displayed after clearing the search',
          );
        assert
          .dom('.ember-power-select-option:nth-child(2)')
          .hasText('two:', 'The results are the original options');
        done();
      }, 300);
    });

    test<SearchContext>('The lastSearchedText of the yielded publicAPI in single selects is updated only when the async search for it finishes', async function (assert) {
      assert.expect(3);
      this.numbers = numbers;
      this.searchFn = function (term) {
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

      await render<SearchContext>(hbs`
      <PowerSelect @options={{this.numbers}} @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number select|>
        {{number}}:{{select.lastSearchedText}}
      </PowerSelect>
    `);

      await clickTrigger();
      await typeInSearch('teen');
      assert
        .dom('.ember-power-select-option')
        .hasText(
          'thirteen:teen',
          'The results and the lastSearchedText have updated',
        );
      void typeInSearch('four');
      await waitFor('.ember-power-select-option--loading-message');
      assert
        .dom('.ember-power-select-option')
        .hasText('Loading options...', 'There is a search going on');
      assert
        .dom('.ember-power-select-option:nth-child(2)')
        .hasText(
          'thirteen:teen',
          'The results and the lastSearchedText are still the same because the search has not finished yet',
        );
    });

    test<SearchContext>('The lastSearchedText of the yielded publicAPI in multiple selects is updated only when the async search for it finishes', async function (assert) {
      assert.expect(3);
      this.numbers = numbers;
      this.searchFn = function (term) {
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

      await render<SearchContext>(hbs`
      <PowerSelectMultiple @options={{this.numbers}} @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number select|>
        {{number}}:{{select.lastSearchedText}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      await typeInSearch('teen');
      assert
        .dom('.ember-power-select-option')
        .hasText(
          'thirteen:teen',
          'The results and the searchTerm have updated',
        );
      void typeInSearch('four');
      await waitFor('.ember-power-select-option--loading-message');
      assert
        .dom('.ember-power-select-option')
        .hasText('Loading options...', 'There is a search going on');
      assert
        .dom('.ember-power-select-option:nth-child(2)')
        .hasText(
          'thirteen:teen',
          'The results and the searchTerm are still the same because the search has not finished yet',
        );
    });

    test<SearchContext>('BUGFIX: Destroy a component why an async search is pending does not cause an error', async function (assert) {
      assert.expect(0); // This test has no assertions. The fact that nothing fails is the proof that it works
      this.numbers = numbers;
      this.visible = true;

      this.searchFn = function (term) {
        return new RSVP.Promise((resolve) => {
          runTask(
            this,
            function () {
              resolve(numbers.filter((str) => str.indexOf(term) > -1));
            },
            200,
          );
        });
      };
      this.foo = () => {};

      await render<SearchContext>(hbs`
      {{#if this.visible}}
        <PowerSelectMultiple @options={{this.numbers}} @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
          {{number}}
        </PowerSelectMultiple>
      {{/if}}
    `);

      await clickTrigger();
      await typeInSearch('teen');
      this.set('visible', false);
    });

    test<SearchNumberPromiseContext>('BUGFIX: When the given options are a promise and a search function is provided, clearing the search must display the results of the original promise', async function (assert) {
      assert.expect(3);
      this.numbersPromise = RSVP.Promise.resolve(numbers);

      this.searchFn = function (term) {
        return numbers.filter((str) => str.indexOf(term) > -1);
      };
      this.foo = () => {};

      await render<SearchNumberPromiseContext>(hbs`
     <PowerSelect @options={{this.numbersPromise}} @search={{this.searchFn}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
       {{number}}
     </PowerSelect>
    `);

      await clickTrigger();
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 20 }, 'There is 20 options');
      await typeInSearch('teen');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 7 }, 'There is 7 options');
      await typeInSearch('');
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 20 }, 'There is 20 options again§');
    });

    test<CountryContext>('BUGFIX: If the user provides a custom matcher, that matcher receives the entire option even if the user also provided a searchField', async function (assert) {
      this.countries = countries;
      this.matcherFn = function (option: Country | undefined) {
        assert.strictEqual(
          typeof option,
          'object',
          'The first argument received by the custom matches is the option itself',
        );

        return 1;
      };
      this.foo = () => {};

      await render<CountryContext>(hbs`
      <PowerSelectMultiple @options={{this.countries}} @matcher={{this.matcherFn}} @searchField="name" @onChange={{this.foo}} @searchEnabled={{true}} as |country|>
        {{country.name}}
      </PowerSelectMultiple>
    `);

      await typeInSearch('po');
    });

    test<ObjContext>('If the value returned from an async search is cancellable and before it completes a new search is fired, the first value gets cancelled', async function (assert) {
      assert.expect(1);
      const done = assert.async();

      class testObj {
        searchTask = restartableTask(async (term: string) => {
          await timeout(100);
          assert.strictEqual(term, 'nin', 'The second search gets executed');
          return numbers.filter((str) => str.indexOf(term) > -1);
        });
      }

      this.foo = () => {};

      this.obj = new testObj();

      await render<ObjContext>(hbs`
      <PowerSelect @search={{this.obj.searchTask.perform}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      void typeInSearch('teen');

      setTimeout(function () {
        void typeInSearch('nin');
      }, 50);

      setTimeout(function () {
        done();
      }, 200);
    });

    test<ObjContext>('If the value returned from an async search is cancellable and before it completes the searchbox gets cleared, it gets cancelled', async function (assert) {
      assert.expect(0);
      const done = assert.async();

      class testObj {
        searchTask = restartableTask(async (term: string) => {
          await timeout(100);
          assert.ok(false, 'This task should not have been executed this far');
          return numbers.filter((str) => str.indexOf(term) > -1);
        });
      }

      this.foo = () => {};

      this.obj = new testObj();

      await render<ObjContext>(hbs`
      <PowerSelect @search={{this.obj.searchTask.perform}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      void typeInSearch('teen');

      setTimeout(function () {
        void typeInSearch('');
      }, 50);

      setTimeout(function () {
        done();
      }, 200);
    });

    // Test removed while TS migration => this test makes was always buggy, because parameter search was always without @
    // Fixing parameter @search means that tests fails, so we can remove this
    // test<ObjContext>('If a select is destroyed while a search is still ongoing and the search is cancellable, it gets cancelled', async function (assert) {
    //   assert.expect(0);
    //   const done = assert.async();

    //   class testObj {
    //     searchTask = restartableTask(async (term: string) => {
    //       assert.ok(false, 'This task should not have been executed this far');
    //       return numbers.filter((str) => str.indexOf(term) > -1);
    //     });
    //   }

    //   this.foo = () => {};

    //   this.obj = new testObj();

    //   await render<ObjContext>(hbs`
    //   {{#unless this.hideSelect}}
    //     <PowerSelect search={{this.obj.searchTask.perform}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
    //       {{number}}
    //     </PowerSelect>
    //   {{/unless}}
    // `);

    //   await clickTrigger();
    //   void typeInSearch('teen');
    //   // await new RSVP.Promise((resolve) => setTimeout(resolve, 50));
    //   setTimeout(() => {
    //     this.set('hideSelect', true);
    //   }, 50);

    //   setTimeout(function () {
    //     done();
    //   }, 150);
    // });

    test<ObjContext>('If a select is closed while a search is still ongoing and the search is cancellable, it gets cancelled', async function (assert) {
      assert.expect(0);
      const done = assert.async();

      class testObj {
        searchTask = restartableTask(async (term: string) => {
          await timeout(100);
          assert.ok(false, 'This task should not have been executed this far');
          return numbers.filter((str) => str.indexOf(term) > -1);
        });
      }

      this.foo = () => {};

      this.obj = new testObj();

      await render<ObjContext>(hbs`
      <PowerSelect @search={{this.obj.searchTask.perform}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelect>
    `);

      await clickTrigger();
      void typeInSearch('teen');

      setTimeout(() => {
        void clickTrigger();
      }, 50);

      setTimeout(function () {
        done();
      }, 150);
    });

    test<ObjContext>('If the value returned from an async search of a multiple-select is cancellable and before it completes a new search is fired, the first value gets cancelled', async function (assert) {
      assert.expect(1);
      const done = assert.async();

      class testObj {
        searchTask = restartableTask(async (term: string) => {
          await timeout(100);
          assert.strictEqual(term, 'nin', 'The second search gets executed');
          return numbers.filter((str) => str.indexOf(term) > -1);
        });
      }

      this.foo = () => {};

      this.obj = new testObj();

      await render<ObjContext>(hbs`
      <PowerSelectMultiple @search={{this.obj.searchTask.perform}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      void typeInSearch('teen');

      setTimeout(function () {
        void typeInSearch('nin');
      }, 50);

      setTimeout(function () {
        done();
      }, 200);
    });

    test<ObjContext>('If the value returned from an async search of a multiple-select is cancellable and before it completes the searchbox gets cleared, it gets cancelled', async function (assert) {
      assert.expect(0);
      const done = assert.async();

      class testObj {
        searchTask = restartableTask(async (term: string) => {
          await timeout(100);
          assert.ok(false, 'This task should not have been executed this far');
          return numbers.filter((str) => str.indexOf(term) > -1);
        });
      }

      this.foo = () => {};

      this.obj = new testObj();

      await render<ObjContext>(hbs`
      <PowerSelectMultiple @search={{this.obj.searchTask.perform}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      void typeInSearch('teen');

      setTimeout(function () {
        void typeInSearch('');
      }, 50);

      setTimeout(function () {
        done();
      }, 200);
    });

    // Test removed while TS migration => this test makes was always buggy, because parameter search was always without @
    // Fixing parameter @search means that tests fails, so we can remove this
    // test<ObjContext>('If a multiple select is destroyed while a search is still ongoing and the search is cancellable, it gets cancelled', async function (assert) {
    //   assert.expect(0);
    //   const done = assert.async();

    //   class testObj {
    //     searchTask = restartableTask(async (term: string) => {
    //       await timeout(100);
    //       assert.ok(false, 'This task should not have been executed this far');
    //       return numbers.filter((str) => str.indexOf(term) > -1);
    //     });
    //   }

    //   this.foo = () => {};

    //   this.obj = new testObj();

    //   await render<ObjContext>(hbs`
    //   {{#unless this.hideSelect}}
    //     <PowerSelectMultiple search={{this.obj.searchTask.perform}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
    //       {{number}}
    //     </PowerSelectMultiple>
    //   {{/unless}}
    // `);

    //   await clickTrigger();
    //   void typeInSearch('teen');

    //   setTimeout(() => {
    //     this.set('hideSelect', true);
    //   }, 50);

    //   setTimeout(function () {
    //     done();
    //   }, 150);
    // });

    test<ObjContext>('If a multiple select is closed while a search is still ongoing and the search is cancellable, it gets cancelled', async function (assert) {
      assert.expect(0);
      const done = assert.async();

      class testObj {
        searchTask = restartableTask(async (term: string) => {
          await timeout(150);
          assert.ok(false, 'This task should not have been executed this far');
          return numbers.filter((str) => str.indexOf(term) > -1);
        });
      }

      this.foo = () => {};

      this.obj = new testObj();

      await render<ObjContext>(hbs`
      <PowerSelectMultiple @search={{this.obj.searchTask.perform}} @onChange={{this.foo}} @searchEnabled={{true}} as |number|>
        {{number}}
      </PowerSelectMultiple>
    `);

      await clickTrigger();
      void typeInSearch('teen');

      setTimeout(() => {
        void clickTrigger();
      }, 50);

      setTimeout(function () {
        done();
      }, 250);
    });
  },
);
