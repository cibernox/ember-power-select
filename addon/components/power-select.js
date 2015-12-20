import Ember from 'ember';
import layout from '../templates/components/power-select';
import { defaultMatcher, indexOfOption, optionAtIndex, filterOptions, countOptions } from '../utils/group-utils';

const { RSVP, computed, run, get, isBlank } = Ember;
const Promise = RSVP.Promise;
const PromiseArray = Ember.ArrayProxy.extend(Ember.PromiseProxyMixin);

function fallbackIfUndefined(fallback) {
  return computed({
    get() { return fallback; },
    set(_, v) { return v === undefined ? fallback : v; }
  });
}

export default Ember.Component.extend({
  // HTML
  layout: layout,
  tagName: fallbackIfUndefined(''),

  // Config
  disabled: fallbackIfUndefined(false),
  placeholder: fallbackIfUndefined(null),
  loadingMessage: fallbackIfUndefined('Loading options...'),
  noMatchesMessage: fallbackIfUndefined('No results found'),
  dropdownPosition: fallbackIfUndefined('auto'),
  matcher: fallbackIfUndefined(defaultMatcher),
  searchField: fallbackIfUndefined(null),
  search: fallbackIfUndefined(null),
  closeOnSelect: fallbackIfUndefined(true),
  dropdownClass: fallbackIfUndefined(null),
  triggerClass: fallbackIfUndefined(null),
  dir: fallbackIfUndefined(null),
  opened: fallbackIfUndefined(false),
  selectedComponent: fallbackIfUndefined('power-select/selected'),
  optionsComponent: fallbackIfUndefined('power-select/options'),
  beforeOptionsComponent: fallbackIfUndefined('power-select/before-options'),
  afterOptionsComponent: fallbackIfUndefined(null),
  searchEnabled: fallbackIfUndefined(true),
  searchMessage: fallbackIfUndefined("Type to search"),
  searchPlaceholder: fallbackIfUndefined(null),
  allowClear: fallbackIfUndefined(false),

  // Attrs
  searchText: '',
  searchReturnedUndefined: false,
  activeSearch: null,

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    const randomUUID = Math.random().toString().slice(-10);
    this.triggerUniqueClass = `ember-power-select-trigger-${randomUUID}`;
    this.dropdownUniqueClass = `ember-power-select-dropdown-${randomUUID}`;
  },

  didInitAttrs() {
    this._super(...arguments);
    Ember.assert('{{power-select}} requires an `onchange` function', this.get('onchange') && typeof this.get('onchange') === 'function');
  },

  // CPs
  concatenatedClasses: computed('class', function() {
    const classes = ['ember-power-select'];
    if (this.get('class')) { classes.push(this.get('class')); }
    return classes.join(' ');
  }),

  concatenatedTriggerClasses: computed('class', function() {
    let classes = ['ember-power-select-trigger', this.triggerUniqueClass];
    if (this.get('triggerClass')) {
      classes.push(this.get('triggerClass'));
    }
    if (this.get('class')) {
      classes.push(`${this.get('class')}-trigger`);
    }
    return classes.join(' ');
  }),

  concatenatedDropdownClasses: computed('class', function() {
    let classes = ['ember-power-select-dropdown', this.dropdownUniqueClass];
    if (this.get('dropdownClass')) {
      classes.push(this.get('dropdownClass'));
    }
    if (this.get('class')) {
      classes.push(`${this.get('class')}-dropdown`);
    }
    return classes.join(' ');
  }),

  mustShowSearchMessage: computed('searchText', 'search', 'searchMessage', 'results.length', function(){
    return this.get('searchText.length') === 0 && !!this.get('search') && !!this.get('searchMessage') && this.get('results.length') === 0;
  }),

  mustShowNoMessages: computed('results.{isFulfilled,length}', function() {
    return this.get('results.isFulfilled') && this.get('results.length') === 0;
  }),

  results: computed('options.[]', 'searchText', function() {
    const { options, searchText, previousResults = Ember.A() } = this.getProperties('options', 'searchText', 'previousResults'); // jshint ignore:line
    let promise;
    if (isBlank(searchText) || this.searchReturnedUndefined) {
      promise = Promise.resolve(options).then(opts => Ember.A(opts));
    } else if (this.get('search')) {
      let result = this.get('search')(searchText);
      if (!result) {
        promise = Promise.resolve(previousResults);
        this.searchReturnedUndefined = true;
      } else {
        this.searchReturnedUndefined = false;
        let search = this.activeSearch = Promise.resolve(result);
        promise = search.then(opts => search !== this.activeSearch ? previousResults : Ember.A(opts));
      }
    } else {
      promise = Promise.resolve(options).then(opts => this.filter(Ember.A(opts), this.get('searchText')));
    }
    promise.then(opts => this.setProperties({ currentlyHighlighted: undefined, previousResults: opts }));
    return PromiseArray.create({ promise, content: previousResults });
  }),

  highlighted: computed('results.[]', 'currentlyHighlighted', 'selected', function() {
    return this.get('currentlyHighlighted') || this.defaultHighlighted();
  }),

  resultsLength: computed('results.[]', function() {
    return countOptions(this.get('results'));
  }),

  // Actions
  actions: {
    highlight(dropdown, option) {
      this._doHighlight(dropdown, option);
    },

    search(dropdown, term /*, e */) {
      this._doSearch(dropdown, term);
    },

    select(dropdown, selected, e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.get('selected') !== selected) {
        this.get('onchange')(selected, this.buildPublicAPI(dropdown));
      }
    },

    handleKeydown(dropdown, e) {
      const onkeydown = this.get('onkeydown');
      if (onkeydown) { onkeydown(this.buildPublicAPI(dropdown), e); }
      if (e.defaultPrevented) { return; }
      if (e.keyCode === 38 || e.keyCode === 40) { // Up & Down
        if (dropdown.isOpen) {
          e.preventDefault();
          const newHighlighted = this.advanceSelectableOption(this.get('highlighted'), e.keyCode === 40 ? 1 : -1);
          this.send('highlight', dropdown, newHighlighted, e);
          run.scheduleOnce('afterRender', this, this.scrollIfHighlightedIsOutOfViewport);
        } else {
          dropdown.actions.open(e);
        }
      } else if (e.keyCode === 9 || e.keyCode === 27) {  // Tab or ESC
        dropdown.actions.close(e);
      }
    },

    handleFocus(dropdown, event) {
      const action = this.get('onfocus');
      if (action) {
        action(this.buildPublicAPI(dropdown), event);
      }
    },

    // It is not evident what is going on here, so I'll explain why.
    //
    // As of this writting, Ember doesn allow to yield data to the "inverse" block.
    // Because of that, elements of this component rendered in the trigger can't receive the
    // yielded object contaning the public API of the ember-basic-dropdown, with actions for open,
    // close and toggle.
    //
    // The only possible workaround for this is to on initialization inject a similar object
    // to the one yielded and store it to make it available in the entire component.
    //
    // This this limitation on ember should be fixed soon, this is temporary. Because of that this
    // object will be passed to the action from the inverse block like if it was yielded.
    //
    registerDropdown(dropdown) {
      this.set('registeredDropdown', dropdown);
    },
  },

  // Methods
  handleOpen(dropdown, e) {
    const action = this.get('onopen');
    if (action) { action(this.buildPublicAPI(dropdown), e); }
    run.scheduleOnce('afterRender', this, this.scrollIfHighlightedIsOutOfViewport);
  },

  handleClose(dropdown, e) {
    const action = this.get('onclose');
    if (action) { action(this.buildPublicAPI(dropdown), e); }
    this.send('search', dropdown, '', e);
    this.send('highlight', dropdown, null, e);
  },

  scrollIfHighlightedIsOutOfViewport() {
    const optionsList = document.querySelector('.ember-power-select-options');
    if (!optionsList) { return; }
    const highlightedOption = optionsList.querySelector('.ember-power-select-option--highlighted');
    if (!highlightedOption) { return; }
    const optionTopScroll = highlightedOption.offsetTop - optionsList.offsetTop;
    const optionBottomScroll = optionTopScroll + highlightedOption.offsetHeight;
    if (optionBottomScroll > optionsList.offsetHeight + optionsList.scrollTop) {
      optionsList.scrollTop = optionBottomScroll - optionsList.offsetHeight;
    } else if (optionTopScroll < optionsList.scrollTop) {
      optionsList.scrollTop = optionTopScroll;
    }
  },

  indexOfOption(option) {
    return indexOfOption(this.get('results'), option);
  },

  optionAtIndex(index) {
    return optionAtIndex(this.get('results'), index);
  },

  advanceSelectableOption(activeHighlighted, step) {
    let resultsLength = this.get('resultsLength');
    let startIndex = Math.min(Math.max(this.indexOfOption(activeHighlighted) + step, 0), resultsLength - 1);
    let nextOption = this.optionAtIndex(startIndex);
    while (nextOption && get(nextOption, 'disabled')) {
      nextOption = this.optionAtIndex(startIndex += step);
    }
    return nextOption;
  },

  filter(options, searchText) {
    let matcher;
    if (this.get('searchField')) {
      matcher = (option, text) => this.get('matcher')(get(option, this.get('searchField')), text);
    } else {
      matcher = (option, text) => this.get('matcher')(option, text);
    }
    return filterOptions(options || [], searchText, matcher);
  },

  buildPublicAPI(dropdown) {
    const ownActions = { search: this._doSearch.bind(this), highlight: this._doHighlight.bind(this) };
    return {
      isOpen: dropdown.isOpen,
      actions: Ember.merge(ownActions, dropdown.actions)
    };
  },

  defaultHighlighted() {
    const selected = this.get('selected');
    if (!selected || this.indexOfOption(selected) === -1) {
      return this.optionAtIndex(0);
    }
    return selected;
  },

  _doHighlight(dropdown, option) {
    if (option && get(option, 'disabled')) { return; }
    this.set('currentlyHighlighted', option);
  },

  _doSearch(dropdown, term) {
    this.set('searchText', term);
  }
});
