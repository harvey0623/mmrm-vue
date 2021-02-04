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
      }
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
         this.$emit('loading', true);
         await this.$store.dispatch('auth/register', this.user);
         this.$emit('loading', false);
      },
   },
   async mounted() {
   
   }
}
</script>

<style></style>