<template>
	<!-- 容器必须设置固定宽高 -->
	<div id="appbuilder-container" 
	style="
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    isolation: isolate; 
    contain: strict;   
	"></div>
</template>

<script>
export default {
	// 添加组件实例变量
	data() {
		return {
			sdkInstance: null
		}
	},
	mounted() {
		this.initAppBuilder()
	},

	methods: {
		initAppBuilder() {
			// 添加DOM环境检查
			if (typeof document === 'undefined') return;

			const script = document.createElement('script')
			script.src = 'https://agi-dev-platform-web.bj.bcebos.com/ai_apaas/embed/output/embedFullSDK.js?responseExpires=0'
			script.onload = () => {
				this.$nextTick(() => {
					// 保存SDK实例到组件变量
					this.sdkInstance = new EmbedWebSDK({
						appId: 'ac9af420-a171-4960-91a6-7de288c54c9d',
						code: 'embedzgLwGx2gZh2UtPkl6ihV',
						renderConfig: {
							width: '100%',
							height: '100%',
							container: document.getElementById('appbuilder-container')
						}
					})
				})
			}
			document.body.appendChild(script)
		}
	},

	beforeDestroy() {
		// 添加实例销毁逻辑
		if (this.sdkInstance) {
			this.sdkInstance.destroy()  // 假设SDK有destroy方法
			this.sdkInstance = null
		}
		const container = document.getElementById('appbuilder-container')
		if (container) container.innerHTML = ''
	}
}
</script>