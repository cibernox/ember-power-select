import PowerSelectComponent from './power-select.js';
import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

class PowerSelectMultipleComponent extends Component {
  static {
    setComponentTemplate(precompileTemplate("\n    <PowerSelect @animationEnabled={{@animationEnabled}} @triggerRole={{@triggerRole}} @ariaDescribedBy={{@ariaDescribedBy}} @ariaInvalid={{@ariaInvalid}} @ariaLabel={{@ariaLabel}} @ariaLabelledBy={{@ariaLabelledBy}} @labelClass={{@labelClass}} @labelText={{@labelText}} @labelTag={{@labelTag}} @labelClickAction={{@labelClickAction}} @labelComponent={{@labelComponent}} @afterOptionsComponent={{@afterOptionsComponent}} @allowClear={{@allowClear}} @beforeOptionsComponent={{@beforeOptionsComponent}} @buildSelection={{@buildSelection}} @calculatePosition={{@calculatePosition}} @closeOnSelect={{@closeOnSelect}} @defaultHighlighted={{@defaultHighlighted}} @highlightOnHover={{@highlightOnHover}} @typeAheadOptionMatcher={{@typeAheadOptionMatcher}} @destination={{@destination}} @destinationElement={{@destinationElement}} @disabled={{@disabled}} @dropdownClass={{@dropdownClass}} @extra={{@extra}} @groupComponent={{@groupComponent}} @horizontalPosition={{@horizontalPosition}} @initiallyOpened={{@initiallyOpened}} @loadingMessage={{@loadingMessage}} @matcher={{@matcher}} @matchTriggerWidth={{@matchTriggerWidth}} @noMatchesMessage={{@noMatchesMessage}} @noMatchesMessageComponent={{@noMatchesMessageComponent}} @multiple={{true}} @onBlur={{@onBlur}} @onChange={{@onChange}} @onClose={{@onClose}} @onFocus={{@onFocus}} @onInput={{@onInput}} @onKeydown={{@onKeydown}} @onOpen={{@onOpen}} @options={{@options}} @optionsComponent={{@optionsComponent}} @placeholder={{@placeholder}} @placeholderComponent={{@placeholderComponent}} @preventScroll={{@preventScroll}} @registerAPI={{@registerAPI}} @renderInPlace={{@renderInPlace}} @required={{@required}} @scrollTo={{@scrollTo}} @search={{@search}} @searchEnabled={{@searchEnabled}} @searchField={{@searchField}} @searchFieldPosition={{@searchFieldPosition}} @searchMessage={{@searchMessage}} @searchMessageComponent={{@searchMessageComponent}} @searchPlaceholder={{@searchPlaceholder}} @selected={{@selected}} @selectedItemComponent={{@selectedItemComponent}} @eventType={{@eventType}} @title={{@title}} @triggerClass={{@triggerClass}} @triggerComponent={{@triggerComponent}} @triggerId={{@triggerId}} @verticalPosition={{@verticalPosition}} @tabindex={{@tabindex}} @ebdTriggerComponent={{@ebdTriggerComponent}} @ebdContentComponent={{@ebdContentComponent}} ...attributes as |option select|>\n      {{yield option select}}\n    </PowerSelect>\n  ", {
      strictMode: true,
      scope: () => ({
        PowerSelect: PowerSelectComponent
      })
    }), this);
  }
}

export { PowerSelectMultipleComponent as default };
//# sourceMappingURL=power-select-multiple.js.map
