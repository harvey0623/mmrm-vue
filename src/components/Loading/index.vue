<template>
   <div id="loading">
      <div class="dots">
         <div></div>
         <div></div>
         <div></div>
      </div>
   </div>
</template>

<script>
export default {
   
};
</script>

<style lang="scss">
#loading {
   position: fixed;
   left: 0;
   top: 0;
   @extend %centerFlex;
   @include size(100%);
   background-color: rgba(black, 0.5);
   color: #fff;
   z-index: 1200;
   >.dots {
      display: flex;
      >div {
         @include size(20px);
         margin-right: 15px;
         border-radius: 50%;
         background-color: #fff;
         animation: fade 0.8s ease-in-out alternate infinite;
         &:nth-child(1) {
            animation-delay: -0.4s;
            margin-left: 15px;
         }
         &:nth-child(2) {
            animation-delay: -0.2s;
         }
      }
   }
}

@keyframes fade {
   from {
      opacity: 1;
   }
   to {
      opacity: 0;
   }
}

</style>
