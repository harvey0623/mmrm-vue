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
               <router-link to="/">會員註冊</router-link>
            </div>
				<div>
               <router-link to="/">忘記密碼</router-link>
            </div>
			</div>
      </div>
   </div>
</template>

<script>
export default {
   data: () => ({
      visible: false,
      user: {
         account: "",
         password: "",
      },
   }),
   methods: {
      seeHandler() {
         this.visible = !this.visible;
      },
      setInputType() {
         let inputType = this.visible ? 'text' : 'password';
         this.$refs.pwInput.type = inputType;
      },
      async submitHandler() {
         let isValid = await this.$refs.form.validate().then((res) => res);
         if (!isValid) return;
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
