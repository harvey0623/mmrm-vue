<template src="./html/resetPassword.html"></template>

<script>
import { memberApi } from '@/api/member.js';
export default {
   name: 'restePassword',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.resetPassword.title'),
      }
   },
   data: () => ({
      visible1: false,
      visible2: false,
      pwInput: null,
      confirmInput: null,
      user: {
         new_password: 'abc123',
         confrimPw: 'abc123'
      },
      msgOption: {
         isOpen: false,
         message: '',
         eventName: 'resetFeedBack',
      },
      isLoading: false,
      resetSuccess: false
   }),
   computed: {
      passwordToken() {
         return this.$store.state.auth.passwordToken;
      },
      hasPasswordToken() {
         return this.passwordToken !== '';
      }
   },
   methods: {
      see1Handler() {
         this.visible1 = !this.visible1;
      },
      see2Handler() {
         this.visible2 = !this.visible2;
      },
      setInputType({ status, el }) {
         el.type = status ? 'text' : 'password';
      },
      async submitHandler() {
         let isValid = await this.$refs.form.validate().then(res => res);
         if (!isValid) return;
         this.isLoading = true;
         await this.resetHandler();
         this.isLoading = false;
      },
      async resetHandler() {
         let { status, info } = await memberApi.reset_password({
            temp_access_token: this.$store.state.auth.passwordToken,
            new_password: this.user.new_password
         });
         this.resetSuccess = status;
         this.msgOption.isOpen = true;
         this.msgOption.message = status ? '修改密碼成功' : info.rcrm.RM;
      },
      resetFeedBack() {
         if (this.resetSuccess) {
            this.$store.commit('auth/setPasswordToken', '');
            this.$router.replace('/login');
         }
         this.msgOption.isOpen = false;
      }
   },
   created() {
      if (!this.hasPasswordToken) this.$router.push('/member/forgotPassword');
   },
   mounted() {
      this.pwInput = this.$refs.pwInput;
      this.confirmInput = this.$refs.confirmInput;
      this.setInputType({ status: this.visible1, el: this.pwInput });
      this.setInputType({ status: this.visible2, el: this.confirmInput });
   },
   watch: {
      visible1(to) {
         this.setInputType({ status: to, el: this.pwInput });
      },
      visible2(to) {
         this.setInputType({ status: to, el: this.confirmInput });
      }
   }
}
</script>

<style>

</style>