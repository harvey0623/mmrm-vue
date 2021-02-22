<template src="./html/TradeItem.html"></template>

<script>
import { ref, reactive, onMounted, computed, toRefs } from '@vue/composition-api';
import _ from 'lodash';
import { transactionApi } from '@/api/transaction.js';
export default {
   props: {
      tradeInfo: {
         type: Object,
         requored: true
      }
   },
   setup(props, { root }) {
      let { tradeInfo } = toRefs(props);
      let tradeDetail = reactive({ data: {} });
      let isOpen = ref(false);
      let isLoading = ref(false);

      let brandLogo = computed(() => {
         let brandImage = tradeInfo.value.brandImage;
         return brandImage !== '' ? brandImage : require('@/assets/img/page/placeholder.jpg');
      });

      let payment = computed(() => {
         let mark = tradeInfo.value.transaction_type === 'normal' ? '+' : '-';
         return `${mark}${tradeInfo.value.amount}元`;
      });

      let showDetail = async() => {
         if (isLoading.value) return;
         if (_.isEmpty(tradeDetail.data)) {
            isLoading.value = true;
            let { info } = await transactionApi.detail({ 
               transaction_id: tradeInfo.value.transaction_id 
            });
            tradeDetail.data = info.results.transaction_detail;
            isLoading.value = false;
            console.log(tradeDetail.data);
         }
         isOpen.value = !isOpen.value;
         await root.$nextTick();
      }
      
      return { brandLogo, payment, showDetail, tradeDetail };
   }
}
</script>

<style>

</style>