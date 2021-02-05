<template src="./html/verifyPassword.html"></template>

<script>
import { memberApi } from '@/api/member.js';
export default {
   name: 'verifyPassword',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.verifyPassword.title'),
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
   computed: {
      passwordToken() {
         return this.$store.state.auth.passwordToken;
      },
      hasPasswordToken() {
         return this.passwordToken !== '';
      }
   },
   created() {
      if (!this.hasPasswordToken) this.$router.push('/member/forgotPassword');
   },
   methods: {
      async submitHandler() {
         let isValid = await this.$refs.form.validate().then(res => res);
         if (!isValid) return;
         this.isLoading = true;
         await this.verifyHandler();
         this.isLoading = false;
      },
      async verifyHandler() {
         let payload = {
            temp_access_token: this.passwordToken,
            verify_code: this.user.verify_code
         };
         let { status, info } = await memberApi.forget_password_verify(payload).then(res => res)
            .catch(err => err.response.data);
         this.verifySuccess = status;
         this.msgOption.message = status ? '驗證成功' : info.rcrm.RM;
         this.msgOption.isOpen = true;
      },
      verifyFeedBack() {
         if (this.verifySuccess) {
            this.$store.commit('auth/setPasswordToken', '');
            this.$router.push('/');
         }
         this.msgOption.isOpen = false;
      }
   }
}
</script>

<style>

</style>