import { httpConfig } from './config.js';
import { crypto } from '@/plugins/crypto/index.js';

export const memberApi = {
   forget_password(payload) { //忘記密碼第一步
      return httpConfig({
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
   forget_password_verify(payload) { //忘記密-簡訊驗證
      return httpConfig({
         url: '/member/forget_password_verify',
         method: 'post',
         data: payload
      }).then(res => res.data)
         .catch(err => err.response.data);
   },
   reset_password(payload) { //重設密碼
      return httpConfig({
         url: '/member/reset_password',
         method: 'post',
         data: {
            temp_access_token: payload.temp_access_token,
            new_password: crypto.wm_aes(payload.new_password)
         }
      }).then(res => res.data)
         .catch(err => err.response.data);
   },
   verify_member_password(payload) { //密碼驗證
      return httpConfig({
         url: '/member/verify_member_password',
         method: 'post',
         data: {
            password: crypto.wm_aes(payload.password)
         }
      }).then(res => res.data)
         .catch(err => err.response.data);
   },
   get_member_profile() { //會員資料
      return httpConfig({
         url: '/member/get_member_profile',
         method: 'post',
         data: {}
      }).then(res => res.data)
         .catch(err => err.response.data);
   },
   update_member_profile(payload) { //更新會員資料
      return httpConfig({
         url: '/member/update_member_profile',
         method: 'post',
         data: payload
      }).then(res => res.data)
         .catch(err => err.response.data);
   },
   update_member_mobile(payload) { //更新會員手機
      return httpConfig({
         url: '/member/update_member_mobile',
         method: 'post',
         data: {
            mobile: crypto.wm_aes(payload.mobile),
            password: crypto.wm_aes(payload.password)
         }
      }).then(res => res.data)
         .catch(err => err.response.data);
   },
   member_verify(payload) { //會員認證(更新手機號碼用)
      return httpConfig({
         url: '/member/member_verify',
         method: 'post',
         data: payload
      }).then(res => res.data)
         .catch(err => err.response.data);
   },
   update_member_password(payload) { //更新密碼
      return httpConfig({
         url: '/member/update_member_password',
         method: 'post',
         data: {
            old_password: crypto.wm_aes(payload.old_password),
            new_password: crypto.wm_aes(payload.new_password)
         }
      }).then(res => res.data)
         .catch(err => err.response.data);
   },
   member_summary() { //會員資訊
      return httpConfig({
         url: '/member/member_summary',
         method: 'post',
         data: {}
      }).then(res => res.data)
         .catch(err => err.response.data);
   },
   member_card() { //會員條碼
      return httpConfig({
         url: '/member/get_member_card',
         method: 'post',
         data: {}
      }).then(res => res.data)
         .catch(err => err.response.data);
   }
}