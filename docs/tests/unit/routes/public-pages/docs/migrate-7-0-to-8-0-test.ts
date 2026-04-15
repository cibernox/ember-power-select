import { module, test } from 'qunit';
import { setupTest } from 'docs/tests/helpers';

module('Unit | Route | public-pages/docs/migrate-7-0-to-8-0', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup(
      'route:public-pages/docs/migrate-7-0-to-8-0',
    );
    assert.ok(route);
  });
});
