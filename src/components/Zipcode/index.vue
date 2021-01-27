<template>
<div class="zipCodeBox">
   <select 
      class="form-control" 
      v-model="myCity">
      <option value="" disabled>縣市</option>
      <option 
         v-for="item in cityList" 
         :key="item.code" 
         :value="item.name"
      >{{ item.name }}</option>
   </select>
   <select 
      class="form-control"
      v-model="myDistrict">
      <option value="" disabled>區域</option>
      <option 
         v-for="item in districtList"
         :key="item.code" 
         :value="item.name"
      >{{ item.name }}</option>
   </select>
   <input 
      type="text" 
      class="form-control"
      placeholder="郵地區號"
      v-model="myCode">
   <input 
      type="text" 
      class="form-control" 
      v-model="myRoad" 
      placeholder="路名">
</div>
</template>

<script>
import zipCodeData from '@/assets/json/zipCode.json';
export default {
   props: {
      city: {
         type: String,
         required: true
      },
      district: {
         type: String,
         required: true
      },
      code: {
         type: String,
         required: true
      },
      road: {
         type: String,
         required: true
      },
      hideCode: {
         type: Boolean,
         default: true
      }
   },
   data() {
      return {
         zipCodeData,
         tempDistrict: this.district
      }
   },
   computed: {
      myCity: {
         get() {
            return this.city;
         },
         set(val) {
            this.$emit('update:city', val);
         }
      },
      myDistrict: {
         get() {
            return this.district;
         },
         set(val) {
            this.$emit('update:district', val);
         }
      },
      myCode: {
         get() {
            return this.code;
         },
         set(val) {
            if (!this.checkCode(val)) return;
            this.$emit('update:code', val);
         }
      },
      myRoad: {
         get() {
            return this.road;
         },
         set(val) {
            this.$emit('update:road', val);
         }
      },
      cityList() {
         return this.zipCodeData.map(item => ({ name: item.name, code: item.code }));
      },
      districtList() {
         if (this.myCity === '') return [];
         this.myDistrict = '';
         let targetObj = this.zipCodeData.find(item => item.name === this.myCity);
         if (targetObj !== undefined) {
            let arr = JSON.parse(JSON.stringify(targetObj.region));
            arr.sort((a, b) => a.name - b.name);
            if (this.tempDistrict !== '') {
               this.myDistrict = this.tempDistrict;
               this.tempDistrict = '';
            } else {
               this.myDistrict = arr[0].name;
            }
            return arr;
         } else {
            return [];
         }
      },
   },
   methods: {
      checkCode(code) {
         let isRight = false;
         for (let item of this.zipCodeData) {
            let obj = item.region.find(r => r.code === code);
            if (obj !== undefined) {
               this.myCity = item.name;
               this.myDistrict = obj.name;
               isRight = true;
               break;
            }
         }
         return isRight;
      }
   },
   watch: {
      myDistrict(val) {
         let targetObj = this.districtList.find(item => val === item.name);
         if (targetObj !== undefined) {
            this.myCode = targetObj.code;
         } else {
            this.myCode = '';
         }
      }
   }
}
</script>

<style lang="scss">
.zipCodeBox {
   display: flex;
   .zipRow {
      width: 180px;
      @include elGutter(margin-right, 10px);
      &.hide {
         display: none;
      }
   }
}
</style>