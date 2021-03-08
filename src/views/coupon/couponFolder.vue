<template src="./html/couponFolder.html"></template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import { couponApi } from '@/api/coupon.js';
import TabItem from '@/components/TabItem/index.vue';
export default {
   name: 'couponFolder',
   metaInfo() {
      return {
         title: this.$i18n.t('page.couponFolder.title'),
      }
   },
   setup(props, context) {
      let currentCouponType = ref('valid');
      let couponCategory = reactive({ data: {} });
      let tabInfo = reactive([
         { type: 'valid', title: '我得票券' },
         { type: 'invalid', title: '歷史票券' },
         { type: 'transferred', title: '轉贈紀錄' },
      ]);

      let currentCateogry = computed({
         get() {
            return couponCategory.data[currentCouponType.value];
         },
         set({ key, value }) {
            let targetObj = couponCategory.data[currentCouponType.value];
            if (key === 'data') {
               targetObj.data = targetObj.data.concat(value);
            } else {
               targetObj[key] = value;
            }
         }
      });

      let switchType = (tabType) => { //切換票券類型
         currentCouponType.value = tabType;
      }

      let initCateogry = () => { //初始票券種類
         couponCategory.data = tabInfo.reduce((prev, current) => {
            prev[current.type] = { 
               type: current.type,
               isFirst: true,
               data: [],
               currentPage: 0,
               scrollPos: 0,
            };
            return prev;
         }, {});
      }

      let getCouponList = async() => { //取得票券列表
         let { info } = await couponApi.my_coupon_list({
            type: currentCouponType.value,
            offset: currentCateogry.value.currentPage
         });
         currentCateogry.value = { key: 'currentPage', value: info.next };
         currentCateogry.value = { key: 'data', value: info.results.my_coupon_list };
      }

      onMounted(async() => {
         initCateogry();
         getCouponList();
      });

      return { tabInfo, currentCouponType, switchType };
   },
   components: {
      TabItem
   }
}
</script>

<style lang="scss" src="./scss/couponFolder.scss" scoped></style>