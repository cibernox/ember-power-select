import { layout, tagName } from "@ember-decorators/component";
import Component from '@ember/component';
import templateLayout from '../../templates/components/power-select/no-matches-message';

export default @tagName('') @layout(templateLayout) class NoMatchesMessage extends Component {
}
