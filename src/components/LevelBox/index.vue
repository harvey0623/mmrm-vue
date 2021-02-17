<template>
   <div class="levelBox">
      <div class="levelTitle">{{ title }}</div>
      <div class="levelBody">
         <ProgressItem
            v-for="(progress, index) in progressList"
            :key="levelId + '-' + index"
            :amount="progress.amount"
            :requirement="progress.requirement"
            :type="progress.type"
         ></ProgressItem>
      </div>
   </div>
</template>

<script>
import ProgressItem from './ProgressItem.vue';
export default {
   props: {
      title: {
         type: String,
         default: ''
      },
      source: {
         type: Object,
         required: true
      }
   },
   computed: {
      levelId() {
         return this.source.level_id;
      },
      progressList() {
         return this.source.progress;
      }
   },
   components: {
      ProgressItem
   }
}
</script>

<style lang="scss" scoped>
   .levelBox {
      @include elGutter(margin-bottom, 25px);
      >.levelTitle {
         padding-left: 15px;
         margin-bottom: map-get($gutter, basic);
         color: map-get($fontColor, input);
      }
      >.levelBody {
         min-height: 100px;
         padding: 25px;
         background-color: #fff;
         border-radius: map-get($radius, basic);
      }
   }
</style>