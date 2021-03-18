<template src="./html/activityInfo.html"></template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import { activityApi } from '@/api/activity.js';
import { pointApi } from '@/api/point.js';
import { brandApi } from '@/api/brand.js';
import { storeApi } from '@/api/store.js';
import _ from 'lodash';
export default {
   name: 'activityList',
      metaInfo() {
      return {
         title: this.$i18n.t('page.activityInfo.title'),
      }
   },
   setup(props, { root }) {
      let isLoading = ref(false);
      let activityId = ref(0);
      let activityInfo = reactive({ data: {} });
      let activityBrandLogo = ref('');
      let couponList = reactive({ data: [] });
      let redeemStatus = {
         free: '免費兌換',
         redeem_code: '兌換碼兌換',
         point: '點數兌換'
      };

      let hasActivityInfo = computed(() => {
         return !(_.isEmpty(activityInfo.data));
      });

      let activityTitle = computed(() => {
         if (!hasActivityInfo.value) return '';
         else return activityInfo.data.title;
      });

      let activityDuration = computed(() => {
         if (!hasActivityInfo.value) return '';
         let startTime = activityInfo.data.start_datetime.split(' ')[0];
         let endTime = activityInfo.data.end_datetime.split(' ')[0];
         return `${startTime}~${endTime}`;
      });

      let activityMeta = computed(() => {
         if (!hasActivityInfo.value) return [];
         else return activityInfo.data.meta;
      });

      let activityContent = computed(() => {
         if (!hasActivityInfo.value) return '';
         else return activityInfo.data.content;
      });

      let brandLogoBg = computed(() => {
         if (!hasActivityInfo.value) return {};
         if (activityBrandLogo.value === '') return {};
         return { backgroundImage: `url(${activityBrandLogo.value})` };
      });

      let getActivityInfo = async() => {
         return activityApi.couponInfo({
            coupon_activity_ids: [activityId.value],
            full_info: true
         }).then(res => res.info.results.coupon_activity_information[0]);
      }

      let getBrandInfo = async(brandIds) => {
         return brandApi.brand_information({
            brand_ids: brandIds,
            full_info: false
         }).then(res => res.info.results.brand_information)
      }

      onMounted(async() => {
         activityId.value = parseInt(root.$route.params.activity_id);
         activityInfo.data = await getActivityInfo();
         console.log(activityInfo.data);
         let { brand_id, coupon_ids } = activityInfo.data;
         activityBrandLogo.value = await getBrandInfo([brand_id])
            .then(res => res[0].feature_image_small.url);
         
      });

      return { isLoading, activityTitle, activityDuration, activityMeta, activityContent, activityBrandLogo, brandLogoBg }
   }
}
</script>

<style lang="scss" src="./scss/activityInfo.scss"></style>