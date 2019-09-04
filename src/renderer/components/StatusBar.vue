<template>
  <div id="state_bar">
    <div class="inner">
      <ul class="left">
        <!-- <li>
          <strong class="active">
            <i class="ui check icon"></i>
          </strong>
          <span>인터넷</span>
        </li>
        <li>
          <strong class="active">
            <i class="ui check icon"></i>
          </strong>
          <span>지폐</span>
        </li>
        <li>
          <strong class="stop">
            <i class="ui x icon"></i>
          </strong>
          <span>카드</span>
        </li>
        <li>
          <strong class="active">
            <i class="ui check icon"></i>
          </strong>
          <span>터치</span>
        </li> -->
      </ul>
      <ul class="right">
        <li class="login_state">
          <span>{{ company.name }}</span>
        </li>
        <li class="number">
          <span>{{ company.tel }}</span>
        </li>
        <li class="time">{{ time | moment('HH:mm')}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import moment from 'moment';
import { mapState } from 'vuex';

export default {
  name: 'StatusBar',
  data() {
    return {
      time: moment(),
    };
  },
  computed: {
    ...mapState('kiosk', ['company']),
  },
  mounted() {
    const self = this;
    interval(1000)
      .pipe(map(() => moment()))
      .subscribe(
        (time) => {
          self.time = time;
        },
        () => {},
      );
  },
};
</script>