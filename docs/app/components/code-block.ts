import Component from '@glimmer/component';

interface CodeBlockSignature {
  Element: HTMLElement;
  Args: {
    code: string;
    language?: string;
    showLineNumbers?: boolean;
    start?: string;
  };
}

export default class CodeBlock extends Component<CodeBlockSignature> {
  get language() {
    return this.args.language ?? 'markup';
  }

  get languageClass() {
    return `language-${this.language}`;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CodeBlock: typeof CodeBlock;
  }
}
