<template src="./html/index.html"></template>

<script>
import { ref, reactive } from '@vue/composition-api';
import { showPassword } from '@/composition-api/showPassword.js';
export default {
   name: 'login',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.login.title'),
      }
   },
   setup(props, context) {
      let { isReady, visibleInfo, seeHandler } = showPassword(context);
      let { root } = context;
      let isLoading = ref(false);
      let loginSuccess = ref(false);
      let form = ref(null);
      let user = reactive({
         // account: '0999803025',
         // password: '1qaz2wsx',
         account: '0986104667',
         password: 'abc123',
      });
      let msgOption = reactive({
         isOpen: false,
         message: '',
         eventName: 'loginSure'
      });
      let submitHandler = async() => {
         let isValid = await form.value.validate();
         if (!isValid) return;
         isLoading.value = true;
         let { status, info } = await root.$store.dispatch('auth/login', { ...user });
         loginSuccess.value = status;
         msgOption.message = status ? '登入成功' : info.rcrm.RM;
         msgOption.isOpen = true;
         isLoading.value = false;
      }
      let loginHandler = () => {
         if (loginSuccess.value) root.$router.replace('/');
         msgOption.isOpen = false;
      };

      return { isReady, visibleInfo, seeHandler, user, msgOption, isLoading, loginSuccess, form, submitHandler, loginHandler };
   }
};
</script>

<style lang="scss" src="./index.scss" scoped></style>
