<template>
   <div class="swiper-slide">
      <Barcode
         v-for="(item,index) in slideItem"
         :key="index"
         :barcodeTitle="item.key"
         :barcodeValue="item.value"
      ></Barcode>
   </div>
</template>

<script>
import Barcode from './Barcode.vue';
export default {
   props: {
      slideItem: {
         type: Array,
         required: true
      }
   },
   components: {
      Barcode
   }
}
</script>

<style></style>