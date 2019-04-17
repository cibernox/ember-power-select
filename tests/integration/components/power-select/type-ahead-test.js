import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { optionAtIndex } from 'ember-power-select/utils/group-utils';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import { namesStartingWithA } from '../constants';
import { render, focus, triggerKeyEvent } from '@ember/test-helpers';

const WITH_EPS_CLOSED = {
  async beforeInteraction(trigger, assert) {
    await focus(trigger);
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
  async beforeInteraction(trigger, assert) {
    await clickTrigger();
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

async function typeString(trigger, str, times = 1) {
  for (let j = 0; j < times; j++) {
    for (let i = 0; i < str.length; i++) {
      await triggerKeyEvent(trigger, 'keydown', str.charAt(i));
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
      await helpers.beforeInteraction(trigger, assert);
      await typeString(trigger, 'AAA');
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
      await helpers.beforeInteraction(trigger, assert);
      let { length } = namesStartingWithA;
      for(let i = 0; i < length; i++) {
        triggerKeyEvent(trigger, 'keydown', 'A');
      }
      await triggerKeyEvent(trigger, 'keydown', 'A');
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
      await helpers.beforeInteraction(trigger, assert);
      triggerKeyEvent(trigger, 'keydown', 'A');
      triggerKeyEvent(trigger, 'keydown', 'A');
      await triggerKeyEvent(trigger, 'keydown', 'R');
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
      await helpers.beforeInteraction(trigger, assert);
      triggerKeyEvent(trigger, 'keydown', 'A');
      triggerKeyEvent(trigger, 'keydown', 'A');
      triggerKeyEvent(trigger, 'keydown', 'R');
      await triggerKeyEvent(trigger, 'keydown', 'A');
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
      await helpers.beforeInteraction(trigger, assert);
      await typeString(trigger, 'F', state === 'Open' ? 1 : 2); // Normalize open closed behaviour
      helpers.checkSelectedValue('Fab', trigger, assert);
      await typeString(trigger, 'F', 2);
      helpers.checkSelectedValue('Fba', trigger, assert);
      await typeString(trigger, 'F');
      helpers.checkSelectedValue('FFba', trigger, assert);
      await typeString(trigger, 'F');
      helpers.checkSelectedValue('Fbb', trigger, assert);
    });
  });
});
