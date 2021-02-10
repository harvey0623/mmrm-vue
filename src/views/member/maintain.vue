<template src="./html/maintain.html"></template>

<script>
import { memberApi } from '@/api/member.js';
import { registerList } from '@/composition-api/registerList.js';
import { zipCode } from '@/composition-api/zipCode.js';
import { ref, reactive, onMounted } from '@vue/composition-api';
export default {
   name: 'maintain',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.maintain.title'),
      }
   },
   setup(props, { root }) {
      let { genderList, questionList } = registerList();
      let { resideInfo, cityList, districtList } = zipCode();
      let isLoading = ref(false);
      let isVerified = ref(true);
      let inputPopup = ref(null);
      let form = ref(null);
      let user = reactive({ data: {} });
      let popupOption = reactive({
         isOpen: false,
         popupTitle: '請輸入會員密碼',
         message: '為了保護您的個人資料，請輸入會員密碼以進入會員資料維護。',
         inputType: 'password',
         eventName: 'verifyPw',
         placeholder: '請輸入會員密碼',
         validateRule: 'required|password',
      });
      let msgOption = reactive({
         isOpen: false,
         popupTitle: '提示',
         message: '',
         eventName: 'updateFeedBack',
      });
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
         resideInfo.city = profile.city;
         await root.$nextTick();
         resideInfo.district = profile.district;
      }

      let birthdayHandler = () => {

      }

      let submitHandler = async() => {
         let isValid = await form.value.validate();
         if (!isValid) return;
         isLoading.value = true;
         await updateMemberProfile();
         isLoading.value = false;
      }

      let updateMemberProfile = async() => {
         let updateResult = await memberApi.update_member_profile({
            ...user.data,
            city: resideInfo.city,
            district: resideInfo.district
         });
         msgOption.isOpen = true;
         msgOption.message = updateResult.status ? '更新成功' : '更新失敗';
      }

      let updateFeedBack = () => {
         msgOption.isOpen = false;
      }

      onMounted(() => {
         getMemberPtofile();
      });

      return { genderList, questionList, isLoading, isVerified, popupOption, verifyPw, inputPopup, user, submitHandler, birthdayHandler, resideInfo, cityList, districtList, form, msgOption, updateFeedBack };
   },
}
</script>

<style lang="scss" scoped src="./scss/maintain.scss"></style>