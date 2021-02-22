<template>
   <li>
      <p class="title">{{ dateText }}</p>
      <div class="tradeItemBox">
         <TradeItem
            v-for="trade in tradeData"
            :key="trade.transaction_id"
            :tradeInfo="trade"
         ></TradeItem>
      </div>
   </li>
</template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import TradeItem from './TradeItem.vue';
export default {
   props: {
      dateText: {
         type: String,
         required: true
      },
      tradeData: {
         type: Array,
         required: true
      }
   },
   setup() {
      
   },
   components: {
      TradeItem
   }
}
</script>

<style lang="scss" src="./index.scss"></style>