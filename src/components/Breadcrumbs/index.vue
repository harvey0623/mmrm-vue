<template>
   <div class="breadcrumbs" v-show="totalBread > 0">
      <BreadItem 
         v-for="(bread,index) in breadList"
         :key="bread.key"
         :itemKey="bread.key"
         :itemPath="bread.path"
         :order="index"
         :total="totalBread"
      ></BreadItem>
   </div>
</template>

<script>
import BreadItem from './BreadItem.vue';
export default {
   computed: {
      breadList() {
         return this.$route.meta.bread || [];
      },
      totalBread() {
         return this.breadList.length;
      }
   },
   components: {
      BreadItem
   }
}
</script>

<style>
   .breadcrumbs {
      padding-top: 15px;
   }
</style>