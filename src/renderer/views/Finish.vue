<template>
  <div class="container sub complete_wr">
    <div class="inner">
      <div class="contents-wr">
        <div class="text">
          <span class="icon_box">
            <i class="ui circular check icon"></i>
          </span>
          <span class="title2 title">결제가 완료되었습니다</span>
          <p>
            충전된 포인트금액으로 장비를 사용해보세요
            <br />아래쪽
            <b>상품 선택하기</b>버튼을 터치하시면
            <br/>장비를 바로 이용하실 수 있습니다
          </p>
        </div>

        <div class="credit_info" v-if="method === 'use'">
          <div class="in">
            <dl>
              <dt>회원번호</dt>
              <dd>{{ phoneNumber }}</dd>
            </dl>
            <dl>
              <dt>장비</dt>
              <dd>{{ data.machine.name }}</dd>
            </dl>
            <dl>
              <dt>상품</dt>
              <dd>{{ data.product.name }}</dd>
            </dl>
          </div>
          <div class="in">
            <dl>
              <dt>내 포인트</dt>
              <dd>{{ user.point | priceFormat }} 포인트</dd>
            </dl>
            <dl>
              <dt>결제금액</dt>
              <dd>{{ data.product.price | priceFormat }}원</dd>
            </dl>

            <dl class="last-point">
              <dt>남은 포인트</dt>
              <dd>{{ data.response.point | priceFormat }} 포인트</dd>
            </dl>
          </div>
        </div>

        <div class="credit_info" v-if="method === 'pay'">
          <div class="in">
            <dl>
              <dt>회원번호</dt>
              <dd>{{ phoneNumber }}</dd>
            </dl>
          </div>
          <div class="in">
            <dl>
              <dt>내 포인트</dt>
              <dd>{{ user.point | priceFormat }} 포인트</dd>
            </dl>
            <dl>
              <dt>결제금액</dt>
              <dd>{{ data.price | priceFormat }}원</dd>
            </dl>
            <dl>
              <dt>추가 포인트</dt>
              <dd>{{ Number(data.havePoint) - Number(user.point) - data.price | priceFormat }} 포인트</dd>
            </dl>
            <dl class="last-point">
              <dt>남은 포인트</dt>
              <dd>{{ data.havePoint | priceFormat }} 포인트</dd>
            </dl>
          </div>
        </div>

        <div class="guide_box">
          <p>
            <strong>{{ timer }}</strong>초 후 메인으로 돌아갑니다
          </p>
          <a href="#" @click="logout">메인으로 돌아가기</a>
        </div>

        <div class="bottom_two_btns">
          <div class="btns">
            <div class="in">
              <a class="first" href="#" @click="warp('charge')">포인트 충전하기</a>
              <a class="sec" href="#" @click="warp('use')">상품 선택하기</a>
            </div>
          </div>
        </div>
      </div>
      <!-- contents_wr -->

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
import { mapState, mapMutations } from 'vuex';
import { interval } from 'rxjs';
import { tap, skip, take } from 'rxjs/operators';

export default {
  name: 'Finish',
  props: ['data', 'method'],
  data() {
    return {
      timer: 10,
      event: {},
    };
  },
  mounted() {
    const self = this;
    this.event = interval(1000)
      .pipe(
        tap(() => {
          self.timer -= 1;
        }),
        skip(9),
        take(1),
      )
      .subscribe(this.logout, console.log);
  },
  computed: {
    ...mapState('kiosk', ['company', 'user', 'options']),

    phoneNumber() {
      const [, , num3] = this.user.phone.split('-');

      return `010-****-${num3}`;
    },
  },
  methods: {
    ...mapMutations('kiosk', { setUser: 'SET_USER' }),

    // 사용자 변경내용 최신정보 가져오기
    async userUpdate() {
      const { id: company } = this.company;
      const { phone } = this.user;
      const { data: user } = await this.$http.get('/user', {
        params: {
          company,
          phone,
        },
      });

      this.setUser(user);
    },

    // 결제 및 사용하기
    async warp(path) {
      const { skip } = this.options;
      await this.userUpdate();

      let routePath = '';
      const params = {};
      if (skip) {
        routePath = path === 'charge' ? 'amountSelect' : 'products';
      } else {
        routePath = 'info';
        params.type = path === 'charge' ? 'pay' : 'use';
      }
      this.$router.push({ name: routePath, params: { ...params } });
    },

    logout() {
      this.setUser({});
      this.$router.push({ name: 'main' });
    },
  },
  beforeDestroy() {
    this.event.unsubscribe();
  },
};
</script>