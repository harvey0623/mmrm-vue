<template>
   <router-link class="breadItem" :to="itemPath">
      <span 
         class="breadName"
         :class="{before:shwoSlash}">
         {{ $t(`page.${itemKey}.title`) }}
      </span>
      <span class="slash" v-show="shwoSlash">/</span>
   </router-link>
</template>

<script>
export default {
   props: {
      itemKey: {
         type: String,
         default: ''
      },
      itemPath: {
         type: String,
         default: ''
      },
      order: {
         type: Number,
         required: true
      },
      total: {
         type: Number,
         required: true
      }
   },
   computed: {
      shwoSlash() {
         return this.order !== this.total - 1;
      }
   }
}
</script>

<style lang="scss">
   .breadItem {
      @include elGutter(margin-right, 10px);
      >.breadName {
         color: gray;
         &.before {
            color: rgb(15, 147, 255);
         }
      }
      >.slash {
         margin-left: 10px;
      }
   }
</style>