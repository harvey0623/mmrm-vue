<template>
   <div class="mypopup optionPopup" v-show="isOpen">
      <div class="popup-content">
         <div class="popup-header">{{ popupTitle }}</div>
         <div class="popup-body">
            <slot></slot>
         </div>
         <div class="popup-footer" @click="closeHandler">取消</div>
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
      popupTitle: {
         type: String,
         default: ''
      }
   },
   methods: {
      closeHandler() {
         this.$emit('update:isOpen', false);
      }
   }
}
</script>

<style lang="scss" socped>
   $borderColor: map-get($borderColor, placeholder);
   .optionPopup {
      .popup-header {
         padding-bottom: 15px;
         border-bottom: 1px solid $borderColor;
      }
      .popup-body {
         padding: 0;
         .couponItem {
            display: block;
            height: map-get($heightObj, basic);
            line-height: map-get($heightObj, basic);
            color: map-get($fontColor, modalCancel);
            border-bottom: 1px solid $borderColor;
            text-align: center;
         }
      }
      .popup-footer {
         justify-content: center;
         align-items: center;
         padding: 15px;
         border-top: none;
      }
   }
</style>