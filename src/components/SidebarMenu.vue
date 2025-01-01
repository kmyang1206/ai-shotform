<template>
    <div class="sidebar">
      <div class="menu-item" @click="navigateTo('대시보드')">대시보드</div>
      <div class="menu-item" @click="toggleAccordion">
        매직 스튜디오
        <div v-if="isAccordionOpen" class="accordion-content">
          <div class="menu-subitem" @click="navigateToAIShortformUpload">AI 숏폼</div>
        </div>
      </div>
      <div class="menu-item" @click="navigateToAIShortformStatus">분석 이력 조회</div>
      <div class="menu-item" @click="navigateTo">업스케일링 엔진 API</div>
      <div class="menu-item" @click="navigateTo">이미지 처리 엔진 API</div>
      <div class="menu-item" @click="navigateTo">장면 인식 엔진 API</div>
      <div class="menu-item" @click="navigateTo">텍스트 엔진 API</div>
      <div class="menu-item" @click="navigateTo">창작 엔진 API</div>
      <div class="menu-item" @click="navigateTo">인증 키 관리</div>
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
      navigateTo() {
        this.$router.push({ name: 'default' });
      },
      navigateToAIShortformUpload(event) {
        event.stopPropagation();
        this.$router.push({ name: 'AIShortformUpload' });
      },
      navigateToAIShortformStatus() {
        this.$router.push({ name: 'AIShortformStatus' });
      },
    },
  };
  </script>

<style>
.menu-item {
  margin: 10px 0;
  cursor: pointer;
  color: white;
}
.menu-item:hover {
  color: #ccc;
}
.menu-subitem {
  margin-left: 20px;
  cursor: pointer;
  color: white;
}
.menu-subitem:hover {
  color: #ccc;
}
.accordion-content {
  margin-top: 10px;
}
</style>