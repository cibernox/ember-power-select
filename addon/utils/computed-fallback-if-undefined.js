import computed from 'ember-computed';

export default function computedFallbackIfUndefined(fallback) {
  return computed({
    get() {
      return fallback;
    },
    set(_, v) {
      return v === undefined ? fallback : v;
    }
  });
}