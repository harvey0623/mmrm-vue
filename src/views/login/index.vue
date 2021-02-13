<template src="./html/index.html"></template>

<script>
export default {
   name: 'login',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.login.title'),
      }
   },
   data: () => ({
      visible: false,
      user: {
         // account: '0999803025',
         // password: '1qaz2wsx',
         account: '0986104667',
         password: 'abc123',
      },
      msgOption: {
         isOpen: false,
         message: '',
         eventName: 'loginSure'
      },
      isLoading: false,
      loginSuccess: false
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
         let { status, info } = await this.$store.dispatch('auth/login', { ...this.user });
         this.loginSuccess = status;
         this.msgOption.message = status ? '登入成功' : info.rcrm.RM;
         this.msgOption.isOpen = true;
         this.isLoading = false;
      },
      loginHandler() {
         if (this.loginSuccess) this.$router.replace('/');
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

<style lang="scss" src="./index.scss" scoped></style>
