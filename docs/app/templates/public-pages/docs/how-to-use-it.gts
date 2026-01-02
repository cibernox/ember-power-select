import CodeExample from 'docs/components/code-example';
import { LinkTo } from '@ember/routing';
import HowToUseIt1 from '../../../components/snippets/how-to-use-it-1';
import HowToUseIt2 from '../../../components/snippets/how-to-use-it-2';
import HowToUseIt3 from '../../../components/snippets/how-to-use-it-3';

<template>
  <h1 class="doc-page-title">How to use it</h1>

  <p>
    The basic component usage is very simple. You must pass the component an
    <code>onchange</code>
    action, and either an
    <code>options</code>
    collection and/or a
    <code>search</code>
    action. The
    <code>options</code>
    argument can be a collection of any kind, including the result of ember-data
    operations like
    <code>.find</code>
    or
    <code>.query</code>. The component will yield each individual item in the
    collection to the block to generate the list.
  </p>

  <p>
    When you use the
    <code>search</code>
    action passing an initial set of
    <code>options</code>
    is optional. Read more about
    <LinkTo @route="public-pages.docs.the-search">the search</LinkTo>
    action.
  </p>

  <p><strong>Selects in this page seem do not work. This is intended.</strong>
    See last paragraph.</p>

  <CodeExample @glimmerTs="how-to-use-it-1.gts">
    {{HowToUseIt1}}
  </CodeExample>

  <p>
    The block of the component becomes the content of each option of the select
    and also the content of the trigger by default. Blocks are a powerful Ember
    primitive and you can use them to build selects with complex HTML inside
    very naturally.
  </p>

  <CodeExample @glimmerTs="how-to-use-it-2.gts">
    {{HowToUseIt2}}
  </CodeExample>

  <p>
    <strong>Filtering in the above select also seems broken, but is also
      intended.</strong>
    See
    <LinkTo @route="public-pages.docs.the-search">the search</LinkTo>
    section (Customize the search field) for instructions on how to make it
    work.
  </p>

  <p>
    The component expects
    <code>selected</code>
    to contain the actual selected object and not just an Id. One way to do this
    is to have a computed property that returns the correct object based upon
    the Id.
  </p>

  <CodeExample @glimmerTs="how-to-use-it-3.gts">
    {{HowToUseIt3}}
  </CodeExample>

  <p>
    You could alternatively do this using the
    <code><a
        href="https://github.com/DockYard/ember-composable-helpers#find-by"
      >find-by</a></code>
    helper from the
    <a
      href="https://github.com/DockYard/ember-composable-helpers#find-by"
    >ember-composable-helpers</a>
    add-on by DockYard.
  </p>

  <p>
    Also you've seen the usage of the
    <code>selected</code>
    option. Unsurprisingly it tells the component the
    <strong>initial</strong>
    selection. But it's important to note a few things about it:
  </p>

  <ul>
    <li>
      The component compares options using
      <code>Ember.isEqual</code>. With primitive values like strings or numbers
      it works exactly as
      <code>===</code>. With dates, although in JS
      <code>new Date(2017, 5, 5) !== new Date(2017, 5, 5)</code>, in Ember Power
      Select they will be considered the same because
      <code>Ember.isEqual(new Date(2017, 5, 5), new Date(2017, 5, 5))) === true</code>.
      <p>
        When comparing objects, remember that in JS objects are compared by
        reference, so
        <code>{ foo: 'bar' } !== { foo: 'bar' }</code>. However if you define on
        your objects an
        <code>isEqual(other) {}</code>
        function, that will be used instead of a simple
        <code>===</code>.
      </p>
    </li>
    <li>
      Updates in the selected element will update the selected value in the
      component as expected.
    </li>
    <li>
      <code>selected</code>
      (and all other options actually) is read only. This means that selecting
      an element in the component won't do anything. That is a design decision
      and the reason why the
      <code>onchange</code>
      action is mandatory. This is aligned with Ember's Data Down Actions Up
      (DDAU) philosophy.
    </li>
  </ul>

  <p>
    This is the very basic usage of this component, but so far is pretty
    useless. Since there are no two way bindings and the
    <code>onchange</code>
    action is empty
    <strong>nothing happens when you select something.</strong>
  </p>

  <p>
    Let's see how to take advantage of the
    <code>onchange</code>
    property.
  </p>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.installation"
      class="doc-page-nav-link-prev"
    >&lt; Installation</LinkTo>
    <LinkTo
      @route="public-pages.docs.action-handling"
      class="doc-page-nav-link-next"
    >Action handling &gt;</LinkTo>
  </div>
</template>
