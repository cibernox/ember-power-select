import PowerSelectNoMatchesMessage from '#src/components/power-select/no-matches-message.gts';

export default class CustomNoMatchesMessage<
  T,
  TExtra = unknown,
  IsMultiple extends boolean = false,
> extends PowerSelectNoMatchesMessage<T, TExtra, IsMultiple> {
  <template>
    <p id="custom-no-matches-message-p-tag">{{@noMatchesMessage}}</p>
  </template>
}
