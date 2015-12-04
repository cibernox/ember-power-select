import Ember from 'ember';
import { indexOfOption, optionAtIndex, filterOptions, countOptions } from '../../utils/group-utils';
const { RSVP, computed, run, get, isBlank } = Ember;
const Promise = RSVP.Promise;
const PromiseArray = Ember.ArrayProxy.extend(Ember.PromiseProxyMixin);

export default Ember.Component.extend({
  tagName: '',
  searchText: '',
  searchReturnedUndefined: false,
  activeSearch: null,
  attributeBindings: ['dir'],

  // CPs
  showLoadingMessage: computed.and('loadingMessage', 'results.isPending'),

  concatenatedDropdownClasses: computed('class', function() {
    let classes = Ember.A(['ember-power-select-dropdown']);
    if (this.get('dropdownClass')) {
      classes.push(this.get('dropdownClass'));
    }
    if (this.get('class')) {
      classes.push(`${this.get('class')}-dropdown`);
    }
    return classes.join(' ');
  }),

  mustShowSearchMessage: computed('searchText', 'search', 'searchMessage', function(){
    return this.get('searchText.length') === 0 && !!this.get('search') && !!this.get('searchMessage');
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
    promise.then(opts => this.set('previousResults', opts));
    return PromiseArray.create({ promise, content: previousResults });
  }),

  highlighted: computed('results.[]', 'selected', {
    get() { return this.defaultHighlighted(); },
    set(_, v) { return v; }
  }),

  resultsLength: computed('results.[]', function() {
    return countOptions(this.get('results'));
  }),

  // Actions
  actions: {
    open(dropdown, e) {
      dropdown.actions.open(e);
    },

    close(dropdown, e) {
      dropdown.actions.close(e);
    },

    highlight(dropdown, option) {
      if (option && get(option, 'disabled')) { return; }
      this.set('highlighted', option);
    },

    search(dropdown, term /*, e */) {
      this.set('searchText', term);
    },

    handleKeydown(dropdown, e) {
      if (e.defaultPrevented) { return; }
      if (e.keyCode === 38 || e.keyCode === 40) { // Up & Down
        if (dropdown.isOpen) {
          this.handleVerticalArrowKey(e);
        } else {
          dropdown.actions.open(e);
        }
      } else if (e.keyCode === 9) {  // Tab
        dropdown.actions.close(e);
      } else if (e.keyCode === 27) { // ESC
        dropdown.actions.close(e);
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
  onOpen(e) {
    run.scheduleOnce('afterRender', this, this.focusSearch, e);
    run.scheduleOnce('afterRender', this, this.scrollIfHighlightedIsOutOfViewport);
  },

  onClose() {
    this.set('searchText', '');
  },

  handleVerticalArrowKey(e) {
    e.preventDefault();
    const newHighlighted = this.advanceSelectableOption(this.get('highlighted'), e.keyCode === 40 ? 1 : -1);
    this.set('highlighted', newHighlighted);
    run.scheduleOnce('afterRender', this, this.scrollIfHighlightedIsOutOfViewport);
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

  advanceSelectableOption(currentHighlight, step) {
    let resultsLength = this.get('resultsLength');
    let startIndex = Math.min(Math.max(this.indexOfOption(currentHighlight) + step, 0), resultsLength - 1);
    let nextOption = this.optionAtIndex(startIndex);
    while (nextOption && get(nextOption, 'disabled')) {
      nextOption = this.optionAtIndex(startIndex += step);
    }
    return nextOption;
  },

  filter(options, searchText) {
    let matcher;
    if (this.get('searchField')) {
      matcher = (option, text) => this.matcher(get(option, this.get('searchField')), text);
    } else {
      matcher = (option, text) => this.matcher(option, text);
    }
    return filterOptions(options || [], searchText, matcher);
  },
});
