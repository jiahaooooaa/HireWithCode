<template>
  <div class="welcomeview-container">
    <img class="logo" alt="logo" src="@/assets/logo.png" />
    <div class="welcome-text">欢迎来到 无限状态 线上面试环节，期待你的加入！</div>
  </div>
</template>

<script>
export default {
  name: 'welcomeView',
  mounted() {
    setTimeout(() => {
      this.$router.push('/guide');
    }, 2000);
  }
}
</script>

<style scoped>
.welcomeview-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: #fff;
}
.logo {
  width: 450px;
  height: 450px;
  margin-bottom: 32px;
}
.welcome-text {
  font-size: 1.5rem;
  color: #333;
  font-weight: bold;
  text-align: center;
}
</style>
