import BaseSerializer from './application';

export default class extends BaseSerializer {
  include = ['pets'];
}
