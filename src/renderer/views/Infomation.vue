<template>
  <div id="wrap">
    <div class="container sub manual_wr">
      <div class="manual_hd">
        <div class="in">
          <div class="manual_text">
            <strong>{{ item.title }}</strong>
            <span>다음 사항을 반드시 준수 해 주세요</span>
          </div>
        </div>
      </div>

      <div class="manual_body">
        <img :src="item.img" />
      </div>

      <div class="bottom_btns">
        <div class="btns">
          <div class="in">
            <a href="#" class="back" @click="$router.push({ name: 'user-login', params: { type } })">
              <i class="ui angle left icon"></i>
            </a>
            <a href="#" class="next" @click="wrap">다음</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Info',
  props: ['type'],
  data() {
    return {
      items: {
        use: {
          title: '결제를 진행하기 전',
          img: this.imagePath('manual_1.png'),
        },
        pay: {
          title: '포인트 충전을 위해 결제하기전',
          img: this.imagePath('manual_2.png'),
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
      return `http://admin.payot-coin.com/kiosk/zatacso/${path}`;
    },

    wrap() {
      const { type } = this;
      const routeName = type === 'pay' ? 'amountSelect' : 'products';
      this.$router.push({ name: routeName });
    },
  },
};
</script>