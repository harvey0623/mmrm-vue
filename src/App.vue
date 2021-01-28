<template>
   <div id="app">
      <router-view></router-view>
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

   })
};
</script>

<style></style>
