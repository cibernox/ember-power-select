import { moduleForFastboot } from 'ember-fastboot-test-helpers';

moduleForFastboot('addons.index');

QUnit.test('It renders', function(assert) {
  assert.expect(2);

  return this.visit('/cookbook').then(([status, headers, document]) => {
    assert.equal(status, 200, 'Request is successful');
    assert.equal(document.querySelector('.doc-page-title').textContent.trim(), 'System-wide config');
  });
});
