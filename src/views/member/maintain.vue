<template src="./html/maintain.html"></template>

<script>
import { memberApi } from '@/api/member.js';
import { registerList } from '@/composition-api/registerList.js';
import zipCodeData from '@/assets/json/zipcode.json';
import { ref, reactive, onMounted } from '@vue/composition-api';
export default {
   name: 'maintain',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.maintain.title'),
      }
   },
   setup(props, context) {
      let { genderList, questionList } = registerList();
      let isLoading = ref(false);
      let isVerified = ref(false);
      let inputPopup = ref(null);
      let popupOption = reactive({
         isOpen: true,
         popupTitle: '請輸入會員密碼',
         message: '為了保護您的個人資料，請輸入會員密碼以進入會員資料維護。',
         inputType: 'password',
         eventName: 'verifyPw',
         placeholder: '請輸入會員密碼',
         validateRule: 'required|password',
      });
      let user = reactive({ data: {} });
      let verifyPw = async(value) => {
         isLoading.value = true;
         let { status, info } = await memberApi.verify_member_password({ password: value });
         if (status) {
            await getMemberPtofile();
            isVerified.value = true;
            popupOption.isOpen = false;
         } else {
            inputPopup.value.$refs.form.setErrors({ name: [info.rcrm.RM] });
         }
         isLoading.value = false;
      }
      let getMemberPtofile =  async() => {
         let { status, info } = await memberApi.get_member_profile();
         if (!status) return;
         let profile = info.results.member_profile;
         if (profile.email === undefined) profile.email = '';
         user.data = profile;
      }
      let birthdayHandler = () => {

      }
      let submitHandler = () => {

      }

      return { genderList, questionList, isLoading, isVerified, popupOption, verifyPw, inputPopup, user, submitHandler, birthdayHandler };
   },
   data: () => ({
      zipCodeData,
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
   }
}
</script>

<style lang="scss" scoped src="./scss/maintain.scss"></style>