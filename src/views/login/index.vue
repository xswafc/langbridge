<template>
  <el-card class="box-card">
    <el-form :model="form" @submit.prevent="handleLogin">
      <el-form-item>
        <el-input v-model="form.username" placeholder="Nick Name" size="large"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" v-model="form.password" placeholder="Password" size="large"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" size="large">Log in</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    handleLogin() {
      // 登录逻辑实现
      console.log('Logging in with:', this.form);
      // 成功后跳转到首页或其他页面
      this.$router.push('/home');
    }
  }
};
</script>

<style scoped>
.box-card {
  width: 80%;
  margin: 100px auto;
}
</style>