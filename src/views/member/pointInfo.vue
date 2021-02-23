<template src="./html/pointInfo.html"></template>

<script>
import { ref, reactive, onMounted, computed, watch } from '@vue/composition-api';
import { pointApi } from '@/api/point.js';
import { memberApi } from '@/api/point.js';
import DateSidebar from '@/components/Sidebar/Date.vue';
import dayjs from 'dayjs';
import _ from 'lodash';
export default {
   name: 'pointInfo',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.pointInfo.title'),
      }
   },
   setup(props, { root }) {
      let pointId = ref(0);
      let isLoading = ref(false);
      let userPoint = reactive({ data: {} });

      let getTargetPointInfo = async() => {
         let { info } = await pointApi.pointInfo({
            point_id: [pointId.value],
            full_info: false
         });
         userPoint.data = info.results.point_information[0];
         console.log(userPoint.data);
      }

      let hasUserPoint = computed(() => {
         return !(_.isEmpty(userPoint.data));
      });

      let pointName = computed(() => { //點數名稱
         return hasUserPoint.value ? userPoint.data.title : '';
      });

      let pointUsageTime = computed(() => { //點數始用時間
         if (!hasUserPoint.value) return '';
         let startTime = splitDateTime(userPoint.data.point_circulate_start_datetime);
         let endTime = splitDateTime(userPoint.data.point_circulate_end_datetime);
         return `${startTime} ~ ${endTime}`;
      });

       let hideDuartion = computed(() => { //隱藏時間
         if (!hasUserPoint) return false;
         return userPoint.data.hide_duration;
      });

      let splitDateTime = (text) => text.split(' ')[0];

      watch(() => root.$route, (val, oldVal) => {
         console.log(val);
      });

      onMounted(async() => {
         isLoading.value = true;
         pointId.value = parseInt(root.$route.params.point_id);
         await getTargetPointInfo();
         isLoading.value = false;
      });

      return { isLoading, pointName, pointUsageTime, hideDuartion };
   },
   components: {
      DateSidebar
   }
}
</script>

<style lang="scss" src="./scss/pointInfo.scss" scoped></style>