<template>
   <div class="mycontainer">
      <HistorySidebar
         :isOpen="isOpen"
         :startTime.sync="dateRange.start"
         :endTime.sync="dateRange.end"
      ></HistorySidebar>
   </div>
</template>

<script>
import { ref, reactive, onMounted } from '@vue/composition-api';
import { transactionApi } from '@/api/transaction.js';
import HistorySidebar from '@/components/HistorySidebar/index.vue';
import dayjs from 'dayjs';
export default {
   name: 'transaction',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.transaction.title'),
      }
   },
   setup(props, context) {
      let today = dayjs();
      let isOpen = ref(true);
      let dateRange = reactive({
         start: today.subtract(6, 'month').format('YYYY-MM-DD'),
         end: today.format('YYYY-MM-DD')
      });

      return { isOpen, dateRange };
   },
   components: {
      HistorySidebar
   }
}
</script>

<style></style>