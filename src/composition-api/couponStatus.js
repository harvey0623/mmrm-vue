import { reactive } from '@vue/composition-api';
export const couponStateText = function () {
   let statusText = reactive({
      notyet: '尚未開始',
      available: '可使用',
      expired: '已逾期',
      obsolete: '已失效',
      redeemed: '已使用',
      transferred: '已轉贈'
   });
   return { statusText };
}