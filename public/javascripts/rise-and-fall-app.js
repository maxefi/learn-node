import '../sass/style.scss';

import autocomplete from './modules/autocomplete';
import { $ } from './modules/bling';
import makeMap from './modules/map';
import typeAhead from './modules/typeAhead';

autocomplete($('#address'), $('#lat'), $('#lng'));
typeAhead($('.search'));
makeMap($('#map'));
