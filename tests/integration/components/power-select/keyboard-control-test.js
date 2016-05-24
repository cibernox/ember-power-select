import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { triggerKeydown, clickTrigger, typeInSearch } from '../../../helpers/ember-power-select';
import { numbers, countries } from '../constants';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Keyboard control)', {
  integration: true
});

test('Pressing keydown highlights the next option', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'one');
  triggerKeydown($('.ember-power-select-search-input')[0], 40);
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'two', 'The next options is highlighted now');
});

test('Pressing keyup highlights the previous option', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected="three" onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'three');
  triggerKeydown($('.ember-power-select-search-input')[0], 38);
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'two', 'The previous options is highlighted now');
});

test('When you the last option is highlighted, pressing keydown doesn\'t change the highlighted', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.lastNumber = numbers[numbers.length - 1];
  this.render(hbs`
    {{#power-select options=numbers selected=lastNumber onchange=(action (mut lastNumber)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'twenty');
  triggerKeydown($('.ember-power-select-search-input')[0], 40);
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'twenty', 'The last option is still the highlighted one');
});

test('When you the first option is highlighted, pressing keyup doesn\'t change the highlighted', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.firstNumber = numbers[0];
  this.render(hbs`
    {{#power-select options=numbers selected=firstNumber onchange=(action (mut firstNumber)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'one');
  triggerKeydown($('.ember-power-select-search-input')[0], 38);
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'one', 'The first option is still the highlighted one');
});

test('The arrow keys also scroll the list if the new highlighted element if it is outside of the viewport of the list', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected="seven" onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'seven');
  assert.equal($('.ember-power-select-options')[0].scrollTop, 0, 'The list is not scrolled');
  triggerKeydown($('.ember-power-select-search-input')[0], 40);
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'eight', 'The next option is highlighted now');
  assert.ok($('.ember-power-select-options')[0].scrollTop > 0, 'The list has scrolled');
});

test('Pressing ENTER selects the highlighted element, closes the dropdown and focuses the trigger', function(assert) {
  assert.expect(5);

  this.numbers = numbers;
  this.changed = (val, dropdown) => {
    assert.equal(val, 'two', 'The onchange action is triggered with the selected value');
    this.set('selected', val);
    assert.ok(dropdown.actions.close, 'The action receives the dropdown as second argument');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action changed) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  triggerKeydown($('.ember-power-select-search-input')[0], 40);
  triggerKeydown($('.ember-power-select-search-input')[0], 13);
  assert.equal($('.ember-power-select-trigger').text().trim(), 'two', 'The highlighted element was selected');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The dropdown is closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigger is focused');
});

test('Pressing ENTER on a single select with search disabled selects the highlighted element, closes the dropdown and focuses the trigger', function(assert) {
  assert.expect(5);

  this.numbers = numbers;
  this.changed = (val, dropdown) => {
    assert.equal(val, 'two', 'The onchange action is triggered with the selected value');
    this.set('selected', val);
    assert.ok(dropdown.actions.close, 'The action receives the dropdown as second argument');
  };

  this.render(hbs`
    {{#power-select searchEnabled=false options=numbers selected=selected onchange=(action changed) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  triggerKeydown($('.ember-power-select-trigger')[0], 40);
  triggerKeydown($('.ember-power-select-trigger')[0], 13);
  assert.equal($('.ember-power-select-trigger').text().trim(), 'two', 'The highlighted element was selected');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The dropdown is closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigger is focused');
});

test('Pressing ENTER when there is no highlighted element, closes the dropdown and focuses the trigger without calling the onchange function', function(assert) {
  assert.expect(3);
  this.numbers = numbers;
  this.handleChange = () => {
    assert.ok(false, 'The handle change should not be called');
  };
  this.render(hbs`
    {{#power-select options=numbers selected=foo onchange=(action handleChange) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  typeInSearch('asjdnah');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'No results found');
  triggerKeydown($('.ember-power-select-search-input')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The dropdown is closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigger is focused');
});

test('Pressing SPACE selects the highlighted element, closes the dropdown and focuses the trigger', function(assert) {
  assert.expect(5);

  this.numbers = numbers;
  this.changed = (val, dropdown) => {
    assert.equal(val, 'two', 'The onchange action is triggered with the selected value');
    this.set('selected', val);
    assert.ok(dropdown.actions.close, 'The action receives the dropdown as second argument');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action changed) searchEnabled=false as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  triggerKeydown($('.ember-power-select-trigger')[0], 40);
  triggerKeydown($('.ember-power-select-trigger')[0], 32); // Space
  assert.equal($('.ember-power-select-trigger').text().trim(), 'two', 'The highlighted element was selected');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The dropdown is closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigger is focused');
});

test('Pressing TAB closes the select WITHOUT selecting the highlighed element and focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  triggerKeydown($('.ember-power-select-search-input')[0], 40);
  triggerKeydown($('.ember-power-select-search-input')[0], 9);
  assert.equal($('.ember-power-select-trigger').text().trim(), '', 'The highlighted element wasn\'t selected');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The dropdown is closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigges is focused');
});

test('The component is focusable using the TAB key as any other kind of input', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  assert.equal(this.$('.ember-power-select-trigger').attr('tabindex'), "0", 'The trigger is reachable with TAB');
});

test('If the component is focused, pressing ENTER toggles it', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) searchEnabled=false as |option|}}
      {{option}}
    {{/power-select}}
  `);

  Ember.run(() => $('.ember-power-select-trigger').focus());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  triggerKeydown($('.ember-power-select-trigger')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  triggerKeydown($('.ember-power-select-trigger')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed again');
});

test('If the single component is focused, pressing SPACE toggles it', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) searchEnabled=false as |option|}}
      {{option}}
    {{/power-select}}
  `);

  Ember.run(() => $('.ember-power-select-trigger').focus());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  triggerKeydown($('.ember-power-select-trigger')[0], 32);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  triggerKeydown($('.ember-power-select-trigger')[0], 32);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed again');
});

test('If the single component is focused, pressing KEYDOWN opens it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  Ember.run(() => $('.ember-power-select-trigger').focus());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  triggerKeydown($('.ember-power-select-trigger')[0], 40);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
});

test('If the single component is focused, pressing KEYUP opens it', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  Ember.run(() => $('.ember-power-select-trigger').focus());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  triggerKeydown($('.ember-power-select-trigger')[0], 38);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
});

test('Pressing ESC while the component is opened closes it and focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  triggerKeydown($('.ember-power-select-trigger')[0], 27);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The select is focused');
});

test('In single-mode, when the user presses a key being the search input focused the passes `onkeydown` action is invoked with the public API and the event', function(assert) {
  assert.expect(9);

  this.numbers = numbers;
  this.selected = null;
  this.handleKeydown = (select, e) => {
    assert.ok(select.hasOwnProperty('isOpen'), 'The yieded object has the `isOpen` key');
    assert.ok(select.actions.open, 'The yieded object has an `actions.open` key');
    assert.ok(select.actions.close, 'The yieded object has an `actions.close` key');
    assert.ok(select.actions.select, 'The yieded object has an `actions.select` key');
    assert.ok(select.actions.highlight, 'The yieded object has an `actions.highlight` key');
    assert.ok(select.actions.search, 'The yieded object has an `actions.search` key');
    assert.equal(e.keyCode, 13, 'The event is received as second argument');
  };

  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut foo)) onkeydown=(action handleKeydown) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  triggerKeydown($('.ember-power-select-search-input')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
});

test('in single-mode if the users calls preventDefault on the event received in the `onkeydown` action it prevents the component to do the usual thing', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.selected = null;
  this.handleKeydown = (select, e) => {
    e.preventDefault();
  };

  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut foo)) onkeydown=(action handleKeydown) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  triggerKeydown($('.ember-power-select-search-input')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is still opened');
});

test('In multiple-mode, when the user presses a key being the search input focused the passes `onkeydown` action is invoked with the public API and the event', function(assert) {
  assert.expect(9);

  this.numbers = numbers;
  this.selectedNumbers = [];
  this.handleKeydown = (select, e) => {
    assert.ok(select.hasOwnProperty('isOpen'), 'The yieded object has the `isOpen` key');
    assert.ok(select.actions.open, 'The yieded object has an `actions.open` key');
    assert.ok(select.actions.close, 'The yieded object has an `actions.close` key');
    assert.ok(select.actions.select, 'The yieded object has an `actions.select` key');
    assert.ok(select.actions.highlight, 'The yieded object has an `actions.highlight` key');
    assert.ok(select.actions.search, 'The yieded object has an `actions.search` key');
    assert.equal(e.keyCode, 13, 'The event is received as second argument');
  };

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=selectedNumbers onchange=(action (mut foo)) onkeydown=(action handleKeydown) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  triggerKeydown($('.ember-power-select-trigger-multiple-input')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
});

test('in multiple-mode if the users calls preventDefault on the event received in the `onkeydown` action it prevents the component to do the usual thing', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.selectedNumbers = [];
  this.handleKeydown = () => false;

  this.render(hbs`
    {{#power-select-multiple options=numbers selected=selectedNumbers onchange=(action (mut foo)) onkeydown=(action handleKeydown) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  triggerKeydown($('.ember-power-select-trigger-multiple-input')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is still opened');
});

test('Typing on a closed single select selects the value that matches the string typed so far', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  let trigger = this.$('.ember-power-select-trigger')[0];
  trigger.focus();
  assert.equal($('.ember-power-select-dropdown').length, 0,  'The dropdown is closed');
  triggerKeydown(trigger, 78); // n
  triggerKeydown(trigger, 73); // i
  triggerKeydown(trigger, 78); // n
  assert.equal(trigger.textContent.trim(), 'nine', '"nine" has been selected');
  assert.equal($('.ember-power-select-dropdown').length, 0,  'The dropdown is still closed');
});

//
// I'm actually not sure what multiple selects closed should do when typing on them.
// For now they just do nothing
//
// test('Typing on a closed multiple select with no searchbox does nothing', function(assert) {
// });

test('Typing on a opened single select highlights the value that matches the string typed so far, scrolling if needed', function(assert) {
  assert.expect(6);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  let trigger = this.$('.ember-power-select-trigger')[0];
  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1,  'The dropdown is open');
  assert.equal($('.ember-power-select-options')[0].scrollTop, 0, 'The list is not scrolled');
  triggerKeydown(trigger, 78); // n
  triggerKeydown(trigger, 73); // i
  triggerKeydown(trigger, 78); // n
  assert.equal(trigger.textContent.trim(), '', 'nothing has been selected');
  assert.equal($('.ember-power-select-option[aria-current=true]').text().trim(), 'nine', 'The option containing "nine" has been highlighted');
  assert.ok($('.ember-power-select-options')[0].scrollTop > 0, 'The list has scrolled');
  assert.equal($('.ember-power-select-dropdown').length, 1,  'The dropdown is still closed');
});

test('Typing on a opened multiple select highlights the value that matches the string typed so far, scrolling if needed', function(assert) {
  assert.expect(6);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  let trigger = this.$('.ember-power-select-trigger')[0];
  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1,  'The dropdown is open');
  assert.equal($('.ember-power-select-options')[0].scrollTop, 0, 'The list is not scrolled');
  triggerKeydown(trigger, 78); // n
  triggerKeydown(trigger, 73); // i
  triggerKeydown(trigger, 78); // n
  assert.equal(trigger.textContent.trim(), '', 'nothing has been selected');
  assert.equal($('.ember-power-select-option[aria-current=true]').text().trim(), 'nine', 'The option containing "nine" has been highlighted');
  assert.ok($('.ember-power-select-options')[0].scrollTop > 0, 'The list has scrolled');
  assert.equal($('.ember-power-select-dropdown').length, 1,  'The dropdown is still closed');
});

test('The typed string gets reset after 1s idle', function(assert) {
  let done = assert.async();
  assert.expect(5);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  let trigger = this.$('.ember-power-select-trigger')[0];
  trigger.focus();
  assert.equal($('.ember-power-select-dropdown').length, 0,  'The dropdown is closed');
  triggerKeydown(trigger, 84); // t
  triggerKeydown(trigger, 87); // w
  assert.equal(trigger.textContent.trim(), 'two', '"two" has been selected');
  assert.equal($('.ember-power-select-dropdown').length, 0,  'The dropdown is still closed');
  setTimeout(function() {
    triggerKeydown(trigger, 79); // o
    assert.equal(trigger.textContent.trim(), 'one', '"one" has been selected, instead of "two", because the typing started over');
    assert.equal($('.ember-power-select-dropdown').length, 0,  'The dropdown is still closed');
    done();
  }, 1100);
});

test('Type something that doesn\'t give you any result leaves the current selection', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  let trigger = this.$('.ember-power-select-trigger')[0];
  trigger.focus();
  assert.equal(trigger.textContent.trim(), '', 'nothing is selected');
  triggerKeydown(trigger, 78); // n
  triggerKeydown(trigger, 73); // i
  triggerKeydown(trigger, 78); // n
  triggerKeydown(trigger, 69); // e
  assert.equal(trigger.textContent.trim(), 'nine', 'nine has been selected');
  triggerKeydown(trigger, 87); // w
  assert.equal(trigger.textContent.trim(), 'nine', 'nine is still selected because "ninew" gave no results');
});

test('Typing on a opened single select highlights the value that matches the string, also when the options are complex, using the `searchField` for that', function(assert) {
  assert.expect(4);

  this.countries = countries;
  this.render(hbs`
    {{#power-select options=countries selected=selected onchange=(action (mut selected)) searchField="name" as |country|}}
      {{country.name}}
    {{/power-select}}
  `);

  let trigger = this.$('.ember-power-select-trigger')[0];
  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 1,  'The dropdown is open');
  triggerKeydown(trigger, 80); // p
  triggerKeydown(trigger, 79); // o
  assert.equal(trigger.textContent.trim(), '', 'nothing has been selected');
  assert.equal($('.ember-power-select-option[aria-current=true]').text().trim(), 'Portugal', 'The option containing "Portugal" has been highlighted');
  assert.equal($('.ember-power-select-dropdown').length, 1,  'The dropdown is still closed');
});