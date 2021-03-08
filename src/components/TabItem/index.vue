<template>
   <li class="tabItem" @click="clickHandler">
      {{ tabTitle }}
      <span class="line" :class="{active: currentCouponType === tabType}"></span>
   </li>
</template>

<script>
export default {
   props: {
      tabTitle: {
         type: String,
         default: ''
      },
      tabTitle: {
         type: String,
         default: ''
      },
      tabType: {
         type: String,
         required: true
      },
      currentCouponType: {
         type: String,
         default: ''
      }
   },
   methods: {
      clickHandler() {
         this.$emit('switchType', this.tabType);
      }
   }
}
</script>

<style>

</style>