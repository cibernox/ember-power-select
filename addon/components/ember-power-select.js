import Ember from 'ember';
import layout from '../templates/components/ember-power-select';
import { indexOfOption, optionAtIndex, filterOptions, stripDiacritics } from '../utils/group-utils';

const { RSVP, computed, run, get } = Ember;
const { htmlSafe } = Ember.String;

// TODOs:
//
// * Multiple options:
//   - However, pressing enter on a selected items in the list doesn't unselects it. That
//     makes me thing that PROBABLY the previous point should not be implemented. I find
//     that dicotomy confusing. [This bit was not implemented. I find it confusing]
//   - Typing a word that doesn't match any options and pressing enter creates a new entry
//     (optional behaviour, not default)
//
// * Load content asynchronosy (demo with GH repos by example)
//    The functionality works, but while there is no results the message is
//    the same than when there is no matches.
//
//    I can't avoid feeling that there is 3 different situations:
//
//    * No options provided => A mistake or valid situation? "No results" is an acceptable copy?
//    * No results matching the search criteria => "No results" seems ok.
//    * No results because there is a search action that might be async:
//      - The initial message should not be "No results" but something encouraging the user to search.
//      - While the search promise is not resolved a "Loading..." message should appear, BUT THE EXISTING
//        RESULTS DON'T DISSAPEAR YET. IMPORTANT.
//        DURING THIS TIME IF THE USER HIGHLIGHTS
//      - If the search action resolved to an empty collection then the "No results" message is correct.//
//
//
//  Also, open question: Should the `search` functionality return the new results?
//  Or should populate the options?
//  I think the first option is simpler. Function is invoked and returns a promise
//  that will eventually resolve to the new results.
//  In that case, when you already got a set of results and you're waiting for the next
//  to come, during this time should you still show the previous results or just the loading?
//
// Low priority TODOs:
//
// * Limit the number of selections in multiple mode??? Perhaps not my responsability.
//   Perhaps just allowing an error/warning msg is enough (and a way of generalize the "Loding state too")
// * Add option by typing and pressing enter?? (comma breaks the tag)
// * When you resize the window and the flow of the elements makes the dropdown move the absolute
//   box has to be repositioned if openend.
// * Fire onclose and onopen action??
//
// TODOs for when this is an addon:
// * Place the wormhole destination in the `{{content-for 'body-footer'}}` automatically
//
// Things that are not going to be implemented
// * i18n, because it's not responsability of the component
// * Themes. It's just CSS, style it however you want.
// * Firing custom events. In the ember world you use actions.
// * Programatic access. No need. Pass bound values to change options/selection. Trigger clicks to open/close.

export default Ember.Component.extend({
  layout: layout,
  opened: false,
  disabled: false,
  searchEnabled: true,
  searchPlaceholder: null,
  dropdownPosition: 'auto', // auto | above | below
  loadingMessage: "Loading options...",
  noMatchesMessage: "No results found",
  searchMessage: "Type to search",
  selectedPartial: null,
  attributeBindings: ['dir'],
  classNames: ['ember-power-select'],
  classNameBindings: ['_opened:opened', 'disabled', 'attrs.multiple', '_dropdownPositionClass'],
  _highlighted: null,
  _searchText: '',
  _loadingOptions: false,
  _wormholeDestination: (Ember.testing ? 'ember-testing' : 'ember-power-select-wormhole'),
  matcher: (value, text) => text === '' || stripDiacritics(value).toUpperCase().indexOf(stripDiacritics(text).toUpperCase()) > -1,

  // Lifecycle hooks
  init(){
    this._super(...arguments);
    const rootSelector = Ember.testing ? '#ember-testing' : this.container.lookup('application:main').rootElement;
    this.appRoot = document.querySelector(rootSelector);
    this.handleRootClick = this.handleRootClick.bind(this);
    this.handleRepositioningEvent = this.handleRepositioningEvent.bind(this);
  },

  didReceiveAttrs({ newAttrs: { options, multiple } }) {
    if (multiple) {
      this.set('searchEnabled', false); // I feel that this should be a CP
      if (!this.get('selected')) { this.set('selected', Ember.A()); }
    }
    this.set('_loadingOptions', true);
    RSVP.Promise.resolve(options)
      .then(opts => this.updateOptions(opts))
      .finally(() => this.set('_loadingOptions', false));
  },

  willDestroy() {
    this._super(...arguments);
    this.removeGlobalEvents();
  },

  // CPs
  _notLoadingOptions: computed.not('_loadingOptions'),

  mustSearch: computed('_searchText', 'attrs.search', function(){
    return this.get('_searchText.length') === 0 && !!this.get('attrs.search');
  }),

  tabindex: computed('disabled', function() {
    return !this.get('disabled') ? "0" : "-1";
  }),

  triggerMultipleInputStyle: computed('_searchText', function() {
    return htmlSafe(`width: ${(this.get('_searchText.length') || 0) * 0.5 + 2}em`);
  }),

  // Actions
  actions: {
    toggle(/* e */){
      if (this.get('_opened'))  {
        this.close();
      } else {
        this.open();
      }
    },

    select(option, e) {
      e.preventDefault();
      if (this.attrs.multiple) {
        this.addOrRemoveToSelected(option);
      } else if (this.get('selected') !== option) {
        this.set('selected', option);
      }
      if (this.attrs.onchange) { this.attrs.onchange(this.get('selected')); }
      this.close();
    },

    highlight(option) {
      this.set('_highlighted', option);
    },

    removeOption(option, e) {
      e.stopPropagation();
      this.get('selected').removeObject(option);
      run.scheduleOnce('afterRender', this, this.repositionDropdown);
    },

    clear(e) {
      e.stopPropagation();
      this.set('selected', null);
    },

    search(term /*, e */) {
      this.set('_searchText', term);
      if (this.attrs.search) {
        this.performCustomSearch(term);
      } else {
        this.refreshResults();
        this.set('_highlighted', this.optionAtIndex(0));
      }
    },

    keypress(e) {
      if (e.keyCode === 40 || e.keyCode === 38) { // Arrow up/down
        this.handleVerticalArrowKey(e);
      } else if (e.keyCode === 13) {  // Enter
        this.handleEnter(e);
      } else if (e.keyCode === 9) {   // Tab
        this.handleTab(e);
      } else if (e.keyCode === 27) {  // escape
        this.close();
      } else if (e.keyCode === 8) {   // backspace
        this.handleBackspace(e);
      }
    }
  },

  // Methods
  close() {
    this.set('_opened', false);
    this.set('_searchText', '');
    this.set('_dropdownPositionClass', null);
    this.removeGlobalEvents();
    this.element.querySelector(`.ember-power-select-trigger${this.get('multiple') ? '-multiple-input' : ''}`).focus();
  },

  open() {
    this.set('_opened', true);
    const pos = this.get('dropdownPosition');
    this.set('_dropdownPositionClass', pos === 'auto' ? null : pos);
    this.addGlobalEvents();
    if (this._resultsDirty) { this.refreshResults(); }
    if (this.get('multiple')) {
      this.set('_highlighted', this.optionAtIndex(0));
    } else {
      this.set('_highlighted', this.get('selected') || this.optionAtIndex(0));
    }
    run.scheduleOnce('afterRender', this, this.repositionDropdown);
    run.scheduleOnce('afterRender', this, this.focusSearch);
    run.scheduleOnce('afterRender', this, this.scrollIfHighlightedIsOutOfViewport);
  },

  handleRootClick(e) {
    if (!this.element.contains(e.target) && !document.querySelector('#'+this.get('_wormholeDestination')).contains(e.target)) {
      this.close();
    }
  },

  handleEnter(e) {
    if (this.get('disabled')) {
      return;
    } else if (this.get('_opened')) {
      this.send('select', this.get('_highlighted'), e);
    } else {
      this.send('toggle', e);
    }
  },

  handleTab(e) {
    if (this.get('_opened')) {
      e.preventDefault();
      this.close();
    }
  },

  handleRepositioningEvent(/* e */) {
    run.throttle(this, 'repositionDropdown', 60, true);
  },

  handleVerticalArrowKey(e) {
    e.preventDefault();
    const newHighlighted = this.advanceSelectableOption(this.get('_highlighted'), e.keyCode === 40 ? 1 : -1);
    this.set('_highlighted', newHighlighted);
    run.scheduleOnce('afterRender', this, this.scrollIfHighlightedIsOutOfViewport);
  },

  handleBackspace(e) {
    if (!this.get('multiple')) { return; }
    if (this.get('_searchText.length') !== 0) { return; }
    const lastSelection = this.get('selected.lastObject');
    if (!lastSelection) { return; }
    this.send('removeOption', lastSelection, e);
    if (typeof lastSelection === 'string') {
      this.set('_searchText', lastSelection); // TODO: Convert last selection to text
    } else {
      if (!this.attrs.searchField) { throw new Error('Need to provide `searchField` when options are not strings'); }
      this.set('_searchText', get(lastSelection, this.attrs.searchField)); // TODO: Convert last selection to text
    }
    this.open();
  },

  addOrRemoveToSelected(option) {
    if (this.get('selected').contains(option)) {
      this.get('selected').removeObject(option);
    } else {
      this.get('selected').addObject(option);
    }
  },

  scrollIfHighlightedIsOutOfViewport() {
    const optionsList = document.querySelector('.ember-power-select-options');
    const highlightedOption = optionsList.querySelector('.ember-power-select-option.highlighted');
    if (!highlightedOption) { return; }
    const optionTopScroll = highlightedOption.offsetTop - optionsList.offsetTop;
    const optionBottomScroll = optionTopScroll + highlightedOption.offsetHeight;
    if (optionBottomScroll > optionsList.offsetHeight + optionsList.scrollTop) {
      optionsList.scrollTop = optionBottomScroll - optionsList.offsetHeight;
    } else if (optionTopScroll < optionsList.scrollTop) {
      optionsList.scrollTop = optionTopScroll;
    }
  },

  focusSearch() {
    if (this.get('searchEnabled')) {
      this.appRoot.querySelector('.ember-power-select-search input').focus();
    } else if (this.get('multiple')) {
      this.element.querySelector('.ember-power-select-trigger-multiple-input').focus();
    }
  },

  indexOfOption(option) {
    return indexOfOption(this.get('results'), option);
  },

  optionAtIndex(index) {
    return optionAtIndex(this.get('results'), index);
  },

  advanceSelectableOption(currentHighlight, step) {
    let startIndex = Math.max(this.indexOfOption(currentHighlight) + step % 1000, 0); //opts.get('length');
    let nextOption = this.optionAtIndex(startIndex);
    while (nextOption && get(nextOption, 'disabled')) {
      nextOption = this.optionAtIndex(startIndex += step);
    }
    return nextOption;
  },

  repositionDropdown() {
    if (this.attrs.renderInPlace) { return; }
    const dropdownPositionStrategy = this.get('dropdownPosition');
    const dropdown = this.appRoot.querySelector('.ember-power-select-dropdown');
    const width = this.element.offsetWidth;
    let left = this.element.offsetLeft;
    dropdown.style.width = `${width}px`;
    let top;
    if (dropdownPositionStrategy === 'above') {
      top = this.element.offsetTop - dropdown.offsetHeight;
    } else if (dropdownPositionStrategy === 'below') {
      top = this.element.offsetTop + this.element.offsetHeight;
    } else { // auto
      const viewportTop = document.body.scrollTop;
      const viewportBottom = window.scrollY + window.innerHeight;
      const dropdownHeight = dropdown.offsetHeight;
      const selectTop = this.element.offsetTop;
      const enoughRoomBelow = selectTop + this.element.offsetHeight + dropdownHeight < viewportBottom;
      const enoughRoomAbove = selectTop - viewportTop > dropdownHeight;
      let positionClass = this.get('_dropdownPositionClass');
      if (positionClass === 'below' && !enoughRoomBelow && enoughRoomAbove) {
        positionClass = this.set('_dropdownPositionClass', 'above');
      } else if (positionClass === 'above' && !enoughRoomAbove && enoughRoomBelow) {
        positionClass = this.set('_dropdownPositionClass', 'below');
      } else if (!positionClass) {
        positionClass = this.set('_dropdownPositionClass', enoughRoomBelow ? 'below' : 'above');
      }
      top = selectTop + (positionClass === 'below' ? this.element.offsetHeight : -dropdownHeight);
    }
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
  },

  refreshResults() {
    const { _options: options, _searchText: searchText } = this.getProperties('_options', '_searchText');
    let matcher;
    if (this.attrs.searchField) {
      matcher = (option, text) => this.matcher(get(option, this.attrs.searchField), text);
    } else {
      matcher = (option, text) => this.matcher(option, text);
    }
    this.set('results', filterOptions(options || [], searchText, matcher));
    this._resultsDirty = false;
    run.scheduleOnce('afterRender', this, this.repositionDropdown);
  },

  updateOptions(options) {
    this.set('_options', options);
    if (this.get('_opened')) {
      this.refreshResults();
    } else {
      this._resultsDirty = true;
    }
  },

  performCustomSearch(term) {
    this.set('_loadingOptions', true);
    const promise = term.length > 0 ? RSVP.Promise.resolve(this.attrs.search(term)) : RSVP.resolve([]);
    this.set('_activeSearch', promise);
    promise.then(results => {
      if (promise !== this.get('_activeSearch')) { return; }
      this.set('results', results);
      this.set('_highlighted', this.optionAtIndex(0));
    }).finally(() => {
      if (promise !== this.get('_activeSearch')) { return; }
      this.set('_loadingOptions', false);
    });
  },

  addGlobalEvents() {
    this.appRoot.addEventListener('click', this.handleRootClick);
    window.addEventListener('scroll', this.handleRepositioningEvent);
    window.addEventListener('resize', this.handleRepositioningEvent);
    window.addEventListener('orientationchange', this.handleRepositioningEvent);
  },

  removeGlobalEvents() {
    this.appRoot.removeEventListener('click', this.handleRootClick);
    window.removeEventListener('scroll', this.handleRepositioningEvent);
    window.removeEventListener('resize', this.handleRepositioningEvent);
    window.removeEventListener('orientationchange', this.handleRepositioningEvent);
  }
});
