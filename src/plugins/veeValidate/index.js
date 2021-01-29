import { ValidationObserver , ValidationProvider, extend, setInteractionMode } from 'vee-validate';
import { required, email, confirmed } from 'vee-validate/dist/rules';
import checkTwId from './checkTwId.js';
import i18n from '@/plugins/i18n/index.js';

export default {
   install(Vue, options) {
      Vue.component('ValidationObserver', ValidationObserver);
      Vue.component('ValidationProvider', ValidationProvider);
      setInteractionMode('eager');
      extend('required', {
         ...required,
         message: i18n.t('validate.required')
      });
      extend('email', {
         ...email,
         message: i18n.t('validate.email')
      });
      extend('phone', {
         message: i18n.t('validate.mobile'),
         validate: value => value.length === 10 && /^09\d{8}$/.test(value)
      });
      extend('password', {
         message: i18n.t('validate.password'),
         validate(value) {
            let rule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/
            return rule.test(value);
         }
      });
      extend('confirmPw', {
         params: ['target'],
         message: '確認密碼不一致',
         validate(value, { target }) {
            return value === target;
         }
      });
      extend('term', {
         message: '請同意條款',
         validate(value) {
            return value;
         }
      });
      extend('birthday', {
         message: '生日不能是今天',
         validate(value) {
            let today = new Date();
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
            let birthday = new Date(value).getTime();
            return birthday < today;
         }
      });
   }
}