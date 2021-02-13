import { reactive } from '@vue/composition-api';
export const registerList = function () {
   let genderList = reactive([
      { title: "男性", value: "M" },
      { title: "女性", value: "F" },
      { title: "保密", value: "S" }
   ]);
   let questionList = reactive([
      { title: "您畢業的國小", value: "sq01" },
      { title: "您最愛的寵物名字", value: "sq02" },
      { title: "您最愛的食物", value: "sq03" },
      { title: "您最好朋友的名字", value: "sq04" },
      { title: "您最愛的電影", value: "sq05" }
   ]);
   return { genderList, questionList };
}