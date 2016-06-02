import { moduleForComponent, test } from 'ember-qunit';
import { clickTrigger } from '../../../helpers/ember-power-select';
import hbs from 'htmlbars-inline-precompile';
import { groupedNumbers } from '../constants';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (horizontalPosition)', {
  integration: true
});

// Those tests might fail in the browser because the qunit container breaks everything


test('check horizontal position specifying `right` (using power-select component)', function(assert) {
  assert.expect(4);

  this.render(hbs`
    {{#power-select horizontalPosition="right" onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-basic-dropdown-trigger--left').length, 0);
  assert.equal($('.ember-basic-dropdown-content--left').length, 0);
  assert.equal($('.ember-basic-dropdown-trigger--right').length, 1);
  assert.equal($('.ember-basic-dropdown-content--right').length, 1);
});

test('check horizontal position without specify property (using power-select component)', function(assert) {
  assert.expect(4);

  this.render(hbs`
    {{#power-select onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-basic-dropdown-trigger--left').length, 1);
  assert.equal($('.ember-basic-dropdown-content--left').length, 1);
  assert.equal($('.ember-basic-dropdown-trigger--right').length, 0);
  assert.equal($('.ember-basic-dropdown-content--right').length, 0);
});

test('check horizontal position without specify property (using power-select-multiple component)', function(assert) {
  assert.expect(4);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select-multiple options=groupedNumbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-basic-dropdown-trigger--left').length, 1);
  assert.equal($('.ember-basic-dropdown-content--left').length, 1);
  assert.equal($('.ember-basic-dropdown-trigger--right').length, 0);
  assert.equal($('.ember-basic-dropdown-content--right').length, 0);
});

test('check horizontal position with specify property (using power-select-multiple component)', function(assert) {
  assert.expect(4);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select-multiple options=groupedNumbers horizontalPosition="right" onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-basic-dropdown-trigger--left').length, 0);
  assert.equal($('.ember-basic-dropdown-content--left').length, 0);
  assert.equal($('.ember-basic-dropdown-trigger--right').length, 1);
  assert.equal($('.ember-basic-dropdown-content--right').length, 1);
});
