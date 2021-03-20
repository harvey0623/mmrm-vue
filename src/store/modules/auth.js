import { authApi } from '@/api/auth.js';
import { memberApi } from '@/api/member.js';
import { cookie } from '@/plugins/cookie/index.js';
import { storage } from '@/plugins/storage/index.js';
import { crypto } from '@/plugins/crypto/index.js';

const timeSessionKey = 'startTime';
const signUpSessionKey = 'signUp';

export const authStore = {
   namespaced: true,
   state: () => ({
      isLogin: false,
      passwordToken: '',
      pwVerified: false
   }),
   mutations: {
      setLogin(state, value) {
         state.isLogin = value;
      },
      setPasswordToken(state, value) {
         state.passwordToken = value;
      },
      setPwVerify(state, value) {
         state.pwVerified = value;
      }
   },
   actions: {
      checkAuthCookie({ commit }) {
         let mmrmToken = cookie.get('mmrmToken');
         commit('setLogin', mmrmToken !== undefined);
      },
      async login({ commit }, payload) { //登入
         let loginResult = await authApi.login(payload);
         if (loginResult.status) commit('setLogin', true);
         return loginResult;
      },
      async logout({ commit }) { //登出
         let logoutResult = await authApi.logout();
         if (logoutResult.status) {
            commit('setLogin', false);
            commit('setLogoutPopup', true, { root: true });
         }
      },
      async register_step1({ commit }, payload) { //註冊第一步
         let stepResult = await authApi.register_check(payload);
         if (stepResult.status) {
            let signUpData = storage.getSessionItem(signUpSessionKey);
            if (signUpData === null) {
               let encodeText = crypto.encodeSignUp({ step1: payload });
               storage.setSessionItem(signUpSessionKey, encodeText);
            } else {
               let decodeData = crypto.decodeSignUp(signUpData);
               decodeData.step1 = payload;
               let encodeText = crypto.encodeSignUp(decodeData);
               storage.setSessionItem(signUpSessionKey, encodeText);
            }
            storage.setSessionItem(timeSessionKey, { data: Date.now() });
         }
         return stepResult;
      },
      async register({ dispatch }, payload) { //註冊第二步
         let step1Data = await dispatch('getStepData', 'step1');
         let stepResult = await authApi.register({
            step1: step1Data,
            step2: payload
         });
         if (stepResult.status) {
            let encodeText = crypto.encodeSignUp({
               step1: step1Data,
               step2: payload,
               temp_access_token: stepResult.info.results.temp_access_token
            });
            storage.setSessionItem(signUpSessionKey, encodeText);
         }
         return stepResult;
      },
      async registerVerify({ dispatch }, payload) { //註冊第三步
         let token = await dispatch('getStepData', 'temp_access_token');
         let stepResult = await authApi.registerVerify({
            temp_access_token: token,
            verify_code: payload.verify_code
         });
         if (stepResult.status) dispatch('clearAllRegister');
         return stepResult;
      },
      async checkHasSignupData({ dispatch }) { //確認註冊時間是否超時
         let limitTime = 10 * 60 * 1000;
         let startTime = storage.getSessionItem('startTime');
         if (startTime === null) return false;
         let diffTime = Date.now() - startTime.data;
         if (diffTime >= limitTime) {
            dispatch('clearAllRegister');
            return false;
         }
         let signUpData = storage.getSessionItem(signUpSessionKey);
         if (signUpData === null) return false;
         return true;
      },
      getStepData({ commit }, key) { //取得階段資料
         let signUpData = storage.getSessionItem(signUpSessionKey);
         return crypto.decodeSignUp(signUpData)[key];
      },
      clearAllRegister() { //清除所有註冊資料
         storage.removeSessionItem(timeSessionKey);
         storage.removeSessionItem(signUpSessionKey);
      },
      async verifyPassword({ commit }, value) { //驗證密碼
         let verifyResult = await memberApi.verify_member_password({ password: value });
         if (verifyResult.status) {
            commit('setPwVerify', true);
            storage.setSessionItem('pwVerified', { status: true });
         }
         return verifyResult;
      },
      checkPwVerify({ commit }) { //檢查密碼是否被驗證過
         let storageData = storage.getSessionItem('pwVerified');
         if (storageData === null) return;
         if (storageData.status) commit('setPwVerify', true);
      }
   }
}