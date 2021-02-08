import Vue from 'vue';
import Default from '@/components/Layout/Default.vue';
import Loading from '@/components/Loading/index.vue';
import SlideUpDown from 'vue-slide-up-down';
import MessagePopup from '@/components/Popup/MessagePopup.vue';
import InputPopup from '@/components/Popup/InputPopup.vue';


Vue.component('Loading', Loading);
Vue.component('MessagePopup', MessagePopup);
Vue.component('InputPopup', InputPopup);

// Vue.component('defaultLayout', Default);
// Vue.component('SlideUpDown', SlideUpDown);