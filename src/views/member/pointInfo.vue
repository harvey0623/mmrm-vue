<template src="./html/pointInfo.html"></template>

<script>
import { ref, reactive, onMounted, computed, watch, onBeforeUnmount } from '@vue/composition-api';
import { pointApi } from '@/api/point.js';
import { memberApi } from '@/api/member.js';
import { sidebarDate } from '@/composition-api/sidebarDate.js';
import DateSidebar from '@/components/Sidebar/Date.vue';
import PointPopup from '@/components/Popup/PointPopup.vue';
import PointHistoryList from '@/components/PointHistoryList/index.vue';
import _ from 'lodash';
import dayjs from 'dayjs';
export default {
   name: 'pointInfo',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.pointInfo.title'),
      }
   },
   setup(props, { root }) {
      let { dateRange, dateFormat, msgOption, invalidHandler, invaildFeedback } = sidebarDate();
      let pointId = ref(0);
      let isLoading = ref(false);
      let currentPointAmount = ref('');
      let expiredPopupIsOpen = ref(false);
      let tradePopupIsOpen = ref(false);
      let isSidebarOpen = ref(false);
      let currentPage = ref(0);
      let isPagLoading = ref(false);
      let currentTradeId = ref('');
      let userPoint = reactive({ data: {} });
      let expiredPoint = reactive({ data: [] });
      let tempHistory = reactive({ data: [] });
      let pointHistory = reactive({ data: [] });

      let hasUserPoint = computed(() => { //是否有使用者點數
         return !(_.isEmpty(userPoint.data));
      });

      let hasNextPage = computed(() => { //是否有下一頁
         return currentPage.value !== null;
      });

      let pointName = computed(() => { //點數名稱
         return hasUserPoint.value ? userPoint.data.title : '';
      });

      let pointUsageTime = computed(() => { //點數使用時間
         if (!hasUserPoint.value) return '';
         let startTime = splitDateTime(userPoint.data.point_circulate_start_datetime);
         let endTime = splitDateTime(userPoint.data.point_circulate_end_datetime);
         return `${startTime} ~ ${endTime}`;
      });

      let hideDuration = computed(() => { //隱藏時間
         if (!hasUserPoint) return false;
         return userPoint.data.hide_duration;
      });

      let expiredTotal = computed(() => { //即將到期筆數
         return expiredPoint.data.length;
      });

      let hasExpiredPoint = computed(() => { //是否有過期點數
         return expiredTotal.value > 0;
      });

      let expiredPointAmount = computed(() => { //到期點數加總
         return expiredPoint.data.reduce((prev, current) => {
            let number = cammaToNumber(current.amount);
            prev += number;
            return prev;
         }, 0);
      });

      let expiredList = computed(() => { //到期點數列表
         return expiredPoint.data.reduce((prev, current) => {
            prev.push({
               date: splitDateTime(current.datetime),
               amount: current.amount
            });
            return prev;
         }, []);
      });

      let hasPointHistory = computed(() => { //是否有點數交易資料
         return tempHistory.data.length > 0;
      });

      let dateGroup = computed(() => {
         if (!hasPointHistory.value) return [];
         let dateSet = new Set();
         tempHistory.data.forEach(item => {
            dateSet.add(dayjs(item.datetime).format('YYYY / MM'));
         });
         return Array.from(dateSet);
      });

      let showEmptyBlock = computed(() => {
         return !hasPointHistory.value && !isLoading.value && currentPage.value === null;
      });

      let tradeDetail = computed(() => {
         if (!hasPointHistory.value) return {};
         let obj = tempHistory.data.find(item => item.transaction_id === currentTradeId.value);
         if (obj !== undefined) return obj;
         else return {};
      });

      let splitDateTime = (text) => text.split(' ')[0];

      let cammaToNumber = (text) => {
         let result = text.replace(/,/g, '');
         return parseInt(result);
      }

      let getTargetPointInfo = async() => { //取得特定點數
         let { info } = await pointApi.pointInfo({
            point_id: [pointId.value],
            full_info: false
         });
         userPoint.data = info.results.point_information[0];
      }

      let classifyByDate = () => { //分類點數資料
         let result = dateGroup.value.reduce((prev, current, index) => {
            let arr = tempHistory.data.filter(item => {
               return dayjs(item.datetime).format('YYYY / MM') === current;
            });
            prev.push({ orderIndex: index, dateText: current, data: arr });
            return prev;
         }, []);
         return result;
      }

      let showHistoryDetail = (tradeId) => { //顯示歷史點數詳情
         currentTradeId.value = tradeId;
         tradePopupIsOpen.value = true;
      }

      let getMemberPoint = async() => { //取得會員點數
         let { info } = await memberApi.member_summary();
         let obj = info.results.point_summary.current_point.find(item => {
            return item.point_id === pointId.value;
         });
         if (obj !== undefined) currentPointAmount.value = obj.amount;
         else currentPointAmount.value = 0;
      }

      let getExpiredPoint = async() => { //取得過期點數
         let { info } = await pointApi.pointDueToExpire({ point_id: pointId.value });
         expiredPoint.data = info.results.point_due_to_expire;
      }

      let getPagination = async(isPag) => { //取得點數交易資料
         let { info } = await pointApi.point_history({
            point_id:  pointId.value,
            query_start_datetime: `${dateFormat.value.start} 00:00:00`,
            query_end_datetime: `${dateFormat.value.end} 23:59:59`,
            offset: currentPage.value
         });
         currentPage.value = info.next;
         if (isPag) tempHistory.data = tempHistory.data.concat(info.results.point_history);
         else tempHistory.data = info.results.point_history;
         pointHistory.data = classifyByDate();
      }

      let scrollHandler = async() => {
         if (isPagLoading.value) return;
         isPagLoading.value = true;
         let windowH = window.innerHeight;
         let documentH = document.documentElement.scrollHeight;
         let distance = documentH - windowH;
         let currentPos = window.pageYOffset;
         if ((currentPos >= distance * 0.95) && hasNextPage.value) {
            await getPagination(true);
         }
         isPagLoading.value = false;
      }

      let updateHandler = async() => {
         isLoading.value = true;
         currentPage.value = 0;
         await getPagination(false);
         isLoading.value = false;
         window.scrollTo(0, 0);
         isSidebarOpen.value = false;
      }

      let init = async() => {
         isLoading.value = true;
         pointId.value = parseInt(root.$route.params.point_id);
         await getTargetPointInfo();
         await getMemberPoint();
         await getExpiredPoint();
         await updateHandler();
         isLoading.value = false;
      }
      
      watch(() => root.$route, () => {
         init();
      });

      onMounted(async() => {
         init();
         window.addEventListener('scroll', scrollHandler);
      });

      onBeforeUnmount(() => {
         window.removeEventListener('scroll', scrollHandler);
      });

      return { pointId, isLoading, pointName, pointUsageTime, hideDuration, hasExpiredPoint, expiredTotal, expiredPointAmount, currentPointAmount, hasUserPoint, expiredPopupIsOpen, expiredList, isSidebarOpen, updateHandler, invalidHandler, dateRange, msgOption, invaildFeedback, showEmptyBlock, hasPointHistory, pointHistory, showHistoryDetail, tradeDetail, tradePopupIsOpen, isPagLoading, hasNextPage };
   },
   components: {
      DateSidebar,
      PointPopup,
      PointHistoryList
   }
}
</script>

<style lang="scss" src="./scss/pointInfo.scss" scoped></style>