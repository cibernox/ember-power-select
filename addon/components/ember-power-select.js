import Ember from 'ember';
import layout from '../templates/components/ember-power-select';
import { indexOfOption, optionAtIndex, filterOptions, stripDiacritics, countOptions } from '../utils/group-utils';

const { RSVP, computed, run, get } = Ember;
const { htmlSafe } = Ember.String;

// TODOs:
//
// - Fallback to native select in mobile (optional and only where possible)
// - Make the autofocus functionality configurable: "always", "never" or "desktop-only" (default?)
//
// Refactor plan for extensibility
//
// List of actions => consecuences all selects can receive:
// - Click trigger          => Open/Close select
// - Hover option           => Highlight option
// - Arrows navigation      => Highlight option
// - Click option           => Select/Unselect option
// - Press enter            => Select/Unselect option or Create option
// - Receive text (input)   => Refresh results (search or filter)
// - Click remove button    => Remove selection
//
// List of possible actions to fire
// - change (onchange)
// - highlight (onhighlight)
// - search (onsearch??)
//
//
export default Ember.Component.extend({
  tagName: '',
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
  // classNames: ['ember-power-select'],
  // classNameBindings: ['_opened:opened', 'disabled', 'multiple', 'renderInPlace', '_dropdownPositionClass'],
  _highlighted: null,
  _searchText: '',
  _loadingOptions: false,
  // _wormholeDestination: (Ember.testing ? 'ember-testing' : 'ember-power-select-wormhole'),
  matcher: (value, text) => text === '' || stripDiacritics(value).toUpperCase().indexOf(stripDiacritics(text).toUpperCase()) > -1,

  // Lifecycle hooks
  init(){
    this._super(...arguments);
    const self = this;
    const rootSelector = Ember.testing ? '#ember-testing' : this.container.lookup('application:main').rootElement;
    this.appRoot = document.querySelector(rootSelector);
    this.handleRootClick = function handleRootClick(e) {
      if (!self.element.contains(e.target)) { self.close(); }
    };
    this.handleRepositioningEvent = function handleRepositioningEvent(/* e */) {
      run.throttle(self, 'repositionDropdown', 60, true);
    };
  },

  didReceiveAttrs({ newAttrs: { options, multiple } }) {
    if (multiple) {
      this.set('searchEnabled', false); // I feel that this should be a CP
    }
    this.set('_loadingOptions', true);
    RSVP.Promise.resolve(options && options.value || options)
      .then(opts => this.updateOptions(opts))
      .finally(() => this.set('_loadingOptions', false));
  },

  willDestroy() {
    this._super(...arguments);
    this.removeGlobalEvents();
  },

  // CPs
  _notLoadingOptions: computed.not('_loadingOptions'),

  selectedOption: computed('selected', {
    get() {
      return this.get('multiple') && Ember.A(this.get('selected')) || this.get('selected');
    },
    set(_, value) {
      return value;
    }
  }),

  mustSearch: computed('_searchText', 'search', function(){
    return this.get('_searchText.length') === 0 && !!this.get('search');
  }),

  tabindex: computed('disabled', function() {
    return !this.get('disabled') ? "0" : "-1";
  }),

  triggerMultipleInputStyle: computed('_searchText', function() {
    return htmlSafe(`width: ${(this.get('_searchText.length') || 0) * 0.5 + 2}em`);
  }),

  resultsLength: computed('results', function() {
    return countOptions(this.get('results'));
  }),

  // Actions
  actions: {
    toggle(/* e */){
      if (this.get('_opened'))  {
        this.close();
        this.focusTrigger();
      } else {
        this.open();
      }
    },

    select(option, e) {
      e.preventDefault();
      if (this.get('multiple')) {
        this.addOrRemoveToSelected(option);
      } else if (this.get('selectedOption') !== option) {
        this.set('selectedOption', option);
      }
      if (this.get('onchange')) { this.get('onchange')(this.get('selectedOption')); }
      this.close();
      this.focusTrigger();
    },

    highlight(option) {
      if (get(option, 'disabled')) { return; }
      this.set('_highlighted', option);
    },

    removeOption(option, e) {
      e.stopPropagation();
      this.get('selectedOption').removeObject(option);
      this._resultsDirty = true;
      if (this.get('onchange')) { this.get('onchange')(this.get('selectedOption')); }
      run.scheduleOnce('afterRender', this, this.repositionDropdown);
    },

    clear(e) {
      e.stopPropagation();
      e.preventDefault();
      this.set('selectedOption', null);
      if (this.get('onchange')) { this.get('onchange')(null); }
    },

    search(term /*, e */) {
      this.set('_searchText', term);
      if (this.get('search')) {
        this.performCustomSearch(term);
      } else {
        this.refreshResults();
        this.set('_highlighted', this.optionAtIndex(0));
      }
    },

    keydown(e) {
      if (e.keyCode === 40 || e.keyCode === 38) { // Arrow up/down
        this.handleVerticalArrowKey(e);
      } else if (e.keyCode === 13) {  // Enter
        this.handleEnter(e);
      } else if (e.keyCode === 9) {   // Tab
        this.handleTab(e);
      } else if (e.keyCode === 27) {  // escape
        this.close();
        this.focusTrigger();
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
  },

  focusTrigger() {
    this.element.querySelector(`.ember-power-select-trigger${this.get('multiple') ? '-multiple-input' : ''}`).focus();
  },

  open() {
    if (this.get('disabled')) { return; }
    this.set('_opened', true);
    const pos = this.get('dropdownPosition');
    const renderInPlace = this.get('renderInPlace');
    this.set('_dropdownPositionClass', renderInPlace ? 'below' : (pos === 'auto' ? null : pos));
    this.addGlobalEvents();
    if (this._resultsDirty) { this.refreshResults(); }
    if (this.get('multiple')) {
      this.set('_highlighted', this.optionAtIndex(0));
    } else {
      this.set('_highlighted', this.get('selectedOption') || this.optionAtIndex(0));
    }
    run.scheduleOnce('afterRender', this, this.repositionDropdown);
    run.scheduleOnce('afterRender', this, this.focusSearch);
    run.scheduleOnce('afterRender', this, this.scrollIfHighlightedIsOutOfViewport);
  },

  swallowEvent(e) {
    e.stopPropagation();
  },

  handleEnter(e) {
    if (this.get('disabled')) { return; }
    if (this.get('_opened')) {
      const highlighted = this.get('_highlighted');
      if (this.get('multiple')) {
        if ((this.get('selected') || []).indexOf(highlighted) === -1) {
          this.send('select', highlighted, e);
        } else {
          this.close();
        }
      } else {
        this.send('select', highlighted, e);
      }
    } else {
      this.send('toggle', e);
    }
  },

  handleTab(e) {
    if (this.get('_opened')) {
      e.preventDefault();
      this.close();
      this.focusTrigger();
    }
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
    const lastSelection = this.get('selectedOption.lastObject');
    if (!lastSelection) { return; }
    this.send('removeOption', lastSelection, e);
    if (typeof lastSelection === 'string') {
      this.set('_searchText', lastSelection); // TODO: Convert last selection to text
    } else {
      if (!this.get('searchField')) { throw new Error('Need to provide `searchField` when options are not strings'); }
      this.set('_searchText', get(lastSelection, this.get('searchField'))); // TODO: Convert last selection to text
    }
    this.open();
  },

  addOrRemoveToSelected(option) {
    if (this.get('selectedOption').contains(option)) {
      this.get('selectedOption').removeObject(option);
    } else {
      this.get('selectedOption').addObject(option);
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
    let resultsLength = this.get('resultsLength');
    let startIndex = Math.min(Math.max(this.indexOfOption(currentHighlight) + step, 0), resultsLength - 1);
    let nextOption = this.optionAtIndex(startIndex);
    while (nextOption && get(nextOption, 'disabled')) {
      nextOption = this.optionAtIndex(startIndex += step);
    }
    return nextOption;
  },

  repositionDropdown() {
    if (this.get('renderInPlace')) { return; }
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
    if (this.get('searchField')) {
      matcher = (option, text) => this.matcher(get(option, this.get('searchField')), text);
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
    const promise = term.length > 0 ? RSVP.Promise.resolve(this.get('search')(term)) : RSVP.resolve([]);
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
