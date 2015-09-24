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

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (General behavior)', {
  integration: true
});

/** List of basic behavior to test:

1 - General
  a) Clicking the trigger opens the the dropdown
  b) Clicking the dropdown again closes the dropdown.
  c) Search functionality is enabled by default.
  d) You can disable the search funcionality passing `searchEnabled=false`.
  e) The search box get the focus automatically when opened.
  f) It displays the list of options and yields each option to the given block (try both strings and objects).

2 - Passing an empty array
  a) A "No options" message appears by default.
  b) That message can be customized passing an option.
  c) That message can be customized passing an inverse block to the component.

3 - Passing an array of strings
  b) When NO selected option is provided the first element of the list is highlighted.
  c) When a select option is provided that option appears in the component's trigger.
  d) When a select option is provided that option is highlighed when opened.
  e) When a select option is provided that element of the list is also marked with the `.selected` class.
  f) The block provided to the component customizes both the list's items and the trigger.
  g) The default search matches filters correctly ignoring diacritics (accents/capitals/ect...)
  h) You can pass a custom matcher for customize the search.
  i) You can pass a `search` function that can return an array of results.
  h) You can pass a `search` function that can return an promise that resolves to an array of results.


4 - Passing an array of objects
  b) When NO selected option is provided the first element of the list is highlighted.
  c) When a select option is provided that option appears in the component's trigger.
  d) When a select option is provided that option is highlighed when opened.
  e) When a select option is provided that element of the list is also marked with the `.selected` class.
  f) The block provided to the component customizes both the list's items and the trigger.

*/


test('Clicking in the trigger opens the dropdown', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal(this.$().text().trim(), '');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
});
