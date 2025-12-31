import type { PowerSelectAfterOptionsSignature } from '#src/types.ts';
import type { Country, SelectedCountryExtra } from '../utils/constants';
import type { TemplateOnlyComponent } from '@ember/component/template-only';

export default <template>
  <p id="custom-after-options-p-tag">Customized after options!</p>
</template> satisfies TemplateOnlyComponent<
  PowerSelectAfterOptionsSignature<Country, SelectedCountryExtra>
>;
