<template>
  <view class="container">
    <!-- 消息列表 -->
    <scroll-view 
      class="message-list" 
      scroll-y 
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
    >
      <view 
        v-for="(item, index) in messages" 
        :key="index"
        class="message-item"
        :class="[item.role === 'user' ? 'user-message' : 'ai-message']"
      >
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
      <input 
        class="input" 
        v-model="inputText" 
        placeholder="请输入问题" 
        @confirm="sendMessage"
        :disabled="loading"
      />
      <button 
        class="send-button" 
        @click="sendMessage"
        :disabled="loading"
      >{{ loading ? '发送中...' : '发送' }}</button>
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
      sessionId: ''       // 会话ID（用于多轮对话）
    };
  },
  methods: {
    // 发送消息
    async sendMessage() {
      if (!this.inputText.trim() || this.loading) return;

      // 添加用户消息
      const userMessage = {
        role: 'user',
        content: this.inputText,
        time: this.getCurrentTime()
      };
      this.messages.push(userMessage);
      
      // 保存问题并清空输入
      const question = this.inputText;
      this.inputText = '';
      this.scrollToBottom();

      try {
        this.loading = true;
        
        // 调用云函数
        const { result } = await uniCloud.callFunction({
          name: 'qianfan-chat',
          data: {
            query: question,
            sessionId: this.sessionId // 传递会话ID
          }
        });

        if (result.code === 0) {
          // 添加AI回复
          this.messages.push({
            role: 'ai',
            content: result.data.response,
            time: this.getCurrentTime()
          });
          
          // 更新会话ID（如果有多轮对话）
          if (result.data.sessionId) {
            this.sessionId = result.data.sessionId;
          }
        } else {
          throw new Error(result.msg);
        }
      } catch (error) {
        console.error('请求失败:', error);
        this.messages.push({
          role: 'ai',
          content: `出错啦：${error.message}`,
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
    }
  }
}
</script>

<style scoped>
/* 样式部分与之前保持一致 */
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