<template>
   <div class="stepWarp">
      <validation-observer tag="div" class="dataOuter" ref="form">
         <div class="dataBox">
            <p class="dataTitle">必填資料</p>
            <div class="dataBody">
               <validation-provider 
                  tag="div" 
                  class="dataRow" 
                  rules="required|phone"
                  v-slot="{ errors }">
                  <input
                     type="number" 
                     class="form-control"
                     placeholder="為您的帳號，共 10 碼" 
                     v-model.trim="user.mobile">
                  <p class="dataName">手機號碼</p>
                  <p class="errMsg" v-show="errors.length !== 0">{{ errors[0] }}</p>
               </validation-provider>
               <validation-provider 
                  tag="div" 
                  class="dataRow" 
                  rules="required|password"
                  vid="a"
                  v-slot="{ errors }">
                  <input
                     type="password" 
                     class="form-control pwInput"
                     placeholder="6 - 12 碼英數字"
                     ref="pwInput"
                     v-model.trim="user.password">
                  <p class="dataName">密碼</p>
                  <div 
                     class="visibleBox" @click="see1Handler"
                     :class="{ show: visible1, hide: !visible1 }"
                  ></div>
                  <p class="errMsg" v-show="errors.length !== 0">{{ errors[0] }}</p>
               </validation-provider>
               <validation-provider
                  tag="div" 
                  class="dataRow" 
                  rules="required|confirmPw:@a"
                  v-slot="{ errors }">
                  <input
                     type="password" 
                     class="form-control pwInput"
                     placeholder="6 - 12 碼英數字"
                     ref="confirmInput"
                     v-model.trim="user.confirmedPw">
                  <p class="dataName">密碼確認</p>
                  <div 
                     class="visibleBox" @click="see2Handler"
                     :class="{ show: visible2, hide: !visible2 }"
                  ></div>
                  <p class="errMsg" v-show="errors.length !== 0">{{ errors[0] }}</p>
               </validation-provider>
            </div>
         </div>
         <div class="dataBox">
            <div class="dataBody">
               <validation-provider 
                  tag="div" 
                  class="dataRow" 
                  rules="required"
                  v-slot="{ errors }">
                  <input
                     type="text" 
                     class="form-control"
                     placeholder="請輸入您的姓名" 
                     v-model.trim="user.name">
                  <p class="dataName">姓名</p>
                  <p class="errMsg" v-show="errors.length !== 0">{{ errors[0] }}</p>
               </validation-provider>
               <validation-provider 
                  tag="div" 
                  class="dataRow" 
                  rules="required"
                  v-slot="{ errors }">
                  <select 
                     class="form-control"
                     :class="{selectDown: user.gender === ''}"
                     v-model="user.gender">
                     <option value="" disabled></option>
                     <option 
                        v-for="item in genderList"
                        :key="item.value"
                        :value="item.value"
                     >{{ item.title }}</option>
                  </select>
                  <p class="dataName">性別</p>
                  <div class="downIcon" :class="{ hide: user.gender !== '' }"></div>
                  <p class="errMsg" v-show="errors.length !== 0">{{ errors[0] }}</p>
               </validation-provider>
            </div>
         </div>
         <div class="dataBox">
            <div class="dataBody">
               <validation-provider 
                  tag="div" 
                  class="dataRow" 
                  rules="required"
                  v-slot="{ errors }">
                  <select 
                     class="form-control eigthInput"
                     :class="{selectDown: user.security_question === ''}"
                     v-model="user.security_question">
                     <option value="" disabled></option>
                     <option 
                        v-for="item in questionList"
                        :key="item.value"
                        :value="item.value"
                     >{{ item.title }}</option>
                  </select>
                  <p class="dataName">忘記密碼安全問題</p>
                  <div class="downIcon" :class="{ hide: user.security_question !== '' }"></div>
                  <p class="errMsg" v-show="errors.length !== 0">{{ errors[0] }}</p>
               </validation-provider>
               <validation-provider 
                  tag="div" 
                  class="dataRow" 
                  rules="required"
                  v-slot="{ errors }">
                  <input
                     type="text" 
                     class="form-control sixInput"
                     placeholder="請輸入答案" 
                     v-model.trim="user.security_answer">
                  <p class="dataName">安全問題答案</p>
                  <p class="errMsg" v-show="errors.length !== 0">{{ errors[0] }}</p>
               </validation-provider>
            </div>
         </div>
		</validation-observer>

      <validation-observer tag="div" class="termOuter" ref="term">
         <p class="termTitle" v-show="termsList.length !== 0">其他</p>
         <div class="termContent">
            <TermRow
               v-for="term in termsList"
               :key="term.id"
               :termId="term.id"
               :termTitle="term.title"
               :termChecked="term.checked"
               @showContent="showTermContent"
            ></TermRow>
         </div>
      </validation-observer>

      <div class="btnBox">
			<button @click="submitHandler" class="variation">下一步</button>
		</div>
   </div>
</template>

<script>
import { termApi } from '@/api/term.js';
import TermRow from '@/components/TermRow/index.vue';
export default {
   name: 'register-1',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.register-1.title'),
      }
   },
   data: () => ({
      visible1: false,
      visible2: false,
      user: {
         mobile: '',
         password: '',
         confirmedPw: '',
         name: '',
         gender: '',
         security_question: '',
         security_answer: '',
      },
      genderList: [
         { title: '男性', value: 'M' },
         { title: '女性', value: 'F' },
         { title: '保密', value: 'S' },
      ],
      questionList: [
         { title: '您畢業的國小', value: 'sq01' },
         { title: '您最愛的寵物名字', value: 'sq02' },
         { title: '您最愛的食物', value: 'sq03' },
         { title: '您最好朋友的名字', value: 'sq04' },
         { title: '您最愛的電影', value: 'sq05' }
      ],
      termsList: [],
   }),
   methods: {
      see1Handler() {
         this.visible1 = !this.visible1;
      },
      see2Handler() {
         this.visible2 = !this.visible2;
      },
      setInputType({ status, el }) {
         el.type = status ? 'text' : 'password';
      },
      initInputType() {
         this.setInputType({ status: this.visible1, el: this.$refs.pwInput });
         this.setInputType({ status: this.visible2, el: this.$refs.confirmInput });
      },
      async getTermData() {
         return await termApi.brefTerm({ type: ['register']})
            .then(res => {
               let termInfo = res.info.results.term_information;
               return termInfo.length === 0 ? [] : termInfo[0].terms;
            }).catch(err => []);
      },
      convertTerms(data) { //條款資料轉換
         return data.reduce((prev, current, index) => {
            prev.push({ 
               ...current, 
               show: false, 
               checked: false
            });
            return prev;
         }, []);
      },
      showTermContent(id) {
         let obj = this.termsList.find(item => item.id === id);
         obj.show = true;
      },
      async submitHandler() {
         let isValid = await this.$refs.form.validate().then(res => res);
      },
   },
   async mounted() {
      this.initInputType();
      let termData = await this.getTermData();
      this.termsList = this.convertTerms(termData);
   },
   watch: {
      visible1(to) {
         this.setInputType({ status: to, el: this.$refs.pwInput });
      },
      visible2(to) {
         this.setInputType({ status: to, el: this.$refs.confirmInput });
      }
   },
   components: {
      TermRow
   }
}
</script>

<style lang="scss" src="./scss/step1.scss"></style>