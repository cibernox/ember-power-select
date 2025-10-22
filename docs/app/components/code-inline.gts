import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import { htmlSafe, type SafeString } from '@ember/template';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { codeToHtml } from 'shiki';
import { task } from 'ember-concurrency';

interface CodeInlineSignature {
  Element: HTMLElement;
  Args: {
    code: string;
    language?: string;
  };
}

export default class CodeInline extends Component<CodeInlineSignature> {
  @tracked prismCode: string | SafeString = '';

  get code() {
    const code = this.args.code;

    assert(
      "ember-prism's <CodeBlock/> and <CodeInline/> components require a `code` parameter to be passed in.",
      code !== undefined,
    );

    return code;
  }

  get language() {
    return this.args.language ?? 'markup';
  }

  setup = modifier(() => {
    void this.generateCode.perform();
  });

  generateCode = task(async () => {
    const code = this.code;
    const language = this.language;

    const htmlCode = await codeToHtml(code, {
      lang: language,
      theme: 'github-light-default',
    });

    this.prismCode = htmlSafe(htmlCode);
  });

  <template>
    <div ...attributes {{this.setup}}>
      {{~! ~}}{{this.prismCode}}{{~! ~}}
    </div>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CodeInline: typeof CodeInline;
  }
}
