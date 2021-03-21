import Vue from 'vue';
import Default from '@/components/Layout/Default.vue';
import Panel from '@/components/Layout/Panel.vue';
import Loading from '@/components/Loading/index.vue';
import MessagePopup from '@/components/Popup/MessagePopup.vue';
import InputPopup from '@/components/Popup/InputPopup.vue';
// import SlideUpDown from 'vue-slide-up-down';

Vue.component('Loading', Loading);
Vue.component('DefaultLayout', Default);
Vue.component('PanelLayout', Panel);
Vue.component('MessagePopup', MessagePopup);
Vue.component('InputPopup', InputPopup);
// Vue.component('SlideUpDown', SlideUpDown);