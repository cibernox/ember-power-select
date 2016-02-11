# Master

# 0.9.0-beta.2
- [FEATURE] Now you can type in closed single selects and automatically select the first match as you type.
  The typed text is erased after one second. It doesn't work in closed multiple select without searchbox (what would be the correct behavior?)
- [FEATURE] Now you can type in opened selects witout searcbox (multiple or single) to highlight the
  first marching option as you type. The typed text is erased after one second.
- [FEATURE] Search can be disabled in multiple selects, instead of only in single selects.
- [BUGFIX] Pressing enter in a select without searchbox correctly selects the highlighted element

# 0.9.0-beta.1
- [FEATURE] Proper Accesibility!! Lots of roles and `aria-*` tags have been added to make the component
  friendly, according with the guidelines in [the RFC](https://github.com/cibernox/ember-power-select/issues/293)
- [BUGFIX] When the component received a promise as `options` and also a `search` action, clearing
  the search must show the content of that promise.
- [FEATURE] The `.ember-power-select-option`s added to wrap the `noMatchesMessage` and the `searchMessage`
  have special classes to help styling them (`ember-power-select-option--no-matches-message` & `ember-power-select-option--search-message`)
- [BUGFIX] Single selects without searchbox can be focused normally. Fixed updating ember-basic-dropdown.
  Ember basic dropdown was calling `preventDefault` on the mousedown event to prevent the user to
  select text when moving the mouse between the mouseup and the mousedown. Now the event is not defaultPrevented,
  it uses another technique.
- [BUGFIX] When the list of options is empty but the component is given a search action, it should
  not show the `No results found` until the user actually performs a search and there and it comes
  empty.
- [BREAKING] The `ember-power-select-options--nested` class is not used anymore. Now nested groups
  have `role=group`, and the top-most one has `role=listbox`.
- [BREAKING] The `*--open` class on the `.ember-power-select` div has been removed. Now styles
  target `[aria-expanded=true/false]`, and it applies to the trigger, not to the top-most div.
  People explicitly targeting this class in they styles will need to update.
- [BREAKING] **Warning**. Classes ending in `--disabled`, `--highlighted` and `--selected` have been
  replaced by aria attributes `[aria-disabled="true"]`, `[aria-current="true"]` and `[aria-selected="true"]`
  respectively. Those attributes are needed for a11y and the recomendation is to style based on them
  instead of classes.
  Styles have been updated accordingly, so people using them and customizing the appearance using the
  sass variables won't notice anything, but people that relied on those classes for overriding styles
  will have to update them.
- [TESTING] Run fasboot tests as part of CI
- [TESTING] Add fastboot tests harness.
- [FEATURE] Initial Fastboot support!!
- [INTERNAL] Removed deprecated properties
- [INTERNAL] Updated mirage, liquidfire, ember-try and others.
- [FEATURE] `$ember-power-select-line-height` variable can have units now.

# 0.9.0-beta.0
- [IMPROVEMENT] Multiple select's trigger uses flexbox to improve appearance and behavior. In browsers
  without flexbox works as it did before.
- [FEATURE] Multiple selects have a distintive class in the trigger so they be styled accordingly.
- [BUGFIX] Modify the searchText programatically (through the `select.actions.search('foo')` per example)
  updates the input, respecting the cursor position.

# 0.8.6
- [BUGFIX] If the trigger grows in height because the input becomes too long to fit in one line,
  the list of options is repositioned automatically.
- [PERF] A couple of perf improved like avoiding some extra calls to `action` to wrap what already
  are closure actions. The ember-basic-dropdown also uses `Ember.run.join` to avoid one extra runloop.
- [FEATURE] The select exposes an action to manually trigger a reposition. This is a very low level
  thing that probably nobody but me will use.
- [BUGFIX] The input of the multiple component should have a transparent background by default. It's
  probably the desired behaviour almost all situations.
- [BUGFIX] Ensure the input of the multiple select flows to the next line when number of selections
  make the select grow to a second line.

# 0.8.5
- [BUGFIX] Disabled components are not focusable.
- [BUGFIX] Ensure the second argument yielded to the block is the searchText corresponding to the
  results being displayed. This is formally more correct and also save an expensive re-render that
  can cause the component to jank in sufficiently bug/complex selects. This is potentially breaking,
  but very unlikely.

# 0.8.4
- [BUGFIX] Ensure that if the component is destroyed while an async search is in
  progress it doesn't fail.
- [BUGFIX] Ensure that when clearing the search input any pending search

# 0.8.3
- [BUGFIX] Ensure that pressing enter when there is no highlighted element (p.e after a search without results)
  closes the component without calling the onchange function.
- [BUGFIX] Update ember-basic-dropdown to 0.8.5+ fixes positioning issues in IE11 and fatal error in browsers without
  MutationObserver (effectively only ie10 )
- [BUGFIX] the "publicAPI" object passed as penultimate object to the public actions includes a `highlighted`
  property and the `action.select` function to enable more customization.
- [DOC] Document architectural decissions of the component.

# 0.8.2
- [BUGFIX] Update ember-basic-dropdown again to fix bad positioning issue.
- [INTERNAL] Stop using ArrayProxy internally. That saves some double render, improving performance
  when filtering greatly (+100%) and very slightly in initial openinig (+5%)
- [BUGFIX] The `search` and `highlight` functions in the public API weren't working because they
  missed a binding to the dropdown.

# 0.8.1
- [BUGFIX] Update ember-basic-dropdown.

# 0.8.0
- [INTERNAL] Update to ember-cli 2.3.0-beta.1
- [ENHANCEMENT] The mouseup over on element of the list doesn't selects that element if the mouse is
  still in the same coordinates (+/- 2px) of the mousedown that opened the component. This allows the
  options list to be rendered over the trigger and not wrongly select the element above the trigger

# 0.8.0-beta.12
- [BUGFIX] default `beforeOptions` component only clear the search on destroy when the search is enabled.

# 0.8.0-beta.11
- [BUGFIX] Not it's responsability of the component holding the searchbox to clear (or not) clear the
  search when the component is closed. The default components (single/multiple) do it. Maybe breaking??

# 0.8.0-beta.10
- [BUGFIX] Trigger should use clearfix so when the amount of options selected (multiple selects) overflows
  the available width is grows.

# 0.8.0-beta.9
- [BUGFIX] Do not use `let` in node code (unless you want node 0.12 to break)

# 0.8.0-beta.8
- [BUGFIX] Ensure that the `included` hook works when invoked from another addon (being a dependency)
  instead of directly by the consumer app, and also that the function is a noop the 2nd time it's invoked.

# 0.8.0-beta.7
- [BUGFIX] Not returning from the `search` action but instead setting `options` to a promise does not
  prevent subsequent searches.
- [BUGFIX] Pressing Backspace to delete the last selected option in multiple select when options are not
  plain strings now works as expected. It makes `searchField` mandatory, and asserts its presence.
- [INTERNAL] Refactor internals to don't force people providing custom components for slots to
  implement that much logic on it. Also logic for the `closeOnSelect` configuration lies in a single place.

# 0.8.0-beta.6
- [INTERNAL] Remove unnecesary action. Makes customization of triggerComponent easier.

# 0.8.0-beta.5
- [BUGFIX] Do not rely on significant whitepace + inlineBlock for styling selections in multiple select.
  Use float: left

# 0.8.0-beta.4
- [FEATURE] Added a new slot that can be customized with the `selectedItemComponent`. This allows to
  customize the markup of the selected option(s) without forcing the user to customize the entire
  trigger component. This doesn't enable any new pattern but makes customization easier.
- [BREAKING] `dropdownPosition` is now `verticalPosition`. It will continue to work until 0.9 but throwing
  a deprecation warning.

# 0.8.0-beta.3
- [BUGFIX] `{{power-select-multiple}}` has fallback values for the component names. Makes it composable.
- [BREAKING] Renamed `selectedComponent` to `triggerComponent`, which is more accurate, in preparation
  to add a `selectedItemComponent` soon. `selectedComponent` continues to work, but throws a deprecation.
- [FEATURE] Add new sass variables for customize the border & padding of each option in multiple mode,
  and the padding of the trigger in ltr/rtl modes.

# 0.8.0-beta.2
- [INTERNAL] Update ember-cli
- [BUGFIX] Update deps to ember-basic-dropdown 0.7.2. Fixed duplicated wormhole placeholder when
  ember-basic-dropdown is also a direct dependency of the project.

# 0.8.0-beta.1

- [BREAKING] Eliminame multiple mode and create `{{#power-select-multiple}}` as a separated component
  for dogfooding
- [BREAKING] The name of the selected property inside the custom components is now `selected` instead of `selection`
  for consistency with the external API.
- [BREAKING] More bahaviour has been transfered from the main components to the default implementation
  of the `selectedComponent`, `optionsComponent` and `beforeOptionsComponent`. This makes the component
  more flexible but less straigtforward to extend. The API for extending the component was never publish
  but still, expect things to break.


# 0.7.2
- [FEATURE] Allow to pass a component name under in `afterOptionsComponent` to customize the content after the options list.
- [FEATURE] Allow to pass a component name under in `beforeOptionsComponent` to customize the content before the options list.
  of the dropdown before the list of option. In single mode the default is the search input. In multiple mode the default is empty.
- [BREAKING] Remove the need of different templates between multiple and single mode, by having a
  new `beforeOptions` component that can be customized, and by moving the `loadingMessage` logic
  to the `optionsComponent`. This might be breaking, but quite unlikely.

# 0.7.1

- [INTERNAL] Make integration test helpers runloop aware to dry tests.
- [BUGFIX] The highliged element is reseted to default when the component is closed.
- [BUGFIX] Update ember-basic-dropdown to defaultPrevent the behavior if the mousedown that opens the
  component, so the user does not select text if moves the finger before releasing the mouse.

# 0.7.0
- [FEATURE] Finalize implementation of `selectChoose` and `selectSearch` that work in all supported
  versions of ember. Added docs for them.

# 0.7.0-beta.6
- [FEATURE] Add initial implementation of `selectChoose` acceptance helper to make
  interaction with the component nicer.
- [FEATURE] Add ARIA roles for basic accesibility. Still more work on this area.
- [FEATURE] Expose test helpers to the consumer app to make integration tests nicer.

# 0.7.0-beta.5
- [BUGFIX] Use `onmousedown` also in clear button (single and multiple modes) to ensure list is not opened.
- [BREAKING] EPS no longer exports the `defaultConfig` because it's not needed anymore.
  Passing an undefined values for default values does not overrides the default values (null/false do).
  This makes composability easy because creating a wrapper around the component can just forward
  all properties `{{#power-select searchEnabled=searchEnabled selectedComponent=selectedComponent}}`
  without worrying about if this values is defined or not.

# 0.7.0-beta.4
- [BUGFIX] On a select with a selected value, if the selected value is not among the results, the
  first results becomes the highlighted one. Before this fix none was highlighted.

# 0.7.0-beta.3
- [BREAKING] The event the triggers the selection of an item is mouseup, not click, meaning that the only
  thing that matters is where the finger is lifted. This is how real selects work in chrome/safari/firefox,
  and so should this. Given that the component opens on mousedown, this allows the user to open and select
  with only one movement.
  Real usage shouldn't break, not acceptance tests, but integration tests using `$().click()` will. Replace
  this `$().mouseup()`.
- [FEATURE] EPS now accepts a `triggerClass` which is applied to the trigger.

# 0.7.0-beta.2
- [FEATURE] All actions (onchange, onkeydown and onfocus) now receive a richer public API object
  that is identical in shape to the one they received before but also contains `highlight(option)`
  and `search(term)` actions
- [BREAKING] Delegate the rendering of the list's topmost element to `optionsComponent`. This
  allows a better customization of the list. If you use `optionsComponent` make sure you make it render
  the topmost element, e.g an `<ul>`.

# 0.7.0-beta.1
- [BREAKING] Update to ember-basic-dropdown 0.7.0-beta.1. This means that the component is opened/
  closed using mousedown instead of click. This makes the component feel more snappy. It is unlikeliy
  that this breaks real world usage but might break integration tests of people where people rely
  on `$('.ember-power-select-trigger').click()`.
- [FEATURE] New action: `onfocus`. Unsurprisingly it is invoked when the component gains focus.
  It receives `(dropdown, event)` and can be used, by example, to open the component on focus.
- [FEATURE] EPS now accepts a `opened` boolean property used to open/close the component
  without triggering events on it. Useful to render the component already opened.

# 0.6.3
- [BUGFIX] Fix rendenring issue triggered somehow by Ember 2.2. Fixed in ember-basic-dropdown.
- [REFACTOR] The list of results and the highlighted element are not computed properties, so they are lazy.

# 0.6.2
- [BUGFIX] Use getOwner polyfill to avoid deprecations in ember 2.3

# 0.6.1
- [DOCS] Add API reference table to the docs
- [FEATURE] Yielded block receives the search term as a second argument

# 0.6.0
- [DOCS] Fix async search using github API example

# 0.6.0-beta.6
- [DOCS] Document how to disable specific option
- [DOCS] Add troubleshooting section with most common pitfalls.
- [FEATURE] The user can provide a `onkeydown` action that will be invoked whenever the user
  presses a key being the component (of the searchbox inside) focused. This enables to create
  selects components that can create options on the fly (tags).
  This action received the dropdown as first argument and the event as second argument

# 0.6.0-beta.5
- [BUGFIX] Update ember-basic-dropdown to be sure dropdown reposition is runloop aware.

# 0.6.0-beta.4
- [BUGFIX] Component not detects aditions aditions/removals to the `options`, not just substututions
  of the entire collection.
- [BUGFIX] The overflow-y should be auto to not show the bar until it's required by the height of the
  option list.

# 0.6.0-beta.3
- [BUGFIX] Remove loading state if a promise fullfils after the dropdown has been closed

# 0.6.0-beta.2
- [BUGFIX] Update to ember-cli 1.13.13 to remove `[DEPRECATED] this.Funnel ...`  message.
- [BUGFIX] Fix styles when rendering the component in place
- [BUGFIX] Fix position calculation in firefox.
- [BUGFIX] Using `dropdownPosition=above|below` adds the proper class names to the component.
- [DOCS] Fixed typos and outdated links.

# 0.6.0-beta.1
- [BUGFIX] Add missing `this._super.included(app);` in the included hook so runtime dependencies are
  required.

# 0.6.0-beta.0
- [BREAKING CHANGE] The arguments received by the `selectComponent` and `optionsComponent` have changed
  significantly as a result of an internal refactor. It should not affect to people that have not created
  their own customized versions of ember-power-select.
- [BUGFIX] Ensure that open the dropdown after a search does not clear the results. Results are not
  cleared when the component is closed, like the `searchText`.
- [BUGFIX] Ensure `options` and `search` play nicely toguether. The given options are the initial set of
  results until the user performs the first search. From that point on they diverge.
- [BUGFIX] Not return from the `search` action is now legal. If you do so, you need to take care
  of updating the `options` yourself, and unless you make options a promise, you will loose the
  loading state.

# 0.5.2
- [BUGFIX] Don't render one option for the Loading message if this is falsey

# 0.5.1
- [BUGFIX] Fix automatic scroll when navigating using arrows.

# 0.5.0
- [BREAKING CHANGE] Some classes have changed to be more BEMy and avoid class collisions. You can expect
  things like `.nested`, `.selected`, `.highlighted`, etc.. to be not copies of the default class of that
  element but with `--nested`, `--selected`, etc... modifiers.
- [BREAKING CHANGE] The arrow of the dropdown is not longer a background image, but an `<span class="ember-power-select-status-icon">`,
  that you can style in more complex ways. By default is still a triangle (but done with css borders instead)
- [BUGFIX] Fixed `rtl`/`ltr` styles.

# 0.4.4
- [ENHANCEMENT] Allow to customize tabindex of the trigger
- [ENHANCEMENT] Pass `select` action and `highlighted` option to the selectedComponent to allow better
  customization

# 0.4.3
- [ENHANCEMENT] Pass `search` action to the selected component also for single component.
  This enables ember-power-select to to be the base for typeahead-like components.
- [BUGFIX] Fix placeholder of multiple select showing "null".

# 0.4.2
- [BUGFIX] Stop propagation of the events that trigger the `select` action. This was preventing
  to use this component within another component that closes when clicking on the body, like
  the ember-basic-dropdown

# 0.4.1
- [BUGFIX] Get subpixed precission on Y coordinates too by updating to ember-basic-dropdown 0.4.7

# 0.4.0
- [BREAKING] Remove {{ember-power-select}} deprecated alias for {{power-select}}
- [BREAKING] Remove `ember-power-select-wrapper` wrapped div that was not customizable and made styling harder.
             Now the topmost element is the `ember-power-select` itself.
- [BUGFIX] Update ember-basic-dropdown to fix rounding error that caused list of options have 1px mismatch in HD screens
- [TOOLING] Update to ember-cli 1.13.10

# 0.3.9
- [BUGFIX] Apply `dropdownClass` to the dropdown

# 0.3.8
- [BUGFIX] Disable the input of multiple selects when the entire component is disabled
- [BUGFIX] Don't show the cross to remove items when the entire component is disabled
- [ACCESIBILITY] Add aria-label to cross to remove items in multiple mode

# 0.3.7
- [BUGFIX] Open multiple select when the user types on the input of the trigger

# 0.3.6
- [REFACTOR] Variables in it's own file for encapsulations and allow more fine-grained customizations

# 0.3.5
- [BUGFIX] Update ember-basic-dropdown to fix deprecation warning coming from accessing `_actions`.
- [INTERNAL] For consistency, since the component's name was shortened to {{power-select}}, all internal
  components have been renamed too. No public API changes.

# 0.3.4
- [BUGFIX] Fix placeholder bug in multiple selects (show "null" as placeholder)
- [BUGFIX] Fix unused scss variable ($ember-power-select-text-color) and make it `inherit` by default instead of `#444`.
- [DOCS] Clarify that in "How to use" section selects are broken intentionally to explain why explicitness is good.

# 0.3.3
- [DEPRECATION] Renamed component from {{ember-power-select}} to just {{power-select}} and deprecate the long name.
- [BUGFIX] Increate z-index to 1000 (same that bootstrap uses for dropdowns)
- [BUGFIX] Add support for placeholder in multiple mode
- ... some internal refactors to make the selected item easier to customize

# 0.3.2
- [BUGFIX] Pressing enter on a closed multiple select should open it.
- [ENHANCEMENT] Pressing UP/DOWN arrows on a closed select (single or multiple) opens it

# 0.3.1
- [ENHANCEMENT] Added `closeOnSelect` option (defaults to true) to customize that behavior.
- [ENHANCEMENT] The `onchange` action is not invoked with the `dropdown` as second argument. That
  object contains methods like `open`, `close` and `toggle` that give control over the
  dropdown to the user.
- [BUGFIX] Select that specify a `search` action can also receive `options` now, and that collection
  is displayed until the user performs the first search.
- [BUGFIX] The `search` action now is also triggered when the search term is an empty string.

# 0.3.0
- [BREAKING CHANGE] The component is truly immutable now. The value inside the trigger (the selected value) won't update unless
  the user explicitly does so inside the `onchange` action. Since selection never were propagated upstream this shouldn't
  bite anyone: A select component without an action handles was pointless anyway. Now there is an assertion that will raise
  an error if no `onchange` action is provided (or it's not a function).
- [ENHANCEMENT] The component used to render the list is not replaceable. That allows almost complete customization.


# 0.2.6
- [BUGFIX] Workaround bug in ember <= 1.13.8
- [ENHANCEMENT] Added basic bootstrap styles.

# 0.2.1
- [REFACTOR] Divide component internally into ember-power-select/simple and ember-power-select/multiple
- [BUGFIX] Fix bug where dropdown didn't close when selecting an option inside a group.
- [BUGFIX] Fix ember-wormhole destination not being added to the body footer. Solved by calling contentFor of dependencies.
- [ENHANCEMENT] Update to ember-basic-dropdown 2.0. That yields a hash with public API on it.

# 0.2.0

- [BUGFIX] Fix compatibility with Ember 1.13 and add it to ember-try
- [ENHANCEMENT] Simplified code greatly by using ember-basic-dropdown underneath.
- [DOCS] Several typos
