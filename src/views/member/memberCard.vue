<template src="./html/memberCard.html"></template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import { memberApi } from '@/api/member.js';
import { levelApi } from '@/api/level.js';
import MemberQrcode from '@/components/MemberQrcode/index.vue';
import MemberBarCode from '@/components/MemberBarcode/index.vue';
import { operateBarcode } from '@/composition-api/operateBarcode.js';
import _ from 'lodash';
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
      let { barcodeTypeId, barcodeTypeText, switchBarcodeType, qrcodeInfo, barcodeList, hasQrcodeInfo, hasBarcodeList } = operateBarcode();

      onMounted(async () => {
         isLoading.value = true;
         let cardSource = [];
         let memberProfile = await memberApi.get_member_profile().then(res => {
            return res.info.results.member_profile;
         });
         let memberSummary = await memberApi.member_summary();
         let levelId = memberSummary.info.results.level_summary.current_level.level_id;
         let levelInfo = await levelApi.info({ level_id: [levelId] });
         let memberCard = await memberApi.member_card().then(res => {
            return res.info.results.member_card.code_info.card_info;
         });
         let vehicleCode = memberProfile.einvoice_carrier_no;
         memberName.value = memberProfile.name;
         memberLevel.value = levelInfo.info.results.level_information[0].title;
         cardSource = cardSource.concat(memberCard);
         if (vehicleCode !== undefined) cardSource.push({ key: '載具條碼', value: vehicleCode });
         qrcodeInfo.data = { normalCode: cardSource, vehicleCode };
         barcodeList.data = cardSource;
         isLoading.value = false;
      });

      return { isLoading, memberName, memberLevel, switchBarcodeType, barcodeTypeText, barcodeTypeId, qrcodeInfo, hasQrcodeInfo, barcodeList, hasBarcodeList };
   },
   components: {
      MemberQrcode,
      MemberBarCode
   }
}
</script>

<style lang="scss" src="./scss/memberCard.scss" scoped></style>