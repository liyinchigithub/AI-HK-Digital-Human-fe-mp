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
      <button class="voice-button" 
              @touchstart="startVoiceInput" 
              @touchend="endVoiceInput"
              :class="{ recording: isRecording }">
        {{ isRecording ? '录音中...' : '按住说话' }}
      </button>
      
      <input class="input" v-model="inputText" 
             placeholder="请输入问题" @confirm="sendMessage"
             :disabled="loading"/>
      
      <button class="send-button" @click="sendMessage"
              :disabled="loading">
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
      isRecording: false,
      tempFilePath: ''
    };
  },
  methods: {
    // 发送消息
    async sendMessage() {
      if (!this.inputText.trim() || this.loading) return;

      // 获取或创建会话
      let session = uni.getStorageSync('qianfan_session');
      // 如果没有会话，创建一个新的会话
      if (!session?.conversation_id || !session?.request_id) {
        try {
          const { result } = await uniCloud.callFunction({
            name: 'qianfan-chat',
            data: { action: 'create_session' }
          });
          
          if (result.code === 0) {
            session = {
              conversation_id: result.data.conversation_id,
              request_id: result.data.request_id
            };
            uni.setStorageSync('qianfan_session', session);
          }
        } catch (e) {
          console.error('会话创建失败:', e);
          return;
        }
      }

      // 发送消息逻辑
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
        const { result } = await uniCloud.callFunction({
          name: 'qianfan-chat',
          data: {
            query: question,
            conversation_id: session.conversation_id,
            // request_id: session.request_id
          },
          timeout: 60000 // 增加前端调用超时时间（单位：毫秒）
        });

        if (result.code === 0) {
          const aiResponse = result.data.response || '未收到有效回复';
          this.messages.push({
            role: 'ai',
            content: aiResponse,
            time: this.getCurrentTime()
          });
          
          // 更新会话信息
          if (result.data?.conversation_id) {
            session.conversation_id = result.data.conversation_id;
            uni.setStorageSync('qianfan_session', session);
          }
        }
      } catch (error) {
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

    // 语音处理方法
    startVoiceInput() {
      this.isRecording = true;
      uni.startRecord({
        success: res => {
          this.tempFilePath = res.tempFilePath;
        }
      });
    },

    async endVoiceInput() {
      this.isRecording = false;
      uni.stopRecord();

      // 上传语音文件
      const res = await uniCloud.uploadFile({
        filePath: this.tempFilePath,
        cloudPath: `voice/${Date.now()}.wav`
      });

      // 调用语音识别云函数
      const { result } = await uniCloud.callFunction({
        name: 'speech-to-text',
        data: { fileID: res.fileID }
      });

      if (result.code === 0) {
        this.inputText = result.text;
        await this.sendMessage();
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


/* 添加语音按钮样式 */
.voice-button {
  /* padding: 10px 15px; */
  background-color: #71d5a1;
  color: white;
  border-radius: 20px;
  margin-right: 10px;
}

.recording {
  background-color: #ff4d4d;
}
</style>