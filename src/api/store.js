import { httpConfig } from './config.js';

export const storeApi = {
   async searchAvailableStore(payload) {
      let result = await httpConfig({
         url: '/store/v1.1/search_coupon_available_store',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
      return result;
   },
   async searchVoucherStore(payload) {
      let result = await httpConfig({
         url: '/store/search_voucher_available_store',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
      return result;
   },
}