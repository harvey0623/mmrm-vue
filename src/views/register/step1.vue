<template src="./html/step1.html"></template>

<script>
import { termApi } from '@/api/term.js';
import TermRow from '@/components/TermRow/index.vue';
import TermPopup from '@/components/TermPopup/index.vue';
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
      termsList: [],
      stepSuccess: false,
      user: {
         mobile: '0986104667',
         password: 'abc123',
         confirmedPw: 'abc123',
         name: 'harvey',
         gender: 'M',
         security_question: 'sq01',
         security_answer: 'aaa',
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
      stepOption: {
         isOpen: false,
         message: '欄位填寫有誤，請重新填寫',
         eventName: 'stepFeedBack',
      },
      canRetrive: false,
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
      async getTermData() { //取得條款資料
         return await termApi.brefTerm({ type: ['register']})
            .then(res => {
               let termInfo = res.info.results.term_information;
               return termInfo.length === 0 ? [] : termInfo[0].terms;
            }).catch(err => []);
      },
      convertTerms(data) { //條款資料轉換
         return data.reduce((prev, current, index) => {
            prev.push({ ...current, show: false, checked: true });
            return prev;
         }, []);
      },
      showTermContent(id) {
         let obj = this.termsList.find(item => item.id === id);
         obj.show = true;
      },
      agreeHandler(id) {
         let obj = this.termsList.find(item => item.id === id);
         obj.checked = true;
         obj.show = false;
      },
      async submitHandler() {
         let isFormValid = await this.$refs.form.validate();
         let isAgreeValid = await this.$refs.term.validate();
         if (!(isFormValid && isAgreeValid)) return;
         this.$emit('loading', true);
         let { status:stepStatus } = await this.$store.dispatch('auth/register_step1', this.user);
         this.stepSuccess = stepStatus;
         this.stepOption.message = stepStatus ? '填寫成功' : '欄位填寫有誤，請重新填寫';
         this.stepOption.isOpen = true;
         this.$emit('loading', false);
      },
      stepFeedBack() {
         if (this.stepSuccess) this.$router.push('/register/step2');
         this.stepOption.isOpen = false;
      }
   },
   async mounted() {
      this.$emit('loading', true);
      this.initInputType();
      let termData = await this.getTermData();
      this.termsList = this.convertTerms(termData);
      this.$emit('checkSignup', (value) => this.canRetrive = value);
      this.$emit('loading', false);
   },
   watch: {
      visible1(to) {
         this.setInputType({ status: to, el: this.$refs.pwInput });
      },
      visible2(to) {
         this.setInputType({ status: to, el: this.$refs.confirmInput });
      },
      async canRetrive(val) {
         if (val) {
            this.user = await this.$store.dispatch('auth/getStepData', 'step1');
            this.termsList.forEach(term => term.checked = true);
         }
      }
   },
   components: {
      TermRow,
      TermPopup
   }
}
</script>

<style lang="scss" src="./scss/step1.scss" scoped></style>