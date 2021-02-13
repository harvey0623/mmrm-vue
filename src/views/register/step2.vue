<template src="./html/step2.html"></template>

<script>
import { ref, reactive, onMounted, computed, watch } from '@vue/composition-api';
import { zipCode } from '@/composition-api/zipCode.js';
export default {
   name: 'register2',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.register-2.title'),
      }
   },
   setup(props, { emit, root }) {
      let { resideInfo, cityList, districtList } = zipCode();
      let canRetrive = ref(false);
      let canNext = ref(false);
      let stepSuccess = ref(false);
      let form = ref(null);
      let user = reactive({
         data: {
            email: 'test@gmail.com',
            birthday: '2021-01-28',
            city: '',
            district: '',
            address: '中央路',
         }
      });
      let stepOption = reactive({
         isOpen: false,
         message: '',
         eventName: 'stepFeedBack',
      });

      let submitHandler = async() => {
         let isValid = await form.value.validate();
         if (!isValid) return;
         emit('checkSignup', (value) => canNext.value = value);
      }

      let registerHandler = async() => {
         emit('loading', true);
         let { status, info } = await root.$store.dispatch('auth/register', {
            ...user.data,
            birthday: user.data.birthday.replace(/-/g, '/'),
            city: resideInfo.city,
            district: resideInfo.district,
         });
         stepSuccess.value = status;
         stepOption.message = status ? '填寫成功' : info.rcrm.RM;
         stepOption.isOpen = true;
         emit('loading', false);
      }

      let stepFeedBack = async() => {
         if (stepSuccess.value) root.$router.push('/register/step3');
         canNext.value = false;
         stepOption.isOpen = false;
      }

      watch(canRetrive, async(val) => {
         if (val) {
            let stepData = await root.$store.dispatch('auth/getStepData', 'step2');
            if (stepData === undefined) return;
            user.data = stepData;
            user.data.birthday = stepData.birthday.replace(/\//g, '-');
            resideInfo.city = stepData.city;
            await root.$nextTick();
            resideInfo.district = stepData.district;
         }
      });

      watch(canNext, (val) => {
         if (val) registerHandler();
      });

      onMounted(() => {
         emit('checkSignup', (value) => canRetrive.value = value);
      });

      return { resideInfo, cityList, districtList, stepOption, user, submitHandler, form, stepFeedBack };
   }
}
</script>

<style></style>