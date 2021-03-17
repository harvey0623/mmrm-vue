<template src="./html/activityList.html"></template>

<script>
import { ref, reactive, onMounted, computed, onUnmounted } from '@vue/composition-api';
import { activityApi } from '@/api/activity.js';
import { memberApi } from '@/api/member.js';
import { pointApi } from '@/api/point.js';
import { brandApi } from '@/api/brand.js';
import LayoutItem from '@/components/LayoutItem/index.vue';
import PointSlider from '@/components/PointSlider/index.vue';
import PointPopup from '@/components/Popup/PointPopup.vue';
import ActivitySidebar from '@/components/Sidebar/Activity.vue';
import ActivityItem from '@/components/ActivityItem/index.vue';
import PointPicker from '@/components/PointPicker/index.vue';
export default {
   name: 'activityList',
      metaInfo() {
      return {
         title: this.$i18n.t('page.activityList.title'),
      }
   },
   setup(props, { root }) {
      let currentLayoutId = ref('a');
      let isLoading = ref(false);
      let isPagLoading = ref(false);
      let isSidebarOpen = ref(false);
      let activitySidebar = ref(null);
      let currentPage = ref(0);
      let systemTime = ref('');
      let projectTime = ref(2207520000000); //暫訂7年
      let tempExchabgeStatus = ref(false);
      let pointSlider = reactive({ data: [] });
      let tempSearchParams = reactive({ data: {} });
      let activityIds = reactive({ data: [] });
      let activityList = reactive({ data: [] });
      let pickerItem = reactive({ data: [{ id: 'a', value: 'hello' }] });
      let layoutList = reactive([
         { id: 'a', class: 'layoutA' },
         { id: 'b', class: 'layoutB' }
      ]);
      let tempActivityParams = reactive({ 
         activityId: 0,
         redeemType: '',
         pointId: 0,
         pointCategory: ''
      });
      let pointPopupOption = reactive({
         isOpen: false,
         title: '目前擁有點數',
         showPointAmount: false
      });
      let msgOption = reactive({
         isOpen: false,
         showCancel: true,
         message: '',
         eventName: 'gather'
      });
      let codePopupOption = reactive({
         isOpen: false,
         showCancel: true,
         popupTitle: '請輸入兌換碼',
         eventName: 'gather',
         validateRule: 'required'
      });
      let tipOption = reactive({
         isOpen: false,
         message: '',
         eventName: 'tipFeedBack'
      });

      let hasPointSlider = computed(() => { //是否有點數輪播資料
         return pointSlider.data.length > 0;
      });

      let hasActivity = computed(() => { //是否有活動
         return activityIds.data.length > 0;
      });

      let showEmptyBlock = computed(() => { //顯示無資料區塊
         return !isLoading.value && !hasActivity.value;
      });

      let hasNextPage = computed(() => currentPage.value !== null);

      let reachBottom = computed(() => { //資料是否已到底
         return !isLoading.value && !isPagLoading.value && !hasNextPage.value && hasActivity.value;
      });

      let switchLayout = (id) => { //切換板形
         if (isPagLoading.value) return;
         window.removeEventListener('scroll', scrollHandler);
         currentLayoutId.value = id;
         setTimeout(() => {
            window.addEventListener('scroll', scrollHandler);
         }, 50);
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

      let intergateActivityAndBrand = async({ mergePointResult, brandInfo }) => { //合併品牌  
         return mergePointResult.reduce((prev, current) => {
            let brandId = current.brand_id;
            let obj = brandInfo.find(item => item.brand_id === brandId);
            prev.push({ ...current, brandInfo: obj !== undefined ? obj : null });
            return prev;
         }, []);
      }

      let getPagination = async(isPag) => {
         let searchResult = await activityApi.searchCoupon({ 
            ...tempSearchParams.data, 
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
         let brandIds = gatherBrandId(activityInfo);
         let brandInfo = await brandApi.brand_information({ brand_ids: brandIds, full_info: false })
            .then(res => res.info.results.brand_information);
         let mergePointResult = await integrateActivityAndPoint(activityInfo);
         let mergeBrandREsult = await intergateActivityAndBrand({ mergePointResult, brandInfo });
         if (isPag) activityList.data = activityList.data.concat(mergeBrandREsult);
         else activityList.data = mergeBrandREsult;
      }

      let filterHandler = async(params) => {
         isLoading.value = true;
         tempSearchParams.data = params;
         currentPage.value = 0;
         await getPagination(false);
         window.scrollTo(0, 0);
         isSidebarOpen.value = false;
         activitySidebar.value.showSubMenu('');
         isLoading.value = false;
      }

      let scrollHandler = async() => {
         if (isPagLoading.value) return;
         let windowH = window.innerHeight;
         let documentH = document.documentElement.scrollHeight;
         let distance = documentH - windowH;
         let currentPos = window.pageYOffset;
         if ((currentPos >= distance * 0.95) && hasNextPage.value) {
            isPagLoading.value = true;
            await getPagination(true);
            isPagLoading.value = false;
         }
      }

      let createPickerList = (targetActivity) => { //產生點數選項
         let categoryArr = ['point_condition', 'external_point_condition'];
         let result = [];
         categoryArr.forEach(category => {
            if (targetActivity[category] === undefined) return false;
            let lists = targetActivity[category].reduce((prev, current) => {
               let pointId = current.point_id;
               let obj = targetActivity.pointInfo.find(item => {
                  return item.point_id === pointId && item.category === category;
               });
               prev.push({
                  id: pointId,
                  title: obj.title,
                  value: `${obj.title} : ${current.amount}點`,
                  amount: current.amount,
                  category
               });
               return prev;
            }, []);
            result = result.concat(lists);
         });
         return result;
      }

      let selectPoint = ({ id, category }) => { //選擇點數
         tempActivityParams.pointId = id;
         tempActivityParams.pointCategory = category;
         gatherExchangeParams();
      }

      let readyToExchange = ({ activityId, redeemType, status }) => {
         if (status !== 'opening') return;
         let targetObj = activityList.data.find(item => item.coupon_activity_id === activityId);
         tempActivityParams.activityId = activityId;
         tempActivityParams.redeemType = redeemType;
         if (redeemType === 'free') {
            msgOption.isOpen = true;
            msgOption.message = `確定要免費兌換「${targetObj.title}」嗎?`;
         } else if (redeemType === 'redeem_code') {
            codePopupOption.isOpen = true;
         } else if (redeemType === 'point') {
            let pickerLists = createPickerList(targetObj);
            if (pickerLists.length === 1) {
               let { id, category, value } = pickerLists[0];
               tempActivityParams.pointId = id;
               tempActivityParams.pointCategory = category;
               msgOption.isOpen = true;
               msgOption.message = `確定要用${value}兌換「${targetObj.title}」嗎?`;
            } else {
               pickerItem.data = pickerLists;
            }
         }
      }

      let gatherExchangeParams = async(val) => { //取得兌換參數
         msgOption.isOpen = false;
         codePopupOption.isOpen = false;
         isLoading.value = true;
         let params = { coupon_activity_id: tempActivityParams.activityId };
         let exchangeType = tempActivityParams.redeemType;
         if (exchangeType === 'redeem_code') {
            params.redeem_code = val;
         } else if (exchangeType === 'point') {
            let { pointCategory } = tempActivityParams;
            let key = pointCategory === 'point_condition' ? 'point_id' : 'external_point_id';
            params[key] = tempActivityParams.pointId;
         }

         let exchangeResult = await exchangeHandler(params);
         tempExchabgeStatus.value = exchangeResult.status;
         tipOption.message = exchangeResult.status ? '兌換成功' : exchangeResult.errMsg;
         if (exchangeResult.status) {
            root.$storage.setSessionItem('redeemInfo', exchangeResult.redeemInfo);
         }
         tipOption.isOpen = true;
         isLoading.value = false;
      }

      let exchangeHandler = async(params) => {
         let { status, info } = await activityApi.redeemCoupon(params)
            .then(res => res)
            .catch(err => err.response);
         return { 
            status, 
            errMsg: status ? '' : info.rcrm.RM, 
            redeemInfo: info.results.coupon_redeem_result 
         };
      }

      let tipFeedBack = () => {
         tipOption.isOpen = false;
      }

      onMounted(async() => {
         isLoading.value = true;
         window.addEventListener('scroll', scrollHandler);
         await createPointSlider();
      });

      onUnmounted(() => {
         window.removeEventListener('scroll', scrollHandler);
      });

      return { currentLayoutId, isLoading, layoutList, isSidebarOpen, switchLayout, pointSlider, hasPointSlider, pointPopupOption, filterHandler, activitySidebar, systemTime, activityList, isPagLoading, showEmptyBlock, activityList, projectTime, reachBottom, readyToExchange, msgOption, codePopupOption, gatherExchangeParams, tipOption, tipFeedBack, pickerItem, selectPoint };
   },
   components: { LayoutItem, PointSlider, PointPopup, ActivitySidebar, ActivityItem, PointPicker }
}
</script>

<style lang="lang" src="./scss/activityList.scss"></style>