import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const numbers = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty'
];

const names = [
  "María",
  "Søren Larsen",
  "João",
  "Miguel",
  "Marta",
  "Lisa"
];

const countries = [
  { name: 'United States',  code: 'US', population: 321853000 },
  { name: 'Spain',          code: 'ES', population: 46439864 },
  { name: 'Portugal',       code: 'PT', population: 10374822 },
  { name: 'Russia',         code: 'RU', population: 146588880 },
  { name: 'Latvia',         code: 'LV', population: 1978300 },
  { name: 'Brazil',         code: 'BR', population: 204921000 },
  { name: 'United Kingdom', code: 'GB', population: 64596752 },
];

function typeInSearch(text) {
  $('.ember-power-select-search input').val(text);
  $('.ember-power-select-search input').trigger('input');
}

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (General behavior)', {
  integration: true
});

test('Clicking in the trigger of a closed select opens the dropdown', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
});

test('Clicking in the trigger of an opened select closes the dropdown', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');
});

test('Search functionality is enabled by default', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-search').length, 1, 'The search box is rendered');
});

test('The search functionality can be disabled by passing `searchEnabled=false`', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) searchEnabled=false as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
  assert.equal($('.ember-power-select-search').length, 0, 'The search box NOT rendered');
});

test('The search box gain focus automatically when opened', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.ok($('.ember-power-select-search input').is(':focus'), 'The search box is focused after opening select');
});

test('Each option of the select is the result of yielding an item', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').length, numbers.length, 'There is as many options in the markup as in the supplied array');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'one');
  assert.equal($('.ember-power-select-option:eq(9)').text().trim(), 'ten');
  assert.equal($('.ember-power-select-option:eq(13)').text().trim(), 'fourteen');
});

/**
2 - Passing an empty array
  a) A "No options" message appears by default.
  b) That message can be customized passing an option.
  c) That message can be customized passing an inverse block to the component.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Empty options)', {
  integration: true
});

test('The dropdowns shows the default "no options" message', function(assert) {
  throw new Error('not implemented');
});

test('The default "no options" message can be customized passing `noMatchesMessage="other message"`', function(assert) {
  throw new Error('not implemented');
});

test('The content of the dropdown when there is no options can be completely customized using the inverse block', function(assert) {
  throw new Error('not implemented');
});

/**
3 - Passing an array of strings
  b) [DONE] When NO selected option is provided the first element of the list is highlighted.
  c) [DONE] When a select option is provided that option appears in the component's trigger.
  d) [DONE] When a select option is provided that option is highlighed when opened.
  e) [DONE] When a select option is provided that element of the list is also marked with the `.selected` class.
  f) [DONE] The default search matches filters correctly ignoring diacritics (accents/capitals/ect...)
  g) [DONE] You can pass a custom matcher for customize the search.
  h) You can pass a `search` function that can return an array of results.
  i) You can pass a `search` function that can return an promise that resolves to an array of results.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Options are strings)', {
  integration: true
});

test('When no `selected` is provided, the first item in the dropdown is highlighted', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
  assert.equal($('.ember-power-select-option.highlighted').length, 1, 'One element is highlighted');
  assert.ok($('.ember-power-select-option:eq(0)').hasClass('highlighted'), 'The first one to be precise');
});

test('When `selected` option is provided, it appears in the trigger yielded with the same block as the options', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select selected="three" options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal(this.$().text().trim(), 'three', 'The selected option show in the trigger');

  this.render(hbs`
    {{#ember-power-select selected="three" options=(readonly numbers) as |option|}}
      Selected: {{option}}
    {{/ember-power-select}}
  `);
  assert.equal(this.$().text().trim(), 'Selected: three', 'The selected option uses the same yielded block as the options');
});

test('When `selected` option is provided, it is highlighted when the dropdown opens', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select selected="three" options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  const $highlightedOption = $('.ember-power-select-option.highlighted');
  assert.equal($highlightedOption.length, 1, 'One element is highlighted');
  assert.equal($highlightedOption.text().trim(), 'three', 'The third option is highlighted');
});

test('When `selected` option is provided, that option is marked as `.selected`', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select selected="three" options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  const $selectedOption = $('.ember-power-select-option:contains("three")');
  assert.ok($selectedOption.hasClass('selected'), 'The third option is marked as selected');
});

test('The default search strategy matches disregarding diacritics differences and capitalization', function(assert) {
  assert.expect(8);

  this.names = names;
  this.render(hbs`
    {{#ember-power-select options=(readonly names) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch('mar'));
  assert.equal($('.ember-power-select-option').length, 2, 'Only 2 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'María');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'Marta');
  Ember.run(() => typeInSearch('mari'));
  assert.equal($('.ember-power-select-option').length, 1, 'Only 1 results match the search');
  assert.equal($('.ember-power-select-option').text().trim(), 'María');
  Ember.run(() => typeInSearch('o'));
  assert.equal($('.ember-power-select-option').length, 2, 'Only 2 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Søren Larsen');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'João');
});

test('You can pass a custom marcher with `matcher=myFn` to customize the search strategi', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.endsWithMatcher = function(value, text) {
    return text === '' || value.slice(text.length * -1) === text;
  };

  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) matcher=endsWithMatcher as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch('on'));
  assert.equal($('.ember-power-select-option').text().trim(), "No results found", 'No number ends in "on"');
  Ember.run(() => typeInSearch('teen'));
  assert.equal($('.ember-power-select-option').length, 7, 'There is 7 number that end in "teen"');
});

/**
4 - Passing an array of objects
  b) [DONE] When NO selected option is provided the first element of the list is highlighted.
  c) When a select option is provided that option appears in the component's trigger.
  d) When a select option is provided that option is highlighed when opened.
  e) When a select option is provided that element of the list is also marked with the `.selected` class.
  f) The block provided to the component customizes both the list's items and the trigger.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Options are objects)', {
  integration: true
});

test('When no `selected` is provided, the first item in the dropdown is highlighted', function(assert) {
  assert.expect(3);

  this.countries = countries;
  this.render(hbs`
    {{#ember-power-select options=(readonly countries) as |option|}}
      {{option.code}}: {{option.name}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
  assert.equal($('.ember-power-select-option.highlighted').length, 1, 'One element is highlighted');
  assert.ok($('.ember-power-select-option:eq(0)').hasClass('highlighted'), 'The first one to be precise');
});