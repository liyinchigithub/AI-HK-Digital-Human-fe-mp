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
		<moFab v-model:showPanel="showAIPanel" @click="handleFabClick" @panel-toggle="handlePanelToggle">
			<template #content>
				<image src="/static/ai语音管家.png" style="width: 60rpx; height: 60rpx;"></image>
			</template>
			<template #ai-content>
				<scroll-view class="ai-message-list" scroll-y>
					<view v-for="(item, index) in messages" :key="index" class="message-item"
						:class="[item.role === 'user' ? 'user-message' : 'ai-message']">
						<view class="message-content">
							{{ item.content }}
						</view>
					</view>
				</scroll-view>
				<button class="voice-btn" @touchstart="startVoiceInput" @touchend="endVoiceInput"
					:class="{ recording: isRecording }">
					<!-- <image src="/static/mic-icon.png" style="width: 40rpx; height: 40rpx;"></image> -->
				</button>
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
			messages: [], // 消息列表
			inputText: '', // 输入内容
			loading: false, // 加载状态
			scrollTop: 0, // 滚动位置
			isRecording: false,
			tempFilePath: '',
			dir: 1,
			tabBarList: [
				{
					"pagePath": "pages/tabBar/home/index",
					"text": "首页"
				},
				{
					"pagePath": "pages/tabBar/order/index",
					"text": "订单"
				},
				{
					"pagePath": "pages/tabBar/customer/index",
					"text": "客户"
				}
			]
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
		moFabTab
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
					},
					timeout: 60000
				});

				if (result.code === 0) {
					const aiResponse = result.data.response || '未收到有效回复';
					this.messages.push({
						role: 'ai',
						content: aiResponse,
						time: this.getCurrentTime()
					});

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
				},
				fail: (err) => {
					console.error('录音失败:', err);
					this.isRecording = false;
				}
			});
		},

		async endVoiceInput() {
			this.isRecording = false;
			uni.stopRecord();

			try {
				const res = await uniCloud.uploadFile({
					filePath: this.tempFilePath,
					cloudPath: `voice/${Date.now()}.wav`
				});

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
	padding: 20rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
	line-height: 1.5;
	word-break: break-word;
}

.input-area {
	display: flex;
	padding: 20rpx;
	background-color: #fff;
	border-top: 1rpx solid #eee;
	width: 100vw;
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

.input {
	flex: 1;
	border: 1rpx solid #ddd;
	border-radius: 40rpx;
	padding: 15rpx 30rpx;
	margin-right: 15rpx;
}

.send-button {
	background-color: #007AFF;
	color: white;
	border-radius: 40rpx;
	padding: 0 30rpx;
	min-width: 120rpx;
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
	width: 80%;
	height: 70%;
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
	flex: 1;
	padding: 20rpx;
	display: flex;
	flex-direction: column;
}

.ai-message-list {
	flex: 1;
	margin-bottom: 20rpx;
}

.voice-btn {
	align-self: center;
	margin-top: 70%;
	width: 150rpx;
	height: 150rpx;
	border-radius: 50%;
	/* 修改为与mo-fab相同的渐变效果 */
	background: linear-gradient(90deg, #CD56FF, #833AD6);
	display: flex;
	justify-content: center;
	align-items: center;
	border: 4rpx solid rgba(250, 121, 255, 0.8);
	box-shadow: 0px 7rpx 18rpx 0px rgba(107, 14, 195, 0.38);
	/* 保留语音图标样式 */
	background-image: url('/static/语音.png');
	background-size: 80rpx 80rpx;
	background-position: center;
	background-repeat: no-repeat;
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
		transform: scale(1);
	}

	50% {
		transform: scale(1.1);
	}

	100% {
		transform: scale(1);
	}
}
</style>