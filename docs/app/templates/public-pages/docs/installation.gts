import CodeExample from 'docs/components/code-example';
import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">Installation</h1>

  <p>
    Ember Power Select is distributed as an
    <a
      href="http://www.ember-cli.com/"
      target="_blank"
      rel="noopener noreferrer"
    >Ember CLI</a>
    addon, so the majority of the installation will be done by running the
    following command in your Ember project directory:
  </p>

  <p>
    <div class="code-block">
      <pre>$ ember install ember-power-select</pre>
    </div>
  </p>

  <p>
    When installing via
    <code>ember install</code>, the addon will automatically add the necessary
    snippets to your app.
  </p>

  <p>
    The addon uses ember-concurrency internally, which require some manual steps
    for installation. For these steps, see the
    <a
      href="http://ember-concurrency.com/docs/installation"
      target="_blank"
      rel="noopener noreferrer"
    >ember-concurrency</a>
    installation page under
    <i>"Configure Babel Transform"</i>.
  </p>

  <h2 class="t3">Manual Installation</h2>

  <p>
    If you haven't used
    <code>ember install</code>, you need to add
    <code>ember-basic-dropdown</code>
    and
    <code>ember-concurrency</code>
    as
    <code>devDependencies</code>
    in your
    <code>package.json</code>.
  </p>

  <p>
    After installation, add the following line to the templates where you want to
    render the power select content, such as in your
    <code>application.hbs</code>. This component will render the power select
    content.
  </p>

  <CodeExample
    @glimmerTs="installation-0.gts"
    @showResult={{false}}
    @activeTab="glimmer-ts"
  />

  <p>
    If you use vanilla CSS, add the following line to your
    <code>app.js</code>
    or any route/controller/component
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
    @js="installation-2.js"
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

  <p>
    For further details on ember-concurrency installation, visit the
    <a
      href="http://ember-concurrency.com/docs/installation"
      target="_blank"
      rel="noopener noreferrer"
    >ember-concurrency</a>
    installation page.
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
