import { computed, get } from '@ember/object';
import { assert } from '@ember/debug';

export default function computedOptionsMatcher(matcherField, defaultMatcher) {
  return computed('searchField', matcherField, function() {
    let { [matcherField]: matcher, searchField } = this.getProperties(matcherField, 'searchField');
    if (searchField && matcher === defaultMatcher) {
      return (option, text) => matcher(get(option, searchField), text);
    } else {
      return (option, text) => {
        assert('{{power-select}} If you want the default filtering to work on options that are not plain strings, you need to provide `searchField`', matcher !== defaultMatcher || typeof option === 'string');
        return matcher(option, text);
      };
    }
  });
}
