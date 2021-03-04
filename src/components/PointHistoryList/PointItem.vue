<template>
   <div class="pointContent" @click="clickHandler">
      <div class="summaryBox">
         <div class="typeText">{{ transactionType }}</div>
         <div class="payment">{{ amount }} 元</div>
      </div>
      <ul class="invoiceInfo">
         <li class="invoiceRow">
            <div class="name">交易序號</div>
            <div class="colon">:</div>
            <div class="value">{{ transactionId }}</div>
         </li>
         <li class="invoiceRow">
            <div class="name">點數交易</div>
            <div class="colon">:</div>
            <div class="value">{{ datetime }}</div>
         </li>
      </ul>
   </div>
</template>

<script>
export default {
   props: {
      transactionId: {
         type: String,
         required: true
      },
      amount: {
         type: String,
         required: true
      },
      datetime: {
         type: String,
         required: true
      },
      transactionType: {
         type: String,
         required: true
      }
   },
   methods: {
      clickHandler() {
         this.$emit('detail', this.transactionId);
      }
   }
}
</script>

<style lang="scss" scoped>
   .pointContent {
      @include elGutter(margin-bottom, map-get($gutter, basic));
      padding: 25px;
      background-color: #fff;
      border-radius: map-get($radius, basic);
      cursor: pointer;
      >.summaryBox {
         @extend %bwtFlex;
         margin-bottom: map-get($gutter, basic);
         color: map-get($fontColor, formTitle);
      }
      >.invoiceInfo {
         >.invoiceRow {
            display: flex;
            align-items: flex-;
            color: map-get($fontColor, input);
            @include elGutter(margin-bottom, 7.5px);
            >.colon {
               margin-left: 15px;
               margin-right: 10px;
            }
            >.value {
               flex: 1;
               word-break: break-all;
            }
         }
      }
   }
</style>