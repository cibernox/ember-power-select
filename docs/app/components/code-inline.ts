import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import { htmlSafe, type SafeString } from '@ember/template';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Prism: any;

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
    if (Prism?.plugins?.NormalizeWhitespace) {
      return Prism.plugins.NormalizeWhitespace.normalize(code);
    }

    return code;
  }

  get language() {
    return this.args.language ?? 'markup';
  }

  get languageClass() {
    return `language-${this.language}`;
  }

  setPrismCode = modifier((element: Element) => {
    const code = this.code;
    const language = this.language;
    const grammar = Prism.languages[language];

    if (code && language && grammar) {
      this.prismCode = htmlSafe(Prism.highlight(code, grammar, language));
    } else {
      this.prismCode = '';
    }

    // Force plugin initialization, required for Prism.highlight usage.
    // See https://github.com/PrismJS/prism/issues/1234
    Prism.hooks.run('complete', {
      code,
      element,
    });
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CodeInline: typeof CodeInline;
  }
}
