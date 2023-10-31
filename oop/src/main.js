import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import Notifications from '@kyvg/vue3-notification';
import velocity from 'velocity-animate';

import PrimeVue from "primevue/config";

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import "primevue/resources/primevue.min.css"; // PrimeVue styles
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
library.add(faChevronRight);
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'

stockInit(Highcharts)

createApp(App)
    .use(PrimeVue, {ripple: true, inputStyle: "filled"})
    .component('VueDatePicker', VueDatePicker)
    .use(store)
    .use(router)
    .use(Notifications, { velocity })
    .use(HighchartsVue)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app');
