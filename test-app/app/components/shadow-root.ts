import Component from '@glimmer/component';
import { getOwner } from '@ember/application';

const isFastBoot = typeof FastBoot !== 'undefined';

export default class ShadowRootComponent extends Component<{
  Element: HTMLDivElement;
  Blocks: { default: [] };
}> {
  get shadowDom() {
    if (this.isFastBoot) {
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const config = getOwner(this).resolveRegistration('config:environment') as {
      APP: {
        shadowDom: boolean;
      };
    };

    return config.APP.shadowDom ?? false;
  }

  isFastBoot = isFastBoot;

  get shadowRootElement(): HTMLElement | null | undefined {
    const shadowRoot = document.getElementById('shadow-root')?.shadowRoot;
    const div = document.createElement('div');
    shadowRoot?.appendChild(div);

    return div;
  }

  get getStyles() {
    return [...document.head.querySelectorAll('link')].map((link) => link.href);
  }
}
