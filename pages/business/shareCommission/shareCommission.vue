<template>
	<view>
		<!-- 分享赚佣金：好友购买，分享者就有佣金，无需申请 -->
		<!-- 我的佣金 -->
		<view class="my-commission">
			<text>已赚佣金：0元</text>
		</view>
		<!-- 去分享按钮 -->
		<view class="share-button">
			<u-button class="share-button" type="primary" @click="showGuideMask=true">去分享</u-button>
		</view>
		<!-- 赚佣金规则图片 -->
		<view class="my-commission-rule">
			<image class="responsive-image" :src="imageUrl" mode="widthFix" />
		</view>
		<view v-if="showGuideMask" class="mask">
			<view class="guide-content">
				<image class="guide-image" src="/static/wx_share.png" mode="widthFix" @click="closeGuide"/>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imageUrl: '', // 从缓存中获取图片URL
			showGuideMask: false
		};
	},
	methods: {
		getShareCommission() {
			// 读取缓存中的基础数据，获取分享赚佣金说明规则图片
			const basicInformation = uni.getStorageSync('basicInformation');
			console.log("basicInformation", basicInformation)
			this.imageUrl = basicInformation.shareCommission.url;
			console.log("this.imageUrl", this.imageUrl)
		},
		// 显示分享菜单（无效）
		showShareMenu() {
			uni.showShareMenu({
				withShareTicket: true,
				success() {
					console.log('分享菜单显示成功');
				},
				fail(err) {
					console.error('分享菜单显示失败:', err);
				}
			});
		},
		// 关闭引导弹窗
		closeGuide() {
			this.showGuideMask = false;
		},// 页面跳转，并判断是否已登录
		

	},
	mounted() {
		this.getShareCommission();
	},
	// 分享微信好友
	onShareAppMessage() {
		const openID = uni.getStorageSync('openID');
		return {
			title: "上上吉",
			path: `/pages/home/home?shareOpenID=${openID}`, // 将OpenID附加到分享路径
		};
	},
	// 分享微信朋友圈
	onShareTimeline() {
		const openID = uni.getStorageSync('openID');
		return {
			title: "上上吉",
			imageUrl: "https://mp-dd83b993-208c-425c-ac98-4edc7f22b3c8.cdn.bspapp.com/logo.png",
			query: `shareOpenID=${openID}`, // 将OpenID附加到分享路径
		};
	},
};
</script>

<style>
.my-commission {
	text-align: center;
	font-size: 24px;
	font-weight: bold;
	margin-top: 20px;
	color: #f30606;
}

.responsive-image {
	width: 100%;
	height: auto;
}

.share-button {
	margin-top: 20px;
	margin-left: 20px;
	margin-right: 20px;
	color: #fff;
	background-color: #71d5a1;
}

.my-commission-rule {
	margin-top: 20px;
	margin-left: 20px;
	margin-right: 20px;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.guide-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.guide-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片覆盖整个区域 */
}

.guide-content text, .guide-content button {
  position: absolute;
  bottom: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
}
</style>
