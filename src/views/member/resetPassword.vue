<template src="./html/resetPassword.html"></template>

<script>
import { memberApi } from '@/api/member.js';
import { ref, reactive, computed, onMounted } from '@vue/composition-api';
import { showPassword } from '@/composition-api/showPassword.js';
export default {
   name: 'restePassword',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.resetPassword.title'),
      }
   },
   setup(props, context) {
      let { isReady, visibleInfo, seeHandler } = showPassword(context);
      let { root } = context;
      let pwInput = ref(null);
      let confirmInput = ref(null);
      let form = ref(null);
      let isLoading = ref(false);
      let resetSuccess = ref(false);
      let user = reactive({
         new_password: 'abc123',
         confrimPw: 'abc123'
      });
      let msgOption = reactive({
         isOpen: false,
         message: '',
         eventName: 'resetFeedBack',
      });
      let passwordToken = computed(() => {
         return root.$store.state.auth.passwordToken;
      });
      let hasPasswordToken = computed(() => {
         return passwordToken.value !== '';
      });
      let submitHandler = async() => {
         let isValid = await form.value.validate();
         if (!isValid) return;
         isLoading.value = true;
         await resetHandler();
         isLoading.value = false;
      }
      let resetHandler = async() => {
         let { status, info } = await memberApi.reset_password({
            temp_access_token: passwordToken.value,
            new_password: user.new_password
         });
         resetSuccess.value = status;
         msgOption.isOpen = true;
         msgOption.message = status ? '修改密碼成功' : info.rcrm.RM;
      }
      let resetFeedBack = () => {
         if (resetSuccess.value) {
            root.$store.commit('auth/setPasswordToken', '');
            root.$router.replace('/login');
         }
         msgOption.isOpen = false;
      }

      onMounted(() => {
         if (!hasPasswordToken.value) root.$router.push('/member/forgotPassword');
      });

      return { isReady, visibleInfo, seeHandler, pwInput, confirmInput, form, isLoading, resetSuccess, user, msgOption, submitHandler, resetFeedBack };
   }
}
</script>

<style></style>