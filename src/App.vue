<template>
   <div id="app">
      <component :is="layoutName">
         <router-view></router-view>
      </component>
      <MessagePopup
         :isOpen="openExpirePopup"
         :message="expireOption.message"
         :eventName="expireOption.eventName"
         @expireSure="expireHandler"
      ></MessagePopup>
      <MessagePopup
         :isOpen="openLogoutPopup"
         :message="logoutOption.message"
         :eventName="logoutOption.eventName"
         @logoutSure="logoutHandler"
      ></MessagePopup>
   </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
   metaInfo() {
      return {
         title: '',
         titleTemplate: '%s | MMRM',
         meta: [
            { property: 'og:image', content: '' },
            { property: 'og:description', content: 'project' },
         ],
      };
   },
   data: () => ({
      expireOption: {
         message: '逾時，請重新登入',
         eventName: 'expireSure',
      },
      logoutOption: {
         message: '登出成功',
         eventName: 'logoutSure'
      }
   }),
   computed: {
      openExpirePopup: {
         ...mapState({ get: 'openExpirePopup' }),
         ...mapMutations({ set: 'setExpirePopup' })
      },
      openLogoutPopup: {
         ...mapState({ get: 'openLogoutPopup' }),
         ...mapMutations({ set: 'setLogoutPopup' })
      },
      layoutName() {
         return this.$route.meta.layout !== undefined ? 'PanelLayout' : 'DefaultLayout';
      }
   },
   methods: {
      expireHandler() {
         this.openExpirePopup = false;
      },
      logoutHandler() {
         this.openLogoutPopup = false;
      },
      unloadHandler() {
         this.$store.dispatch('auth/clearAllRegister');
      }
   },
   mounted() {
      window.addEventListener('beforeunload', this.unloadHandler);
   },
   beforeDestroy() {
      window.removeEventListener('beforeunload', this.unloadHandler);
   }
};
</script>

<style></style>
