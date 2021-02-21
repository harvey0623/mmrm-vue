<template src="./html/transaction.html"></template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
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
      let isSidebarOpen = ref(false);
      let isLoading = ref(false);
      let isPagLoading = ref(false);
      let currentPage = ref(0);
      let tempHistory = reactive({ data: [] });
      let tradeList = reactive({ data: [] });
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

      let dateFormat = computed(() => {
         let start = dateRange.start.replace(/-/g, '/');
         let end = dateRange.end.replace(/-/g, '/');
         return { start, end };
      });

      let hasNextPage = computed(() => { //是否有下一頁
         return currentPage.value !== null;
      });

      let hasHistoryData = computed(() => { //是否有歷史資料
         return tradeList.data.length > 0;
      });

      let dateGroup = computed(() => { //日期群組
         if (tempHistory.data.length === 0) return [];
         let dateSet = new Set();
         tempHistory.data.forEach(item => {
            let dateText = dayjs(item.datetime).format('YYYY / MM');
            dateSet.add(dateText);
         });
         return Array.from(dateSet);
      });

      let gatherBrandId = () => {
         let arr = tempHistory.data.map(item => item.brand_id);
         return Array.from(new Set(arr));
      }

      let getHistory = async() => { //取得歷史資料
         let { start, end } = dateFormat.value;
         let data = await transactionApi.history({
            query_start_datetime: `${start} 00:00:00`,
            query_end_datetime: `${end} 23:59:59`,
            offset: currentPage.value
         });
         currentPage.value = data.info.next;
         return data.info.results.transaction_history;
      }

      let getPagination = async(isPag) => {
         isPagLoading.value = true;
         let historyData = await getHistory();
         if (isPag) tempHistory.data = tempHistory.data.concat(historyData);
         else tempHistory.data = historyData;
         if (historyData.length !== 0) {
            let brand_ids = gatherBrandId();
            
         } else {
            tradeList.data = [];
         }
         
         isPagLoading.value = false;
      }

      let updateHandler = async() => {
         isSidebarOpen.value = false;
         isLoading.value = true;
         currentPage.value = 0;
         await getPagination(false);
         isLoading.value = false;
      }

      onMounted(() => {
         updateHandler();
      });

      return { isSidebarOpen, dateRange, invalidHandler, msgOption, invaildFeedback, updateHandler, isLoading };
   },
   components: {
      HistorySidebar
   }
}
</script>

<style lang="scss" src="./scss/transaction.scss" scoped></style>