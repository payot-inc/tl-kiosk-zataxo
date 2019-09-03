<template>
  <sui-modal v-model="open" :size="'basic'" :closable="false">
    <sui-modal-content class="coin_modal credit_modal" style="background: transparent;">
      <div class="title">
        <h2>현금결제</h2>
        <div class="counter" id="timer">
          <span id="time">{{ nowTime | numeral('00') }}</span>
        </div>
      </div>
      <div class="info_img">
        <img src="@/assets/image/paper.gif" />
      </div>
      <div class="price_info">
        <dl>
          <dt>결제예정금액</dt>
          <dd>
            <strong class="num">{{ targetAmount | numeral('0,0')}}</strong>원
          </dd>
        </dl>
        <dl>
          <dt>투입된 금액</dt>
          <dd>
            <strong class="num">{{ amount | numeral('0,0') }}</strong>원
          </dd>
        </dl>
        <p>현금결제기에 현금을 투입해주세요</p>
      </div>
      <div class="tip">
        <span class="time">※ 보안을 위해 60초 후 자동으로 종료됩니다</span>
        <span class="point">※ 초과 투입된 지폐는 반환되지 않습니다 주의해주세요</span>
      </div>

      <div class="modal-btn">
        <button
          v-show="!stop"
          @click="cancel"
          :disabled="stop"
        >{{ amount === 0 ? '취소하기' : '투입금액만큼만 충전완료하기' }}</button>
        <button
          style="background: red;"
          v-show="stop"
          disabled
        >{{ amount === 0 ? '취소 중 입니다' : '투입금액을 확인 중 입니다' }}</button>
      </div>
    </sui-modal-content>
  </sui-modal>
</template>

<script>
/* eslint-disable */
import SerialPort from 'serialport';
import { Readline } from 'serialport/lib/parsers';
import { of, Subject, BehaviorSubject, interval, combineLatest, merge } from 'rxjs';
import { map, scan, delay, filter, debounceTime, tap, take } from 'rxjs/operators';

let port;
const serialInput = new Subject();
const inputAmount = new Subject(0);
const cancelEvent = new BehaviorSubject(false);

SerialPort.list((err, list) => {
  const { comName } = list.filter(({ vendorId }) => parseInt(vendorId, 16) === 6790)[0];
  port = new SerialPort(comName, { baudRate: 9600 });

  const parser = port.pipe(new Readline());

  parser.on('data', (text) => {
    const [commend, message] = text.replace(/\r\n/g, '').split(':');
    if (commend === 'BILL') {
      inputAmount.next(Number(message));
    } else if (!['BILL', 'ERR'].includes(commend)) {
      serialInput.next({ commend, message });
    } else {
      serialInput.error({ commend, message });
    }
  });
});

export default {
  name: 'CashModal',
  data() {
    return {
      open: false,
      totalTime: 60,
      nowTime: 60,
      targetAmount: 0,
      amount: 0,
      stop: false,
      event: {
        amount: {},
        timer: {},
        confirm: {},
      },
    };
  },
  watch: {
    open(newValue) {
      // 모달이 꺼질때 해야될일
      if (newValue) return;

      this.stop = false;
      this.amount = 0;
      this.nowTime = this.totalTime;
      cancelEvent.next(false);
      this.event.confirm.unsubscribe();
    },
  },
  methods: {
    show(amount) {
      const self = this;
      this.targetAmount = amount;
      this.open = true;
      port.write('RUN\r\n');

      // 금액 이벤트
      const inputEvent = merge(of(0), inputAmount).pipe(
        scan((acc, value) => acc + value, 0),
        tap((value) => {
          self.amount = value;
        }),
      );

      // 시간 이벤트
      const timerEvent = combineLatest(interval(1000), cancelEvent).pipe(
        map(([decrese, isCancel]) => (isCancel ? 0 : self.totalTime - decrese)),
        filter((value) => value >= 0),
        tap((value) => {
          self.nowTime = value;
        }),
      );

      // 결제 진행 확인 이벤트
      this.event.confirm = combineLatest(timerEvent, inputEvent, of(amount))
        .pipe(
          filter(([time, input, target]) => {
            const amountValide = input >= target;
            const timeOver = time === 0;

            return amountValide || timeOver;
          }),
          debounceTime(800),
          map(([, price]) => price),
          take(1),
          tap(() => port.write('STOP\r\n')),
          tap(() => {
            self.open = false;
          }),
        )
        .subscribe((price) => {
          if (price === 0) {
            self.$emit('cancel', price);
          } else {
            self.$emit('submit', price);
          }
        });
    },

    cancel() {
      this.stop = true;
      cancelEvent.next(true);
    },
  },
};
</script>
