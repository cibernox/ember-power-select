import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { numbers } from '../constants';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (The opened property)', {
  integration: true
});

test('the select can be rendered already opened by passing `opened=true`', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) opened=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is opened');
});

test('It can be opened and closed by toggling the `opened` property', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.opened = false;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) opened=opened as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is closed');
  Ember.run(() => this.set('opened', true));
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is opened');
  Ember.run(() => this.set('opened', false));
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is closed again');
});

test('when it is opened/closed and the `opened` property is multable, it gets updated', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.opened = false;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) opened=opened as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.ok(!this.get('opened'), 'The opened property is false');
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.ok(this.get('opened'), 'The opened property is true now');
});