import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

export default helper(function ([text, termToHighlight]) {
  return htmlSafe(text.replace(new RegExp(termToHighlight, 'i'), '<b>$&</b>')); // Warning. This is not XSS safe!
});
