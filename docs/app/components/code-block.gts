import Component from '@glimmer/component';
import CodeInline from './code-inline';

interface CodeBlockSignature {
  Element: HTMLElement;
  Args: {
    fileName: string;
    language?: string;
    class?: string;
  };
}

export default class CodeBlock extends Component<CodeBlockSignature> {
  get language() {
    return this.args.language ?? 'markup';
  }

  <template>
    <div class="code-block {{@class}}">
      {{~! ~}}
      <CodeInline
        ...attributes
        @fileName={{@fileName}}
        @language={{@language}}
      />
      {{~! ~}}
    </div>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CodeBlock: typeof CodeBlock;
  }
}
