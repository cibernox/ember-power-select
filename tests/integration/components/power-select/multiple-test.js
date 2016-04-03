import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { typeInSearch, triggerKeydown, clickTrigger, nativeMouseDown, nativeMouseUp } from '../../../helpers/ember-power-select';
import { numbers, countries } from '../constants';

const { RSVP } = Ember;

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Multiple)', {
  integration: true
});

test('Multiple selects don\'t have a search box', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-search').length, 0, 'There is no search box');
});

test('When the select opens, the search input in the trigger gets the focus', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.ok($('.ember-power-select-trigger-multiple-input').get(0) === document.activeElement, 'The search input is focused');
});

test('Click on an element selects it and closes the dropdown and focuses the trigger\'s input', function(assert) {
  assert.expect(5);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.ok(this.$('.ember-power-select-trigger-multiple-input').get(0) === document.activeElement, 'The input of the trigger is focused');
  nativeMouseUp('.ember-power-select-option:eq(1)');
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
    {{#power-select-multiple options=numbers onchange=change as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  nativeMouseUp('.ember-power-select-option:eq(1)');
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
    {{#power-select-multiple options=numbers selected=selectedNumbers onchange=change as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  assert.equal($('.ember-power-select-multiple-option').length, 1, 'There is 1 option selected');
  clickTrigger();
  nativeMouseUp('.ember-power-select-option:eq(1)');
  assert.equal($('.ember-power-select-multiple-option').length, 2, 'There is 2 options selected');
  assert.ok(/four/.test($('.ember-power-select-multiple-option:eq(0)').text()), 'The first option is the provided one');
  assert.ok(/two/.test($('.ember-power-select-multiple-option:eq(1)').text()), 'The second option is the one just selected');
});

test('If there is many selections, all those options are styled as `selected`', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.selectedNumbers = ['four', 'two'];

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=selectedNumbers onchange=(action (mut selectedNumbers)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option:eq(1)').attr('aria-selected'), 'true', 'The second option is styled as selected');
  assert.equal($('.ember-power-select-option:eq(3)').attr('aria-selected'), 'true', 'The 4th option is styled as selected');
});

test('When the popup opens, the first items is highlighed, even if there is only one selection', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.selectedNumbers = ['four'];

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=selectedNumbers onchange=(action (mut selectedNumbers)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').length, 1, 'There is one element highlighted');
  assert.equal($('.ember-power-select-option[aria-selected="true"]').length, 1, 'There is one element selected');
  assert.equal($('.ember-power-select-option[aria-current="true"][aria-selected="true"]').length, 0, 'They are not the same');
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'one', 'The highlighted element is the first one');
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
    {{#power-select-multiple options=numbers selected=selectedNumbers onchange=change as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  assert.equal($('.ember-power-select-multiple-option').length, 1, 'There is 1 option selected');
  clickTrigger();
  nativeMouseUp('.ember-power-select-option[aria-selected="true"]');
  assert.equal($('.ember-power-select-multiple-option').length, 0, 'There is no options selected');
});

test('The default filtering works in multiple mode', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  typeInSearch('four');
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
    {{#power-select-multiple options=people searchField="name" onchange=(action (mut foo)) as |person|}}
      {{person.name}} {{person.surname}}
    {{/power-select-multiple}}
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

test('The filtering specifying a custom matcher works in multiple model', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.endsWithMatcher = function(value, text) {
    return value.slice(text.length * -1) === text ? 0 : -1;
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers matcher=endsWithMatcher onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  typeInSearch('on');
  assert.equal($('.ember-power-select-option').text().trim(), "No results found", 'No number ends in "on"');
  typeInSearch('teen');
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
    {{#power-select-multiple search=searchFn onchange=(action (mut foo)) as |number|}}
      {{number}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  typeInSearch("teen");

  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, 7);
    done();
  }, 150);
});

test('Pressing ENTER when the select is closed opens and nothing is written on the box opens it', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 27);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');
  assert.ok($('.ember-power-select-trigger-multiple-input').get(0) === document.activeElement, 'The trigger is focused');
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
});

test('Pressing ENTER on a multiple select with `searchEnabled=false` when it is closed opens it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple searchEnabled=false options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  let trigger = this.$('.ember-power-select-trigger')[0];
  trigger.focus();
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');
  triggerKeydown(trigger, 13);
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
    {{#power-select-multiple options=numbers selected=foo onchange=change as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 40);
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 13);
  assert.ok(/two/.test($('.ember-power-select-trigger').text().trim()), 'The element was selected');
});

test('Pressing ENTER over a highlighted element on a multiple select with `searchEnabled=false` selects it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple searchEnabled=false options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
  let trigger = this.$('.ember-power-select-trigger')[0];
  triggerKeydown(trigger, 40);
  triggerKeydown(trigger, 13);
  assert.ok(/two/.test($('.ember-power-select-trigger').text().trim()), 'The element was selected');
});

test('Pressing ENTER over a highlighted element on a select with `searchEnabled=false` selects it', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.change = (selected) => {
    assert.deepEqual(selected, ['two']);
    this.set('foo', selected);
  };
  this.render(hbs`
    {{#power-select-multiple searchEnabled=false options=numbers selected=foo onchange=change as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal(this.$('.ember-power-select-multiple-option').length, 0, 'There is no elements selected');
  let trigger = this.$('.ember-power-select-trigger')[0];
  triggerKeydown(trigger, 40);
  triggerKeydown(trigger, 13);
  assert.equal(this.$('.ember-power-select-multiple-option').length, 1, 'There is one element selected');
  assert.ok(/two/.test($('.ember-power-select-trigger').text().trim()), 'The element is "two"');
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
    {{#power-select-multiple options=numbers selected=selected onchange=didChange as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 40);
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 13);
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
    {{#power-select-multiple options=numbers selected=selected onchange=didChange as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  typeInSearch('four');
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 8);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The dropown is still opened');
});

test('Pressing BACKSPACE on the search input when it\'s empty removes the last selection and performs a search for that text immediatly, opening the select if closed', function(assert) {
  assert.expect(9);

  this.numbers = numbers;
  this.selected = ['two'];
  this.didChange = (val, dropdown) => {
    assert.deepEqual(val, [], 'The selected item was unselected');
    this.set('selected', val);
    assert.ok(dropdown.actions.close, 'The dropdown API is received as second argument');
  };
  this.render(hbs`
    {{#power-select-multiple options=numbers onchange=didChange selected=selected as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  let input = this.$('.ember-power-select-trigger-multiple-input')[0];
  assert.equal(this.$('.ember-power-select-multiple-option').length, 1, 'There is one element selected');
  triggerKeydown(input, 8);
  assert.equal(this.$('.ember-power-select-multiple-option').length, 0, 'There is no elements selected');
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').val(), 'two', 'The text of the seach input is two now');
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The dropown has been opened');
  assert.equal($('.ember-power-select-option').length, 1, 'The list has been filtered');
  assert.equal(input.selectionStart, 3);
  assert.equal(input.selectionEnd, 3);
});

test('Pressing BACKSPACE on the search input when it\'s empty removes the last selection and performs a search for that text immediatly (when options are not strings)', function(assert) {
  assert.expect(7);

  this.contries = countries;
  this.country = [countries[2], countries[4]];
  this.didChange = (val, dropdown) => {
    assert.deepEqual(val, [countries[2]], 'The selected item was unselected');
    this.set('country', val);
    assert.ok(dropdown.actions.close, 'The dropdown API is received as second argument');
  };
  this.render(hbs`
    {{#power-select-multiple options=contries selected=country onchange=didChange searchField="name" as |c|}}
      {{c.name}}
    {{/power-select-multiple}}
  `);
  clickTrigger();
  assert.equal(this.$('.ember-power-select-multiple-option').length, 2, 'There is two elements selected');
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 8);
  assert.equal(this.$('.ember-power-select-multiple-option').length, 1, 'There is one element selected');
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').val(), 'Latvia', 'The text of the seach input is two "Latvia"');
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The dropown is still opened');
  assert.equal($('.ember-power-select-option').length, 1, 'The list has been filtered');
});

test('Pressing BACKSPACE on the search input when it\'s empty removes the last selection ALSO when that option didn\'t come from the outside', function(assert) {
  assert.expect(5);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  nativeMouseUp('.ember-power-select-option:eq(2)');
  clickTrigger();
  assert.equal(this.$('.ember-power-select-multiple-option').length, 1, 'There is one element selected');
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 8);
  assert.equal(this.$('.ember-power-select-multiple-option').length, 0, 'There is no elements selected');
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').val(), 'three', 'The text of the seach input is three now');
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The dropown is still opened');
  assert.equal($('.ember-power-select-option').length, 1, 'The list has been filtered');
});

test('If the multiple component is focused, pressing KEYDOWN opens it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 27);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 40);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
});

test('If the multiple component is focused, pressing KEYUP opens it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 27);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 38);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
});

test('The placeholder is only visible when no options are selected', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) placeholder="Select stuff here" as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  assert.equal(this.$('.ember-power-select-trigger-multiple-input').attr('placeholder'), 'Select stuff here', 'There is a placeholder');
  clickTrigger();
  nativeMouseUp('.ember-power-select-option:eq(1)');
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').attr('placeholder'), '', 'The placeholder is gone');
});

test('If the placeholder is null the placeholders shouldn\'t be "null" (issue #94)', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  assert.equal(this.$('.ember-power-select-trigger-multiple-input').attr('placeholder'), '', 'Input does not have a placeholder');
  clickTrigger();
  nativeMouseUp('.ember-power-select-option:eq(1)');
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').attr('placeholder'), '', 'Input still does not have a placeholder');
  nativeMouseDown('.ember-power-select-multiple-remove-btn');
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').attr('placeholder'), '', 'Input still does not have a placeholder');
});

test('Selecting and removing should result in desired behavior', function(assert) {
  assert.expect(3);
  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);
  clickTrigger();
  nativeMouseUp('.ember-power-select-option:eq(1)');
  assert.equal(this.$('.ember-power-select-multiple-option').length, 1, 'Should add selected option');
  nativeMouseDown('.ember-power-select-multiple-remove-btn');
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').attr('placeholder'), '', 'Input still does not have a placeholder');
  assert.equal(this.$('.ember-power-select-multiple-option').length, 0, 'Should remove selected option');
});

test('Selecting and removing can also be done with touch events', function(assert) {
  assert.expect(3);
  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);
  clickTrigger();
  nativeMouseUp('.ember-power-select-option:eq(1)');
  assert.equal(this.$('.ember-power-select-multiple-option').length, 1, 'Should add selected option');
  Ember.run(() => {
    let event = new window.Event('touchstart', { bubbles: true, cancelable: true, view: window });
    Ember.$('.ember-power-select-multiple-remove-btn')[0].dispatchEvent(event);
  });
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').attr('placeholder'), '', 'Input still does not have a placeholder');
  assert.equal(this.$('.ember-power-select-multiple-option').length, 0, 'Should remove selected option');
});

test('Typing in the input opens the component and filters the options', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  typeInSearch('fo');
  assert.equal($('.ember-power-select-option').length, 2, 'The dropdown is opened and results filtered');
});

test('Typing in the input opens the component and filters the options also with async searches', function(assert) {
  assert.expect(1);

  this.search = (term) => {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() {
        resolve(numbers.filter(str => str.indexOf(term) > -1));
      }, 100);
    });
  };

  this.render(hbs`
    {{#power-select-multiple selected=foo onchange=(action (mut foo)) search=(action search) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  typeInSearch('fo');
  let done = assert.async();

  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, 2, 'The dropdown is opened and results filtered');
    done();
  }, 150);
});

test('The search term is yielded as second argument in multiple selects', function(assert) {
  assert.expect(2);
  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option term|}}
      {{term}}:{{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  typeInSearch('tw');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'tw:two');
  nativeMouseUp('.ember-power-select-option:eq(0)');
  clickTrigger();
  typeInSearch('thr');
  assert.ok(/thr:two/.test($('.ember-power-select-trigger').text().trim()), 'The trigger also receives the search term');
});

test('The search input is cleared when the component is closed', function(assert) {
  assert.expect(3);
  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
    <div id="other-thing">Other div</div>
  `);

  clickTrigger();
  typeInSearch('asjdnah');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'No results found');
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').val(), 'asjdnah');
  Ember.run(() => {
    let event = new window.Event('mousedown');
    this.$('#other-thing')[0].dispatchEvent(event);
  });
  assert.equal(this.$('.ember-power-select-trigger-multiple-input').val(), '');
});

test('When hitting ENTER after a search with no results, the component is closed but the onchange function is not invoked', function(assert) {
  assert.expect(3);
  this.numbers = numbers;
  this.handleChange = () => {
    assert.ok(false, 'The handle change should not be called');
  };
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action handleChange) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  typeInSearch('asjdnah');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'No results found');
  triggerKeydown(this.$('.ember-power-select-trigger-multiple-input')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The dropdown is closed');
  assert.ok(this.$('.ember-power-select-trigger-multiple-input')[0] === document.activeElement, 'The input is focused');
});

test('The trigger of multiple selects have a special class to distinguish them from regular ones, even if you pass them another one', function(assert) {
  assert.expect(2);
  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers triggerClass="foobar-trigger" selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  assert.ok(this.$('.ember-power-select-trigger').hasClass('ember-power-select-multiple-trigger'), 'The trigger has the default class');
  assert.ok(this.$('.ember-power-select-trigger').hasClass('foobar-trigger'), 'The trigger has the given class');
});

test('The component works when the array of selected elements is mutated in place instead of replaced', function(assert) {
  assert.expect(1);
  this.numbers = numbers;
  this.selected = Ember.A();
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);
  clickTrigger();
  Ember.run(() => this.get('selected').pushObject(numbers[3]));
  nativeMouseUp('.ember-power-select-option:eq(0)');
  assert.equal(this.$('.ember-power-select-multiple-option').length, 2, 'Two elements are selected');
});

test('When the input inside the multiple select gets focused the entire component gains the `ember-basic-dropdown--focus-inside` class', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  assert.ok(!this.$('.ember-power-select').hasClass('ember-basic-dropdown--focus-inside'), 'The select doesn\'t have the class yet');
  clickTrigger();
  assert.ok(this.$('.ember-power-select').hasClass('ember-basic-dropdown--focus-inside'), 'The select has the class now');
});
