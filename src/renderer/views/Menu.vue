<template>
  <div class="container sub service">
    <div class="inner">
      <div class="contents-wr">
        <div class="service_hd">
          <router-link :to="{ name: 'main' }" class="home_bt">
            <i class="ui home icon"></i>
          </router-link>
          <div class="text">서비스 선택</div>
        </div>
        <!-- top_hd -->

        <div class="title">
          <h1>
            터치로 간편하게
            <b>시작하세요</b>
          </h1>
        </div>

        <div class="sv_list">
          <p>필요한 서비스 터치해주세요</p>
          <router-link :to="{ name: 'user-login', params: { type: 'use' } }" class="use">
            <div class="icon">
              <label>
                <img src="@/assets/image/use_icon.png" />
              </label>
            </div>
            <div class="text">
              <strong>세탁/건조장비 사용하기</strong>
              <span>
                휴대폰 번호에 충전된 포인트로
                <br />장비를 사용합니다
              </span>
            </div>
          </router-link>

          <router-link :to="{ name: 'user-login', params: { type: 'pay' } }" class="cha">
            <div class="icon">
              <label>
                <img src="@/assets/image/chage_icon.png" />
              </label>
            </div>
            <div class="text">
              <strong>신규회원/포인트충전</strong>
              <span>
                신규 및 가입된 휴대폰 번호에
                <br />포인트를 충전합니다
              </span>
            </div>
          </router-link>

          <router-link :to="{ name: 'tutorial-menu' }" class="info">
            <div class="icon">
              <label>
                <img src="@/assets/image/manual_icon.png" />
              </label>
            </div>
            <div class="text">
              <strong>장비 사용방법안내</strong>
              <span>
                처음 이용하시는 분들이라면
                <br />사용방법을 확인 후 이용해보세요
              </span>
            </div>
          </router-link>
        </div>
      </div>

      <div class="wave-box-2">
        <div class="wave -one"></div>
        <div class="wave -two"></div>
        <div class="wave -three"></div>
      </div>
    </div>
    <!-- inner -->
  </div>
</template>