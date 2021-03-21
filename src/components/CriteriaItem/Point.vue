<template>
   <li>
      <label>
         <div class="criteriaTitle">
            <span>{{ title }}</span>
         </div>
         <input 
            type="checkbox"
            class="hookCheckbox"
            v-model="checkedStatus">
      </label>
   </li>
</template>

<script>
import { computed } from '@vue/composition-api';
export default {
   props: {
      itemId: {
         type: [Number, String],
         required: true
      },
      title: {
         type: String,
         required: true
      },
      checked: {
         type: Boolean,
         required: true
      },
      category: {
         type: String,
         required: true
      }
   },
   setup(props, { emit }) {
      let checkedStatus = computed({
         get() {
            return props.checked;
         },
         set(val) {
            emit('status', { 
               id: props.itemId,
               category: props.category,
               status: val
            });
         }
      });

      return { checkedStatus }
   }
}
</script>

<style>

</style>