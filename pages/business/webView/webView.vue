<template>
	<view>
		<web-view :src="webUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webUrl: ""
			}
		},
		onLoad(options) {
			if (options.url) {
				this.webUrl = decodeURIComponent(options.url);
			}
		}
	}
</script>

<style scoped>
/* 添加样式 */
</style>