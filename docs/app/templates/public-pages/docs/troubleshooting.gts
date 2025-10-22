import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">Troubleshooting</h1>

  <h2 class="t3">The options are not visible in modals</h2>

  <p>
    The list of options in ember-power-select has by default
    <code>z-index: 1000</code>. This apparently magical number is the same that
    some popular css frameworks like bootstrap use by default for dropdowns.
    Modals usually have higher z-indexes (bootstrap itself uses 1050) because if
    a modal opens unexpectedly while ember-power-select is open, you don't want
    the list of options to be placed on top.
  </p>

  <p>
    However if you want to render a select inside a modal, that is a situation
    you can predict and design for. There is two possible solutions:
  </p>

  <ol>
    <li>
      Add a specific class to the select (p.e.
      <code>dropdownClass="in-modal-dropdown"</code>) will make the dropdown to
      have the class
      <code>"in-modal-dropdown"</code>. You can increase the z-index of this
      kind of selects.
    </li>
    <br />
    <li>
      Pass
      <code>renderInPlace=true</code>. This will make the list of options be
      placed next to the trigger instead of being attached to the body, and
      therefore it won't be afected by this z-index issue. Keep in mind that
      when rendered in place the list of options will loose its ability to
      intelligently position itself above the component if the space below is
      too small to fit it.
    </li>
  </ol>

  <h2 class="t3">Nothing is rendered when I click the select</h2>

  <p>
    The addon is based on
    <a href="https://ember-basic-dropdown.com/">ember-basic-dropdown</a>. Please
    check if you have
    <code>&lt;BasicDropdownWormhole /&gt;</code>
    in your
    <code>application.hbs</code>. If there is missing, add the code part from
    before.
  </p>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.test-helpers"
      class="doc-page-nav-link-prev"
    >&lt; Test helpers</LinkTo>
    <LinkTo
      @route="public-pages.docs.architecture"
      class="doc-page-nav-link-next"
    >Architecture &gt;</LinkTo>
  </div>
</template>
