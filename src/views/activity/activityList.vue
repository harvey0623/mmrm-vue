<template src="./html/activityList.html"></template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
import { activityApi } from '@/api/activity.js';
export default {
   name: 'activityList',
      metaInfo() {
      return {
         title: this.$i18n.t('page.activityList.title'),
      }
   },
   setup(props, context) {
      
   },
   components: {
      
   }
}
</script>

<style lang="lang" src="./scss/activityList.scss"></style>