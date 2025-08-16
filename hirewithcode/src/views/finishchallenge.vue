<template>
    <div class="finish-challenge-container">
        <h1>您已经接受挑战，请提供github仓库地址，以及Vercel在线体验地址</h1>
        <form class="finish-form" @submit.prevent="submitFinish">
            <input v-model="repoUrl" type="url" placeholder="GitHub 仓库 URL" required />
            <input v-model="vercelUrl" type="url" placeholder="Vercel 在线体验地址" required />
            <button type="submit">提交作品</button>
        </form>
    </div>
</template>

<script>
export default {
  data() {
    return {
      repoUrl: '',
      vercelUrl: ''
    }
  },
  methods: {
    submitFinish() {
      alert("感谢您的参与，我们会在24小时内联系您");

      
      // 可扩展为后端提交
    }
  }
}
</script>

<style scoped>
.finish-challenge-container {
  max-width: 480px;
  margin: 60px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 32px 28px 24px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.finish-challenge-container h1 {
  font-size: 1.2em;
  color: #4f8cff;
  margin-bottom: 24px;
  text-align: center;
}
.finish-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.finish-form input {
  width: 100%;
  margin-bottom: 16px;
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1em;
  outline: none;
  transition: border 0.2s;
}
.finish-form input:focus {
  border-color: #4f8cff;
}
.finish-form button {
  background: linear-gradient(90deg, #4f8cff, #6ed0fa);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 28px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.3s, transform 0.2s;
}
.finish-form button:hover {
  background: linear-gradient(90deg, #6ed0fa, #4f8cff);
  transform: translateY(-2px) scale(1.04);
}
</style>