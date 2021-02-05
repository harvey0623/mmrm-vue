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
      }).then(res => res.data);
      return result;
   },
   async forget_password_verify(payload) { //忘記密-簡訊驗證
      let result = await httpConfig({
         url: '/member/forget_password_verify',
         method: 'post',
         data: payload
      }).then(res => res.data);
      return result;
   }
}