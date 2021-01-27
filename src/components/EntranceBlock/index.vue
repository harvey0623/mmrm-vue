<template>
   <div class="entranceBlock" v-show="showBlock">
      <h2>{{ title }}</h2>
      <div class="serviceBox">
         <ServiceItem
            v-for="list in lists"
            :key="list.iconClass"
            :iconClass="list.iconClass"
            :path="list.path"
            :auth="list.auth"
            :showInLogin="list.showInLogin"
            :isLogin="isLogin"
         ></ServiceItem>
      </div>
   </div>
</template>

<script>
import ServiceItem from './ServiceItem.vue';
export default {
   props: {
      title: {
         type: String,
         default: ''
      },
      lists: {
         type: Array,
         default() {
            return []
         }
      },
      isLogin: {
         type: Boolean,
         required: true
      }
   },
   computed: {
      showBlock() {
         let isAllAuth = this.lists.every(list => list.auth);
         let isAllNeedLogin = this.lists.every(list => list.showInLogin);
         if (!isAllAuth) return true;
         if (isAllNeedLogin && this.isLogin) return true;
         if (!isAllNeedLogin && !this.isLogin) return true;
         if (!isAllNeedLogin && this.isLogin) return true;
         return false;
      }
   },
   components: {
      ServiceItem
   }
};
</script>

<style lang="scss" scoped>
   .entranceBlock {
      min-height: 100px;
      padding: 15px;
      @include elGutter(margin-bottom, map-get($gutter, basic));
      background-color: #fff;
      border-radius: 10px;
      > h2 {
         margin-bottom: map-get($gutter, basic);
         text-align: center;
         color: var(--variationMain);
         font-weight: 400;
      }
   }
   .serviceBox {
      display: flex;
      flex-wrap: wrap;
   }
</style>