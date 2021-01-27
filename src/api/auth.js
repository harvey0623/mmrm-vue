import { httpConfig } from './config.js';
import { crypto } from '@/plugins/crypto/index.js';

export const authApi = {
   async login({ account, password }) {
      let data = {
         account: crypto.wm_aes(account),
         password: crypto.wm_aes(password),
      };
      console.log(data);

      // let result = await httpConfig({
      //    url: '/member/member_summary',
      //    method: 'post',
      //    data: payload
      // }).then(res => res.data);
      // return result;
   }
}