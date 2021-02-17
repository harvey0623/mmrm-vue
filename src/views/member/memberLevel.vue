<template>
   <div class="mycontainer">
      <div class="levelWrap">
         <LevelBox
            v-for="(item,index) in levelArr"
            :key="index"
            :title="item.title"
            :source="item.source"
         ></LevelBox>
      </div>
      <Loading v-show="isLoading"></Loading>
   </div>
</template>

<script>
import { memberApi } from '@/api/member.js';
import LevelBox from '@/components/LevelBox/index.vue';
export default {
   name: 'level',
   metaInfo() {
      return {
         title: this.$i18n.t('page.memberLevel.title'),
      }
   },
   data: () => ({
      levelArr: [],
      isLoading: false,
   }),
   methods: {
      async getMemberSummary() {
         let memberSummary = await memberApi.member_summary();
         let { next_level, renew_level } = memberSummary.info.results.level_summary;
         if (next_level !== undefined && next_level.progress.length !== 0) {
            this.levelArr.push({
               title: '達成以下任一條件即可升等',
               source: next_level,
            });
         }
         if (renew_level !== undefined && renew_level.progress.length !== 0) {
            this.levelArr.push({
               title: '達成以下任一條件即可續等',
               source: renew_level,
            });
         }
      }
   },
   async mounted() {
      this.isLoading = true;
      await this.getMemberSummary();
      this.isLoading = false;
   },
   components: {
      LevelBox
   },
}
</script>

<style></style>