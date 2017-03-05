import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { typeInSearch, clickTrigger } from '../../../helpers/ember-power-select';
import { groupedNumbers } from '../constants';
import { find, findAll, click } from 'ember-native-dom-helpers/test-support/helpers';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Groups)', {
  integration: true
});

test('Options that have a `groupName` and `options` are considered groups and are rendered as such', function(assert) {
  assert.expect(10);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select options=groupedNumbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.notOk(find('.ember-power-select-dropdown'), 'Dropdown is not rendered');

  clickTrigger();

  let rootLevelGroups = findAll('.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-group');
  let rootLevelOptions = findAll('.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-option');
  assert.equal(rootLevelGroups.length, 3, 'There is 3 groups in the root level');
  assert.equal(rootLevelOptions.length, 2, 'There is 2 options in the root level');
  assert.equal(find('.ember-power-select-group-name', rootLevelGroups[0]).textContent.trim(), 'Smalls');
  assert.equal(find('.ember-power-select-group-name', rootLevelGroups[1]).textContent.trim(), 'Mediums');
  assert.equal(find('.ember-power-select-group-name', rootLevelGroups[2]).textContent.trim(), 'Bigs');
  assert.equal(rootLevelOptions[0].textContent.trim(), 'one hundred');
  assert.equal(rootLevelOptions[1].textContent.trim(), 'one thousand');
  let bigs = [].slice.apply(rootLevelGroups[2].children).filter((e) => e.classList.contains('ember-power-select-options'))[0];
  let bigGroups = [].slice.apply(bigs.children).filter((e) => e.classList.contains('ember-power-select-group'));
  let bigOptions = [].slice.apply(bigs.children).filter((e) => e.classList.contains('ember-power-select-option'));
  assert.equal(bigGroups.length, 2, 'There is 2 sub-groups in the "bigs" group');
  assert.equal(bigOptions.length, 1, 'There is 1 option in the "bigs" group');
});

test('Options that have a `groupName` but NOT `options` are NOT considered groups and are rendered normally', function(assert) {
  assert.expect(3);

  this.notQuiteGroups = [
    { groupName: 'Lions', initial: 'L' },
    { groupName: 'Tigers', initial: 'T' },
    { groupName: 'Dogs', initial: 'D' },
    { groupName: 'Eagles', initial: 'E' }
  ];
  this.render(hbs`
    {{#power-select options=notQuiteGroups onchange=(action (mut foo)) as |option|}}
      {{option.groupName}}
    {{/power-select}}
  `);

  assert.notOk(find('.ember-power-select-dropdown'), 'Dropdown is not rendered');
  clickTrigger();
  assert.equal(findAll('.ember-power-select-option').length, 4);
  assert.equal(findAll('.ember-power-select-option')[1].textContent.trim(), 'Tigers');
});

test('When filtering, a group title is visible as long as one of it\'s elements is', function(assert) {
  assert.expect(3);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select options=groupedNumbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  clickTrigger();
  typeInSearch('ve');
  let groupNames = [].slice.apply(findAll('.ember-power-select-group-name')).map((e) => e.textContent.trim());
  let optionValues = [].slice.apply(findAll('.ember-power-select-option')).map((e) => e.textContent.trim());
  assert.deepEqual(groupNames, ['Mediums', 'Bigs', 'Fairly big', 'Really big'], 'Only the groups with matching options are shown');
  assert.deepEqual(optionValues, ['five', 'seven', 'eleven', 'twelve'], 'Only the matching options are shown');
  typeInSearch('lve');
  groupNames = [].slice.apply(findAll('.ember-power-select-group-name')).map((e) => e.textContent.trim());
  assert.deepEqual(groupNames, ['Bigs', 'Really big'], 'With no depth level');
});

test('Click on an option of a group select selects the option and closes the dropdown', function(assert) {
  assert.expect(2);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select options=groupedNumbers selected=foo onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);
  clickTrigger();
  let option = [].slice.apply(findAll('.ember-power-select-option')).filter((e) => e.textContent.indexOf('four') > -1)[0];
  click(option);
  assert.equal(find('.ember-power-select-trigger').textContent.trim(), 'four', 'The clicked option was selected');
  assert.notOk(find('.ember-power-select-options'), 'The dropdown has dissapeared');
});

test('Clicking on the title of a group doesn\'t performs any action nor closes the dropdown', function(assert) {
  assert.expect(1);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select options=groupedNumbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  click(findAll('.ember-power-select-group-name')[1]);
  assert.ok(find('.ember-power-select-dropdown'), 'The select is still opened');
});
