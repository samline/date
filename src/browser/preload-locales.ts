import 'dayjs/locale/de.js'
import 'dayjs/locale/es-mx.js'
import 'dayjs/locale/es.js'
import 'dayjs/locale/fr.js'
import 'dayjs/locale/it.js'
import 'dayjs/locale/ja.js'
import 'dayjs/locale/pt-br.js'
import 'dayjs/locale/pt.js'

import { markLocaleAsLoaded } from '../core/locales.js'

markLocaleAsLoaded('de')
markLocaleAsLoaded('es')
markLocaleAsLoaded('es-mx')
markLocaleAsLoaded('fr')
markLocaleAsLoaded('it')
markLocaleAsLoaded('ja')
markLocaleAsLoaded('pt')
markLocaleAsLoaded('pt-br')

export const browserLocalesReady = true