<template>
  <div class="container login">
    <div class="inner">
      <div class="title">
        <h1>
          관리자
          <b>로그인</b>
        </h1>
        <p>ADMINISTRATOR LOGIN</p>
      </div>
      <div class="login_form">
        <div class="in">
          <div class="id">
            <span>아이디</span>
            <input type="text" v-model="email" :placeholder="company.email" />
          </div>
          <div class="pw">
            <span>비밀번호</span>
            <input type="password" v-model="password" @keypress.enter="login" />
          </div>
          <div class="point">
            <span>현금적립률</span>
            <input type="number" v-model.number="config.cash" :min="0" :max="100" />
            <strong>%</strong>
          </div>
          <div class="point">
            <span>카드적립률</span>
            <input type="number" v-model.number="config.card" />
            <strong>%</strong>
          </div>

          <a class="ui black button" href="#" @click="login">로그인</a>
        </div>

        <div class="ui column grid login_check">
          <div class="column" @click="config.isCard = !config.isCard">
            <div class="card checkbox">
              <input type="checkbox" name="example" v-model="config.isCard" />
              <label>카드결제 사용</label>
            </div>
          </div>
        </div>

        <div class="ui column grid login_check">
          <div class="column" @click="config.skip = !config.skip">
            <div class="card checkbox">
              <input type="checkbox" name="example" v-model="config.skip" />
              <label>결제 및 사용 안내 페이지 가리기</label>
            </div>
          </div>
        </div>
      </div>
      <div class="logo">
        <img src="@/assets/image/the_logo.png" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      config: {
        cash: 0,
        card: 0,
        skip: false,
        isCard: false,
      },
    };
  },
  mounted() {
    this.email = this.company.email;
    this.config.cash = this.options.cash;
    this.config.card = this.options.card;
    this.config.isCard = this.options.isCard;
    this.config.skip = this.options.skip;
  },
  computed: {
    ...mapState('kiosk', ['company', 'options']),
  },
  methods: {
    ...mapMutations('kiosk', { setCompany: 'SET_COMPANY', setOptions: 'SET_OPTIONS' }),

    async login() {
      try {
        const { email, password, config } = this;

        const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if (!emailRegex.test(email)) throw new Error('email');
        if (password.length < 4) throw new Error('password');

        const { data } = await this.$http.post('/company', { email, password });

        this.setCompany({ email, ...data });
        this.setOptions(config);
        this.$router.push({ name: 'main' });
      } catch (error) {
        if (error.message === 'email') {
          alert('계정은 이메일 주소이어야 합니다');
        } else if (error.message === 'password') {
          alert('비밀번호는 최소 4자리 이상이어야 합니다');
        } else if (error.response.status === 404) {
          alert('존재하지 않는 계정입니다');
        } else {
          alert('비밀번호가 올바르지 않습니다');
        }
      }
    },
  },
};
</script>
