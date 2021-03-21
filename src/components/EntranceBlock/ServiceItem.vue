<template>
   <router-link :to="path" class="serviceItem" @click.native="clickHandler">
      <i :class="icon"></i>
      <span>{{ title }}</span>
   </router-link>
</template>

<script>
export default {
   props: {
      title: {
         type: String,
         required: true
      },
      path: {
         type: String,
         required: true
      },
      icon: {
         type: String,
         required: true
      },
      itemType: {
         type: String,
         required: true
      }
   },
   methods: {
      async clickHandler(evt) {
         if (this.itemType !== 'logout') return;
         evt.preventDefault();
         this.$emit('logout');
      }
   }
};
</script>

<style lang="scss" scoped>
   .serviceItem {
      width: 25%;
      margin-bottom: map-get($gutter, basic) + 5px;
      color: var(--variationMain);
      text-align: center;
      >* {
         display: block;
      }
      >i {
         font-size: 30px;
         margin-bottom: 5px;
      }
   }
</style>