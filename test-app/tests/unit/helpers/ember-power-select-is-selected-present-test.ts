import { module, test } from 'qunit';
import {
  emberPowerSelectIsSelectedPresent,
} from 'ember-power-select/helpers/ember-power-select-is-selected-present';

module('Unit | Helper | ember-power-select-is-selected-present', function () {
  test('returns false for nullish values', function (assert) {
    assert.false(emberPowerSelectIsSelectedPresent(null));
    assert.false(emberPowerSelectIsSelectedPresent(undefined));
  });

  test('returns true for defined values', function (assert) {
    assert.true(emberPowerSelectIsSelectedPresent(''));
    assert.true(emberPowerSelectIsSelectedPresent(0));
    assert.true(emberPowerSelectIsSelectedPresent({}));
  });
});
