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
      let { hasCouponInfo ,couponInfo, brandInfo, storeInfo, couponBackgroundImage, couponTitle, couponDuration, couponDesc, brandTitle, brandBackgroundImage, totalUageTimes, allStoreAvailable, storeCount, getCouponInfo, getBrandInfo, getStoreInfo, getVoucherInfo, getVoucherStoreInfo } 
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
         let couponType = root.$route.params.couponType;
         let infoMethod = couponType === 'coupon' ? getCouponInfo : getVoucherInfo;
         let storeMehtod = couponType === 'coupon' ? getStoreInfo : getVoucherStoreInfo;
         let storeParams = couponType === 'coupon' ? [couponId.value] : couponId.value;
         couponInfo.data = await infoMethod([couponId.value]);
         storeInfo.data = await storeMehtod(storeParams);
         if (couponInfo.data.brand_ids.length > 0) {
            brandInfo.data = await getBrandInfo([couponInfo.data.brand_ids[0]]);
         }
         isLoading.value = false;
      });

      return { isLoading, couponBackgroundImage, couponTitle, couponDuration, couponDesc, brandTitle, brandBackgroundImage, totalUageTimes, allStoreAvailable, storeCount, couponTransferredText };
   }
}
</script>

<style lang="scss" src="@/views/coupon/scss/couponInfo.scss" scoped></style>