import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import Ember from 'ember';

moduleForAcceptance('Acceptance | All Public Pages');

test('visit every Docs page in order', function(assert) {
  let expectedPages = 15;
  return keepClickingNext('/docs', '.doc-page-nav-link-next').then((urls) => {
    assert.equal(urls.length, expectedPages);
  });
});

test('visit every Cookbook page in order', function(assert) {
  let expectedPages = 6;
  return keepClickingNext('/cookbook', '.doc-page-nav-link-next').then((urls) => {
    assert.equal(urls.length, expectedPages);
  });
});

test('visit /addons', function(assert) {
  visit('/addons');
  andThen(() => {
    assert.equal('/addons', currentURL());
  });
});

function keepClickingNext(initialUrl, nextLinkSelector) {
  let seenURLs = Object.create(null);
  return new Ember.RSVP.Promise((resolve) => {
    visit(initialUrl);
    andThen(() => {
      visitNextPage();
    });
    function visitNextPage() {
      andThen(() => {
        if (seenURLs[currentURL()]) {
          throw new Error('page visitor detected a loop');
        }
        seenURLs[currentURL()] = true;
        let nextLink = find(nextLinkSelector);
        if (nextLink.length === 0) {
          resolve(Object.keys(seenURLs));
        } else {
          click(nextLinkSelector);
          visitNextPage();
        }
      });
    }
  });
}
