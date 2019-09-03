import 'semantic-ui-css/semantic.min.css';
import '@/assets/css/default.css';

import Vue from 'vue';
import axios from 'axios';
// import VueNumeral from 'vue-numeral-filter';
import VueSemantic from 'semantic-ui-vue';
import VueMoment from 'vue-moment';

import App from './App';
import router from './router';
import store from './store';


if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(VueMoment);
Vue.use(VueSemantic);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
