import Ember from 'ember';

const { get } = Ember;

export function isGroup(entry) {
  return !!entry && !!get(entry, 'groupName') && !!get(entry, 'options');
}

export function indexOfOption(collection, option) {
  let index = 0;
  return (function walk(collection) {
    if (!collection) { return null; }
    for (let entry of collection) {
      if (isGroup(entry)) {
        let result = walk(get(entry, 'options'));
        if (result > -1) { return result; }
      } else if (entry === option) {
        return index;
      } else {
        index++;
      }
    }
    return -1;
  })(collection);
}

export function optionAtIndex(originalCollection, index) {
  let counter = 0;
  return (function walk(collection) {
    if (!collection) { return null; }
    let localCounter = 0;
    const length = get(collection, 'length');
    while (counter <= index && localCounter < length) {
      let entry = collection.objectAt(localCounter);
      if (isGroup(entry)) {
        let found = walk(get(entry, 'options'));
        if (found) { return found; }
      } else if (counter === index) {
        return entry;
      } else {
        counter++;
      }
      localCounter++;
    }
  })(originalCollection);
}

export function filterOptions(options, text, matcher) {
  const opts = [];
  for (let entry of options) {
    if (isGroup(entry)) {
      let suboptions = filterOptions(get(entry, 'options'), text, matcher);
      if (suboptions.length > 0) {
        opts.push({ groupName: entry.groupName, options: suboptions });
      }
    } else if (matcher(entry, text)) {
      opts.push(entry);
    }
  }
  return opts;
}

