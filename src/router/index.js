import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/index.js';
import Home from '@/views/home/index.vue';
import Login from '@/views/login/index.vue';
import { storage } from '@/plugins/storage/index.js';
Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home
	},
	{
		path: '/login',
		name: 'login',
		component: Login
	},
	{
		path: '*',
		redirect: '/'
	}
];

const router = new VueRouter({
	mode: 'hash',
	routes,
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else if (to.hash) {
			return {
				selector: to.hash
			};
		} else {
			return { x: 0, y: 0 };
		}
	}
});

router.beforeEach((to, from, next) => {
	// if (to.matched.some(item => item.meta.auth === true)) {
	// 	let storageData = storage.getItem('userInfo');
	// 	if (storageData === null) return next('/login');
	// 	let storageAuthToken = webCrypto.decodeUserInfo(storageData.data).token;
	// 	let storeAuthToken = store.state.auth.userInfo.token;
	// 	if (storageAuthToken !== storeAuthToken) return next('/login');
	// }
	return next();
});

export default router;
