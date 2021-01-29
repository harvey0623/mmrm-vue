import { httpConfig } from './config.js';

export const termApi = {
   async brefTerm(payload) {
      let result = await httpConfig({
         url: '/term/brief_term',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
      return result;
   }
}