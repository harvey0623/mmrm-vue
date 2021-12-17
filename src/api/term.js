import { httpConfig } from './config.js';

export const termApi = {
   brefTerm(payload) {
      return httpConfig({
         url: '/term/brief_term',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
   }
}