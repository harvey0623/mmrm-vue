<template>
   <div class="couponList">couponFolder</div>
</template>

<script>
import { couponApi } from '@/api/coupon.js';
import { ref, reactive, onMounted } from '@vue/composition-api';
export default {
   name: '',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.couponFolder.title'),
      }
   },
   setup(props, context) {
      onMounted(async () => {
         
      });

      return {};
   }
}
</script>

<style>

</style>