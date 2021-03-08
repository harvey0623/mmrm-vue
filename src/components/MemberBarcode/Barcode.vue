<template>
   <div class="codeItem">
      <p>{{ barcodeTitle }}</p>
      <svg :id="svgId"></svg>
   </div>
</template>

<script>
import JsBarcode from 'jsbarcode';
export default {
   props: {
      barcodeTitle: {
         type: String,
         default: ''
      },
      barcodeValue: {
         type: String,
         required: true
      }
   },
   computed: {
      svgId() {
         return `barcode-${Math.ceil(Math.random() * 1000000)}`;
      }
   },
   mounted() {
      JsBarcode(`#${this.svgId}`, this.barcodeValue, {
         width: 1.5,
			height: 50,
			displayValue: true,
         fontSize: 14,
         textMargin: 5,
         background: 'transparent'
      });
   }
}
</script>

<style></style>