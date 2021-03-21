<template>
   <div class="panelLayout">
      <div class="fixedPanel">
         <router-link to="/">
            <i class="fas fa-home"></i>
         </router-link>
      </div>
      <slot></slot>
   </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
   $basicHeight: map-get($heightObj, basic);
   .panelLayout {
      padding-top: $basicHeight;
      .fixedPanel {
         position: fixed;
         left: 0;
         top: 0;
         @include size(100%, $basicHeight);
         padding-left: 15px;
         background-color: #fff;
         border-bottom: 1px solid lightgray;
         z-index: 11;
         >a {
            display: inline-block;
            height: 100%;
            font-size: 25px;
            line-height: $basicHeight;
            color: var(--variationMain);
         }
      }
   }
</style>