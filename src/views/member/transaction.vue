<template src="./html/transaction.html"></template>

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
      let isSidebarOpen = ref(true);
      let isLoading = ref(false);
      let currentPage = ref(0);
      let dateRange = reactive({
         start: today.subtract(6, 'month').format('YYYY-MM-DD'),
         end: today.format('YYYY-MM-DD')
      });
      let msgOption = reactive({
         isOpen: false,
         message: '',
         eventName: 'invaildFeedback'
      });
      let invalidHandler = ({ msg }) => {
         msgOption.isOpen = true;
         msgOption.message = msg;
      }
      let invaildFeedback = () => {
         msgOption.isOpen = false;
      }
      let updateHandler = () => {
         isSidebarOpen.value = false;
         isLoading.value = true;
         currentPage.value = 0;
         isLoading.value = false;
      }

      return { isSidebarOpen, dateRange, invalidHandler, msgOption, invaildFeedback, updateHandler, isLoading };
   },
   components: {
      HistorySidebar
   }
}
</script>

<style></style>