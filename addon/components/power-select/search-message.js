import { layout, tagName } from "@ember-decorators/component";
import Component from '@ember/component';
import templateLayout from '../../templates/components/power-select/search-message';

@tagName('')
@layout(templateLayout)
export default class SearchMessage extends Component {
}
