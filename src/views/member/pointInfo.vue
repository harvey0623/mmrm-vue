<template>
   <div>pointInfo</div>
</template>

<script>
import { ref, reactive, onMounted, computed, watch } from '@vue/composition-api';
import { pointApi } from '@/api/point.js';
import dayjs from 'dayjs';
export default {
   name: 'pointInfo',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.pointInfo.title'),
      }
   },
   setup(props, { root }) {
      let pointId = ref(0);


      watch(() => root.$route, (val, oldVal) => {
         console.log(val);
      });

      onMounted(async() => {
         
         // pointId.value = parseInt(root.$route.params.point_id);
      });
   }
}
</script>

<style></style>