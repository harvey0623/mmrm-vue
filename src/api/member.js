import { httpConfig } from './config.js';
import { crypto } from '@/plugins/crypto/index.js';

export const memberApi = {
   async forget_password(payload) { //忘記密碼第一步
      let result = await httpConfig({
         url: '/member/v1.1/forget_password',
         method: 'post',
         data: {
            mobile: crypto.wm_aes(payload.mobile),
            security_question: payload.security_question,
            security_answer: payload.security_answer
         }
      }).then(res => res.data)
         .catch(err => err.response.data);
      return result;
   },
   async forget_password_verify(payload) { //忘記密-簡訊驗證
      let result = await httpConfig({
         url: '/member/forget_password_verify',
         method: 'post',
         data: payload
      }).then(res => res.data)
         .catch(err => err.response.data);
      return result;
   },
   async reset_password(payload) { //重設密碼
      let result = await httpConfig({
         url: '/member/reset_password',
         method: 'post',
         data: {
            temp_access_token: payload.temp_access_token,
            new_password: crypto.wm_aes(payload.new_password)
         }
      }).then(res => res.data)
         .catch(err => err.response.data);
      return result;
   }
}