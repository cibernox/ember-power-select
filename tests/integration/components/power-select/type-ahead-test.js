import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { optionAtIndex } from 'ember-power-select/utils/group-utils';
import { triggerKeydown, clickTrigger } from 'ember-power-select/test-support/helpers';
import { charCode, namesStartingWithA } from '../constants';
import { find } from 'ember-native-dom-helpers';

const WITH_EPS_CLOSED = {
  beforeInteraction(trigger, assert) {
    trigger.focus();
    assert.equal(trigger.textContent.trim(), '', 'no value selected');
    assert.notOk(find('.ember-power-select-dropdown'), 'The dropdown is closed');
  },

  checkSelectedValue(value, trigger, assert) {
    // -1 adjust the position for the implicit placeholder
    assert.equal(trigger.textContent.trim(), value);
    assert.notOk(find('.ember-power-select-dropdown'), 'The dropdown is still closed');
  },

  valueAt(coll, _idx, isGrouped = false) {
    let idx = isGrouped ? _idx - 1 : (_idx - 1) % coll.length;
    return optionAtIndex(coll, idx).option;
  }
};

const WITH_EPS_OPEN = {
  beforeInteraction(trigger, assert) {
    clickTrigger();
    assert.ok(find('.ember-power-select-dropdown'), 'The dropdown is open');
  },

  checkSelectedValue(value, trigger, assert) {
    assert.equal(trigger.textContent.trim(), '', 'nothing is selected');
    assert.equal(find('.ember-power-select-option[aria-current=true]').textContent.trim(), value);
    assert.ok(find('.ember-power-select-dropdown'), 'The dropdown is still open');
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

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Type Ahead Native Behaviour)', {
  integration: true
});

[['Closed', WITH_EPS_CLOSED], ['Open', WITH_EPS_OPEN]].forEach(([state, helpers]) => {
  test(`(${state}) Repeating the first character cycles through the results`, function(assert) {
    this.names = namesStartingWithA;
    this.render(hbs`
    {{#power-select options=names onchange=(action (mut selected)) selected=selected searchEnabled=false as |option|}}
      {{option}}
    {{/power-select}}
  `);

    let trigger = find('.ember-power-select-trigger');
    helpers.beforeInteraction(trigger, assert);
    typeString(trigger, 'aaa');
    helpers.checkSelectedValue(helpers.valueAt(this.names, 'aaa'.length), trigger, assert);
  });

  test(`(${state}) When going over all the possible results, it goes back to the first`, function(assert) {
    this.names = namesStartingWithA;
    this.render(hbs`
      {{#power-select options=names onchange=(action (mut selected)) selected=selected searchEnabled=false as |option|}}
        {{option}}
      {{/power-select}}
    `);

    let trigger = find('.ember-power-select-trigger');
    helpers.beforeInteraction(trigger, assert);
    let { length } = namesStartingWithA;
    typeString(trigger, 'a', length + 1);
    helpers.checkSelectedValue(helpers.valueAt(this.names, length + 1), trigger, assert);
  });

  test(`(${state}) Though repeating the first char, the whole search term is remembered`, function(assert) {
    this.names = namesStartingWithA;
    this.render(hbs`
      {{#power-select options=names onchange=(action (mut selected)) selected=selected searchEnabled=false as |option|}}
        {{option}}
      {{/power-select}}
    `);

    let trigger = find('.ember-power-select-trigger');
    helpers.beforeInteraction(trigger, assert);
    typeString(trigger, 'aa');
    helpers.checkSelectedValue(helpers.valueAt(this.names, 'aa'.length), trigger, assert);
    typeString(trigger, 'r');
    helpers.checkSelectedValue('Aaran', trigger, assert);
    assert.notEqual('Aaran', helpers.valueAt(this.names, 'aar'.length), 'Aaran would not be selected unless aa was remembered');
  });

  test(`(${state}) Typing the first character after typing a different one does not set again the cycling behaviour`, function(assert) {
    this.names = namesStartingWithA;
    this.render(hbs`
      {{#power-select options=names onchange=(action (mut selected)) selected=selected searchEnabled=false as |option|}}
        {{option}}
      {{/power-select}}
    `);

    let trigger = find('.ember-power-select-trigger');
    helpers.beforeInteraction(trigger, assert);
    typeString(trigger, 'aara');
    helpers.checkSelectedValue('Aaran', trigger, assert);
  });

  test(`(${state}) Cycling characters works with grouped items`, function(assert) {
    this.names = [
      { groupName: 'First', options: ['Faa', 'Fab', 'Fac'] },
      { groupName: 'Second', options: ['Fba', { groupName: '2.1', options: ['FFba'] }, 'Fbb'] }
    ];
    this.render(hbs`
      {{#power-select options=names onchange=(action (mut selected)) selected=selected searchEnabled=false as |option|}}
        {{option}}
      {{/power-select}}
    `);
    let trigger = find('.ember-power-select-trigger');
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
