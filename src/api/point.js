import { httpConfig } from './config.js';

export const pointApi = {
   point_history(payload) {
      return httpConfig({
         url: '/point/point_history',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
   },
   pointDueToExpire(payload) {
      return httpConfig({
         url: '/point/point_due_to_expire',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
   },
   pointInfo(payload) {
      return httpConfig({
         url: '/point/point_information',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
   },
   externalPointInfo(payload) {
      return httpConfig({
         url: '/point/external_point_information',
         method: 'post',
         data: { ...payload }
      }).then(res => res.data);
   }
}