<template>
  <div id="app">
    <status-bar />
    <div id="wrap">
      <router-view />
    </div>

    <sui-modal v-model="network.open" size="basic" :closable="false">
      <div class="cont basic">
        <span class="text" style="font-size: 50px">
          <label style="color: red;">네트워크 오류</label>
          로 인한
          <br />
          <br />
          <label style="color: green;">포인트충전</label> 및
          <label style="color: green;">사용하기</label>를
          <br />
          <br />이용하실 수 없습니다.
        </span>
      </div>
    </sui-modal>
  </div>
</template>

<script>
import StatusBar from '@/components/StatusBar.vue';
import { filter } from 'rxjs/operators';

export default {
  components: {
    StatusBar,
  },
  data() {
    return {
      network: {
        open: false,
      },
    };
  },
  mounted() {
    const self = this;
    this.$networkStatus.pipe().subscribe((status) => {
      if (self.$route.name === 'login') return;

      self.network.open = !status;
      if (!status) {
        self.$router.push({ name: 'main' });
      }
    });
  },
  // onIdle() {
  //   const routeName = this.$router.name;
  //   if (!['login', 'main'].includes(routeName)) {
  //     this.$router.push({ name: 'main' });
  //   }
  // },
};
</script>
