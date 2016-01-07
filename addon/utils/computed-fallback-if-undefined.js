import Ember from 'ember';

export default function computedFallbackIfUndefined(fallback) {
  return Ember.computed({
    get() { return fallback; },
    set(_, v) { return v === undefined ? fallback : v; }
  });
}