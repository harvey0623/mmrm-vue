import store from '@/store/index.js';
export const checkIsLogin = (to, from, next) => {
   if (store.state.auth.isLogin) return next('/');
   else return next();
}