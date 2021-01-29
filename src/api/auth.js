import { httpConfig } from './config.js';
import { crypto } from '@/plugins/crypto/index.js';

export const authApi = {
   async login(payload) {
      let result = await httpConfig({
         url: '/member/login',
         method: 'post',
         data: {
            account: crypto.wm_aes(payload.account),
            password: crypto.wm_aes(payload.password),
         }
      }).then(res => res.data);
      return result;
   },
   async logout() {
      let result = await httpConfig({
         url: '/member/logout',
         method: 'post',
         data: {}
      }).then(res => res.data);
      return result;
   },
   async register_check(payload) {
      let result = await httpConfig({
         url: '/member/register_check',
         method: 'post',
         data: {
            mobile: crypto.wm_aes(payload.mobile),
            password: crypto.wm_aes(payload.password),
            name: payload.name,
            gender: payload.gender,
            security_question: payload.security_question,
            security_answer: payload.security_answer
         }
      }).then(res => res.data);
      return result;
   }   
}