import Controller from '@ember/controller';
import DebounceSearches1 from '../../../components/snippets/debounce-searches-1';
import DebounceSearches2 from '../../../components/snippets/debounce-searches-2';

export default class extends Controller {
  debounceSearches1 = DebounceSearches1;
  debounceSearches2 = DebounceSearches2;
}
