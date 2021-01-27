import Vue from 'vue';
import { currency } from './currency.js';
import { hideText } from './hideText.js';

Vue.filter('currency', currency);
Vue.filter('hideText', hideText);
