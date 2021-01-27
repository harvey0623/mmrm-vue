import { authApi } from '@/api/auth.js';
import { storage } from '@/plugins/storage/index.js';
import { cookie } from '@/plugins/cookie/index.js';

export const authStore = {
   namespaced: true,
   state: () => ({
      member_access_token: ''
   }),
   mutations: {
      setMemberToken(state, value) {
         state.member_access_token = value;
      }
   },
   getters: {
      isLogin(state) {
         return false
      }
   },
   actions: {
      async login({ commit }, payload) {
         let loginResult = await authApi.login(payload).then(res => res)
            .catch(err => err.response.data);
         console.log(loginResult)
         
      },
      doLoginout({ commit }) {
         
      }
   }
}