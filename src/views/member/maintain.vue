<template src="./html/maintain.html"></template>

<script>
import { memberApi } from '@/api/member.js';
import zipCodeData from '@/assets/json/zipcode.json';
import { genderList, questionList } from '@/assets/json/registerData.json';
export default {
   name: 'maintain',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.maintain.title'),
      }
   },
   data: () => ({
      zipCodeData,
      isVerified: true,
      isLoading: false,
      popupOption: {
         isOpen: false,
         popupTitle: '請輸入會員密碼',
         message: '為了保護您的個人資料，請輸入會員密碼以進入會員資料維護。',
         inputType: 'password',
         eventName: 'verifyPw',
         placeholder: '請輸入會員密碼',
         validateRule: 'required|password',
      },
      user: {
         mobile: '',
         name: '',
         gender: '',
         birthday: '',
         city: '',
         district: '',
         address: '',
         security_question: '',
         security_answer: '',
      },
      genderList,
      questionList,
   }),
   computed: {
      cityList() {
         if (this.zipCodeData.length === 0) return [];
         return this.zipCodeData.map(item => item.name);
      },
      areaList() {
         let region = this.zipCodeData.find(item => item.name === this.user.city);
         if (region !== undefined) return region['districts'];
         else return [];
      }
   },
   methods: {
      async verifyPw(value) {
         this.isLoading = true;
         let { status, info } = await memberApi.verify_member_password({ password: value });
         if (status) {
            await this.getMemberPtofile();
            this.isVerified = true;
            this.popupOption.isOpen = false;
         } else {
            this.$refs.inputPopup.$refs.form.setErrors({ name: [info.rcrm.RM] });
         }
         this.isLoading = false;
      },
      async getMemberPtofile() {
         let { status, info } = await memberApi.get_member_profile();
         if (!status) return;
         let profile = info.results.member_profile;
         if (!('email' in profile)) profile.email = '';
         this.user = profile;
      },
      birthdayHandler() {

      },
      submitHandler() {

      }
   },
   mounted() {
      this.getMemberPtofile();
   }
}
</script>

<style lang="scss" scoped src="./scss/maintain.scss"></style>