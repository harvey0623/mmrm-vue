import { httpConfig } from './config.js';
import { crypto } from '@/plugins/crypto/index.js';

export const memberApi = {
   async forget_password(payload) { //忘記密碼第一步
      return await httpConfig({
         url: '/member/v1.1/forget_password',
         method: 'post',
         data: {
            mobile: crypto.wm_aes(payload.mobile),
            security_question: payload.security_question,
            security_answer: payload.security_answer
         }
      }).then(res => res.data)
         .catch(err => err.response.data);
   },
   async forget_password_verify(payload) { //忘記密-簡訊驗證
      return await httpConfig({
         url: '/member/forget_password_verify',
         method: 'post',
         data: payload
      }).then(res => res.data)
         .catch(err => err.response.data);
   },
   async reset_password(payload) { //重設密碼
      return await httpConfig({
         url: '/member/reset_password',
         method: 'post',
         data: {
            temp_access_token: payload.temp_access_token,
            new_password: crypto.wm_aes(payload.new_password)
         }
      }).then(res => res.data)
         .catch(err => err.response.data);
   },
   async verify_member_password(payload) { //密碼驗證
      return await httpConfig({
         url: '/member/verify_member_password',
         method: 'post',
         data: {
            password: crypto.wm_aes(payload.password)
         }
      }).then(res => res.data)
         .catch(err => err.response.data);
   }
}