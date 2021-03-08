import { reactive, computed } from '@vue/composition-api';
import dayjs from 'dayjs';
export const sidebarDate = function () {
   let today = dayjs();
   let dateRange = reactive({
      start: today.subtract(6, 'month').format('YYYY-MM-DD'),
      end: today.format('YYYY-MM-DD')
   });

   let dateFormat = computed(() => {
      let start = dateRange.start.replace(/-/g, '/');
      let end = dateRange.end.replace(/-/g, '/');
      return { start, end };
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

   return { dateRange, dateFormat, msgOption, invalidHandler, invaildFeedback };
}