<template>
  <div class="container sub chage_main">
    <div class="inner">
      <div class="contents-wr">
        <div class="service_hd">
          <router-link :to="{ name: 'main' }" class="home_bt">
            <i class="ui home icon"></i>
          </router-link>
          <div class="text">포인트충전 방법 선택</div>
          <!-- <div class="time">15</div> -->
        </div>
        <!-- top_hd -->

        <div class="title">
          <h1>
            포인트 충전을 위한
            <b>결제방법을 선택해주세요</b>
          </h1>
        </div>

        <div class="credit_menu">
          <a
            @click="$router.push({ name: 'payDetail', params: { amount, method: 'cash' } })"
            href="#"
            class="coin"
            style="background:#fff url('image/coin.png')no-repeat top;"
          >
            <div class="cont">
              <strong>현금으로 충전</strong>
              <span v-show="options.cash !== 0">적립률 ({{ options.cash / 100 | numeral('0%') }})</span>
            </div>
          </a>
          <a
            @click="$router.push({ name: 'payDetail', params: { amount, method: 'card' } })"
            href="#"
            class="card"
            style="background:#fff url('./image/card.png')no-repeat top;"
          >
            <div class="cont">
              <strong>신용카드로 충전</strong>
              <span v-show="options.card !== 0">적립률 ({{ options.card / 100 | numeral('0%') }})</span>
            </div>
          </a>
        </div>

        <div class="logo">
          <img src="@/assets/image/the_logo_b.png" />
        </div>
      </div>
      <!-- contents -->

      <div class="wave-box-2">
        <div class="wave -one"></div>
        <div class="wave -two"></div>
        <div class="wave -three"></div>
      </div>
    </div>
    <!-- inner -->
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PayTypeSelect',
  props: ['amount'],
  computed: {
    ...mapState(['options']),
  },
};
</script>