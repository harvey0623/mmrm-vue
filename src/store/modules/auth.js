import { authApi } from '@/api/auth.js';
import { webCrypto } from '@/plugins/crypto/webCrypto.js';
import { storage } from '@/plugins/storage/index.js';
import { cookie } from '@/plugins/cookie/index.js';

export const authStore = {
   namespaced: true,
   state: () => ({
      userInfo: {},
   }),
   mutations: {
      setUserInfo(state, payload) {
         state.userInfo = payload;
      }
   },
   getters: {
      isLogin(state) {
         // return state.userInfo.token !== undefined;
         return true;
      }
   },
   actions: {
      async doLogin({ commit }, payload) {
         commit('setLoading', true, { root: true });
         let loginResult = await authApi.login(payload);
         let isLogin = loginResult.status === 1;
         if (isLogin) {
            let { account, user_id, token } = loginResult.userinfo;
            let userInfo = { account, user_id, token };
            let encodeText = webCrypto.encodeUserInfo(userInfo);
            commit('setUserInfo', userInfo);
            storage.setItem('userInfo', { data: encodeText });
            cookie.set('userToken', userInfo.token, {
               expires: 7,
               sameSite: 'Lax',
            });
         }
         commit('setLoading', false, { root: true });
         return { status: isLogin };
      },
      decodeUserInfo({ commit }) {
         let storageData = storage.getItem('userInfo');
         if (storageData === null) return;
         let decodeText = webCrypto.decodeUserInfo(storageData.data);
         commit('setUserInfo', decodeText);
      },
      doLoginout({ commit }) {
         return new Promise(resolve => {
            commit('setLoading', true, { root: true });
            setTimeout(() => {
               storage.removeItem('userInfo');
               cookie.remove('userToken');
               commit('setUserInfo', {});
               commit('setLoading', false, { root: true });
               resolve({ status: true });
            }, 1000);
         });
      }
   }
}