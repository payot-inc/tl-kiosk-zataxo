<template>
  <div class="container sub product_wr">
    <div class="inner">
      <div class="contents-wr">
        <div class="top_hd">
          <div class="in">
            <router-link :to="{ name: 'main' }" class="home_bt">
              <i class="ui home icon"></i>
            </router-link>
            <div class="text">
              <strong>장비&amp;상품 선택</strong>
              <span>사용하실 장비와 상품을 선택해주세요</span>
            </div>
          </div>
        </div>
        <!-- top_hd -->

        <div class="my_point">
          <span>나의 포인트</span>
          <strong>
            <b>{{ user.point | priceFormat }}</b> 포인트
            <router-link :to="{ name: 'amountSelect' }">충전하기</router-link>
          </strong>
        </div>

        <div class="product">
          <div class="eq_list">
            <div class="tit_bar">
              <strong>STEP01</strong> 장비선택
            </div>
            <ul>
              <li
                v-for="(m, index) in machineList"
                :key="index"
                :class="{ on: selectMachine.mac === m.mac }"
                @click="selectMachine = m; selectProduct = {};"
              >
                <strong>{{ m.name }}</strong>
                <span>{{ m.size }}</span>
              </li>
            </ul>
          </div>

          <div class="pd_list">
            <!-- <div class="black">
              <div class="tip">
                장비를 선택 후 상품을
                <br />선택해주세요
              </div>
            </div>-->
            <div class="tit_bar">
              <strong>STEP02</strong> 상품선택
            </div>
            <ul>
              <li
                v-for="(p, index) in selectMachine.services"
                :key="p.id"
                @click="selectProduct = p"
                :class="{ on: selectProduct.id === p.id }"
              >
                <div class="number">
                  <span>{{ index + 1 | numeral('00') }}</span>
                </div>
                <div class="product_info">
                  <strong>{{ p.name }}</strong>
                  <div>
                    <span class="time">{{ p.runTimeSec / 60 | priceFormat }}분</span>
                    <span class="price">
                      <b>{{ p.price | priceFormat }}</b>원
                    </span>
                  </div>
                </div>
              </li>
            </ul>
            <!-- <label>
              <strong>
                <img src="image/scroll_icon.png" />
              </strong>
            </label>-->
          </div>
        </div>

        <div class="pd_state">
          <div>
            <dl>
              <dt>선택한상품</dt>
              <dd
                v-show="selectProduct.id"
              >{{ `${selectMachine.name} ${selectMachine.size} / ${selectProduct.name} ${selectProduct.runTimeSec / 60}분`}}</dd>
            </dl>
          </div>
          <div class="price">
            <dl>
              <dt>결제예정금액</dt>
              <dd v-show="selectProduct.id">
                <b>{{ selectProduct.price | priceFormat }}</b>원
              </dd>
              <dd v-show="!selectProduct.id">
                <p>상품을 선택해 주세요</p>
              </dd>
            </dl>
          </div>
        </div>

        <div class="bottom_btns">
          <div class="btns">
            <div class="in">
              <a href="#" class="back" @click="$router.push({ name: 'info', params: { type: 'use' } })">
                <i class="ui angle left icon"></i>
              </a>
              <a href="#" class="next" @click="wrap">다음</a>
            </div>
          </div>
        </div>
      </div>
      <!-- contents_wr -->

      <ConfrimModal ref="modal">
        <div class="text">
          <strong>
            포인트가 부족합니다
            <b>
              충전하시겠습니까?
              <b></b>
            </b>
          </strong>
          <b></b>
        </div>
        <b>
          <div class="buttons">
            <a class="can" href="#" @click="$refs.modal.show(false)">아니요</a>
            <a class="ok" href="#" @click="$router.push({ name: 'amountSelect' })">네</a>
          </div>
        </b>
      </ConfrimModal>

      <b>
        <div class="wave-box-2">
          <div class="wave -one"></div>
          <div class="wave -two"></div>
          <div class="wave -three"></div>
        </div>
      </b>
    </div>
    <b>
      <!-- inner -->
    </b>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex';
import { isEmpty } from 'lodash';
import ConfrimModal from '@/components/ConfirmModal.vue';

export default {
  name: 'ProductSelect',
  components: {
    ConfrimModal,
  },
  data() {
    return {
      machineList: [],
      selectMachine: {},
      selectProduct: {},
    };
  },
  async mounted() {
    await this.getMachineList();
  },
  watch: {
    selectMachine(newValue) {
      this.selectProduct = newValue.services[0];
    },
  },
  computed: {
    ...mapState('kiosk', ['company', 'user']),
  },
  methods: {
    async getMachineList() {
      try {
        const { id } = this.company;
        const url = `/company/${id}/devices`;

        const { data } = await this.$http.get(url);
        this.selectMachine = data[0];
        this.selectProduct = this.selectMachine.services[0];
        this.machineList = data;
      } catch (error) {
        console.log(error);
      }
    },

    valide() {
      try {
        const { selectProduct: product, user } = this;

        if (isEmpty(user)) throw new Error('회원 정보 없음');
        if (isEmpty(product)) throw new Error('상품 선택 안됨');
        if (Number(product.price) > Number(user.point)) { throw new Error('포인트 잔액 부족'); }
        return true;
      } catch (error) {
        this.$refs.modal.show(true);
        return false;
      }
    },
    wrap() {
      const { services, ...machine } = this.selectMachine;
      const product = this.selectProduct;

      if (!this.valide()) return;
      const params = { machine, product, type: 'use' };
      this.$router.push({ name: 'useDetail', params });
    },
  },
};
</script>