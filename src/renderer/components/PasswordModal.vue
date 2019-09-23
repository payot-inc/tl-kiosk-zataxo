<template>
  <sui-modal v-model="open" size="tiny" :closable="false">
    <sui-modal-content class="ui modal pw_modal" :class="{ pw_re_write: mode === 'reset' }">
      <div class="modal_hd" v-if="mode === 'password'">
        <div class="hd">
          <h2>비밀번호 확인</h2>
          <a href="#" @click="open = false;">
            <i class="ui x icon"></i>
          </a>
        </div>
        <div class="number">
          <span
            v-for="row in 4"
            :key="row"
            :class="{ off: input.length < row, on: input.length >= row }"
          ></span>
        </div>
        <p>
          비밀번호를 입력해 주세요
        </p>
      </div>

      <div class="modal_hd" v-if="mode === 'reset'">
        <div class="hd">
          <h2>비밀번호 등록</h2>
          <a href="#" @click="open = false;">
            <i class="ui x icon"></i>
          </a>
        </div>
        <div class="number">
          <span
            v-for="row in 4"
            :key="row"
            :class="{ off: input.length < row, on: input.length >= row }"
          ></span>
        </div>
        <p>
          변경 또는 등록하실 비밀번호를
          <br />입력해주세요
        </p>
      </div>

      <div class="number_in">
        <table>
          <tbody>
            <tr v-for="row in 3" :key="row">
              <td v-for="col in 3" :key="col">
                <a href="#" @click="inputNumber((row - 1) * 3 + col)">{{ (row - 1) * 3 + col }}</a>
              </td>
            </tr>
            <tr>
              <td class="all">
                <a href="#" @click="input = ''">전체삭제</a>
              </td>
              <td>
                <a href="#" @click="inputNumber(0)">0</a>
              </td>
              <td class="del">
                <a href="#" @click="removeNumber">삭제</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="find_pw_bt" v-if="mode === 'password'">
        <a href="#" @click="$emit('input:reset'); open = false;">
          <i class="ui lock icon"></i>비밀번호 찾기
        </a>
        <span>
          <i class="ui angle right icon"></i>
        </span>
      </div>
    </sui-modal-content>
  </sui-modal>
</template>

<script>
export default {
  name: 'PasswordModal',
  data() {
    return {
      mode: 'password',
      open: false,
      input: '',
    };
  },
  methods: {
    show(mode) {
      this.mode = mode;
      this.open = true;
    },

    inputNumber(number) {
      if (this.input.length > 4) return;

      this.input += number;
      if (this.input.length !== 4) return;

      const { input: password } = this;
      this.$emit('input:password', password);
      this.input = '';
      this.open = false;
    },

    removeNumber() {
      if (this.input.length <= 0) return;
      this.input = this.input.slice(0, -1);
    },
  },
};
</script>