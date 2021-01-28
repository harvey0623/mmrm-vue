import Vue from 'vue';
import Default from '@/components/Layout/Default.vue';
import Loading from '@/components/Loading/index.vue';
import SlideUpDown from 'vue-slide-up-down';
import Messagepopup from '@/components/Popup/MessagePopup.vue';


Vue.component('Loading', Loading);
Vue.component('MessagePopup', Messagepopup);

// Vue.component('defaultLayout', Default);
// Vue.component('SlideUpDown', SlideUpDown);