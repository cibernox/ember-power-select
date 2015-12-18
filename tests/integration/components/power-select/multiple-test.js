import Ember from 'ember';
import { moduleForComponent /*, test */ } from 'ember-qunit';
import { skip } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { typeInSearch, triggerKeydown, clickTrigger } from '../../../helpers/ember-power-select';
import { numbers } from '../constants';

const { RSVP } = Ember;

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Multiple)', {
  integration: true
});

skip('Multiple selects don\'t have a search box', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers multiple=true selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-search').length, 0, 'There is no search box');
});

skip('When the select opens, the search input in the trigger gets the focus', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) multiple=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.ok($('.ember-power-select-trigger-multiple-input').get(0) === document.activeElement, 'The search input is focused');
});

skip('Click on an element selects it and closes the dropdown and focuses the trigger\'s input', function(assert) {
  assert.expect(5);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) multiple=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.ok(this.$('.ember-power-select-trigger-multiple-input').get(0) === document.activeElement, 'The input of the trigger is focused');
  Ember.run(() => $('.ember-power-select-option:eq(1)').mouseup());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The dropdown is closed');
  assert.equal($('.ember-power-select-multiple-option').length, 1, 'There is 1 option selected');
  assert.ok(/two/.test($('.ember-power-select-multiple-option').text()), 'The clicked element has been selected');
  assert.ok(this.$('.ember-power-select-trigger-multiple-input').get(0) === document.activeElement, 'The input of the trigger is focused again');
});

skip('Selecting an element triggers the onchange action with the list of selected options', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.change = (values) => {
    assert.deepEqual(values, ['two'], 'The onchange action is fired with the list of values');
  };

  this.render(hbs`
    {{#power-select options=numbers onchange=change multiple=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  Ember.run(() => $('.ember-power-select-option:eq(1)').mouseup());
});

skip('Click an option when there is already another selects both, and triggers the onchange action with them', function(assert) {
  assert.expect(5);

  this.numbers = numbers;
  this.selectedNumbers = ['four'];
  this.change = (values) => {
    assert.deepEqual(values, ['four', 'two'], 'The onchange action is fired with the list of values');
    this.set('selectedNumbers', values);
  };

  this.render(hbs`
    {{#power-select options=numbers selected=selectedNumbers onchange=change multiple=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal($('.ember-power-select-multiple-option').length, 1, 'There is 1 option selected');
  clickTrigger();
  Ember.run(() => $('.ember-power-select-option:eq(1)').mouseup());
  assert.equal($('.ember-power-select-multiple-option').length, 2, 'There is 2 options selected');
  assert.ok(/four/.test($('.ember-power-select-multiple-option:eq(0)').text()), 'The first option is the provided one');
  assert.ok(/two/.test($('.ember-power-select-multiple-option:eq(1)').text()), 'The second option is the one just selected');
});

skip('If there is many selections, all those options are styled as `selected`', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.selectedNumbers = ['four', 'two'];

  this.render(hbs`
    {{#power-select options=numbers selected=selectedNumbers onchange=(action (mut selectedNumbers)) multiple=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.ok($('.ember-power-select-option:eq(1)').hasClass('ember-power-select-option--selected'), 'The second option is styled as selected');
  assert.ok($('.ember-power-select-option:eq(3)').hasClass('ember-power-select-option--selected'), 'The 4th option is styled as selected');
});

skip('When the popup opens, the first items is highlighed, even if there is only one selection', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.selectedNumbers = ['four'];

  this.render(hbs`
    {{#power-select options=numbers selected=selectedNumbers onchange=(action (mut selectedNumbers)) multiple=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option--highlighted').length, 1, 'There is one element highlighted');
  assert.equal($('.ember-power-select-option--selected').length, 1, 'There is one element selected');
  assert.equal($('.ember-power-select-option--highlighted.ember-power-select-option--selected').length, 0, 'They are not the same');
  assert.equal($('.ember-power-select-option--highlighted').text().trim(), 'one', 'The highlighted element is the first one');
});

skip('Clicking on an option that is already selected unselects it, closes the select and triggers the `onchange` action', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.selectedNumbers = ['four'];
  this.change = (selected) => {
    assert.ok(Ember.isEmpty(selected), 'No elements are selected');
    this.set('selectedNumbers', selected);
  };

  this.render(hbs`
    {{#power-select options=numbers selected=selectedNumbers onchange=change multiple=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal($('.ember-power-select-multiple-option').length, 1, 'There is 1 option selected');
  clickTrigger();
  Ember.run(() => $('.ember-power-select-option--selected').mouseup());
  assert.equal($('.ember-power-select-multiple-option').length, 0, 'There is no options selected');
});

skip('The default filtering works in multiple mode', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) multiple=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('four');
  assert.equal($('.ember-power-select-option').length, 2, 'Only two items matched the criteria');
});

skip('The filtering specifying a searchkey works in multiple model', function(assert) {
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
    {{#power-select options=people searchField="name" onchange=(action (mut foo)) multiple=true as |person|}}
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

skip('The filtering specifying a custom matcher works in multiple model', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.endsWithMatcher = function(value, text) {
    return text === '' || value.slice(text.length * -1) === text;
  };

  this.render(hbs`
    {{#power-select options=numbers matcher=endsWithMatcher onchange=(action (mut foo)) multiple=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('on');
  assert.equal($('.ember-power-select-option').text().trim(), "No results found", 'No number ends in "on"');
  typeInSearch('teen');
  assert.equal($('.ember-power-select-option').length, 7, 'There is 7 number that end in "teen"');
});

skip('The search using a custom action works int multiple mode', function(assert) {
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

skip('Pressing ENTER when the select is closed opens and nothing is written on the box opens it', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) multiple=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 27);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');
  assert.ok($('.ember-power-select-trigger-multiple-input').get(0) === document.activeElement, 'The trigger is focused');
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
});

skip('Pressing ENTER over a highlighted element selects it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.change = (selected) => {
    assert.deepEqual(selected, ['two']);
    this.set('foo', selected);
  };
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=change multiple=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 40);
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 13);
  assert.ok(/two/.test($('.ember-power-select-trigger').text().trim()), 'The element was selected');
});

skip('Pressing ENTER over a highlighted element what is already selected closes the select without doing anything and focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.selected = ['two'];
  this.didChange = (val) => {
    assert.ok(false, 'This should never be invoked');
    this.set('selected', val);
  };
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=didChange multiple=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 40);
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 13);
  assert.ok(/two/.test($('.ember-power-select-trigger').text().trim()), 'The element is still selected');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');
  assert.ok($('.ember-power-select-trigger-multiple-input').get(0) === document.activeElement, 'The trigger is focused');
});

skip('Pressing BACKSPACE on the search input when there is text on it does nothing special', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.selected = ['two'];
  this.didChange = (val) => {
    assert.ok(false, 'This should not be called');
    this.set('selected', val);
  };
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=didChange multiple=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('four');
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 8);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The dropown is still opened');
});

skip('Pressing BACKSPACE on the search input when it\'s empty removes the last selection and performs a search for that text immediatly', function(assert) {
  assert.expect(7);

  this.numbers = numbers;
  this.selected = ['two'];
  this.didChange = (val, dropdown) => {
    assert.deepEqual(val, [], 'The selected item was unselected');
    this.set('selected', val);
    assert.ok(dropdown.actions.close, 'The dropdown API is received as second argument');
  };
  this.render(hbs`
    {{#power-select options=numbers onchange=didChange selected=selected multiple=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal(this.$('.ember-power-select-multiple-option').length, 1, 'There is one element selected');
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 8);
  assert.equal(this.$('.ember-power-select-multiple-option').length, 0, 'There is no elements selected');
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').val(), 'two', 'The text of the seach input is two now');
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The dropown is still opened');
  assert.equal($('.ember-power-select-option').length, 1, 'The list has been filtered');
});

skip('Pressing BACKSPACE on the search input when it\'s empty removes the last selection ALSO when that option didn\'t come from the outside', function(assert) {
  assert.expect(5);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action (mut foo)) multiple=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  Ember.run(() => $('.ember-power-select-option:eq(2)').mouseup());
  clickTrigger();
  assert.equal(this.$('.ember-power-select-multiple-option').length, 1, 'There is one element selected');
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 8);
  assert.equal(this.$('.ember-power-select-multiple-option').length, 0, 'There is no elements selected');
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').val(), 'three', 'The text of the seach input is three now');
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The dropown is still opened');
  assert.equal($('.ember-power-select-option').length, 1, 'The list has been filtered');
});

skip('If the multiple component is focused, pressing KEYDOWN opens it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select multiple=true options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 27);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 40);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
});

skip('If the multiple component is focused, pressing KEYUP opens it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select multiple=true options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 27);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 38);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
});

skip('The placeholder is only visible when no options are selected', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select multiple=true options=numbers selected=foo onchange=(action (mut foo)) placeholder="Select stuff here" as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal(this.$('.ember-power-select-trigger-multiple-input').attr('placeholder'), 'Select stuff here', 'There is a placeholder');
  clickTrigger();
  Ember.run(() => $('.ember-power-select-option:eq(1)').mouseup());
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').attr('placeholder'), '', 'The placeholder is gone');
});

skip('If the placeholder is null the placeholders shouldn\'t be "null" (issue #94)', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select multiple=true options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal(this.$('.ember-power-select-trigger-multiple-input').attr('placeholder'), '', 'Input does not have a placeholder');
  clickTrigger();
  Ember.run(() => $('.ember-power-select-option:eq(1)').mouseup());
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').attr('placeholder'), '', 'Input still does not have a placeholder');
  Ember.run(() => this.$('.ember-power-select-multiple-remove-btn').mousedown());
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').attr('placeholder'), '', 'Input still does not have a placeholder');
});

skip('Selecting and removing should result in desired behavior', function(assert) {
  assert.expect(3);
  this.numbers = numbers;
  this.render(hbs`
    {{#power-select multiple=true options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  clickTrigger();
  Ember.run(() => $('.ember-power-select-option:eq(1)').mouseup());
  assert.equal(this.$('.ember-power-select-multiple-option').length, 1, 'Should add selected option');
  Ember.run(() => this.$('.ember-power-select-multiple-remove-btn').mousedown());
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').attr('placeholder'), '', 'Input still does not have a placeholder');
  assert.equal(this.$('.ember-power-select-multiple-option').length, 0, 'Should remove selected option');
});

skip('Typing in the input opens the component and filters the options', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select multiple=true options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  typeInSearch('fo');
  assert.equal($('.ember-power-select-option').length, 2, 'The dropdown is opened and results filtered');
});

skip('Typing in the input opens the component and filters the options also with async searches', function(assert) {
  assert.expect(1);

  this.search = (term) => {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() {
        resolve(numbers.filter(str => str.indexOf(term) > -1));
      }, 100);
    });
  };

  this.render(hbs`
    {{#power-select multiple=true selected=foo onchange=(action (mut foo)) search=(action search) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  typeInSearch('fo');
  let done = assert.async();

  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, 2, 'The dropdown is opened and results filtered');
    done();
  }, 150);
});

skip('When passed `disabled=true`, the input inside the trigger is also disabled', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select multiple=true options=numbers selected=foo onchange=(action (mut foo)) disabled=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.ok(this.$('.ember-power-select-trigger-multiple-input').prop('disabled'), 'The input is disabled');
});

skip('When passed `disabled=true`, the input inside the trigger is also disabled', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.selectedNumbers = [numbers[2], numbers[4]];

  this.render(hbs`
    {{#power-select multiple=true selected=selectedNumbers onchange=(action (mut foo)) options=numbers disabled=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal(this.$('.ember-power-select-multiple-remove-btn').length, 0, 'There is no button to remove selected elements');
});

skip('The search term is yielded as second argument in single selects', function(assert) {
  assert.expect(2);
  this.numbers = numbers;
  this.render(hbs`
    {{#power-select multiple=true options=numbers selected=foo onchange=(action (mut foo)) as |option term|}}
      {{term}}:{{option}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('tw');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'tw:two');
  Ember.run(() => $('.ember-power-select-option:eq(0)').mouseup());
  clickTrigger();
  typeInSearch('thr');
  assert.ok(/thr:two/.test($('.ember-power-select-trigger').text().trim()), 'The trigger also receives the search term');
});
