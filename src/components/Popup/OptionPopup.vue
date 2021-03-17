<template>
   <div class="mypopup optionPopup">
      <div class="popup-content">
         <div class="popup-header">請選擇票券</div>
         <div class="popup-body">
            <div
					class="couponItem" >
					<a href="javascript:;">{{ 'hello' }}</a>
				</div>
         </div>
         <div class="popup-footer">取消</div>
      </div>   
   </div>
</template>

<script>
export default {
   props: {
      isOpen: {
         type: Boolean,
         default: false
      }
   },
   computed: {

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
            height: map-get($heightObj, basic);
            line-height: map-get($heightObj, basic);
            border-bottom: 1px solid $borderColor;
            text-align: center;
            >a {
               color: map-get($fontColor, modalCancel);
            }
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