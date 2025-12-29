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
  @tracked selected: string | undefined = undefined;
  @tracked selected2: string | undefined = undefined;
  @tracked selected2Multi: string[] = [];
  @tracked selectedList: string[] = [];
  @tracked asyncSelected: string | undefined = undefined;
  @tracked asyncSelectedList: string[] = [];
  @tracked optionz: string[] = [];
  @tracked selected3: string | undefined;

  @action
  searchAsync(term: string): Promise<readonly string[]> {
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
  onChangeAsync(key: 'asyncSelected', selected: string | undefined) {
    runTask(
      this,
      () => {
        this[key] = selected;
      },
      100,
    );
  }

  @action
  onChangeAsyncMultiple(key: 'asyncSelectedList', selected: string[]) {
    runTask(
      this,
      () => {
        this[key] = selected;
      },
      100,
    );
  }
}
