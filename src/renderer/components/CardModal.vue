<template></template>

<script>
import { of } from 'rxjs';
import {} from 'rxjs/operators';
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
    };
  },
  computed: {
    ...mapState(['company']),
  },
  methods: {
    async show(amount) {
      try {
        await of(null)
          .pipe(delay(500))
          .toPromise();
        this.open = true;

        const { name } = this.company;
        const result = await payment(name, amount);

        this.$emit('sumit', result);
      } catch (error) {
        this.$emit('error', error.message);
      } finally {
        this.open = false;
      }
    },
  },
};
</script>