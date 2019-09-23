<template>
  <sui-modal v-model="open" size="basic" :closable="false">
    <sui-modal-content class="card_modal credit_modal">
      <div class="title">
        <h2>카드결제</h2>
        <div class="counter" id="timer">
          <!-- <span id="time">60 초</span> -->
        </div>
      </div>
      <div class="info_img" style="background:#fff url('./static/image/card_img.jpg')no-repeat center/100%"></div>
      <div class="price_info">
        <dl>
          <dt>결제예정금액</dt>
          <dd>
            <strong class="num">{{ price | priceFormat }}</strong>원
          </dd>
        </dl>
        <p>카드를 카드결제기에 투입해주세요</p>
      </div>
      <div class="tip">
        <span class="time">결제가 완료될때 까지 카드를 빼지 말아 주세요</span>
      </div>
    </sui-modal-content>
  </sui-modal>
</template>

<script>
/* eslint-disable */
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { mapState } from 'vuex';
import edge from 'electron-edge-js';
import _ from 'lodash';

// const path = './static/PayotKoces.dll';
const path = 'C:\\Koces\\PayotKoces.dll';

const lib = edge.func(path);

function request(params) {
  return new Promise((resolve, reject) => {
    lib(params, (error, results) => {
      try {
        if (error) return reject(new Error(error.message));
        const { code, result, resultString } = results;
        const statusBuffer = _.takeRight(_.take(result || '', 65), 4);
        const statusStr = Buffer.from(statusBuffer).toString();

        if (code === 0 && statusStr === '0000') {
          return resolve(results);
        } else if (code === -3) {
          return reject(new Error('카드결제 프로그램이 실행되지 않음'));
        } else if (code === -2) {
          return reject(new Error('결제시간 초과'));
        } else if (code === -1) {
          return reject(new Error('카드결제 승인 오류'));
        } else if (statusStr === '9999') {
          return reject(new Error('카드결제 취소'));
        }

        const errorMessage = resultString.substring(103, 135);
        return reject(new Error(errorMessage));
      } catch (error) {
        return reject(error);
      }
    });
  });
}

function payment(companyName, amount) {
  const params = {
    type: 'F1',
    company: companyName,
    amount: amount.toString(),
    payNum: '',
    payDate: '',
  };

  return request(params);
}

export default {
  name: 'CardPayModal',
  data() {
    return {
      open: false,
      price: 0,
    };
  },
  computed: {
    ...mapState('kiosk', ['company']),
  },
  methods: {
    async show(amount) {
      try {
        this.price = amount;
        this.open = true;
        await of(null)
          .pipe(delay(500))
          .toPromise();

        const { name } = this.company;
        const result = await payment(name, amount);

        this.$emit('submit', result);
      } catch (error) {
        this.$emit('error', error.message);
      } finally {
        this.open = false;
      }
    },
  },
};
</script>