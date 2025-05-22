<template>
  <div class="flex-between" style="align-items: stretch; margin: 0 40px;">
    <el-radio-group v-model="radio2" style="margin-bottom: 20px;">
      <el-radio-button label="Index Mode" value="Index Mode" />
      <el-radio-button label="Personal Recommendation" value="Personal Recommendation" />
      <el-radio-button label="Local Content" value="Local Content" />
    </el-radio-group>
    <div>
      <el-icon style="margin-right: 16px; cursor: pointer;" size="20"><Folder /></el-icon>
      <el-icon style="cursor: pointer;" size="20"><Tools /></el-icon>
    </div>
  </div>
  <div class="page-container" v-if="radio2 === 'Local Content'">
    <TreeComponent/>
    <div>
      <SearchForm/>
      <ListTable/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import SearchForm from './SearchForm.vue';
import TreeComponent from './TreeComponent.vue';
import ListTable from './ListTable.vue';

import { Folder, Tools } from '@element-plus/icons-vue';


const radio2 = ref('Local Content')

</script>

<style lang="scss" scoped>
.page-container {
  padding: 10px;
  display: flex;
}
</style>
