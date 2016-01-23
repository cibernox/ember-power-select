import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
// import { clickTrigger } from '../../../helpers/ember-power-select';

moduleForComponent('power-select', 'Integration | Component | Ember Power Select (Accessibility)', {
  integration: true
});

test('The aria-labelledby property can be set', function(assert) {
  assert.expect(1);
  this.render(hbs`
    {{#power-select ariaLabelledBy="foo123" onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  assert.equal($('.ember-power-select-trigger').attr('aria-labelledby'), 'foo123');
});

test('The aria-describedby property can be set', function(assert) {
  assert.expect(1);
  this.render(hbs`
    {{#power-select ariaDescribedBy="foo123" onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  assert.equal($('.ember-power-select-trigger').attr('aria-describedBy'), 'foo123');
});

test('The aria-required property can be set', function(assert) {
  assert.expect(1);
  this.render(hbs`
    {{#power-select ariaRequired=true onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  assert.equal($('.ember-power-select-trigger').attr('aria-required'), 'true');
});

test('The aria-invalid property can be set', function(assert) {
  assert.expect(1);
  this.render(hbs`
    {{#power-select ariaInvalid=true onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  assert.equal($('.ember-power-select-trigger').attr('aria-invalid'), 'true');
});
