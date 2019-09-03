import 'semantic-ui-css/semantic.min.css';
import '@/assets/css/default.css';

import Vue from 'vue';
import axios from 'axios';
// import VueNumeral from 'vue-numeral-filter';
import VueSemantic from 'semantic-ui-vue';
import VueMoment from 'vue-moment';
import { debounceTime, take, filter } from 'rxjs/operators';
import { CronJob } from 'cron';
import { networkStatusChange } from '@/module/network-state';
import ShutdownCommend from 'electron-shutdown-command';

import App from './App';
import router from './router';
import store from './store';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.prototype.$http = axios.create({
  baseURL: 'http://api.payot-coin.com/kiosk',
});

Vue.use(VueMoment);
Vue.use(VueSemantic);

// const disconnectTimer = 1000 * 60 * 10;
const disconnectTimer = 1000 * 10;
// 키오스크 구동 이후 네트워크 연결상태 변경시
networkStatusChange
  .pipe(
    // 네트워크 변경이 있고나서 10분 이후
    debounceTime(disconnectTimer),
    // 네트워크 연결이 종료된지 10분이 넘게되었을 때
    filter(value => !value),
    // 오프라인 상태가 10분이상 지속되었다면
    take(1),
  )
  .subscribe(() => {
    console.log('인터넷 연결이 중지되어 재부팅을 시도');
    ShutdownCommend.reboot();
  });

// 매일 오전 4시 재부팅
new CronJob(
  '0 4 * * *',
  () => {
    ShutdownCommend.reboot();
  },
  null,
  true,
  'Asia/Seoul',
).start();

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
