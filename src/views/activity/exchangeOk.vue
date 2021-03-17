<template>
   <section class="exchange_result_section">ok</section>
</template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
export default {
   name: 'exchangeOk',
   metaInfo() {
      return {
         title: this.$i18n.t('page.exchangeOk.title'),
      }
   },
   setup(props, context) {
      return {};
   }
}
</script>

<style>

</style>