import Controller from '@ember/controller';

export default class ShadowRootController extends Controller {
  diacritics = ['María', 'Søren Larsen', 'João', 'Saša Jurić', 'Íñigo'];

  selectedDiacritic: string | undefined = undefined;
}
