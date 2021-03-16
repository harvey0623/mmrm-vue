import { httpConfig } from './config.js';

export const activityApi = {
   async briefCoupon() {
      let result = await httpConfig({
         url: '/activity/brief_coupon_activity_type',
         method: 'post',
         data: {}
      }).then(res => res.data);
      return result;
   },
   async searchCoupon(payload) {
      let result = await httpConfig({
         url: '/activity/search_coupon_activity',
         method: 'post',
         data: {...payload}
      }).then(res => res.data);
      return result;
   },
   async couponInfo(payload) {
      let result = await httpConfig({
         url: '/activity/coupon_activity_information',
         method: 'post',
         data: {...payload}
      }).then(res => res.data);
      return result;
   },
   async redeemCoupon(payload) {
      let result = await httpConfig({
         url: '/activity/redeem_coupon_activity',
         method: 'post',
         data: {...payload}
      }).then(res => {
         return res.data
      }).catch(err => {
         return err.response.data;
      });
      return result;
   },
}