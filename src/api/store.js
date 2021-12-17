import { httpConfig } from './config.js';

export const storeApi = {
   searchAvailableStore(payload) {
      return httpConfig({
         url: '/store/v1.1/search_coupon_available_store',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
   },
   searchVoucherStore(payload) {
      return httpConfig({
         url: '/store/search_voucher_available_store',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
   },
}