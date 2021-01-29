<template>
   <div class="termRow" @click="showHandler">
      <validation-provider tag="label" rules="term" v-slot="{ errors }">
         <input
            :class="{ checked: termChecked }"
            type="checkBox"
            v-model="termChecked"
            disabled>
         <span>{{ termTitle }}</span>
         <p class="errMsg" v-show="errors.length !== 0">
            {{ `請同意${termTitle}` }}
         </p>
      </validation-provider>
      <div class="leftIcon"></div>
   </div>
</template>

<script>
export default {
   props: {
      termId: {
         type: Number,
         required: true
      },
      termTitle: {
         type: String,
         required: true
      },
      termChecked: {
         type: Boolean,
         required: true
      },
   },
   methods: {
      showHandler() {
         this.$emit('showContent', this.termId);
      }
   }
};
</script>

<style lang="scss" scoped>
   .termRow {
      @extend %bwtFlex;
      padding: 15px;
      margin-bottom: map-get($gutter, basic);
      border-radius: map-get($radius, basic);
      background-color: #fff;
      >label {
         input {
            @extend %resetForm;
            @include size(15px);
            @extend %bgImgCenter;
            vertical-align: middle;
            transform: translateY(-1px);
            border: none;
            background-image: url("~@/assets/img/page/btn_listcore_checkmark_n_n@2x.png");
            &.checked {
               background-image: url("~@/assets/img/page/btn_listcore_checkmark_n_h@2x.png");
            }
         }
         >span {
            margin-left: 7.5px;
            color: map-get($fontColor, input);
         }
         >.errMsg {
            padding-left: 26px;
            text-align: left;
         }
      }
      >.leftIcon {
         @include size(15px);
         background-image: url("~@/assets/img/page/btn_listcore_indicatorright_std_n@2x.png");
         @extend %bgImgCenter;
         cursor: pointer;
      }
   }
</style>