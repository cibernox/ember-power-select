import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import { currentURL, find, click, visit } from 'ember-native-dom-helpers';

moduleForAcceptance('Acceptance | All Public Pages');

test('visit every Docs page in order', async function(assert) {
  let urls = await keepClickingNext('/docs', '.doc-page-nav-link-next');
  assert.equal(urls.length, 15);
});

test('visit every Cookbook page in order', async function(assert) {
  let urls = await keepClickingNext('/cookbook', '.doc-page-nav-link-next');
  assert.equal(urls.length, 7);
});

test('visit /addons', async function(assert) {
  await visit('/addons');
  assert.equal('/addons', currentURL());
});

async function keepClickingNext(initialUrl, nextLinkSelector) {
  let seenURLs = Object.create(null);
  await visit(initialUrl);
  let nextLink;
  do {
    let url = currentURL();
    if (seenURLs[url]) {
      throw new Error('page visitor detected a loop');
    }
    seenURLs[currentURL()] = true;
    nextLink = find(nextLinkSelector);
    if (nextLink) {
      await click(nextLink);
    }
  } while (nextLink);
  return Object.keys(seenURLs);
}
