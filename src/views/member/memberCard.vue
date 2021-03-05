<template src="./html/memberCard.html"></template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import { memberApi } from '@/api/member.js';
import { levelApi } from '@/api/level.js';
const Qrious = require('qrious');
export default {
   name: 'memberCard',
   metaInfo() {
      return {
         title: this.$i18n.t('page.memberCard.title'),
      }
   },
   setup(props, context) {
      let isLoading = ref(false);
      let memberName = ref('');
      let memberLevel = ref('');
      let barcodeTypeId = ref(1);
      let barcodeMapping = { 1: '切換一維條碼', 2: '切換二維條碼' };
      let qrcodeEl = ref(null);

      let barcodeTypeText = computed(() => {
         return barcodeMapping[barcodeTypeId.value];
      });

      let switchBarcodeType = () => {
         barcodeTypeId.value = barcodeTypeId.value === 1 ? 2 : 1;
      }

      // let createQrcode = function() {
      //    new Qrious({
      //       element: qrcodeEl.value,
      //       value: 'https://github.com/neocotic/qrious',
      //       size: 220,
      //    });
      // }

      onMounted(async () => {
         let memberProfile = await memberApi.get_member_profile();
         let memberSummary = await memberApi.member_summary();
         console.log(memberProfile)
         memberName.value = memberProfile.info.results.member_profile.name;
      });

      return { isLoading, memberName, memberLevel, switchBarcodeType, barcodeTypeText, qrcodeEl };
   }
}
</script>

<style lang="scss" src="./scss/memberCard.scss" scoped></style>