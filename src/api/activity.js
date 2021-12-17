import { httpConfig } from './config.js';

export const activityApi = {
   briefCoupon() {
      return httpConfig({
         url: '/activity/brief_coupon_activity_type',
         method: 'post',
         data: {}
      }).then(res => res.data);
   },
   searchCoupon(payload) {
      return httpConfig({
         url: '/activity/search_coupon_activity',
         method: 'post',
         data: {...payload}
      }).then(res => res.data);
   },
   couponInfo(payload) {
      return httpConfig({
         url: '/activity/coupon_activity_information',
         method: 'post',
         data: {...payload}
      }).then(res => res.data);
   },
   redeemCoupon(payload) {
      return httpConfig({
         url: '/activity/redeem_coupon_activity',
         method: 'post',
         data: {...payload}
      }).then(res => {
         return res.data
      }).catch(err => {
         return err.response.data;
      });
   },
}