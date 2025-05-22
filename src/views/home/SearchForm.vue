<template>
  <div class="form-container">
    
    <el-form :inline="true" :model="form">
      <div class="form-inline">
          <el-form-item>
            <el-input
              v-model="form.context"
              placeholder="Please enter the context"
              clearable
            />
          </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">Search</el-button>
          <el-button @click="handleProfessional">Professional Search Panel</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";


const router = useRouter();


const form = ref({
  context: '',
});

const handleQuery = () => {
  console.log('submit!')
}

const handleProfessional = () => {
  router.push("/professional");
}
</script>

<style lang="scss" scoped>
.form-container {
  background-color: #fff;
  .title {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .form-inline {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    .el-input {
      --el-input-width: 500px;
      height: 36px; 
    }
    .el-select {
      --el-select-width: 240px;
    }
    .form-item-label {
      display: flex;
      align-items: flex-start;
      :deep(.el-form-item__label) {
        padding: 0;
      }
    }
    :deep(.el-date-editor.el-input__wrapper) {
      width: 360px;
    }
  }
  :deep(.el-form .el-form-item__label) {
    font-weight: 400;
    font-size: 14px;
  }

  .left-menu {
    width: 30%;
    background: #fff;
    padding: 10px 20px;
    position: relative;
  }
}
</style>
