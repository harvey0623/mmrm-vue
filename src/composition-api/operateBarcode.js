import { ref, reactive, computed } from '@vue/composition-api';
export const operateBarcode = function () {
   let barcodeTypeId = ref(1);
   let barcodeMapping = { 1: '切換一維條碼', 2: '切換二維條碼' };

   let barcodeTypeText = computed(() => {
      return barcodeMapping[barcodeTypeId.value];
   });

   let switchBarcodeType = () => { //切換條碼類型
      barcodeTypeId.value = barcodeTypeId.value === 1 ? 2 : 1;
   }

   return { barcodeTypeId, barcodeTypeText, switchBarcodeType };
}