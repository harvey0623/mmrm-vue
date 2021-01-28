<template>
   <div class="entranceBlock" v-show="showBlock">
      <h2>{{ title }}</h2>
      <div class="serviceBox">
         <ServiceItem
            v-for="list in serviceList"
            :key="list.iconClass"
            :iconClass="list.iconClass"
            :path="list.path"
            @logout="$emit('logout')"
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
      serviceList() {
         let notAuth = this.lists.filter(list => !list.auth); //一定要顯示
         let needLogin = this.lists.filter(list => { //必須要再登入才顯示
            return list.showInLogin && this.isLogin;
         });
         let notNeedLogin = this.lists.filter(list => { //登出狀態下才顯示
            return !list.showInLogin && !this.isLogin;
         });
         let result = notAuth.concat(needLogin, notNeedLogin);
         return Array.from(new Set(result));
      },
      showBlock() {
         return this.serviceList.length !== 0;
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
         font-size: 25px;
      }
      >.serviceBox {
         display: flex;
         flex-wrap: wrap;
      }
   }
</style>