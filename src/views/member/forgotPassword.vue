<template src="./html/forgotPassword.html"></template>

<script>
import { ref, reactive } from '@vue/composition-api';
import { memberApi } from '@/api/member.js';
import { registerList } from '@/composition-api/registerList.js';
export default {
   name: 'forgotPassword',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.forgotPassword.title'),
      }
   },
   setup(props, { root }) {
      let { questionList } = registerList();
      let user = reactive({
         mobile: '',
         security_question: '',
         security_answer: ''
      });
      let msgOption = reactive({
         isOpen: false,
         message: '',
         eventName: 'forgotFeedBack',
      });
      let isLoading = ref(false);
      let forgotSuccess = ref(false);
      let form = ref(null);

      let submitHandler = async() => {
         let isValid = await form.value.validate().then(res => res);
         if (!isValid) return;
         isLoading.value = true;
         let { status, token } = await verifyHandler();
         if (status) root.$store.commit('auth/setPasswordToken', token);
         isLoading.value = false;
      }

      let verifyHandler = async() => {
         let { status, info } = await memberApi.forget_password(user);
         forgotSuccess.value = status;
         msgOption.message = status ? '填寫成功' : info.rcrm.RM;
         msgOption.isOpen = true;
         return { status, token: info.results.temp_access_token };
      }
      
      let forgotFeedBack = () => {
         if (forgotSuccess.value) root.$router.push('/member/verifyPassword')
         msgOption.isOpen = false;
      }

      return { questionList, user, isLoading, msgOption, form, submitHandler, verifyHandler, forgotFeedBack };
   }
}
</script>

<style></style>