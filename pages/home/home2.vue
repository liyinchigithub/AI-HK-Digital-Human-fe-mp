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
      <button class="voice-btn" @touchstart="startRecord" @touchend="stopRecord"
        :class="{ recording: isRecording }"></button>
      <input class="input" v-model="inputText" placeholder="请输入问题" @confirm="sendMessage" :disabled="loading" />
      <button class="send-button" @click="sendMessage" :disabled="loading">
        {{ loading ? '发送中...' : '发送' }}
      </button>
    </view>
  </view>
</template>

<script>
// 修改插件引入方式
let manager = null;
if (uni.getSystemInfoSync().platform === 'mp-weixin') {
  const plugin = requirePlugin("WechatSI");
  manager = plugin.getRecordRecognitionManager();
}
export default {
  data() {
    return {
      messages: [],       // 消息列表
      inputText: '',      // 输入内容
      loading: false,     // 加载状态
      scrollTop: 0,       // 滚动位置
      isRecording: false, // 录音状态
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
      this.inputText = '';
      this.scrollToBottom();

      try {
        this.loading = true;
        // 创建AI消息占位
        const aiMessage = {
          role: 'ai',
          content: '',
          time: this.getCurrentTime()
        };
        this.messages.push(aiMessage);
        const aiIndex = this.messages.length - 1;

        const requestTask = uni.request({
          url: 'https://homechat-effassits-popgjiyphu.cn-hangzhou.fcapp.run/v1/chat/completions',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'token': uni.getStorageSync('token') || '',
            'Accept': 'text/event-stream',
            'Accept-Charset': 'utf-8'
          },
          data: {
            messages: [{ role: 'user', content: userMessage.content }],
            stream: true
          },
          enableChunked: true,
          success: (res) => {
            console.log('请求成功:', res);
            if (!res.data) {
              this.handleError('响应数据为空');
              return;
            }

            // 判断是否为H5环境（非流式数据）
            if (typeof res.data === 'string') {
              this.processH5Response(res.data, aiIndex);
              return;
            }

            // 微信小程序流式处理
            if (res.data && typeof res.data.on === 'function') {
              let buffer = '';
              const decoder = new TextDecoder('utf-8');

              res.data.on('data', (chunk) => {
                try {
                  const text = decoder.decode(chunk, { stream: true });
                  buffer += text;
                  this.processStreamData(buffer, aiIndex);
                } catch (e) {
                  console.error('处理数据块出错:', e);
                }
              });

              res.data.on('end', () => {
                this.loading = false;
              });

              res.data.on('error', (err) => {
                this.handleError('数据流错误');
              });
            }
          },
          fail: (err) => {
            this.handleError(`请求失败: ${err.errMsg}`);
          }
        });

        this.requestTask = requestTask;
      } catch (error) {
        console.error('捕获到异常:', error);
        this.handleError(`系统错误: ${error.message}`);
      }
    },

    // 其他方法保持不变
    getCurrentTime() {
      const now = new Date();
      return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    },

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
    },// 修改语音识别管理器初始化
    initVoiceManager() {
      if (uni.getSystemInfoSync().platform === 'mp-weixin' && manager) {
        manager.onStart = (res) => {
          console.log("成功开始录音识别", res);
        };

        manager.onStop = (res) => {
          console.log("录音文件路径:", res.tempFilePath);
          console.log("识别结果:", res.result);
          if (res.result) {
            this.inputText = res.result;
            this.sendMessage();
          }
        };

        manager.onError = (res) => {
          console.error("语音识别错误:", res.msg);
          uni.showToast({
            title: '语音识别失败',
            icon: 'none'
          });
        };
      }
    },
    processStreamData(buffer, aiIndex) {
      let currentContent = this.messages[aiIndex].content || '';
      // 使用正则表达式分割多个换行符
      const events = buffer.split(/\n\n+/);
      buffer = events.pop() || '';

      events.forEach(event => {
        if (event.startsWith('data: ')) {
          const data = event.substring(6).trim();
          if (data === '[DONE]') {
            this.loading = false;
            return;
          }

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content || '';
            if (content) {
              currentContent += content;
              this.messages[aiIndex].content = currentContent;
              // 每次拼接后强制刷新视图
              this.$nextTick(() => {
                this.$forceUpdate();
                this.scrollToBottom();
              });
            }
          } catch (e) {
            console.error('解析JSON失败:', e, '原始数据:', data);
          }
        }
      });
    },

    processH5Response(data, aiIndex) {
      let accumulatedContent = '';
      // 使用正则表达式分割多个换行符
      const events = data.split(/\n\n+/);

      events.forEach(event => {
        if (event.startsWith('data: ')) {
          const jsonStr = event.substring(6).trim();
          if (jsonStr === '[DONE]') {
            this.loading = false;
            return;
          }

          try {
            const json = JSON.parse(jsonStr);
            const content = json.choices?.[0]?.delta?.content || '';
            if (content) {
              accumulatedContent += content;
              this.messages[aiIndex].content = accumulatedContent;
              this.$forceUpdate();
              this.scrollToBottom();
            }
          } catch (e) {
            console.error('解析JSON失败:', e, '原始数据:', jsonStr);
          }
        }
      });
      this.loading = false;
    }
  },
  mounted() {
    this.initVoiceManager();
  }
}
</script>

<style scoped>
/* 样式部分保持不变 */
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

.think-message .message-content {
  background-color: #fff3d4 !important;
  border: 1rpx solid #ffe6b3;
}

.message-item[class*="-message"] {
  margin: 20rpx 0;
  max-width: 90%;
}

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

.voice-btn {
  position: fixed;
  margin-top: 20rpx;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%) scale(1);
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  background: linear-gradient(90deg, #CD56FF, #833AD6);
  border: 4rpx solid rgba(250, 121, 255, 0.8);
  box-shadow: 0px 7rpx 18rpx 0px rgba(107, 14, 195, 0.38);
  background-image: url('/static/语音.png');
  background-size: 80rpx 80rpx;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 9999;
}

.voice-btn.recording {
  background: #ff4d4d;
  animation: pulse 1.5s infinite;
  background-image: url('/static/语音.png');
  background-size: 80rpx 80rpx;
  background-position: center;
  background-repeat: no-repeat;
}

@keyframes pulse {
  0% {
    transform: translateX(-50%) scale(1);
  }

  50% {
    transform: translateX(-50%) scale(1.1);
  }

  100% {
    transform: translateX(-50%) scale(1);
  }
}
</style>