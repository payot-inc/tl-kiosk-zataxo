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
          <strong>{{ userPhoneNumber }}</strong>
        </div>

        <div class="credit_info">
          <dl>
            <dt>결제정보</dt>
            <dd>
              <ul>
                <li class="pri2">
                  <strong>나의포인트</strong>
                  <span class="num">{{ user.point | numeral('0,0') }} 포인트</span>
                </li>
                <li class="pri">
                  <strong>결제예정금액</strong>
                  <span class="num">{{ amount | numeral('0,0') }} 원</span>
                </li>
                <li class="pri2">
                  <strong>총 지급 포인트</strong>
                  <span
                    class="num"
                  >{{ (1 + (options[method] / 100)) * amount | numeral('0,0') }} 포인트</span>
                </li>
                <li class="pt">
                  <strong>결제 후 포인트</strong>
                  <span
                    class="num"
                  >{{ Number(user.point) + ((1 + (options[method] / 100)) * amount) | numeral('0,0') }} 포인트</span>
                </li>
              </ul>
            </dd>
          </dl>
        </div>

        <div class="bottom_btns">
          <div class="btns">
            <div class="in">
              <a href="#" @click="backWrap" class="back">
                <i class="ui angle left icon"></i>
              </a>
              <a href="#" @click="pay" class="next">다음</a>
            </div>
          </div>
        </div>
      </div>

      <CashModal ref="cash_modal" @submit="pointAppend($event)" />

      <CardModal ref="card_modal" @submit="pointAppend(amount)" @error="cardError($event)" />

      <sui-modal v-model="progress.open" size="basic" :closable="false">
        <sui-modal-content class="ui modal order_ing basic">
          <span>
            <i class="spinner loading icon"></i>
          </span>
          <strong>결제가 진행중입니다</strong>
          <p>잠시만 기다려주세요</p>
        </sui-modal-content>
      </sui-modal>

      <sui-modal v-model="error.open" size="basic">
        <sui-modal-content class="modal pw_get_ms massage">
          <div class="cont">
            <span class="text">{{ error.message }}</span>
          </div>

          <div class="buttons">
            <a class="ok" @click="error.open = false">확인</a>
          </div>
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
import CashModal from '@/components/CashModal.vue';
// import CardModal from '@/components/CardModal.vue';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export default {
  name: 'PayDetail',
  props: ['amount', 'method'],
  components: {
    CashModal,
    // CardModal,
  },
  data() {
    return {
      progress: {
        open: false,
      },
      error: {
        open: false,
        message: '',
      },
    };
  },
  computed: {
    ...mapState(['company', 'user', 'options']),

    userPhoneNumber() {
      const { phone } = this.user;
      const [, , num3] = phone.split('-');

      return `010-****-${num3}`;
    },
  },
  methods: {
    pay() {
      const { method } = this;
      if (method === 'cash') {
        this.$refs.cash_modal.show(this.amount);
      } else {
        this.$refs.card_modal.show(this.amount);
      }
    },

    backWrap() {
      this.$router.push({
        name: 'amountSelect',
        params: { ...this.$route.params },
      });
    },

    async pointAppend(amount) {
      try {
        this.progress.open = true;

        await of(null)
          .pipe(delay(1000))
          .toPromise();

        const { company, user, options } = this;
        const params = {
          companyId: company.id,
          phone: user.phone,
          method: this.method,
          price: Number(amount),
          rate: this.method === 'cash' ? options.cash / 100 : options.card / 100,
        };

        const { data } = await this.$http.post('/pay', params);
        this.$router.push({ name: 'finish', params: { data, method: 'pay' } });
      } catch (error) {
        console.log(error.response);
      } finally {
        this.progress.open = false;
      }
    },

    cardError(message) {
      this.error.open = true;
      this.error.message = message;
    },
  },
};
</script>