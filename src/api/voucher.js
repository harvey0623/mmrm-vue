import { httpConfig } from './config.js';

export const voucherApi = {
   async getInfo(payload) {
      let result = await httpConfig({
         url: '/voucher/voucher_information',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
      return result;
   }
}