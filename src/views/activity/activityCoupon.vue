<template>
   <section>
      activityCoupon
   </section>
</template>

<script>
import { computed, toRefs } from '@vue/composition-api';
export default {
   name: 'activityCoupon',
      metaInfo() {
      return {
         title: this.$i18n.t('page.redeemCouponInfo.title'),
      }
   },
   setup(props, context) {
      
      return {};
   }
}
</script>

<style>

</style>