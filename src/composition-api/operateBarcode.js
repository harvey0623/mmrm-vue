import { ref, reactive, computed } from '@vue/composition-api';
import _ from 'lodash';
export const operateBarcode = function () {
   let qrcodeInfo = reactive({ data: {} });
   let barcodeList = reactive({ data: [] });
   let barcodeTypeId = ref(1);
   let barcodeMapping = { 1: '切換一維條碼', 2: '切換二維條碼' };
   
   let hasQrcodeInfo = computed(() => { //是否有qrcode資料
      return !(_.isEmpty(qrcodeInfo.data));
   });
   
   let hasBarcodeList = computed(() => { //是否有條碼資料
      return barcodeList.data.length > 0;
   });

   let barcodeTypeText = computed(() => {
      return barcodeMapping[barcodeTypeId.value];
   });

   let switchBarcodeType = () => { //切換條碼類型
      barcodeTypeId.value = barcodeTypeId.value === 1 ? 2 : 1;
   }

   return { barcodeTypeId, barcodeTypeText, switchBarcodeType, qrcodeInfo, barcodeList, hasQrcodeInfo, hasBarcodeList };
}