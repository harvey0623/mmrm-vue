<template src="./html/activityInfo.html"></template>

<script>
import _ from 'lodash';
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import { activityApi } from '@/api/activity.js';
import { brandApi } from '@/api/brand.js';
import { storeApi } from '@/api/store.js';
import { couponApi } from '@/api/coupon.js';
import { pointApi } from '@/api/point.js';
import RedeemCoupon from '@/components/CouponBlock/RedeemCoupon.vue';
import PointPicker from '@/components/PointPicker/index.vue';
export default {
   name: 'activityInfo',
      metaInfo() {
      return {
         title: this.$i18n.t('page.activityInfo.title'),
      }
   },
   setup(props, { root }) {
      let isLoading = ref(false);
      let activityId = ref(0);
      let activityInfo = reactive({ data: {} });
      let activityBrandLogo = ref('');
      let couponList = reactive({ data: [] });
      let pickerItem = reactive({ data: [] });
      let tempStatus = ref(false);
      let redeemStatus = {
         free: '免費兌換',
         redeem_code: '兌換碼兌換',
         point: '點數兌換'
      };
      let usageStatus = {
         opening: '已開啟',
         unopened: '尚未開始',
         closed: '已結束'
      };
      let doubleCheckOption = reactive({
         isOpen: false,
         showCancel: true,
         message: '',
         eventName: 'ready'
      });
      let codePopupOption = reactive({
         isOpen: false,
         showCancel: true,
         popupTitle: '請輸入兌換碼',
         eventName: 'exchange',
         validateRule: 'required'
      });
      let msgOption = reactive({
         isOpen: false,
         message: '',
         eventName: 'finish'
      });

      let hasActivityInfo = computed(() => {
         return !(_.isEmpty(activityInfo.data));
      });

      let activityTitle = computed(() => {
         if (!hasActivityInfo.value) return '';
         else return activityInfo.data.title;
      });

      let activityDuration = computed(() => {
         if (!hasActivityInfo.value) return '';
         let startTime = activityInfo.data.start_datetime.split(' ')[0];
         let endTime = activityInfo.data.end_datetime.split(' ')[0];
         return `${startTime}~${endTime}`;
      });

      let activityMeta = computed(() => {
         if (!hasActivityInfo.value) return [];
         else return activityInfo.data.meta;
      });

      let activityContent = computed(() => {
         if (!hasActivityInfo.value) return '';
         else return activityInfo.data.content;
      });

      let brandLogoBg = computed(() => {
         if (!hasActivityInfo.value) return {};
         if (activityBrandLogo.value === '') return {};
         return { backgroundImage: `url(${activityBrandLogo.value})` };
      });

      let activityIsOpening = computed(() => {
         if (!hasActivityInfo.value) return false;
         return activityInfo.data.status === 'opening';
      });

      let redeemTypeText = computed(() => {
         if (!hasActivityInfo.value) return '';
         return redeemStatus[activityInfo.data.redeem_type];
      });

      let usageText = computed(() => {
         if (!hasActivityInfo.value) return '';
         return usageStatus[activityInfo.data.status];
      });

      let isPointType = computed(() => {
         if (!hasActivityInfo.value) return false;
         return activityInfo.data.redeem_type === 'point';
      });

      let getActivityInfo = async() => {
         return activityApi.couponInfo({
            coupon_activity_ids: [activityId.value],
            full_info: true
         }).then(res => res.info.results.coupon_activity_information[0]);
      }

      let getBrandInfo = async(brandIds) => {
         return brandApi.brand_information({
            brand_ids: brandIds,
            full_info: false
         }).then(res => res.info.results.brand_information)
      }

      let getCouponInfo = async(couponIds) => {
         return couponApi.coupon_information({
            coupon_ids: couponIds,
            full_info: false
         }).then(res => res.info.results.coupon_information);
      }

      let getBrandIds = (data) => {
         let arr = data.reduce((prev, current) => {
            prev = prev.concat(current.brand_ids);
            return prev;
         }, []);
         return Array.from(new Set(arr));
      }

      let getPointCategoryInfo = async(key) => { //取得點數分類資訊
         if (activityInfo.data[key] === undefined) return [];
         let pointIds = activityInfo.data[key].map(item => item.point_id);
         let method = key === 'point_condition' ? 'pointInfo' : 'externalPointInfo';
         let result = await pointApi[method]({ point_id: pointIds, full_info: false })
            .then(res => res.info.results.point_information);
         result.forEach(item => item.category = key);
         return _.cloneDeep(result);
      }

      let intergateCoupon = ({ couponInfo, brandInfo, storeInfo }) => { //整和票券
         return couponInfo.reduce((prev, current) => {
            let targetBrand = brandInfo.find(item => item.brand_id === current.brand_ids[0]);
            let targetStore = storeInfo.find(item => item.coupon_id === current.coupon_id);
            prev.push({ ...current, brandInfo: targetBrand, storeInfo: targetStore });
            return prev;
         }, []);
      }

      let createPickList = (pointInfo) => { //產生點數下拉清單
         let categoryArr = ['point_condition', 'external_point_condition'];
         let result = [];
         categoryArr.forEach(category => {
            if (activityInfo.data[category] === undefined) return false;
            let conditionArr = activityInfo.data[category].reduce((prev, current) => {
               let pointId = current.point_id;
               let obj = pointInfo.find(item => {
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
            result = result.concat(conditionArr);
         });
         return result;
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

      let readyExchange = () => {
         let redeemType = activityInfo.data.redeem_type;
         if (redeemType === 'free') {
            doubleCheckOption.isOpen = true;
            doubleCheckOption.message = `您確定要免費兌換「${activityTitle.value}」嗎?`;
         } else if (redeemType === 'redeem_code') {
            codePopupOption.isOpen = true;
         }
      }

      let processHandler = async(val) => {
         isLoading.value = true;
         doubleCheckOption.isOpen = false;
         codePopupOption.isOpen = false;
         let params = { coupon_activity_id: activityInfo.data.coupon_activity_id };
         let redeemType = activityInfo.data.redeem_type;
         if (redeemType === 'redeem_code') {
            params.redeem_code = val;
         } else if (redeemType === 'point') {

         }
         let { status:exchangeStatus, errMsg, redeemInfo } = await exchangeHandler(params);
         tempStatus.value = exchangeStatus;
         if (exchangeStatus) {
            root.$storage.setSessionItem('redeemInfo', redeemInfo);
            msgOption.message = '兌換成功';
         } else {
            msgOption.message = errMsg;
         }
         msgOption.isOpen = true;
         isLoading.value = false;
      }

      let finishHandler = () => {
         if (tempStatus.value) root.$router.push('/activity/success');
         msgOption.isOpen = false;
      }

      onMounted(async() => {
         isLoading.value = true;
         activityId.value = parseInt(root.$route.params.activity_id);
         activityInfo.data = await getActivityInfo();
         let { brand_id, coupon_ids } = activityInfo.data;
         activityBrandLogo.value = await getBrandInfo([brand_id])
            .then(res => res[0].feature_image_small.url);
         let couponInfo = await getCouponInfo(coupon_ids);
         let brandIds = getBrandIds(couponInfo);
         let brandInfo = await getBrandInfo(brandIds);
         let storeInfo = await storeApi.searchAvailableStore({ coupon_ids })
            .then(res => res.info.results.search_coupon_available_store_results);
         couponList.data = intergateCoupon({ couponInfo, brandInfo, storeInfo });

         if (isPointType.value) {
            let normalPoint = await getPointCategoryInfo('point_condition');
            let externalPoint = await getPointCategoryInfo('external_point_condition');
            let allPoint = normalPoint.concat(externalPoint);
            pickerItem.data = createPickList(allPoint);
            // if (this.pointListThanOne) this.initIosPicker();
         }

         isLoading.value = false;
      });

      return { isLoading, activityTitle, activityDuration, activityMeta, activityContent, activityBrandLogo, brandLogoBg, activityIsOpening, redeemTypeText, usageText, couponList, readyExchange, doubleCheckOption, processHandler, exchangeHandler, msgOption, finishHandler, codePopupOption, isPointType, pickerItem }
   },
   components: {
      RedeemCoupon,
      PointPicker
   }
}
</script>

<style lang="scss" src="./scss/activityInfo.scss"></style>