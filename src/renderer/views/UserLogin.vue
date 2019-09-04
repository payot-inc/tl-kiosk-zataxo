<template>
  <div class="container sub phone">
    <div class="inner">
      <div class="contents-wr">
        <div class="top_hd">
          <div class="in">
            <router-link :to="{ name: 'main' }" class="home_bt">
              <i class="ui home icon"></i>
            </router-link>
            <div class="text">
              <strong>휴대전화번호 입력</strong>
              <span>포인트 충전 및 적립을 위한 전화번호를 입력해주세요</span>
            </div>
          </div>
        </div>

        <div class="phone_inner">
          <div class="phone_view">
            <div class="text">
              <a href="#" @click="agree.mode = 'info'; agree.open = true;">이용약관</a>과
              <a href="#" @click="agree.mode = 'user'; agree.open = true;">개인정보 취급방침</a>에 확인 후
              <br />휴대전화번호를 입력해주세요
            </div>
            <div class="number">
              <span>010</span>
              <span v-show="phone.num2.length !== 0">{{ '*'.repeat(phone.num2.length) }}</span>
              <span v-show="phone.num3.length !== 0">{{ phone.num3 }}</span>
            </div>
          </div>
          <div class="phone_bt">
            <table cellpadding="0" cellspacing="0">
              <tbody>
                <tr v-for="row in 3" :key="row">
                  <td v-for="col in 3" :key="col" @click="inputNumber((row -1) * 3 + col)">
                    <a href="#"></a>
                    <span>{{ (row - 1) * 3 + col }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="dels" @click="phone.num2 = ''; phone.num3 = ''">
                    <a href="#"></a>
                    <span>전체삭제</span>
                  </td>
                  <td @click="inputNumber(0)">
                    <a href="#"></a>
                    <span>0</span>
                  </td>
                  <td class="del" @click="removeNumber">
                    <a href="#"></a>
                    <span>삭제</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bottom_btns">
          <div class="btns">
            <div class="in">
              <a href="#" class="back" @click="$router.push({ name: 'menu' })">
                <i class="ui angle left icon"></i>
              </a>
              <a href="#" class="next" @click="nextButtonClick">다음</a>
            </div>
          </div>
        </div>
      </div>
      <!-- contents -->

      <div class="wave-box-2">
        <div class="wave -one"></div>
        <div class="wave -two"></div>
        <div class="wave -three"></div>
      </div>
    </div>

    <PasswordModal
      ref="password_modal"
      @input:password="userPasswordCheck($event)"
      @input:reset="reset.open = true;"
    />

    <!-- 이용 동의 약관 -->
    <sui-modal v-model="agree.open">
      <sui-modal-header>{{ agree.mode === 'user' ? '개인정보 이용약관' : '개인정보 취급 방침' }}</sui-modal-header>
      <sui-modal-content scrolling>
        <p v-html="docs[agree.mode].replace(/\n/g, '<br />')"></p>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button @click="agree.open = false;">확인</sui-button>
      </sui-modal-actions>
    </sui-modal>

    <!-- 비밀번호 재설정 안내 모달 -->
    <sui-modal v-model="reset.open" size="basic">
      <sui-modal-content class="modal pw_get_ms massage">
        <div class="cont">
          <span class="text">
            입력된 번호로 임시비밀번호를
            <br />발송할까요?
          </span>
        </div>

        <div class="buttons">
          <a class="no" @click="reset.open = false">아니요</a>
          <a class="ok" @click="reset.open = false; randomPassword()">네</a>
        </div>
      </sui-modal-content>
    </sui-modal>

    <!-- 비밀번호 재설정 안내 모달 -->
    <sui-modal v-model="error.open" size="basic">
      <sui-modal-content class="modal pw_get_ms massage">
        <div class="cont">
          <span class="text">
            비밀번호가 올바르지 않습니다
          </span>
        </div>

        <div class="buttons">
          <a class="ok" @click="error.open = false">확인</a>
        </div>
      </sui-modal-content>
    </sui-modal>
  </div>
</template>

<script>
import PasswordModal from '@/components/PasswordModal.vue';
import Docs from '@/assets/js/agree.js';
import { mapState, mapMutations } from 'vuex';
import { isEmpty } from 'lodash';

export default {
  name: 'UserLogin',
  props: ['type'],
  components: {
    PasswordModal,
  },
  data() {
    return {
      phone: {
        num2: '',
        num3: '',
      },
      agree: {
        mode: 'info',
        open: false,
      },
      reset: {
        open: false,
        digest: '',
        status: false,
      },
      error: {
        open: false,
      },
    };
  },
  computed: {
    ...mapState('kiosk', ['company', 'options']),

    phoneNumber() {
      const { num2, num3 } = this.phone;
      return ['010', num2, num3].join('-');
    },

    docs() {
      return Docs;
    },
  },
  methods: {
    ...mapMutations('kiosk', { setUser: 'SET_USER' }),
    // 전화번호 입력 입력
    inputNumber(num) {
      if (this.phone.num2.length < 4) {
        this.phone.num2 += num;
      } else if (this.phone.num2.length === 4 && this.phone.num3.length < 4) {
        this.phone.num3 += num;
      }
    },

    // 숫자 하나 지우기
    removeNumber() {
      if (this.phone.num3.length > 0) {
        this.phone.num3 = this.phone.num3.slice(0, -1);
      } else if (this.phone.num3.length === 0 && this.phone.num2.length > 0) {
        this.phone.num2 = this.phone.num2.slice(0, -1);
      }
    },

    // 휴대전화번호 입력 검증
    valide() {
      const { phoneNumber } = this;
      const phoneRegex = /^[0-9]{3}[-]+[0-9]{4}[-]+[0-9]{4}$/;

      return phoneNumber.match(phoneRegex);
    },

    // 다음버튼 터치시
    async nextButtonClick() {
      try {
        if (!this.valide()) throw new Error('전화번호 형식 오류');
        const { phoneNumber } = this;

        // 전화번호 입력이 맞는경우
        const isSignUser = await this.isSignUserCheck();
        if (isSignUser) {
          // 기존 회원인 경우
          this.$refs.password_modal.show('password');
        } else {
          // 새로운 회원인 경우
          this.$refs.password_modal.show('reset');
        }
      } catch (error) {
        switch (error.message) {
          case '전화번호 형식 오류':
            break;
          default:
            break;
        }
      }
    },

    async randomPassword() {
      const { phoneNumber: phone } = this;
      const { id: companyId } = this.company;

      const url = '/user/password/reset';
      const params = { phone, companyId };

      const { data } = await this.$http.post(url, params);

      this.reset.digest = data.digest;
    },

    async isSignUserCheck() {
      try {
        const { id: company } = this.company;
        const { phoneNumber: phone } = this;
        await this.$http.get('/user', { params: { company, phone } });
        return true;
      } catch (error) {
        return false;
      }
    },

    // 사용자 비밀번호 체크
    async userPasswordCheck(password) {
      try {
        const { phoneNumber: phone } = this;
        const { id: companyId } = this.company;

        if (this.reset.status) {
          const url = '/user/password';
          const params = {
            phone: this.phoneNumber,
            companyId: this.company.id,
            oldPassword: this.reset.digest,
            newPassword: password,
          };

          await this.$http.put(url, params);
        }

        const params = { phone, companyId, password };

        const { data } = await this.$http.post('/user', params);

        this.setUser(data);

        if (!isEmpty(this.reset.digest) && this.reset.digest === password && !this.reset.status) {
          this.$refs.password_modal.show('reset');
          this.reset.status = true;
          return;
        }

        if (this.options.skip) {
          const routeName = this.type === 'pay' ? 'amountSelect' : 'products';
          this.$router.push({ name: routeName });
        } else {
          this.$router.push({ name: 'info', params: { type: this.type } });
        }
      } catch (error) {
        this.error.open = true;
      }
    },
  },
};
</script>
