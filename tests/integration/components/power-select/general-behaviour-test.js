import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { typeInSearch, triggerKeydown, clickTrigger, nativeMouseUp } from '../../../helpers/ember-power-select';
import {
  numbers,
  names,
  countries,
} from '../constants';

const { RSVP } = Ember;

moduleForComponent('power-select', 'Integration | Component | Ember Power Select (General behavior)', {
  integration: true
});

test('Click in the trigger of a closed select opens the dropdown', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
});

test('Click in the trigger of an opened select closes the dropdown', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');
});

test('Search functionality is enabled by default', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers  onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-search').length, 1, 'The search box is rendered');
});

test('The search functionality can be disabled by passing `searchEnabled=false`', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers searchEnabled=false onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
  assert.equal($('.ember-power-select-search').length, 0, 'The search box NOT rendered');
});

test('The search box gain focus automatically when opened', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.ok($('.ember-power-select-search input').get(0) === document.activeElement, 'The search box is focused after opening select');
});

test('Each option of the select is the result of yielding an item', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option').length, numbers.length, 'There is as many options in the markup as in the supplied array');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'one');
  assert.equal($('.ember-power-select-option:eq(9)').text().trim(), 'ten');
  assert.equal($('.ember-power-select-option:eq(13)').text().trim(), 'fourteen');
});

test('If the passed options is a promise and it\'s not resolved the component shows a Loading message', function(assert) {
  let done = assert.async();
  assert.expect(3);

  this.numbersPromise = new RSVP.Promise(function(resolve) {
    Ember.run.later(function() { console.debug('resolved!'); resolve(numbers); }, 100);
  });

  this.render(hbs`
    {{#power-select options=numbersPromise onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option').text().trim(), 'Loading options...', 'The loading message appears while the promise is pending');
  setTimeout(function() {
    assert.ok(!/Loading options/.test($('.ember-power-select-option').text()), 'The loading message is gone');
    assert.equal($('.ember-power-select-option').length, 20, 'The results appear when the promise is resolved');
    done();
  }, 150);
});

test('If the passed options is a promise and it\'s not resolved but the `loadingMessage` attribute is false, no loading message is shown', function(assert) {
  let done = assert.async();
  assert.expect(2);

  this.numbersPromise = new RSVP.Promise(function(resolve) {
    Ember.run.later(function() { console.debug('resolved!'); resolve(numbers); }, 100);
  });

  this.render(hbs`
    {{#power-select options=numbersPromise onchange=(action (mut foo)) loadingMessage=false as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();

  assert.equal($('.ember-power-select-option').length, 0, 'No loading options message is displayed');
  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, 20, 'The results appear when the promise is resolved');
    done();
  }, 120);
});

test('If a placeholder is provided, it shows while no element is selected', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo placeholder="abracadabra" onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal($('.ember-power-select-trigger .ember-power-select-placeholder').text().trim(), 'abracadabra', 'The placeholder is rendered when there is no element');
  clickTrigger();
  nativeMouseUp('.ember-power-select-option:eq(3)');
  assert.equal($('.ember-power-select-trigger .ember-power-select-placeholder').length, 0, 'The placeholder is gone');
  assert.equal($('.ember-power-select-trigger').text().trim(), 'four', 'The selected item replaced it');
});

test('If the `selected` value changes the select gets updated, but the `onchange` action doesn\'t fire', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.selected = null;
  this.foo = function() {
    assert.ok(false, 'The onchange action is never fired');
  };

  this.render(hbs`
    {{#power-select options=numbers onchange=(action foo) selected=selected as |option|}}
      {{option}}
    {{/power-select}}
  `);

  Ember.run(() => this.set('selected', 'three'));
  assert.equal($('.ember-power-select-trigger').text().trim(), 'three', 'The `three` element is selected');
  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'three', 'The proper option gets highlighed');
  assert.equal($('.ember-power-select-option[aria-selected="true"]').text().trim(), 'three', 'The proper option gets selected');
});

test('If the user selects a value and later on the selected value changes from the outside, the components updates too', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.selected = null;
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal($('.ember-power-select-trigger').text().trim(), '', 'Nothing is selected');
  clickTrigger();
  nativeMouseUp('.ember-power-select-option:eq(3)');
  assert.equal($('.ember-power-select-trigger').text().trim(), 'four', '"four" has been selected');
  Ember.run(() => this.set('selected', 'three'));
  assert.equal($('.ember-power-select-trigger').text().trim(), 'three', '"three" has been selected because a change came from the outside');
});

test('If the user passes `renderInPlace=true` the dropdown is added below the trigger instead of in the root', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers renderInPlace=true onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal(this.$('.ember-power-select-dropdown').length, 1, 'The dropdown is inside the component');
});

test('If the user passes `closeOnSelect=false` the dropdown remains visible after selecting an option with the mouse', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo closeOnSelect=false onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');
  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
  nativeMouseUp('.ember-power-select-option:eq(3)');
  assert.equal($('.ember-power-select-trigger').text().trim(), 'four', '"four" has been selected');
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
});

test('If the user passes `closeOnSelect=false` the dropdown remains visible after selecting an option with the with the keyboard', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo closeOnSelect=false onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');
  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
  nativeMouseUp('.ember-power-select-option:eq(3)');
  triggerKeydown($('.ember-power-select-search input')[0], 13);
  assert.equal($('.ember-power-select-trigger').text().trim(), 'four', '"four" has been selected');
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
});

test('If the content of the options is refreshed (starting with empty array proxy) the available options should also refresh', function(assert) {
  let done = assert.async();
  assert.expect(2);

  let data = [];
  this.proxy = Ember.A(data);
  this.search = () => {
    return new RSVP.Promise(function(resolve) {
      resolve(data);
      Ember.run.later(function() {
        data.pushObject('one');
      }, 100);
    });
  };

  this.render(hbs`{{#power-select options=proxy search=(action search) onchange=(action (mut foo)) as |option|}} {{option}} {{/power-select}}`);

  clickTrigger();
  typeInSearch("o");

  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, 1, 'The dropdown is opened and results shown after proxy is updated');
    assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'one');
    done();
  }, 150);
});

test('If the content of the options is updated (starting with populated array proxy) the available options should also refresh', function(assert) {
  let done = assert.async();
  assert.expect(5);

  let data = ['one'];
  this.proxy = Ember.A(data);
  this.search = () => {
    return new RSVP.Promise(function(resolve) {
      resolve(data);
      Ember.run.later(function() {
        data.pushObject('owner');
      }, 100);
    });
  };

  this.render(hbs`{{#power-select options=proxy search=(action search) onchange=(action (mut foo)) as |option|}} {{option}} {{/power-select}}`);

  clickTrigger();

  assert.equal($('.ember-power-select-option').length, 1, 'The dropdown is opened and results shown with initial proxy contents');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'one');

  typeInSearch("o");

  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, 2, 'The dropdown is opened and results shown after proxy is updated');
    assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'one');
    assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'owner');
    done();
  }, 150);
});

test('If the content of the selected is refreshed while opened the first element of the list gets highlighted', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo closeOnSelect=false onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  clickTrigger();
  triggerKeydown($('.ember-power-select-search input')[0], 40);
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'two', 'The second options is highlighted');
  Ember.run(() => this.set('numbers', ['foo', 'bar', 'baz']));
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'foo', 'The first element is highlighted');
});

test('If the user passes `dropdownClass` the dropdown content should have that class', function(assert) {
  assert.expect(1);

  this.options = [];
  this.render(hbs`
    {{#power-select options=options selected=foo onchange=(action (mut foo)) dropdownClass="this-is-a-test-class" as |option|}}
      {{option}}
    {{/power-select}}
  `);
  clickTrigger();
  assert.ok($('.ember-power-select-dropdown').hasClass('this-is-a-test-class'), 'dropdownClass can be customized');
});

test('If the user passes `class` the dropdown gets that class', function(assert) {
  assert.expect(1);
  this.options = [];
  this.render(hbs`
    {{#power-select options=options selected=foo onchange=(action (mut foo)) class="my-foo" as |option|}}
      {{option}}
    {{/power-select}}
  `);
  assert.ok($('.ember-power-select').hasClass('my-foo'), 'the entire select inherits that class');
});

test('The filtering is reverted after closing the select', function(assert) {
  assert.expect(2);
  this.numbers = numbers;
  this.render(hbs`
    <div id="outside-div"></div>
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('th');
  assert.equal($('.ember-power-select-option').length, 2, 'the dropdown has filtered the results');
  Ember.run(() => {
    let event = new window.Event('mousedown');
    this.$('#outside-div')[0].dispatchEvent(event);
  });
  clickTrigger();
  assert.equal($('.ember-power-select-option').length, numbers.length, 'the dropdown has shows all results');
});

test('It has the appropriate class when it receives a specific dropdown position', function(assert) {
  assert.expect(1);
  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) verticalPosition="above" as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.ok(this.$('.ember-power-select').hasClass('ember-basic-dropdown--above'), 'It has the class of dropdowns positioned above');
});

test('The search term is yielded as second argument in single selects', function(assert) {
  assert.expect(2);
  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option term|}}
      {{term}}:{{option}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('tw');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'tw:two', 'Each option receives the search term');
  nativeMouseUp('.ember-power-select-option:eq(0)');
  clickTrigger();
  typeInSearch('thr');
  assert.equal($('.ember-power-select-trigger').text().trim(), 'thr:two', 'The trigger also receives the search term');
});

test('If there is no search action and the options is empty the select shows the default "no options" message', function(assert) {
  this.options = [];
  this.render(hbs`
    {{#power-select options=options onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  clickTrigger();
  assert.equal($('.ember-power-select-option').length, 1);
  assert.equal($('.ember-power-select-option').text().trim(), 'No results found');
  assert.ok($('.ember-power-select-option').hasClass('ember-power-select-option--no-matches-message'), 'The row has a special class to differentiate it from regular options');
});

test('If there is a search action and the options is empty it shows the `searchMessage`, and if after searching there is no results, it shows the `noResults` message', function(assert) {
  this.options = [];
  this.search = () => [];
  this.render(hbs`
    {{#power-select search=search options=options onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  clickTrigger();
  assert.equal($('.ember-power-select-option').length, 1);
  assert.equal($('.ember-power-select-option').text().trim(), 'Type to search');
  typeInSearch('foo');
  assert.equal($('.ember-power-select-option').length, 1);
  assert.equal($('.ember-power-select-option').text().trim(), 'No results found');
});

test('The default "no options" message can be customized passing `noMatchesMessage="other message"`', function(assert) {
  this.options = [];
  this.render(hbs`
    {{#power-select options=options noMatchesMessage="Nope" onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  clickTrigger();
  assert.equal($('.ember-power-select-option').length, 1);
  assert.equal($('.ember-power-select-option').text().trim(), 'Nope');
});

test('If there is a search action, the options are empty and the `seachMessage` in intentionally empty, it doesn\'t show anything, and if you seach and there is no results it shows the `noResultsMessage`', function(assert) {
  this.options = [];
  this.search = () => [];
  this.render(hbs`
    {{#power-select search=search searchMessage=false options=options onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  clickTrigger();
  assert.equal($('.ember-power-select-option').length, 0);
  typeInSearch('foo');
  assert.equal($('.ember-power-select-option').length, 1);
  assert.equal($('.ember-power-select-option').text().trim(), 'No results found');
});

test('The content of the dropdown when there are no options can be completely customized using the inverse block', function(assert) {
  this.options = [];
  this.render(hbs`
    {{#power-select options=options noMatchesMessage="Nope" onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{else}}
      <span class="empty-option-foo">Foo bar</span>
    {{/power-select}}
  `);
  clickTrigger();
  assert.equal($('.ember-power-select-option').length, 0, 'No list elements, just the given alternate block');
  assert.equal($('.empty-option-foo').length, 1);
});

test('When no `selected` is provided, the first item in the dropdown is highlighted', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
  assert.equal($('.ember-power-select-option[aria-current="true"]').length, 1, 'One element is highlighted');
  assert.equal($('.ember-power-select-option:eq(0)').attr('aria-current'), 'true', 'The first one to be precise');
});

test('When `selected` option is provided, it appears in the trigger yielded with the same block as the options', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select selected="three" options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal(this.$().text().trim(), 'three', 'The selected option show in the trigger');

  this.render(hbs`
    {{#power-select selected="three" options=numbers onchange=(action (mut foo)) as |option|}}
      Selected: {{option}}
    {{/power-select}}
  `);
  assert.equal(this.$().text().trim(), 'Selected: three', 'The selected option uses the same yielded block as the options');
});

test('When `selected` option is provided, it is highlighted when the dropdown opens', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select selected="three" options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  const $highlightedOption = $('.ember-power-select-option[aria-current="true"]');
  assert.equal($highlightedOption.length, 1, 'One element is highlighted');
  assert.equal($highlightedOption.text().trim(), 'three', 'The third option is highlighted');
});

test('When `selected` option is provided, that option is marked as `.selected`', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select selected="three" options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  const $selectedOption = $('.ember-power-select-option:contains("three")');
  assert.equal($selectedOption.attr('aria-selected'), 'true', 'The third option is marked as selected');
});

test('The default search strategy matches disregarding diacritics differences and capitalization', function(assert) {
  assert.expect(8);

  this.names = names;
  this.render(hbs`
    {{#power-select options=names onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('mar');
  assert.equal($('.ember-power-select-option').length, 2, 'Only 2 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'María');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'Marta');
  typeInSearch('mari');
  assert.equal($('.ember-power-select-option').length, 1, 'Only 1 results match the search');
  assert.equal($('.ember-power-select-option').text().trim(), 'María');
  typeInSearch('o');
  assert.equal($('.ember-power-select-option').length, 2, 'Only 2 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Søren Larsen');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'João');
});

test('You can pass a custom marcher with `matcher=myFn` to customize the search strategy', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.endsWithMatcher = function(option, text) {
    return option.slice(text.length * -1) === text ? 0 : -1;
  };

  this.render(hbs`
    {{#power-select options=numbers matcher=endsWithMatcher onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('on');
  assert.equal($('.ember-power-select-option').text().trim(), "No results found", 'No number ends in "on"');
  typeInSearch('teen');
  assert.equal($('.ember-power-select-option').length, 7, 'There is 7 number that end in "teen"');
});

test('When no `selected` is provided, the first item in the dropdown is highlighted', function(assert) {
  assert.expect(3);

  this.countries = countries;
  this.render(hbs`
    {{#power-select options=countries onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
  assert.equal($('.ember-power-select-option[aria-current="true"]').length, 1, 'One element is highlighted');
  assert.equal($('.ember-power-select-option:eq(0)').attr('aria-current'), 'true', 'The first one to be precise');
});

test('When a option is provided that options is rendered in the trigger using the same block as the options', function(assert) {
  assert.expect(1);

  this.countries = countries;
  this.country = countries[1]; // Spain
  this.render(hbs`
    {{#power-select options=countries selected=country onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/power-select}}
  `);

  assert.equal($('.ember-power-select-trigger').text().trim(), 'ES: Spain', 'The selected country is rendered in the trigger');
});

test('When `selected` option is provided, it is highlighted when the dropdown opens', function(assert) {
  assert.expect(2);

  this.countries = countries;
  this.country = countries[1]; // Spain
  this.render(hbs`
    {{#power-select options=countries selected=country onchange=(action (mut country)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/power-select}}
  `);

  clickTrigger();
  const $highlightedOption = $('.ember-power-select-option[aria-current="true"]');
  assert.equal($highlightedOption.length, 1, 'One element is highlighted');
  assert.equal($highlightedOption.text().trim(), 'ES: Spain', 'The second option is highlighted');
});

test('When `selected` option is provided, that option is marked as `.selected`', function(assert) {
  assert.expect(1);

  this.countries = countries;
  this.country = countries[1]; // Spain
  this.render(hbs`
    {{#power-select options=countries selected=country onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/power-select}}
  `);

  clickTrigger();
  const $selectedOption = $('.ember-power-select-option:contains("ES: Spain")');
  assert.equal($selectedOption.attr('aria-selected'), 'true', 'The second option is marked as selected');
});

test('The default search strategy matches disregarding diacritics differences and capitalization', function(assert) {
  assert.expect(8);

  this.people = [
    { name: 'María',  surname: 'Murray' },
    { name: 'Søren',  surname: 'Williams' },
    { name: 'João',   surname: 'Jin' },
    { name: 'Miguel', surname: 'Camba' },
    { name: 'Marta',  surname: 'Stinson' },
    { name: 'Lisa',   surname: 'Simpson' },
  ];

  this.render(hbs`
    {{#power-select options=people searchField="name" onchange=(action (mut foo)) as |person|}}
      {{person.name}} {{person.surname}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('mar');
  assert.equal($('.ember-power-select-option').length, 2, 'Only 2 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'María Murray');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'Marta Stinson');
  typeInSearch('mari');
  assert.equal($('.ember-power-select-option').length, 1, 'Only 1 results match the search');
  assert.equal($('.ember-power-select-option').text().trim(), 'María Murray');
  typeInSearch('o');
  assert.equal($('.ember-power-select-option').length, 2, 'Only 2 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Søren Williams');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'João Jin');
});

test('You can pass a custom marcher with `matcher=myFn` to customize the search strategy', function(assert) {
  assert.expect(4);

  this.people = [
    { name: 'María',  surname: 'Murray' },
    { name: 'Søren',  surname: 'Williams' },
    { name: 'João',   surname: 'Jin' },
    { name: 'Miguel', surname: 'Camba' },
    { name: 'Marta',  surname: 'Stinson' },
    { name: 'Lisa',   surname: 'Simpson' },
  ];

  this.nameOrSurnameNoDiacriticsCaseSensitive = function(person, term) {
    return (person.name + ' ' + person.surname).indexOf(term);
  };

  this.render(hbs`
    {{#power-select options=people matcher=nameOrSurnameNoDiacriticsCaseSensitive onchange=(action (mut foo)) as |person|}}
      {{person.name}} {{person.surname}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('s');
  assert.equal($('.ember-power-select-option').length, 3, 'Only 3 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Søren Williams');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'Marta Stinson');
  assert.equal($('.ember-power-select-option:eq(2)').text().trim(), 'Lisa Simpson');
});

test('BUGFIX: The highlighted element is reset when single selects are closed', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.foo = 'three';
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'three', 'The third element is highlighted');
  triggerKeydown($('.ember-power-select-search input')[0], 40);
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'four', 'The forth element is highlighted');
  clickTrigger();
  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'three', 'The third element is highlighted again');
});

test('BUGFIX: The highlighted element is reset when multiple selects are closed', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'one', 'The first element is highlighted');
  triggerKeydown($('.ember-power-select-trigger-multiple-input')[0], 40);
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'two', 'The second element is highlighted');
  clickTrigger();
  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'one', 'The first element is highlighted again');
});

test('The trigger of the select has a id derived from the element id of the component', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  assert.ok(/^ember-power-select-trigger-ember\d+$/.test(this.$('.ember-power-select-trigger').attr('id'), 'The trigger has the proper id'));
});

test('If the passed options is a promise that is resolved, searching should filter the results from a promise', function(assert) {
  let done = assert.async();
  assert.expect(5);

  this.numbersPromise = new RSVP.Promise(function(resolve) {
    Ember.run.later(function() {resolve(numbers); }, 100);
  });

  this.render(hbs`
    {{#power-select options=numbersPromise onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  setTimeout(function() {
    clickTrigger();
    typeInSearch("o");

    assert.equal($('.ember-power-select-option').length, 4, 'The dropdown is opened and results shown.');
    assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'one');
    assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'two');
    assert.equal($('.ember-power-select-option:eq(2)').text().trim(), 'four');
    assert.equal($('.ember-power-select-option:eq(3)').text().trim(), 'fourteen');
    done();
  }, 150);
});

test('Disabled single selects don\'t have a clear button even if `allowClear` is true', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.foo = numbers[2];
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) allowClear=true disabled=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal(this.$('.ember-power-select-clear-btn').length, 0, 'There is no clear button');
});

test('If the passed selected element is a pending promise, the first element is highlighted and the trigger is empty', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.selected = new RSVP.Promise(function(resolve) {
    Ember.run.later(resolve, numbers[3], 50);
  });

  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'one', 'The first element is highlighted');
  assert.equal($('.ember-power-select-option[aria-selected="true"]').length, 0, 'no element is selected');
  assert.equal(this.$('.ember-power-select-trigger').text().trim(), '', 'Nothing is selected yet');
});

test('If the passed selected element is a resolved promise, that element is selected and the trigger contains the proper text', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.selected = RSVP.resolve(numbers[3]);

  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'four', 'The 4th element is highlighted');
  assert.equal($('.ember-power-select-option[aria-selected="true"]').text().trim(), 'four', 'The 4th element is highlighted');
  assert.equal(this.$('.ember-power-select-trigger').text().trim(), 'four', 'The trigger has the proper content');
});

test('If the passed selected element is a pending promise that resolves while the select is opened, the highlighted & selected elements get updated, along with the trigger', function(assert) {
  let done = assert.async();
  assert.expect(6);

  this.numbers = numbers;
  this.selected = new RSVP.Promise(function(resolve) {
    Ember.run.later(resolve, numbers[3], 50);
  });

  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'one', 'The first element is highlighted');
  assert.equal($('.ember-power-select-option[aria-selected="true"]').length, 0, 'no element is selected');
  assert.equal(this.$('.ember-power-select-trigger').text().trim(), '', 'Nothing is selected yet');

  setTimeout(function() {
    assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'four', 'The 4th element is highlighted');
    assert.equal($('.ember-power-select-option[aria-selected="true"]').text().trim(), 'four', 'The 4th element is highlighted');
    assert.equal(this.$('.ember-power-select-trigger').text().trim(), 'four', 'The trigger has the proper content');
    done();
  }, 100);
});

test('When a promise resolves it doesn\'t overwrite a previous value if it isn\'t the same promise it resolved from', function(assert) {
  let done = assert.async();
  assert.expect(6);

  let promise1 = new RSVP.Promise(function(resolve) {
    Ember.run.later(resolve, numbers[3], 80);
  });

  let promise2 = new RSVP.Promise(function(resolve) {
    Ember.run.later(resolve, numbers[4], 20);
  });

  this.numbers = numbers;
  this.selected = promise1;

  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  this.set('selected', promise2);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'one', 'The first element is highlighted');
  assert.equal($('.ember-power-select-option[aria-selected="true"]').length, 0, 'no element is selected');
  assert.equal(this.$('.ember-power-select-trigger').text().trim(), '', 'Nothing is selected yet');

  setTimeout(function() {
    assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'five', 'The 5th element is highlighted');
    assert.equal($('.ember-power-select-option[aria-selected="true"]').text().trim(), 'five', 'The 5th element is highlighted');
    assert.equal(this.$('.ember-power-select-trigger').text().trim(), 'five', 'The trigger has the proper content');
    done();
  }, 100);
});

test('When both `selected` and `options` are async, and `selected` resolves before `options`, the proper options are selected/highlighted after each resolution', function(assert) {
  let done = assert.async();
  assert.expect(6);

  this.asyncOptions = new Ember.RSVP.Promise((resolve) => {
    setTimeout(() => resolve(numbers), 200);
  });
  this.asyncSelected = new Ember.RSVP.Promise((resolve) => {
    setTimeout(() => resolve('four'), 10);
  });

  this.render(hbs`
    {{#power-select options=asyncOptions selected=asyncSelected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();

  assert.equal($('.ember-power-select-option[aria-selected="true"]').length, 0, 'no element is selected');
  assert.equal(this.$('.ember-power-select-trigger').text().trim(), '', 'Nothing is selected yet');

  setTimeout(function() {
    assert.equal(this.$('.ember-power-select-trigger').text().trim(), 'four', 'The trigger has the proper content');
  }, 20);

  setTimeout(function() {
    assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'four', 'The 4th element is highlighted');
    assert.equal($('.ember-power-select-option[aria-selected="true"]').text().trim(), 'four', 'The 4th element is selected');
    assert.equal(this.$('.ember-power-select-trigger').text().trim(), 'four', 'The trigger has the proper content');
    done();
  }, 220);
});

test('When both `selected` and `options` are async, and `options` resolves before `selected`, the proper options are selected/highlighted after each resolution', function(assert) {
  let done = assert.async();
  assert.expect(7);

  this.asyncOptions = new Ember.RSVP.Promise((resolve) => {
    setTimeout(() => resolve(numbers), 10);
  });
  this.asyncSelected = new Ember.RSVP.Promise((resolve) => {
    setTimeout(() => resolve('four'), 200);
  });

  this.render(hbs`
    {{#power-select options=asyncOptions selected=asyncSelected onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();

  assert.equal($('.ember-power-select-option[aria-selected="true"]').length, 0, 'no element is selected');
  assert.equal(this.$('.ember-power-select-trigger').text().trim(), '', 'Nothing is selected yet');

  setTimeout(function() {
    assert.equal(this.$('.ember-power-select-trigger').text().trim(), '', 'The trigger is still empty');
    assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'one', 'The 1st element is highlighted');
  }, 20);

  setTimeout(function() {
    assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'four', 'The 4th element is highlighted');
    assert.equal($('.ember-power-select-option[aria-selected="true"]').text().trim(), 'four', 'The 4th element is selected');
    assert.equal(this.$('.ember-power-select-trigger').text().trim(), 'four', 'The trigger has the proper content');
    done();
  }, 220);
});

test('When the input inside the select gets focused the entire component gains the `ember-basic-dropdown--focus-inside` class', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.ok(!this.$('.ember-power-select').hasClass('ember-basic-dropdown--focus-inside'), 'The select doesn\'t have the class yet');
  clickTrigger();
  Ember.run(() => $('.ember-power-select-search input').focus());
  assert.ok(this.$('.ember-power-select').hasClass('ember-basic-dropdown--focus-inside'), 'The select has the class now');
});