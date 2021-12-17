import { httpConfig } from './config.js';

export const couponApi = {
   my_coupon_list(payload) {
      return httpConfig({
         url: '/coupon/my_coupon_list',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
   },
   my_coupon_detail(payload) {
      return httpConfig({
         url: '/coupon/my_coupon_detail',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
   },
   coupon_information(payload) {
      return httpConfig({
         url: '/coupon/coupon_information',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
   },
   async transfer_my_coupon(payload) {
      return httpConfig({
         url: '/coupon/transfer_my_coupon',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data)
         .catch(err => err.response.data);
   }
}