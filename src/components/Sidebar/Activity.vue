<template src="./html/activity.html"></template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import { brandApi } from '@/api/brand.js';
import { activityApi } from '@/api/activity.js';
import { pointApi } from '@/api/point.js';
import BrandCriteriaItem from '@/components/CriteriaItem/Brand.vue';
export default {
   props: {
      isOpen: {
         type: Boolean,
         required: true
      }
   },
   setup(props, { emit }) {
      let subId = ref('sub1');
      let brandCondition = reactive({ data: [] });

      let backHandler = () => { //選單返回
         if (subId.value !== '') return showSubMenu('');
         emit('update:isOpen', false);
      }

      let showSubMenu = (id) => subId.value = id; //顯示次選單

      let changeBrandStatus = ({ id, status }) => {
         let obj = brandCondition.data.find(item => item.brand_id === id);
         obj.checked = status;
      }

      let createBrandCriteria = (data) => {
         return data.reduce((prev, current) => {
            let { brand_id, title, feature_image_small } = current;
            prev.push({ brand_id, title, url: feature_image_small.url, checked: true });
            return prev;
         }, []);
      }

      let getAboutBrand = async() => {
         let brandIds = await brandApi.search_brand().then(res => res.info.results.brand_ids);
         let brandInfo = await brandApi.brand_information({ brand_ids: brandIds, full_info: false })
            .then(res => res.info.results.brand_information)
         brandCondition.data = createBrandCriteria(brandInfo);
      }

      onMounted(async() => {
         await getAboutBrand();
      });

      return { backHandler, subId, showSubMenu, brandCondition, changeBrandStatus }
   },
   components: {
      BrandCriteriaItem
   }
}
</script>

<style>

</style>