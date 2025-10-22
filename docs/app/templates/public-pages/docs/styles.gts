import CodeExample from 'docs/components/code-example';
import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">Styles</h1>

  <p>
    This component
    <strong>does not</strong>
    provide any option to customize its visual appearance.
  </p>

  <p>
    You can do it using just plain old CSS. There is no rocket science on it,
    just override the default styles with your owns.
  </p>

  <p>
    However if you are using SASS or LESS there is a more advanced method you
    can use to customize the styles without overriding them.
  </p>

  <p>
    Ember Power Select exposes 53 variables you can set before importing the
    styles. By example (sass example):
  </p>

  <CodeExample @scss="styles-1.scss" @showResult={{false}} @activeTab="scss" />

  <p>
    Will make your selects to have pale blue borders with no rounded corners.
  </p>

  <p>
    This approach is powerful enough to build entire themes on top of it and to
    prove it Ember Power Select ships with a
    <LinkTo @route="public-pages.cookbook.bootstrap-theme">Bootstrap theme</LinkTo>
    and a
    <LinkTo @route="public-pages.cookbook.material-theme">Material theme</LinkTo>
    out of the box that can also be used in projects not using any preprocessor.
  </p>

  <p>
    You can find the entire list of available variables in
    <a
      href="https://github.com/cibernox/ember-power-select/blob/master/ember-power-select/scss/variables.scss"
    >the source code</a>.
  </p>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.the-search"
      class="doc-page-nav-link-prev"
    >&lt; The search</LinkTo>
    <LinkTo
      @route="public-pages.docs.custom-search-action"
      class="doc-page-nav-link-next"
    >Advanced customization &gt;</LinkTo>
  </div>
</template>
