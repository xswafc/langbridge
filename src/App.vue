<template>
  <SideBar />
  <div class="content" :style="{ marginLeft: isCollapse ? '64px' : '200px' }">
    <router-view />
  </div>
</template>

<script setup>
import SideBar from '@components/Sidebar.vue'

import { storeToRefs } from 'pinia';
import homeStore from "@store/home.js";

const _homeStore = homeStore();
const {
  isCollapse,
} = storeToRefs(_homeStore);
</script>

<style>
#app {
  display: flex;
}

.content {
  padding: 20px;
  width: 100%;
  transition: margin-left 0.3s;
}
</style>