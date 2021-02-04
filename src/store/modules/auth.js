import { authApi } from '@/api/auth.js';
import { cookie } from '@/plugins/cookie/index.js';
import { storage } from '@/plugins/storage/index.js';
import { crypto } from '@/plugins/crypto/index.js';
import _ from 'lodash';

const timeSessionKey = 'startTime';
const signUpSessionKey = 'signUp';

export const authStore = {
   namespaced: true,
   state: () => ({
      isLogin: false,
   }),
   mutations: {
      setLogin(state, value) {
         state.isLogin = value;
      }
   },
   actions: {
      checkAuthCookie({ commit }) {
         let mmrmToken = cookie.get('mmrmToken');
         commit('setLogin', mmrmToken !== undefined);
      },
      async login({ commit }, payload) {
         let loginResult = await authApi.login(payload).then(res => res)
            .catch(err => err.response.data);
         if (loginResult.status) commit('setLogin', true);
         return loginResult;
      },
      async logout({ commit }) {
         let logoutResult = await authApi.logout().then(res => res)
            .catch(err => err.response.data);
         return logoutResult;
      },
      async register_step1({ commit }, payload) { //註冊第一步
         let stepResult = await authApi.register_check(payload).then(res => res)
            .catch(err => err.response.data);
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
         let step2Data = _.cloneDeep(payload);
         step2Data.birthday = step2Data.birthday.replace(/-/g, '/');
         let stepResult = await authApi.register({
            step1: step1Data,
            step2: step2Data
         }).then(res => res)
            .catch(err => err.response.data);
         if (stepResult.status) {
            let encodeText = crypto.encodeSignUp({
               step1: step1Data,
               step2: step2Data,
               temp_access_token: stepResult.info.results.temp_access_token
            });
            storage.setSessionItem(signUpSessionKey, encodeText);
         }
         return stepResult;
      },
      async checkHasSignupData({ dispatch }) { //確認註冊時間是否超時
         let limitTime = 1 * 60 * 1000;
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
      }
   }
}