<template>
   <div class="mypopup" v-show="isOpen">
      <div class="popup-content">
         <div class="popup-header">
            <p>{{ popupTitle }}</p>
         </div>
         <div class="popup-body">
            <p>{{ message }}</p>
            <validation-observer tag="div" class="validate-block" ref="form">
               <validation-provider 
                  tag="div" 
                  :rules="validateRule"
                  vid="name"
                  v-slot="{ errors }">
                  <input
                     :type="inputType"
                     class="form-control"
                     :placeholder="placeholder"
                     v-model.trim="inputValue"
                     v-focus="isOpen">
                  <p class="errMsg" v-show="errors.length !== 0">{{ errors[0] }}</p>
               </validation-provider>
            </validation-observer>
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
      popupTitle: {
         type: String,
         default: '提示'
      },
      message: {
         type: String,
         default: ''
      },
      inputType: {
         type: String,
         default: 'text'
      },
      placeholder: {
         type: String,
         default: ''
      },
      eventName: {
         type: String,
         required: true
      },
      validateRule: {
         type: String,
         default: ''
      }
   },
   directives: {
      focus: {
         update(el, binding) {
            if (binding.value) el.focus();
         }
      }
   },
   data: () => ({
      inputValue: '1qaz2wsx'
   }),
   methods: {
      closeHandler() {
         this.$emit('update:isOpen', false);
      },
      async confirmHandler() {
         let isValid = await this.$refs.form.validate();
         if (!isValid) return;
         this.$emit(this.eventName, this.inputValue);
      }
   },
   watch: {
      isOpen(val) {
         if (val) {
            this.inputValue = '';
            this.$refs.form.reset();
         }
      }
   }
}
</script>

<style lang="scss" scoped>
   .validate-block {
      margin-top: 15px;
      .form-control {
         height: 40px;
         border-radius: 5px;
      }
      .errMsg {
         text-align: left;
      }
   }
</style>