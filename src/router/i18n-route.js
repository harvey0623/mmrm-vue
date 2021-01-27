import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/home/index.vue";
import RouterView from '@/views/routerView/index.vue';
import { translate } from '@/plugins/i18n/translate.js';

Vue.use(VueRouter);

const routes = [
   {
      path: '/:locale',
		component: RouterView,
		beforeEnter: translate.routeMiddleware,
		children: [
			{
				path: '',
				name: 'home',
				component: Home
			},
		]
	},
	{
		path: '*',
		redirect(to) {
			return `/${translate.currentLanguage}`;
		}
	}
];

const router = new VueRouter({
	mode: 'hash',
   routes,
});

export default router;