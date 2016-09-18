import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import { typeInSearch, clickTrigger } from '../../../helpers/ember-power-select';
import { numbers, countries } from '../constants';

const { RSVP } = Ember;

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Custom search function)', {
  integration: true
});

test('When you pass a custom search action instead of options, opening the select show a "Type to search" message in a list element', function(assert) {
  assert.expect(1);

  this.searchFn = function() {};

  this.render(hbs`
    {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option').text().trim(), 'Type to search', 'The dropdown shows the "type to seach" message');
});

test('When no options are given but there is a search action, a "type to search" message is rendered', function(assert) {
  assert.expect(2);

  this.searchFn = function() {};
  this.render(hbs`
    {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option').text().trim(), 'Type to search');
  assert.ok($('.ember-power-select-option').hasClass('ember-power-select-option--search-message'), 'The option with the search message has a special class');
});

test('The "type to search" message can be customized passing `searchMessage=something`', function(assert) {
  assert.expect(1);

  this.searchFn = function() {};
  this.render(hbs`
    {{#power-select search=searchFn searchMessage="Type the name of the thing" onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option').text().trim(), 'Type the name of the thing');
});

test('The search function can return an array and those options get rendered', function(assert) {
  assert.expect(1);

  this.searchFn = function(term) {
    return numbers.filter(str => str.indexOf(term) > -1);
  };

  this.render(hbs`
    {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch("teen");
  assert.equal($('.ember-power-select-option').length, 7);
});

test('The search function can return a promise that resolves to an array and those options get rendered', function(assert) {
  assert.expect(1);

  this.searchFn = function(term) {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() {
        resolve(numbers.filter(str => str.indexOf(term) > -1));
      }, 100);
    });
  };

  this.render(hbs`
    {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch("teen");

  return wait().then(function() {
    assert.equal($('.ember-power-select-option').length, 7);
  });
});

test('While the async search is being performed the "Type to search" dissapears the "Loading..." message appears', function(assert) {
  assert.expect(3);

  this.searchFn = function(term) {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() {
        resolve(numbers.filter(str => str.indexOf(term) > -1));
      }, 100);
    });
  };

  this.render(hbs`
    {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.ok(/Type to search/.test($('.ember-power-select-dropdown').text()), 'The type to search message is displayed');
  typeInSearch("teen");
  assert.ok(!/Type to search/.test($('.ember-power-select-dropdown').text()), 'The type to search message dissapeared');
  assert.ok(/Loading options\.\.\./.test($('.ember-power-select-dropdown').text()), '"Loading options..." message appears');
  return wait();
});

test('When the search resolves to an empty array then the "No results found" message or block appears.', function(assert) {
  assert.expect(1);

  this.searchFn = function() {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() { resolve([]); }, 10);
    });
  };

  this.render(hbs`
    {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch("teen");
  return wait().then(function() {
    assert.ok(/No results found/.test($('.ember-power-select-option').text()), 'The default "No results" message renders');
  });
});

test('When the search resolves to an empty array then the custom "No results" message appears', function(assert) {
  assert.expect(1);

  this.searchFn = function() {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() { resolve([]); }, 10);
    });
  };

  this.render(hbs`
    {{#power-select search=searchFn noMatchesMessage="Meec. Try again" onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch("teen");
  return wait().then(function() {
    assert.ok(/Meec\. Try again/.test($('.ember-power-select-option').text()), 'The customized "No results" message renders');
  });
});

test('When the search resolves to an empty array then the custom alternate block renders', function(assert) {
  assert.expect(1);

  this.searchFn = function() {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() { resolve([]); }, 10);
    });
  };

  this.render(hbs`
    {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{else}}
      <span class="foo-bar">Baz</span>
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch("teen");
  return wait().then(function() {
    assert.equal($('.ember-power-select-dropdown .foo-bar').length, 1, 'The alternate block message gets rendered');
  });
});

//    Random failure test. Fix
//
//
// test('When one search is fired before the previous one resolved, the "Loading" continues until the 2nd is resolved', function(assert) {
//   var done = assert.async();
//   assert.expect(2);

//   this.searchFn = function() {
//     return new RSVP.Promise(function(resolve) {
//       Ember.run.later(function() { resolve(numbers); }, 100);
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
//     typeInSearch("teen");
//   }, 50);

//   setTimeout(function() {
//     assert.ok(/Loading options/.test($('.ember-power-select-option').text().trim()), 'The loading message is visible');
//     assert.equal($('.ember-power-select-option').length, 1, 'No results are shown');
//   }, 120);

//   setTimeout(done, 180);
// });

test('On an empty select, when the search resolves, the first element is highlighted like with regular filtering', function(assert) {
  assert.expect(1);

  this.searchFn = function(term) {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() {
        resolve(numbers.filter(str => str.indexOf(term) > -1));
      }, 100);
    });
  };

  this.render(hbs`
    {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch("teen");

  return wait().then(function() {
    assert.equal($('.ember-power-select-option:eq(0)').attr('aria-current'), 'true', 'The first result is highlighted');
  });
});

test('On an select with a selected value, if after a search this value is not among the options the first element is highlighted', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.selected = numbers[2];
  this.searchFn = function(term) {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() {
        resolve(numbers.filter(str => str.indexOf(term) > -1));
      }, 100);
    });
  };

  this.render(hbs`
    {{#power-select search=searchFn options=numbers selected=selected onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option:eq(2)').attr('aria-current'), 'true', 'The 3rd result is highlighted');
  typeInSearch("teen");

  return wait().then(function() {
    assert.equal($('.ember-power-select-option:eq(0)').attr('aria-current'), 'true', 'The first result is highlighted');
  });
});

test('Closing a component with a custom search cleans the search box and the results list', function(assert) {
  assert.expect(5);
  this.searchFn = function(term) {
    return RSVP.resolve(numbers.filter(str => str.indexOf(term) > -1));
  };

  this.render(hbs`
    <div id="different-node"></div>
    {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch("teen");
  assert.equal($('.ember-power-select-option').length, 7, 'Results are filtered');
  assert.equal($('.ember-power-select-search-input').val(), 'teen');
  Ember.run(() => {
    let event = new window.Event('mousedown');
    this.$('#different-node')[0].dispatchEvent(event);
  });
  clickTrigger();
  assert.equal($('.ember-power-select-option').length, 1, 'Results have been cleared');
  assert.equal($('.ember-power-select-option').text().trim(), 'Type to search');
  assert.equal($('.ember-power-select-search-input').val(), '', 'The searchbox was cleared');
});

test('When received both options and search, those options are shown when the dropdown opens before the first search is performed', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.searchFn = (term) => {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() {
        resolve(numbers.filter(str => str.indexOf(term) > -1));
      }, 50);
    });
  };

  this.render(hbs`
    <div id="different-node"></div>
    {{#power-select options=numbers search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option').length, 20, 'All the options are shown');
  typeInSearch("teen");
  assert.equal($('.ember-power-select-option').length, 21, 'All the options are shown and also the loading message');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Loading options...');
  return wait().then(function() {
    assert.equal($('.ember-power-select-option').length, 7, 'All the options are shown but no the loading message');
  });
});

test('Don\'t return from the search action and update the options instead also works as an strategy', function(assert) {
  assert.expect(2);

  this.selectedOptions = numbers;
  this.searchFn = (term) => {
    Ember.run.later(() => {
      this.set('selectedOptions', numbers.filter(str => str.indexOf(term) > -1));
    }, 20);
  };

  this.render(hbs`
    <div id="different-node"></div>
    {{#power-select options=selectedOptions search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option').length, 20, 'All the options are shown');
  typeInSearch("teen");

  return wait().then(function() {
    assert.equal($('.ember-power-select-option').length, 7);
  });
});

test('Setting the options to a promise from the custom search function works (and does not prevent further searches)', function(assert) {
  let done = assert.async();
  assert.expect(14);

  this.selectedOptions = RSVP.resolve(numbers);
  let searchCalls = 0;
  this.searchFn = (term) => {
    searchCalls++;
    let promise = new RSVP.Promise(function(resolve) {
      Ember.run.later(() => {
        resolve(numbers.filter(str => str.indexOf(term) > -1));
      }, 30);
    });
    this.set('selectedOptions', promise);
  };

  this.render(hbs`
    <div id="different-node"></div>
    {{#power-select options=selectedOptions search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option').length, 20, 'All the options are shown');
  typeInSearch("teen");
  assert.equal($('.ember-power-select-option').length, 21, 'All the options are shown plus the loading message');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Loading options...', 'The loading message is shown');

  setTimeout(function() {
    assert.equal(searchCalls, 1, 'The search was called only once');
    assert.equal($('.ember-power-select-option').length, 7);
    typeInSearch("seven");
    assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Loading options...', 'The loading message is shown');
    assert.equal($('.ember-power-select-option').length, 8);
  }, 40);

  setTimeout(function() {
    assert.equal(searchCalls, 2, 'The search was called only twice');
    assert.equal($('.ember-power-select-option').length, 8);
    assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Loading options...', 'It is still searching the previous result');
    typeInSearch("four");
    assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Loading options...', 'The loading message is shown');
    assert.equal($('.ember-power-select-option').length, 8);
  }, 60);

  setTimeout(function() {
    assert.equal(searchCalls, 3, 'The search was called only three times');
    assert.equal($('.ember-power-select-option').length, 2);
    done();
  }, 300);
});

test('If you delete the last char of the input before the previous promise resolves, that promise is discarded', function(assert) {
  let done = assert.async();
  assert.expect(2);
  this.numbers = numbers;
  this.searchFn = function(term) {
    return new RSVP.Promise(function(resolve) {
      setTimeout(function() {
        resolve(numbers.filter(str => str.indexOf(term) > -1));
      }, 100);
    });
  };

  this.render(hbs`
    {{#power-select options=numbers search=searchFn onchange=(action (mut foo)) as |number select|}}
      {{number}}:{{select.lastSearchedText}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch("teen");
  setTimeout(function() {
    typeInSearch("t");
  }, 150);
  setTimeout(function() {
    typeInSearch("");
  }, 200);
  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, numbers.length, 'All the options are displayed after clearing the search');
    assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'two:', 'The results are the original options');
    done();
  }, 300);
});

test('The lastSearchedText of the yielded publicAPI in single selects is updated only when the async search for it finishes', function(assert) {
  let done = assert.async();
  assert.expect(3);
  this.numbers = numbers;
  this.searchFn = function(term) {
    return new RSVP.Promise(function(resolve) {
      setTimeout(function() {
        resolve(numbers.filter(str => str.indexOf(term) > -1));
      }, 100);
    });
  };

  this.render(hbs`
    {{#power-select options=numbers search=searchFn onchange=(action (mut foo)) as |number select|}}
      {{number}}:{{select.lastSearchedText}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch("teen");
  setTimeout(function() {
    assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'thirteen:teen', 'The results and the lastSearchedText have updated');
    typeInSearch("four");
    assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Loading options...', 'There is a search going on');
    assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'thirteen:teen', 'The results and the lastSearchedText are still the same because the search has not finished yet');
    done();
  }, 150);
});

test('The lastSearchedText of the yielded publicAPI in multiple selects is updated only when the async search for it finishes', function(assert) {
  let done = assert.async();
  assert.expect(3);
  this.numbers = numbers;
  this.searchFn = function(term) {
    return new RSVP.Promise(function(resolve) {
      setTimeout(function() {
        resolve(numbers.filter(str => str.indexOf(term) > -1));
      }, 100);
    });
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers search=searchFn onchange=(action (mut foo)) as |number select|}}
      {{number}}:{{select.lastSearchedText}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  typeInSearch("teen");
  setTimeout(function() {
    assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'thirteen:teen', 'The results and the searchTerm have updated');
    typeInSearch("four");
    assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Loading options...', 'There is a search going on');
    assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'thirteen:teen', 'The results and the searchTerm are still the same because the search has not finished yet');
    done();
  }, 150);
});

test('BUGFIX: Destroy a component why an async search is pending does not cause an error', function(assert) {
  let done = assert.async();
  assert.expect(0); // This test has no assertions. The fact that nothing fails is the proof that it works
  this.numbers = numbers;
  this.visible = true;

  this.searchFn = function(term) {
    return new RSVP.Promise(function(resolve) {
      setTimeout(function() {
        resolve(numbers.filter(str => str.indexOf(term) > -1));
      }, 200);
    });
  };

  this.render(hbs`
    {{#if visible}}
      {{#power-select-multiple options=numbers search=searchFn onchange=(action (mut foo)) as |number searchTerm|}}
        {{number}}:{{searchTerm}}
      {{/power-select-multiple}}
    {{/if}}
  `);

  clickTrigger();
  typeInSearch("teen");
  this.set('visible', false);
  setTimeout(() => {
    done();
  }, 150);
});

test('BUGFIX: When the given options are a promise and a search function is provided, clearing the search must display the results of the original promise', function(assert) {
  assert.expect(3);
  this.numbersPromise = RSVP.Promise.resolve(numbers);

  this.searchFn = function(term) {
    return numbers.filter(str => str.indexOf(term) > -1);
  };

  this.render(hbs`
   {{#power-select options=numbersPromise search=searchFn selected=foo onchange=(action (mut foo)) as |number|}}
     {{number}}
   {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option').length, 20, 'There is 20 options');
  typeInSearch("teen");
  assert.equal($('.ember-power-select-option').length, 7, 'There is 7 options');
  typeInSearch("");
  assert.equal($('.ember-power-select-option').length, 20, 'There is 20 options again§');
});

test('BUGFIX: If the user provides a custom matcher, that matcher receives the entire option even if the user also provided a searchField', function(assert) {
  assert.expect(7);
  this.countries = countries;
  this.matcherFn = function(option) {
    assert.equal(typeof option, 'object', 'The first argument received by the custom matches is the option itself');
  };
  this.render(hbs`
    {{#power-select-multiple options=countries matcher=matcherFn searchField="name" onchange=(action (mut foo)) as |number searchTerm|}}
      {{country.name}}
    {{/power-select-multiple}}
  `);

  typeInSearch('po');
});