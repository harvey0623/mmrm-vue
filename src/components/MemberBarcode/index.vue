<template>
   <div class="swiper-container barcode-container">
      <div class="swiper-wrapper">
         <Slide
            v-for="(slide,index) in slideList"
            :key="index"
            :slideItem="slide.data"
         ></Slide>
      </div>
      <div class="swiper-pagination barcode-pagination"></div>
   </div>
</template>

<script>
import { computed, onMounted, toRefs } from '@vue/composition-api';
import Swiper from 'swiper/bundle';
import Slide from './Slide.vue';
export default {
   props: {
      barcodeList: {
         type: Array,
         required: true
      }
   },
   setup(props, { root }) {
      let { barcodeList } = toRefs(props);

      let slideList = computed(() => { //分頁資料
         let count = 2;
         let total = Math.ceil(barcodeList.value.length / count);
         let result = [];
         for (let i = 1; i <= total; i++) {
            let startIndex = (i - 1) * count;
            let endIndex = (i - 1) * count + count;
            let arr = barcodeList.value.slice(startIndex, endIndex);
            result.push({ data: arr });
         }
         return result;
      });

      let isThanOneSlide = computed(() => {
         return slideList.value.length > 1;
      });

      let initSwiper = () => {
         let option = {
            autoPlay: false,
            allowTouchMove: isThanOneSlide.value,
            pagination: {
               el: '.barcode-pagination'
            }
         };
         if (!isThanOneSlide.value) delete option.pagination;
         new Swiper('.barcode-container', option);
      }

      onMounted(async() => {
         initSwiper();
      });

      return { slideList };
   },
   components: {
      Slide
   }
}
</script>

<style></style>