<template src="./html/updatePassword.html"></template>

<script>
import { ref, reactive } from '@vue/composition-api';
import { memberApi } from '@/api/member.js';
import { showPassword } from '@/composition-api/showPassword.js';
export default {
   name: 'updatePassword',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.updatePassword.title'),
      }
   },
   setup(props, context) {
      let { isReady, visibleInfo, seeHandler } = showPassword(context);
      let { root } = context;
      let isLoading =  ref(false);
      let updateSuccess =  ref(false);
      let form = ref(null);
      let user = reactive({
         old_password: 'abc123',
         new_password: 'abc123',
         confrimPw: 'abc123'
      });
      let msgOption = reactive({
         isOpen: false,
         message: '',
         eventName: 'updateFeedBack',
      });
      let submitHandler = async() => {
         let isValid = await form.value.validate();
         if (!isValid) return;
         isLoading.value = true;
         await updateHandler();
         isLoading.value = false;
      };
      let updateHandler = async() => {
         let { status, info } = await memberApi.update_member_password({
            old_password: user.old_password,
            new_password: user.new_password
         });
         updateSuccess.value = status;
         msgOption.isOpen = true;
         msgOption.message = status ? '更新密碼成功' : info.rcrm.RM;
      };
      let updateFeedBack = async() => {
         if (updateSuccess.value) root.$router.replace('/member/maintain');
         msgOption.isOpen = false;
      }

      return { isReady, visibleInfo, seeHandler, user, msgOption, isLoading, updateSuccess, form, submitHandler, updateFeedBack };
   }
}
</script>

<style></style>