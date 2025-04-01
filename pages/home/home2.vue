<template>
  <view class="container">
    <!-- 消息列表 -->
    <scroll-view class="message-list" scroll-y :scroll-top="scrollTop" :scroll-with-animation="true">
      <view v-for="(item, index) in messages" :key="index" class="message-item"
        :class="[item.role === 'user' ? 'user-message' : 'ai-message']">
        <view class="message-content">
          {{ item.content }}
        </view>
        <view class="message-time">
          {{ item.time }}
        </view>
      </view>
      <view v-if="loading" class="loading-text">AI正在思考中...</view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <input class="input" v-model="inputText" placeholder="请输入问题" @confirm="sendMessage" :disabled="loading" />
      <button class="send-button" @click="sendMessage" :disabled="loading">
        {{ loading ? '发送中...' : '发送' }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      messages: [],       // 消息列表
      inputText: '',      // 输入内容
      loading: false,     // 加载状态
      scrollTop: 0,       // 滚动位置
    };
  },
  methods: {
    async sendMessage() {
      if (!this.inputText.trim() || this.loading) return;

      const userMessage = {
        role: 'user',
        content: this.inputText,
        time: this.getCurrentTime()
      };
      this.messages.push(userMessage);
      const question = this.inputText;
      this.inputText = '';
      this.scrollToBottom();

      try {
        this.loading = true;
        const [err, res] = await uni.request({
          url: 'http://homechat-effassits-popgjiyphu.cn-hangzhou.fcapp.run/v1/chat/completions',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Cookie': 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDM5MTAyMjcsInVpZCI6MX0.T_R6-qar4YY7GsZh0iIE9psjw0XmeGB29CqIAI9KnOU'
          },
          timeout: 15000,
          data: {
            messages: [{ role: 'user', content: question }],
            stream: false
          }
        });
        // 添加网络诊断日志
        console.log('[网络诊断] 请求耗时:', res?.header?.['X-Response-Time']);
        console.log('[网络诊断] 服务端地址:', res?.header?.['X-Served-From']);

        // 处理网络错误
        if (err) {
          throw { errMsg: `请求失败: ${err.errMsg}` };
        }

        // 处理HTTP状态码错误
        if (res.statusCode !== 200) {
          throw {
            errMsg: `HTTP错误: ${res.statusCode}`,
            data: res.data // 传递原始响应数据
          };
        }

        const data = res.data;  // 获取响应数据

        // 处理业务逻辑错误
        if (!data.choices?.[0]?.message?.content) {
          throw { data: { errorMessage: '无效的响应格式' } };
        }
        // 新增响应处理逻辑
        const responseContent = data.choices[0].message.content;
        const [thinkPart, answerPart] = this.parseResponse(responseContent);

        // 添加思考消息
        if (thinkPart) {
          this.messages.push({
            role: 'think',
            content: thinkPart,
            time: this.getCurrentTime()
          });
        }

        // 添加回答消息
        this.messages.push({
          role: 'ai',
          content: answerPart || responseContent, // 兼容无标记的情况
          time: this.getCurrentTime()
        });
      } catch (error) {
        const errorMessage = error.data?.errorMessage || error.errMsg || '请求失败';
        this.messages.push({
          role: 'ai',
          content: `出错啦：${errorMessage}`,
          time: this.getCurrentTime()
        });
      } finally {
        this.loading = false;
        this.scrollToBottom();
      }
    },

    // 获取当前时间（HH:MM）
    getCurrentTime() {
      const now = new Date();
      return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    },

    // 滚动到底部
    scrollToBottom() {
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query.select('.message-list').boundingClientRect();
        query.exec(res => {
          if (res?.[0]?.height) {
            this.scrollTop = res[0].height + Math.random();
          }
        });
      });
    },
    // 新增响应解析方法
    parseResponse(content) {
      try {
        // 优化后的正则表达式，支持跨行匹配和标签格式变化
        const thinkPattern = /think\s*([\s\S]*?)\s*answer/i;
        const answerPattern = /answer\s*([\s\S]*)/i;

        const thinkMatch = content.match(thinkPattern);
        const answerMatch = content.match(answerPattern);

        return [
          thinkMatch ? thinkMatch[1].trim() : null,
          answerMatch ? answerMatch[1].trim() : content
        ];
      } catch {
        return [null, content];
      }
    }
  }
}
</script>

<style scoped>
/* 从home.vue复制的样式 */
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.message-list {
  flex: 1;
  padding: 20rpx;
  background-color: #f5f5f5;
}

.message-item {
  margin: 20rpx 0;
  max-width: 80%;
}

.message-content {
  padding: 20rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  line-height: 1.5;
}

.user-message {
  margin-left: auto;
}

.user-message .message-content {
  background-color: #007AFF;
  color: white;
}

.ai-message .message-content {
  background-color: #FFFFFF;
  border: 1rpx solid #eee;
}

.message-time {
  font-size: 20rpx;
  color: #999;
  margin-top: 10rpx;
  text-align: right;
}

/* 新增思考消息样式 */
.think-message .message-content {
  background-color: #fff3d4 !important;
  /* 浅黄色背景 */
  border: 1rpx solid #ffe6b3;
}

/* 调整消息项样式 */
.message-item[class*="-message"] {
  margin: 20rpx 0;
  max-width: 90%;
}

/* 修改AI消息最大宽度 */
.ai-message {
  max-width: 85%;
}

.input-area {
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
}

.input {
  flex: 1;
  border: 1rpx solid #ddd;
  border-radius: 40rpx;
  padding: 15rpx 30rpx;
  margin-right: 20rpx;
}

.send-button {
  background-color: #007AFF;
  color: white;
  border-radius: 40rpx;
  padding: 0 40rpx;
  transition: opacity 0.3s;
}

.send-button[disabled] {
  opacity: 0.6;
}

.loading-text {
  color: #999;
  text-align: center;
  padding: 20rpx;
}
</style>