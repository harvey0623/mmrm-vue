<template src="./html/activity.html"></template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import { brandApi } from '@/api/brand.js';
import { activityApi } from '@/api/activity.js';
import { pointApi } from '@/api/point.js';
import BrandCriteriaItem from '@/components/CriteriaItem/Brand.vue';
import PointCriteriaItem from '@/components/CriteriaItem/Point.vue';
import _ from 'lodash';
export default {
   props: {
      isOpen: {
         type: Boolean,
         required: true
      }
   },
   setup(props, { emit }) {
      let subId = ref('');
      let brandCondition = reactive({ data: [] });
      let pointCondition = reactive({ data: [] });
      let redeemType = { free: '點數兌換', redeem_code: '代碼兌換' };

      let totalBrand = computed(() => {
         return brandCondition.data.length;
      });

      let checkedBrandCount = computed(() => {
         let checkedList = brandCondition.data.filter(item => item.checked);
         return checkedList.length;
      });

      let allBrandSelected = computed(() => {
         return totalBrand.value === checkedBrandCount.value;
      });

      let totalPoint = computed(() => {
         return pointCondition.data.length;
      });

      let checkedPointCount = computed(() => {
         let checkedList = pointCondition.data.filter(item => item.checked);
         return checkedList.length;
      });

      let allPointSelected = computed(() => {
         return totalPoint.value === checkedPointCount.value;
      });

      let backHandler = () => { //選單返回
         if (subId.value !== '') return showSubMenu('');
         emit('update:isOpen', false);
      }

      let showSubMenu = (id) => subId.value = id; //顯示次選單

      let changeBrandStatus = ({ id, status }) => {
         let obj = brandCondition.data.find(item => item.brand_id === id);
         obj.checked = status;
      }

      let clearAll = (type) => { //清除類別選項
         if (type === 'brand') brandCondition.data.forEach(item => item.checked = false);
         if (type === 'point') pointCondition.data.forEach(item => item.checked = false);
      }

      let createBrandCriteria = (data) => { //產生品牌條件
         return data.reduce((prev, current) => {
            let { brand_id, title, feature_image_small } = current;
            prev.push({ brand_id, title, url: feature_image_small.url, checked: true });
            return prev;
         }, []);
      }

      let getAboutBrand = async() => {
         let brandIds = await brandApi.search_brand().then(res => res.info.results.brand_ids);
         let brandInfo = await brandApi.brand_information({ brand_ids: brandIds, full_info: false })
            .then(res => res.info.results.brand_information)
         brandCondition.data = createBrandCriteria(brandInfo);
      }

      let getPointInfo = async({ key, ids }) => { //取得點資訊
         let method = key === 'point_ids' ? 'pointInfo' : 'externalPointInfo';
         let result = await pointApi[method]({ point_id: ids, full_info: false })
                  .then(res => res.info.results.point_information);
         return _.cloneDeep(result);
      }

      let gatherBrefPoint = async(data) => {
         let lists = [];
         for (let key in data) {
            if (key === 'redeem_type') continue;
            let pointData = await getPointInfo({ key, ids: data[key] });
            pointData.forEach(item => item.category = key);
            lists = lists.concat(pointData);
         }
         return lists;
      }

      let createPointCriteria = ({ brefResult, allPointInfo }) => { //產生點數條件
         let exceptPoint = brefResult.filter(item => item.redeem_type !== 'point');
         let existedPointArr = [];
         let nonePointArr = exceptPoint.reduce((prev, current) => {
            let currentType = current.redeem_type;
            prev.push({
               id: currentType, 
               title: redeemType[currentType],
               type: currentType,
               category: 'basic',
               checked: true
            });
            return prev;
         }, []);
         if (allPointInfo !== null) {
            let includePoint = brefResult.find(item => item.redeem_type === 'point');
            let categoryPoint = {};
            for (let key in includePoint) {
               if (key !== 'redeem_type') categoryPoint[key] = includePoint[key];
            }
            existedPointArr = allPointInfo.reduce((prev, current) => {
               let categoryName = '';
               for (let key in categoryPoint) {
                  let isIdInclude = categoryPoint[key].includes(current.point_id);
                  let isSameCategory = current.category === key;
                  if (isIdInclude && isSameCategory) {
                     categoryName = key;
                     break;
                  }
               }
               prev.push({
                  id: current.point_id,
                  title: `點數兌換-${current.title}`,
                  type: 'point',
                  category: categoryName,
                  checked: true
               });
               return prev;
            }, []);
         }
         return nonePointArr.concat(existedPointArr);
      }

      let changePointStatus = ({ id, category, status }) => {
         let obj = pointCondition.data.find(item => {
            return item.category === category && item.id === id;
         });
         obj.checked = status;
      }

      let getAboutPoint = async() => {
         let brefResult = await activityApi.briefCoupon().then(res => res.info.results.redeem_types);
         let allPointInfo = null;
         let obj = brefResult.find(item => item.redeem_type === 'point');
         if (obj !== undefined) allPointInfo = await gatherBrefPoint(obj);
         pointCondition.data = createPointCriteria({ brefResult, allPointInfo });
      }

      let createFilterParams = () => { //產生搜尋條件
         let brandIds = brandCondition.data.filter(item => item.checked).map(item => item.brand_id);
         let redeemTypes = pointCondition.data.filter(item => item.checked).map(item => item.type);
         redeemTypes = redeemTypes.length !== 0 ? redeemTypes : pointCondition.data.map(item => item.type);
         redeemTypes = Array.from(new Set(redeemTypes));
         let pointCategory = {};
         if (redeemTypes.includes('point')) {
            pointCategory = pointCondition.data.reduce((prev, current) => {
               let { id, checked, type, category } = current;
               if (checked && type === 'point') {
                  if (prev[type] === undefined) prev[category] = [id];
                  else prev[category].push(id);
               }
               return prev;
            }, {});
         }
         return { brand_ids: brandIds, redeem_types: redeemTypes, ...pointCategory };
      }

      let confirmHandler = () => {
         let params = createFilterParams();
         emit('filter', params);
      }

      onMounted(async() => {
         await getAboutBrand();
         await getAboutPoint();
         confirmHandler();
      });

      return { backHandler, subId, showSubMenu, brandCondition, changeBrandStatus, clearAll, pointCondition, changePointStatus, checkedBrandCount, allBrandSelected, checkedPointCount, allPointSelected, confirmHandler }
   },
   components: {
      BrandCriteriaItem,
      PointCriteriaItem
   }
}
</script>

<style></style>