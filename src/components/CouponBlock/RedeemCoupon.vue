<template>
   <router-link :to="{ name: 'activityCoupon', params: linkParams }" class="couponBlock reverse">
      <div class="couponBlockL">
         <div class="brandInfo" v-show="isAllBrand">
            <div class="brandLogo" :style="brandLogo"></div>
            <span>{{ brandTitle }}</span>
         </div>
         <div class="couponTitle">{{ couponInfo.title }}</div>
         <div class="detail">
            <p>使用期限 : {{ couponInfo.duration }}</p>
            <p>{{ availableStoreText }}</p>
         </div>
      </div>
      <div class="couponBlockR reverse" :style="couponImage"></div>
   </router-link>
</template>

<script>
import { computed, toRefs } from '@vue/composition-api';
export default {
   props: {
      couponItem: {
         type: Object,
         required: true
      },
      brandList: {
         type: Array,
         required: true
      },
      couponType: {
         type: String,
         required: true
      }
   },
   setup(props) {
      let { couponItem:couponInfo, brandList, couponType } = toRefs(props);
      let isAllBrand = computed(() => couponInfo.value.brand_ids.length === 0);
      let brandId = computed(() => couponInfo.value.brand_ids[0]);
      let brandDetail = computed(() => {
         return brandList.value.find(item => item.brand_id === brandId.value) || null;
      });

      let brandLogo = computed(() => {
         if (brandDetail.value === null) return {};
         let imgUrl = brandDetail.value.feature_image_small.url;
         if (imgUrl !== null) return { backgroundImage: `url(${imgUrl})` };
         else return {};
      });

      let brandTitle = computed(() => {
         if (brandDetail.value === null) return '';
         else return brandDetail.value.title;
      });

      let linkParams = computed(() => {
         let key = couponType.value === 'coupon' ? 'coupon_id' : 'voucher_id';
         return { couponType: couponType.value, coupon_id: couponInfo.value[key] };
      });

      let couponImage = computed(() => {
         let imgUrl = couponInfo.value.feature_image.url;
         if (imgUrl === null) return {};
         else return { backgroundImage: `url(${imgUrl})` };
      });

      let availableStoreText = computed(() => {
         let { storeList, total } = couponInfo.value;
         let totalStore = storeList.store_ids.length;
         return storeList.all_brands_available ? `全門市適用 / 可用${total}次` : `適用${totalStore}家門市 / 可用${total}次`;
      });

      return { couponInfo, brandLogo, brandTitle, linkParams, couponImage, isAllBrand, availableStoreText };
   }
}
</script>

<style lang="scss" src="./index.scss" scoped></style>