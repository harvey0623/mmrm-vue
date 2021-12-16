<template src="./html/exchangeOk.html"></template>

<script>
import { ref, reactive, onMounted } from '@vue/composition-api';
import { couponApi } from '@/api/coupon.js';
import OptionPopup from '@/components/Popup/OptionPopup.vue';
export default {
   name: 'exchangeOk',
   metaInfo() {
      return {
         title: this.$i18n.t('page.exchangeOk.title'),
      }
   },
   setup(props, { root }) {
      let isLoading = ref(false);
      let metaInfo = reactive({ data: [] });
      let myCouponIds = reactive({ data: [] });
      let couponIds = reactive([]);
      let myCouponDetail = reactive([]);
      let couponList = reactive({ data: [] });
      let couponPopupOption = reactive({
         title: '請選擇票券',
         isOpen: false
      });
      
      let assignData = () => {
         let storageData = root.$storage.getSessionItem('redeemInfo');
         if (storageData === null) return;
         myCouponIds.data = storageData.my_coupon_ids;
         metaInfo.data = storageData.meta;
      }

      let getMyCouponDetail = async() => {
         for (let i= 0; i < myCouponIds.data.length; i++ ) {
            let couponId = myCouponIds.data[i];
            let { info } = await couponApi.my_coupon_detail({ my_coupon_id : couponId });
            myCouponDetail.push(info.results.my_coupon_detail);
            couponIds.push(info.results.my_coupon_detail.coupon_id);
         }
      }

      let intergateCoupon = (couponInfo) => { //整合票券資料
         return couponInfo.reduce((prev, current) => {
            let couponId = current.coupon_id;
            let obj = myCouponDetail.find(item => item.coupon_id === couponId);
            prev.push({ ...current, my_coupon_id: obj.my_coupon_id });
            return prev;
         }, []);
      }

      onMounted(async() => {
         isLoading.value = true;
         assignData();
         // if (myCouponIds.data.length === 0) return false;
         // await getMyCouponDetail();
         // let couponInfo = await couponApi.coupon_information({
         //    coupon_ids: couponIds,
         //    full_info: false
         // }).then(res => res.info.results.coupon_information);
         // couponList.data = intergateCoupon(couponInfo);
         isLoading.value = false;
      });
      
      return { isLoading, metaInfo, couponList, couponPopupOption };
   },
   components: {
      OptionPopup
   }
}
</script>

<style lang="scss" src="./scss/exchangeOk.scss"></style>