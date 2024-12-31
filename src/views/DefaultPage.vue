<template>
    <div>
      <h1>{{ menuName }}</h1>
      <p>선택된 메뉴에 대한 내용이 없습니다.</p>
    </div>
  </template>
  
  <script>
  export default {
    computed: {
      menuName() {
        return this.$route.params.menuName || '빈 페이지';
      },
    },
  };
  </script>
  