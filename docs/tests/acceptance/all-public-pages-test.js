import { test, module } from 'qunit';
import { setupApplicationTest } from 'docs/tests/helpers';
import { visit, currentURL } from '@ember/test-helpers';

module('Acceptance | All Public Pages', function (hooks) {
  setupApplicationTest(hooks);

  test('visit /docs', async function (assert) {
    await visit('/docs');
    assert.strictEqual(currentURL(), '/docs');
  });
});
