<template src="./html/activityCoupon.html"></template>

<script>
import { ref, computed, onMounted } from '@vue/composition-api';
import { getAboutCouponInfo } from '@/composition-api/getAboutCouponInfo.js';
export default {
   name: 'activityCoupon',
   metaInfo() {
      return {
         title: this.$i18n.t('page.redeemCouponInfo.title'),
      }
   },
   setup(props, { root }) {
      let { hasCouponInfo ,couponInfo, brandInfo, storeInfo, couponBackgroundImage, couponTitle, couponDuration, couponDesc, brandTitle, brandBackgroundImage, totalUageTimes, allStoreAvailable, storeCount, getCouponInfo, getBrandInfo, getStoreInfo } 
         = getAboutCouponInfo();
      let couponId = ref(0);
      let isLoading = ref(false);

      let couponTransferredText = computed(() => {
         if (!hasCouponInfo.value) return '';
         return couponInfo.data.can_transfer ? '允許轉贈' : '不可轉贈';
      });
      
      onMounted(async() => {
         isLoading.value = true;
         couponId.value = parseInt(root.$route.params.coupon_id);
         couponInfo.data = await getCouponInfo([couponId.value]);
         brandInfo.data = await getBrandInfo([couponInfo.data.brand_ids[0]]);
         storeInfo.data = await getStoreInfo([couponId.value]);
         isLoading.value = false;
      });

      return { isLoading, couponBackgroundImage, couponTitle, couponDuration, couponDesc, brandTitle, brandBackgroundImage, totalUageTimes, allStoreAvailable, storeCount, couponTransferredText };
   }
}
</script>

<style lang="scss" src="@/views/coupon/scss/couponInfo.scss" scoped></style>