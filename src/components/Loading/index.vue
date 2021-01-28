<template>
   <div id="loading"></div>
</template>

<script>
export default {};
</script>

<style lang="scss">
   #loading {
      position: fixed;
      left: 0;
      top: 0;
      @include size(100%);
      background-color: rgba(#000, 0.5);
      z-index: 30;
      &:after {
         content: "";
         position: absolute;
         left: 50%;
         top: 50%;
         @include size(120px);
         transform: translate(-50%, -50%);
         border: 5px solid var(--variationMain);
         border-top-color: transparent;
         border-radius: 50%;
         animation: rotate 1s linear infinite;
      }
   }
   @keyframes rotate {
      0% {
         transform: translate(-50%, -50%) rotate(0deg);
      }
      100% {
         transform: translate(-50%, -50%) rotate(360deg);
      }
   }
</style>
