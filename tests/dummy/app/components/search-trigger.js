import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  actions: {
    search(e) {
      this.get('onInput')(e);
    }
  }
});
