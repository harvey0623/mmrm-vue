import { reactive, computed, watch } from '@vue/composition-api';
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

   let districtList = computed(() => {
      let obj = zipList.find(item => item.name === resideInfo.city);
      if (obj !== undefined) return obj.districts;
      else return [];
   });

   watch(() => resideInfo.city, () => {
      resideInfo.district = '';
   });

   return { resideInfo, cityList, districtList };
}