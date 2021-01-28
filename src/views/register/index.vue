<template>
   <div class="register">
      <div class="mycontainer">
         <div id="processBox" :class="stepClass"></div>
         <router-view></router-view>
      </div>
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
      currentStep: ''
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
   }
}
</script>

<style></style>