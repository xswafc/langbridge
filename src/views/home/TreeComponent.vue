<template>
  <div style="margin-right: 20px;">
    <el-tree :data="treeData" show-checkbox node-key="label" default-expand-all></el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      treeData: [
        {
          label: "EN",
          children: [
            { label: "EN-How we get tree planting wrong" },
            { label: "EN-How humanity got hooked on coffee - Jonathan Morris" },
            { label: "EN-How to Start a Small Farm | A Step-by-Step Guide" },
            { label: "EN-Ganges River Explained in under 3 minutes" }
          ]
        },
        {
          label: "FR",
          children: []
        }
      ]
    };
  }
};
</script>

<style scoped>
:deep(.el-tree-node__label) {
  display: inline-block; /* 或者 block */
  width: 240px;
  word-wrap: break-word; /* 在单词内部断开以适应容器宽度 */
  white-space: normal; /* 允许内容换行 */
}
</style>