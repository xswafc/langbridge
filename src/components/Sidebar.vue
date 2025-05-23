<template>
  <div class="sidebar" :style="{ width: isCollapse ? '120px' : '300px' }" style="display: flex;">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="rgb(48, 65, 86)"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="isCollapse"
      :router="true"
    >
      <el-menu-item index="/home">
        <template #title>Home Page</template>
      </el-menu-item>
      <el-menu-item index="/professional">
        <template #title>Professional Search Panel</template>
      </el-menu-item>
      <el-menu-item index="/search-results">
        <template #title>Search Results</template>
      </el-menu-item>
    </el-menu>
    <Hamburger
      id="hamburger-container"
      :is-active="isCollapse"
      class="hamburger-container"
      @toggleClick="toggleCollapse"
    />
  </div>
</template>

<script setup>
import Hamburger from '@components/Hamburger.vue';

import { storeToRefs } from 'pinia';
import homeStore from "@store/home.js";

const _homeStore = homeStore();
const {
  isCollapse,
} = storeToRefs(_homeStore);

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
</script>

<style scoped>
.sidebar {
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  transition: width 0.3s;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.hamburger-container {
  line-height: 46px;
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
</style>