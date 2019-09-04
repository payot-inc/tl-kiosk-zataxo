import Vue from 'vue';
import Router from 'vue-router';
import { isEmpty } from 'lodash';

import store from '@/store';
import Login from '@/views/Login.vue';
import Splash from '@/views/Splash.vue';
import Menu from '@/views/Menu.vue';

import TutorialMenu from '@/views/TutorialMenu.vue';
import Tutorial from '@/views/Tutorial.vue';

import UserLogin from '@/views/UserLogin.vue';
import Info from '@/views/Infomation.vue';

import AmountSelect from '@/views/AmountSelect.vue';
import PayTypeSelect from '@/views/PayTypeSelect.vue';
import PayDetail from '@/views/PayDetail.vue';

import ProductSelect from '@/views/ProductSelect.vue';
import UseDetail from '@/views/UseDetail.vue';

import Finish from '@/views/Finish.vue';

Vue.use(Router);

const companyLoginValide = (to, from, next) => {
  if (isEmpty(store.state.kiosk.company.name)) {
    next({ name: 'login' });
  } else {
    next();
  }
};

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Splash,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },

    // 메인
    {
      path: '/menu',
      name: 'menu',
      component: Menu,
    },
    {
      path: '/tutorial-menu',
      name: 'tutorial-menu',
      component: TutorialMenu,
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: Tutorial,
      props: true,
    },

    // 사용자 로그인
    {
      path: '/user-login',
      name: 'user-login',
      component: UserLogin,
      props: true,
    },
    {
      path: '/info',
      name: 'info',
      component: Info,
      props: true,
    },

    // 결제
    {
      path: '/amount-select',
      name: 'amountSelect',
      component: AmountSelect,
    },
    {
      path: '/pay-type-select',
      name: 'payTypeSelect',
      component: PayTypeSelect,
      props: true,
    },
    {
      path: '/pay-detail',
      name: 'payDetail',
      component: PayDetail,
      props: true,
    },

    // 사용
    {
      path: '/products',
      name: 'products',
      component: ProductSelect,
    },
    {
      path: '/use-detail',
      name: 'useDetail',
      component: UseDetail,
      props: true,
    },

    {
      path: '/finish',
      name: 'finish',
      component: Finish,
      props: true,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
