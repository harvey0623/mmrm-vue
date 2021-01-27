import Vue from 'vue';
import Vuex from 'vuex';
import { authStore } from './modules/auth.js';

Vue.use(Vuex);

export default new Vuex.Store({
	strict: process.env.NODE_ENV === 'dev',
	state: {
		isLoading: false
	},
	mutations: {
		setLoading(state, value) {
			state.isLoading = value;
		}
	},
	actions: {
		
   },
   modules: {
		auth: authStore
	}
});