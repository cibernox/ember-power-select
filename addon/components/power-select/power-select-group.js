import Component from 'ember-component';
import computed from 'ember-computed';
import layout from '../../templates/components/power-select/power-select-group';

export default Component.extend({
  layout,
  tagName: '',
  disabled: computed.reads('group.disabled'),
  groupName: computed.reads('group.groupName')
});
