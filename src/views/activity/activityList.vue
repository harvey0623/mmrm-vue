<template src="./html/activityList.html"></template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import { activityApi } from '@/api/activity.js';
import { memberApi } from '@/api/member.js';
import { pointApi } from '@/api/point.js';
import { brandApi } from '@/api/brand.js';
import LayoutItem from '@/components/LayoutItem/index.vue';
import PointSlider from '@/components/PointSlider/index.vue';
import PointPopup from '@/components/Popup/PointPopup.vue';
import ActivitySidebar from '@/components/Sidebar/Activity.vue';
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
      let isSidebarOpen = ref(false);
      let activitySidebar = ref(null);
      let currentPage = ref(0);
      let systemTime = ref('');
      let pointSlider = reactive({ data: [] });
      let tempParams = reactive({ data: {} });
      let activityIds = reactive({ data: [] });
      let activityList = reactive({ data: [] });
      let layoutList = reactive([
         { id: 'a', class: 'layoutA' },
         { id: 'b', class: 'layoutB' }
      ]);
      let pointPopupOption = reactive({
         isOpen: false,
         title: '目前擁有點數',
         showPointAmount: false
      });

      let hasPointSlider = computed(() => { //是否有點數輪播資料
         return pointSlider.data.length > 0;
      });

      let hasActivity = computed(() => { //是否有活動
         return activityIds.data.length > 0;
      });

      let switchLayout = (id) => { //切換板形
         currentLayoutId.value = id;
      }

      let gatherPointIds = (data) => data.map(item => item.point_id);

      let integratePoint = ({ pointSummary, pointInfo }) => { //整合點數
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

      let gatherBrandId = (data) => { //取得品牌id
         let idArr = data.map(item => item.brand_id);
         return Array.from(new Set(idArr));
      }

      let getPointCategoryInfo = async({ data, key }) => { //取得點數類別資訊
         if (data[key] === undefined) return [];
         let pointIds = data[key].map(item => item.point_id);
         let method = key === 'point_condition' ? 'pointInfo' : 'externalPointInfo';
         let pointInfo = await pointApi[method]({ point_id: pointIds, full_info: false })
            .then(res => res.info.results.point_information);
         pointInfo.forEach(item => item.category = key);
         return _.cloneDeep(pointInfo);
      }

      let integrateActivityAndPoint = async(data) => { //合併活動和點數
         let result = [];
         for (let i = 0; i < data.length; i++) {
            let obj = data[i];
            if (obj.redeem_type === 'point') {
               let normalCategory = await getPointCategoryInfo({
                  data: obj, key: 'point_condition' 
               });
               let externalCategory = await getPointCategoryInfo({
                  data: obj, key: 'external_point_condition' 
               });
               result.push({ ...obj, pointInfo: [...normalCategory, ...externalCategory] });
            } else {
               result.push({ ...obj, pointInfo: null });
            }
         }
         return result;
      }

      let getPagination = async() => {
         let searchResult = await activityApi.searchCoupon({ 
            ...tempParams.data, 
            offset: currentPage.value 
         }).then(res => res.info);
         currentPage.value = searchResult.next;
         systemTime.value = searchResult.results.system_datetime || '';
         let ids = searchResult.results.coupon_activity_ids;
         activityIds.data = ids !== undefined ? ids : [];
         if (!hasActivity.value) {
            activityList.data = [];
            return;
         }
         let activityInfo = await activityApi.couponInfo({
            coupon_activity_ids: activityIds.data,
            full_info: false 
         }).then(res => res.info.results.coupon_activity_information);
         // let brandIds = gatherBrandId(activityInfo);
         // let brandInfo = await brandApi.brand_information({ brand_ids: brandIds, full_info: false })
         //    .then(res => res.info.results.brand_information);
         // console.log(activityInfo)
         let intergatedResult = await integrateActivityAndPoint(activityInfo);
         console.log(intergatedResult);
      }

      let filterHandler = async(params) => {
         isLoading.value = true;
         tempParams.data = params;
         currentPage.value = 0;
         await getPagination();

         isSidebarOpen.value = false;
         activitySidebar.value.showSubMenu('');
         isLoading.value = false;
      }

      onMounted(async() => {
         isLoading.value = true;
         await createPointSlider();
      });

      return { currentLayoutId, isLoading, layoutList, isSidebarOpen, switchLayout, pointSlider, hasPointSlider, pointPopupOption, filterHandler, activitySidebar, systemTime, activityList };
   },
   components: {
      LayoutItem,
      PointSlider,
      PointPopup,
      ActivitySidebar
   }
}
</script>

<style lang="lang" src="./scss/activityList.scss"></style>