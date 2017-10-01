import { helper } from '@ember/component/helper';

export function emberPowerSelectTrueStringIfPresent([bool]/* , hash*/) {
  return bool ? 'true' : false;
}

export default helper(emberPowerSelectTrueStringIfPresent);
