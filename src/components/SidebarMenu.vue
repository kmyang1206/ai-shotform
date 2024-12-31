<template>
    <div class="sidebar">
      <div class="menu-item" @click="navigateTo('대시보드')">대시보드</div>
      <div class="menu-item" @click="toggleAccordion">
        매직 스튜디오
        <div v-if="isAccordionOpen" class="accordion-content">
          <div class="menu-subitem" @click="navigateToAIShortform">AI 숏폼</div>
        </div>
      </div>
      <div class="menu-item" @click="navigateTo('분석 이력 조회')">분석 이력 조회</div>
      <div class="menu-item" @click="navigateTo('업스케일링 엔진 API')">업스케일링 엔진 API</div>
      <div class="menu-item" @click="navigateTo('이미지 처리 엔진 API')">이미지 처리 엔진 API</div>
      <div class="menu-item" @click="navigateTo('장면 인식 엔진 API')">장면 인식 엔진 API</div>
      <div class="menu-item" @click="navigateTo('텍스트 엔진 API')">텍스트 엔진 API</div>
      <div class="menu-item" @click="navigateTo('창작 엔진 API')">창작 엔진 API</div>
      <div class="menu-item" @click="navigateTo('인증 키 관리')">인증 키 관리</div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isAccordionOpen: false,
      };
    },
    methods: {
      toggleAccordion() {
        this.isAccordionOpen = !this.isAccordionOpen;
      },
      navigateTo(menuName) {
        this.$router.push({ name: 'default', params: { menuName } });
      },


      navigateToAIShortform(event) {
        event.stopPropagation(); // 아코디언이 닫히는 것을 방지
        this.$router.push({ name: 'AIShortform' });
      },
    },
  };
  </script>