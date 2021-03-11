import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/index.js';
import Home from '@/views/home/index.vue';
import Login from '@/views/login/index.vue';
import Register from '@/views/register/index.vue';
import Register_step1 from '@/views/register/step1.vue';
import Register_step2 from '@/views/register/step2.vue';
import Register_step3 from '@/views/register/step3.vue';
import Member from '@/views/member/index.vue';
import ForgotPassword from '@/views/member/forgotPassword.vue';
import VerifyPassword from '@/views/member/verifyPassword.vue';
import ResetPassword from '@/views/member/resetPassword.vue';
import Maintain from '@/views/member/maintain.vue';
import FixMobile from '@/views/member/fixMobile.vue';
import MemberVerify from '@/views/member/memberVerify.vue';
import UpdatePassword from '@/views/member/updatePassword.vue';
import MemberLevel from '@/views/member/memberLevel.vue';
import Transaction from '@/views/member/transaction.vue';
import PointInfo from '@/views/member/pointInfo.vue';
import PointDesc from '@/views/member/pointDesc.vue';
import MemberCard from '@/views/member/memberCard.vue';
import Coupon from '@/views/coupon/index.vue';
import CouponFolder from '@/views/coupon/couponFolder.vue';
import CouponInfo from '@/views/coupon/couponInfo.vue';
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
		path: '/register',
		component: Register,
		beforeEnter: checkIsLogin,
		children: [
			{
				path: '',
				redirect: 'step1'
			},
			{ 
				path: 'step1',
				component: Register_step1,
				meta: {
					step: 1,
					register: true,
				}
			},
			{ 
				path: 'step2',
				component: Register_step2,
				meta: {
					step: 2,
					register: true,
				}
			},
			{ 
				path: 'step3',
				component: Register_step3,
				meta: {
					step: 3,
					register: true,
				}
			},
		]
	},
	{
		path: '/member',
		component: Member,
		children: [
			{
				path: '',
				redirect: '/'
			},
			{
				path: 'forgotPassword',
				component: ForgotPassword,
				beforeEnter: checkIsLogin
			},
			{
				path: 'verifyPassword',
				component: VerifyPassword,
				beforeEnter: checkIsLogin
			},
			{
				path: 'resetPassword',
				component: ResetPassword,
				beforeEnter: checkIsLogin
			},
			{
				path: 'maintain',
				component: Maintain,
				meta: {
					auth: true
				}
			},
			{
				path: 'fixMobile',
				component: FixMobile,
				meta: {
					auth: true
				}
			},
			{
				path: 'memberVerify',
				component: MemberVerify,
				meta: {
					auth: true
				}
			},
			{
				path: 'updatePassword',
				component: UpdatePassword,
				meta: {
					auth: true
				}
			},
			{
				path: 'level',
				component: MemberLevel,
				meta: {
					auth: true
				}
			},
			{
				path: 'transaction',
				component: Transaction,
				meta: {
					auth: true
				}
			},
			{
				path: 'pointInfo/:point_id(\\d+)',
				component: PointInfo,
				meta: {
					auth: true
				}
			},
			{
				path: 'pointDesc/:point_id(\\d+)',
				component: PointDesc,
				name: 'pointDesc',
				meta: {
					auth: true
				}
			},
			{
				path: 'card',
				component: MemberCard,
				meta: {
					auth: true
				}
			},
		]
	},
	{
		path: '/coupon',
		component: Coupon,
		meta: {
			auth: true
		},
		children: [
			{
				path: '',
				redirect: '/'
			},
			{
				path: 'folder',
				name: 'couponFolder',
				component: CouponFolder
			},
			{
				path: 'info/:my_coupon_id(\\d+)',
				name: 'couponInfo',
				component: CouponInfo
			},
		]
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