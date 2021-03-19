<template>
   <div id="pointPicker"></div>
</template>

<script>
let mobileSelector = null;
export default {
   props: {
      pickerItem: {
         type: Object,
         required: true
      }
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
               data: this.pickerItem.data
            }],
            callback: (index, data) => {
               this.$emit('selectPoint', {
                  id: data[0].id,
                  category: data[0].category
               });
            }
         });
      }
   },
   mounted() {
      this.initPicker();
   },
   watch: {
      pickerItem: {
         deep: true,
         handler(val) {
            mobileSelector.updateWheel(0, val.data);
            mobileSelector.locatePosition(0, 0);
            mobileSelector.show();
         }
      }
   }
}
</script>

<style></style>