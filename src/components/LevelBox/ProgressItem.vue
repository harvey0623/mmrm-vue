<template>
   <div class="progressItem">
      <div class="progressTop">
         <div class="title">{{ progressTitle }}</div>
         <div class="info">
            <span>{{ progressDesc }}</span>  
         </div>
      </div>
      <div class="progressBar">
         <div class="run" :class="{ complete: isComplete }" :style="size"></div>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      amount: {
         type: String,
         default: ''
      },
      requirement: {
         type: String,
         default: ''
      },
      type: {
         type: String,
         default: ''
      }
   },
   data: () => ({
      size: {
         width: '0%'
      }
   }),
   computed: {
      isAmount() {
         return this.type === 'amount';
      },
      progressTitle() {
         return this.isAmount ? '累計消費' : '消費次數';
      },
      progressDesc() {
         let unit = this.isAmount ? '$' : '次';
         let text = '';
         if (this.isAmount) text = `${unit}${this.amount} / ${unit}${this.requirement}`;
         else text = `${this.amount}${unit} / ${this.requirement}${unit}`;
         return text;
      },
      percent() {
         let current = this.cammaToNumber(this.amount);
         let total = this.cammaToNumber(this.requirement);
         return Math.floor((current / total) * 100);
      },
      isComplete() {
         return this.percent >= 100;
      }
   },
   methods: {
      cammaToNumber(num) {
         let result = num.replace(/,/g, '');
         result = result !== '' ? result : '0';
         return parseInt(result);
      }
   },
   mounted() {
      setTimeout(() => {
         this.size.width = `${this.percent}%`;
      }, 0);
   }
}
</script>

<style lang="scss" scoped>
   .progressItem {
      @include elGutter(margin-bottom, 25px);
   }
   .progressTop {
      @extend %bwtFlex;
      margin-bottom: 10px;
      color: map-get($fontColor, input);
   }
   .progressBar {
      position: relative;
      height: 7.5px;
      background-color: map-get($elBgColor, placeholder);
      border-radius: 100px;
   }
   .run {
      position: absolute;
      left: 0;
      top: 0;
      width: 0%;
      height: 100%;
      background-color: map-get($elBgColor, input);
      border-radius: 100px;
      transition: width 0.5s;
      &.complete {
         background-color: var(--variationMain);
      }
   }
</style>