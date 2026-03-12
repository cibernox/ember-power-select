import { module, test } from 'qunit';
import { setupRenderingTest } from '../../../helpers';
import PowerSelectOptionsComponent from '#src/components/power-select/options.gts';

// Extending PowerSelectOptionsComponent without providing type params should
// work (T should default to unknown). Without the fix, this produces TS2707.
class CustomOptions extends PowerSelectOptionsComponent {}

module(
  'Integration | Component | Ember Power Select (Type tests - options default type param)',
  function (hooks) {
    setupRenderingTest(hooks);

    test('Extending PowerSelectOptionsComponent without type params compiles', function (assert) {
      assert.ok(CustomOptions, 'CustomOptions class exists');
    });
  },
);
