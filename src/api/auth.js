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
}