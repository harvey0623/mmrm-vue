import { httpConfig } from './config.js';

export const brandApi = {
   search_brand() {
      return httpConfig({
         url: '/brand/search_brand',
         method: 'post',
         data: {}
      }).then(res => res.data);
   },
   brand_information(payload) {
      return httpConfig({
         url: '/brand/brand_information',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
   }
}