import CodeExample from 'docs/components/code-example';
import { LinkTo } from '@ember/routing';
import ActionHandling1 from '../../../components/snippets/action-handling-1';
import ActionHandling2 from '../../../components/snippets/action-handling-2';
import ActionHandling3 from '../../../components/snippets/action-handling-3';
import ActionHandling4 from '../../../components/snippets/action-handling-4';
import ActionHandling5 from '../../../components/snippets/action-handling-5';
import ActionHandling6 from '../../../components/snippets/action-handling-6';
import ActionHandling7 from '../../../components/snippets/action-handling-7';

<template>
  <h1 class="doc-page-title">Action handling</h1>

  <p>
    Ember power select aims to be maximally flexible and because of that it
    doesn't try to make strong assumptions about how you want to use it. Instead
    it embraces DDAU
    <em>(Data Down Actions Up)</em>
    philosophy of Ember 2.0 so data flow always is unidirectional and explicit.
  </p>

  <p>
    Data changes that occur in the component are not propagated to the outside
    using two-way bindings, but rather they are communicated via actions.
  </p>

  <p>
    This section describes the available actions with the notable exception of
    the
    <code>search</code>, because there is an entire section dedicated to it, and
    gives you some examples of what you can do with each of them.
  </p>

  <h2 class="t3"><code>onChange</code> Action</h2>

  <p>
    This action will fire whenever an option of the component is selected or
    unselected.
  </p>

  <p>
    The most common use case when you want changes inside a component to do
    something on its context is expressed this way:
  </p>

  <CodeExample @glimmerTs="action-handling-1.gts">
    {{ActionHandling1}}
  </CodeExample>

  <p>
    That gives you the freedom of doing whatever suits your needs when the user
    selects a value.
    <br />
    If the only thing you want to do is update the value, you can make it more
    concise by using the
    <code>mut</code>
    helper.
  </p>

  <CodeExample @glimmerTs="action-handling-2.gts">
    {{ActionHandling2}}
  </CodeExample>

  <p>
    It might seem a bit more verbose at first for this, the simplest use case
    possible, but it simplifies a lot the mental model and enables some advanced
    usages that would otherwise be very tricky to implement.
  </p>

  <h2 class="t3"><code>onKeydown</code> Action</h2>

  <p>
    The second option you can provide to the component to customize it's
    behavior is
    <code>onKeydown</code>. This option will be fired whenever the user presses
    a key while the component or the search input inside have the focus.
  </p>

  <p>
    This action receives two arguments,
    <code>dropdown</code>
    and
    <code>event</code>. The first one is an object that you can use to control
    the component through its actions (open, close, toggle...). The event is the
    raw
    <code>keydown</code>
    event you can use to decide what to do next. If you desire to hijack the
    browser's default bahaviour you can call
    <code>preventDefault</code>
    on that event. If you want to avoid the component's default behaviour (e.g.,
    open/close the select or navigate through the options using the arrow keys)
    return
    <code>false</code>
    from this action.
  </p>

  <p>
    One particular common use case for this action is to add new options in
    multiple selects when the user introduces free text.
  </p>

  <CodeExample @glimmerTs="action-handling-3.gts">
    {{ActionHandling3}}
  </CodeExample>

  <h2 class="t3"><code>onInput</code> Action</h2>

  <p>
    Selects might have searchboxes. When you type on them you usually want to
    search, which is the default behaviour, but what if you whant to do other
    things before searching? Then you have the
    <code>onInput</code>
    action that is fired before the search.
  </p>

  <p>
    This action gives you the opportunity to react to any change in the inputs
    of the select, even when the inputs are emptied, because the
    <code>search</code>
    action doesn't fire in that case. If you return false from this action, you
    will prevent the default behavior, which is searching.
  </p>

  <p>
    Let's create a select that searches only if the length of the search is
    bigger than 3 chars.
  </p>

  <CodeExample @glimmerTs="action-handling-4.gts">
    {{ActionHandling4}}
  </CodeExample>

  <h2 class="t3"><code>onFocus/onBlur</code> Actions</h2>

  <p>
    The next actions you can use are
    <code>onFocus/onBlur</code>. It does exactly what the names suggests and
    receives
    <code>(select, event)</code>
  </p>

  <p>
    You can use this action for many things (fire a request to prefetch data,
    show a tooltip, trigger some animation ...) but perhaps the most
    straightforward use case is to automatically open the component on focus.
  </p>

  <CodeExample @glimmerTs="action-handling-5.gts">
    {{ActionHandling5}}
  </CodeExample>

  <p>
    Note that this action will be fired when the component or another element
    inside, like the searchboxes, gain the focus, and sometimes you need which
    one triggered the focus/blur event. Since the
    <code>FocusEvent</code>
    is received as last argument, you can check
    <code>event.target</code>
    to know what element gets the focus, and
    <code>event.relatedTarget</code>
    to know the element that had the focus before.
  </p>

  <h2 class="t3"><code>onOpen/onClose</code> Actions</h2>

  <p>
    As their names suggest, these actions are fired when the component is about
    to be opened or closed respectively, and they both have the same signature
    <code>(select, event)</code>
    (the event will be undefined if the component is not opened as result of
    user interaction).
  </p>

  <p>
    You can use this action for many useful purposes, but since the troll-force
    is strong in me, I want to show a useless example: The select components for
    spies!
  </p>

  <CodeExample @glimmerTs="action-handling-6.gts">
    {{ActionHandling6}}
  </CodeExample>

  <p>
    Another neat trick is that you can prevent the component from open/close if
    you return
    <code>false</code>
    from these actions, so you have the last word. This is all it takes to
    create a mandatory select component that once opened cannot be closed until
    you select some value, and changes the styles of the component.
  </p>

  <CodeExample @glimmerTs="action-handling-7.gts">
    {{ActionHandling7}}
  </CodeExample>

  <p>
    Have I mentioned that your can also render groups?
  </p>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.how-to-use-it"
      class="doc-page-nav-link-prev"
    >&lt; How to use it</LinkTo>
    <LinkTo
      @route="public-pages.docs.groups"
      class="doc-page-nav-link-next"
    >Groups &gt;</LinkTo>
  </div>
</template>
