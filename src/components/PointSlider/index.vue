<template>
   <div id="point-swiper-container" class="swiper-container">
      <div class="swiper-wrapper">
         <div 
            class="swiper-slide"
            v-for="slide in slideList"
            :key="slide.pointId">
            <span>{{ slide.title }}</span>
            <span class="amount">{{ slide.amount }}</span>
            <span>點</span>
            <span class="pointArrow"></span>
         </div>
      </div>
   </div>
</template>

<script>
import { onMounted, computed } from '@vue/composition-api';
import Swiper from 'swiper/bundle';
export default {
   props: {
      slideList: {
         type: Array,
         required: true
      }
   },
   setup(props) {
      let isThanOneSlide = computed(() => props.slideList.length > 1);
      
      onMounted(() => {
         new Swiper('#point-swiper-container', {
            direction: 'vertical',
            loop: true,
            allowTouchMove: false,
            autoplay: isThanOneSlide.value ? { delay: 3000 } : false,
            speed: 1000,
         });
      });
   }
}
</script>

<style lang="scss" scoped>
   $basicHeight: map-get($heightObj, basic);
   #point-swiper-container {
      height: $basicHeight;
      .swiper-slide {
         text-align: center;
         line-height: $basicHeight;
         >.amount{
            margin: 0 3px;
            color: var(--variationMain);
         }
      }
   }
   .pointArrow {
      content: '';
      display: inline-block;
      @include size(15px);
      @extend %bgImgCenter;
      background-image: url("~@/assets/img/page/btn_listcore_indicatorright_std_n@2x.png");
      transform: translateY(2px);
   }
</style>