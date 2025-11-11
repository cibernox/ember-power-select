import { module, test } from 'qunit';
import {
  emberPowerSelectIsGroup,
} from 'ember-power-select/helpers/ember-power-select-is-group';

module('Unit | Helper | ember-power-select-is-group', function () {
  test('detects group-like structures', function (assert) {
    assert.false(emberPowerSelectIsGroup(undefined));
    assert.false(emberPowerSelectIsGroup({}));
    assert.false(emberPowerSelectIsGroup({ groupName: 'Cities' }));
    assert.false(emberPowerSelectIsGroup({ options: [] }));
    assert.true(emberPowerSelectIsGroup({ groupName: 'Cities', options: [] }));
  });
});
