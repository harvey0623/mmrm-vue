<template src="./html/verifyPassword.html"></template>

<script>
import { memberApi } from '@/api/member.js';
export default {
   name: 'verifyPassword',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.memberVerify.title'),
      }
   },
   data: () => ({
      user: {
         verify_code: '999999',
      },
      msgOption: {
         isOpen: false,
         message: '',
         eventName: 'verifyFeedBack',
      },
      isLoading: false,
      verifySuccess: false
   }),
   methods: {
      async submitHandler() {
         let isValid = await this.$refs.form.validate().then(res => res);
         if (!isValid) return;
         this.isLoading = true;
         await this.verifyHandler();
         this.isLoading = false;
      },
      async verifyHandler() {
         let { status, info } = await memberApi.member_verify({
            verify_code: this.user.verify_code
         });
         this.verifySuccess = status;
         this.msgOption.message = status ? '驗證成功' : info.rcrm.RM;
         this.msgOption.isOpen = true;
      },
      verifyFeedBack() {
         if (this.verifySuccess) this.$router.replace('/member/maintain');
         this.msgOption.isOpen = false;
      }
   }
}
</script>

<style>

</style>