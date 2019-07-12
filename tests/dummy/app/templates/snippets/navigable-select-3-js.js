import Component from '@ember/component';

export default class extends Component {
  didReceiveAttrs({ oldAttrs, newAttrs }) {
    super.didReceiveAttrs(...arguments);
    if (!oldAttrs || !oldAttrs.options || !newAttrs.options || oldAttrs.options === newAttrs.options) {
      return;
    }

    if (newAttrs.options.fromSearch) {
      this.set('animation', false);
      this.set('enableGrowth', false);
    } else {
      this.set('enableGrowth', true);
      let parentLevel = oldAttrs.options[0] && oldAttrs.options[0].parentLevel;
      let goingBack = !!parentLevel && parentLevel.options === newAttrs.options;

      if (goingBack) {
        this.set('animation', 'toRight');
      } else {
        this.set('animation', 'toLeft');
      }
    }
  }
}
