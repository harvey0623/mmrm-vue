import Vue from 'vue';
import Cookies from 'js-cookie';
let obj = {
   get(key) {
      return Cookies.get(key);
   },
   set(key, value, option = {}) {
      Cookies.set(key, value, option);
   },
   remove(key, option) {
      Cookies.remove(key, option);
   }
}

Vue.prototype.$cookie = obj;
export const cookie = obj;