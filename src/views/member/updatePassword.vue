<template src="./html/updatePassword.html"></template>

<script>
import { memberApi } from '@/api/member.js';
export default {
   name: 'updatePassword',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.updatePassword.title'),
      }
   },
   data: () => ({
      visible1: false,
      visible2: false,
      visible3: false,
      oldInput: null,
      newInput: null,
      confirmInput: null,
      user: {
         old_password: 'abc123',
         new_password: 'abc456',
         confrimPw: 'abc456'
      },
      msgOption: {
         isOpen: false,
         message: '',
         eventName: 'updateFeedBack',
      },
      isLoading: false,
      updateSuccess: false
   }),
   methods: {
      seeHandler(key) {
         this[key] = !this[key];
      },
      setInputType({ status, el }) {
         el.type = status ? 'text' : 'password';
      },
      async submitHandler() {
         let isValid = await this.$refs.form.validate().then(res => res);
         if (!isValid) return;
         this.isLoading = true;
         await this.updateHandler();
         this.isLoading = false;
      },
      async updateHandler() {
         let { status, info } = await memberApi.update_member_password({
            old_password: this.user.old_password,
            new_password: this.user.new_password
         });
         this.updateSuccess = status;
         this.msgOption.isOpen = true;
         this.msgOption.message = status ? '更新密碼成功' : info.rcrm.RM;
      },
      updateFeedBack() {
         if (this.updateSuccess) this.$router.replace('/member/maintain');
         this.msgOption.isOpen = false;
      }
   },
   mounted() {
      this.oldInput = this.$refs.oldInput;
      this.newInput = this.$refs.newInput;
      this.confirmInput = this.$refs.confirmInput;
      this.setInputType({ status: this.visible1, el: this.oldInput });
      this.setInputType({ status: this.visible2, el: this.newInput });
      this.setInputType({ status: this.visible3, el: this.confirmInput });
   },
   watch: {
      visible1(to) {
         this.setInputType({ status: to, el: this.oldInput });
      },
      visible2(to) {
         this.setInputType({ status: to, el: this.newInput });
      },
      visible3(to) {
         this.setInputType({ status: to, el: this.confirmInput });
      }
   }
}
</script>

<style>

</style>