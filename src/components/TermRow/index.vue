<template>
   <div class="termRow" @click="showHandler">
      <validation-provider tag="label" rules="term" v-slot="{ errors }">
         <input
            :class="{ checked: termChecked }"
            type="checkBox"
            v-model="termChecked"
            disabled>
         <span>{{ termTitle }}</span>
         <p class="errMsg" v-show="errors.length !== 0">
            {{ `請同意${termTitle}` }}
         </p>
      </validation-provider>
      <div class="leftIcon"></div>
   </div>
</template>

<script>
export default {
   props: {
      termId: {
         type: Number,
         required: true
      },
      termTitle: {
         type: String,
         required: true
      },
      termChecked: {
         type: Boolean,
         required: true
      },
   },
   methods: {
      showHandler() {
         this.$emit('showContent', this.termId);
      }
   }
};
</script>

<style></style>