<template>
   <div class="login">
      <div class="mycontainer">
         <div id="logoBox">
            <img :src="require('@/assets/img/page/img_common_form_logo_n@3x.png')">
         </div>
         <validation-observer tag="div" class="formLayout" ref="form">
            <div class="formRow">
               <p class="formTitle">帳號</p>
               <validation-provider
                  tag="div"
                  class="formContent"
                  rules="required|phone"
                  v-slot="{ errors }">
                  <input
                     type="number"
                     class="form-control"
                     placeholder="為您的手機號碼"
                     maxlength="10"
                     v-model.trim="user.account"/>
                  <p class="errMsg" v-show="errors.length !== 0">{{ errors[0] }}</p>
               </validation-provider>
            </div>
            <div class="formRow">
               <p class="formTitle">密碼</p>
               <validation-provider
                  tag="div"
                  class="formContent"
                  rules="required|password"
                  v-slot="{ errors }">
                  <input
                     type="password"
                     class="form-control pwInput"
                     placeholder="6 - 12 碼英數字"
                     maxLength="12"
                     ref="pwInput"
                     v-model.trim="user.password"/>
                  <div
                     class="visibleBox"
                     :class="{ show: visible, hide: !visible }"
                     @click="seeHandler">
                  </div>
                  <p class="errMsg" v-show="errors.length !== 0">{{ errors[0] }}</p>
               </validation-provider>
            </div>
         </validation-observer>
         <div class="btnBox login">
				<button @click="submitHandler" class="variation">登入</button>
			</div>
         <div class="linkBox">
				<div>
               <router-link to="/register">會員註冊</router-link>
            </div>
				<div>
               <router-link to="/member/forgotPassword">忘記密碼</router-link>
            </div>
			</div>
      </div>

      <Loading v-show="isLoading"></Loading>

      <MessagePopup
         :isOpen.sync="openLoginPopup"
         :message="loginMsg"
         :eventName="'loginSure'"
         @loginSure="loginHandler"
      ></MessagePopup>

   </div>
</template>

<script>
export default {
   name: 'login',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.login.title'),
      }
   },
   data: () => ({
      visible: false,
      user: {
         account: '0999803025',
         password: '1qaz2wsx',
      },
      isLoading: false,
      openLoginPopup: false,
      successLogin: false,
      loginMsg: ''
   }),
   methods: {
      seeHandler() {
         this.visible = !this.visible;
      },
      setInputType() {
         let inputType = this.visible ? 'text' : 'password';
         this.$refs.pwInput.type = inputType;
      },
      loginHandler() {
         if (this.successLogin) this.$router.replace('/');
         else this.openLoginPopup = false;
      },
      async submitHandler() {
         let isValid = await this.$refs.form.validate();
         if (!isValid) return;
         this.isLoading = true;
         let { status, info } = await this.$store.dispatch('auth/login', { ...this.user });
         this.successLogin = status;
         this.loginMsg = status ? '登入成功' : info.rcrm.RM;
         this.openLoginPopup = true;
         this.isLoading = false;
      },
   },
   mounted() {
      this.setInputType();
   },
   watch: {
      visible() {
         this.setInputType();
      }
   }
};
</script>

<style lang="scss" src="./index.scss" scoped></style>
