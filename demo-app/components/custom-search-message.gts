import PowerSelectSearchMessage from '#src/components/power-select/search-message.gts';

export default class CustomSearchMessage<
  T,
> extends PowerSelectSearchMessage<T> {
  <template>
    <p id="custom-search-message-p-tag">Customized seach message!</p>
  </template>
}
