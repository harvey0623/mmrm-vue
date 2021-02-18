<template>
   <div id="sidebar" :class="{ show: isOpen }">
      <div class="sidebarPanel">
         <div class="empty"></div>
         <div class="seekText">搜尋</div>
         <div class="sureText">確定</div>
      </div>
      <validation-observer tag="ul" class="sidebarFilter" ref="form">
         <li>
            <div class="filterTitle">開始日期</div>
            <validation-provider 
               tag="div"
               class="dateOuter"
               rules="required"
               v-slot="{ errors }">
               <input type="date" v-model="beginDate">
               <div class="arrowBox"></div>
            </validation-provider> 
         </li>
         <li>
            <div class="filterTitle">開始日期</div>
            <validation-provider 
               tag="div"
               class="dateOuter"
               rules="required"
               v-slot="{ errors }">
               <input type="date" v-model="finishDate">
               <div class="arrowBox"></div>
            </validation-provider> 
         </li>
      </validation-observer>
   </div>
</template>

<script>
import { ref, reactive, onMounted, toRefs, computed } from '@vue/composition-api';
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

      return { beginDate, finishDate };
   }
}
</script>

<style></style>