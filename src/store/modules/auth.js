import { authApi } from '@/api/auth.js';
import { cookie } from '@/plugins/cookie/index.js';
import { storage } from '@/plugins/storage/index.js';
import { crypto } from '@/plugins/crypto/index.js';
import _ from 'lodash';

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
   getters: {
      
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
      async register_step1({ commit }, payload) {
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
         }
         return stepResult;
      },
      async register({ commit }, payload) {
         let signUpData = storage.getSessionItem(signUpSessionKey);
         console.log(crypto.decodeSignUp(signUpData));
         let step1Data = crypto.decodeSignUp(signUpData).step1;
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
      }
   }
}