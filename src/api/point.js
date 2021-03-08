import { httpConfig } from './config.js';

export const pointApi = {
   async point_history(payload) {
      let result = await httpConfig({
         url: '/point/point_history',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
      return result;
   },
   async pointDueToExpire(payload) {
      let result = await httpConfig({
         url: '/point/point_due_to_expire',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
      return result;
   },
   async pointInfo(payload) {
      let result = await httpConfig({
         url: '/point/point_information',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
      return result;
   },
   async externalPointInfo(payload) {
      let result = await httpConfig({
         url: '/point/external_point_information',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
      return result;
   }
}