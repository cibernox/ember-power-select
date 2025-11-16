import CodeExample from 'docs/components/code-example';
import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">Test helpers</h1>

  <br />
  <h2>Acceptance Tests</h2>

  <p>
    Ember Power Select bundles some handy test helpers (<code
    >selectChoose</code>,
    <code>selectSearch</code>,
    <code>removeMultipleOption</code>
    and
    <code>clearSelected</code>) that make it nicer to interact with the
    component in acceptance tests.
  </p>

  <CodeExample
    @js="test-helpers-10-js.js.txt"
    @showResult={{false}}
    @activeTab="js"
  />

  <h2 class="t3"><code>selectChoose(cssPath, optionTextOrOptionSelector, index?)</code></h2>

  <p>
    This async helper allows you to select an option of a select by it's text,
    without worrying about if the select is single or multiple or if it is
    opened or closed.
  </p>

  <CodeExample
    @js="test-helpers-2-js.js.txt"
    @showResult={{false}}
    @activeTab="js"
  />

  It also allows to pass a complex CSS selector where using the text of the
  option is not convenient:

  <CodeExample
    @js="test-helpers-3-js.js.txt"
    @showResult={{false}}
    @activeTab="js"
  />

  <h2 class="t3"><code>selectSearch(cssPath, searchText)</code></h2>

  <p>
    Use this helper to perform a search on a single/multiple select. You
    probably will use it in conjunction when the search perform some
    asynchronous operation
  </p>

  <CodeExample
    @js="test-helpers-4-js.js.txt"
    @showResult={{false}}
    @activeTab="js"
  />

  <h2 class="t3"><code>removeMultipleOption(cssPath, optionText)</code></h2>

  <p>
    Use this helper to remove an option from a multiple select.
  </p>

  <CodeExample
    @js="test-helpers-5-js.js.txt"
    @showResult={{false}}
    @activeTab="js"
  />

  <h2 class="t3"><code>clearSelected(cssPath)</code></h2>

  <p>
    Use this helper to remove an option from a single select when allowClear is
    set to true.
  </p>

  <CodeExample
    @js="test-helpers-6-js.js.txt"
    @showResult={{false}}
    @activeTab="js"
  />

  <p>
    <strong>Note:</strong>
    Remember to whitelist
    <code>selectChoose</code>,
    <code>selectSearch</code>,
    <code>removeMultipleOption</code>
    and
    <code>clearSelected</code>
    in the list of allowed globals in your
    <code>tests/.jshintrc</code>
    manifest.
  </p>

  <br />
  <h2>Integration Tests</h2>

  <p>
    Test helpers must be imported at the top of your integration test. The basic
    functionality of these helpers are unlikely to change, but may experience
    minor revisions in the future.
  </p>
  <p><code>import { typeInSearch, clickTrigger } from
      'ember-power-select/test-support/helpers'</code></p>
  <p>
    Also note that you could extract the code for these test helpers into your
    own helpers file was well.
  </p>
  <p><code>import { typeInSearch, clickTrigger } from
      'my-app/tests/helpers/test-helpers'</code></p>

  <h2 class="t3"><code>clickTrigger(scope, options = {})</code></h2>

  <p>
    This helper opens the dropdown based on the class name (scope) defined on
    the power select. Scope is optional if integration test renders only one
    power select.
  </p>

  <CodeExample
    @js="test-helpers-7-js.js.txt"
    @showResult={{false}}
    @activeTab="js"
  />

  <h2 class="t3"><code>typeInSearch(text)</code></h2>

  <p>
    This helper is used in conjunction with opening a power select dropdown as
    long as search is not disabled.
  </p>

  <CodeExample
    @js="test-helpers-8-js.js.txt"
    @showResult={{false}}
    @activeTab="js"
  />

  <h2 class="t3"><code>selectChoose(text)</code></h2>

  <p>
    Much like the acceptance one, this integration tests takes care of the
    entire process of opening a select and choosing one of its values witout you
    having to worry about the details.
  </p>

  <CodeExample
    @js="test-helpers-9-js.js.txt"
    @showResult={{false}}
    @activeTab="js"
  />

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.migrate-7-0-to-8-0"
      class="doc-page-nav-link-prev"
    >&lt; Migrate from 7.0 to 8.0</LinkTo>
    <LinkTo
      @route="public-pages.docs.troubleshooting"
      class="doc-page-nav-link-next"
    >Troubleshooting &gt;</LinkTo>
  </div>
</template>
