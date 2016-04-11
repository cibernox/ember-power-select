import { moduleForComponent, test } from 'ember-qunit';
import { clickTrigger } from '../../../helpers/ember-power-select';
import hbs from 'htmlbars-inline-precompile';
import { groupedNumbers } from '../constants';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (horizontalPosition)', {
  integration: true
});

test('check horizontal position specifying `right` (using power-select component)', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#power-select horizontalPosition="right" onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-basic-dropdown--left').length, 0);
  assert.equal($('.ember-basic-dropdown--right').length, 2);
});

test('check horizontal position without specify property (using power-select component)', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#power-select onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-basic-dropdown--right').length, 0);
  assert.equal($('.ember-basic-dropdown--left').length, 2);
});


test('check horizontal position without specify property (using power-select-multiple component)', function(assert) {
  assert.expect(2);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select-multiple options=groupedNumbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-basic-dropdown--right').length, 0);
  assert.equal($('.ember-basic-dropdown--left').length, 2);
});

test('check horizontal position with specify property (using power-select-multiple component)', function(assert) {
  assert.expect(2);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select-multiple options=groupedNumbers horizontalPosition="right" onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-basic-dropdown--right').length, 2);
  assert.equal($('.ember-basic-dropdown--left').length, 0);
});
