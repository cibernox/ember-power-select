import { buildTask } from 'ember-concurrency/async-arrow-runtime';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, get } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { removeObserver, addObserver } from '@ember/object/observers';
import { scheduleTask } from 'ember-lifeline';
import { isNone, isEqual } from '@ember/utils';
import { assert, deprecate } from '@ember/debug';
import { pathForOption, countOptions, indexOfOption, advanceSelectableOption, defaultHighlighted, defaultMatcher, filterOptions, defaultTypeAheadMatcher, findOptionWithOffset } from '../utils/group-utils.js';
import { timeout } from 'ember-concurrency';
import { modifier } from 'ember-modifier';
import '@ember/application';
import { isArray } from '@ember/array';
import { precompileTemplate } from '@ember/template-compilation';
import { g, i, n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{#if (or @labelText @labelComponent)}}\n  {{#let (if\n    @labelComponent\n    (component (ensure-safe-component @labelComponent))\n    (component \'power-select/label\')\n  ) as |Label|}}\n    <Label\n      @select={{this.storedAPI}}\n      @labelText={{@labelText}}\n      @labelId={{this.labelId}}\n      @triggerId={{this.triggerId}}\n      @extra={{@extra}}\n      class={{@labelClass}}\n    />\n  {{/let}}\n{{/if}}\n<BasicDropdown\n  @horizontalPosition={{@horizontalPosition}}\n  @destination={{@destination}}\n  @initiallyOpened={{@initiallyOpened}}\n  @matchTriggerWidth={{this.matchTriggerWidth}}\n  @preventScroll={{or @preventScroll false}}\n  @onClose={{this.handleClose}}\n  @onOpen={{this.handleOpen}}\n  @renderInPlace={{@renderInPlace}}\n  @verticalPosition={{@verticalPosition}}\n  @disabled={{@disabled}}\n  @calculatePosition={{@calculatePosition}}\n  @triggerComponent={{ensure-safe-component @ebdTriggerComponent}}\n  @contentComponent={{ensure-safe-component @ebdContentComponent}}\n  @rootEventType={{or @rootEventType \"mousedown\"}}\n  as |dropdown|>\n  {{#let (assign dropdown (hash\n    selected=this.selected\n    highlighted=this.highlighted\n    options=this.options\n    results=this.results\n    resultsCount=this.resultsCount\n    loading=this.loading\n    isActive=this.isActive\n    searchText=this.searchText\n    lastSearchedText=this.lastSearchedText\n    actions=(assign dropdown.actions this._publicAPIActions)\n  )) (concat \"ember-power-select-options-\" dropdown.uniqueId) as |publicAPI listboxId|}}\n    {{!-- template-lint-disable no-positive-tabindex --}}\n    <dropdown.Trigger\n      @eventType={{or @eventType \"mousedown\"}}\n      {{this.updateOptions @options}}\n      {{this.updateSelected @selected}}\n      {{this.updateRegisterAPI publicAPI}}\n      {{this.updatePerformSearch this.searchText}}\n      {{on \"keydown\" this.handleTriggerKeydown}}\n      {{on \"focus\" this.handleFocus}}\n      {{on \"blur\" this.handleBlur}}\n      class=\"ember-power-select-trigger {{@triggerClass}}{{if publicAPI.isActive \" ember-power-select-trigger--active\"}}\"\n      aria-activedescendant={{if dropdown.isOpen (unless @searchEnabled (concat publicAPI.uniqueId \"-\" this.highlightedIndex))}}\n      aria-controls={{if (and dropdown.isOpen (not @searchEnabled)) listboxId}}\n      aria-describedby={{@ariaDescribedBy}}\n      aria-haspopup={{unless @searchEnabled \"listbox\"}}\n      aria-invalid={{@ariaInvalid}}\n      aria-label={{@ariaLabel}}\n      aria-labelledby={{this.ariaLabelledBy}}\n      aria-owns={{if (and dropdown.isOpen (not @searchEnabled)) listboxId}}\n      aria-required={{@required}}\n      aria-autocomplete={{if @searchEnabled \"list\"}}\n      role={{or @triggerRole \"combobox\"}}\n      title={{@title}}\n      id={{this.triggerId}}\n      tabindex={{and (not @disabled) (or @tabindex \"0\")}}\n      ...attributes\n    >\n      {{#let\n        (if\n          @triggerComponent\n          (component (ensure-safe-component @triggerComponent))\n          (component \'power-select/trigger\')\n        )\n      as |Trigger|}}\n        <Trigger\n          @allowClear={{@allowClear}}\n          @buildSelection={{@buildSelection}}\n          @loadingMessage={{or @loadingMessage \"Loading options...\"}}\n          @selectedItemComponent={{ensure-safe-component @selectedItemComponent}}\n          @select={{publicAPI}}\n          @searchEnabled={{@searchEnabled}}\n          @searchField={{@searchField}}\n          @onFocus={{this.handleFocus}}\n          @onBlur={{this.handleBlur}}\n          @extra={{@extra}}\n          @listboxId={{listboxId}}\n          @onInput={{this.handleInput}}\n          @onKeydown={{this.handleKeydown}}\n          @placeholder={{@placeholder}}\n          @placeholderComponent={{if\n            @placeholderComponent\n            (ensure-safe-component @placeholderComponent)\n            (component \'power-select/placeholder\')\n          }}\n          @ariaActiveDescendant={{concat publicAPI.uniqueId \"-\" this.highlightedIndex}}\n          @ariaLabelledBy={{this.ariaLabelledBy}}\n          @ariaDescribedBy={{@ariaDescribedBy}}\n          @ariaLabel={{@ariaLabel}}\n          @role={{@triggerRole}}\n          as |opt select|>\n          {{yield opt select}}\n        </Trigger>\n      {{/let}}\n    </dropdown.Trigger>\n    <dropdown.Content\n      class=\"ember-power-select-dropdown{{if publicAPI.isActive \" ember-power-select-dropdown--active\"}} {{@dropdownClass}}\"\n      @animationEnabled={{@animationEnabled}}\n    >\n      {{#if (not-eq @beforeOptionsComponent null)}}\n        {{#let\n          (if\n            @beforeOptionsComponent\n            (component (ensure-safe-component @beforeOptionsComponent))\n            (component \'power-select/before-options\')\n          )\n        as |BeforeOptions|}}\n          <BeforeOptions\n            @select={{publicAPI}}\n            @searchEnabled={{@searchEnabled}}\n            @onInput={{this.handleInput}}\n            @onKeydown={{this.handleKeydown}}\n            @onFocus={{this.handleFocus}}\n            @onBlur={{this.handleBlur}}\n            @placeholder={{@placeholder}}\n            @placeholderComponent={{or @placeholderComponent (component \'power-select/placeholder\')}}\n            @extra={{@extra}}\n            @listboxId={{listboxId}}\n            @ariaActiveDescendant={{if this.highlightedIndex (concat publicAPI.uniqueId \"-\" this.highlightedIndex)}}\n            @selectedItemComponent={{ensure-safe-component @selectedItemComponent}}\n            @searchPlaceholder={{@searchPlaceholder}}\n            @ariaLabel={{@ariaLabel}}\n            @ariaLabelledBy={{this.ariaLabelledBy}}\n            @ariaDescribedBy={{@ariaDescribedBy}}\n            @triggerRole={{@triggerRole}}\n          />\n        {{/let}}\n      {{/if}}\n      {{#if this.mustShowSearchMessage}}\n        {{#let\n          (if\n            @searchMessageComponent\n            (component (ensure-safe-component @searchMessageComponent))\n            (component \'power-select/search-message\')\n          )\n        as |SearchMessage|}}\n          <SearchMessage\n            @searchMessage={{this.searchMessage}}\n            @select={{publicAPI}}\n            id={{listboxId}}\n            aria-label={{@ariaLabel}}\n            aria-labelledby={{this.ariaLabelledBy}}\n          />\n        {{/let}}\n      {{else if this.mustShowNoMessages}}\n        {{#let\n          (if\n            @noMatchesMessageComponent\n            (component (ensure-safe-component @noMatchesMessageComponent))\n            (component \'power-select/no-matches-message\')\n          )\n         as |NoMatchesMessage|}}\n          <NoMatchesMessage\n            @noMatchesMessage={{this.noMatchesMessage}}\n            @select={{publicAPI}}\n            id={{listboxId}}\n            aria-label={{@ariaLabel}}\n            aria-labelledby={{this.ariaLabelledBy}}\n          />\n        {{/let}}\n      {{else}}\n        {{#let\n          (if\n            @optionsComponent\n            (component (ensure-safe-component @optionsComponent))\n            (component \'power-select/options\')\n          )\n          (if\n            @groupComponent\n            (component (ensure-safe-component @groupComponent))\n            (component \'power-select/power-select-group\')\n          )\n        as |Options Group|}}\n          <Options\n            @loadingMessage={{or @loadingMessage \"Loading options...\"}}\n            @select={{publicAPI}}\n            @options={{publicAPI.results}}\n            @groupIndex=\"\"\n            @optionsComponent={{Options}}\n            @extra={{@extra}}\n            @highlightOnHover={{this.highlightOnHover}}\n            @groupComponent={{Group}}\n            role=\"listbox\"\n            aria-multiselectable={{if this.ariaMultiSelectable \"true\"}}\n            id={{listboxId}}\n            class=\"ember-power-select-options\" as |option select|>\n            {{yield option select}}\n          </Options>\n        {{/let}}\n      {{/if}}\n\n      {{#if @afterOptionsComponent}}\n        {{#let (component (ensure-safe-component @afterOptionsComponent)) as |AfterOptions|}}\n          <AfterOptions\n            @extra={{@extra}}\n            @select={{publicAPI}}\n          />\n        {{/let}}\n      {{/if}}\n      <div role=\"status\" aria-live=\"polite\" aria-atomic=\"true\" class=\"ember-power-select-visually-hidden\">\n        {{this.resultCountMessage}}\n      </div>\n    </dropdown.Content>\n  {{/let}}\n</BasicDropdown>");

const isSliceable = coll => {
  return isArray(coll);
};
const isPromiseLike = thing => {
  return typeof thing.then === 'function';
};
const isPromiseProxyLike = thing => {
  return isPromiseLike(thing) && Object.hasOwnProperty.call(thing, 'content');
};
const isCancellablePromise = thing => {
  return typeof thing.cancel === 'function';
};
class PowerSelectComponent extends Component {
  // Untracked properties
  _publicAPIActions = {
    search: this._search,
    highlight: this._highlight,
    select: this._select,
    choose: this._choose,
    scrollTo: this._scrollTo,
    labelClick: this._labelClick
  };

  // Tracked properties
  static {
    g(this.prototype, "_resolvedOptions", [tracked]);
  }
  #_resolvedOptions = (i(this, "_resolvedOptions"), void 0);
  static {
    g(this.prototype, "_resolvedSelected", [tracked]);
  }
  #_resolvedSelected = (i(this, "_resolvedSelected"), void 0);
  static {
    g(this.prototype, "_repeatingChar", [tracked], function () {
      return '';
    });
  }
  #_repeatingChar = (i(this, "_repeatingChar"), void 0);
  static {
    g(this.prototype, "_expirableSearchText", [tracked], function () {
      return '';
    });
  }
  #_expirableSearchText = (i(this, "_expirableSearchText"), void 0);
  static {
    g(this.prototype, "_searchResult", [tracked]);
  }
  #_searchResult = (i(this, "_searchResult"), void 0);
  static {
    g(this.prototype, "isActive", [tracked], function () {
      return false;
    });
  }
  #isActive = (i(this, "isActive"), void 0);
  static {
    g(this.prototype, "loading", [tracked], function () {
      return false;
    });
  }
  #loading = (i(this, "loading"), void 0);
  static {
    g(this.prototype, "searchText", [tracked], function () {
      return '';
    });
  }
  #searchText = (i(this, "searchText"), void 0);
  static {
    g(this.prototype, "lastSearchedText", [tracked], function () {
      return '';
    });
  }
  #lastSearchedText = (i(this, "lastSearchedText"), void 0);
  static {
    g(this.prototype, "highlighted", [tracked]);
  }
  #highlighted = (i(this, "highlighted"), void 0);
  storedAPI;
  _uid = guidFor(this);
  _lastOptionsPromise;
  _lastSelectedPromise;
  _lastSearchPromise;
  _filterResultsCache = {
    results: [],
    options: [],
    searchText: this.searchText
  };

  // Lifecycle hooks
  constructor(owner, args) {
    super(owner, args);
    assert('<PowerSelect> requires an `@onChange` function', this.args.onChange && typeof this.args.onChange === 'function');
  }
  willDestroy() {
    if (this._lastSelectedPromise && isPromiseProxyLike(this._lastSelectedPromise)) {
      try {
        removeObserver(this._lastSelectedPromise, 'content', this, this._selectedObserverCallback);
        // eslint-disable-next-line no-empty
      } catch {}
      this._lastSelectedPromise = undefined;
    }
    super.willDestroy();
  }

  // Getters
  get highlightOnHover() {
    return this.args.highlightOnHover === undefined ? true : this.args.highlightOnHover;
  }
  get labelClickAction() {
    return this.args.labelClickAction === undefined ? 'focus' : this.args.labelClickAction;
  }
  get highlightedIndex() {
    const results = this.results;
    const highlighted = this.highlighted;
    return pathForOption(results, highlighted);
  }
  get searchMessage() {
    return this.args.searchMessage === undefined ? 'Type to search' : this.args.searchMessage;
  }
  get noMatchesMessage() {
    return this.args.noMatchesMessage === undefined ? 'No results found' : this.args.noMatchesMessage;
  }
  get resultCountMessage() {
    if (typeof this.args.resultCountMessage === 'function') {
      return this.args.resultCountMessage(this.resultsCount);
    }
    if (this.resultsCount === 1) {
      return `${this.resultsCount} result`;
    }
    return `${this.resultsCount} results`;
  }
  get matchTriggerWidth() {
    return this.args.matchTriggerWidth === undefined ? true : this.args.matchTriggerWidth;
  }
  get mustShowSearchMessage() {
    return !this.loading && this.searchText.length === 0 && !!this.args.search && !!this.searchMessage && this.resultsCount === 0;
  }
  get mustShowNoMessages() {
    return !this.loading && this.resultsCount === 0 && (!this.args.search || this.lastSearchedText.length > 0);
  }
  get results() {
    if (this.searchText.length > 0) {
      if (this.args.search) {
        return toPlainArray(this._searchResult || this.options);
      } else {
        if (this._filterResultsCache.options === this.options && this._filterResultsCache.searchText === this.searchText) {
          // This is an optimization to avoid filtering several times, which may be a bit expensive
          // if there are many options, if neither the options nor the searchtext have changed
          return this._filterResultsCache.results;
        }
        const results = this._filter(this.options, this.searchText);
        // eslint-disable-next-line ember/no-side-effects
        this._filterResultsCache = {
          results,
          options: this.options,
          searchText: this.searchText
        };
        return results;
      }
    } else {
      return this.options;
    }
  }
  get options() {
    if (this._resolvedOptions) return toPlainArray(this._resolvedOptions);
    if (this.args.options) {
      return toPlainArray(this.args.options);
    } else {
      return [];
    }
  }
  get resultsCount() {
    return countOptions(this.results);
  }
  get selected() {
    if (this._resolvedSelected) {
      return toPlainArray(this._resolvedSelected);
    } else if (!isNone(this.args.selected) && typeof this.args.selected.then !== 'function') {
      return toPlainArray(this.args.selected);
    }
    return undefined;
  }
  get ariaMultiSelectable() {
    return isArray(this.args.selected);
  }
  get triggerId() {
    return this.args.triggerId || `${this._uid}-trigger`;
  }
  get labelId() {
    return `${this._uid}-label`;
  }
  get ariaLabelledBy() {
    if (this.args.ariaLabelledBy) {
      return this.args.ariaLabelledBy;
    }
    if (this.args.labelText || this.args.labelComponent) {
      return this.labelId;
    }
    return '';
  }

  // Actions
  handleOpen(_select, e) {
    if (this.args.onOpen && this.args.onOpen(this.storedAPI, e) === false) {
      return false;
    }
    if (e) {
      if (e instanceof KeyboardEvent && e.type === 'keydown' && (e.keyCode === 38 || e.keyCode === 40)) {
        e.preventDefault();
      }
    }
    this._resetHighlighted();
  }
  static {
    n(this.prototype, "handleOpen", [action]);
  }
  handleClose(_select, e) {
    if (this.args.onClose && this.args.onClose(this.storedAPI, e) === false) {
      return false;
    }
    this._highlight(undefined);
  }
  static {
    n(this.prototype, "handleClose", [action]);
  }
  handleInput(e) {
    if (e.target === null) return;
    const term = e.target.value;
    let correctedTerm;
    if (this.args.onInput) {
      correctedTerm = this.args.onInput(term, this.storedAPI, e);
      if (correctedTerm === false) {
        return;
      }
    }
    this._publicAPIActions.search(typeof correctedTerm === 'string' ? correctedTerm : term);
  }
  static {
    n(this.prototype, "handleInput", [action]);
  }
  handleKeydown(e) {
    if (this.args.onKeydown && this.args.onKeydown(this.storedAPI, e) === false) {
      return false;
    }
    return this._routeKeydown(this.storedAPI, e);
  }
  static {
    n(this.prototype, "handleKeydown", [action]);
  }
  handleTriggerKeydown(e) {
    if (this.args.onKeydown && this.args.onKeydown(this.storedAPI, e) === false) {
      e.stopImmediatePropagation();
      return;
    }
    if (e.ctrlKey || e.metaKey) {
      e.stopImmediatePropagation();
      return;
    }
    if (e.keyCode >= 48 && e.keyCode <= 90 || isNumpadKeyEvent(e)) {
      // Keys 0-9, a-z or numpad keys
      this.triggerTypingTask.perform(e);
    } else if (e.keyCode === 32) {
      // Space
      this._handleKeySpace(this.storedAPI, e);
    } else {
      return this._routeKeydown(this.storedAPI, e);
    }
  }
  static {
    n(this.prototype, "handleTriggerKeydown", [action]);
  }
  _labelClick(event) {
    if (!this.storedAPI) {
      return;
    }

    // Double-click, do nothing
    if (event.detail > 1) {
      return;
    }
    if (this.labelClickAction === 'open') {
      this.storedAPI.actions.open();
      return;
    } else if (this.labelClickAction === 'focus') {
      const trigger = document.querySelector(`[data-ebd-id="${this.storedAPI.uniqueId}-trigger"]`);
      if (!trigger) {
        return;
      }
      trigger.focus();
    }
    return true;
  }
  static {
    n(this.prototype, "_labelClick", [action]);
  }
  handleFocus(event) {
    if (!this.isDestroying) {
      scheduleTask(this, 'actions', this._updateIsActive, true);
    }
    if (this.args.onFocus) {
      this.args.onFocus(this.storedAPI, event);
    }
  }
  static {
    n(this.prototype, "handleFocus", [action]);
  }
  handleBlur(event) {
    if (!this.isDestroying) {
      scheduleTask(this, 'actions', this._updateIsActive, false);
    }
    if (this.args.onBlur) {
      this.args.onBlur(this.storedAPI, event);
    }
  }

  // Methods
  static {
    n(this.prototype, "handleBlur", [action]);
  }
  _search(term) {
    if (this.searchText === term) return;
    this.searchText = term;
    if (!this.args.search) {
      this.lastSearchedText = term;
      this._resetHighlighted();
    }
  }
  static {
    n(this.prototype, "_search", [action]);
  }
  _updateOptions() {
    deprecate('You are using power-select with ember/render-modifier. Replace {{did-insert this._updateOptions @options}} and {{did-update this._updateOptions @options}} with {{this.updateOptions @options}}.', false, {
      for: 'ember-power-select',
      id: 'ember-power-select.no-at-ember-render-modifiers',
      since: {
        enabled: '8.1',
        available: '8.1'
      },
      until: '9.0.0'
    });
    this.__updateOptions();
  }
  static {
    n(this.prototype, "_updateOptions", [action]);
  }
  _updateHighlighted() {
    if (this.storedAPI.isOpen) {
      this._resetHighlighted();
    }
  }
  static {
    n(this.prototype, "_updateHighlighted", [action]);
  }
  _updateSelected() {
    deprecate('You are using power-select with ember/render-modifier. Replace {{did-insert this._updateSelected @selected}} and {{did-update this._updateSelected @selected}} with {{this.updateSelected @selected}}.', false, {
      for: 'ember-power-select',
      id: 'ember-power-select.no-at-ember-render-modifiers',
      since: {
        enabled: '8.1',
        available: '8.1'
      },
      until: '9.0.0'
    });
    this.__updateSelected();
  }
  static {
    n(this.prototype, "_updateSelected", [action]);
  }
  _selectedObserverCallback() {
    this._resolvedSelected = this._lastSelectedPromise;
    this._highlight(this._resolvedSelected);
  }
  _highlight(opt) {
    if (!isNone(opt) && opt.disabled) {
      return;
    }
    this.highlighted = opt;
  }
  static {
    n(this.prototype, "_highlight", [action]);
  }
  _select(selected, e) {
    if (!isEqual(this.storedAPI.selected, selected)) {
      this.args.onChange(selected, this.storedAPI, e);
    }
  }
  static {
    n(this.prototype, "_select", [action]);
  }
  _choose(selected, e) {
    const selection = this.args.buildSelection ? this.args.buildSelection(selected, this.storedAPI) : selected;
    this.storedAPI.actions.select(selection, e);
    if (this.args.closeOnSelect !== false) {
      this.storedAPI.actions.close(e);
      // return false;
    }
  }
  static {
    n(this.prototype, "_choose", [action]);
  }
  _scrollTo(option) {
    const select = this.storedAPI;
    if (!document || !option) {
      return;
    }
    if (this.args.scrollTo) {
      return this.args.scrollTo(option, select);
    }
    const optionsList = document.getElementById(`ember-power-select-options-${select.uniqueId}`);
    if (!optionsList) {
      return;
    }
    const index = indexOfOption(select.results, option);
    if (index === -1) {
      return;
    }
    const optionElement = optionsList.querySelector(`[data-option-index='${index}']`);
    if (!optionElement) {
      return;
    }
    const optionTopScroll = optionElement.offsetTop - optionsList.offsetTop;
    const optionBottomScroll = optionTopScroll + optionElement.offsetHeight;
    if (optionBottomScroll > optionsList.offsetHeight + optionsList.scrollTop) {
      optionsList.scrollTop = optionBottomScroll - optionsList.offsetHeight;
    } else if (optionTopScroll < optionsList.scrollTop) {
      optionsList.scrollTop = optionTopScroll;
    }
  }
  static {
    n(this.prototype, "_scrollTo", [action]);
  }
  _registerAPI(triggerElement, [publicAPI]) {
    deprecate('You are using power-select with ember/render-modifier. Replace {{did-insert this._registerAPI publicAPI}} and {{did-update this._registerAPI publicAPI}} with {{this.updateRegisterAPI publicAPI}}.', false, {
      for: 'ember-power-select',
      id: 'ember-power-select.no-at-ember-render-modifiers',
      since: {
        enabled: '8.1',
        available: '8.1'
      },
      until: '9.0.0'
    });
    this.__registerAPI(triggerElement, [publicAPI]);
  }
  static {
    n(this.prototype, "_registerAPI", [action]);
  }
  _performSearch(triggerElement, [term]) {
    deprecate('You are using power-select with ember/render-modifier. Replace {{did-update this._performSearch this.searchText}} with {{this.updatePerformSearch this.searchText}}.', false, {
      for: 'ember-power-select',
      id: 'ember-power-select.no-at-ember-render-modifiers',
      since: {
        enabled: '8.1',
        available: '8.1'
      },
      until: '9.0.0'
    });
    this.__performSearch(triggerElement, [term]);
  }
  static {
    n(this.prototype, "_performSearch", [action]);
  }
  updateOptions = modifier(() => {
    this.__updateOptions();
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  {
    eager: false
  });
  updateSelected = modifier(() => {
    this.__updateSelected();
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  {
    eager: false
  });
  updateRegisterAPI = modifier((triggerElement, [publicAPI]) => {
    this.__registerAPI(triggerElement, [publicAPI]);
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  {
    eager: false
  });
  updatePerformSearch = modifier((triggerElement, [term]) => {
    this.__performSearch(triggerElement, [term]);
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  {
    eager: false
  });
  __updateOptions() {
    if (!this.args.options) return;
    if (isPromiseLike(this.args.options)) {
      if (this._lastOptionsPromise === this.args.options) return; // promise is still the same
      const currentOptionsPromise = this.args.options;
      this._lastOptionsPromise = currentOptionsPromise;
      this.loading = true;
      this._lastOptionsPromise.then(resolvedOptions => {
        if (this._lastOptionsPromise === currentOptionsPromise) {
          this.loading = false;
          this._resolvedOptions = resolvedOptions;
          this._resetHighlighted();
        }
      }).catch(() => {
        if (this._lastOptionsPromise === currentOptionsPromise) {
          this.loading = false;
        }
      });
    } else {
      scheduleTask(this, 'actions', this._resetHighlighted);
    }
  }
  __updateSelected() {
    if (isNone(this.args.selected)) return;
    if (typeof this.args.selected.then === 'function') {
      if (this._lastSelectedPromise === this.args.selected) return; // promise is still the same
      if (this._lastSelectedPromise && isPromiseProxyLike(this._lastSelectedPromise)) {
        removeObserver(this._lastSelectedPromise, 'content', this, this._selectedObserverCallback);
      }
      const currentSelectedPromise = this.args.selected;
      currentSelectedPromise.then(() => {
        if (this.isDestroyed || this.isDestroying) return;
        if (isPromiseProxyLike(currentSelectedPromise)) {
          // eslint-disable-next-line ember/no-observers
          addObserver(currentSelectedPromise, 'content', this, this._selectedObserverCallback);
        }
      });
      this._lastSelectedPromise = currentSelectedPromise;
      this._lastSelectedPromise.then(resolvedSelected => {
        if (this._lastSelectedPromise === currentSelectedPromise) {
          this._resolvedSelected = resolvedSelected;
          this._highlight(resolvedSelected);
        }
      });
    } else {
      this._resolvedSelected = undefined;
      // Don't highlight args.selected array on multi-select
      if (!Array.isArray(this.args.selected)) {
        this._highlight(this.args.selected);
      }
    }
  }
  __registerAPI(_, [publicAPI]) {
    this.storedAPI = publicAPI;
    if (this.args.registerAPI) {
      scheduleTask(this, 'actions', this.args.registerAPI, publicAPI);
    }
  }
  __performSearch(_, [term]) {
    if (!this.args.search) return;
    if (term === '') {
      this.loading = false;
      this.lastSearchedText = term;
      if (this._lastSearchPromise !== undefined) {
        if (isCancellablePromise(this._lastSearchPromise)) {
          this._lastSearchPromise.cancel(); // Cancel ember-concurrency tasks
        }
        this._lastSearchPromise = undefined;
      }
      return;
    }
    const searchResult = this.args.search(term, this.storedAPI);
    if (searchResult && isPromiseLike(searchResult)) {
      this.loading = true;
      if (this._lastSearchPromise !== undefined && isCancellablePromise(this._lastSearchPromise)) {
        this._lastSearchPromise.cancel(); // Cancel ember-concurrency tasks
      }
      this._lastSearchPromise = searchResult;
      searchResult.then(results => {
        if (this._lastSearchPromise === searchResult) {
          this._searchResult = results;
          this.loading = false;
          this.lastSearchedText = term;
          scheduleTask(this, 'actions', this._resetHighlighted);
        }
      }).catch(() => {
        if (this._lastSearchPromise === searchResult) {
          this.loading = false;
          this.lastSearchedText = term;
        }
      });
    } else {
      this.lastSearchedText = term;
      this._searchResult = searchResult;
      scheduleTask(this, 'actions', this._resetHighlighted);
    }
  }
  _defaultBuildSelection(option) {
    return option;
  }
  _routeKeydown(select, e) {
    if (e.keyCode === 38 || e.keyCode === 40) {
      // Up & Down
      return this._handleKeyUpDown(select, e);
    } else if (e.keyCode === 13) {
      // ENTER
      return this._handleKeyEnter(select, e);
    } else if (e.keyCode === 9) {
      // Tab
      return this._handleKeyTab(select, e);
    } else if (e.keyCode === 27) {
      // ESC
      return this._handleKeyESC(select, e);
    }
  }
  _handleKeyTab(select, e) {
    select.actions.close(e);
  }
  _handleKeyESC(select, e) {
    select.actions.close(e);
  }
  _handleKeyEnter(select, e) {
    if (select.isOpen && select.highlighted !== undefined) {
      select.actions.choose(select.highlighted, e);
      e.stopImmediatePropagation();
      return false;
    }
  }
  _handleKeySpace(select, e) {
    if (e.target !== null && ['TEXTAREA', 'INPUT'].includes(e.target.nodeName)) {
      e.stopImmediatePropagation();
    } else if (select.isOpen && select.highlighted !== undefined) {
      e.stopImmediatePropagation();
      e.preventDefault(); // Prevents scrolling of the page.
      select.actions.choose(select.highlighted, e);
    }
  }
  _handleKeyUpDown(select, e) {
    if (select.isOpen) {
      e.preventDefault();
      e.stopPropagation();
      const step = e.keyCode === 40 ? 1 : -1;
      const newHighlighted = advanceSelectableOption(select.results, select.highlighted, step);
      select.actions.highlight(newHighlighted);
      select.actions.scrollTo(newHighlighted);
    } else {
      select.actions.open(e);
    }
  }
  _resetHighlighted() {
    let highlighted;
    const defHighlighted = this.args.defaultHighlighted || defaultHighlighted;
    if (typeof defHighlighted === 'function') {
      highlighted = defHighlighted({
        results: this.results,
        highlighted: this.highlighted,
        selected: this.selected
      });
    } else {
      highlighted = defHighlighted;
    }
    this._highlight(highlighted);
  }
  _filter(options, term, skipDisabled = false) {
    const matcher = this.args.matcher || defaultMatcher;
    const optionMatcher = getOptionMatcher(matcher, defaultMatcher, this.args.searchField);
    return filterOptions(options || [], term, optionMatcher, skipDisabled);
  }
  _updateIsActive(value) {
    this.isActive = value;
  }
  findWithOffset(options, term, offset, skipDisabled = false) {
    const typeAheadOptionMatcher = getOptionMatcher(this.args.typeAheadOptionMatcher || defaultTypeAheadMatcher, defaultTypeAheadMatcher, this.args.searchField);
    return findOptionWithOffset(options || [], term, typeAheadOptionMatcher, offset, skipDisabled);
  }

  // Tasks
  triggerTypingTask = buildTask(() => ({
    context: this,
    generator: function* (e) {
      // In general, a user doing this interaction means to have a different result.
      let searchStartOffset = 1;
      let repeatingChar = this._repeatingChar;
      let charCode = e.keyCode;
      if (isNumpadKeyEvent(e)) {
        charCode -= 48; // Adjust char code offset for Numpad key codes. Check here for numapd key code behavior: https://goo.gl/Qwc9u4
      }
      let term;

      // Check if user intends to cycle through results. _repeatingChar can only be the first character.
      const c = String.fromCharCode(charCode);
      if (c === this._repeatingChar) {
        term = c;
      } else {
        term = this._expirableSearchText + c;
      }
      if (term.length > 1) {
        // If the term is longer than one char, the user is in the middle of a non-cycling interaction
        // so the offset is just zero (the current selection is a valid match).
        searchStartOffset = 0;
        repeatingChar = '';
      } else {
        repeatingChar = c;
      }

      // When the select is open, the "selection" is just highlighted.
      if (this.storedAPI.isOpen && this.storedAPI.highlighted) {
        searchStartOffset += indexOfOption(this.storedAPI.options, this.storedAPI.highlighted);
      } else if (!this.storedAPI.isOpen && !isNone(this.selected)) {
        searchStartOffset += indexOfOption(this.storedAPI.options, this.selected);
      } else {
        searchStartOffset = 0;
      }

      // The char is always appended. That way, searching for words like "Aaron" will work even
      // if "Aa" would cycle through the results.
      this._expirableSearchText = this._expirableSearchText + c;
      this._repeatingChar = repeatingChar;
      const match = this.findWithOffset(this.storedAPI.options, term, searchStartOffset, true);
      if (match !== undefined) {
        if (this.storedAPI.isOpen) {
          this.storedAPI.actions.highlight(match);
          this.storedAPI.actions.scrollTo(match);
        } else {
          this.storedAPI.actions.select(match, e);
        }
      }
      yield timeout(1000);
      this._expirableSearchText = '';
      this._repeatingChar = '';
    }
  }), null, "triggerTypingTask", "restartable");
}
function getOptionMatcher(matcher, defaultMatcher, searchField) {
  if (searchField && matcher === defaultMatcher) {
    return (option, text) => matcher(get(option, searchField), text);
  } else {
    return (option, text) => {
      assert('<PowerSelect> If you want the default filtering to work on options that are not plain strings, you need to provide `@searchField`', matcher !== defaultMatcher || typeof option === 'string');
      return matcher(option, text);
    };
  }
}
function isNumpadKeyEvent(e) {
  return e.keyCode >= 96 && e.keyCode <= 105;
}
const toPlainArray = collection => {
  if (isSliceable(collection)) {
    return collection.slice();
  } else {
    return collection;
  }
};
setComponentTemplate(TEMPLATE, PowerSelectComponent);

export { PowerSelectComponent as default };
//# sourceMappingURL=power-select.js.map
