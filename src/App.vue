<template>
   <div id="app">
      <component :is="layout">
         <router-view></router-view>
      </component>
   </div>
</template>

<script>
export default {
   metaInfo() {
      return {
         title: "",
         titleTemplate: "%s",
         meta: [
            { property: "og:image", content: "" },
            { property: "og:description", content: "project" },
         ],
      };
   },
   data: () => ({

   }),
   computed: {
      layout() {
         return this.$route.meta.layout || "defaultLayout";
      },
   },
   mounted() {
      
   }
};
</script>

<style></style>
