import Ember from 'ember';
import $ from 'jquery';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { typeInSearch, clickTrigger, nativeMouseUp } from '../../../helpers/ember-power-select';
import { groupedNumbers } from '../constants';

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

  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');

  clickTrigger();

  let $rootLevelGroups = $('.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-group');
  let $rootLevelOptions = $('.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-option');
  assert.equal($rootLevelGroups.length, 3, 'There is 3 groups in the root level');
  assert.equal($rootLevelOptions.length, 2, 'There is 2 options in the root level');
  assert.equal($($rootLevelGroups[0]).find('.ember-power-select-group-name').text().trim(), 'Smalls');
  assert.equal($($rootLevelGroups[1]).find('.ember-power-select-group-name').text().trim(), 'Mediums');
  assert.equal($($rootLevelGroups[2]).find('> .ember-power-select-group-name').text().trim(), 'Bigs');
  assert.equal($($rootLevelOptions[0]).text().trim(), 'one hundred');
  assert.equal($($rootLevelOptions[1]).text().trim(), 'one thousand');

  let $bigs = $($rootLevelGroups[2]).find('> .ember-power-select-options');
  assert.equal($bigs.find('> .ember-power-select-group').length, 2, 'There is 2 sub-groups in the "bigs" group');
  assert.equal($bigs.find('> .ember-power-select-option').length, 1, 'There is 1 option in the "bigs" group');
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
  let groupNames = $('.ember-power-select-group-name').toArray().map((e) => $(e).text().trim());
  let optionValues = $('.ember-power-select-option').toArray().map((e) => $(e).text().trim());
  assert.deepEqual(groupNames, ['Mediums', 'Bigs', 'Fairly big', 'Really big'], 'Only the groups with matching options are shown');
  assert.deepEqual(optionValues, ['five', 'seven', 'eleven', 'twelve'], 'Only the matching options are shown');
  typeInSearch('lve');
  groupNames = $('.ember-power-select-group-name').toArray().map((e) => $(e).text().trim());
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
  nativeMouseUp('.ember-power-select-option:contains("four")');
  assert.equal($('.ember-power-select-trigger').text().trim(), 'four', 'The clicked option was selected');
  assert.equal($('.ember-power-select-options').length, 0, 'The dropdown has dissapeared');
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
  Ember.run(() => this.$('.ember-power-select-group-name:eq(1)').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is still opened');
});