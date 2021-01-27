import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { default_language, fallback_language } from './config.js';

Vue.use(VueI18n);

const i18n = new VueI18n({
   locale: default_language,
   fallbackLocale: fallback_language,
   messages: {
      [default_language]: require('@/plugins/i18n/locales/'+ default_language + '.json')
   }
});

export default i18n;