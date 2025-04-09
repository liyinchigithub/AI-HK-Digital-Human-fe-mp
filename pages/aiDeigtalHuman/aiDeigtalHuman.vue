<template>
	<view class="render-content">
		<!-- #ifdef H5 -->
		<view v-if="isH5" ref="embedContainer" class="h5-container">
			<!-- 添加加载状态提示 -->
			<view v-if="loading" class="loading-mask">
				<text class="loading-text">AI助手加载中...</text>
			</view>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<web-view :src="renderUrl" class="web-view"
			webview-styles="titleNView:{autoBack: false, titleText: '慷慷AI助手'}"></web-view>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			APP_ID: 'ac9af420-a171-4960-91a6-7de288c54c9d',
			APP_CODE: 'embedzgLwGx2gZh2UtPkl6ihV',
			renderUrl: '',
			isH5: false,
			loading: true,
			retryCount: 0
		}
	},
	mounted() {
		// #ifdef H5
		this.initH5Environment();
		this.createSecurityMeta();
		// #endif
	},
	onLoad() {
		// #ifdef MP-WEIXIN
		this.initRenderUrl();
		// #endif
	},
	methods: {
		initRenderUrl() {
			// 添加随机参数避免缓存
			const timestamp = new Date().getTime();
			this.renderUrl = `https://wx.baeapps.com/api/ai_apaas/v1/web_embed/html?t=${timestamp}&app_id=${this.APP_ID}&code=${this.APP_CODE}`;
		},
		initH5Environment() {
			this.isH5 = true;
			this.$nextTick(() => {
				this.loadExternalScript();
			});
		},
		async loadExternalScript() {
			try {
				// 添加SDK加载状态检查
				if (window.EmbedWebSDK) {
					this.initSDK();
					return;
				}

				const script = document.createElement('script');
				script.src = `https://agi-dev-platform-web.bj.bcebos.com/ai_apaas/embed/output/embedFullSDK.js?t=${Date.now()}`;

				// 加强错误处理
				script.onerror = (e) => {
					if (this.retryCount < 3) {
						this.retryCount++;
						setTimeout(() => this.loadExternalScript(), 1000 * this.retryCount);
					} else {
						this.loading = false;
						console.error('脚本加载失败，请检查网络连接');
					}
				};

				script.onload = () => {
					this.initSDK();
				};

				document.head.appendChild(script);
			} catch (e) {
				console.error('脚本加载异常:', e);
			}
		},
		initSDK() {
			try {
				// 严格检查容器元素
				if (!this.$refs.embedContainer?.$el) {
					throw new Error('容器元素未找到');
				}

				// 初始化前等待容器渲染
				requestAnimationFrame(() => {
					new EmbedWebSDK({
						appId: this.APP_ID,
						code: this.APP_CODE,
						renderConfig: {
							width: '100%',
							height: '100%',
							container: this.$refs.embedContainer.$el
						}
					});
					this.loading = false;
				});
			} catch (e) {
				console.error('SDK初始化失败:', e);
				this.loading = false;
			}
		},
		createSecurityMeta() {
			const meta = document.createElement('meta');
			meta.httpEquiv = "Content-Security-Policy";
			meta.content = `
        default-src 'self' 
          https://agi-dev-platform-web.bj.bcebos.com 
          http://10.224.7.243:8080 
          ws://10.224.7.243:8080;
        script-src 'self' 
          'unsafe-inline' 
          'unsafe-eval' 
          https://agi-dev-platform-web.bj.bcebos.com 
          http://10.224.7.243:8080;
        connect-src 'self' 
          wss://* 
          ws://* 
          https://agi-dev-platform-web.bj.bcebos.com 
          http://10.224.7.243:8080;
        frame-src 'self' 
          https://agi-dev-platform-web.bj.bcebos.com 
          http://10.224.7.243:8080;
        img-src 'self' data: blob: https: http:;
        style-src 'self' 'unsafe-inline';
      `.replace(/\s+/g, ' ');
			document.head.appendChild(meta);
		}
	}
};
</script>

<style>
.render-content {
	width: 100%;
	height: 100vh;
}

/* #ifdef H5 */
.h5-container {
	width: 100%;
	height: 100%;
	position: relative;
	z-index: 999;
}

/* #endif */

/* #ifdef MP-WEIXIN */
.web-view {
	width: 100%;
	height: 100%;
}

/* #endif */

/* 新增加载状态样式 */
.loading-mask {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px;
  background: rgba(0,0,0,0.7);
  border-radius: 8px;
  color: white;
}

.loading-text {
  font-size: 14px;
}
</style>