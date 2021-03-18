<template src="./html/activityInfo.html"></template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import { activityApi } from '@/api/activity.js';
import { brandApi } from '@/api/brand.js';
import { storeApi } from '@/api/store.js';
import { couponApi } from '@/api/coupon.js';
// import { pointApi } from '@/api/point.js';
import RedeemCoupon from '@/components/CouponBlock/RedeemCoupon.vue';
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
      let usageStatus = {
         opening: '已開啟',
         unopened: '尚未開始',
         closed: '已結束'
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

      let activityIsOpening = computed(() => {
         if (!hasActivityInfo.value) return false;
         return activityInfo.data.status === 'opening';
      });

      let redeemTypeText = computed(() => {
         if (!hasActivityInfo.value) return '';
         return redeemStatus[activityInfo.data.redeem_type];
      });

      let usageText = computed(() => {
         if (!hasActivityInfo.value) return '';
         return usageStatus[activityInfo.data.status];
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

      let getCouponInfo = async(couponIds) => {
         return couponApi.coupon_information({
            coupon_ids: couponIds,
            full_info: false
         }).then(res => res.info.results.coupon_information);
      }

      let getBrandIds = (data) => {
         let arr = data.reduce((prev, current) => {
            prev = prev.concat(current.brand_ids);
            return prev;
         }, []);
         return Array.from(new Set(arr));
      }

      let intergateCoupon = ({ couponInfo, brandInfo, storeInfo }) => { //整和票券
         return couponInfo.reduce((prev, current) => {
            let targetBrand = brandInfo.find(item => item.brand_id === current.brand_ids[0]);
            let targetStore = storeInfo.find(item => item.coupon_id === current.coupon_id);
            prev.push({ ...current, brandInfo: targetBrand, storeInfo: targetStore });
            return prev;
         }, []);
      }

      onMounted(async() => {
         isLoading.value = true;
         activityId.value = parseInt(root.$route.params.activity_id);
         activityInfo.data = await getActivityInfo();
         let { brand_id, coupon_ids } = activityInfo.data;
         activityBrandLogo.value = await getBrandInfo([brand_id])
         .then(res => res[0].feature_image_small.url);
         let couponInfo = await getCouponInfo(coupon_ids);
         let brandIds = getBrandIds(couponInfo);
         let brandInfo = await getBrandInfo(brandIds);
         let storeInfo = await storeApi.searchAvailableStore({ coupon_ids })
            .then(res => res.info.results.search_coupon_available_store_results);

         couponList.data = intergateCoupon({ couponInfo, brandInfo, storeInfo });
         isLoading.value = false;
      });

      return { isLoading, activityTitle, activityDuration, activityMeta, activityContent, activityBrandLogo, brandLogoBg, activityIsOpening, redeemTypeText, usageText, couponList }
   },
   components: {
      RedeemCoupon
   }
}
</script>

<style lang="scss" src="./scss/activityInfo.scss"></style>