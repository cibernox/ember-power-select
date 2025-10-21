import CodeExample from 'docs/components/code-example';
import { LinkTo } from '@ember/routing';
import Groups1 from '../../../components/snippets/groups-1';

<template>
  <h1 class="doc-page-title">Groups</h1>

  <p>
    Any component that aims to replace the native select has to handle groups and
    so does this. When the component iterates over the collection of options it
    checks if the option has an attribute named
    <code>groupName</code>
    and another named
    <code>options</code>
    that is also a collection.
  </p>

  <CodeExample @glimmerTs="groups-1.gts">
    {{Groups1}}
  </CodeExample>

  <p>
    You can nest groups inside groups with absolutely no depth limit, everything
    else like arrow navigation and filtering will just work. However, the options
    of a group cannot be a promise, it has to be a regular collection.
  </p>

  <p>
    This is all you need to know about passing groups of options, but what about
    when you want to select more than one option?
  </p>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.action-handling"
      class="doc-page-nav-link-prev"
    >&lt; Action handling</LinkTo>
    <LinkTo
      @route="public-pages.docs.multiple-selection"
      class="doc-page-nav-link-next"
    >Multiple selection &gt;</LinkTo>
  </div>
</template>
