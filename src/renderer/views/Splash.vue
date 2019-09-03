<template>
  <div class="container main">
    <div class="inner">
      <div class="visual_sb">
        <swiper
          :loop="true"
          page-transition="fade"
          :interval="5000"
          :autoplay="true"
          :show-indicator="false"
        >
          <swiper-item v-for="path in images" :key="path">
            <img :src="path" />
          </swiper-item>
        </swiper>
      </div>

      <div class="start">
        <router-link :to="{ name: 'menu' }" class="ui button">시작하기</router-link>
      </div>
      <div class="logo" @click="logout">
        <img src="@/assets/image/the_logo_w.png" />
      </div>

      <div class="wave-box">
        <div class="wave -one"></div>
        <div class="wave -two"></div>
        <div class="wave -three"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from 'vue-h5-swiper';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Splash',
  components: {
    Swiper,
    SwiperItem,
  },
  data() {
    return {
      images: [
        'http://admin.payot-coin.com/kiosk/sb01.png',
        'http://admin.payot-coin.com/kiosk/sb02.png',
        'http://admin.payot-coin.com/kiosk/sb03.png',
        'http://admin.payot-coin.com/kiosk/sb04.png',
        'http://admin.payot-coin.com/kiosk/sb05.png',
      ],
      clickCounter: 0,
    };
  },
  computed: {
    ...mapState(['company', 'options']),
  },
  methods: {
    ...mapMutations({ setCompany: 'SET_COMPANY' }),
    logout() {
      if (this.clickCounter !== 15) {
        this.clickCounter += 1;
        return;
      }

      console.log(this.company);
      const { email } = this.company;
      this.setCompany({ email });
      this.$router.push({ name: 'login' });
    },
  },
};
</script>