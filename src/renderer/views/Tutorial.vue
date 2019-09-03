<template>
  <div class="container sub guide_contents">
    <div class="guide_hd">
      <div class="in">
        <div class="guide_text">
          <strong>{{ item.title }}</strong>
          <span>{{ item.message }}</span>
        </div>
      </div>
    </div>

    <div class="guide_body">
      <img :src="item.img" />
    </div>

    <div class="bottom_btns">
      <div class="btns">
        <div class="in">
          <router-link :to="{ name: 'main' }" class="back">
            <i class="ui home icon"></i>
          </router-link>

          <a href="#" class="next" @click="$router.go(-1)">뒤로가기</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tutorial',
  props: ['type'],
  data() {
    return {
      items: {
        kiosk: {
          title: '회원가입 및 포인트 충전하기',
          message: '가입된 휴대 번호로 결제 정보 알림 및 포인트 적립이 됩니다',
          img: this.imagePath('guide_01.png'),
        },
        wash: {
          title: '',
          message: '',
          img: this.imagePath('guide_02.png'),
        },
        dry: {
          title: '',
          message: '',
          img: this.imagePath('guide_03.png'),
        },
      },
    };
  },
  computed: {
    item() {
      return this.items[this.type];
    },
  },
  methods: {
    imagePath(path) {
      return `http://admin.payot-coin.com/kiosk/${path}`;
    },
  },
};
</script>