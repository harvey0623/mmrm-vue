<template>
   <div class="home">
      <div class="mycontainer">
         <EntranceBlock
            v-for="service in serviceInfo"
            :key="service.itemType"
            :title="service.title"
            :lists="service.lists"
            @logout="logoutHandler"
         ></EntranceBlock>
      </div>
      <Loading v-show="isLoading"></Loading>
   </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from '@vue/composition-api';
import { memberApi } from '@/api/member.js';
import EntranceBlock from '@/components/EntranceBlock/index.vue';
export default {
   name: 'home',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.home.title'),
      }
   },
   setup(props, { root }) {
      let isLoading = ref(false);
      let serviceInfo = reactive([
         {
            itemType: 'member',
            title: '會員項目',
            lists: [
               { itemType: 'login', title: '登入',path: '/login', auth: false, 
                  icon: 'fas fa-sign-in-alt' },
               { itemType: 'maintain', title: '會員資料', path: '/member/maintain', auth: true, icon: 'fas fa-users-cog' },
               { itemType: 'card', title: '會員條碼', path: '/member/card', auth: true, icon: 'fas fa-qrcode' },
               { itemType: 'level', title: '會員等級', path: '/member/level', auth: true, icon: 'fas fa-tasks' },
               { itemType: 'transaction', title: '交易紀錄', path: '/member/transaction', auth: true, icon: 'fas fa-history' },
               { itemType: 'point', title: '點數資訊', path: '/member/pointInfo/', auth: true, icon: 'fas fa-coins' },
               { itemType: 'logout', title: '登出', path: '/', auth: true, icon: 'fas fa-sign-out-alt' }
            ]
         },
         {
            itemType: 'ticket',
            title: '票券項目',
            lists: [
               { itemType: 'coupon', title: '票券匣', path: '/coupon/folder', auth: true, icon: 'fas fa-ticket-alt' },
               { itemType: 'activity', title: '兌換活動', path: '/activity/list', auth: true, icon: 'fas fa-exchange-alt' },
            ]
         }
      ]);

      let isLogin = computed(() => root.$store.state.auth.isLogin);

      let addPointIdToUrl = async () => {
         let pointList = await memberApi.member_summary().then(res => res.info.results.point_summary.current_point);
         if (pointList.length === 0) return;
         let pointId = pointList[1].point_id;
         let targetServiceList = serviceInfo[0].lists;
         let pointObj = targetServiceList.find(item => item.itemType === 'point');
         pointObj.path = pointObj.path + pointId;
      }

      onMounted(async() => {
         isLoading.value = true;
         if (isLogin.value) await addPointIdToUrl();
         isLoading.value = false;
      });

      let logoutHandler = async() => {
         isLoading.value = true;
         await root.$store.dispatch('auth/logout');
         isLoading.value = false;
      }

      return { isLoading, serviceInfo, logoutHandler };
   },
   components: {
      EntranceBlock
   }
}
</script>

<style lang="scss" scoped></style>