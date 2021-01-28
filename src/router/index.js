import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/index.js';
import Home from '@/views/home/index.vue';
import Login from '@/views/login/index.vue';
import { cookie } from '@/plugins/cookie/index.js';
import { checkIsLogin }  from '../middleware/checkIsLogin.js';

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
		component: Login,
		beforeEnter: checkIsLogin
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
	if (to.matched.some(item => item.meta.auth === true)) {
		let mmrmToken = cookie.get('mmrmToken');
		if (mmrmToken === undefined) {
			store.commit('auth/setLogin', false);
			return next('/login');
		}
	}
	return next();
});

export default router;
