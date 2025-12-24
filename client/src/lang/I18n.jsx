import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import LangEn from './lang.en.json'
import LangKo from './lang.ko.json'

const resource = {
    en: {
        translations: LangEn
    },
    ko: {
        translations: LangKo
    }
}

i18n
    .use(initReactI18next)
    .init({
        resources: resource,
        lng: navigator.language,
        fallbackLng: 'ko',
        debug: false,
        defaultNS: 'translations',
        ns: 'translations',
        keySeparator: false,
        interpolation: {
            escapeValue: false
        }
    })

export default i18n