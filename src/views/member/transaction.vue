<template src="./html/transaction.html"></template>

<script>
import dayjs from 'dayjs';
import { ref, reactive, onMounted, computed, onBeforeUnmount } from '@vue/composition-api';
import { transactionApi } from '@/api/transaction.js';
import { brandApi } from '@/api/brand.js';
import DateSidebar from '@/components/Sidebar/Date.vue';
import TradeList from '@/components/TradeList/index.vue';
export default {
   name: 'transaction',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.transaction.title'),
      }
   },
   setup(props, { root }) {
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

      let showEmptyBlock = computed(() => {
         return !isLoading.value && !hasHistoryData.value;
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

      let gatherBrandId = () => { //取德品牌id
         let arr = tempHistory.data.map(item => item.brand_id);
         return Array.from(new Set(arr));
      }

      let mergeHistoryAndBrand = (brandData) => { //合併歷史紀錄和品來資料
         return tempHistory.data.reduce((prev, current) => {
            let brandId = current.brand_id;
            let { title, feature_image_small } = brandData.find(brand => brand.brand_id === brandId);
            prev.push({
               ...current,
               brandTitle: title,
               brandImage: feature_image_small.url || ''
            });
            return prev;
         }, []);
      }

      let classifyByDate = (data) => { //依照日期來分類
         return dateGroup.value.reduce((prev, current, index) => {
            let arr = data.filter(item => {
               let dateText = dayjs(item.datetime).format('YYYY / MM');
               return dateText === current;
            });
            prev.push({ dateText: current, orderId: index, data: arr });
            return prev;
         }, []);
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

      let getPagination = async(isPag) => { //取得分頁資料
         isPagLoading.value = true;
         let historyData = await getHistory();
         if (isPag) tempHistory.data = tempHistory.data.concat(historyData);
         else tempHistory.data = historyData;
         if (historyData.length !== 0) {
            let brand_ids = gatherBrandId();
            let { info:brandInfo } = await brandApi.brand_information({ brand_ids, full_info: false });
            let mergeResult = mergeHistoryAndBrand(brandInfo.results.brand_information);
            tradeList.data = classifyByDate(mergeResult);
         } else {
            tradeList.data = [];
         }
         isPagLoading.value = false;
      }

      let updateHandler = async() => {
         isLoading.value = true;
         currentPage.value = 0;
         await getPagination(false);
         await root.$nextTick();
         window.scrollTo(0, 0);
         isSidebarOpen.value = false;
         isLoading.value = false;
      }

      let scrollHandler = () => {
         if (isPagLoading.value) return;
         let windowH = window.innerHeight;
         let documentH = document.documentElement.scrollHeight;
         let distance = documentH - windowH;
         let currentPos = window.pageYOffset;
         if ((currentPos >= distance * 0.95) && hasNextPage.value) {
            getPagination(true);
         }
      }

      onMounted(() => {
         updateHandler();
         window.addEventListener('scroll', scrollHandler);
      });

      onBeforeUnmount(() => {
         window.removeEventListener('scroll', scrollHandler);
      });

      return { isSidebarOpen, dateRange, invalidHandler, msgOption, invaildFeedback, updateHandler, isLoading, tradeList, showEmptyBlock, hasHistoryData, isPagLoading, hasNextPage };
   },
   components: {
      DateSidebar,
      TradeList
   }
}
</script>

<style lang="scss" src="./scss/transaction.scss" scoped></style>