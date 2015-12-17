import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { triggerKeydown, clickTrigger } from '../../../helpers/ember-power-select';
import { numbers, countriesWithDisabled } from '../constants';

/**
9 - Disabled select/options
*/

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

  let $select = this.$('.ember-power-select');
  assert.ok($select.hasClass('ember-basic-dropdown--disabled'), 'The select has the disabled class');
  clickTrigger();
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is still closed');
  triggerKeydown($('.ember-power-select-trigger')[0], 13);
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is still closed');
});

test('A disabled dropdown is not focusable', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers disabled=true onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal(this.$('.ember-power-select-trigger').attr('tabindex'), "-1", 'The trigger is not reachable with TAB');
});

test('Options with a disabled field set to true are styled as disabled', function(assert) {
  assert.expect(2);

  this.countriesWithDisabled = countriesWithDisabled;
  this.render(hbs`
    {{#power-select options=countriesWithDisabled onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option').length, 7, 'There is 7 options');
  assert.equal($('.ember-power-select-option--disabled').length, 3, 'Three of them are disabled');
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
  Ember.run(() => $('.ember-power-select-option--disabled:eq(0)').trigger('mouseover'));
  assert.ok(!$('.ember-power-select-option--disabled:eq(0)').hasClass('ember-power-select-option--highlighted'), 'The hovered option was not highlighted because it\'s disabled');
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
  assert.ok($('.ember-power-select-option--highlighted').text().trim(), 'LV: Latvia' ,'The hovered option was not highlighted because it\'s disabled');
});
