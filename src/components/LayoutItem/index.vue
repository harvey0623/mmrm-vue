<template>
   <span :class="classList" @click="clickHandler"></span>
</template>

<script>
import { computed, toRefs } from '@vue/composition-api';
export default {
   props: {
      layoutId: {
         type: String,
         required: true
      },
      layoutClass: {
         type: String,
         required: true
      },
      currentLayoutId: {
         type: String,
         required: true
      }
   },
   setup(props, { emit }) {
      let { layoutId, layoutClass, currentLayoutId } = toRefs(props);
      
      let classList = computed(() => {
         return ['layout', layoutClass.value, { active: layoutId.value === currentLayoutId.value }];
      });

      let clickHandler = () => {
         emit('layout', layoutId.value);
      }

      return { classList, clickHandler };
   }
}
</script>

<style lang="scss" scoped>
   .layout {
      @extend %bgImgCenter;
      @include size(18px);
      cursor: pointer;
      &A {
         background-image: url("~@/assets/img/page/btn_filter_view_big_n@2x.png");
         margin-right: 10px;
         &.active {
            background-image: url("~@/assets/img/page/btn_filter_view_big_h@2x.png");
         }
      }
      &B {
         background-image: url("~@/assets/img/page/btn_filter_view_list_n@2x.png");  
         &.active {
            background-image: url("~@/assets/img/page/btn_filter_view_list_h@2x.png");
         }
      }
   }
</style>