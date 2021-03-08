import { ref, reactive, onMounted } from '@vue/composition-api';
export const showPassword = function ({ root }) {
   let isReady = ref(false);
   let visibleInfo = reactive({});
   let initVisibleInfo = function () {
      document.querySelectorAll('[type=password]').forEach((item, index) => {
         root.$set(visibleInfo, index, { show: false, el: item });
         seeHandler(index, true);
      });
      isReady.value = true;
   };
   let seeHandler = function (key, isFirst = false) {
      let targetObj = visibleInfo[key];
      if (!isFirst) targetObj.show = !targetObj.show;
      targetObj.el.type = targetObj.show ? 'text' : 'password';
   };

   onMounted(() => {
      initVisibleInfo();
   });

   return { isReady, visibleInfo, seeHandler };
}