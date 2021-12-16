import { reactive, computed } from '@vue/composition-api';
import { couponApi } from '@/api/coupon.js';
import { brandApi } from '@/api/brand.js';
import { storeApi } from '@/api/store.js';
import { voucherApi } from '@/api/voucher.js';
import _ from 'lodash';
export const getAboutCouponInfo = function () {
   let couponInfo = reactive({ data: {} });
   let brandInfo = reactive({ data: {} });
   let storeInfo = reactive({ data: {} });
   let hasCouponInfo = computed(() => !(_.isEmpty(couponInfo.data)));
   let hasBrandInfo = computed(() => !(_.isEmpty(brandInfo.data)));
   let hasStoreInfo = computed(() => !(_.isEmpty(storeInfo.data)));
   let couponTitle = computed(() => hasCouponInfo.value ? couponInfo.data.title : '');
   let couponDuration = computed(() => hasCouponInfo.value ? couponInfo.data.duration : '');
   let couponDesc = computed(() => hasCouponInfo.value ? couponInfo.content : '');
   let brandTitle = computed(() => hasBrandInfo.value ? brandInfo.data.title : '');
   let totalUageTimes = computed(() => hasCouponInfo.value ? couponInfo.data.total : '');
   let allStoreAvailable = computed(() => hasStoreInfo.value ? storeInfo.data.all_brands_available : false);
   let storeCount = computed(() => hasStoreInfo.value ? storeInfo.data.store_ids.length : 0);

   let couponBackgroundImage = computed(() => {
      if (!hasCouponInfo.value) return {};
      let url = couponInfo.data.feature_image.url;
      if (url) return { backgroundImage: `url(${url})` };
      else return {};
   });

   let brandBackgroundImage = computed(() => {
      if (!hasBrandInfo.value) return {};
      let url = brandInfo.data.feature_image_small.url;
      if (url) return { backgroundImage: `url(${url})` };
      else return {};
   });

   let getCouponInfo = (couponIds) => { //取得票券資料
      return couponApi.coupon_information({
         coupon_ids: couponIds,
         full_info: true
      }).then(res => res.info.results.coupon_information[0]);
   }

   let getVoucherInfo = async(voucherIds) => {
      return voucherApi.getInfo({
         voucher_ids: voucherIds,
         full_info: false
      }).then(res => res.results.voucher_information[0])
   }

   let getBrandInfo = (brandIds) => { //取得品牌資訊
      return brandApi.brand_information({
         brand_ids: brandIds,
         full_info: false
      }).then(res => res.info.results.brand_information[0]);
   }

   let getStoreInfo = (couponIds) => { //取得商店資訊
      return storeApi.searchAvailableStore({
         coupon_ids: couponIds
      }).then(res => res.info.results.search_coupon_available_store_results[0]);
   }

   let getVoucherStoreInfo = (voucherId) => {
      return storeApi.searchVoucherStore({ voucher_id: voucherId }).then(res => res.info.results);
   }

   return { hasCouponInfo ,couponInfo, brandInfo, storeInfo, couponBackgroundImage, couponTitle, couponDuration, couponDesc, brandTitle, brandBackgroundImage, totalUageTimes, allStoreAvailable, storeCount, getCouponInfo, getBrandInfo, getStoreInfo, getVoucherInfo, getVoucherStoreInfo };
}