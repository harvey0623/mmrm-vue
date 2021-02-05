<template src="./html/forgotPassword.html"></template>

<script>
import { memberApi } from '@/api/member.js';
export default {
   name: 'forgotPassword',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.forgotPassword.title'),
      }
   },
   data: () => ({
      user: {
         mobile: '0986104667',
         security_question: 'sq01',
         security_answer: 'aaa'
      },
      questionList: [
         { "title": "您畢業的國小", "value": "sq01" },
         { "title": "您最愛的寵物名字", "value": "sq02" },
         { "title": "您最愛的食物", "value": "sq03" },
         { "title": "您最好朋友的名字", "value": "sq04" },
         { "title": "您最愛的電影", "value": "sq05" }
      ],
      msgOption: {
         isOpen: false,
         message: '',
         eventName: 'forgotFeedBack',
      },
      isLoading: false,
      forgotSuccess: false
   }),
   methods: {
      async submitHandler() {
         let isValid = await this.$refs.form.validate().then(res => res);
         if (!isValid) return;
         this.isLoading = true;
         let { status, token } = await this.verifyHandler();
         if (status) this.$store.commit('auth/setPasswordToken', token);
         this.isLoading = false;
      },
      async verifyHandler() {
         let { status, info } = await memberApi.forget_password(this.user).then(res => res)
            .catch(err => err.response.data);
         this.forgotSuccess = status;
         this.msgOption.message = status ? '填寫成功' : info.rcrm.RM;
         this.msgOption.isOpen = true;
         return { status, token: info.results.temp_access_token };
      },
      forgotFeedBack() {
         if (this.forgotSuccess) this.$router.push('/member/verifyPassword')
         this.msgOption.isOpen = false;
      }
   }
}
</script>

<style>

</style>