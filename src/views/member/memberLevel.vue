<template>
   <div class="mycontainer">
      <Loading v-show="isLoading"></Loading>
   </div>
</template>

<script>
import { memberApi } from '@/api/member.js';
export default {
   name: 'level',
   metaInfo() {
      return {
         title: this.$i18n.t('page.memberLevel.title'),
      }
   },
   data: () => ({
      nextLevel: null,
      renewLevel: null,
      isLoading: false,
   }),
   methods: {
      async getMemberSummary() {
         let memberSummary = await memberApi.member_summary();
         let { next_level, renew_level } = memberSummary.info.results.level_summary;
         console.log(next_level, renew_level);
      }
   },
   async mounted() {
      this.isLoading = true;
      await this.getMemberSummary();
      this.isLoading = false;
   }
}
</script>

<style lang="scss" src="./scss/memberLevel.scss" scoped></style>