<template>
   <div class="termPopup" :class="{ show: showPopup }">
      <div class="termHeader">
         <div class="popupClose" @click="closeHandler"></div>
         <span>{{ termTitle }}</span>
      </div>
      <div class="termBody" ref="termBody">
         <div class="termContent" ref="termContent" v-html="termContent"></div>
      </div>
      <div
         class="termFooter" 
         :class="{termActiveButton: isReach}"
         @click="agreeHandler"
         >我已閱讀完並同意條款
      </div>
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
      termContent: {
         type: String,
         required: true
      },
      termChecked: {
         type: Boolean,
         required: true
      },
      showPopup: {
         type: Boolean,
         required: true
      },
   },
   data() {
      return {
         isReach: this.checked,
      }
   },
   methods: {
      closeHandler() {
         this.$emit('update:showPopup', false);
      },
      agreeHandler() {
         if (!this.isReach) return;
         this.$emit('agree', this.termId);
      },
      getDistance() {
         let $termBody = this.$refs.termBody;
         let styleObj = window.getComputedStyle($termBody);
         let paddingT = parseInt(styleObj.paddingTop);
			let paddingB = parseInt(styleObj.paddingBottom);
         let totalPadding = paddingT + paddingB;
         let termBodyView = $termBody.clientHeight - totalPadding;
			let termContentH = this.$refs.termContent.scrollHeight;
         return termContentH - termBodyView;
      },
      scrollHandler(evt) {
         let diff = this.getDistance();
         let scrollY = evt.target.scrollTop;
         if (scrollY >= diff) this.isReach = true;
      }
   },
   mounted() {
      this.$refs.termBody.addEventListener('scroll', this.scrollHandler);
   },
   beforeDestroy() {
      this.$refs.termBody.removeEventListener('scroll', this.scrollHandler);
   },
   watch: {
      showPopup() {
         if (this.isReach) return;
         let diff = this.getDistance();
         this.isReach = diff <= 0 ? true : false;
      }
   }
};
</script>

<style lang="scss" src="./index.scss" scoped></style>