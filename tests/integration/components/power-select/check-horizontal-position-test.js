import { moduleForComponent, test } from 'ember-qunit';
import { clickTrigger } from '../../../helpers/ember-power-select';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (horizontalPosition)', {
  integration: true
});

test('check horizontal position specifying `right`', function(assert) {
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

test('check horizontal position without specify any property', function(assert) {
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
