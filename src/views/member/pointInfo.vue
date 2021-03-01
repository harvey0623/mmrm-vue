<template src="./html/pointInfo.html"></template>

<script>
import { ref, reactive, onMounted, computed, watch } from '@vue/composition-api';
import { pointApi } from '@/api/point.js';
import { memberApi } from '@/api/member.js';
import DateSidebar from '@/components/Sidebar/Date.vue';
import PointPopup from '@/components/Popup/PointPopup.vue';
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
      let today = dayjs();
      let pointId = ref(0);
      let isLoading = ref(false);
      let currentPointAmount = ref('');
      let expiredPopupIsOpen = ref(false);
      let isSidebarOpen = ref(false);
      let userPoint = reactive({ data: {} });
      let expiredPoint = reactive({ data: [] });
      let dateRange = reactive({
         start: today.subtract(6, 'month').format('YYYY-MM-DD'),
         end: today.format('YYYY-MM-DD')
      });
      let msgOption = reactive({
         isOpen: false,
         message: '',
         eventName: 'invaildFeedback'
      });

      let hasUserPoint = computed(() => { //是否有使用者點數
         return !(_.isEmpty(userPoint.data));
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

      let dateFormat = computed(() => {
         let start = dateRange.start.replace(/-/g, '/');
         let end = dateRange.end.replace(/-/g, '/');
         return { start, end };
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

      let invalidHandler = ({ msg }) => {
         msgOption.message = msg;
         msgOption.isOpen = true;
      }

      let invaildFeedback = () => msgOption.isOpen = false;

      let updateHandler = () => {
         
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
         // expiredPoint.data = info.results.point_due_to_expire;
         expiredPoint.data = [
            { "datetime": "2019/02/10 23:59:59", "amount": "1,000" },
         ]
      }

      let init = async() => {
         isLoading.value = true;
         pointId.value = parseInt(root.$route.params.point_id);
         await getTargetPointInfo();
         await getMemberPoint();
         await getExpiredPoint();
         isLoading.value = false;
      }
      
      watch(() => root.$route, () => {
         init();
      });

      onMounted(async() => {
         init();
      });

      return { isLoading, pointName, pointUsageTime, hideDuration, hasExpiredPoint, expiredTotal, expiredPointAmount, currentPointAmount, hasUserPoint, expiredPopupIsOpen, expiredList, isSidebarOpen, updateHandler, invalidHandler, dateRange, msgOption, invaildFeedback };
   },
   components: {
      DateSidebar,
      PointPopup
   }
}
</script>

<style lang="scss" src="./scss/pointInfo.scss" scoped></style>