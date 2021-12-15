<template>
   <router-link :to="couponLink" class="couponBlock">
      <div class="couponBlockL">
         <div class="brandInfo">
            <div class="brandLogo" :style="brandLogo"></div>
            <span>{{ brandTitle }}</span>
         </div>
         <div class="couponTitle">{{ couponItem.couponInfo.title }}</div>
         <div class="detail">
            <template v-if="isNormal">
               <p>使用期限 {{ couponItem.couponInfo.duration }}</p>
               <p>{{ availableStoreText }} / {{ usageTimes }}</p>
            </template>
            <template v-if="isHistory">
               <p>{{ deadlineTitle }} : {{ historyTime }}</p>
            </template>
            <template v-if="isTransfer">
               <p>轉贈帳號 : {{ couponItem.transfer_account }}</p>
               <p>轉贈時間 : {{ couponItem.transferred_datetime }}</p>
            </template> 
         </div>
      </div>
      <div class="couponBlockR" :style="couponImage">
         <div class="usageCover" v-show="!isAvailable">{{ usageText }}</div>
      </div>
   </router-link>
</template>

<script>
import { computed, toRefs } from '@vue/composition-api';
import { couponStateText } from '@/composition-api/couponStatus.js';
export default {
   props: {
      couponItem: {
         type: Object,
         required: true
      }
   },
   setup(props, context) {
      let { couponItem } = toRefs(props);
      let { statusText } = couponStateText();
      let timeStatus = {
         expired: '逾期時間',
         obsolete: '失效時間',
         redeemed: '使用時間',
      };

      let couponImage = computed(() => {
         let url = couponItem.value.couponInfo.feature_image.url;
         if (!url) return {};
         else return { backgroundImage: `url(${url})` };
      });

      let couponStatus = computed(() => { //票券狀態
         return couponItem.value.status;
      });

      let isAvailable = computed(() => { //是否可以使用
         return couponStatus.value === 'available';
      });

      let usageText = computed(() => { //使用文字
         return statusText[couponStatus.value];
      });

      let brandTitle = computed(() => {
         if (couponItem.value.brandInfo === null) return '品牌名稱';
         return couponItem.value.brandInfo.title || '';
      });

      let brandLogo = computed(() => {
         if (couponItem.value.brandInfo === null) return {};
         let url = couponItem.value.brandInfo.feature_image_big.url;
         if (!url) return {};
         else return { backgroundImage: `url(${url})` };
      });

      let availableStoreText = computed(() => { //適用門市
         if (couponItem.value.storeInfo.all_brands_available) return '全門市適用';
         else return `適用${couponItem.value.storeInfo.store_ids.length}家門市`;
      });

      let usageTimes = computed(() => { //剩餘使用次數
         return `尚可${couponItem.value.amount}使用`;
      });

      let isNormal = computed(() => { //一般狀態
         let arr = ['available', 'notyet'];
         return arr.includes(couponStatus.value);
      });

      let isHistory = computed(() => { //歷史狀態
         let arr = ['expired', 'obsolete', 'redeemed'];
         return arr.includes(couponStatus.value);
      });

      let isTransfer = computed(() => { //轉贈狀態
         return couponStatus.value === 'transferred';
      });

      let deadlineTitle = computed(() => {
         if (!isHistory.value) return '';
         return timeStatus[couponStatus.value];
      });

      let historyTime = computed(() => {
         if (!isHistory.value) return '';
         return couponItem.value[`${couponStatus.value}_datetime`];
      });

      let couponLink = computed(() => {
         if (isNormal.value) {
            return { name: 'couponInfo', params: { my_coupon_id: couponItem.value.my_coupon_id }};
         } else {
            return { name: 'couponFolder' };
         }
      });

      return { couponImage ,isAvailable, usageText, brandTitle, brandLogo, isNormal, availableStoreText, usageTimes, isHistory, deadlineTitle, historyTime, isTransfer, couponLink };
   }
}
</script>

<style lang="scss" src="./index.scss" scoped></style>