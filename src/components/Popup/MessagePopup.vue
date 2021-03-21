<template>
   <div class="mypopup" v-show="isOpen">
      <div class="popup-content">
         <div class="popup-header">
            <p>{{ popupTitle }}</p>
         </div>
         <div class="popup-body">
            <p>{{ message }}</p>
         </div>
         <div class="popup-footer">
            <div @click="confirmHandler">確定</div>
            <div v-show="showCancel" @click="closeHandler">取消</div>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      isOpen: {
         type: Boolean,
         default: false
      },
      showCancel: {
         type: Boolean,
         default: false
      },
      eventName: {
         type: String,
         required: true
      },
      popupTitle: {
         type: String,
         default: '提示'
      },
      message: {
         type: String,
         default: ''
      },
   },
   methods: {
      closeHandler() {
         this.$emit('update:isOpen', false);
      },
      confirmHandler() {
         this.$emit(this.eventName);
      }
   }
}
</script>

<style>

</style>