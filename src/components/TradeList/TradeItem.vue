<template src="./html/TradeItem.html"></template>

<script>
import _ from 'lodash';
import { ref, reactive, onMounted, computed, toRefs } from '@vue/composition-api';
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
      let isOpen = ref(false);
      let isLoading = ref(false);
      let tradeItem = ref(null);
      let tradeDetail = reactive({ data: {} });

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
         }
         isOpen.value = !isOpen.value;
         await root.$nextTick();
         if (isOpen.value) {
            let offsetTop = tradeItem.value.offsetTop;
            window.scrollTo(0, offsetTop - 20 - 45);
         }
      }
      
      return { brandLogo, payment, showDetail, tradeDetail, isLoading, isOpen, tradeItem };
   }
}
</script>

<style></style>