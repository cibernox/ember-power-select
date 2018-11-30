import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import layout from '../../templates/components/power-select/power-select-group';

export default Component.extend({
  layout,
  tagName: '',
  disabled: reads('group.disabled'),
  groupName: reads('group.groupName')
});
