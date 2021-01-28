import Vue from 'vue';
import Vuex from 'vuex';
import { authStore } from './modules/auth.js';
import { authPlugin } from './plugins/auth.js'

Vue.use(Vuex);

export default new Vuex.Store({
	strict: process.env.NODE_ENV === 'dev',
	state: {
		openExpirePopup: false,
		openLogoutPopup: false,
	},
	mutations: {
		setExpirePopup(state, value) {
			state.openExpirePopup = value;
		},
		setLogoutPopup(state, value) {
			state.openLogoutPopup = value;
		}
	},
	actions: {
		
   },
   modules: {
		auth: authStore
	},
	plugins: [authPlugin]
});