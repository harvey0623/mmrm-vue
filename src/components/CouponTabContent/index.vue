<template>
   <div class="tabContent" v-show="isCorrespond">
      <div class="couponGroup">
         {{ contentType }}
      </div>
      <!-- <div class="emptyBlock" v-show="noValidCoupon">
         <div class="emptyBg"></div>
         <p>您沒有票券呦～</p>
      </div>
      <div class="pagTip" v-show="isLoading">資料加載中...</div>
      <div class="pagTip" v-show="validReach">已經到最底囉～</div> -->
   </div>
</template>

<script>
import { ref, reactive, onMounted, computed, toRefs } from '@vue/composition-api';
export default {
   props: {
      contentType: {
         type: String,
         required: true
      },
      currentCouponType: {
         type: String,
         required: true
      }
   },
   setup(props, context) {
      let { contentType, currentCouponType } = toRefs(props);
      let isCorrespond = computed(() => {
         return contentType.value === currentCouponType.value;
      });

      return { isCorrespond };
   }
}
</script>

<style>

</style>