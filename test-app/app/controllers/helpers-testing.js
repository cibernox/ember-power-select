import Controller from '@ember/controller';
import { action } from '@ember/object';
import { runTask } from 'ember-lifeline';
import { tracked } from '@glimmer/tracking';
import RSVP from 'rsvp';

const numbers = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
];

export default class HelpersTesting extends Controller {
  numbers = numbers;
  @tracked selectedList = [];
  @tracked asyncSelected;
  @tracked asyncSelectedList = [];
  @tracked optionz = [];
  @tracked selected3;

  @action
  searchAsync(term) {
    return new RSVP.Promise((resolve) => {
      runTask(
        this,
        () => {
          resolve(numbers.filter((n) => n.indexOf(term) > -1));
        },
        100,
      );
    });
  }

  @action
  onOpenHandle() {
    runTask(
      this,
      () => {
        this.optionz = numbers;
      },
      100,
    );
  }

  @action
  onChangeAsync(key, selected) {
    runTask(
      this,
      () => {
        this[key] = selected;
      },
      100,
    );
  }
}
