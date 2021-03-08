<template>
   <img ref="qrcodeImg">
</template>

<script>
import { ref, onMounted, toRefs } from '@vue/composition-api';
import Qrious from 'qrious';
export default {
   props: {
      qrcodeInfo: {
         type: Object,
         required: true
      }
   },
   setup(props, context) {
      let qrcodeImg = ref(null);

      let createQrcodeSchema = (cardData, vehicleCode) => { //產生qrcode資料結構
         let total = cardData.length;
         let endIndex = vehicleCode !== undefined ? total -1 : total;
         let schema = {
            source: {
               system: 'MMRM',
               app: '{{MMRM}}',
               type: 'member'
            },
            card_info: cardData.slice(0, endIndex),
            invoice_info: [
               {
                  key: 'einvoice_carrier_no',
                  value: vehicleCode !== undefined ? vehicleCode : ''
               }
            ]
         };
         return JSON.stringify(schema);
      }
      
      let createQrcode = (value) => { //產生qrcode圖型
         new Qrious({
            element: qrcodeImg.value,
            value,
            size: 220,
         });
      }

      onMounted(() => {
         let { normalCode, vehicleCode } = toRefs(props.qrcodeInfo);
         let schemaText = createQrcodeSchema(normalCode.value, vehicleCode.value);
         createQrcode(schemaText);
      });

      return { qrcodeImg };
   }
}
</script>

<style></style>