import { helper } from 'ember-helper';

export function emberPowerSelectOverrideOption([value, component, key]) {
  if (component.args) {
    let { keys, values } = component.args.named;
    let index = keys.indexOf(key);

    if (index != -1) {
      return values[index].inner;
    }
  }
  return value;
}

export default helper(emberPowerSelectOverrideOption);
