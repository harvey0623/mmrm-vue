<template src="./html/fixMobile.html"></template>

<script>
import { memberApi } from '@/api/member.js';
export default {
   name: 'fixPassword',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.fixPassword.title'),
      }
   },
   data: () => ({
      visible: false,
      user: {
         mobile: '',
         password: '',
      },
      msgOption: {
         isOpen: false,
         message: '',
         eventName: 'fix'
      },
      isLoading: false,
      fixSuccess: false
   }),
   methods: {
      seeHandler() {
         this.visible = !this.visible;
      },
      setInputType() {
         let inputType = this.visible ? 'text' : 'password';
         this.$refs.pwInput.type = inputType;
      },
      async submitHandler() {
         let isValid = await this.$refs.form.validate();
         if (!isValid) return;
         this.isLoading = true;
         let { status, info } = await memberApi.update_member_mobile(this.user);
         this.fixSuccess = status;
         this.msgOption.message = status ? '修改成功' : info.rcrm.RM;
         this.msgOption.isOpen = true;
         this.isLoading = false;
      },
      fixHandler() {
         if (this.fixSuccess) this.$router.push('/member/memberVerify');
         this.msgOption.isOpen = false;
      },
   },
   mounted() {
      this.setInputType();
   },
   watch: {
      visible() {
         this.setInputType();
      }
   }
};
</script>

<style lang="scss" scoped>
   .mycontainer {
      padding-top: 0;
   }
   .btnBox.login {
      margin-bottom: map-get($gutter, double);
   }
</style>
