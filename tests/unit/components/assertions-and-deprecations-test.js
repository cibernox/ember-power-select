import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | Ember Power Select (Assertions & deprecations)', function(hooks) {
  setupTest(hooks);

  test('the `@onChange` function is mandatory', function(assert) {
    assert.expect(1);

    assert.throws(() => {
      this.owner.factoryFor('component:power-select').create({});
    }, /requires an `@onChange` function/);
  });
});
