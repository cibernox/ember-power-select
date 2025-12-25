import type { PowerSelectArgs } from './power-select.gts';
import type { Option, Select } from '../types.ts';

import PowerSelect from './power-select.gts';
import Component from '@glimmer/component';

type PowerSelectMultipleArgs<T, TExtra> = PowerSelectArgs<T, true, TExtra>;

export interface PowerSelectMultipleSignature<T, TExtra = unknown> {
  Element: Element;
  Args: PowerSelectMultipleArgs<T, TExtra>;
  Blocks: {
    default: [option: Option<T>, select: Select<T, true>];
  };
}

export default class PowerSelectMultipleComponent<T, TExtra> extends Component<
  PowerSelectMultipleSignature<T, TExtra>
> {
  <template>
    <PowerSelect
      @animationEnabled={{@animationEnabled}}
      @triggerRole={{@triggerRole}}
      @ariaDescribedBy={{@ariaDescribedBy}}
      @ariaInvalid={{@ariaInvalid}}
      @ariaLabel={{@ariaLabel}}
      @ariaLabelledBy={{@ariaLabelledBy}}
      @labelClass={{@labelClass}}
      @labelText={{@labelText}}
      @labelTag={{@labelTag}}
      @labelClickAction={{@labelClickAction}}
      @labelComponent={{@labelComponent}}
      @afterOptionsComponent={{@afterOptionsComponent}}
      @allowClear={{@allowClear}}
      @beforeOptionsComponent={{@beforeOptionsComponent}}
      @buildSelection={{@buildSelection}}
      @calculatePosition={{@calculatePosition}}
      @closeOnSelect={{@closeOnSelect}}
      @defaultHighlighted={{@defaultHighlighted}}
      @highlightOnHover={{@highlightOnHover}}
      @typeAheadOptionMatcher={{@typeAheadOptionMatcher}}
      @destination={{@destination}}
      @destinationElement={{@destinationElement}}
      @disabled={{@disabled}}
      @dropdownClass={{@dropdownClass}}
      @extra={{@extra}}
      @groupComponent={{@groupComponent}}
      @horizontalPosition={{@horizontalPosition}}
      @initiallyOpened={{@initiallyOpened}}
      @loadingMessage={{@loadingMessage}}
      @matcher={{@matcher}}
      @matchTriggerWidth={{@matchTriggerWidth}}
      @noMatchesMessage={{@noMatchesMessage}}
      @noMatchesMessageComponent={{@noMatchesMessageComponent}}
      @multiple={{true}}
      @onBlur={{@onBlur}}
      @onChange={{@onChange}}
      @onClose={{@onClose}}
      @onFocus={{@onFocus}}
      @onInput={{@onInput}}
      @onKeydown={{@onKeydown}}
      @onOpen={{@onOpen}}
      @options={{@options}}
      @optionsComponent={{@optionsComponent}}
      @placeholder={{@placeholder}}
      @placeholderComponent={{@placeholderComponent}}
      @preventScroll={{@preventScroll}}
      @registerAPI={{@registerAPI}}
      @renderInPlace={{@renderInPlace}}
      @required={{@required}}
      @scrollTo={{@scrollTo}}
      @search={{@search}}
      @searchEnabled={{@searchEnabled}}
      @searchField={{@searchField}}
      @searchFieldPosition={{@searchFieldPosition}}
      @searchMessage={{@searchMessage}}
      @searchMessageComponent={{@searchMessageComponent}}
      @searchPlaceholder={{@searchPlaceholder}}
      @selected={{@selected}}
      @selectedItemComponent={{@selectedItemComponent}}
      @eventType={{@eventType}}
      @title={{@title}}
      @triggerClass={{@triggerClass}}
      @triggerComponent={{@triggerComponent}}
      @triggerId={{@triggerId}}
      @verticalPosition={{@verticalPosition}}
      @tabindex={{@tabindex}}
      @ebdTriggerComponent={{@ebdTriggerComponent}}
      @ebdContentComponent={{@ebdContentComponent}}
      ...attributes
      as |option select|
    >
      {{yield option select}}
    </PowerSelect>
  </template>
}
