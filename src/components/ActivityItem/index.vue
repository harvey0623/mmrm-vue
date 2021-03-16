<template src="./index.html"></template>

<script>
import { ref, reactive, onMounted, computed, toRefs } from '@vue/composition-api';
export default {
   props: {
      activityInfo: {
         type: Object,
         required: true
      },
      currentLayoutId: {
         type: String,
         required: true
      }
   },
   setup(props, { emit }) {
      let { activityInfo } = toRefs(props);
      let isFinish = ref(false);
      let usageStatus = {
         opening: '已開啟',
         unopened: '尚未開始',
         closed: '已結束'
      };
      let redeemStatus = {
         free: '免費兌換',
         redeem_code: '兌換碼兌換',
         point: '點數兌換',
      };

      let isOpening = computed(() => activityInfo.value.status === 'opening');

      let usageText = computed(() => usageStatus[activityInfo.value.status]);

      let activityBg = computed(() => { //活動圖片
         let url = activityInfo.value.feature_image.url;
         if (!url) return {};
         else return { backgroundImage: `url(${url})` };
      });

      let activityDuration = computed(() => {
         let startTime = activityInfo.value.start_datetime.split(' ')[0];
         let endTime = activityInfo.value.end_datetime.split(' ')[0];
         return `${startTime} ~ ${endTime}`;
      });

      let brandLogo = computed(() => {
         let url = activityInfo.value.brandInfo.feature_image_small.url;
         if (!url) return {};
         else return { backgroundImage: `url(${url})` };
      });

      let exchangeText = computed(() => { //兌換方式文字
         let redeemType = activityInfo.value.redeem_type;
         if (redeemType !== 'point') return redeemStatus[redeemType];
         let normalArr = getPointInfoText('point_condition');
         let externalArr = getPointInfoText('external_point_condition');
         return normalArr.concat(externalArr).join(' / ');
      });

      let getPointInfoText = (key) => { //整合數資訊字串
         if (activityInfo.value[key] === undefined) return [];
         return activityInfo.value[key].reduce((prev, current) => {
            let obj = activityInfo.value.pointInfo.find(item => {
               return item.point_id === current.point_id && item.category === key;
            });
            prev.push(`${obj.title}${current.amount}點`);
            return prev;
         }, []);
      }

      onMounted(() => {

      });

      return { usageText, isOpening, activityBg, activityDuration, brandLogo, exchangeText, isFinish }
   }
}
</script>

<style lang="scss" src="./index.scss" scoped></style>