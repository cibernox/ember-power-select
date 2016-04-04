import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { triggerKeydown, clickTrigger, typeInSearch } from '../../../helpers/ember-power-select';
import { numbers, countriesWithDisabled } from '../constants';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Disabled)', {
  integration: true
});

test('A disabled dropdown doesn\'t responds to mouse/keyboard events', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers disabled=true onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  let $trigger = this.$('.ember-power-select-trigger');
  assert.ok($trigger.attr('aria-disabled'), 'true', 'The trigger has `aria-disabled=true`');
  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is still closed');
  triggerKeydown($('.ember-power-select-trigger')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is still closed');
});

test('A disabled dropdown is not focusable, and ignores the passed tabindex ', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers tabindex="123" disabled=true onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  assert.equal(this.$('.ember-power-select-trigger').attr('tabindex'), undefined, 'The trigger has no tabindex so it can\'t be focused');
});

test('Disabled options are not highlighted when hovered with the mouse', function(assert) {
  assert.expect(1);

  this.countriesWithDisabled = countriesWithDisabled;
  this.render(hbs`
    {{#power-select options=countriesWithDisabled onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/power-select}}
  `);

  clickTrigger();
  Ember.run(() => $('.ember-power-select-option[aria-disabled="true"]:eq(0)').trigger('mouseover'));
  assert.equal($('.ember-power-select-option[aria-disabled="true"]:eq(0)').attr('aria-current'), 'false', 'The hovered option was not highlighted because it\'s disabled');
});

test('Disabled options are skipped when highlighting items with the keyboard', function(assert) {
  assert.expect(1);

  this.countriesWithDisabled = countriesWithDisabled;
  this.render(hbs`
    {{#power-select options=countriesWithDisabled onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/power-select}}
  `);

  clickTrigger();
  triggerKeydown($('.ember-power-select-search input')[0], 40);
  triggerKeydown($('.ember-power-select-search input')[0], 40);
  assert.ok($('.ember-power-select-option[aria-current="true"]').text().trim(), 'LV: Latvia' ,'The hovered option was not highlighted because it\'s disabled');
});

test('When passed `disabled=true`, the input inside the trigger is also disabled', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=foo onchange=(action (mut foo)) disabled=true as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  assert.ok(this.$('.ember-power-select-trigger-multiple-input').prop('disabled'), 'The input is disabled');
});

test('When passed `disabled=true`, the options cannot be removed', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.selectedNumbers = [numbers[2], numbers[4]];

  this.render(hbs`
    {{#power-select-multiple selected=selectedNumbers onchange=(action (mut foo)) options=numbers disabled=true as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  assert.equal(this.$('.ember-power-select-multiple-remove-btn').length, 0, 'There is no button to remove selected elements');
});

test('BUGFIX: When after a search the only result is a disabled element, it isn\'t highlighted and cannot be selected', function(assert) {
  assert.expect(3);
  this.countriesWithDisabled = countriesWithDisabled;

  this.render(hbs`
   {{#power-select options=countriesWithDisabled searchField='name' selected=foo onchange=(action (mut foo)) as |country|}}
     {{country.name}}
   {{/power-select}}
  `);

  clickTrigger();
  typeInSearch("Br");
  assert.equal($('.ember-power-select-option[aria-current="true"]').length, 0, 'Nothing is highlighted');
  triggerKeydown($('.ember-power-select-trigger')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.equal($('.ember-power-select-trigger').text().trim(), '', 'Nothing was selected');
});

test('BUGFIX: When after a search there is two results and the first one is a disabled element, the second one is highlighted', function(assert) {
  assert.expect(4);
  this.countriesWithDisabled = countriesWithDisabled;

  this.render(hbs`
   {{#power-select options=countriesWithDisabled searchField='name' selected=foo onchange=(action (mut foo)) as |country|}}
     {{country.name}}
   {{/power-select}}
  `);

  clickTrigger();
  typeInSearch("o"); // Finds ["Portugal", "United Kingdom"]
  assert.equal($('.ember-power-select-option').length, 2, 'There is two results');
  assert.equal($('.ember-power-select-option[aria-disabled="true"]').length, 1, 'One is disabled');
  assert.equal($('.ember-power-select-option[aria-current="true"]').length, 1, 'One element is highlighted');
  assert.equal($('.ember-power-select-option[aria-current="true"]').text().trim(), 'United Kingdom', 'The first non-disabled element is highlighted');
});

test('BUGFIX: When searching by pressing keys on a focused & closed select, disabled options are ignored', function(assert) {
  assert.expect(3);
  this.countriesWithDisabled = countriesWithDisabled;

  this.render(hbs`
   {{#power-select options=countriesWithDisabled searchField='name' selected=foo onchange=(action (mut foo)) as |country|}}
     {{country.name}}
   {{/power-select}}
  `);

  let trigger = this.$('.ember-power-select-trigger')[0];
  trigger.focus();
  assert.equal($('.ember-power-select-dropdown').length, 0,  'The dropdown is closed');
  triggerKeydown(trigger, 79); // o
  assert.equal($('.ember-power-select-dropdown').length, 0,  'The dropdown is still closed');
  assert.equal(trigger.textContent.trim(), 'United Kingdom', '"United Kingdom" has been selected');
});