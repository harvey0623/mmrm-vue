<template src="./html/activityCoupon.html"></template>

<script>
import { ref, reactive,  computed, onMounted } from '@vue/composition-api';
import { couponApi } from '@/api/coupon.js';
import { brandApi } from '@/api/brand.js';
import { storeApi } from '@/api/store.js';
import _ from 'lodash';
export default {
   name: 'activityCoupon',
   metaInfo() {
      return {
         title: this.$i18n.t('page.redeemCouponInfo.title'),
      }
   },
   setup(props, { root }) {
      let couponId = ref(0);
      let isLoading = ref(false);
      let couponInfo = reactive({ data: {} });
      let brandInfo = reactive({ data: {} });
      let storeInfo = reactive({ data: {} });

      let hasCouponInfo = computed(() => {
         return !(_.isEmpty(couponInfo.data));
      });

      let hasBrandInfo = computed(() => {
         return !(_.isEmpty(brandInfo.data));
      });

      let hasStoreInfo = computed(() => {
         return !(_.isEmpty(storeInfo.data));
      });

      let couponBackgroundImage = computed(() => {
         if (!hasCouponInfo.value) return {};
         let url = couponInfo.data.feature_image.url;
         if (url) return { backgroundImage: `url(${url})` };
         else return {};
      });

      let couponTitle = computed(() => {
         if (!hasCouponInfo.value) return '';
         return couponInfo.data.title;
      });

      let couponDuration = computed(() => {
         if (!hasCouponInfo.value) return '';
         return couponInfo.data.duration;
      });

      let couponDesc = computed(() => {
         if (!hasCouponInfo.value) return '';
         return couponInfo.content || '';
      });

      let couponTransferredText = computed(() => {
         if (!hasCouponInfo.value) return '';
         return couponInfo.data.can_transfer ? '允許轉贈' : '不可轉贈';
      });

      let brandTitle = computed(() => {
         if (!hasBrandInfo.value) return '';
         return brandInfo.data.title;
      });

      let brandBackgroundImage = computed(() => {
         if (!hasBrandInfo.value) return {};
         let url = brandInfo.data.feature_image_small.url;
         if (url) return { backgroundImage: `url(${url})` };
         else return {};
      });

      let totalUageTimes = computed(() => { //票券可使用次數
         if (!hasCouponInfo.value) return '';
         return couponInfo.data.total;
      });

      let allStoreAvailable = computed(() => { //全門市適用
         if (!hasStoreInfo.value) return false;
         return storeInfo.data.all_brands_available;
      });

      let storeCount = computed(() => { //店家數量
         if (!hasStoreInfo.value) return 0;
         return storeInfo.data.store_ids.length;
      });

      let getCouponInfo = (couponIds) => { //取得票券資料
         return couponApi.coupon_information({
            coupon_ids: couponIds,
            full_info: true
         }).then(res => res.info.results.coupon_information[0]);
      }

      let getBrandInfo = (brandIds) => { //取得品牌資訊
         return brandApi.brand_information({
            brand_ids: brandIds,
            full_info: false
         }).then(res => res.info.results.brand_information[0]);
      }

      let getStoreInfo = (couponIds) => { //取得商店資訊
         return storeApi.searchAvailableStore({
            coupon_ids: couponIds
         }).then(res => res.info.results.search_coupon_available_store_results[0])
      }
      
      onMounted(async() => {
         isLoading.value = true;
         couponId.value = parseInt(root.$route.params.coupon_id);
         couponInfo.data = await getCouponInfo([couponId.value]);
         brandInfo.data = await getBrandInfo([couponInfo.data.brand_ids[0]]);
         storeInfo.data = await getStoreInfo([couponId.value]);
         isLoading.value = false;
         console.log(couponInfo.data)
      });

      return { isLoading, couponBackgroundImage, couponTitle, couponDuration, couponDesc, brandTitle, brandBackgroundImage, totalUageTimes, allStoreAvailable, storeCount, couponTransferredText };
   }
}
</script>

<style lang="scss" src="@/views/coupon/scss/couponInfo.scss" scoped></style>