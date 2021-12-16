<template src="./html/couponInfo.html"></template>

<script>
import { ref, reactive, onMounted, computed, watch } from '@vue/composition-api';
import { couponApi } from '@/api/coupon.js';
import { getAboutCouponInfo } from '@/composition-api/getAboutCouponInfo.js';
import { couponStateText } from '@/composition-api/couponStatus.js';
export default {
   name: 'couponInfo',
      metaInfo() {
      return {
         title: this.$i18n.t('page.couponInfo.title'),
      }
   },
   setup(props, { root }) {
      let { couponInfo, brandInfo, storeInfo, couponBackgroundImage, couponTitle, couponDuration, couponDesc, brandTitle, brandBackgroundImage, totalUageTimes, allStoreAvailable, storeCount, getCouponInfo, getBrandInfo, getStoreInfo } 
         = getAboutCouponInfo();
      let { statusText } = couponStateText();
      let myCouponId = ref(0);
      let isLoading = ref(false);
      let tempStatus = ref(false); //暫存票券轉贈結果
      let couponDetail = reactive({ data:{} });
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

      let couponTransferredText = computed(() => {
         if (!hasCouponDetail.value) return '';
         return couponDetail.data.coupon_transferred ? '允許轉贈' : '不可轉贈';
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

      let remainedUageTimes = computed(() => { //票券剩餘使用次數
         if (!hasCouponDetail.value) return '';
         return couponDetail.data.amount;
      });

      let getCouponDetail = async() => { //取得票券詳情
         return couponApi.my_coupon_detail({
            my_coupon_id: myCouponId.value
         }).then(res => res.info.results.my_coupon_detail)
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
         if (couponInfo.data.brand_ids.length > 0) {
            brandInfo.data = await getBrandInfo([couponInfo.data.brand_ids[0]]);
         }
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