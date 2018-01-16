import { moduleForComponent, test } from 'ember-qunit';
import { find } from 'ember-native-dom-helpers';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('power-select/caret', 'Integration | Component | power select/caret', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{power-select/caret}}`);
  assert.ok(find('.ember-power-select-caret > .ember-power-select-status-icon'), 'the caret is correctly rendered');
});
