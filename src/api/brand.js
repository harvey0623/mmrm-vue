import { httpConfig } from './config.js';

export const brandApi = {
   async search_brand() {
      let result = await httpConfig({
         url: '/brand/search_brand',
         method: 'post',
         data: {}
      }).then(res => res.data);
      return result;
   },
   async brand_information(payload) {
      let result = await httpConfig({
         url: '/brand/brand_information',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
      return result;
   }
}