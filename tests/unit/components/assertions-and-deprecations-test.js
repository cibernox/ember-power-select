import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | Ember Power Select (Assertions & deprecations)', function(hooks) {
  setupTest(hooks);

  test('the `onchange` function is mandatory', function(assert) {
    assert.expect(1);

    assert.throws(() => {
      this.owner.factoryFor('component:power-select').create({});
    }, /requires an `onchange` function/);
  });

  // test('the `onchange` function is mandatory', function(assert) {
  //   assert.expect(1);

  //   let smallOptions = DS.PromiseArray.create({
  //     promise: RSVP.resolve(['one', 'two', 'three'])
  //   });

  //   assert.throws(async() => {
  //     this.owner.factoryFor('component:power-select').create({
  //       onchange() {},
  //       options: [
  //         { groupName: 'Smalls', options: smallOptions },
  //         { groupName: 'Mediums', options: ['four', 'five', 'six'] }
  //       ]
  //     });
  //   }, 'ember-power-select doesn\'t support promises inside groups');
  // });
});
