import Vue from 'vue';
import Default from '@/components/Layout/Default.vue';
import Loading from '@/components/Loading/index.vue';
import SlideUpDown from 'vue-slide-up-down';

Vue.component('defaultLayout', Default);
Vue.component('Loading', Loading);
Vue.component('SlideUpDown', SlideUpDown);