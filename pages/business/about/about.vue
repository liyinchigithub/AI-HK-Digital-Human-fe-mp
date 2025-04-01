<template>
	<view class="about-container">
		<view class="header">
		</view>
		<view class="logo">
			<!-- logo图片 -->
			<image :src="logo" alt="Logo" class="logo-image"  />
		</view>
		<view class="menu">
			<view class="menu-item" @click="navigateTo('/pages/business/serviceAgreement/serviceAgreement')">服务协议</view>
			<view class="menu-item" @click="navigateTo('/pages/business/privacyPolicy/privacyPolicy')">隐私政策</view>
			<view class="menu-item" @click="navigateTo('/pages/business/disclaimer/disclaimer')">责任声明</view>
			<!-- <view class="menu-item">设置</view> -->
			<view class="menu-item">当前版本 <span class="version">1.0.0</span></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 这里可以添加数据
				logo: ''
			}
		},
		methods: {
			// 这里可以添加方法

			getLogo() {
				// 读取缓存basicInformation
				const basicInformation = uni.getStorageSync('basicInformation');
				console.log("about basicInformation", basicInformation);
				// 读取logo
				this.logo = basicInformation.logo.url;
				console.log("about logo", this.logo);
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			}

		},

		onLoad() {
			this.getLogo();
		}
	}
</script>
<style scoped>
.about-container {
	padding: 20px;
	background-color: #f9f9f9;
}

.header {
	text-align: center;
	font-size: 24px;
	margin-bottom: 20px;
}

.logo {
	text-align: center;
	margin-bottom: 20px;
}

.logo-image {
	width: 200px;
	height: 200px;
	display: block;
	margin: 0 auto;
}

.menu {
	background-color: #fff;
	border-radius: 8px;
	padding: 10px;
}

.menu-item {
	padding: 15px;
	border-bottom: 1px solid #eee;
}

.menu-item:last-child {
	border-bottom: none;
}

.version {
	float: right;
	color: #888;
}
</style>