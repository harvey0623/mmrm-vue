<template src="./html/couponInfo.html"></template>

<script>
import { ref, reactive, onMounted, computed, watch } from '@vue/composition-api';
import { couponApi } from '@/api/coupon.js';
import { brandApi } from '@/api/brand.js';
import { storeApi } from '@/api/store.js';
import { couponStateText } from '@/composition-api/couponStatus.js';
import _ from 'lodash';
export default {
   name: 'couponInfo',
      metaInfo() {
      return {
         title: this.$i18n.t('page.couponInfo.title'),
      }
   },
   setup(props, { root }) {
      let myCouponId = ref(0);
      let isLoading = ref(false);
      let tempStatus = ref(false); //暫存票券轉贈結果
      let couponDetail = reactive({ data:{} });
      let couponInfo = reactive({ data: {} });
      let brandInfo = reactive({ data: {} });
      let storeInfo = reactive({ data: {} });
      let { statusText } = couponStateText();
      let transferPopupOption = reactive({
         isOpen: false,
         showCancel: true,
         popupTitle: '請輸入轉贈手機號',
         message: '轉贈票券將會送出所有剩餘的可用次數',
         inputType: 'number',
         eventName: 'transfer',
         validateRule: 'required|phone'
      });
      let msgOption = reactive({
         isOpen: false,
         message: '',
         eventName: 'transferResult'
      });

      let hasCouponDetail = computed(() => {
         return !(_.isEmpty(couponDetail.data));
      });

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

      let couponTransferredText = computed(() => {
         if (!hasCouponDetail.value) return '';
         return couponDetail.data.coupon_transferred ? '允許轉贈' : '不可轉贈';
      });

      let couponDesc = computed(() => {
         if (!hasCouponInfo.value) return '';
         return couponInfo.content || '';
      });

      let couponStatusText = computed(() => {
         if (!hasCouponDetail.value) return '';
         return statusText[couponDetail.data.status];
      });

      let couponIsAvailable = computed(() => {
         if (!hasCouponDetail.value) return '';
         return couponDetail.data.status === 'available';
      });

      let canTransferred = computed(() => {
         if (!hasCouponDetail.value) return false;
         return couponDetail.data.coupon_transferred;
      });

      let canUsageCoupon = computed(() => { //使用條件
         if (!hasCouponDetail.value) return false;
         let couponStatus = couponDetail.data.status;
         let whiteList = ['available'];
         if (canTransferred.value) whiteList.push('notyet');
         return whiteList.includes(couponStatus);
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

      let remainedUageTimes = computed(() => { //票券剩餘使用次數
         if (!hasCouponDetail.value) return '';
         return couponDetail.data.amount;
      });

      let allStoreAvailable = computed(() => { //全門市適用
         if (!hasStoreInfo.value) return false;
         return storeInfo.data.all_brands_available;
      });

      let storeCount = computed(() => { //店家數量
         if (!hasStoreInfo.value) return 0;
         return storeInfo.data.store_ids.length;
      });

      let getCouponDetail = async() => { //取得票券詳情
         return couponApi.my_coupon_detail({
            my_coupon_id: myCouponId.value
         }).then(res => res.info.results.my_coupon_detail)
      }

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

      let transferHandler = async(val) => { //票券轉贈
         isLoading.value = true;
         let { status, info } = await couponApi.transfer_my_coupon({
            my_coupon_id: myCouponId.value,
            account: val
         }).then(res => res);
         transferPopupOption.isOpen = false;
         tempStatus.value = status;
         msgOption.message = status ? `您的優惠券已轉贈成功，會員帳號${val}` : info.rcrm.RM;
         msgOption.isOpen = true;
         isLoading.value = false;
      }

      let transferResultHandler = () => {
         if (tempStatus.value) root.$router.replace({ name: 'couponFolder' });
         msgOption.isOpen = false;
      }

      let init = async() => {
         isLoading.value = true;
         myCouponId.value = parseInt(root.$route.params.my_coupon_id);
         couponDetail.data = await getCouponDetail();
         couponInfo.data = await getCouponInfo([couponDetail.data.coupon_id]);
         brandInfo.data = await getBrandInfo([couponInfo.data.brand_ids[0]]);
         storeInfo.data = await getStoreInfo([couponDetail.data.coupon_id]);
         isLoading.value = false;
      }

      watch(() => root.$route, () => {
         init();
      });

      onMounted(() => {
         init();
      });

      return { myCouponId, isLoading, couponBackgroundImage, couponTitle, couponDuration, couponTransferredText, brandTitle, brandBackgroundImage, totalUageTimes, remainedUageTimes, allStoreAvailable, storeCount, couponDesc, couponStatusText, couponIsAvailable, canUsageCoupon, canTransferred, transferPopupOption, transferHandler, msgOption, transferResultHandler };
   }
}
</script>

<style lang="scss" src="./scss/couponInfo.scss" scoped></style>