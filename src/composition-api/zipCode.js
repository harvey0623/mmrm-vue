import { reactive, computed } from '@vue/composition-api';
import zipData from '@/assets/json/zipcode.json';
export const zipCode = function() {
   let zipList = reactive(zipData);
   let resideInfo = reactive({
      city: '',
      district: '',
   });

   let cityList = computed(() => {
      return zipList.map(item => item.name);
   });

   let relayDistrict = computed({
      get() {
         return resideInfo.district;
      },
      set(val) {
         resideInfo.district = val;
      }
   })

   let districtList = computed(() => {
      relayDistrict = '';
      let obj = zipList.find(item => item.name === resideInfo.city);
      if (obj !== undefined) return obj.districts;
      else return [];
   });

   return { resideInfo, cityList, districtList };
}