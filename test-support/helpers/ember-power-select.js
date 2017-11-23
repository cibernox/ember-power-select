import { deprecate } from '@ember/debug';
import _registerHelpers from 'ember-power-select/test-support/helpers';
import {
  findContains as _findContains,
  nativeMouseDown as _nativeMouseDown,
  nativeMouseUp as _nativeMouseUp,
  triggerKeydown as _triggerKeydown,
  typeInSearch as _typeInSearch,
  clickTrigger as _clickTrigger,
  nativeTouch as _nativeTouch,
  touchTrigger as _touchTrigger,
  selectChoose as _selectChoose
} from 'ember-power-select/test-support/helpers';

function deprecateHelper(fn, name) {
  return function(...args) {
    deprecate(
      `DEPRECATED \`import { ${name} } from '../../tests/helpers/ember-power-select';\` is deprecated. Please, replace it with \`import { ${name} } from 'ember-power-select/test-support/helpers';\``,
      false,
      { until: '1.11.0', id: `ember-power-select-test-support-${name}` }
    );
    return fn(...args);
  };
}

let findContains = deprecateHelper(_findContains, 'findContains');
let nativeMouseDown = deprecateHelper(_nativeMouseDown, 'nativeMouseDown');
let nativeMouseUp = deprecateHelper(_nativeMouseUp, 'nativeMouseUp');
let triggerKeydown = deprecateHelper(_triggerKeydown, 'triggerKeydown');
let typeInSearch = deprecateHelper(_typeInSearch, 'typeInSearch');
let clickTrigger = deprecateHelper(_clickTrigger, 'clickTrigger');
let nativeTouch = deprecateHelper(_nativeTouch, 'nativeTouch');
let touchTrigger = deprecateHelper(_touchTrigger, 'touchTrigger');
let selectChoose = deprecateHelper(_selectChoose, 'selectChoose');

export default function deprecatedRegisterHelpers() {
  deprecate(
    "DEPRECATED `import registerPowerSelectHelpers from '../../tests/helpers/ember-power-select';` is deprecated. Please, replace it with `import registerPowerSelectHelpers from 'ember-power-select/test-support/helpers';`",
    false,
    { until: '1.11.0', id: 'ember-power-select-test-support-register-helpers' }
  );
  return _registerHelpers();
}

export {
  findContains,
  nativeMouseDown,
  nativeMouseUp,
  triggerKeydown,
  typeInSearch,
  clickTrigger,
  nativeTouch,
  touchTrigger,
  selectChoose
};
