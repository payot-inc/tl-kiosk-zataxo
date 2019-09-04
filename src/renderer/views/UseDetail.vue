<template>
  <div class="container sub state_wr">
    <div class="inner">
      <div class="contents-wr">
        <div class="top_hd">
          <div class="in">
            <router-link :to="{ name: 'main' }" class="home_bt">
              <i class="ui home icon"></i>
            </router-link>
            <div class="text">
              <strong>서비스확인 및 포인트사용</strong>
              <span>선택하신 서비스와 결제금액을 확인해주세요</span>
            </div>
          </div>
        </div>
        <!-- top_hd -->

        <div class="my_phone">
          <span>회원번호</span>
          <strong>{{ phoneNumber }}</strong>
        </div>

        <div class="credit_info">
          <dl>
            <dt>상품정보</dt>
            <dd>
              <ul>
                <li class="eq_name">
                  <strong>장비명</strong>
                  <span>{{ machine.name }}</span>
                </li>
                <li>
                  <strong>서비스명</strong>
                  <span>{{ product.name }}</span>
                </li>
                <li>
                  <strong>동작시간</strong>
                  <span>{{ product.runTimeSec / 60 | priceFormat }}분</span>
                </li>
              </ul>
            </dd>
          </dl>

          <dl>
            <dt>결제정보</dt>
            <dd>
              <ul>
                <li class="pt">
                  <strong>나의포인트</strong>
                  <span class="num">{{ user.point | priceFormat }} 포인트</span>
                </li>
                <li class="pri">
                  <strong>결제예정금액</strong>
                  <span class="num">{{ product.price | priceFormat }} 원</span>
                </li>
                <li class="pri2">
                  <strong>결제 후 잔액</strong>
                  <span
                    class="num"
                  >{{ Number(user.point) - Number(product.price) | priceFormat }} 포인트</span>
                </li>
              </ul>
            </dd>
          </dl>
        </div>

        <div class="bottom_btns">
          <div class="btns">
            <div class="in">
              <a href="#" @click="$router.go(-1)" class="back">
                <i class="ui angle left icon"></i>
              </a>
              <a href="#" @click="runDevice" class="next">다음</a>
            </div>
          </div>
        </div>
      </div>

      <sui-modal v-model="progress.open" size="basic" :closable="false">
        <sui-modal-content class="order_ing">
          <span>
            <i class="spinner loading icon"></i>
          </span>
          <strong>결제가 진행중입니다</strong>
          <p>잠시만 기다려주세요</p>
        </sui-modal-content>
      </sui-modal>

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
  name: 'UseDetail',
  props: ['machine', 'product'],
  data() {
    return {
      progress: {
        open: false,
      },
    };
  },
  computed: {
    ...mapState('kiosk', ['user', 'company']),
    phoneNumber() {
      const [, , num3] = this.user.phone.split('-');
      return `010-****-${num3}`;
    },
  },
  methods: {
    async runDevice() {
      try {
        this.progress.open = true;

        const {
          machine, company, product, user,
        } = this;
        const params = {
          productId: product.id,
          phone: user.phone,
          companyId: company.id,
        };

        const { data } = await this.$http.post('/run', params);
        const values = {
          machine: this.machine,
          product: this.product,
          response: data,
        };
        this.$router.push({ name: 'finish', params: { data: values, method: 'use' } });
      } catch (error) {
        const { status } = error.response;
        switch (status) {
          case 400:
            // 포인트 부족으로 인한 상품 서비스 불가
            alert('포인트가 부족합니다');
            break;

          case 405:
            // 장비응답이 없는 경우
            alert('장비로부터 응답이 없습니다');
            break;

          case 406:
            // 장비가 응답하였지만 장비의 응답이 오류인 경우
            alert('장비의 오류가 발생하였습니다');
            break;

          default:
            break;
        }
      } finally {
        this.progress.open = false;
      }
    },
  },
};
</script>