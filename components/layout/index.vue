<template>
	<view class="bg">
		<slot />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.bg {
		// background: url(https://oss.oact.net/BgPic/0-1574245836804095370.png?x-oss-process=image/resize,w_750,/format,jpg/quality,Q_80) no-repeat;
		// margin-top: 30rpx;
		background-position: center;
		background-size: 100%;
		height: 100vh;
		position: fixed;
		top: 10;
		left: 0;
		width: 100%;
		overflow: scroll;
	}
</style>
