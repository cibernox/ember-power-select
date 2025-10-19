import Component from '@glimmer/component';
import CodeInline from './code-inline';

interface CodeBlockSignature {
  Element: HTMLElement;
  Args: {
    code: string;
    language?: string;
  };
}

export default class CodeBlock extends Component<CodeBlockSignature> {
  get language() {
    return this.args.language ?? 'markup';
  }

  <template>
    <div class="code-block">
      {{~! ~}}
      <CodeInline ...attributes @code={{@code}} @language={{@language}} />
      {{~! ~}}
    </div>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CodeBlock: typeof CodeBlock;
  }
}
