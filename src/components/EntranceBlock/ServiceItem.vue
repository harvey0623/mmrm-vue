<template>
   <router-link 
      :to="path" 
      :class="['serviceItem', iconClass]"
      @click.native="clickHandler"
   ></router-link>
</template>

<script>
export default {
   props: {
      iconClass: {
         type: String,
         default: ''
      },
      path: {
         type: String,
         default: '/'
      }
   },
   methods: {
      async clickHandler(evt) {
         if (this.iconClass !== 'logout') return;
         evt.preventDefault();
         this.$emit('logout');
      }
   }
};
</script>

<style lang="scss" src="./ServiceItem.scss" scoped></style>