<template src="./html/couponCard.html"></template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import { couponApi } from '@/api/coupon.js';
import { brandApi } from '@/api/brand.js';
import { memberApi } from '@/api/member.js';
import { operateBarcode } from '@/composition-api/operateBarcode.js';
import MemberQrcode from '@/components/MemberQrcode/index.vue';
import MemberBarCode from '@/components/MemberBarcode/index.vue';
import _ from 'lodash';
export default {
   name: 'couponCard',
      metaInfo() {
      return {
         title: this.$i18n.t('page.couponCard.title'),
      }
   },
   setup(props, { root }) {
      let myCouponId = ref(0);
      let isLoading = ref(false);
      let couponDetail = reactive({ data: {} });
      let couponInfo = reactive({ data: {} });
      let brandInfo = reactive({ data: {} });
      let { barcodeTypeId, barcodeTypeText, switchBarcodeType, qrcodeInfo, barcodeList, hasQrcodeInfo, hasBarcodeList } = operateBarcode();

      let couponName = computed(() => {
         if (_.isEmpty(couponInfo.data)) return '';
         return couponInfo.data.title; 
      });

      let couponDuration = computed(() =>{
         if (_.isEmpty(couponDetail.data)) return '';
         return couponDetail.data.duration;
      });

      let hasBrandLogo = computed(() => {
         return !(_.isEmpty(brandInfo.data)); 
      });

      let brandLogo = computed(() => {
         if (!hasBrandLogo.value) return '';
         return brandInfo.data.feature_image_small.url;
      });

      let getCouponDetail = () => {
         return couponApi.my_coupon_detail({
            my_coupon_id: myCouponId.value
         }).then(res => res.info.results.my_coupon_detail);
      }

      let getCouponInfo = (couponIds) => {
         return couponApi.coupon_information({
            coupon_ids: couponIds,
            full_info: false
         }).then(res => res.info.results.coupon_information[0]);
      }

      let getBrandInfo = (brandIds) => {
         return brandApi.brand_information({
            brand_ids: brandIds,
            full_info: false
         }).then(res => res.info.results.brand_information[0]);
      }

      onMounted(async() => {
         isLoading.value = true;
         let cardSource = [];
         myCouponId.value = parseInt(root.$route.params.my_coupon_id);
         couponDetail.data = await getCouponDetail();
         couponInfo.data = await getCouponInfo([couponDetail.data.coupon_id]);
         if (couponInfo.data.brand_ids > 0) {
            brandInfo.data = await getBrandInfo([couponInfo.data.brand_ids[0]]);
         }
         let memberProfile = await memberApi.get_member_profile().then(res => {
            return res.info.results.member_profile;
         });
         let memberCard = await memberApi.member_card().then(res => {
            return res.info.results.member_card.code_info.card_info;
         });
         let vehicleCode = memberProfile.einvoice_carrier_no;
         cardSource.push({ key: '票券條碼', value: couponDetail.data.coupon_no });
         cardSource = cardSource.concat(memberCard);
         if (vehicleCode !== undefined) cardSource.push({ key: '載具條碼', value: vehicleCode });
         qrcodeInfo.data = { normalCode: cardSource, vehicleCode };
         barcodeList.data = cardSource;

         isLoading.value = false;
      });

      return { couponName, isLoading, couponDuration, brandLogo, switchBarcodeType, barcodeTypeText, barcodeTypeId, hasBrandLogo, qrcodeInfo, barcodeList, hasQrcodeInfo, hasBarcodeList }
   },
   components: {
      MemberQrcode,
      MemberBarCode
   }
}
</script>

<style lang="scss" src="./scss/couponCard.scss" scoped></style>