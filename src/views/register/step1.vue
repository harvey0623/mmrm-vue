<template src="./html/step1.html"></template>

<script>
import { ref, reactive, onMounted, computed, watch } from '@vue/composition-api';
import { termApi } from '@/api/term.js';
import { registerList } from '@/composition-api/registerList.js';
import TermRow from '@/components/TermRow/index.vue';
import TermPopup from '@/components/TermPopup/index.vue';
export default {
   name: 'register-step-1',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.register-1.title'),
      }
   },
   setup(props, { emit, root }) {
      let { genderList, questionList } = registerList();
      let visible1 = ref(false);
      let visible2 = ref(false);
      let pwInput = ref(null);
      let confirmInput = ref(null);
      let form = ref(null);
      let term = ref(null);
      let termsList = reactive({ data: [] });
      let stepSuccess = ref(false);
      let user = reactive({
         mobile: '0986104667',
         password: 'abc123',
         confirmedPw: 'abc123',
         name: 'harvey',
         gender: 'M',
         security_question: 'sq01',
         security_answer: 'aaa',
      });
      let stepOption = reactive({
         isOpen: false,
         message: '',
         eventName: 'stepFeedBack',
      });
      let canRetrive = ref(false);
      let hasTerms = computed(() => { //是否有條款資料
         return termsList.data.length > 0;
      });
      let see1Handler = () => {
         visible1.value = !visible1.value;
      }
      let see2Handler = () => {
         visible2.value = !visible2.value;
      }
      let setInputType = ({ status, el }) => {
         el.type = status ? 'text' : 'password';
      }
      let initInputType = () => {
         setInputType({ status: visible1.value, el: pwInput.value });
         setInputType({ status: visible2.value, el: confirmInput.value });
      }
      let getTermData = async() => { //取得條款資料
         return await termApi.brefTerm({ type: ['register']}).then(res => {
            let termInfo = res.info.results.term_information;
            return termInfo.length === 0 ? [] : termInfo[0].terms;
         }).catch(err => []);
      }
      let convertTerms = (data) => { //條款資料轉換
         return data.reduce((prev, current) => {
            prev.push({ ...current, show: false, checked: true });
            return prev;
         }, []);
      }
      let showTermContent = (id) => { //顯示條款內容
         let obj = termsList.data.find(item => item.id === id);
         obj.show = true;
      }
      let agreeHandler = (id) => { //確認同意條款
         let obj = termsList.data.find(item => item.id === id);
         obj.checked = true;
         obj.show = false;
      }
      let submitHandler = async() => {
         let isFormValid = await form.value.validate();
         let isAgreeValid = await term.value.validate();
         if (!(isFormValid && isAgreeValid)) return;
         emit('loading', true);
         let { status, info } = await root.$store.dispatch('auth/register_step1', user);
         stepSuccess.value = status;
         stepOption.message = status ? '填寫成功' : info.rcrm.RM;
         stepOption.isOpen = true;
         emit('loading', false);
      }
      let stepFeedBack = () => {
         if (stepSuccess.value) root.$router.push('/register/step2');
         stepOption.isOpen = false;
      }

      watch(visible1, (val) => {
         setInputType({ status: val, el: pwInput.value });
      });

      watch(visible2, (val) => {
         setInputType({ status: val, el: confirmInput.value });
      });

      watch(canRetrive, async(val) => {
         if (val) {
            let step1Data = await root.$store.dispatch('auth/getStepData', 'step1');
            for (let key in step1Data) {
               user[key] = step1Data[key];
            }
            termsList.data.forEach(term => term.checked = true);
         }
      });

      onMounted(async() => {
         emit('loading', true);
         initInputType();
         let termData = await getTermData();
         termsList.data = convertTerms(termData);
         emit('checkSignup', (value) => canRetrive.value = value);
         emit('loading', false);
      });

      return { genderList, questionList, visible1, visible2, termsList, stepSuccess, user, stepOption, canRetrive, pwInput, confirmInput, see1Handler, see2Handler, hasTerms, showTermContent, agreeHandler, stepFeedBack, submitHandler, form, term };
   },
   components: {
      TermRow,
      TermPopup
   }
}
</script>

<style lang="scss" src="./scss/step1.scss" scoped></style>