<template src="./html/activityInfo.html"></template>

<script>
import { ref, reactive, onMounted, computed, onUnmounted } from '@vue/composition-api';
export default {
   name: 'activityList',
      metaInfo() {
      return {
         title: this.$i18n.t('page.activityInfo.title'),
      }
   },
   setup(props, { root }) {

      onMounted(() => {
         console.log(root.$route.params.activity_id);
      });
      return {}

   }
}
</script>

<style></style>