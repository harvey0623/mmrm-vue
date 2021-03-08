import { httpConfig } from './config.js';

export const transactionApi = {
   async history(payload) {
      let result = await httpConfig({
         url: '/transaction/transaction_history',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
      return result;
   },
   async detail(payload) {
      let result = await httpConfig({
         url: '/transaction/transaction_detail',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
      return result;
   }
}