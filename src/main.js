import '@/assets/scss/modules/index.scss';
import Vue from 'vue';
import App from './App.vue';
import router from './router/index.js';
import store from './store';
import i18n from '@/plugins/i18n/index.js';
import validator from "@/plugins/veeValidate/index.js";
import VueMeta from 'vue-meta';
import VueCompositionAPI from '@vue/composition-api';
import 'swiper/swiper-bundle.css';

//====global component
import '@/components/global/index.js';

//====filter
import '@/filter/index.js';

//====plugin
import '@/plugins/bootstrap/index.js';
import '@/plugins/storage/index.js';
import '@/plugins/cookie/index.js';


Vue.config.productionTip = false;
Vue.use(validator);
Vue.use(VueMeta);
Vue.use(VueCompositionAPI);

new Vue({
	router,
	store,
	i18n,
	render: h => h(App)
}).$mount('#app');