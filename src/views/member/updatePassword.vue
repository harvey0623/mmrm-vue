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
      visibleInfo: {
         0: { show: false, el: null },
         1: { show: false, el: null },
         2: { show: false, el: null }
      },
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
      seeHandler(key, isFirst = false) {
         let targetObj = this.visibleInfo[key];
         if (!isFirst) targetObj.show = !targetObj.show;
         targetObj.el.type = targetObj.show ? 'text' : 'password';
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
      document.querySelectorAll('input').forEach((item, index) => {
         let targetObj = this.visibleInfo[index];
         targetObj.el = item;
         this.seeHandler(index, true);
      });
   }
}
</script>

<style></style>