<template src="./html/maintain.html"></template>

<script>
import { memberApi } from '@/api/member.js';
export default {
   name: 'maintain',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.maintain.title'),
      }
   },
   data: () => ({
      isVerified: false,
      popupOption: {
         isOpen: true,
         popupTitle: '請輸入會員密碼',
         message: '為了保護您的個人資料，請輸入會員密碼以進入會員資料維護。',
         inputType: 'password',
         eventName: 'verifyPw',
         placeholder: '請輸入會員密碼',
         validateRule: 'required|password',
      },
      isLoading: false
   }),
   methods: {
      async verifyPw(value) {
         this.isLoading = true;
         let { status, info } = await memberApi.verify_member_password({ password: value });
         if (status) {
            this.isVerified = true;
         } else {
            this.$refs.inputPopup.$refs.form.setErrors({ name: [info.rcrm.RM] });
         }
         this.isLoading = false;
      }
   }
}
</script>

<style></style>