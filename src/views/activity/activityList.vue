<template src="./html/activityList.html"></template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import { activityApi } from '@/api/activity.js';
import { memberApi } from '@/api/member.js';
import { pointApi } from '@/api/point.js';
import LayoutItem from '@/components/LayoutItem/index.vue';
import PointSlider from '@/components/PointSlider/index.vue';
import PointPopup from '@/components/Popup/PointPopup.vue';
export default {
   name: 'activityList',
      metaInfo() {
      return {
         title: this.$i18n.t('page.activityList.title'),
      }
   },
   setup(props, context) {
      let currentLayoutId = ref('a');
      let isLoading = ref(false);
      let layoutList = reactive([
         { id: 'a', class: 'layoutA' },
         { id: 'b', class: 'layoutB' }
      ]);
      let pointPopupOption = reactive({
         isOpen: false,
         title: '目前擁有點數',
         showPointAmount: false
      });
      let pointSlider = reactive({ data: [] });

      let hasPointSlider = computed(() => {
         return pointSlider.data.length > 0;
      });

      let switchLayout = (id) => {
         currentLayoutId.value = id;
      }

      let gatherPointIds = (data) => data.map(item => item.point_id);

      let integratePoint = ({ pointSummary, pointInfo }) => {
         return pointSummary.reduce((prev, current) => {
            let pointId = current.point_id;
            let obj = pointInfo.find(item => item.point_id === pointId);
            prev.push({ title: obj.title, amount: current.amount, pointId });
            return prev;
         }, []);
      }

      let createPointSlider = async() => { //產生點數輪播資料
         let pointSummary = await memberApi.member_summary().then(res => {
            return res.info.results.point_summary.current_point;
         });
         let pointIds = gatherPointIds(pointSummary);
         let pointInfo = await pointApi.pointInfo({ point_id: pointIds, full_info: false })
            .then(res => res.info.results.point_information);
         pointSlider.data = integratePoint({ pointSummary, pointInfo });
      }

      onMounted(async() => {
         isLoading.value = true;
         await createPointSlider();
         isLoading.value = false;
      });

      return { currentLayoutId, isLoading, layoutList, switchLayout, pointSlider, hasPointSlider, pointPopupOption };
   },
   components: {
      LayoutItem,
      PointSlider,
      PointPopup
   }
}
</script>

<style lang="lang" src="./scss/activityList.scss"></style>