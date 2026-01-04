import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">Migrate from 8.0 to 9.0</h1>

  <p>
    The highlight of version 9.x are:
    <ul>
      <li>
        Full TypeScript support (no more
        <code>any</code>
        types), to improve
        <a
          href="https://typed-ember.gitbook.io/glint"
          target="_blank"
          rel="noopener noreferrer"
        >Glint</a>
        compatibility
      </li>
      <li>
        CSS variables for easier customization, see
        <LinkTo @route="public-pages.docs.styles">Styles</LinkTo>
      </li>
    </ul>
    Before migrating to 9.x, you should first update to the latest 8.x release,
    as some of the breaking changes were introduced in 8.x.
  </p>

  <h2>Breaking changes</h2>

  <ul>
    <li>
      The minimum required versions are:
      <ul>
        <li>Ember 4.12 and above</li>
        <li><code>ember-basic-dropdown</code> 9.x and above</li>
        <li><code>ember-truth-helpers</code> 5.x and above</li>
        <li><code>@ember/test-helpers</code> 5.x and above</li>
        <li><code>@glimmer/component</code> 2.x and above</li>
        <li><code>ember-concurrency</code> 5.x and above</li>
      </ul>
    </li>
    <li>
      TypeScript:
      <ul>
        <li>
          <p>
            All remaining
            <code>any</code>
            types have been removed.<br />
            <small>Depending on the correctness of your app, this might require
              a significant amount of work. To avoid major disruption during the
              8.x cycle, this change has been introduced in 9.x. For a better
              understanding of correct typing, see the
              <LinkTo @route="public-pages.docs.typescript">TypeScript</LinkTo>
              section.</small>
          </p>
        </li>
        <li>
          <p>
            TypeScript types that were not part of the component have been moved
            to
            <code>types.ts</code>.
          </p>
        </li>
      </ul>
    </li>
    <li>
      <p>
        Passing
        <code>components</code>
        as strings is no longer supported. You must now pass all components as
        <code>contextual components</code>.<br />
        <small><i>(Ember deprecated passing components as strings in version
            3.25. In line with this change, we have removed the dependency on
            the deprecated
            <code>@embroider/util</code>
            package.)</i></small>
      </p>
    </li>
    <li>
      <p>
        The
        <code>@allowClear</code>
        argument now sets the value to
        <code>undefined</code>
        instead of
        <code>null</code>. This change simplifies the typing of the selected
        value.
      </p>
    </li>
    <li>
      CSS/SCSS/LESS changes:
      <ul>
        <li>
          <p>
            <code>node-sass</code>
            has been deprecated for many years and is no longer supported.
            Please migrate to
            <code>sass</code>
            or
            <code>sass-embedded</code>.
          </p>
        </li>
        <li>
          <p>
            Our SCSS files have been migrated to the modern API. Please update
            their usage in your app. See the
            <LinkTo @route="public-pages.docs.styles">Styles</LinkTo>
            section for details.
          </p>
        </li>
        <li>
          <p>
            The ember-basic-dropdown CSS/SCSS/LESS is no longer included by
            default. You now need to import it manually. See the
            <a
              href="https://ember-basic-dropdown.com/docs/installation"
              target="_blank"
              rel="noopener noreferrer"
            >ember-basic-dropdown installation instructions</a>
            for guidance.
          </p>
        </li>
        <li>
          <p>
            Previously, it was possible to pass the SCSS variable
            <code>$ember-power-select-line-height</code>
            without a unit. This is no longer supported—you must now provide a
            unit (for example,
            <code>1.5em</code>
            or
            <code>24px</code>).<br />
            Note: If you were previously passing a unitless value, you can
            append
            <code>em</code>
            to retain the same behavior.
          </p>
        </li>
        <li>
          <p>
            The Bootstrap and Material themes have been removed from the addon,
            as they have been outdated for many years. To achieve the same
            styling, please copy the relevant snippets into your application:
            <LinkTo
              @route="public-pages.cookbook.bootstrap-theme"
            >Bootstrap</LinkTo>
            |
            <LinkTo
              @route="public-pages.cookbook.material-theme"
            >Material</LinkTo>
          </p>
        </li>
      </ul>
    </li>
    <li>
      <p>
        The default tag for the label component has been changed from
        <code>label</code>
        to
        <code>div</code>
        for accessibility reasons.
      </p>
    </li>
    <li>
      <p>
        The ember promise api support was removed (<code
        >Ember.ArrayProxy</code>/<code>Ember.PromiseProxyMixin</code>/<code
        >Ember.ObjectProxy</code>).<br />
        Please pass the values as native Promises.
      </p>
    </li>
    <li>
      Breaking changes introduced in 8.x and removed in 9.x:
      <ul>
        <li>
          <p>
            <code>&lt;PowerSelectMultipleInputField /&gt;</code>
            has been removed.<br />
            If you were using this in your app, replace it with
            <code>&lt;PowerSelectInputField /&gt;</code>
            and rename the
            <code>@placeholder</code>
            argument to
            <code>@searchPlaceholder</code>.<br />
            <small><i>(Deprecation added in 8.11)</i></small>
          </p>
        </li>
        <li>
          <p>
            The input field ID for multi-selects has changed from
            <code>ember-power-select-trigger-multiple-input-*</code>
            to
            <code>ember-power-select-trigger-input-*</code>
            (now identical to the single-select version).<br />
            <small><i>(Deprecation added in 8.11)</i></small>
          </p>
        </li>
        <li>
          <p>
            <code>&lt;PowerSelectMultipleTrigger /&gt;</code>
            has been removed.<br />
            If you were using this in your app, replace it with
            <code>&lt;PowerSelectTrigger /&gt;</code>.<br />
            <small><i>(Deprecation added in 8.11)</i></small>
          </p>
        </li>
        <li>
          <p>
            <code>&lt;PowerSelectMultiple /&gt;</code>
            has been removed. Use
            <code>&lt;PowerSelect @multiple={{true}} /&gt;</code>
            instead.<br />
            <small><i>(Deprecation added in 8.11)</i></small>
          </p>
        </li>
      </ul>
    </li>
  </ul>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.custom-search-action"
      class="doc-page-nav-link-prev"
    >&lt; Custom search action</LinkTo>
    <LinkTo
      @route="public-pages.docs.migrate-7-0-to-8-0"
      class="doc-page-nav-link-next"
    >Migrate from 7.0 to 8.0 &gt;</LinkTo>
  </div>
</template>
