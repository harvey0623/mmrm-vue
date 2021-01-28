import { authApi } from '@/api/auth.js';
import { cookie } from '@/plugins/cookie/index.js';

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
            .catch(err => err.response.data)
         return logoutResult;
      }
   }
}