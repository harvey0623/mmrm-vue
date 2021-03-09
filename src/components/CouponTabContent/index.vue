<template>
   <div class="tabContent" v-show="isCorrespond">
      <div class="couponGroup">
         <CouponBlock
            v-for="(item,index) in categoryData.data"
            :key="item.coupon_no + index"
            :couponItem="item"
         ></CouponBlock>
      </div>
      <div class="emptyBlock" v-show="showEmpty">
         <div class="emptyBg"></div>
         <p>您沒有票券呦～</p>
      </div>
      <div class="pagTip" v-show="isReached">已經到最底囉～</div>
   </div>
</template>

<script>
import { computed, toRefs } from '@vue/composition-api';
import CouponBlock from '@/components/CouponBlock/index.vue';
export default {
   props: {
      contentType: {
         type: String,
         required: true
      },
      currentCouponType: {
         type: String,
         required: true
      },
      categoryData: {
         type: Object,
         required: true
      },
      isLoading: {
         type: Boolean,
         required: true
      }
   },
   setup(props, context) {
      let { contentType, currentCouponType, categoryData, isLoading } = toRefs(props);

      let isCorrespond = computed(() => {
         return contentType.value === currentCouponType.value;
      });

      let hasNextPage = computed(() => {
         return categoryData.value.currentPage !== null;
      });

      let hasLists = computed(() => {
         return categoryData.value.data.length > 0;
      });

      let isReached = computed(() => {
         return !isLoading.value && !hasNextPage && hasLists;
      });

      let showEmpty = computed(() => {
         return !isLoading.value && !hasNextPage && !hasLists;
      });


      return { isCorrespond, isReached, showEmpty };
   },
   components: {
      CouponBlock
   }
}
</script>

<style>

</style>