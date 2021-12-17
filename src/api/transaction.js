import { httpConfig } from './config.js';

export const transactionApi = {
   history(payload) {
      return httpConfig({
         url: '/transaction/transaction_history',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
   },
   async detail(payload) {
      return httpConfig({
         url: '/transaction/transaction_detail',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
   }
}