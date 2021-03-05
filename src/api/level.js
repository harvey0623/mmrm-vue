import { httpConfig } from './config.js';

export const levelApi = {
   async info(payload) {
      let result = await httpConfig({
         url: '/level/level_information',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
      return result;
   }
}