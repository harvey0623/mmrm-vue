import { httpConfig } from './config.js';
import { crypto } from '@/plugins/crypto/index.js';

export const authApi = {
   login(payload) { //登入
      return httpConfig({
         url: '/member/login',
         method: 'post',
         data: {
            account: crypto.wm_aes(payload.account),
            password: crypto.wm_aes(payload.password),
         }
      }).then(res => res.data)
         .catch(err => err.response.data);
   },
   logout() { //登出
      return httpConfig({
         url: '/member/logout',
         method: 'post',
         data: {}
      }).then(res => {
         return { status: true };
      }).catch(err => {
         return { status: false };
      });
   },
   register_check(payload) { //註冊第一步
      return httpConfig({
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
      }).then(res => res.data)
         .catch(err => err.response.data);
   },
   register({ step1, step2 }) { //註冊第二步
      return httpConfig({
         url: '/member/register',
         method: 'post',
         data: {
            ...step1,
            ...step2,
            mobile: crypto.wm_aes(step1.mobile),
            password: crypto.wm_aes(step1.password),
         }
      }).then(res => res.data)
         .catch(err => err.response.data)
   },
   registerVerify(payload) { //註冊第三步
      return httpConfig({
         url: '/member/register_verify',
         method: 'post',
         data: payload
      }).then(res => res.data)
         .catch(err => err.response.data);
   }
}