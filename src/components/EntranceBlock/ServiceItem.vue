<template>
   <router-link 
      :to="path" 
      :class="['serviceItem', iconClass]"
      v-show="showIcon"
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
      },
      auth: {
         type: Boolean,
         default: false
      },
      showInLogin: {
         type: Boolean,
         default: false
      },
      isLogin: {
         type: Boolean,
         required: true
      }
   },
   methods: {
      async clickHandler(evt) {
         if (this.iconClass !== 'logout') return;
         evt.preventDefault();
         this.$emit('logout');
      }
   },
   computed: {
      showIcon() {
         if (!this.auth) return true;
         if (this.showInLogin && this.isLogin) return true;
         if (!this.showInLogin && !this.isLogin) return true;
         return false;
      }
   }
};
</script>

<style lang="scss" src="./ServiceItem.scss" scoped></style>