<template src="./html/couponFolder.html"></template>

<script>
import { ref, reactive, onMounted } from '@vue/composition-api';
import { couponApi } from '@/api/coupon.js';
import TabItem from '@/components/TabItem/index.vue';
export default {
   name: '',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.couponFolder.title'),
      }
   },
   setup(props, context) {
      let currentCouponType = ref('valid');
      let tabInfo = reactive([
         { type: 'valid', title: '我得票券' },
         { type: 'invalid', title: '歷史票券' },
         { type: 'transferred', title: '轉贈紀錄' },
      ]);

      let switchType = (tabType) => { //切換票券類型
         currentCouponType.value = tabType;
      }

      onMounted(async () => {
         
      });

      return { tabInfo, currentCouponType, switchType };
   },
   components: {
      TabItem
   }
}
</script>

<style lang="scss" src="./scss/couponFolder.scss" scoped></style>