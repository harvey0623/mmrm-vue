<template>
   <div id="sidebar" :class="{ show: isOpen }">
      <div class="sidebarPanel">
         <div class="empty" @click="closeHandler">取消</div>
         <div class="seekText">搜尋</div>
         <div class="sureText" @click="checkHandler">確定</div>
      </div>
      <validation-observer tag="ul" class="sidebarFilter" ref="form">
         <li>
            <div class="filterTitle">開始日期</div>
            <validation-provider 
               tag="div"
               class="dateOuter"
               rules="required">
               <input type="date" v-model="beginDate">
               <div class="arrowBox"></div>
            </validation-provider> 
         </li>
         <li>
            <div class="filterTitle">開始日期</div>
            <validation-provider 
               tag="div"
               class="dateOuter"
               rules="required">
               <input type="date" v-model="finishDate">
               <div class="arrowBox"></div>
            </validation-provider> 
         </li>
      </validation-observer>
   </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
export default {
   props: {
      isOpen: {
         type: Boolean,
         default: true
      },
      startTime: {
         type: String,
         defualt: ''
      },
      endTime: {
         type: String,
         defualt: ''
      },
   },
   setup(props, { emit }) {
      let form = ref(null);
      let beginDate = computed({
         get() {
            return props.startTime;
         },
         set(val) {
            emit('update:startTime', val);
         }
      });
      let finishDate = computed({
         get() {
            return props.endTime;
         },
         set(val) {
            emit('update:endTime', val);
         }
      });

      let emitMessage = (msg) => {
         emit('invalid', { msg });
      }

      let checkisAfter = () => {
         let startDate = dayjs(beginDate.value);
         let endDate = dayjs(finishDate.value);
         let result = endDate.isSameOrAfter(startDate);
         if (!result) emitMessage('結束日需大於開始日');
         return result;
      }

      let cehckIsBetween = () => {
         let today = dayjs();
         let limit = today.subtract(6, 'month');
         let todayText = today.format('YYYY/MM/DD');
         let limitText = limit.format('YYYY/MM/DD');
         let dayStart = dayjs(beginDate.value);
         let dayEnd = dayjs(finishDate.value);
         let inRangeStart = dayStart.isBetween(limitText, todayText, null, '[]');
         let inRangeEnd = dayEnd.isBetween(limitText, todayText, null, '[]');
         let result = inRangeStart && inRangeEnd;
         if (!result) emitMessage(`搜尋區間區需在${limitText} ~ ${todayText}`);
         return result;
      }

      let checkHandler = async() => {
         let isValid =  await form.value.validate();
         if (!isValid) return emitMessage('請輸入日期');
         if (!checkisAfter()) return;
         if (!cehckIsBetween()) return;
         emit('history');
      }
      
      let closeHandler = () => {
         emit('update:isOpen', false);
      }

      return { beginDate, finishDate, checkHandler, form, closeHandler };
   }
}
</script>

<style></style>