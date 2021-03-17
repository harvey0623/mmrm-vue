<template>
   <div id="pointPicker"></div>
</template>

<script>
let mobileSelector = null;
export default {
   props: {

   },
   methods: {
      initPicker() {
         mobileSelector = new MobileSelect({
            trigger: '#pointPicker',
            title: '選兌換筆別',
            ensureBtnText: '確定',
            cancelBtnText: '取消',
            ensureBtnColor: '#288efb',
            titleColor: '#292929',
            textColor: '#292929',
            triggerDisplayData: false,
            wheels: [{
               data: [{ id: '', value: '' }]
            }],
            callback: (index, data) => {
               console.log(data);
            }
         });
      }
   },
   mounted() {
      this.initPicker();
   },
   watch: {

   }
}
</script>

<style>

</style>