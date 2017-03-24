import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { numbers } from '../constants';
import { find } from 'ember-native-dom-helpers';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (The opened property)', {
  integration: true
});

test('the select can be rendered already opened by passing `initiallyOpened=true`', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) initiallyOpened=true as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.ok(find('.ember-power-select-dropdown'), 'Dropdown is opened');
});
