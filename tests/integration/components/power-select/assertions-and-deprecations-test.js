import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { numbers } from '../constants';
import DS from 'ember-data';
import RSVP from 'rsvp';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Assertions & deprecations)', {
  integration: true
});

test('the `onchange` function is mandatory', function(assert) {
  assert.expect(1);
  this.numbers = numbers;

  assert.expectAssertion(() => {
    this.render(hbs`
      {{#power-select options=countries selected=selected as |opt|}}{{opt}}{{/power-select}}
    `);
  }, /requires an `onchange` function/);
});

test('it throws a helpful assertion if groups contain promises, as they are not supported', async function(assert) {
  let smallOptions = DS.PromiseArray.create({
    promise: RSVP.resolve(['one', 'two', 'three'])
  });
  this.groupedNumbers = [
    { groupName: 'Smalls', options: smallOptions  },
    { groupName: 'Mediums', options: ['four', 'five', 'six'] }
  ];

  await smallOptions;
  assert.expectAssertion(() => {
    this.render(hbs`
      {{#power-select options=groupedNumbers onchange=(action (mut foo)) as |option|}}
        {{option}}
      {{/power-select}}
    `);
  }, 'ember-power-select doesn\'t support promises inside groups');
});
