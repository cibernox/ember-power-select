import EmberObject from '@ember/object';
import { later } from '@ember/runloop';
import { task, timeout } from 'ember-concurrency';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, click, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { typeInSearch, clickTrigger } from 'ember-power-select/test-support/helpers';
import { numbers, countries } from '../constants';
import RSVP from 'rsvp';

module('Integration | Component | Ember Power Select (Custom search function)', function(hooks) {
  setupRenderingTest(hooks);

  test('When you pass a custom search action instead of options, opening the select show a "Type to search" message in a list element', async function(assert) {
    assert.expect(1);

    this.searchFn = function() {};

    await render(hbs`
      {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-option').hasText('Type to search', 'The dropdown shows the "type to search" message');
  });

  test('The search text shouldn\'t appear if options are loading', async function(assert) {
    assert.expect(2);

    this.options = [];
    this.searchFn = function() {};

    await render(hbs`
      {{#power-select options=options search=searchFn onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    this.set('options', new RSVP.Promise(function(resolve) {
      later(function() {
        resolve(numbers);
      }, 100);
    }));
    clickTrigger();
    await waitFor('.ember-power-select-dropdown');
    assert.dom('.ember-power-select-dropdown').doesNotIncludeText('Type to search', 'The type to search message doesn\'t show');
    assert.dom('.ember-power-select-dropdown').includesText('Loading options...', '"Loading options..." message appears');
  });

  test('When no options are given but there is a search action, a "type to search" message is rendered', async function(assert) {
    assert.expect(2);

    this.searchFn = function() {};
    await render(hbs`
      {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-option').hasText('Type to search');
    assert.dom('.ember-power-select-option').hasClass('ember-power-select-option--search-message', 'The option with the search message has a special class');
  });

  test('The "type to search" message can be customized passing `searchMessage=something`', async function(assert) {
    assert.expect(1);

    this.searchFn = function() {};
    await render(hbs`
      {{#power-select search=searchFn searchMessage="Type the name of the thing" onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-option').hasText('Type the name of the thing');
  });

  test('The search function can return an array and those options get rendered', async function(assert) {
    assert.expect(1);

    this.searchFn = function(term) {
      return numbers.filter((str) => str.indexOf(term) > -1);
    };

    await render(hbs`
      {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    await typeInSearch('teen');
    assert.dom('.ember-power-select-option').exists({ count: 7 });
  });

  test('The search function can return a promise that resolves to an array and those options get rendered', async function(assert) {
    assert.expect(1);

    this.searchFn = function(term) {
      return new RSVP.Promise(function(resolve) {
        later(function() {
          resolve(numbers.filter((str) => str.indexOf(term) > -1));
        }, 100);
      });
    };

    await render(hbs`
      {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    typeInSearch('teen');

    await settled()
    assert.dom('.ember-power-select-option').exists({ count: 7 });
  });

  test('While the async search is being performed the "Type to search" dissapears the "Loading..." message appears', async function(assert) {
    assert.expect(3);

    this.searchFn = function(term) {
      return new RSVP.Promise(function(resolve) {
        later(function() {
          resolve(numbers.filter((str) => str.indexOf(term) > -1));
        }, 100);
      });
    };

    await render(hbs`
      {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-dropdown').includesText('Type to search', 'The type to search message is displayed');
    typeInSearch('teen');
    await waitFor('.ember-power-select-option:not(.ember-power-select-option--search-message)');
    assert.dom('.ember-power-select-dropdown').doesNotIncludeText('Type to search', 'The type to search message dissapeared');
    assert.dom('.ember-power-select-dropdown').includesText('Loading options...', '"Loading options..." message appears');
  });

  test('When the search resolves to an empty array then the "No results found" message or block appears.', async function(assert) {
    assert.expect(1);

    this.searchFn = function() {
      return new RSVP.Promise(function(resolve) {
        later(function() {
          resolve([]);
        }, 10);
      });
    };

    await render(hbs`
      {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    await typeInSearch('teen');
    assert.dom('.ember-power-select-option').includesText('No results found', 'The default "No results" message renders');
  });

  test('When the search resolves to an empty array then the custom "No results" message appears', async function(assert) {
    assert.expect(1);

    this.searchFn = function() {
      return new RSVP.Promise(function(resolve) {
        later(function() {
          resolve([]);
        }, 10);
      });
    };

    await render(hbs`
      {{#power-select search=searchFn noMatchesMessage="Meec. Try again" onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    typeInSearch('teen');
    await settled();
    assert.dom('.ember-power-select-option').includesText('Meec. Try again', 'The customized "No results" message renders');
  });

  test('When the search resolves to an empty array then the custom alternate block renders', async function(assert) {
    assert.expect(1);

    this.searchFn = function() {
      return new RSVP.Promise(function(resolve) {
        later(function() {
          resolve([]);
        }, 10);
      });
    };

    await render(hbs`
      {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{else}}
        <span class="foo-bar">Baz</span>
      {{/power-select}}
    `);

    await clickTrigger();
    typeInSearch('teen');
    await settled();
    assert.dom('.ember-power-select-dropdown .foo-bar').exists('The alternate block message gets rendered');
  });

  //    Random failure test. Fix
  //
  //
  // test('When one search is fired before the previous one resolved, the "Loading" continues until the 2nd is resolved', function(assert) {
  //   var done = assert.async();
  //   assert.expect(2);

  //   this.searchFn = function() {
  //     return new RSVP.Promise(function(resolve) {
  //       later(function() { resolve(numbers); }, 100);
  //     });
  //   };

  //   this.render(hbs`
  //     {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
  //       {{number}}
  //     {{/power-select}}
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

  test('On an empty select, when the search resolves, the first element is highlighted like with regular filtering', async function(assert) {
    assert.expect(1);

    this.searchFn = function(term) {
      return new RSVP.Promise(function(resolve) {
        later(function() {
          resolve(numbers.filter((str) => str.indexOf(term) > -1));
        }, 100);
      });
    };

    await render(hbs`
      {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    typeInSearch('teen');

    await settled();
    assert.dom('.ember-power-select-option').hasAttribute('aria-current', 'true', 'The first result is highlighted');
  });

  test('On an select with a selected value, if after a search this value is not among the options the first element is highlighted', async function(assert) {
    assert.expect(2);

    this.numbers = numbers;
    this.selected = numbers[2];
    this.searchFn = function(term) {
      return new RSVP.Promise(function(resolve) {
        later(function() {
          resolve(numbers.filter((str) => str.indexOf(term) > -1));
        }, 100);
      });
    };

    await render(hbs`
      {{#power-select search=searchFn options=numbers selected=selected onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-option:nth-child(3)').hasAttribute('aria-current', 'true', 'The 3rd result is highlighted');
    typeInSearch('teen');

    await settled();
    assert.dom('.ember-power-select-option').hasAttribute('aria-current', 'true', 'The first result is highlighted');
  });

  test('Closing a component with a custom search cleans the search box and the results list', async function(assert) {
    assert.expect(5);
    this.searchFn = function(term) {
      return RSVP.resolve(numbers.filter((str) => str.indexOf(term) > -1));
    };

    await render(hbs`
      <div id="different-node"></div>
      {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    await typeInSearch('teen');
    assert.dom('.ember-power-select-option').exists({ count: 7 }, 'Results are filtered');
    assert.dom('.ember-power-select-search-input').hasValue('teen');
    await click('#different-node');

    await clickTrigger();
    assert.dom('.ember-power-select-option').exists({ count: 1 }, 'Results have been cleared');
    assert.dom('.ember-power-select-option').hasText('Type to search');
    assert.dom('.ember-power-select-search-input').hasNoValue('The searchbox was cleared');
  });

  test('When received both options and search, those options are shown when the dropdown opens before the first search is performed', async function(assert) {
    assert.expect(4);

    this.numbers = numbers;
    this.searchFn = (term) => {
      return new RSVP.Promise(function(resolve) {
        later(function() {
          resolve(numbers.filter((str) => str.indexOf(term) > -1));
        }, 150);
      });
    };

    await render(hbs`
      <div id="different-node"></div>
      {{#power-select options=numbers search=searchFn onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-option').exists({ count: 20 }, 'All the options are shown');
    typeInSearch('teen');
    await waitFor('.ember-power-select-option--loading-message');
    assert.dom('.ember-power-select-option').exists({ count: 21 }, 'All the options are shown and also the loading message');
    assert.dom('.ember-power-select-option').hasText('Loading options...');
    await settled();
    assert.dom('.ember-power-select-option').exists({ count: 7 }, 'All the options are shown but no the loading message');
  });

  test('Don\'t return from the search action and update the options instead also works as an strategy', async function(assert) {
    assert.expect(2);

    this.selectedOptions = numbers;
    this.searchFn = (term) => {
      later(() => {
        this.set('selectedOptions', numbers.filter((str) => str.indexOf(term) > -1));
      }, 20);
    };

    await render(hbs`
      <div id="different-node"></div>
      {{#power-select options=selectedOptions search=searchFn onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-option').exists({ count: 20 }, 'All the options are shown');
    typeInSearch('teen');

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
  //       later(() => {
  //         resolve(numbers.filter((str) => str.indexOf(term) > -1));
  //       }, 30);
  //     });
  //     this.set('selectedOptions', promise);
  //   };

  //   this.render(hbs`
  //     <div id="different-node"></div>
  //     {{#power-select options=selectedOptions search=searchFn onchange=(action (mut foo)) as |number|}}
  //       {{number}}
  //     {{/power-select}}
  //   `);

  //   clickTrigger();
  //   assert.equal(findAll('.ember-power-select-option').length, 20, 'All the options are shown');
  //   typeInSearch('teen');
  //   assert.equal(findAll('.ember-power-select-option').length, 21, 'All the options are shown plus the loading message');
  //   assert.equal(findAll('.ember-power-select-option')[0].textContent.trim(), 'Loading options...', 'The loading message is shown');

  //   setTimeout(function() {
  //     assert.equal(searchCalls, 1, 'The search was called only once');
  //     assert.equal(findAll('.ember-power-select-option').length, 7);
  //     typeInSearch('seven');
  //     assert.equal(findAll('.ember-power-select-option')[0].textContent.trim(), 'Loading options...', 'The loading message is shown');
  //     assert.equal(findAll('.ember-power-select-option').length, 8);
  //   }, 40);

  //   setTimeout(function() {
  //     assert.equal(searchCalls, 2, 'The search was called only twice');
  //     assert.equal(findAll('.ember-power-select-option').length, 8);
  //     assert.equal(findAll('.ember-power-select-option')[0].textContent.trim(), 'Loading options...', 'It is still searching the previous result');
  //     typeInSearch('four');
  //     assert.equal(findAll('.ember-power-select-option')[0].textContent.trim(), 'Loading options...', 'The loading message is shown');
  //     assert.equal(findAll('.ember-power-select-option').length, 8);
  //   }, 60);

  //   setTimeout(function() {
  //     assert.equal(searchCalls, 3, 'The search was called only three times');
  //     assert.equal(findAll('.ember-power-select-option').length, 2);
  //     done();
  //   }, 300);
  // });

  test('If you delete the last char of the input before the previous promise resolves, that promise is discarded', async function(assert) {
    let done = assert.async();
    assert.expect(2);
    this.numbers = numbers;
    this.searchFn = function(term) {
      return new RSVP.Promise(function(resolve) {
        setTimeout(function() {
          resolve(numbers.filter((str) => str.indexOf(term) > -1));
        }, 100);
      });
    };

    await render(hbs`
      {{#power-select options=numbers search=searchFn onchange=(action (mut foo)) as |number select|}}
        {{number}}:{{select.lastSearchedText}}
      {{/power-select}}
    `);

    await clickTrigger();
    typeInSearch('teen');
    setTimeout(function() {
      typeInSearch('t');
    }, 150);
    setTimeout(function() {
      typeInSearch('');
    }, 200);
    setTimeout(function() {
      assert.dom('.ember-power-select-option').exists({ count: numbers.length }, 'All the options are displayed after clearing the search');
      assert.dom('.ember-power-select-option:nth-child(2)').hasText('two:', 'The results are the original options');
      done();
    }, 300);
  });

  test('The lastSearchedText of the yielded publicAPI in single selects is updated only when the async search for it finishes', async function(assert) {
    assert.expect(3);
    this.numbers = numbers;
    this.searchFn = function(term) {
      return new RSVP.Promise(function(resolve) {
        later(function() {
          resolve(numbers.filter((str) => str.indexOf(term) > -1));
        }, 100);
      });
    };

    await render(hbs`
      {{#power-select options=numbers search=searchFn onchange=(action (mut foo)) as |number select|}}
        {{number}}:{{select.lastSearchedText}}
      {{/power-select}}
    `);

    await clickTrigger();
    await typeInSearch('teen');
    assert.dom('.ember-power-select-option').hasText('thirteen:teen', 'The results and the lastSearchedText have updated');
    typeInSearch('four');
    await waitFor('.ember-power-select-option--loading-message');
    assert.dom('.ember-power-select-option').hasText('Loading options...', 'There is a search going on');
    assert.dom('.ember-power-select-option:nth-child(2)').hasText('thirteen:teen', 'The results and the lastSearchedText are still the same because the search has not finished yet');
  });

  test('The lastSearchedText of the yielded publicAPI in multiple selects is updated only when the async search for it finishes', async function(assert) {
    assert.expect(3);
    this.numbers = numbers;
    this.searchFn = function(term) {
      return new RSVP.Promise(function(resolve) {
        later(function() {
          resolve(numbers.filter((str) => str.indexOf(term) > -1));
        }, 100);
      });
    };

    await render(hbs`
      {{#power-select-multiple options=numbers search=searchFn onchange=(action (mut foo)) as |number select|}}
        {{number}}:{{select.lastSearchedText}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    await typeInSearch('teen');
    assert.dom('.ember-power-select-option').hasText('thirteen:teen', 'The results and the searchTerm have updated');
    typeInSearch('four');
    await waitFor('.ember-power-select-option--loading-message');
    assert.dom('.ember-power-select-option').hasText('Loading options...', 'There is a search going on');
    assert.dom('.ember-power-select-option:nth-child(2)').hasText('thirteen:teen', 'The results and the searchTerm are still the same because the search has not finished yet');
  });

  test('BUGFIX: Destroy a component why an async search is pending does not cause an error', async function(assert) {
    assert.expect(0); // This test has no assertions. The fact that nothing fails is the proof that it works
    this.numbers = numbers;
    this.visible = true;

    this.searchFn = function(term) {
      return new RSVP.Promise(function(resolve) {
        later(function() {
          resolve(numbers.filter((str) => str.indexOf(term) > -1));
        }, 200);
      });
    };

    await render(hbs`
      {{#if visible}}
        {{#power-select-multiple options=numbers search=searchFn onchange=(action (mut foo)) as |number searchTerm|}}
          {{number}}:{{searchTerm}}
        {{/power-select-multiple}}
      {{/if}}
    `);

    await clickTrigger();
    await typeInSearch('teen');
    this.set('visible', false);
  });

  test('BUGFIX: When the given options are a promise and a search function is provided, clearing the search must display the results of the original promise', async function(assert) {
    assert.expect(3);
    this.numbersPromise = RSVP.Promise.resolve(numbers);

    this.searchFn = function(term) {
      return numbers.filter((str) => str.indexOf(term) > -1);
    };

    await render(hbs`
     {{#power-select options=numbersPromise search=searchFn selected=foo onchange=(action (mut foo)) as |number|}}
       {{number}}
     {{/power-select}}
    `);

    await clickTrigger();
    assert.dom('.ember-power-select-option').exists({ count: 20 }, 'There is 20 options');
    await typeInSearch('teen');
    assert.dom('.ember-power-select-option').exists({ count: 7 }, 'There is 7 options');
    await typeInSearch('');
    assert.dom('.ember-power-select-option').exists({ count: 20 }, 'There is 20 options again§');
  });

  test('BUGFIX: If the user provides a custom matcher, that matcher receives the entire option even if the user also provided a searchField', async function(assert) {
    assert.expect(7);
    this.countries = countries;
    this.matcherFn = function(option) {
      assert.equal(typeof option, 'object', 'The first argument received by the custom matches is the option itself');
    };
    await render(hbs`
      {{#power-select-multiple options=countries matcher=matcherFn searchField="name" onchange=(action (mut foo)) as |number searchTerm|}}
        {{country.name}}
      {{/power-select-multiple}}
    `);

    typeInSearch('po');
  });

  test('If the value returned from an async search is cancellable and before it completes a new search is fired, the first value gets cancelled', async function(assert) {
    assert.expect(1);
    let done = assert.async();

    this.obj = EmberObject.extend({
      searchTask: task(function* (term) {
        yield timeout(100);
        assert.equal(term, 'nin', 'The second search gets executed');
        return numbers.filter((str) => str.indexOf(term) > -1);
      })
    }).create();

    await render(hbs`
      {{#power-select search=(perform obj.searchTask) onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    typeInSearch('teen');

    setTimeout(function() {
      typeInSearch('nin');
    }, 50);

    setTimeout(function() {
      done();
    }, 200);
  });

  test('If the value returned from an async search is cancellable and before it completes the searchbox gets cleared, it gets cancelled', async function(assert) {
    assert.expect(0);
    let done = assert.async();

    this.obj = EmberObject.extend({
      searchTask: task(function* (term) {
        yield timeout(100);
        assert.ok(false, 'This task should not have been executed this far');
        return numbers.filter((str) => str.indexOf(term) > -1);
      })
    }).create();

    await render(hbs`
      {{#power-select search=(perform obj.searchTask) onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    typeInSearch('teen');

    setTimeout(function() {
      typeInSearch('');
    }, 50);

    setTimeout(function() {
      done();
    }, 200);
  });

  test('If a select is destroyed while a search is still ongoing and the search is cancellable, it gets cancelled', async function(assert) {
    assert.expect(0);
    let done = assert.async();

    this.obj = EmberObject.extend({
      searchTask: task(function* (term) {
        yield timeout(100).linked();
        assert.ok(false, 'This task should not have been executed this far');
        return numbers.filter((str) => str.indexOf(term) > -1);
      })
    }).create();

    await render(hbs`
      {{#unless hideSelect}}
        {{#power-select search=(perform obj.searchTask) onchange=(action (mut foo)) as |number|}}
          {{number}}
        {{/power-select}}
      {{/unless}}
    `);

    await clickTrigger();
    typeInSearch('teen');
    // await new RSVP.Promise((resolve) => setTimeout(resolve, 50));
    setTimeout(() => {
      this.set('hideSelect', true);
    }, 50);

    setTimeout(function() {
      done();
    }, 150);
  });

  test('If a select is closed while a search is still ongoing and the search is cancellable, it gets cancelled', async function(assert) {
    assert.expect(0);
    let done = assert.async();

    this.obj = EmberObject.extend({
      searchTask: task(function* (term) {
        yield timeout(100);
        assert.ok(false, 'This task should not have been executed this far');
        return numbers.filter((str) => str.indexOf(term) > -1);
      })
    }).create();

    await render(hbs`
      {{#power-select search=(perform obj.searchTask) onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select}}
    `);

    await clickTrigger();
    typeInSearch('teen');

    setTimeout(() => {
      clickTrigger();
    }, 50);

    setTimeout(function() {
      done();
    }, 150);
  });

  test('If the value returned from an async search of a multiple-select is cancellable and before it completes a new search is fired, the first value gets cancelled', async function(assert) {
    assert.expect(1);
    let done = assert.async();

    this.obj = EmberObject.extend({
      searchTask: task(function* (term) {
        yield timeout(100);
        assert.equal(term, 'nin', 'The second search gets executed');
        return numbers.filter((str) => str.indexOf(term) > -1);
      })
    }).create();

    await render(hbs`
      {{#power-select-multiple search=(perform obj.searchTask) onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    typeInSearch('teen');

    setTimeout(function() {
      typeInSearch('nin');
    }, 50);

    setTimeout(function() {
      done();
    }, 200);
  });

  test('If the value returned from an async search of a multiple-select is cancellable and before it completes the searchbox gets cleared, it gets cancelled', async function(assert) {
    assert.expect(0);
    let done = assert.async();

    this.obj = EmberObject.extend({
      searchTask: task(function* (term) {
        yield timeout(100);
        assert.ok(false, 'This task should not have been executed this far');
        return numbers.filter((str) => str.indexOf(term) > -1);
      })
    }).create();

    await render(hbs`
      {{#power-select-multiple search=(perform obj.searchTask) onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    typeInSearch('teen');

    setTimeout(function() {
      typeInSearch('');
    }, 50);

    setTimeout(function() {
      done();
    }, 200);
  });

  test('If a multiple select is destroyed while a search is still ongoing and the search is cancellable, it gets cancelled', async function(assert) {
    assert.expect(0);
    let done = assert.async();

    this.obj = EmberObject.extend({
      searchTask: task(function* (term) {
        yield timeout(100).linked();
        assert.ok(false, 'This task should not have been executed this far');
        return numbers.filter((str) => str.indexOf(term) > -1);
      })
    }).create();

    await render(hbs`
      {{#unless hideSelect}}
        {{#power-select-multiple search=(perform obj.searchTask) onchange=(action (mut foo)) as |number|}}
          {{number}}
        {{/power-select-multiple}}
      {{/unless}}
    `);

    await clickTrigger();
    typeInSearch('teen');

    setTimeout(() => {
      this.set('hideSelect', true);
    }, 50);

    setTimeout(function() {
      done();
    }, 150);
  });

  test('If a multiple select is closed while a search is still ongoing and the search is cancellable, it gets cancelled', async function(assert) {
    assert.expect(0);
    let done = assert.async();

    this.obj = EmberObject.extend({
      searchTask: task(function* (term) {
        yield timeout(150);
        assert.ok(false, 'This task should not have been executed this far');
        return numbers.filter((str) => str.indexOf(term) > -1);
      })
    }).create();

    await render(hbs`
      {{#power-select-multiple search=(perform obj.searchTask) onchange=(action (mut foo)) as |number|}}
        {{number}}
      {{/power-select-multiple}}
    `);

    await clickTrigger();
    typeInSearch('teen');

    setTimeout(() => {
      clickTrigger();
    }, 50);

    setTimeout(function() {
      done();
    }, 250);
  });
});

