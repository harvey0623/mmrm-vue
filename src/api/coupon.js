import { httpConfig } from './config.js';

export const couponApi = {
   async my_coupon_list(payload) {
      let result = await httpConfig({
         url: '/coupon/my_coupon_list',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
      return result;
   },
   async my_coupon_detail(payload) {
      let result = await httpConfig({
         url: '/coupon/my_coupon_detail',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
      return result;
   },
   async coupon_information(payload) {
      let result = await httpConfig({
         url: '/coupon/coupon_information',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
      return result;
   },
   async transfer_my_coupon(payload) {
      let result = await httpConfig({
         url: '/coupon/transfer_my_coupon',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data)
      return result;
   }
}