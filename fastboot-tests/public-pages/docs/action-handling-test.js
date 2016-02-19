import { moduleForFastboot } from 'ember-fastboot-test-helpers';

moduleForFastboot('docs.action-handling');

QUnit.test('It renders', function(assert) {
  assert.expect(2);

  return this.visit('/docs/action-handling').then(([status, headers, document]) => {
    assert.equal(status, 200, 'Request is successful');
    assert.equal(document.querySelector('.doc-page-title').textContent.trim(), 'Action handling');
  });
});
