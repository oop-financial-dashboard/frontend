import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrimeVue from 'primevue/config';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
library.add(faChevronRight);

createApp(App)
    .use(PrimeVue, {ripple: true, inputStyle: "filled"})
    .use(store)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app');
