<template>
   <div class="register">
      <div class="mycontainer">
         <div id="processBox" :class="stepClass"></div>
         <router-view 
            @loading="loadingHandler"
            @checkSignup="checkSignup"
         ></router-view>
      </div>
      <Loading v-show="isLoading"></Loading>
   </div>
</template>

<script>
export default {
   name: 'register',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.register.title'),
      }
   },
   data: () => ({
      isLoading: false
   }),
   computed: {
      routeStep() {
         return this.$route.meta.step;
      },
      stepClass() {
         if (this.routeStep >= 1 && this.routeStep <= 3) {
            return `step${this.routeStep}`;
         } else {
            return 'none';
         }
      }
   },
   methods: {
      loadingHandler(value) {
         this.isLoading = value;
      },
      async checkSignup(callback) {
         let result = await this.$store.dispatch('auth/checkHasSignupData');
         callback(result);
      }
   }
}
</script>

<style></style>