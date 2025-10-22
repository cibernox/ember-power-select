import CodeExample from 'docs/components/code-example';
import { LinkTo } from '@ember/routing';
import TheTrigger1 from '../../../components/snippets/the-trigger-1';
import TheTrigger2 from '../../../components/snippets/the-trigger-2';
import TheTrigger3 from '../../../components/snippets/the-trigger-3';
import TheTrigger4 from '../../../components/snippets/the-trigger-4';
import TheTrigger5 from '../../../components/snippets/the-trigger-5';
import TheTrigger6 from '../../../components/snippets/the-trigger-6';

<template>
  <h1 class="doc-page-title">The trigger</h1>

  <p>
    The trigger is the only part of the select that is always visible and the
    area that will get more interaction from the user so it's not a surprise
    that it can be customized in many ways.
  </p>

  <h2 class="t3">Disable the component</h2>

  <p>
    You can completely disable the trigger (and therefore the entire component)
    by passing
    <code>disabled=true</code>.
  </p>

  <CodeExample @glimmerTs="the-trigger-1.gts">
    {{TheTrigger1}}
  </CodeExample>

  <h2 class="t3">The selected option</h2>

  <p>
    As we saw in the
    <LinkTo @route="public-pages.docs.how-to-use-it">How to use it</LinkTo>
    section, Ember Power Select will reuse the same block used for each element
    of the list for the content of the trigger, both in normal and multiple
    mode, but this is something you can also customize if you need to.
  </p>

  <p>
    Since we have run out of block to pass the the component we need to use
    other components if we want to go any further. Pass
    <code>selectedItemComponent=\{\{component "component-name"\}\}</code>
    to the component.
  </p>

  <p>
    Within that component you have access to an
    <code>option</code>
    property that contains the selected option. In multiple selects the
    <code>selectedItemComponent</code>
    component is rendered as once per each selected option.
  </p>

  <CodeExample @glimmerTs="the-trigger-2.gts">
    {{TheTrigger2}}
  </CodeExample>

  <h2 class="t3">Set a placeholder</h2>

  <p>
    If you pass
    <code>placeholder="Some text"</code>
    to the component that message will be displayed in the trigger when no value
    has been selected.
  </p>

  <CodeExample @glimmerTs="the-trigger-3.gts">
    {{TheTrigger3}}
  </CodeExample>

  Take into account that in the multiple selects with search enabled, the
  trigger contains a searchbox and you should use the
  <code>searchPlaceholder</code>
  option instead. Check
  <LinkTo @route="public-pages.docs.the-search">The search</LinkTo>
  section for more info.

  <h2 class="t3">Set a complex placeholder</h2>

  <p>
    Sometimes a simple string as placeholder is not enough and you want bold
    text, icons and such. In that case you can pass a
    <code>placeholderComponent</code>, on which you can do pretty much anything.
  </p>

  <CodeExample @glimmerTs="the-trigger-4.gts">
    {{TheTrigger4}}
  </CodeExample>

  <p>
    You can pass both
    <code>placeholderComponent</code>
    and
    <code>placeholder</code>. Inside your component the placeholder text will be
    available.
  </p>

  <h2 class="t3">Clear button</h2>

  <p>
    Sometimes you want to allow the users to clear the selection they just made.
    Regular selects don't allow that, but here is very simple, just pass
    <code>allowClear=true</code>.
    <strong>Please note that this option has no effect in multiple select field</strong>
  </p>

  <CodeExample @glimmerTs="the-trigger-5.gts">
    {{TheTrigger5}}
  </CodeExample>

  <p>
    When the user clicks in the trigger the dropdown with the options appears.
    It's the most complex part of the component and the subject of the next
    chapter.
  </p>

  <h2 class="t3">HTML attributes</h2>

  <p>
    The trigger component is invoked with
    <code>...attributes</code>
    so any general HTML attributes passed to the component will be set on the
    trigger.
  </p>

  <CodeExample @glimmerTs="the-trigger-6.gts">
    {{TheTrigger6}}
  </CodeExample>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.multiple-selection"
      class="doc-page-nav-link-prev"
    >&lt; Multiple selection</LinkTo>
    <LinkTo
      @route="public-pages.docs.the-list"
      class="doc-page-nav-link-next"
    >The list &gt;</LinkTo>
  </div>
</template>
