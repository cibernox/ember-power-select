import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import mirageInitializer from '../../../initializers/ember-cli-mirage';

const { RSVP } = Ember;

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

const contriesWithDisabled = [
  { name: 'United States',  code: 'US', population: 321853000 },
  { name: 'Spain',          code: 'ES', population: 46439864 },
  { name: 'Portugal',       code: 'PT', population: 10374822, disabled: true },
  { name: 'Russia',         code: 'RU', population: 146588880, disabled: true },
  { name: 'Latvia',         code: 'LV', population: 1978300 },
  { name: 'Brazil',         code: 'BR', population: 204921000, disabled: true },
  { name: 'United Kingdom', code: 'GB', population: 64596752 },
];

const groupedNumbers = [
  { groupName: "Smalls", options: ["one", "two", "three"] },
  { groupName: "Mediums", options: ["four", "five", "six"] },
  { groupName: "Bigs", options: [
      { groupName: "Fairly big", options: ["seven", "eight", "nine"] },
      { groupName: "Really big", options: [ "ten", "eleven", "twelve" ] },
      "thirteen"
    ]
  },
  "one hundred",
  "one thousand"
];

function typeInSearch(text) {
  $('.ember-power-select-search input, .ember-power-select-trigger-multiple-input').val(text);
  $('.ember-power-select-search input, .ember-power-select-trigger-multiple-input').trigger('input');
}

/**
1 - General behavior
  a) [DONE] Click in the trigger of a closed select opens the dropdown'
  b) [DONE] Click in the trigger of an opened select closes the dropdown'
  c) [DONE] Search functionality is enabled by default'
  d) [DONE] The search functionality can be disabled by passing `searchEnabled=false`'
  e) [DONE] The search box gain focus automatically when opened'
  f) [DONE] Each option of the select is the result of yielding an item'
  g) [DONE] If the passed options is a promise, while its not resolved the component shows a Loading message'
  h) [DONE] If a placeholder is provided, it shows while no element is selected'
  i) [DONE] If the `selected` value changes the select gets updated, but the `onchange` action doesn't fire.
  j) [DONE] If the user passes `renderInPlace=true` the dropdown is added below the trigger instead of in the root
  k) [DONE] If the user passes `closeOnSelect=false` the dropdown remains visible after selecting an option
  l) If the content of the selected is refreshed while opened the first element of the list gets highlighted
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (General behavior)', {
  integration: true
});

test('Click in the trigger of a closed select opens the dropdown', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
});

test('Click in the trigger of an opened select closes the dropdown', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=(action (mut foo)) as |option|}}
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
    {{#ember-power-select options=numbers  onchange=(action (mut foo)) as |option|}}
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
    {{#ember-power-select options=numbers searchEnabled=false onchange=(action (mut foo)) as |option|}}
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
    {{#ember-power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.ok($('.ember-power-select-search input').get(0) === document.activeElement, 'The search box is focused after opening select');
});

test('Each option of the select is the result of yielding an item', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').length, numbers.length, 'There is as many options in the markup as in the supplied array');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'one');
  assert.equal($('.ember-power-select-option:eq(9)').text().trim(), 'ten');
  assert.equal($('.ember-power-select-option:eq(13)').text().trim(), 'fourteen');
});

test('If the passed options is a promise, while its not resolved the component shows a Loading message', function(assert) {
  let done = assert.async();
  assert.expect(3);

  this.numbersPromise = new RSVP.Promise(function(resolve) {
    Ember.run.later(function() { console.debug('resolved!'); resolve(numbers); }, 100);
  });

  this.render(hbs`
    {{#ember-power-select options=numbersPromise onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());

  assert.equal($('.ember-power-select-option').text().trim(), 'Loading options...', 'The loading message appears while the promise is pending');
  setTimeout(function() {
    assert.ok(!/Loading options/.test($('.ember-power-select-option').text()), 'The loading message is gone');
    assert.equal($('.ember-power-select-option').length, 20, 'The results appear when the promise is resolved');
    done();
  }, 150);
});

test('If a placeholder is provided, it shows while no element is selected', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers selected=foo placeholder="abracadabra" onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-trigger .ember-power-select-placeholder').text().trim(), 'abracadabra', 'The placeholder is rendered when there is no element');
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => $('.ember-power-select-option:eq(3)').click());
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
    {{#ember-power-select options=numbers onchange=(action foo) selected=selected as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.set('selected', 'three'));
  assert.equal($('.ember-power-select-trigger').text().trim(), 'three', 'The `three` element is selected');
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'three', 'The proper option gets highlighed');
  assert.equal($('.ember-power-select-option.selected').text().trim(), 'three', 'The proper option gets selected');
});

test('If the user selects a value and later on the selected value changes from the outside, the components updates too', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.selected = null;
  this.render(hbs`
    {{#ember-power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-trigger').text().trim(), '', 'Nothing is selected');
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => $('.ember-power-select-option:eq(3)').click());
  assert.equal($('.ember-power-select-trigger').text().trim(), 'four', '"four" has been selected');
  Ember.run(() => this.set('selected', 'three'));
  assert.equal($('.ember-power-select-trigger').text().trim(), 'three', '"three" has been selected because a change came from the outside');
});

test('If the user passes `renderInPlace=true` the dropdown is added below the trigger instead of in the root', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers renderInPlace=true onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal(this.$('.ember-power-select-dropdown').length, 1, 'The dropdown is inside the component');
});

test('If the user passes `closeOnSelect=false` the dropdown remains visible after selecting an option', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers selected=foo closeOnSelect=false onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
  Ember.run(() => $('.ember-power-select-option:eq(3)').click());
  assert.equal($('.ember-power-select-trigger').text().trim(), 'four', '"four" has been selected');
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
});

test('If the content of the selected is refreshed while opened the first element of the list gets highlighted', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers selected=foo closeOnSelect=false onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => triggerKeydown($('.ember-power-select-search input')[0], 40));
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'two', 'The second options is highlighted');
  Ember.run(() => this.set('numbers', ['foo', 'bar', 'baz']));
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'foo', 'The first element is highlighted');
});

/**
2 - Passing an empty array
  a) [DONE] A "No options" message appears by default.
  b) [DONE] That message can be customized passing an option.
  c) [DONE] That message can be customized passing an inverse block to the component.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Empty options)', {
  integration: true
});

test('The dropdowns shows the default "no options" message', function(assert) {
  this.options = [];
  this.render(hbs`
    {{#ember-power-select options=options onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').length, 1);
  assert.equal($('.ember-power-select-option').text().trim(), 'No results found');
});

test('The default "no options" message can be customized passing `noMatchesMessage="other message"`', function(assert) {
  this.options = [];
  this.render(hbs`
    {{#ember-power-select options=options noMatchesMessage="Nope" onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').length, 1);
  assert.equal($('.ember-power-select-option').text().trim(), 'Nope');
});

test('The content of the dropdown when there are no options can be completely customized using the inverse block', function(assert) {
  this.options = [];
  this.render(hbs`
    {{#ember-power-select options=options noMatchesMessage="Nope" onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{else}}
      <span class="empty-option-foo">Foo bar</span>
    {{/ember-power-select}}
  `);
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').length, 0, 'No list elements, just the given alternate block');
  assert.equal($('.empty-option-foo').length, 1);
});

/**
3 - Passing an array of strings
  a) [DONE] When NO selected option is provided the first element of the list is highlighted.
  b) [DONE] When a select option is provided that option appears in the component's trigger.
  c) [DONE] When a select option is provided that option is highlighed when opened.
  d) [DONE] When a select option is provided that element of the list is also marked with the `.selected` class.
  e) [DONE] The default search matches filters correctly ignoring diacritics (accents/capitals/ect...)
  f) [DONE] You can pass a custom matcher for customize the search.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Options are strings)', {
  integration: true
});

test('When no `selected` is provided, the first item in the dropdown is highlighted', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=(action (mut foo)) as |option|}}
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
    {{#ember-power-select selected="three" options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal(this.$().text().trim(), 'three', 'The selected option show in the trigger');

  this.render(hbs`
    {{#ember-power-select selected="three" options=numbers onchange=(action (mut foo)) as |option|}}
      Selected: {{option}}
    {{/ember-power-select}}
  `);
  assert.equal(this.$().text().trim(), 'Selected: three', 'The selected option uses the same yielded block as the options');
});

test('When `selected` option is provided, it is highlighted when the dropdown opens', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select selected="three" options=numbers onchange=(action (mut foo)) as |option|}}
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
    {{#ember-power-select selected="three" options=numbers onchange=(action (mut foo)) as |option|}}
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
    {{#ember-power-select options=names onchange=(action (mut foo)) as |option|}}
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

test('You can pass a custom marcher with `matcher=myFn` to customize the search strategy', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.endsWithMatcher = function(option, text) {
    return text === '' || option.slice(text.length * -1) === text;
  };

  this.render(hbs`
    {{#ember-power-select options=numbers matcher=endsWithMatcher onchange=(action (mut foo)) as |option|}}
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
  a) [DONE] When NO selected option is provided the first element of the list is highlighted.
  b) [DONE] When a select option is provided that option appears in the component's trigger.
  c) [DONE] When a select option is provided that option is highlighed when opened.
  d) [DONE] When a select option is provided that element of the list is also marked with the `.selected` class.
  e) [DONE] The search works when you provide a searchFileld, ignoring diacritics and capitalization
  f) [DONE] You can pass a custom matcher for customize the search.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Options are objects)', {
  integration: true
});

test('When no `selected` is provided, the first item in the dropdown is highlighted', function(assert) {
  assert.expect(3);

  this.countries = countries;
  this.render(hbs`
    {{#ember-power-select options=countries onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
  assert.equal($('.ember-power-select-option.highlighted').length, 1, 'One element is highlighted');
  assert.ok($('.ember-power-select-option:eq(0)').hasClass('highlighted'), 'The first one to be precise');
});

test('When a option is provided that options is rendered in the trigger using the same block as the options', function(assert) {
  assert.expect(1);

  this.countries = countries;
  this.country = countries[1]; // Spain
  this.render(hbs`
    {{#ember-power-select options=countries selected=country onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-trigger').text().trim(), 'ES: Spain', 'The selected country is rendered in the trigger');
});

test('When `selected` option is provided, it is highlighted when the dropdown opens', function(assert) {
  assert.expect(2);

  this.countries = countries;
  this.country = countries[1]; // Spain
  this.render(hbs`
    {{#ember-power-select options=countries selected=country onchange=(action (mut country)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  const $highlightedOption = $('.ember-power-select-option.highlighted');
  assert.equal($highlightedOption.length, 1, 'One element is highlighted');
  assert.equal($highlightedOption.text().trim(), 'ES: Spain', 'The second option is highlighted');
});

test('When `selected` option is provided, that option is marked as `.selected`', function(assert) {
  assert.expect(1);

  this.countries = countries;
  this.country = countries[1]; // Spain
  this.render(hbs`
    {{#ember-power-select options=countries selected=country onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  const $selectedOption = $('.ember-power-select-option:contains("ES: Spain")');
  assert.ok($selectedOption.hasClass('selected'), 'The second option is marked as selected');
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
    {{#ember-power-select options=people searchField="name" onchange=(action (mut foo)) as |person|}}
      {{person.name}} {{person.surname}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch('mar'));
  assert.equal($('.ember-power-select-option').length, 2, 'Only 2 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'María Murray');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'Marta Stinson');
  Ember.run(() => typeInSearch('mari'));
  assert.equal($('.ember-power-select-option').length, 1, 'Only 1 results match the search');
  assert.equal($('.ember-power-select-option').text().trim(), 'María Murray');
  Ember.run(() => typeInSearch('o'));
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

  this.nameOrSurnameNoDiacriticsCaseSensitive = function(value, text) {
    return text === '' || value.name.indexOf(text) > -1 || value.surname.indexOf(text) > -1;
  };

  this.render(hbs`
    {{#ember-power-select options=people matcher=nameOrSurnameNoDiacriticsCaseSensitive onchange=(action (mut foo)) as |person|}}
      {{person.name}} {{person.surname}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch('s'));
  assert.equal($('.ember-power-select-option').length, 3, 'Only 3 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Søren Williams');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'Marta Stinson');
  assert.equal($('.ember-power-select-option:eq(2)').text().trim(), 'Lisa Simpson');
});

/**
5 - Custom search action
  a) [DONE] When you pass a custom search action instead of options, opening the select show a "Type to search" message in a <li>
  b) [DONE] The "type to search" message can be customized passing the custom message.
  c) [DONE] The search function can return an array and those options get rendered.
  d) [DONE] The search function can return an a promise that resolves to an array too.
  e) [DONE] While the async search is being performed the "Type to search" dissapears the "Loading..." message appears.
  f) [DONE] When the search resolves to an empty array then the "No results found"
  g) [DONE] When the search resolves to an empty array then the custom noMatchesMessafe is displayed.
  h) [DONE] When the search resolves to an empty array then the given altertate block is rendered.
  i) [DONE] When one search is fired before the previous one resolved, the "Loading" continues until the 2nd is resolved.
  j) [DONE] Once the promise is resolved, the first element is highlighted.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Custom search function)', {
  integration: true
});

test('When you pass a custom search action instead of options, opening the select show a "Type to search" message in a list element', function(assert) {
  assert.expect(1);

  this.searchFn = function() {};

  this.render(hbs`
    {{#ember-power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').text(), 'Type to search', 'The dropdown shows the "type to seach" message');
});

test('The "type to search" message can be customized passing `searchMessage=something`', function(assert) {
  assert.expect(1);

  this.searchFn = function() {};
  this.render(hbs`
    {{#ember-power-select search=searchFn searchMessage="Type the name of the thing" onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').text(), 'Type the name of the thing');
});

test('The search function can return an array and those options get rendered', function(assert) {
  assert.expect(1);

  this.searchFn = function(term) {
    return numbers.filter(str => str.indexOf(term) > -1);
  };

  this.render(hbs`
    {{#ember-power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch("teen"));
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
    {{#ember-power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch("teen"));

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
    {{#ember-power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.ok(/Type to search/.test($('.ember-power-select-dropdown').text()), 'The type to search message is displayed');
  Ember.run(() => typeInSearch("teen"));
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
    {{#ember-power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch("teen"));
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
    {{#ember-power-select search=searchFn noMatchesMessage="Meec. Try again" onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch("teen"));
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
    {{#ember-power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{else}}
      <span class="foo-bar">Baz</span>
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch("teen"));
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
    {{#ember-power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch("teen"));

  setTimeout(function() {
    Ember.run(() => typeInSearch("teen"));
  }, 50);

  setTimeout(function() {
    assert.ok(/Loading options/.test($('.ember-power-select-option').text()));
    assert.equal($('.ember-power-select-option').length, 1, 'No results are shown');
  }, 120);

  setTimeout(done, 180);
});

test('When the search resolves, the first element is highlighted like with regular filtering', function(assert) {
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
    {{#ember-power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch("teen"));

  setTimeout(function() {
    assert.ok($('.ember-power-select-option:eq(0)').hasClass('highlighted'), 'The first result is highlighted');
    done();
  }, 110);
});

/**
6 - Groups
  a) [DONE] Options that have a `groupName` and `options` are considered groups and are rendered as such.
  b) [DONE] Filtering works with groups (a group title is visible as long as one of it's elements matches)
     the search criteria) with no depth limit.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Groups)', {
  integration: true
});

test('Options that have a `groupName` and `options` are considered groups and are rendered as such', function(assert) {
  assert.expect(10);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#ember-power-select options=groupedNumbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');

  Ember.run(() => this.$('.ember-power-select-trigger').click());

  let $rootLevelGroups = $('.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-group');
  let $rootLevelOptions = $('.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-option');
  assert.equal($rootLevelGroups.length, 3, 'There is 3 groups in the root level');
  assert.equal($rootLevelOptions.length, 2, 'There is 2 options in the root level');
  assert.equal($($rootLevelGroups[0]).find('.ember-power-select-group-name').text().trim(), 'Smalls');
  assert.equal($($rootLevelGroups[1]).find('.ember-power-select-group-name').text().trim(), 'Mediums');
  assert.equal($($rootLevelGroups[2]).find('> .ember-power-select-group-name').text().trim(), 'Bigs');
  assert.equal($($rootLevelOptions[0]).text().trim(), 'one hundred');
  assert.equal($($rootLevelOptions[1]).text().trim(), 'one thousand');

  let $bigs = $($rootLevelGroups[2]).find('> .ember-power-select-options.nested');
  assert.equal($bigs.find('> .ember-power-select-group').length, 2, 'There is 2 sub-groups in the "bigs" group');
  assert.equal($bigs.find('> .ember-power-select-option').length, 1, 'There is 1 option in the "bigs" group');
});

test('When filtering, a group title is visible as long as one of it\'s elements is', function(assert) {
  assert.expect(3);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#ember-power-select options=groupedNumbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch('ve'));
  let groupNames = $('.ember-power-select-group-name').toArray().map(e => $(e).text().trim());
  let optionValues = $('.ember-power-select-option').toArray().map(e => $(e).text().trim());
  assert.deepEqual(groupNames, ["Mediums", "Bigs", "Fairly big", "Really big"], 'Only the groups with matching options are shown');
  assert.deepEqual(optionValues, ["five", "seven", "eleven", "twelve"], 'Only the matching options are shown');
  Ember.run(() => typeInSearch('lve'));
  groupNames = $('.ember-power-select-group-name').toArray().map(e => $(e).text().trim());
  assert.deepEqual(groupNames, ["Bigs", "Really big"], 'With no depth level');
});

test('Click on an option of a group select selects the option and closes the dropdown', function(assert) {
  assert.expect(2);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#ember-power-select options=groupedNumbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => $('.ember-power-select-option:contains("four")').click());
  assert.equal($('.ember-power-select-trigger').text().trim(), "four", 'The clicked option was selected');
  assert.equal($('.ember-power-select-options').length, 0, 'The dropdown has dissapeared');
});

/**
7 - Mouse control
  a) [DONE] Mouseovering a list item highlights it.
  b) [DONE] Clicking an item selects it, closes the dropdown and focuses the trigger.
  c) [DONE] Clicking the trigger while the select is opened closes it and and focuses the trigger.
  d) [DONE] Clicking the clear button removes the selection but doesn't opens the dropdon.
  e) [DONE] Clicking anywhere outside the select while opened closes the component AND DOESN'T FOCUSES THE TRIGGER (FAILING NOW)
  f) [DONE] Clicking on the title of a group doesn't performs any action nor closes the dropdown.
*/
moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Mouse control)', {
  integration: true
});

test('Mouseovering a list item highlights it', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.ok($('.ember-power-select-option:eq(0)').hasClass('highlighted'), 'The first element is highlighted');
  Ember.run(() => $('.ember-power-select-option:eq(3)').trigger('mouseover'));
  assert.ok($('.ember-power-select-option:eq(3)').hasClass('highlighted'), 'The 4th element is highlighted');
  assert.equal($('.ember-power-select-option:eq(3)').text().trim(), 'four');
});

test('Clicking an item selects it, closes the dropdown and focuses the trigger', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.foo = (val, dropdown) => {
    assert.equal(val, 'four', 'The action is invoked with the selected value as first parameter');
    assert.ok(dropdown.close, 'The action is invoked with the the dropdown object as second parameter');
  };
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=foo as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => $('.ember-power-select-option:eq(3)').click());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select was closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigger is focused');
});

test('Clicking the trigger while the select is opened closes it and and focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigger is focused');
});

test('Clicking the clear button removes the selection', function(assert) {
  assert.expect(6);

  this.numbers = numbers;
  this.onChange = function(selected, dropdown) {
    assert.equal(selected, null, 'The onchange action was called with the new selection (null)');
    assert.ok(dropdown.close, 'The onchange action was called with the dropdown object as second argument');
  };
  this.render(hbs`
    {{#ember-power-select options=numbers selected="three" allowClear=true onchange=onChange as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.ok(/three/.test($('.ember-power-select-trigger').text().trim()), 'A element is selected');
  Ember.run(() => $('.ember-power-select-clear-btn').click());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is still closed');
  assert.ok(!/three/.test($('.ember-power-select-trigger').text().trim()), 'That element is not selected now');
});

test('Clicking anywhere outside the select while opened closes the component and doesn\'t focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    <div id="other-thing">Foo</div>
    {{#ember-power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  Ember.run(() => this.$('#other-thing').click());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.ok($('.ember-power-select-trigger').get(0) !== document.activeElement, 'The select is not focused');
});

test('Clicking on the title of a group doesn\'t performs any action nor closes the dropdown', function(assert) {
  assert.expect(1);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#ember-power-select options=groupedNumbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => this.$('.ember-power-select-group-name:eq(1)').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is still opened');
});

/**
8 - Keyboard control
  a) [DONE] Pressing keydown highlights the next option.
  b) [DONE] Pressing keyup highlights the previous option.
  c) [DONE] When you the last option is highlighted, pressing keydown doesn't change the highlighted.
  d) [DONE] When you the first option is highlighted, pressing keyup doesn't change the highlighted.
  e) [DONE] Pressing ENTER selects the highlighted element, closes the dropdown and focuses the trigger.
  f) [DONE] Pressing TAB closes the select WITHOUT selecting the highlighed element and focuses the trigger.
  g) [DONE] The component is focusable using the TAB key as any other kind of input.
  i) [DONE] If the component is focused, pressing ENTER opens it.
  j) [DONE] Pressing ESC while the component is opened closes it and focuses the trigger
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Keyboard control)', {
  integration: true
});

test('Pressing keydown highlights the next option', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'one');
  Ember.run(() => triggerKeydown($('.ember-power-select-search input')[0], 40));
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'two', 'The next options is highlighted now');
});

test('Pressing keyup highlights the previous option', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers selected="three" onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'three');
  Ember.run(() => triggerKeydown($('.ember-power-select-search input')[0], 38));
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'two', 'The previous options is highlighted now');
});

test('When you the last option is highlighted, pressing keydown doesn\'t change the highlighted', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.lastNumber = numbers[numbers.length - 1];
  this.render(hbs`
    {{#ember-power-select options=numbers selected=lastNumber onchange=(action (mut lastNumber)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'twenty');
  Ember.run(() => triggerKeydown($('.ember-power-select-search input')[0], 40));
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'twenty', 'The last option is still the highlighted one');
});

test('When you the first option is highlighted, pressing keyup doesn\'t change the highlighted', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.firstNumber = numbers[0];
  this.render(hbs`
    {{#ember-power-select options=numbers selected=firstNumber onchange=(action (mut firstNumber)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'one');
  Ember.run(() => triggerKeydown($('.ember-power-select-search input')[0], 38));
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'one', 'The first option is still the highlighted one');
});

test('Pressing ENTER selects the highlighted element, closes the dropdown and focuses the trigger', function(assert) {
  assert.expect(5);

  this.numbers = numbers;
  this.changed = (val, dropdown) => {
    assert.equal(val, 'two', 'The onchange action is triggered with the selected value');
    this.set('selected', val);
    assert.ok(dropdown.close, 'The action receives the dropdown as second argument');
  };

  this.render(hbs`
    {{#ember-power-select options=numbers selected=selected onchange=(action changed) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => triggerKeydown($('.ember-power-select-search input')[0], 40));
  Ember.run(() => triggerKeydown($('.ember-power-select-search input')[0], 13));
  assert.equal($('.ember-power-select-trigger').text().trim(), 'two', 'The highlighted element was selected');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The dropdown is closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigger is focused');
});

test('Pressing TAB closes the select WITHOUT selecting the highlighed element and focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => triggerKeydown($('.ember-power-select-search input')[0], 40));
  Ember.run(() => triggerKeydown($('.ember-power-select-search input')[0], 9));
  assert.equal($('.ember-power-select-trigger').text().trim(), '', 'The highlighted element wasn\'t selected');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The dropdown is closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigges is focused');
});

test('The component is focusable using the TAB key as any other kind of input', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);
  assert.equal(this.$('.ember-power-select-trigger').attr('tabindex'), "0", 'The trigger is reachable with TAB');
});

test('If the component is focused, pressing ENTER opens it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => $('.ember-power-select-trigger').focus());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  Ember.run(() => triggerKeydown($('.ember-power-select-trigger')[0], 13));
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
});

test('If the single component is focused, pressing KEYDOWN opens it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => $('.ember-power-select-trigger').focus());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  Ember.run(() => triggerKeydown($('.ember-power-select-trigger')[0], 40));
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
});

test('If the single component is focused, pressing KEYUP opens it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => $('.ember-power-select-trigger').focus());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  Ember.run(() => triggerKeydown($('.ember-power-select-trigger')[0], 38));
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
});

test('Pressing ESC while the component is opened closes it and focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => $('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  Ember.run(() => triggerKeydown($('.ember-power-select-trigger')[0], 27));
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The select is focused');
});

/**
9 - Disabled select/options
  a) [DONE] A disabled dropdown doesn't responds to mouse/keyboard events
  b) [DONE] A disabled dropdown is not focusable.
  c) [DONE] Options with a disabled field set to true are styled as disabled.
  d) [DONE] Disabled options are not highlighted when hovered with the mouse.
  e) [DONE] Disabled options are skipped when highlighting items with the keyboard.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Disabled)', {
  integration: true
});

test('A disabled dropdown doesn\'t responds to mouse/keyboard events', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers disabled=true onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  let $select = this.$('.ember-power-select');
  assert.ok($select.hasClass('disabled'), 'The select has class disabled');
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is still closed');
  Ember.run(() => triggerKeydown($('.ember-power-select-trigger')[0], 13));
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is still closed');
});

test('A disabled dropdown is not focusable', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers disabled=true onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal(this.$('.ember-power-select-trigger').attr('tabindex'), "-1", 'The trigger is not reachable with TAB');
});

test('Options with a disabled field set to true are styled as disabled', function(assert) {
  assert.expect(2);

  this.contriesWithDisabled = contriesWithDisabled;
  this.render(hbs`
    {{#ember-power-select options=contriesWithDisabled onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').length, 7, 'There is 7 options');
  assert.equal($('.ember-power-select-option.disabled').length, 3, 'Three of them are disabled');
});

test('Disabled options are not highlighted when hovered with the mouse', function(assert) {
  assert.expect(1);

  this.contriesWithDisabled = contriesWithDisabled;
  this.render(hbs`
    {{#ember-power-select options=contriesWithDisabled onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => $('.ember-power-select-option.disabled:eq(0)').trigger('mouseover'));
  assert.ok(!$('.ember-power-select-option.disabled:eq(0)').hasClass('highlighted'), 'The hovered option was not highligted because it\'s disabled');
});

test('Disabled options are skipped when highlighting items with the keyboard', function(assert) {
  assert.expect(1);

  this.contriesWithDisabled = contriesWithDisabled;
  this.render(hbs`
    {{#ember-power-select options=contriesWithDisabled onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => triggerKeydown($('.ember-power-select-search input')[0], 40));
  Ember.run(() => triggerKeydown($('.ember-power-select-search input')[0], 40));
  assert.ok($('.ember-power-select-option.highlighted').text().trim(), 'LV: Latvia' ,'The hovered option was not highligted because it\'s disabled');
});

/**
10 - Multiple select
  a) [DONE] Multiple selects don't have a search box.
  b) [DONE] When the select opens, the search input in the trigger gets the focus.
  c) [DONE] Click on an element selects it and closes the dropdown and focuses the trigger's input.
  d) [DONE] Selecting an element triggers the onchange action with the list of selected options.
  e) [DONE] Click an option when there is already another selects both, and triggers the onchange action with them.
  f) [DONE] If there is many selections, all those options are styled as `selected`.
  g) [DONE] When the popup opens, the first items is highlighed, even if there is only one selection.
  h) [DONE] Clicking on an option that is already selected unselects it, closes the select and triggers the `onchange` action.
  i) [DONE] The default filtering works in multiple mode.
  j) [DONE] The filtering specifying a searchkey works in multiple model.
  k) [DONE] The filtering specifying a custom matcher works in multiple model.
  l) [DONE] The search using a custom action works int multiple mode.
  m) [DONE] Pressing ENTER over a highlighted element selects it.
  n) [DONE] Pressing ENTER over a highlighted element what is already selected unselects it????
  o) [DONE] Pressing BACKSPACE on the search input when there is text on it does nothing special.
  p) [DONE] Pressing BACKSPACE on the search input when it's empty removes the last selection and performs a search for that text immediatly.
  q) [DONE] Pressing ENTER when the select is closed opens and nothing is written on the box opens it.
  r) [DONE] If the multiple component is focused, pressing KEYDOWN opens it
  s) [DONE] If the multiple component is focused, pressing KEYUP opens it
  Is it possible to remove this searchbox from multiple selects??
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Multiple)', {
  integration: true
});

test('Multiple selects don\'t have a search box', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers multiple=true selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-search').length, 0, 'There is no search box');
});

test('When the select opens, the search input in the trigger gets the focus', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers selected=foo onchange=(action (mut foo)) multiple=true as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.ok($('.ember-power-select-trigger-multiple-input').get(0) === document.activeElement, 'The search input is focused');
});

test('Click on an element selects it and closes the dropdown and focuses the trigger\'s input', function(assert) {
  assert.expect(5);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers selected=foo onchange=(action (mut foo)) multiple=true as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.ok(this.$('.ember-power-select-trigger-multiple-input').get(0) === document.activeElement, 'The input of the trigger is focused');
  Ember.run(() => $('.ember-power-select-option:eq(1)').click());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The dropdown is closed');
  assert.equal($('.ember-power-select-multiple-option').length, 1, 'There is 1 option selected');
  assert.ok(/two/.test($('.ember-power-select-multiple-option').text()), 'The clicked element has been selected');
  assert.ok(this.$('.ember-power-select-trigger-multiple-input').get(0) === document.activeElement, 'The input of the trigger is focused again');
});

test('Selecting an element triggers the onchange action with the list of selected options', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.change = (values) => {
    assert.deepEqual(values, ['two'], 'The onchange action is fired with the list of values');
  };

  this.render(hbs`
    {{#ember-power-select options=numbers onchange=change multiple=true as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => $('.ember-power-select-option:eq(1)').click());
});

test('Click an option when there is already another selects both, and triggers the onchange action with them', function(assert) {
  assert.expect(5);

  this.numbers = numbers;
  this.selectedNumbers = ['four'];
  this.change = (values) => {
    assert.deepEqual(values, ['four', 'two'], 'The onchange action is fired with the list of values');
    this.set('selectedNumbers', values);
  };

  this.render(hbs`
    {{#ember-power-select options=numbers selected=selectedNumbers onchange=change multiple=true as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-multiple-option').length, 1, 'There is 1 option selected');
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => $('.ember-power-select-option:eq(1)').click());
  assert.equal($('.ember-power-select-multiple-option').length, 2, 'There is 2 options selected');
  assert.ok(/four/.test($('.ember-power-select-multiple-option:eq(0)').text()), 'The first option is the provided one');
  assert.ok(/two/.test($('.ember-power-select-multiple-option:eq(1)').text()), 'The second option is the one just selected');
});

test('If there is many selections, all those options are styled as `selected`', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.selectedNumbers = ['four', 'two'];

  this.render(hbs`
    {{#ember-power-select options=numbers selected=selectedNumbers onchange=(action (mut selectedNumbers)) multiple=true as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.ok($('.ember-power-select-option:eq(1)').hasClass('selected'), 'The second option is styled as selected');
  assert.ok($('.ember-power-select-option:eq(3)').hasClass('selected'), 'The 4th option is styled as selected');
});

test('When the popup opens, the first items is highlighed, even if there is only one selection', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.selectedNumbers = ['four'];

  this.render(hbs`
    {{#ember-power-select options=numbers selected=selectedNumbers onchange=(action (mut selectedNumbers)) multiple=true as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option.highlighted').length, 1, 'There is one element highlighted');
  assert.equal($('.ember-power-select-option.selected').length, 1, 'There is one element selected');
  assert.equal($('.ember-power-select-option.highlighted.selected').length, 0, 'They are not the same');
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'one', 'The highlighted element is the first one');
});

test('Clicking on an option that is already selected unselects it, closes the select and triggers the `onchange` action', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.selectedNumbers = ['four'];
  this.change = (selected) => {
    assert.ok(Ember.isEmpty(selected), 'No elements are selected');
    this.set('selectedNumbers', selected);
  };

  this.render(hbs`
    {{#ember-power-select options=numbers selected=selectedNumbers onchange=change multiple=true as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-multiple-option').length, 1, 'There is 1 option selected');
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => $('.ember-power-select-option.selected').click());
  assert.equal($('.ember-power-select-multiple-option').length, 0, 'There is no options selected');
});

test('The default filtering works in multiple mode', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=(action (mut foo)) multiple=true as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch('four'));
  assert.equal($('.ember-power-select-option').length, 2, 'Only two items matched the criteria');
});

test('The filtering specifying a searchkey works in multiple model', function(assert) {
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
    {{#ember-power-select options=people searchField="name" onchange=(action (mut foo)) multiple=true as |person|}}
      {{person.name}} {{person.surname}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch('mar'));
  assert.equal($('.ember-power-select-option').length, 2, 'Only 2 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'María Murray');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'Marta Stinson');
  Ember.run(() => typeInSearch('mari'));
  assert.equal($('.ember-power-select-option').length, 1, 'Only 1 results match the search');
  assert.equal($('.ember-power-select-option').text().trim(), 'María Murray');
  Ember.run(() => typeInSearch('o'));
  assert.equal($('.ember-power-select-option').length, 2, 'Only 2 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Søren Williams');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'João Jin');
});

test('The filtering specifying a custom matcher works in multiple model', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.endsWithMatcher = function(value, text) {
    return text === '' || value.slice(text.length * -1) === text;
  };

  this.render(hbs`
    {{#ember-power-select options=numbers matcher=endsWithMatcher onchange=(action (mut foo)) multiple=true as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch('on'));
  assert.equal($('.ember-power-select-option').text().trim(), "No results found", 'No number ends in "on"');
  Ember.run(() => typeInSearch('teen'));
  assert.equal($('.ember-power-select-option').length, 7, 'There is 7 number that end in "teen"');
});

test('The search using a custom action works int multiple mode', function(assert) {
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
    {{#ember-power-select search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch("teen"));

  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, 7);
    done();
  }, 150);
});

test('Pressing ENTER when the select is closed opens and nothing is written on the box opens it', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers selected=foo onchange=(action (mut foo)) multiple=true as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 27));
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');
  assert.ok($('.ember-power-select-trigger-multiple-input').get(0) === document.activeElement, 'The trigger is focused');
  Ember.run(() => triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 13));
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
});

test('Pressing ENTER over a highlighted element selects it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.change = (selected) => {
    assert.deepEqual(selected, ['two']);
    this.set('foo', selected);
  };
  this.render(hbs`
    {{#ember-power-select options=numbers selected=foo onchange=change multiple=true as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 40));
  Ember.run(() => triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 13));
  assert.ok(/two/.test($('.ember-power-select-trigger').text().trim()), 'The element was selected');
});

test('Pressing ENTER over a highlighted element what is already selected closes the select without doing anything and focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.selected = ['two'];
  this.didChange = (val) => {
    assert.ok(false, 'This should never be invoked');
    this.set('selected', val);
  };
  this.render(hbs`
    {{#ember-power-select options=numbers selected=selected onchange=didChange multiple=true as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 40));
  Ember.run(() => triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 13));
  assert.ok(/two/.test($('.ember-power-select-trigger').text().trim()), 'The element is still selected');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');
  assert.ok($('.ember-power-select-trigger-multiple-input').get(0) === document.activeElement, 'The trigger is focused');
});

test('Pressing BACKSPACE on the search input when there is text on it does nothing special', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.selected = ['two'];
  this.didChange = (val) => {
    assert.ok(false, 'This should not be called');
    this.set('selected', val);
  };
  this.render(hbs`
    {{#ember-power-select options=numbers selected=selected onchange=didChange multiple=true as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch('four'));
  Ember.run(() => triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 8));
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The dropown is still opened');
});

test('Pressing BACKSPACE on the search input when it\'s empty removes the last selection and performs a search for that text immediatly', function(assert) {
  assert.expect(7);

  this.numbers = numbers;
  this.selected = ['two'];
  this.didChange = (val, dropdown) => {
    assert.deepEqual(val, [], 'The selected item was unselected');
    this.set('selected', val);
    assert.ok(dropdown.close, 'The dropdown API is received as second argument');
  };
  this.render(hbs`
    {{#ember-power-select options=numbers onchange=didChange selected=selected multiple=true as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal(this.$('.ember-power-select-multiple-option').length, 1, 'There is one element selected');
  Ember.run(() => triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 8));
  assert.equal(this.$('.ember-power-select-multiple-option').length, 0, 'There is no elements selected');
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').val(), 'two', 'The text of the seach input is two now');
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The dropown is still opened');
  assert.equal($('.ember-power-select-option').length, 1, 'The list has been filtered');
});

test('Pressing BACKSPACE on the search input when it\'s empty removes the last selection ALSO when that option didn\'t come from the outside', function(assert) {
  assert.expect(5);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=numbers selected=foo onchange=(action (mut foo)) multiple=true as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => $('.ember-power-select-option:eq(2)').click());
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal(this.$('.ember-power-select-multiple-option').length, 1, 'There is one element selected');
  Ember.run(() => triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 8));
  assert.equal(this.$('.ember-power-select-multiple-option').length, 0, 'There is no elements selected');
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').val(), 'three', 'The text of the seach input is three now');
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The dropown is still opened');
  assert.equal($('.ember-power-select-option').length, 1, 'The list has been filtered');
});

test('If the multiple component is focused, pressing KEYDOWN opens it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select multiple=true options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 27));
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  Ember.run(() => triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 40));
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
});

test('If the multiple component is focused, pressing KEYUP opens it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select multiple=true options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 27));
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  Ember.run(() => triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 38));
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
});


/**
10 - Dropdown positioning
  a) [UNTESTABLE??] By default the dropdown is placed automatically depending on the available space around the select.
  b) [UNTESTABLE??] Passing `dropdownPosition=above` positions the dropdown on top of the trigger.
  c) [UNTESTABLE??] When the dropdown in auto is opened and the user scrolls until there is not enough space below, the dropdown changes to be on top.
  d) [UNTESTABLE??] Once the dropdown has changes to be on top, it won't go back to the bottom until there is no enough space on top.
*/

// moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Dropdown positioning)', {
//   integration: true
// });

// test('By default the dropdown is placed automatically depending on the available space around the select', function(assert) {
//   assert.expect(1);

//   this.numbers = numbers;
//   this.render(hbs`
//     {{#ember-power-select options=numbers as |option|}}
//       {{option}}
//     {{/ember-power-select}}
//   `);

//   Ember.run(() => this.$('.ember-power-select-trigger').click());

//   assert.ok($('.ember-power-select-dropdown').offset().top > $('.ember-power-select-trigger').offset().top, 'Dropdown placed below the trigger');
// });

// test('Passing `dropdownPosition=above` positions the dropdown on top of the trigger', function(assert) {
//   assert.expect(1);

//   this.numbers = numbers;
//   this.render(hbs`
//     {{#ember-power-select options=numbers dropdownPosition="above" as |option|}}
//       {{option}}
//     {{/ember-power-select}}
//   `);

//   Ember.run(() => this.$('.ember-power-select-trigger').click());
//   assert.ok($('.ember-power-select-dropdown').offset().top < $('.ember-power-select-trigger').offset().top, 'Dropdown placed below the trigger');
// });

// test('When the dropdown in auto is opened and the user scrolls until there is not enough space below, the dropdown changes to be on top', function(assert) {
//   throw new Error('not implemented');
// });

// test('Once the dropdown has changes to be on top, it won\'t go back to the bottom until there is no enough space on top', function(assert) {
//   throw new Error('not implemented');
// });


/**
10 - Ember data integration
  a) [DONE] Passing as options of a `store.findAll` works.
  b) [DONE] Passing as options the result of `store.query` works.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Ember-data integration)', {
  integration: true,
  beforeEach() {
    mirageInitializer.initialize(this.container);
    this.store = this.container.lookup('service:store');
  }
});

test('Passing as options of a `store.findAll` works', function(assert) {
  let done = assert.async();
  server.createList('user', 10);

  this.users = this.store.findAll('user');
  this.render(hbs`
    {{#ember-power-select options=users searchField="name" onchange=(action (mut foo)) as |option|}}
      {{option.name}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').text().trim(), 'Loading options...', 'The loading message appears while the promise is pending');

  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, 10, 'Once the collection resolves the options render normally');
    Ember.run(() => typeInSearch('2'));
    assert.equal($('.ember-power-select-option').length, 1, 'Filtering works');
    done();
  }, 10);
});

test('Passing as options the result of `store.query` works', function(assert) {
  let done = assert.async();
  server.createList('user', 10);

  this.users = this.store.query('user', { foo: 'bar' });
  this.render(hbs`
    {{#ember-power-select options=users searchField="name" onchange=(action (mut foo)) as |option|}}
      {{option.name}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').text().trim(), 'Loading options...', 'The loading message appears while the promise is pending');

  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, 10, 'Once the collection resolves the options render normally');
    Ember.run(() => typeInSearch('2'));
    assert.equal($('.ember-power-select-option').length, 1, 'Filtering works');
    done();
  }, 10);
});

/**
11 - Customization using components
  a) [DONE] selected option can be customized using selectedComponent.
  b) [DONE] the list of options can be customized using optionsComponent.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Customization using components)', {
  integration: true
});

test('selected option can be customized using selectedComponent', function(assert) {
  assert.expect(2);

  this.countries = countries;
  this.country = countries[1]; // Spain

  this.render(hbs`
    {{#ember-power-select options=countries selected=country selectedComponent="selected-country" onchange=(action (mut foo)) as |country|}}
      {{country.name}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-trigger .icon-flag').length, 1, 'The custom flag appears.');
  assert.equal($('.ember-power-select-trigger').text().trim(), 'Spain', 'With the country name as the text.');
});

test('the list of options can be customized using optionsComponent', function(assert) {
  assert.expect(2);

  this.countries = countries;
  this.country = countries[1]; // Spain

  this.render(hbs`
    {{#ember-power-select options=countries selected=country optionsComponent="list-of-countries" onchange=(action (mut foo)) as |country|}}
      {{country.name}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  let text = $('.ember-power-select-options').text().trim();
  assert.ok(/Countries:/.test(text), 'The given component is rendered');
  assert.ok(/3\. Russia/.test(text), 'The component has access to the options');
});

/**
11 - Development assertions
  a) the `onchange` function is mandatory.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Assertions)', {
  integration: true
});

test('the `onchange` function is mandatory', function(assert) {
  assert.expect(1);

  this.numbers = numbers;

  assert.throws(() => {
    this.render(hbs`
      {{#ember-power-select options=countries selected=selected as |opt|}}{{opt}}{{/ember-power-select}}
    `);
  }, /requires an `onchange` function/);
});

/**
  Helpers
*/

function triggerKeydown(domElement, k) {
  var oEvent = document.createEvent("Events");
  oEvent.initEvent('keydown', true, true);
  $.extend(oEvent, {
    view: window,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    keyCode: k,
    charCode: k
  });

  domElement.dispatchEvent(oEvent);
}
