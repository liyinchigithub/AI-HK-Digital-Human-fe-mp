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
      />
      <button class="send-button" @click="sendMessage">发送</button>
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
      scrollTop: 0        // 滚动位置
    };
  },
  methods: {
    // 发送消息
    async sendMessage() {
      if (!this.inputText.trim()) return

      // 添加用户消息
      const userMessage = {
        role: 'user',
        content: this.inputText,
        time: this.getCurrentTime()
      }
      this.messages.push(userMessage)
      
      // 清空输入
      const question = this.inputText
      this.inputText = ''
      
      // 滚动到底部
      this.scrollToBottom()

      try {
        this.loading = true
        
        // 调用AI接口（示例用模拟接口）
        const aiResponse = await this.mockAIRequest(question)
        
        // 添加AI回复
        this.messages.push({
          role: 'ai',
          content: aiResponse,
          time: this.getCurrentTime()
        })
        
      } catch (error) {
        console.error('请求失败:', error)
        this.messages.push({
          role: 'ai',
          content: '请求出错，请稍后重试',
          time: this.getCurrentTime()
        })
      } finally {
        this.loading = false
        this.scrollToBottom()
      }
    },

    // 模拟AI请求
    mockAIRequest(question) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(`这是关于【${question}】的模拟回答，实际开发中替换为真实AI接口。\n建议使用axios调用真实API。`)
        }, 1500)
      })
    },

    // 获取当前时间
    getCurrentTime() {
      const now = new Date()
      return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
    },

    // 滚动到底部
    scrollToBottom() {
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this)
        query.select('.message-list').boundingClientRect()
        query.exec(res => {
          if (res && res[0]) {
            this.scrollTop = res[0].height + Math.random() // 随机数强制刷新
          }
        })
      })
    }
  }
}
</script>

<style scoped>
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
}

.loading-text {
  color: #999;
  text-align: center;
  padding: 20rpx;
}
</style>