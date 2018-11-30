import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { typeInSearch, clickTrigger } from 'ember-power-select/test-support/helpers';
import { groupedNumbers } from '../constants';

module('Integration | Component | Ember Power Select (Groups)', function(hooks) {
  setupRenderingTest(hooks);

  test('Options that have a `groupName` and `options` are considered groups and are rendered as such', async function(assert) {
    assert.expect(10);

    this.groupedNumbers = groupedNumbers;
    await render(hbs`
      {{#power-select options=groupedNumbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    assert.notOk(find('.ember-power-select-dropdown'), 'Dropdown is not rendered');

    await clickTrigger();

    let rootLevelGroups = document.querySelectorAll('.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-group');
    let rootLevelOptions = document.querySelectorAll('.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-option');
    assert.dom('.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-group').exists({ count: 3 }, 'There is 3 groups in the root level');
    assert.dom('.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-option').exists({ count:  2 }, 'There is 2 options in the root level');
    assert.dom('.ember-power-select-group-name', rootLevelGroups[0]).hasText('Smalls');
    assert.dom('.ember-power-select-group-name', rootLevelGroups[1]).hasText('Mediums');
    assert.dom('.ember-power-select-group-name', rootLevelGroups[2]).hasText('Bigs');
    assert.dom(rootLevelOptions[0]).hasText('one hundred');
    assert.dom(rootLevelOptions[1]).hasText('one thousand');
    let bigs = [].slice.apply(rootLevelGroups[2].children).filter((e) => e.classList.contains('ember-power-select-options'))[0];
    let bigGroups = [].slice.apply(bigs.children).filter((e) => e.classList.contains('ember-power-select-group'));
    let bigOptions = [].slice.apply(bigs.children).filter((e) => e.classList.contains('ember-power-select-option'));
    assert.equal(bigGroups.length, 2, 'There is 2 sub-groups in the "bigs" group');
    assert.equal(bigOptions.length, 1, 'There is 1 option in the "bigs" group');
  });

  test('Options that have a `groupName` but NOT `options` are NOT considered groups and are rendered normally', async function(assert) {
    assert.expect(3);

    this.notQuiteGroups = [
      { groupName: 'Lions', initial: 'L' },
      { groupName: 'Tigers', initial: 'T' },
      { groupName: 'Dogs', initial: 'D' },
      { groupName: 'Eagles', initial: 'E' }
    ];
    await render(hbs`
      {{#power-select options=notQuiteGroups onchange=(action (mut foo)) as |option|}}
        {{option.groupName}}
      {{/power-select}}
    `);

    assert.dom('.ember-power-select-dropdown').doesNotExist('Dropdown is not rendered');
    await clickTrigger();
    assert.dom('.ember-power-select-option').exists({ count: 4 });
    assert.dom('.ember-power-select-option:nth-child(2)').hasText('Tigers');
  });

  test('When filtering, a group title is visible as long as one of it\'s elements is', async function(assert) {
    assert.expect(3);

    this.groupedNumbers = groupedNumbers;
    await render(hbs`
      {{#power-select options=groupedNumbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);
    await clickTrigger();
    await typeInSearch('ve');
    let groupNames = Array.from(document.querySelectorAll('.ember-power-select-group-name')).map((e) => e.textContent.trim());
    let optionValues = Array.from(document.querySelectorAll('.ember-power-select-option')).map((e) => e.textContent.trim());
    assert.deepEqual(groupNames, ['Mediums', 'Bigs', 'Fairly big', 'Really big'], 'Only the groups with matching options are shown');
    assert.deepEqual(optionValues, ['five', 'seven', 'eleven', 'twelve'], 'Only the matching options are shown');
    await typeInSearch('lve');
    groupNames = Array.from(document.querySelectorAll('.ember-power-select-group-name')).map((e) => e.textContent.trim());
    assert.deepEqual(groupNames, ['Bigs', 'Really big'], 'With no depth level');
  });

  test('Click on an option of a group select selects the option and closes the dropdown', async function(assert) {
    assert.expect(2);

    this.groupedNumbers = groupedNumbers;
    await render(hbs`
      {{#power-select options=groupedNumbers selected=foo onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);
    await clickTrigger();
    let option = Array.from(document.querySelectorAll('.ember-power-select-option')).find((e) => e.textContent.indexOf('four') > -1);
    await click(option);
    assert.dom('.ember-power-select-trigger').hasText('four', 'The clicked option was selected');
    assert.dom('.ember-power-select-options').doesNotExist('The dropdown has dissapeared');
  });

  test('Clicking on the title of a group doesn\'t performs any action nor closes the dropdown', async function(assert) {
    assert.expect(1);

    this.groupedNumbers = groupedNumbers;
    await render(hbs`
      {{#power-select options=groupedNumbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);

    await clickTrigger();
    await click(document.querySelectorAll('.ember-power-select-group-name')[1]);
    assert.dom('.ember-power-select-dropdown').exists('The select is still opened');
  });
});
