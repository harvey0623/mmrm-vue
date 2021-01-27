import { httpConfig } from './config.js';
export const authApi = {
   async login(payload) {
      let result = await httpConfig({
         url: '',
         method: 'post',
         data: payload
      }).then(res => res.data);
      return result;
   }
}