<template>
  <div class="layout">
    <sidebarmenu />
    <router-view />
  </div>
</template>

<script>
import Sidebarmenu from "./components/SidebarMenu.vue";

export default {
  components: {
    Sidebarmenu,
  },
};
</script>

<style>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
</style>
