import CodeExample from 'docs/components/code-example';
import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">Installation</h1>

  <p>
    To install
    <code>ember-power-select</code>, run the following command in your Ember
    project directory:
  </p>

  <p>
    <div class="code-block">
      <pre>$ pnpm install ember-power-select</pre>
    </div>
  </p>

  <p>
    This addon is built on top of
    <code>ember-basic-dropdown</code>
    and
    <code>ember-concurrency</code>. If you haven't installed them yet, please
    follow their official installation guides:
  </p>

  <ul>
    <li>
      <a
        href="https://ember-basic-dropdown.com/docs/installation"
        target="_blank"
        rel="noopener noreferrer"
      >
        ember-basic-dropdown Installation Guide
      </a>
    </li>
    <li>
      <a
        href="https://ember-concurrency.com/docs/installation"
        target="_blank"
        rel="noopener noreferrer"
      >
        ember-concurrency Installation Guide
      </a>
    </li>
  </ul>

  <p>
    After installing the dependencies, complete the following additional setup
    steps.
  </p>

  <p>
    If you are using vanilla CSS, add the following line to your
    <code>app.js</code>
    or any route, controller, or component
    <code>.js/.ts</code>
    file:
  </p>

  <CodeExample
    @js="installation-1.js.txt"
    @showResult={{false}}
    @activeTab="js"
  />

  <p>
    Instead of adding the styling in a
    <code>.js</code>
    file. Depending on your build config you can also add the CSS in any
    template/component CSS file using the following line:
  </p>

  <CodeExample
    @css="installation-2.css.txt"
    @showResult={{false}}
    @activeTab="css"
  />

  <p>
    If you are using SASS or LESS, you need to add an import statement to your
    styles.
  </p>

  <CodeExample
    @scss="installation-1.scss"
    @showResult={{false}}
    @activeTab="scss"
  />

  <p>
    For LESS, you also need to register the
    <code>paths</code>
    in
    <code>lessOptions</code>.
  </p>

  <CodeExample
    @js="installation-2.js.txt"
    @showResult={{false}}
    @activeTab="js"
  />

  <p>
    This explicit import is needed because using CSS preprocessors like SASS and
    LESS allows you to customize the appearance of ember-power-select using
    variables. This method is easier and generates less code than overriding
    styles you don't like.
  </p>

  <p>
    For more information about styling, see
    <LinkTo @route="public-pages.docs.styles">Basic Customization: Styles</LinkTo>.
  </p>

  <div class="doc-page-nav">
    <LinkTo @route="public-pages.docs.index" class="doc-page-nav-link-prev">&lt;
      Overview</LinkTo>
    <LinkTo
      @route="public-pages.docs.how-to-use-it"
      class="doc-page-nav-link-next"
    >How to use it &gt;</LinkTo>
  </div>
</template>
