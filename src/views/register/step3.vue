<template src="./html/step3.html"></template>

<script>
export default {
   name: 'register3',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.register-3.title'),
      }
   },
   data: () => ({
      user: {
         verify_code: '1234', //正確代碼999999
      },
      stepOption: {
         isOpen: false,
         message: '',
         eventName: 'stepFeedBack',
      },
      canNext: false,
      stepSuccess: false,
   }),
   methods: {
      async submitHandler() {
         let isValid = await this.$refs.form.validate().then(res => res);
         if (!isValid) return;
         this.$emit('checkSignup', (value) => this.canNext = value);
      },
      async verifyHandler() {
         this.$emit('loading', true);
         let { status, info } = await this.$store.dispatch('auth/registerVerify', this.user);
         this.stepSuccess = status;
         this.stepOption.message = status ? '驗證成功' : info.rcrm.RM;
         this.stepOption.isOpen = true;
         this.$emit('loading', false);
      },
      stepFeedBack() {
         if (this.stepSuccess) this.$router.replace('/login');
         this.canNext = false;
         this.stepOption.isOpen = false;
      }
   },
   mounted() {
      this.$emit('checkSignup', (value) => () => {});
   },
   watch: {
      async canNext(val) {
         if (val) this.verifyHandler();
      }
   }
}
</script>

<style></style>