import Component from '@ember/component';
import { get, computed, action } from '@ember/object';
import { oneWay } from '@ember/object/computed';

export default class extends Component {
  @oneWay('transformedOptions') currentOptions
  @computed('options')
  get transformedOptions() {
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
  }
}
