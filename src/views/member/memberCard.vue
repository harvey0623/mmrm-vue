<template src="./html/memberCard.html"></template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import { memberApi } from '@/api/member.js';
import { levelApi } from '@/api/level.js';
import Qrious from 'qrious';
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

      let switchBarcodeType = () => { //切換條碼類型
         barcodeTypeId.value = barcodeTypeId.value === 1 ? 2 : 1;
      }

      let createQrcodeSchema = (cardData, vehicleCode) => { //產生qrcode資料結構
         let total = cardData.length;
         let endIndex = vehicleCode !== undefined ? total -1 : total;
         let schema = {
            source: {
               system: 'MMRM',
               app: '{{MMRM}}',
               type: 'member'
            },
            card_info: cardData.splice(0, endIndex),
            invoice_info: [
               {
                  key: 'einvoice_carrier_no',
                  value: vehicleCode !== undefined ? vehicleCode : ''
               }
            ]
         };
         return JSON.stringify(schema);
      }
      
      let createQrcode = (cardData, vehicleCod) => { //產生qrcode圖型
         new Qrious({
            element: qrcodeEl.value,
            value: createQrcodeSchema(cardData, vehicleCod),
            size: 220,
         });
      }

      onMounted(async () => {
         isLoading.value = true;
         let cardSource = [];
         let memberProfile = await memberApi.get_member_profile();
         let memberSummary = await memberApi.member_summary();
         let levelId = memberSummary.info.results.level_summary.current_level.level_id;
         let levelInfo = await levelApi.info({ level_id: [levelId] });
         let memberCard = await memberApi.member_card().then(res => {
            return res.info.results.member_card.code_info.card_info[0];
         });
         let vehicleCode = memberProfile.info.results.member_profile.einvoice_carrier_no;
         memberName.value = memberProfile.info.results.member_profile.name;
         memberLevel.value = levelInfo.info.results.level_information[0].title;
         cardSource = cardSource.concat(memberCard);
         if (vehicleCode !== undefined) cardSource.push({ key: '載具條碼', value: vehicleCode });
         createQrcode(cardSource, vehicleCode);

         isLoading.value = false;
      });

      return { isLoading, memberName, memberLevel, switchBarcodeType, barcodeTypeText, qrcodeEl, barcodeTypeId };
   }
}
</script>

<style lang="scss" src="./scss/memberCard.scss" scoped></style>