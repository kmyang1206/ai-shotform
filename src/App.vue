<template>
  <div id="app">
    <div class="sidebar">
      <SidebarMenu />
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import SidebarMenu from './components/SidebarMenu.vue';

export default {
  components: {
    SidebarMenu,
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  height: 100vh;
  overflow: hidden; /* 전체 레이아웃의 가로 스크롤 방지 */
}

#app {
  display: flex; /* 사이드바와 콘텐츠를 나란히 배치 */
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto; /* 세로 스크롤 허용 */
}

.content {
  flex: 1;
  height: 100%; /* 콘텐츠가 화면 전체를 채우도록 설정 */
  overflow-y: auto; /* 콘텐츠가 넘칠 경우 세로 스크롤 허용 */
  padding: 20px;
  box-sizing: border-box;
}
</style>
