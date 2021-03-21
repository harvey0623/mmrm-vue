<template>
   <div class="entranceBlock" v-show="hasLists">
      <h2>{{ title }}</h2>
      <div class="serviceBox">
         <ServiceItem
            v-for="list in serviceLists"
            :key="list.itemType"
            :title="list.title"
            :path="list.path"
            :icon="list.icon"
            :itemType="list.itemType"
            @logout="$emit('logout')"
         ></ServiceItem>
      </div>
   </div>
</template>

<script>
import { computed, toRefs } from '@vue/composition-api';
import ServiceItem from './ServiceItem.vue';
export default {
   props: {
      title: {
         type: String,
         default: ''
      },
      lists: {
         type: Array,
         required: true
      },
      isLogin: {
         type: Boolean,
         required: true
      }
   },
   setup(props, context) {
      let { lists, isLogin } = toRefs(props);
      
      let serviceLists = computed(() => {
         return lists.value.filter(list => list.auth === isLogin.value);
      });
      
      let hasLists = computed(() => serviceLists.value.length > 0);

      return { serviceLists ,hasLists };
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
      >h2 {
         margin-bottom: map-get($gutter, basic) + 5px;
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