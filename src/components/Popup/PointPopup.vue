<template>
   <div class="pointPopup" v-show="isOpen">
      <div class="closeIcon" @click="closeHandler"></div>
      <div class="point-content">
         <div class="point-header">
            <p>{{ pointTitle }}</p>
            <p>{{ pointAmount }} 點</p>
         </div>
         <div class="point-body">
            <slot></slot>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      isOpen: {
         type: Boolean,
         default: false
      },
      pointTitle: {
         type: String,
         default: ''
      },
      pointAmount: {
         type: [Number, String],
         default: 0
      }
   },
   methods: {
      closeHandler() {
         this.$emit('update:isOpen', false);
      }
   }
}
</script>

<style lang="scss" scoped>
   $radius: map-get($radius, basic);
   .pointPopup {
      position: fixed;
      left: 0;
      top: 0;
      @include size(100%, 100vh);
      background-color: rgba(#000, 0.5);
      z-index: 2;
      >.closeIcon {
         position: absolute;
         left: 15px;
         top: 15px;
         @include size(30px);
         background-image: url("~@/assets/img/page/btn_nav_close_darkbg_n@3x.png");
         background-size: contain;
      }
   }
   .point-content {
      @extend %posCenter;
      width: 85%;
      >* {
         padding: 20px 15px;
      }
      >.point-header {
         @extend %bwtFlex;
         border-radius: $radius $radius 0 0;
         background-color: var(--variationMain);
         color: #fff;
      }
      >.point-body {
         border-radius: 0 0 $radius $radius;
         background-color: #fff;
      }
   }
</style>