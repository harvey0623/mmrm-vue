<template>
   <div class="home">
      <div class="mycontainer">
         <EntranceBlock
            v-for="service in serviceList"
            :key="service.id"
            :title="service.title"
            :lists="service.lists"
            :isLogin="service.isLogin"
            @logout="logoutHandler"
         ></EntranceBlock>
      </div>
      <Loading v-show="isLoading"></Loading>
   </div>
</template>

<script>
import EntranceBlock from '@/components/EntranceBlock/index.vue';
export default {
   name: 'home',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.home.title'),
      }
   },
   data: () => ({
      blockData: [
         {
            id: 'member-service',
            title: '會員服務',
            lists: [
               { iconClass: 'memberCard', path: '/', auth: true, showInLogin: true },
               { iconClass: 'myCoupon', path: '/', auth: true, showInLogin: true },
               { iconClass: 'message', path: '/', auth: true, showInLogin: true },
               { iconClass: 'login', path: '/login', auth: true, showInLogin: false },
               { iconClass: 'maintain', path: '/member/maintain', auth: true, showInLogin: true },
               { iconClass: 'logout', path: '/', auth: true, showInLogin: true },
            ]
         },
         {
            id: 'other-service',
            title: '其他服務',
            lists: [
               { iconClass: 'news', path: '/', auth: false, showInLogin: false },
               { iconClass: 'exchangeCoupon', path: '/', auth: true, showInLogin: true },
               { iconClass: 'exchangePoint', path: '/', auth: true, showInLogin: true },
               { iconClass: 'menu', path: '/', auth: false, showInLogin: false },
               { iconClass: 'about', path: '/', auth: false, showInLogin: false },
            ]
         }
      ],
      isLoading: false
   }),
   computed: {
      isLogin() {
         return this.$store.state.auth.isLogin;
      },
      serviceList() {
         return this.blockData.reduce((prev, current) => {
            prev.push({ ...current, isLogin: this.isLogin });
            return prev;
         }, []);
      }
   },
   methods: {
      async logoutHandler() {
         this.isLoading = true;
         await this.$store.dispatch('auth/logout');
         this.isLoading = false;
      }
   },
   components: {
      EntranceBlock
   }
}
</script>

<style lang="scss" scoped>

</style>