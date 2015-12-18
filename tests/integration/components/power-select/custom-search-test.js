import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { typeInSearch, clickTrigger } from '../../../helpers/ember-power-select';
import { numbers } from '../constants';

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
  assert.equal($('.ember-power-select-option').text(), 'Type to search', 'The dropdown shows the "type to seach" message');
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
  assert.equal($('.ember-power-select-option').text(), 'Type the name of the thing');
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
  let done = assert.async();
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

  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, 7);
    done();
  }, 150);
});

test('While the async search is being performed the "Type to search" dissapears the "Loading..." message appears', function(assert) {
  let done = assert.async();
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
  setTimeout(done, 150);
});

test('When the search resolves to an empty array then the "No results found" message or block appears.', function(assert) {
  var done = assert.async();
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
  setTimeout(() => {
    assert.ok(/No results found/.test($('.ember-power-select-option').text()), 'The default "No results" message renders');
    done();
  }, 20);
});

test('When the search resolves to an empty array then the custom "No results" message appears', function(assert) {
  var done = assert.async();
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
  setTimeout(() => {
    assert.ok(/Meec\. Try again/.test($('.ember-power-select-option').text()), 'The customized "No results" message renders');
    done();
  }, 20);
});

test('When the search resolves to an empty array then the custom alternate block renders', function(assert) {
  var done = assert.async();
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
  setTimeout(() => {
    assert.equal($('.ember-power-select-dropdown .foo-bar').length, 1, 'The alternate block message gets rendered');
    done();
  }, 20);
});

test('When one search is fired before the previous one resolved, the "Loading" continues until the 2nd is resolved', function(assert) {
  var done = assert.async();
  assert.expect(2);

  this.searchFn = function() {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() { resolve(numbers); }, 100);
    });
  };

  this.render(hbs`
    {{#power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select}}
  `);
  clickTrigger();
  typeInSearch("tee");

  setTimeout(function() {
    typeInSearch("teen");
  }, 50);

  setTimeout(function() {
    assert.ok(/Loading options/.test($('.ember-power-select-option').text()), 'The loading message is visible');
    assert.equal($('.ember-power-select-option').length, 1, 'No results are shown');
  }, 120);

  setTimeout(done, 180);
});

test('On an empty select, when the search resolves, the first element is highlighted like with regular filtering', function(assert) {
  var done = assert.async();
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

  setTimeout(function() {
    assert.ok($('.ember-power-select-option:eq(0)').hasClass('ember-power-select-option--highlighted'), 'The first result is highlighted');
    done();
  }, 110);
});

test('On an select with a selected value, if after a search this value is not among the options the first element is highlighted', function(assert) {
  var done = assert.async();
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
  assert.ok($('.ember-power-select-option:eq(2)').hasClass('ember-power-select-option--highlighted'), 'The 3rd result is highlighted');
  typeInSearch("teen");

  setTimeout(function() {
    assert.ok($('.ember-power-select-option:eq(0)').hasClass('ember-power-select-option--highlighted'), 'The first result is highlighted');
    done();
  }, 110);
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
  assert.equal($('.ember-power-select-search input').val(), 'teen');
  Ember.run(() => {
    let event = new window.Event('mousedown');
    this.$('#different-node')[0].dispatchEvent(event);
  });
  clickTrigger();
  assert.equal($('.ember-power-select-option').length, 1, 'Results have been cleared');
  assert.equal($('.ember-power-select-option').text().trim(), 'Type to search');
  assert.equal($('.ember-power-select-search input').val(), '', 'The searchbox was cleared');
});

test('When received both options and search, those options are shown when the dropdown opens before the first search is performed', function(assert) {
  var done = assert.async();
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
  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, 7, 'All the options are shown but no the loading message');
    done();
  }, 100);
});

test('Don\'t return from the search action and update the options instead also works as an strategy', function(assert) {
  let done = assert.async();
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

  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, 7);
    done();
  }, 100);
});

