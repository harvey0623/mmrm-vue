import { httpConfig } from './config.js';

export const voucherApi = {
   getInfo(payload) {
      return httpConfig({
         url: '/voucher/voucher_information',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
   }
}