import { module, test } from 'qunit';
import {
  emberPowerSelectIsEqual,
} from 'ember-power-select/helpers/ember-power-select-is-equal';

module('Unit | Helper | ember-power-select-is-equal', function () {
  test('returns false for nullish selected values', function (assert) {
    assert.false(emberPowerSelectIsEqual('foo', null));
    assert.false(emberPowerSelectIsEqual('foo', undefined));
  });

  test('matches primitives correctly', function (assert) {
    assert.true(emberPowerSelectIsEqual('foo', 'foo'));
    assert.false(emberPowerSelectIsEqual('foo', 'bar'));
  });

  test('uses reference equality for object selections', function (assert) {
    const option = { id: 1 };

    assert.true(emberPowerSelectIsEqual(option, option));
    assert.false(emberPowerSelectIsEqual(option, { id: 1 }));
  });

  test('checks array selections using reference equality for each item', function (assert) {
    const option = { id: 2 };
    const anotherOption = { id: 3 };
    const selected = [{ id: 1 }, option];

    assert.true(emberPowerSelectIsEqual(option, selected));
    assert.false(emberPowerSelectIsEqual(anotherOption, selected));
  });
});
