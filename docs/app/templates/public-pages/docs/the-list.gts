import CodeExample from 'docs/components/code-example';
import { LinkTo } from '@ember/routing';
import TheList1 from '../../../components/snippets/the-list-1';
import TheList2 from '../../../components/snippets/the-list-2';
import TheList3 from '../../../components/snippets/the-list-3';
import TheList4 from '../../../components/snippets/the-list-4';
import TheList5 from '../../../components/snippets/the-list-5';
import TheList7 from '../../../components/snippets/the-list-7';
import TheList8 from '../../../components/snippets/the-list-8';
import TheList9 from '../../../components/snippets/the-list-9';
import TheList10 from '../../../components/snippets/the-list-10';

<template>
  <h1 class="doc-page-title">The list</h1>

  <p>
    If there's a key area of the component that must be absolutely customizable,
    it's the dropdown with the list. This is probably the most dense chapter so
    far so we recommend that you read it cover to cover.
  </p>

  <h2 class="t3">Position and destination</h2>

  <p>
    The dropdown in Ember Power Select is pretty smart. By default this
    component inserts the dropdown not next the the trigger but in the a
    placeholder element in the root of your app (typically the
    <code>&lt;body&gt;</code>) using the awesome
    <a href="https://github.com/yapplabs/ember-wormhole">ember-wormhole</a>
    addon and then absolutely positions it.
  </p>

  <p>
    This is a safe default because by default it won't be affected by the
    overflow constraints of the element where the component lives in. However,
    there are a few situations where this is not practical, so you can tune this
    in two different ways.
  </p>

  <p>
    You can configure Ember Basic Dropdown (the addon used internally by EPS) to
    use a different element as destination for the dropdown. By default an
    <code>&lt;div id="ember-basic-dropdown-wormhole"&gt;&lt;/div&gt;</code>
    div is added to the root of your app and used as destination, but you can
    specify a different one globally:
  </p>

  <pre
  >
    // config/environment.js

    ENV['ember-basic-dropdown'] = {
      destination: '&lt;id-of-destination-element&gt;'
    }
  </pre>

  <p>If you customize the destination element, then it is up to you to add that
    element somewhere in your app.</p>

  <p>
    You can also specify a destination div on a per component basis, using the
    <code>destination</code>
    property.
  </p>

  <CodeExample @glimmerTs="the-list-1.gts">
    {{TheList1}}
  </CodeExample>

  <p>
    The second option is to opt-out to render the dropdown in a different place.
    Just pass
    <code>renderInPlace=true</code>
    and the dropdown will be placed next to the trigger element in the DOM.
  </p>

  <CodeExample @glimmerTs="the-list-2.gts">
    {{TheList2}}
  </CodeExample>

  <p>
    When the component is not rendered in place the dropdown can be configured
    to be added below or above the trigger using the
    <code>verticalPosition</code>
    option. The possible values are
    <code>below</code>,
    <code>above</code>
    and
    <code>auto</code>
    (the default).
  </p>
  <p>
    The
    <code>auto</code>
    mode will detect the best strategy based on the available space around the
    component and also will take care of repositioning it when you scroll or
    change the orientation of the device so you will rarely need to worry about
    this option.
  </p>

  <CodeExample @glimmerTs="the-list-3.gts">
    {{TheList3}}
  </CodeExample>

  <h2 class="t3">The empty state</h2>

  <p>
    What happens when the collection you pass to the component is empty? By
    default the component will render a helpful message. This message is the
    same that will appear after performing a search when there are no matching
    results.
  </p>

  <CodeExample @glimmerTs="the-list-4.gts">
    {{TheList4}}
  </CodeExample>

  <p>
    You can pass a different message using
    <code>noMatchesMessage="My message"</code>
  </p>

  <CodeExample @glimmerTs="the-list-5.gts">
    {{TheList5}}
  </CodeExample>

  <h2 class="t3">The loading state</h2>

  <p>
    In the first chapter we mentioned that the options of this component can be
    any collection, including Ember-data collections resulting from
    <code>store.find</code>,
    <code>store.query</code>, asynchronous relationships and just plain old
    promises that resolve to a collection of some sort.
  </p>
  <p>
    That means that while the promise doesn't resolve you are in some kind of
    <em>loading</em>
    state where you don't have options yet (but you will have results) so you
    don't want to show the "No results" messages.
  </p>

  <p>
    The component will show a default message but you can also customize passing
    <code>loadingMessage="Some text"</code>
  </p>

  <CodeExample @glimmerTs="the-list-7.gts">
    {{TheList7}}
  </CodeExample>

  <h2 class="t3">Disabling specific options or groups</h2>

  <p>
    In
    <LinkTo @route="public-pages.docs.the-trigger">The trigger</LinkTo>
    we saw how to disable the entire component, but you can also disable
    specific options. Options that have a
    <code>disabled</code>
    property set to true will automatically be considered disabled and styled as
    such.
  </p>

  <p>
    Note that those disabled items, although displayed in the list, do not react
    to mouse events nor can be highlighted using arrow navigation.
  </p>

  <CodeExample @glimmerTs="the-list-8.gts">
    {{TheList8}}
  </CodeExample>

  <p>
    This also works with groups. If a group has a property
    <code>disabled: true</code>, all options inside that group, including nested
    groups are considered disabled, without having to mark every option as
    disabled.
  </p>

  <CodeExample @glimmerTs="the-list-9.gts">
    {{TheList9}}
  </CodeExample>

  <p>
    You might have noticed that there is a part of the dropdown that wasn't
    mentioned in this chapter: The search. This is because it deserves an entire
    chapter of its own.
  </p>

  <h2 class="t3">Prevent click propagation inside the list</h2>

  <p>
    The options inside the list are selected with mousedown, a good way to
    prevent the selection is intercepting
    <code>mouseup</code>
    and calling
    <code>stopPropagation</code>
    on the event.
  </p>

  <p>
    This is particularly useful if you want to add some kind of link or button
    inside the list of options and prevent the selection of the item when the
    user clicks on the link.
  </p>

  <CodeExample @glimmerTs="the-list-10.gts">
    {{TheList10}}
  </CodeExample>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.the-trigger"
      class="doc-page-nav-link-prev"
    >&lt; The trigger</LinkTo>
    <LinkTo
      @route="public-pages.docs.the-search"
      class="doc-page-nav-link-next"
    >The search &gt;</LinkTo>
  </div>
</template>
