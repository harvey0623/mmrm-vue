<template>
   <li>
      <p class="title">{{ dateText }}</p>
      <div class="inner">
         <PointItem
            v-for="list in lists"
            :key="list.transaction_id"
            :transactionId="list.transaction_id"
            :amount="list.amount"
            :datetime="list.datetime"
            :transactionType="list.transaction_type"
            @detail="$emit('detail', $event)"
         ></PointItem>
      </div>
   </li>
</template>

<script>
import PointItem from './PointItem.vue';
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
   components: {
      PointItem
   }
};
</script>

<style lang="scss" scoped>
   li {
      @include elGutter(margin-bottom, 25px);
      >.title {
         padding-left: 15px;
         margin-bottom: map-get($gutter, basic);
         color: map-get($fontColor, input);
      }
   }
</style>
