<template src="./html/activityList.html">

</template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api';
export default {
   name: 'activityList',
      metaInfo() {
      return {
         title: this.$i18n.t('page.activityList.title'),
      }
   },
   setup(props, context) {
      
   }
}
</script>

<style lang="lang" src="./scss/activityList.scss"></style>