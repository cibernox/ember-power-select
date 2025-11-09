import CodeExample from 'docs/components/code-example';
import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">TypeScript</h1>

  <p>
    All components used inside Ember Power Select define three generic types:<br
    />
    <code>Option</code>,
    <code>IsMultiple</code>, and
    <code>TExtra</code>.

    <CodeExample
      @glimmerTs="typescript-1.gts.txt"
      @showResult={{false}}
      @activeTab="glimmer-ts"
    />
  </p>

  <h2><code>Option = unknown</code></h2>

  <p>
    This generic defines the type of
    <code>@options</code>. By default, it is
    <code>unknown</code>, and TypeScript will automatically infer it in the
    <code>&lt;PowerSelect&gt;</code>
    component.<br />
    However, when overriding internal components such as
    <code>optionsComponent</code>, you may need to specify the type manually -
    otherwise, TypeScript cannot correctly infer your passed type.
  </p>

  <h2><code>IsMultiple extends boolean = false</code></h2>

  <p>
    By default, Power Select acts as a single select (<code>false</code>).<br />
    If you are using a multiple select, pass
    <code>@multiple={{true}}</code>
    to ensure types are inferred correctly. This automatically sets
    <code>IsMultiple</code>
    to
    <code>true</code>.<br />
    For custom components, TypeScript cannot automatically determine whether
    your field is single or multiple, so the component should support both
    cases.<br />
    If your component is designed only for multiple selects, you can explicitly
    set
    <code>IsMultiple</code>
    to
    <code>true</code>
    in its signature.

    <CodeExample
      @glimmerTs="typescript-2.gts.txt"
      @showResult={{false}}
      @activeTab="glimmer-ts"
    />
  </p>

  <h2><code>TExtra = unknown</code></h2>

  <p>
    This type is used for the
    <code>@extra</code>
    parameter.<br />
    Starting with version 9.0,
    <code>@extra</code>
    is available in all components.<br />
    You can pass any value to this parameter and use it within your custom
    component.
  </p>

  <h2><code>Select&lt;T = unknown, IsMultiple extends boolean = false&gt;</code></h2>

  <p>
    This generic represents the typing for the
    <code>@select</code>
    parameter (passed to Power Select's child components) and the
    <code>publicAPI</code>
    object.<br />
    It's commonly used, for example, as the second argument of the
    <code>onChange</code>
    function (see example in the next section).
  </p>

  <h2><code>Selected&lt;T, IsMultiple extends boolean = false&gt;</code></h2>

  <p>
    For
    <code>@selected</code>,
    <code>@onChange</code>..., this type supports both single and multiple
    selection modes.<br />
    The type is automatically resolved depending on the mode:<br />
    - For single select:
    <code>Option | undefined</code><br />
    - For multiple select:
    <code>Option[]</code><br /><br />

    For example, a valid
    <code>@onChange</code>
    function looks like:

    <CodeExample
      @glimmerTs="typescript-3.gts.txt"
      @showResult={{false}}
      @activeTab="glimmer-ts"
    />
  </p>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.migrate-7-0-to-8-0"
      class="doc-page-nav-link-prev"
    >&lt; Migrate from 7.0 to 8.0</LinkTo>
    <LinkTo
      @route="public-pages.docs.test-helpers"
      class="doc-page-nav-link-next"
    >Test helpers &gt;</LinkTo>
  </div>
</template>
