<template>
  <div class="interview-guide-container">
    <div class="markdown-body" v-html="html"></div>
    <transition name="fade">
      <div v-if="showReadTip" class="read-tip">
        请阅读完所有内容
      </div>
    </transition>
    <transition name="fade">
      <div v-if="showChallengeForm" class="challenge-forms-popup">
        <form class="accept-form" @submit.prevent="submitAccept">
          <h3>接受挑战</h3>
          <input v-model="acceptForm.githubId" type="text" placeholder="GitHub ID" required style="margin-bottom: 16px;"/>
          <input v-model="acceptForm.email" type="email" placeholder="邮箱" required style="margin-bottom: 16px;"/>
          <div class="btn-group">
            <button type="submit" class="accept-btn">接受挑战</button>
            <button type="button" class="think-btn" @click="thinkMore">考虑考虑</button>
          </div>
        </form>
      </div>
    </transition>
    <div v-if="showLogo" class="logo-modal" @click="showLogo = false">
      <img src="/logo.png" alt="logo" @click.stop />
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';

export default {
  name: 'InterviewGuide',
  data() {
    return {
      markdown: '',
      html: '',
      showLogo: false,
      acceptForm: {
        githubId: '',
        email: ''
      },
      showChallengeForm: false,
      allTextShown: false,
      scrollTimer: null,
      showFormDelayTimer: null,
      showReadTip: false
    }
  },
  watch: {
    showChallengeForm(val) {
      if (val) {
        this.showReadTip = false;
      }e
    }
  },
  methods: {
    submitAccept() {
      this.$router.push({
        path: '/success',
        query: {
          githubId: this.acceptForm.githubId,
          email: this.acceptForm.email
        }
      });
    },
    thinkMore() {
      this.showChallengeForm = false;
      this.showReadTip = true;
    },
    handleScroll() {
      // 防抖
      if (this.scrollTimer) clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        const container = this.$el;
        const scrollTop = container.scrollTop;
        const windowHeight = container.clientHeight;
        const docHeight = container.scrollHeight;
        // 只有文字全部显示后才判断
        if (this.allTextShown && scrollTop + windowHeight >= docHeight - 10) {
          // 到底部，延迟显示
          if (!this.showFormDelayTimer) {
            this.showFormDelayTimer = setTimeout(() => {
              this.showChallengeForm = true;
              this.showFormDelayTimer = null;
            }, 1000); // 1秒延迟
          }
        } else {
          // 离开底部，立即隐藏并清除延迟
          if (this.showFormDelayTimer) {
            clearTimeout(this.showFormDelayTimer);
            this.showFormDelayTimer = null;
          }
          this.showChallengeForm = false;
        }
      }, 200); // 200ms防抖
    }
  },
  async mounted() {
    const res = await fetch('https://raw.githubusercontent.com/InfiniteStatesInc/HireWithCode/refs/heads/main/README.md');
    this.markdown = await res.text();
    this.html = marked.parse(this.markdown);

    this.$nextTick(() => {
      const container = this.$el.querySelector('.markdown-body');
      if (container) {
        const lines = container.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, blockquote');
        lines.forEach((el, idx) => {
          setTimeout(() => {
            el.classList.add('show');
            // 最后一行动画结束后，设置allTextShown为true并显示提示
            if (idx === lines.length - 1) {
              this.allTextShown = true;
              this.showReadTip = true;
            }
          }, idx * 200 + 200);
        });
        container.addEventListener('click', (e) => {
          if (e.target.tagName === 'A' && e.target.getAttribute('href') === './logo.png') {
            e.preventDefault();
            this.showLogo = true;
          }
        });
      }
    });
    this.$el.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    this.$el.removeEventListener('scroll', this.handleScroll);
    if (this.scrollTimer) clearTimeout(this.scrollTimer);
    if (this.showFormDelayTimer) clearTimeout(this.showFormDelayTimer);
  }
}
</script>

<style>
.interview-guide-container {
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  /* align-items: flex-start; */
  background: #f5f6fa;
}

.logo-modal {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.logo-modal img {
  max-width: 80vw;
  max-height: 80vh;
  border-radius: 8px;
  background: #fff;
  padding: 16px;
}

.divider {
  width: 100%;
  max-width: 800px;
  height: 1.5px;
  margin: 36px auto 12px auto;
  background: linear-gradient(90deg, #e0e7ef 0%, #b3d8ff 50%, #e0e7ef 100%);
  border-radius: 1px;
  opacity: 0.7;
}
.challenge-tip {
  text-align: center;
  color: #4f8cff;
  font-size: 1.1em;
  margin-bottom: 12px;
  letter-spacing: 1px;
}
.markdown-body {
  text-align: left;
  max-width: 800px;
  margin: 40px auto;
  padding: 32px 24px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  font-size: 1rem;
  line-height: 1.8;

  word-break: break-word;
  margin-bottom: 0;
}

.markdown-body h1, .markdown-body h2, .markdown-body h3 {
  font-weight: bold;
  margin: 2em 0 1em 0;
  line-height: 1.3;
}

.markdown-body h1 {
  color: red;
  font-size: 2.2em;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3em;
}
.markdown-body h2 {
  font-size: 1.6em;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 0.2em;
}
.markdown-body h3 {
  font-size: 1.2em;
}

.markdown-body ul, .markdown-body ol {
  margin: 1em 0 1em 2em;
  padding: 0;
}

.markdown-body li {
  margin: 0.3em 0;
}

.markdown-body code {
  background: #f6f8fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.97em;
  font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
}

.markdown-body pre {
  background: #f6f8fa;
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.97em;
}

.markdown-body blockquote {
  border-left: 4px solid #e0e0e0;
  padding-left: 1em;
  color: #888;
  margin: 1.5em 0;
  background: #fafbfc;
}

.markdown-body a {
  color: #0366d6;
  text-decoration: none;
  word-break: break-all;
  position: relative;
  transition: color 0.2s;
}

.markdown-body a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: #4f8cff;
  transform: scaleX(0);
  transition: transform 0.3s;
  transform-origin: left;
}

.markdown-body a:hover {
  color: #ff7e29;
}

.markdown-body a:hover::after {
  transform: scaleX(1);
}

.markdown-body table {
  border-collapse: collapse;
  margin: 1em 0;
  width: 100%;
}

.markdown-body th, .markdown-body td {
  border: 1px solid #eaeaea;
  padding: 0.5em 1em;
}

.markdown-body th {
  background: #f6f8fa;
  font-weight: bold;
}

.markdown-body p,
.markdown-body li,
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6,
.markdown-body blockquote {
  opacity: 0;
  transition: opacity 0.5s, transform 0.5s;
  transform: translateY(20px);
}

.markdown-body .show {
  opacity: 1;
  transform: translateY(0);
}

.challenge-forms {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 0 0 24px 0;
}
.challenge-forms form {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 32px 28px 24px 28px;
  display: flex;
  flex-direction: column;
  min-width: 260px;
  max-width: 320px;
  align-items: center;
}
.challenge-forms h3 {
  margin-bottom: 18px;
  color: #4f8cff;
  font-size: 1.2em;
}
.challenge-forms input {
  width: 100%;
  margin-bottom: 16px;
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1em;
  outline: none;
  transition: border 0.2s;
}
.challenge-forms input:focus {
  border-color: #4f8cff;
}
.challenge-forms button {
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
.challenge-forms button:hover {
  background: linear-gradient(90deg, #6ed0fa, #4f8cff);
  transform: translateY(-2px) scale(1.04);
}
/* challenge-forms 弹窗样式 */
.challenge-forms-popup {
  position: fixed;
  left: 0; right: 0; top: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background: rgba(245, 246, 250, 0.85);
  animation: fadeIn 0.5s;
}
.challenge-forms-popup form {
  width: 400px;
  max-width: 90vw;
  max-height: 80vh;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
  padding: 32px 28px 24px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.btn-group {
  display: flex;
  gap: 18px;
  margin-top: 10px;
  justify-content: center;
}
.accept-btn {
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
.accept-btn:hover {
  background: linear-gradient(90deg, #6ed0fa, #4f8cff);
  transform: translateY(-2px) scale(1.04);
}
.think-btn {
  background: #fff;
  color: #4f8cff;
  border: 1.5px solid #4f8cff;
  border-radius: 20px;
  padding: 10px 28px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}
.think-btn:hover {
  background: #eaf4ff;
  color: #1a5fd6;
}
.read-tip {
  position: fixed;
  left: 50%;
  bottom: 40px;
  transform: translateX(-50%);
  background: #4f8cff;
  color: #fff;
  padding: 12px 32px;
  border-radius: 24px;
  font-size: 1.1em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  z-index: 1200;
  opacity: 0.95;
  letter-spacing: 1px;
}
</style>