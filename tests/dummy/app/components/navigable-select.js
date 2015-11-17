import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Component.extend({
  // CPs
  transformedOptions: computed('options', function() {
    return (function walker(options, parentLevel = null) {
      let results = Ember.A();
      let len = get(options, 'length');
      parentLevel = parentLevel || { root: true };
      for (let i = 0; i < len; i++) {
        let opt = get(options, `${i}`);
        let groupName = get(opt, 'groupName');
        if (groupName) {
          let level = { levelName: groupName };
          let optionsWithBack = Ember.A([{ parentLevel }]).concat(get(opt, 'options'));
          level.options = walker(optionsWithBack, level);
          results.push(level);
        } else {
          results.push(opt);
        }
      }
      parentLevel.options = results;
      return results;
    })(this.get('options'));
  }),

  currentOptions: computed.oneWay('transformedOptions'),

  // Actions
  actions: {
    onchange(levelOrOption, dropdown) {
      if (get(levelOrOption, 'levelName')) {
        this.set('currentOptions', get(levelOrOption, 'options'));
      } else if (levelOrOption.parentLevel) {
        this.set('currentOptions', levelOrOption.parentLevel.options);
      } else {
        this.get('onchange')(levelOrOption);
        dropdown.actions.close();
        this.set('currentOptions', this.get('transformedOptions'));
      }
    },

    search(term) {
      const normalizedTerm = term.toLowerCase();
      const results = this.get('currentOptions').filter(o => {
        if (o.parentLevel) {
          return normalizedTerm === '';
        } else if (get(o, 'levelName')) {
          return get(o, 'levelName').toLowerCase().indexOf(normalizedTerm) > -1;
        } else {
          return o.toLowerCase().indexOf(normalizedTerm) > -1;
        }
      });
      results.fromSearch = true;
      return results;
    }
  }
});