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
				<input class="input" v-model="inputText" placeholder="请输入问题" @confirm="sendMessage"
					:disabled="loading" />
				<button class="send-button" @click="sendMessage" :disabled="loading">
					{{ loading ? '发送中...' : '发送' }}
				</button>
		</view>

		<moFab v-model:showPanel="showAIPanel" @click="handleFabClick" @panel-toggle="handlePanelToggle">
			<template #content>
				<image src="/static/ai语音管家.png" style="width: 60rpx; height: 60rpx;"></image>
			</template>
			<template #ai-content>
				<view class="ai-panel-content">
					<view class="close-btn" @tap="handleClosePanel">×</view>
					<scroll-view class="ai-message-list" scroll-y :style="{ maxHeight: isExpanded ? 'none' : '70vh' }">
						<view v-for="(item, index) in aiPanelMessages" :key="index" class="message-item"
							:class="[item.role === 'user' ? 'user-message' : 'ai-message']">
							<view class="message-content"
								:class="{ collapsed: !isExpanded && index < aiPanelMessages.length - 2 }">
								{{ item.content }}
							</view>
						</view>
					</scroll-view>

					<!-- 添加展开/收起控制 -->
					<!-- <view v-if="aiPanelMessages.length > 1" class="expand-control" @click="isExpanded = !isExpanded">
						{{ isExpanded ? '收起' : '展开历史记录' }}
					</view> -->

					<!-- 修改语音按钮定位 -->
					<button class="voice-btn" @touchstart="startVoiceInput" @touchend="endVoiceInput"
						:class="{ recording: isRecording }"></button>
				</view>
			</template>
		</moFab>

	</view>
</template>

<script>
import moFab from "@/components/mo-fab/mo-fab.vue"
import moFabTab from "@/components/mo-fab/mo-fab-tabbar.vue"
export default {
	data() {
		return {
			showAIPanel: false,
			messages: [], // 主界面消息列表
			aiPanelMessages: [], // 改为只存储最新AI回复
			inputText: '', // 输入内容
			loading: false, // 加载状态
			scrollTop: 0, // 滚动位置
			isRecording: false,
			tempFilePath: '',
			dir: 1,
			isExpanded: false, // 展开状态控制

		};
	},
	computed: {
		// 计算属性，返回当前方向的文本
		dirText() {
			return this.dir == 1 ? '左' : '右'
		}
	},
	components: {
		moFab,
		moFabTab,
	},
	methods: {
		// 发送消息
		handleFabClick() {
			console.log('Fab clicked, current showAIPanel:', this.showAIPanel);
		},
		// 发送消息
		handlePanelToggle(state) {
			console.log('Panel state:', state);
			this.showAIPanel = state;
		},
		// 发送消息
		async sendMessage() {
			if (!this.inputText.trim() || this.loading) return;

			// 获取或创建会话
			let session = uni.getStorageSync('qianfan_session');
			if (!session?.conversation_id || !session?.request_id) {
				try {
					const { result } = await uniCloud.callFunction({
						name: 'qianfan-chat',
						data: {
							action: 'create_session',
							baseUrl: uni.getStorageSync('baseUrl') || 'https://qianfan.baidubce.com' // 添加baseUrl参数
						}
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
						baseUrl: uni.getStorageSync('baseUrl') || 'https://qianfan.baidubce.com' // 添加baseUrl参数
					},
					timeout: 60000
				});

				if (result.code === 0) {
					const aiResponse = result.data.response || '未收到有效回复';
					// 主界面保留完整对话
					this.messages.push({
						role: 'ai',
						content: aiResponse,
						time: this.getCurrentTime()
					});

					// 弹窗只保留最新AI回复
					this.aiPanelMessages = [
						{
							role: 'user',
							content: question,  // 使用发送时的question变量
							time: this.getCurrentTime()
						},
						{
							role: 'ai',
							content: aiResponse,
							time: this.getCurrentTime()
						}];

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
		// 新增检查音频文件的方法
		async checkAudioFile(filePath) {
			try {
				console.log('正在检查文件:', filePath);
				const fileInfo = await uni.getFileInfo({
					filePath: filePath
				});
				console.log('音频文件信息:', fileInfo);

				if (fileInfo.errMsg === 'getFileInfo:ok') {
					const audio = uni.createInnerAudioContext();
					audio.src = filePath;
					audio.onError((e) => {
						console.error('音频播放失败:', e);
					});
					audio.play();
					console.log('尝试播放音频...');
				} else {
					console.error('文件检查失败:', fileInfo.errMsg);
				}
			} catch (e) {
				console.error('文件检查异常:', e);
			}
		},
		// 语音处理方法
		startVoiceInput() {
			this.isRecording = true;
			uni.startRecord({
				format: 'silk', // 改为silk格式以匹配实际生成的文件
				sampleRate: 16000, // 设置采样率
				numberOfChannels: 1, // 单声道
				success: res => {
					console.log('录音成功，临时文件路径:', res.tempFilePath);
					this.tempFilePath = res.tempFilePath;
					// 立即检查文件是否存在
					this.checkAudioFile(res.tempFilePath);
				},
				fail: (err) => {
					console.error('录音失败:', err);
					this.isRecording = false;
				}
			});
		},

		async endVoiceInput() {
			this.isRecording = false;
			uni.stopRecord({
				success: () => {
					console.log('录音已停止，文件路径:', this.tempFilePath); // 添加日志
					// 可以在这里添加文件检查逻辑
					this.checkAudioFile(this.tempFilePath);
				}
			});

			try {
				console.log('开始上传文件...');
				const res = await uniCloud.uploadFile({
					filePath: this.tempFilePath,
					cloudPath: `voice/${Date.now()}.wav`
				});
				console.log('文件上传结果:', res); // 检查文件是否上传成功

				const { result } = await uniCloud.callFunction({
					name: 'speech-to-text',
					data: { fileID: res.fileID }
				});

				if (result.code === 0) {
					// 将识别结果添加到消息列表
					this.messages.push({
						role: 'user',
						content: result.text,
						time: this.getCurrentTime()
					});
					this.aiPanelMessages.push(msg); // 新增
					// 自动发送识别结果
					this.inputText = result.text;
					await this.sendMessage();

					// 滚动到底部显示最新消息
					this.scrollToBottom();
				}
			} catch (error) {
				console.error('语音识别失败:', error);
				uni.showToast({
					title: '语音识别失败',
					icon: 'none'
				});
			}
		},
		// 获取当前时间（HH:MM）
		getCurrentTime() {
			const now = new Date();
			return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
		},
		handleClosePanel() {
			this.showAIPanel = false;
			console.log('关闭弹窗，当前状态：', this.showAIPanel);
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
.container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.message-list {
	flex: 1;
	padding: 20rpx;
	background-color: #f5f5f5;
	width: 100vw;
	overflow-x: hidden;
}

.message-item {
	margin: 20rpx 0;
	max-width: 80%;
	width: fit-content;
}

.message-content {
	padding-top: 10rpx;
	/* 增加内容顶部间距 */
	padding: 20rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
	line-height: 1.5;
	word-break: break-word;
}


.user-message {
	margin-left: auto;
	margin-right: 25rpx;
}

.user-message .message-content {
	background-color: #007AFF;
	color: white;
	max-width: 100%;
	padding: 20rpx 25rpx;
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

/* AI悬浮窗口样式 */
.ai-panel {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 90%;
	height: 85%;
	background: white;
	border-radius: 20rpx;
	box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.2);
	z-index: 999;
	display: flex;
	flex-direction: column;
}

.ai-panel-header {
	height: 30%;
	position: relative;
}

.ai-gif {
	width: 100%;
	height: 100%;
}

.close-btn {
	position: absolute;
	right: 20rpx;
	top: 20rpx;
	font-size: 40rpx;
	width: 50rpx;
	height: 50rpx;
	text-align: center;
	line-height: 50rpx;
	background: rgba(0, 0, 0, 0.2);
	border-radius: 50%;
	color: white;
}

.ai-panel-content {
	position: relative;
	height: 90vh;
	padding: 0 20rpx 150rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	/* 新增垂直居中 */
}

.ai-message-list {
	width: 100%;
	/* 使用全宽 */
	padding: 0 20rpx;
	/* 添加左右内边距 */
	max-height: 80vh !important;
}

.message-item {
	margin: 0 0 20rpx;
	/* 调整外边距 */
	width: 100%;
}

/* 弹窗用户消息样式 */
.ai-panel-content .user-message .message-content {
	background: transparent !important;
	/* 移除背景 */
	border: none !important;
	/* 移除边框 */
	color: #2B85E4;
	margin: 10rpx 0;
	/* 简化边距 */
	padding: 10rpx;
	/* 减少内边距 */
	box-shadow: none !important;
	/* 移除阴影 */
}

/* 弹窗AI消息样式 */
.ai-panel-content .ai-message .message-content {
	background: transparent !important;
	border: none !important;
	color: #333;
	margin: 10rpx 0;
	padding: 10rpx;
	box-shadow: none !important;
}

/* 调整折叠条件 */
.message-content.collapsed {
	-webkit-line-clamp: 3;
	/* 显示更多行数 */
	max-height: 120rpx;
}

/* 展开控制按钮 */
.expand-control {
	text-align: center;
	color: #007AFF;
	padding: 10rpx;
	font-size: 24rpx;
}

.voice-btn {
	position: fixed;
	margin-top: 20rpx;
	bottom: 40rpx;
	/* 增加底部间距 */
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
	/* 提升层级 */
}

.voice-btn.recording {
	background: #ff4d4d;
	animation: pulse 1.5s infinite;
	/* 保持录音状态下的背景图片 */
	background-image: url('/static/语音.png');
	background-size: 80rpx 80rpx;
	background-position: center;
	background-repeat: no-repeat;
}

@keyframes pulse {
	0% {
		transform: translateX(-50%) scale(1);
		/* 保持定位转换 */
	}

	50% {
		transform: translateX(-50%) scale(1.1);
		/* 合并转换属性 */
	}

	100% {
		transform: translateX(-50%) scale(1);
	}
}
</style>