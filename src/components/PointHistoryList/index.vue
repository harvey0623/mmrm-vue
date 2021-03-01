<template>
   <li>
      <p class="title">{{ dateText }}</p>
      <div class="inner">
         <!-- <point-item
            v-for="item in lists"
            :key="item.transaction_id"
            :detail="item"
            @callHandler="call2Handler"
         ></point-item> -->
      </div>
   </li>
</template>

<script>
export default {
   props: {
      dateText: {
         type: String,
         default: ''
      },
      lists: {
         type: Array,
         required: true
      }
   },
};
</script>

<style lang="scss">
$pointInputColor: map-get($fontColor, input);
$pointBasicGutter: map-get($gutter, basic);

.pointHistoryList {
   padding: 25px 20px;
   >li {
      @include elGutter(margin-bottom, 25px);
      >.title {
         padding-left: 15px;
         margin-bottom: map-get($gutter, basic);
         color: $pointInputColor;
      }
      .pointContent {
         @include elGutter(margin-bottom, $pointBasicGutter);
         padding: 25px;
         background-color: #fff;
         border-radius: map-get($radius, basic);
         cursor: pointer;
         >.summaryBox {
            @extend %bwtFlex;
            margin-bottom: $pointBasicGutter;
            color: map-get($fontColor, formTitle);
         }
         >.invoiceInfo {
            >.invoiceRow {
               display: flex;
               align-items: flex-start;
               color: $pointInputColor;
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
   }
}
</style>
