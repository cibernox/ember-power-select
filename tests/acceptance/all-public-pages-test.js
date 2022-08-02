import { test, module } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, currentURL } from '@ember/test-helpers';

module('Acceptance | All Public Pages', function (hooks) {
  setupApplicationTest(hooks);

  // test('visit every Docs page in order', async function(assert) {
  //   let urls = await keepClickingNext('/docs', '.doc-page-nav-link-next');
  //   assert.strictEqual(urls.length, 15);
  // });

  // test('visit every Cookbook page in order', async function(assert) {
  //   let urls = await keepClickingNext('/cookbook', '.doc-page-nav-link-next');
  //   assert.strictEqual(urls.length, 6);
  // });

  test('visit /addons', async function (assert) {
    await visit('/addons');
    assert.strictEqual(currentURL(), '/addons');
  });
});

// async function keepClickingNext(initialUrl, nextLinkSelector) {
//   let seenURLs = Object.create(null);
//   await visit(initialUrl);
//   let nextLink;
//   do {
//     let url = currentURL();
//     if (seenURLs[url]) {
//       throw new Error('page visitor detected a loop');
//     }
//     seenURLs[currentURL()] = true;
//     nextLink = find(nextLinkSelector);
//     if (nextLink) {
//       await click(nextLink);
//     }
//   } while (nextLink);
//   return Object.keys(seenURLs);
// }
