import { httpConfig } from './config.js';

export const levelApi = {
   info(payload) {
      return httpConfig({
         url: '/level/level_information',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
   }
}