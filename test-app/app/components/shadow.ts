import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';

export default class ShadowComponent extends Component<{
  Element: HTMLDivElement;
  Blocks: { default: [] };
}> {
  @tracked shadow: Element | undefined;

  setShadow = (shadowRoot: HTMLDivElement) => {
    this.shadow = shadowRoot;
  };

  get getStyles() {
    return [...document.head.querySelectorAll('link')].map((link) => link.href);
  }

  attachShadow = modifier(
    (element: Element, [set]: [(shadowRoot: Element) => void]) => {
      const shadowRoot = element.attachShadow({ mode: 'open' });
      const div = document.createElement('div');
      shadowRoot.appendChild(div);
      set(div);
    },
  );
}
