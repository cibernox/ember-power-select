import Ember from 'ember';

export default Ember.Service.extend({
  init() {
    this._super(...arguments);
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  },

  measure(string, font = null) {
    if (font) {
      this.ctx.font = font;
    }
    return this.ctx.measureText(string).width;
  }
});
