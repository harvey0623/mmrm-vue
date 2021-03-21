<template>
   <router-link 
      :to="{ name: 'activityCoupon', params: { coupon_id: couponItem.coupon_id }}" 
      class="couponBlock reverse">
      <div class="couponBlockL">
         <div class="brandInfo">
            <div class="brandLogo" :style="brandLogo"></div>
            <span>{{ couponItem.brandInfo.title }}</span>
         </div>
         <div class="couponTitle">{{ couponItem.title }}</div>
         <div class="detail">
            <p>使用期限 : {{ couponItem.duration }}</p>
            <p>{{ availableStoreText }}</p>
         </div>
      </div>
      <div class="couponBlockR"></div>
   </router-link>
</template>

<script>
import { computed, toRefs } from '@vue/composition-api';
export default {
   props: {
      couponItem: {
         type: Object,
         required: true
      }
   },
   setup(props, context) {
      let { couponItem } = toRefs(props);
      
      let brandLogo = computed(() => {
         let url = couponItem.value.brandInfo.feature_image_small.url;
         if (!url) return {};
         else return { backgroundImage: `url(${url})` };
      });

      let availableStoreText = computed(() => {
         let { storeInfo, total } = couponItem.value;
         let totalStore = storeInfo.store_ids.length;
         if (couponItem.value.storeInfo.all_brands_available) {
            return `全門市適用 / 可用${total}次`;
         } else {
            return `適用${totalStore}家門市 / 可用${total}次`;
         } 
      });

      return { brandLogo, availableStoreText };
   }
}
</script>

<style lang="scss" src="./index.scss" scoped></style>