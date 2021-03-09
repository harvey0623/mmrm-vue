<template src="./html/couponFolder.html"></template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import { couponApi } from '@/api/coupon.js';
import { brandApi } from '@/api/brand.js';
import { storeApi } from '@/api/store.js';
import TabItem from '@/components/TabItem/index.vue';
import CouponTabContent from '@/components/CouponTabContent/index.vue';
export default {
   name: 'couponFolder',
   metaInfo() {
      return {
         title: this.$i18n.t('page.couponFolder.title'),
      }
   },
   setup(props, context) {
      let currentCouponType = ref('valid');
      let couponCategory = reactive({ data: {} });
      let isLoading = ref(false);
      let tabInfo = reactive([
         { type: 'valid', title: '我得票券' },
         { type: 'invalid', title: '歷史票券' },
         { type: 'transferred', title: '轉贈紀錄' },
      ]);

      let currentCategory = computed({
         get() {
            return couponCategory.data[currentCouponType.value];
         },
         set({ key, value }) {
            let targetObj = couponCategory.data[currentCouponType.value];
            if (key === 'data') {
               targetObj.data = targetObj.data.concat(value);
            } else {
               targetObj[key] = value;
            }
         }
      });
   
      let initCateogry = () => { //初始票券種類
         return tabInfo.reduce((prev, current) => {
            prev[current.type] = { 
               type: current.type,
               isFirst: true,
               data: [],
               currentPage: 0,
               scrollPos: 0,
            };
            return prev;
         }, {});
      }

      let getCouponList = async() => { //取得票券列表
         return await couponApi.my_coupon_list({
            type: currentCouponType.value,
            offset: currentCategory.value.currentPage
         }).then(res => res.info);
      }

      let getCouponInfo = async(ids) => { //取得票券資訊
         return await couponApi.coupon_information({ 
            coupon_ids: ids,
            full_info: false 
         }).then(res => res.info.results.coupon_information);
      }

      let getBrandInfo = async(ids) => { //取得品牌資訊
         return await brandApi.brand_information({ 
            brand_ids: ids, 
            full_info: false 
         }).then(res => res.info.results.brand_information)
      }

      let getAvailableStore = async(ids) => { //取得對應店家
         return await storeApi.searchAvailableStore({
            coupon_ids: ids
         }).then(res => res.info.results.search_coupon_available_store_results)
      }

      let gatherCouponIds = (data) => { //取得票券id
         let arr = data.map(item => item.coupon_id);
         return Array.from(new Set(arr));
      }

      let gatherBrandIds = (data) => { //取得品牌id
         let arr = data.reduce((prev, current) => {
            prev = prev.concat(current.brand_ids);
            return prev;
         }, []);
         return Array.from(new Set(arr));
      }

      let switchType = async(tabType) => { //切換票券類型
         if (tabType === currentCouponType.value) return;
         if (isLoading.value) return;
         currentCouponType.value = tabType;
         if (currentCategory.value.isFirst) await getPagination();
      }

      let integrateData = ({ couponList, couponInfo, brandInfo, storeInfo }) => { //整合資料
         return couponList.reduce((prev, current) => {
            let coupon_id = current.coupon_id;
            let targetInfo = couponInfo.find(coupon => coupon.coupon_id === coupon_id);
            let targetStore = storeInfo.find(store => store.coupon_id === coupon_id);
            let obj = { ...current, couponInfo: targetInfo, storeInfo: targetStore };
            obj.brandInfo = brandInfo.find(brand => brand.brand_id === obj.couponInfo.brand_ids[0]);
            prev.push(obj);
            return prev;
         }, []);
      }

      let getPagination = async() => { //取得分頁資料
         isLoading.value = true;
         let intergationResult = [];
         let pagnationData = await getCouponList();
         let couponList = pagnationData.results.my_coupon_list;
         if (couponList.length !== 0) {
            let couponIds = gatherCouponIds(couponList);
            let couponInfo = await getCouponInfo(couponIds);
            let brandIds = gatherBrandIds(couponInfo);
            let brandInfo = await getBrandInfo(brandIds);
            let storeInfo = await getAvailableStore(couponIds);
            intergationResult = integrateData({ couponList, couponInfo, brandInfo, storeInfo });
         }
         currentCategory.value = { key: 'currentPage', value: pagnationData.next };
         currentCategory.value = { key: 'data', value: intergationResult };
         currentCategory.value = { key: 'isFirst', value: false };
         isLoading.value = false;
      }

      onMounted(async() => {
         couponCategory.data = initCateogry();
         getPagination();
      });

      return { tabInfo, currentCouponType, switchType, couponCategory, isLoading };
   },
   components: {
      TabItem,
      CouponTabContent
   }
}
</script>

<style lang="scss" src="./scss/couponFolder.scss" scoped></style>