import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { optionAtIndex } from 'ember-power-select/utils/group-utils';
import { triggerKeydown, clickTrigger } from 'ember-power-select/test-support/helpers';
import { charCode, namesStartingWithA } from '../constants';
import { render, focus } from '@ember/test-helpers';

const WITH_EPS_CLOSED = {
  beforeInteraction(trigger, assert) {
    focus(trigger);
    assert.dom(trigger).hasText('', 'no value selected');
    assert.dom('.ember-power-select-dropdown').doesNotExist('The dropdown is closed');
  },

  checkSelectedValue(value, trigger, assert) {
    // -1 adjust the position for the implicit placeholder
    assert.dom(trigger).hasText(value);
    assert.dom('.ember-power-select-dropdown').doesNotExist('The dropdown is still closed');
  },

  valueAt(coll, _idx, isGrouped = false) {
    let idx = isGrouped ? _idx - 1 : (_idx - 1) % coll.length;
    return optionAtIndex(coll, idx).option;
  }
};

const WITH_EPS_OPEN = {
  beforeInteraction(trigger, assert) {
    clickTrigger();
    assert.dom('.ember-power-select-dropdown').exists('The dropdown is open');
  },

  checkSelectedValue(value, trigger, assert) {
    assert.dom(trigger).hasText('', 'nothing is selected');
    assert.dom('.ember-power-select-option[aria-current=true]').hasText(value);
    assert.dom('.ember-power-select-dropdown').exists('The dropdown is still open');
  },

  valueAt(coll, _idx, isGrouped = false) {
    let idx = isGrouped ? _idx : _idx % coll.length;
    return optionAtIndex(coll, idx).option;
  }
};

function typeString(trigger, str, times = 1) {
  for (let j = 0; j < times; j++) {
    for (let i = 0; i < str.length; i++) {
      triggerKeydown(trigger, charCode(str.charAt(i)));
    }
  }
}

module('Integration | Component | Ember Power Select (Type Ahead Native Behaviour)', function(hooks) {
  setupRenderingTest(hooks);

  [['Closed', WITH_EPS_CLOSED], ['Open', WITH_EPS_OPEN]].forEach(([state, helpers]) => {
    test(`(${state}) Repeating the first character cycles through the results`, async function(assert) {
      this.names = namesStartingWithA;
      await render(hbs`
      {{#power-select options=names onchange=(action (mut selected)) selected=selected searchEnabled=false as |option|}}
        {{option}}
      {{/power-select}}
    `);

      let trigger = this.element.querySelector('.ember-power-select-trigger');
      helpers.beforeInteraction(trigger, assert);
      typeString(trigger, 'aaa');
      helpers.checkSelectedValue(helpers.valueAt(this.names, 'aaa'.length), trigger, assert);
    });

    test(`(${state}) When going over all the possible results, it goes back to the first`, async function(assert) {
      this.names = namesStartingWithA;
      await render(hbs`
        {{#power-select options=names onchange=(action (mut selected)) selected=selected searchEnabled=false as |option|}}
          {{option}}
        {{/power-select}}
      `);

      let trigger = this.element.querySelector('.ember-power-select-trigger');
      helpers.beforeInteraction(trigger, assert);
      let { length } = namesStartingWithA;
      typeString(trigger, 'a', length + 1);
      helpers.checkSelectedValue(helpers.valueAt(this.names, length + 1), trigger, assert);
    });

    test(`(${state}) Though repeating the first char, the whole search term is remembered`, async function(assert) {
      this.names = namesStartingWithA;
      await render(hbs`
        {{#power-select options=names onchange=(action (mut selected)) selected=selected searchEnabled=false as |option|}}
          {{option}}
        {{/power-select}}
      `);

      let trigger = this.element.querySelector('.ember-power-select-trigger');
      helpers.beforeInteraction(trigger, assert);
      typeString(trigger, 'aa');
      helpers.checkSelectedValue(helpers.valueAt(this.names, 'aa'.length), trigger, assert);
      typeString(trigger, 'r');
      helpers.checkSelectedValue('Aaran', trigger, assert);
      assert.notEqual('Aaran', helpers.valueAt(this.names, 'aar'.length), 'Aaran would not be selected unless aa was remembered');
    });

    test(`(${state}) Typing the first character after typing a different one does not set again the cycling behaviour`, async function(assert) {
      this.names = namesStartingWithA;
      await render(hbs`
        {{#power-select options=names onchange=(action (mut selected)) selected=selected searchEnabled=false as |option|}}
          {{option}}
        {{/power-select}}
      `);

      let trigger = this.element.querySelector('.ember-power-select-trigger');
      helpers.beforeInteraction(trigger, assert);
      typeString(trigger, 'aara');
      helpers.checkSelectedValue('Aaran', trigger, assert);
    });

    test(`(${state}) Cycling characters works with grouped items`, async function(assert) {
      this.names = [
        { groupName: 'First', options: ['Faa', 'Fab', 'Fac'] },
        { groupName: 'Second', options: ['Fba', { groupName: '2.1', options: ['FFba'] }, 'Fbb'] }
      ];
      await render(hbs`
        {{#power-select options=names onchange=(action (mut selected)) selected=selected searchEnabled=false as |option|}}
          {{option}}
        {{/power-select}}
      `);
      let trigger = this.element.querySelector('.ember-power-select-trigger');
      helpers.beforeInteraction(trigger, assert);
      typeString(trigger, 'f', state === 'Open' ? 1 : 2); // Normalize open closed behaviour
      helpers.checkSelectedValue('Fab', trigger, assert);
      typeString(trigger, 'f', 2);
      helpers.checkSelectedValue('Fba', trigger, assert);
      typeString(trigger, 'f');
      helpers.checkSelectedValue('FFba', trigger, assert);
      typeString(trigger, 'f');
      helpers.checkSelectedValue('Fbb', trigger, assert);
    });
  });
});
