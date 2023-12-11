import Controller from '@ember/controller';
import MultipleSelection1 from '../../../components/snippets/multiple-selection-1';

export default class MultipleSelection extends Controller {
  multipleSelection1 = MultipleSelection1;
  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];
}
