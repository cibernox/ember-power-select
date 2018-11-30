import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({
  transformedOptions: computed('options', function() {
    return (function walker(options, parentLevel = null) {
      let results = [];
      let len = get(options, 'length');
      parentLevel = parentLevel || { root: true };

      for (let i = 0; i < len; i++) {
        let opt = get(options, `${i}`);
        let groupName = get(opt, 'groupName');

        if (groupName) {
          let level = { levelName: groupName };
          let optionsWithBack = [{ parentLevel }, ...get(opt, 'options')];
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
});
