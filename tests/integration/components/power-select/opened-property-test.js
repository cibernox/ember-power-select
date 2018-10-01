import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { numbers } from '../constants';

module('Integration | Component | Ember Power Select (The opened property)', function(hooks) {
  setupRenderingTest(hooks);

  test('the select can be rendered already opened by passing `initiallyOpened=true`', async function(assert) {
    assert.expect(1);

    this.numbers = numbers;
    await render(hbs`
      {{#power-select options=numbers onchange=(action (mut foo)) initiallyOpened=true as |option|}}
        {{option}}
      {{/power-select}}
    `);

    assert.dom('.ember-power-select-dropdown').exists('Dropdown is opened');
  });
});
