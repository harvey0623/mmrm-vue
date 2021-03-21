<template src="./index.html"></template>

<script>
import { ref, reactive, onMounted, computed, toRefs, onUnmounted, watch } from '@vue/composition-api';
import Countdown from '@/plugins/countdown/index.js';
export default {
   props: {
      activityInfo: {
         type: Object,
         required: true
      },
      currentLayoutId: {
         type: String,
         required: true
      },
      systemTime: {
         type: String,
         required: true
      },
      projectTime: {
         type: Number,
         required: true
      }
   },
   setup(props, { emit }) {
      let countdownObj = null;
      let { activityInfo, systemTime, projectTime } = toRefs(props);
      let isFinish = ref(false);
      let usageStatus = {
         opening: '已開啟',
         unopened: '尚未開始',
         closed: '已結束'
      };
      let redeemStatus = {
         free: '免費兌換',
         redeem_code: '兌換碼兌換'
      };
      let timeInfo = reactive({ day: 0, hour: 0, minute: 0 });

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

      let isCountdown = computed(() => { //是否要倒數
         let systemTimeStamp = new Date(systemTime.value).getTime();
         let endTimeStamp = new Date(activityInfo.value.end_datetime).getTime();
         let diff = endTimeStamp - systemTimeStamp;
         if (diff <= 0) return false;
         let isLess = diff < projectTime.value;
         return isOpening.value && isLess;
      });

      let remainedTime = computed(() => { //剩餘時間字串
         return `${timeInfo.day}天${timeInfo.hour}時${timeInfo.minute}分`;
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

      let startCountdown = () => { //到數
         countdownObj = new Countdown({ deadline: activityInfo.value.end_datetime });
         countdownObj.on('update', (payload) => {
            let { day, hour, minute } = payload;
            timeInfo.day = day;
            timeInfo.hour = hour;
            timeInfo.minute = minute;
         });
         countdownObj.on('finish', () => isFinish.value = true);
         countdownObj.start();
      }

      let wantToExchange = () => {
         emit('ready', {
            activityId: activityInfo.value.coupon_activity_id,
            redeemType: activityInfo.value.redeem_type,
            status: activityInfo.value.status
         });
      }

      watch(() => isCountdown.value, (val) => {
         if (val) {
            startCountdown();
         } else {
            if (countdownObj !== null) countdownObj.pause();
            isFinish.value = false;
         }
      });

      onMounted(() => {
         if (isCountdown.value) startCountdown();
      });

      onUnmounted(() => {
         if (countdownObj !== null) countdownObj.pause();
      });

      return { usageText, isOpening, activityBg, activityDuration, brandLogo, exchangeText, isFinish, isCountdown, remainedTime, wantToExchange }
   }
}
</script>

<style lang="scss" src="./index.scss" scoped></style>