<template>
  <div id="wrap">
    <div class="container sub guide">
      <div class="inner">
        <div class="contents-wr">
          <div class="top_hd">
            <div class="in">
              <router-link :to="{ name: 'main' }" class="home_bt">
                <i class="ui home icon"></i>
              </router-link>

              <div class="text">
                <strong>이용안내 선택</strong>
                <span>궁금하신 장비의 메뉴얼을 선택해주세요</span>
              </div>
            </div>
          </div>

          <div class="guide_list">
            <p>
              <label></label>
              매장 내 냉난방기는 세탁기 또는 건조기 사용시<br />
              자동으로 작동하고 있습니다.<br />
              쾌적한 공간에서 여유있는 시간을 즐겨주세요
            </p>
            <div class="in">
              <router-link :to="{ name: 'tutorial', params: { type: 'kiosk' } }">
                <label>
                  <img src="@/assets/image/service_icon0.png" />
                </label>
                <div class="text">
                  <strong>회원가입 후 충전하기</strong>
                  <span>부연설명이 필요합니다 부연설명이 필요합니다 부연설명이 필요</span>
                </div>
                <div class="arrow">
                  <span>
                    <i class="ui angle right icon"></i>
                  </span>
                </div>
              </router-link>

              <router-link :to="{ name: 'tutorial', params: { type: 'wash' } }">
                <label>
                  <img src="@/assets/image/service_icon1.png" />
                </label>
                <div class="text">
                  <strong>세탁기 사용방법</strong>
                  <span>부연설명이 필요합니다 부연설명이 필요합니다 부연설명이 필요</span>
                </div>
                <div class="arrow">
                  <span>
                    <i class="ui angle right icon"></i>
                  </span>
                </div>
              </router-link>

              <router-link :to="{ name: 'tutorial', params: { type: 'dry' } }">
                <label>
                  <img src="@/assets/image/service_icon2.png" />
                </label>
                <div class="text">
                  <strong>건조기 사용방법</strong>
                  <span>부연설명이 필요합니다 부연설명이 필요합니다 부연설명이 필요</span>
                </div>
                <div class="arrow">
                  <span>
                    <i class="ui angle right icon"></i>
                  </span>
                </div>
              </router-link>
            </div>
          </div>

          <div class="bottom_btns">
            <div class="btns">
              <div class="in">
                <a href="#" class="next" @click="$router.go(-1)">뒤로가기</a>
              </div>
            </div>
          </div>
        </div>

        <div class="wave-box-2">
          <div class="wave -one"></div>
          <div class="wave -two"></div>
          <div class="wave -three"></div>
        </div>
      </div>
    </div>
  </div>
</template>