<template src="./html/step2.html"></template>

<script>
import zipCodeData from '@/assets/json/zipcode.json';
export default {
   data: () => ({
      zipCodeData,
      user: {
         email: 'test@gmail.com',
         birthday: '2021-01-28',
         city: '新北市',
         district: '土城區',
         address: '中央路'
      },
      stepOption: {
         isOpen: false,
         message: '',
         eventName: 'stepFeedBack',
      },
      canRetrive: false,
      canNext: false,
      stepSuccess: false,
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
      async submitHandler() {
         let isValid = await this.$refs.form.validate();
         if (!isValid) return;
         this.$emit('checkSignup', (value) => this.canNext = value);
      },
      async registerHandler() {
         this.$emit('loading', true);
         let { status:stepStatus } = await this.$store.dispatch('auth/register', this.user);
         this.stepSuccess = stepStatus;
         this.stepOption.message = stepStatus ? '填寫成功' : '欄位填寫有誤，請重新填寫';
         this.stepOption.isOpen = true;
         this.$emit('loading', false);
      },
      stepFeedBack() {
         if (this.stepSuccess) {
            this.$router.push('/');
         }
         this.stepOption.isOpen = false;
      }
   },
   mounted() {
      this.$emit('checkSignup', (value) => this.canRetrive = value);
   },
   watch: {
      async canRetrive(val) {
         if (val) {
            let stepData = await this.$store.dispatch('auth/getStepData', 'step2');
            if (stepData === undefined) return;
            this.user = stepData;
            this.user.birthday = this.user.birthday.replace(/\//g, '-');
         }
      },
      async canNext(val) {
         if (val) this.registerHandler();
      }
   }
}
</script>

<style></style>