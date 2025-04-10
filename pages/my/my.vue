<template>
	<view>
		<view class="header">
			<!-- 用户信息 -->
			<view class="userinfo">
				<view class="face" @click="isLogout()">
					<image :src="avatarSrc"></image>
				</view>
				<view class="info">
					<!-- 微信昵称 -->
					<view class="username" v-if="isLoggedIn" @click="copyNickName">{{ nickName }}</view>
					<view v-else>
						<u-row>
							<u-col span="12">
								<text @click="goto('/pages/business/login/login')" class="login-text">登录/注册</text>
							</u-col>
						</u-row>
						<u-row>
							<u-col span="15">
								<text @click="goto('/pages/business/login/login')" class="login-text-tip">立即登录
									体验更多精彩</text>
							</u-col>
						</u-row>
					</view>
					<!-- 微信openID -->
					<view class="openID" @click="copyOpenID">{{ openID }}</view>
					<view class="openID" @click="copyPhoneNumber">{{ phoneNumber }}</view>
				</view>
			</view>
		</view>
		<view class="orders">
			<view class="box">
				<view class="label" v-for="(row, index) in tabList" :key="row.name" hover-class="hover"
					@tap="toOrderType(index)">
					<view class="icon">
						<!-- 数量 -->
						<view class="badge" v-if="row.badge > 0">{{ row.badge }}</view>
						<!-- 小红点 -->
						<view v-if="row.name === '我的消息' && hasUnreadMessages" class="red-dot"></view>
						<!-- icon -->
						<view class="">
							<image :src="baseUrl + row.icon"></image>
						</view>
					</view>
					<view class="">
						{{ row.name }}
					</view>
				</view>
			</view>
		</view>
		<view class="list">
			<view class="li" @tap="shareCommission">
				<view class="icon">
					<image :src="baseUrl + 'commission.png'"></image>
				</view>
				<view class="text">分享赚佣金</view>
				<image class="to" :src="baseUrl + 'arrow.png'"></image>
			</view>
			<view class="li" @tap="contactCustomerService">
				<view class="icon">
					<image :src="baseUrl + 'customerService.png'"></image>
				</view>
				<view class="text">联系客服</view>
				<image class="to" :src="baseUrl + 'arrow.png'"></image>
			</view>
			<view class="li" @tap="feedback">
				<view class="icon">
					<image :src="baseUrl + 'feedback.png'"></image>
				</view>
				<view class="text">意见反馈</view>
				<image class="to" :src="baseUrl + 'arrow.png'"></image>
			</view>
			<view class="li" @tap="about">
				<view class="icon">
					<image :src="baseUrl + 'about.png'"></image>
				</view>
				<view class="text">关于我们</view>
				<image class="to" :src="baseUrl + 'arrow.png'"></image>
			</view>
			<view class="li" @tap="logout">
				<view class="icon">
					<image :src="baseUrl + 'logout.png'"></image>
				</view>
				<view class="text">登录退出</view>
				<image class="to" :src="baseUrl + 'arrow.png'"></image>
			</view>
		</view>
		<u-popup :show="showPopup" @close="showPopup = false" mode="bottom">
			<view class="popup-content">
				<view>请选择咨询方式</view>
				<view class="popup-button">
					<u-button class="popup-button" type="primary" open-type="contact" @click="contactOnline">在线客服
						(0:00–24:00)</u-button>
				</view>
				<view class="popup-button">
					<u-button class="popup-button" type="primary" @click="contactPhone">电话客服 (0:00–24:00)</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			baseUrl: "https://mp-dd83b993-208c-425c-ac98-4edc7f22b3c8.cdn.bspapp.com/cloudstorage/",
			nickName: "",
			avatarSrc: "",
			openID: "",
			phoneNumber: "",
			isLoggedIn: false,
			showPopup: false,
			tabList: [
				{
					name: "收藏",
					icon: "collect.png",
				},
				{
					name: "优惠券",
					icon: "coupon.png",
				},
				{
					name: "吉币",
					icon: "points.png",
				},
				{
					name: "消息",
					icon: "notice.png",
				},
			],
			hasUnreadMessages: false, // 是否有未读消息
		};
	},
	onShow() {
		this.init();
	},
	onHide() {
		this.init();
	},
	onLoad() {
		console.log(`当前页面:my`);
		this.init();
	},
	methods: {
		// 初始化
		init() {
			// 读取缓存内容
			const userInfo = uni.getStorageSync("userInfo");
			this.nickName = userInfo.nickName || "";
			this.openID = uni.getStorageSync("openID");
			this.token = uni.getStorageSync("token");
			this.phoneNumber = uni.getStorageSync("phoneNumber") || "未绑定手机";  // 手机号获取

			this.isLoggedIn = !!this.token;  // 修改为用token判断登录状态
			this.avatarSrc = this.isLoggedIn ? '/static/avatar.png' : this.baseUrl + 'avatar.png';  // 修改头像路径

			// this.isLoggedIn = !!this.openID;
			// this.avatarSrc = this.isLoggedIn ? userInfo.avatarUrl : this.baseUrl + 'avatar.png';
		},
		// 分享赚佣金
		shareCommission() {
			this.goto("/pages/business/shareCommission/shareCommission");
		},
		// 理疗师招聘
		recruit() {
			this.goto("/pages/business/recruit/recruit");
		},
		// 联系客服
		contactCustomerService() {
			this.showPopup = true;
		},
		// 联系在线客服
		contactOnline() {
			console.log("联系在线客服");
			this.showPopup = false;
		},
		// 联系电话客服
		contactPhone() {
			console.log("联系电话客服");
			this.showPopup = false;
			const basicInformation = uni.getStorageSync("basicInformation");
			uni.makePhoneCall({
				phoneNumber: basicInformation.customerPhone,
			});
		},
		// 登录退出
		logout() {
			this.isLogout()
		},
		// 意见反馈
		feedback() {
			this.goto("/pages/business/feedback/feedback");
		},
		// 关于我们
		about() {
			this.goto("/pages/business/about/about");
		},
		// 复制openID
		copyOpenID() {
			uni.setClipboardData({
				data: this.openID,
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: 'success',
						duration: 2000
					});
				}
			});
		},
		// 复制手机号码
		copyPhoneNumber() {
			uni.setClipboardData({
				data: this.phoneNumber,
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: 'success',
						duration: 2000
					});
				}
			});
		},
		// 复制昵称
		copyNickName() {
			// 复制到剪贴板
			uni.setClipboardData({
				data: this.nickName,
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: 'success',
						duration: 2000
					});
				}
			});
		},
		// 跳转类型
		toOrderType(index) {
			uni.showToast({
				title: this.tabList[index].name,
			});
			switch (index) {
				case 0:
					this.goto("/pages/business/myCollect/myCollect");
					break;
				case 1:
					this.goto("/pages/business/coupon/coupon");
					break;
				case 2:
					this.goto("/pages/business/myCard/myCard");
					break;
				case 3:
					this.goto("/pages/business/notice/notice");
					break;
			}
		},
		goto(url) {
			// 判断是否已登录
			// let openID = uni.getStorageSync("openID");
			let openID = uni.getStorageSync("token");
			if (
				openID === undefined ||
				openID === "" ||
				openID === "" ||
				openID === null
			) {
				//不存在则跳转至登录页
				// 自有登录页
				uni.reLaunch({
					url: "/pages/business/login/login",
					success: () => {
						console.log("未登录跳转登录页");
					},
				});
				// // 统一登录页
				// uni.reLaunch({
				//   url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd?type=weixin",
				// });
			} else {
				//已登录则才进入对应路由地址
				uni.navigateTo({
					url: url,
					animationType: "slide-in-right",
					animationDuration: 300,
				});
			}
		},
		// 退出登录
		isLogout() {
			// 判断登录状态，根据当前登录状态来执行登录或退出
			// let openID = uni.getStorageSync("openID");
			let openID = uni.getStorageSync("token");
			if (
				openID === undefined ||
				openID === "" ||
				openID === "" ||
				openID === null
			) {
				// 当前未登录，点击该菜单项后跳转到登录页
				// 自有登录页
				this.goto("/pages/business/login/login");
				// // 统一登录页
				// uni.navigateTo({
				//   url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd?type=weixin",
				// });
			} else {
				// 弹窗确认
				uni.showModal({
					title: " 退出",
					content: "请确认",
					success: (res) => {
						if (res.confirm) {
							console.log("用户点击确定");
							try {
								// 清理缓存
								uni.clearStorageSync();
								// 路由跳转到登录页
								//  自有登录页
								this.goto("/pages/business/login/login");
								// // 统一登录页
								// uni.navigateTo({
								//   url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd?type=weixin",
								// });
							} catch (e) {
								console.log(e);
							}
						} else if (res.cancel) {
							console.log("用户点击取消");
						}
					},
				});
			}
		},
		// 扫一扫
		scan() {
			// 只允许通过相机扫码
			uni.scanCode({
				onlyFromCamera: false,
				success: (res) => {
					console.log("条码类型：" + res.scanType);
					console.log("条码内容：" + res.result);
					//在起始页面跳转到test.vue页面并传递参数
					uni.navigateTo({
						url: `/pages/business/scanCode/scanCode?scanResult=${res.result}`,
					});
				},
			});
		},
		checkUnreadMessages() {
			// 调用云函数获取通知列表
			uniCloud.callFunction({
				name: "getNotice",
				data: {
					openID: this.openID, // 当前用户ID
					pageNum: 1,
					pageSize: 100, // 确保获取所有消息
					isEnable: true
				},
				success: (res) => {
					this.hasUnreadMessages = res.result.data.some(notice => !notice.isRead);
				}
			});
		},
	},
	created() {
		this.checkUnreadMessages();
	},
	onShareAppMessage() {
		return {
			title: "好服务就用上上吉",
			path: "/pages/home/home",
		};
	},
	onShareTimeline() {
		return {
			title: "好服务就用上上吉",
			imageUrl: "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/c89fedc8-0f75-4e8e-b151-ce90a17e7ce3.jpg",
		};
	},
};
</script>

<style lang="scss">
page {
	background-color: #fff;
}

.red-dot {
	width: 10px;
	height: 10px;
	background-color: red;
	border-radius: 50%;
	position: absolute;
	top: 0;
	right: 0;
}

.header {
	background-color: #71d5a1;
	width: 100%;
	height: 25vw;
	padding: 0 4%;
	display: flex;
	align-items: center;

	.userinfo {
		width: 90%;
		display: flex;
		margin-top: 50rpx;
		margin-left: 50rpx;

		.face {
			flex-shrink: 0;
			width: 15vw;
			height: 15vw;

			image {
				width: 100%;
				height: 100%;
				border-radius: 100%;
			}
		}

		.info {
			display: flex;
			flex-flow: wrap;
			padding-left: 30upx;

			.username {
				width: 100%;
				color: #fff;
				font-size: 30rpx;
			}

			.openID {
				width: 100%;
				color: #fff;
				font-size: 28upx;
			}

			.integral {
				display: flex;
				align-items: center;
				padding: 0 20upx;
				height: 40upx;
				color: #fff;
				background-color: rgba(0, 0, 0, 0.1);
				border-radius: 20upx;
				font-size: 24upx;
			}
		}
	}

	.setting {
		flex-shrink: 0;
		width: 10rpx;
		height: 10rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}
}

.popup-content {
	padding: 20px;
	text-align: center;
}

.hover {
	background-color: #eee;
}

.popup-button {
	margin-top: 40rpx;
	margin-bottom: 40rpx;
}

.orders {
	background-color: #71d5a1;
	width: 100%;
	height: 11vw;
	padding: 0 4%;
	margin-bottom: calc(11vw + 40upx);
	display: flex;
	align-items: flex-start;
	border-radius: 0 0 100% 100%;
	margin-top: -1upx;

	.box {
		width: 90%;
		padding: 0 1%;
		height: 170rpx;
		background-color: #fefefe;
		border-radius: 24upx;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.15);
		margin-top: 20upx;
		margin-bottom: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;

		.label {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-flow: wrap;
			width: 100%;
			height: 16vw;
			color: #666666;
			font-size: 26upx;

			.icon {
				position: relative;
				width: 7vw;
				height: 7vw;
				margin: 0 1vw;

				.badge {
					position: absolute;
					width: 4vw;
					height: 4vw;
					background-color: #ec6d2c;
					top: -1vw;
					right: -1vw;
					border-radius: 100%;
					font-size: 20upx;
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					z-index: 10;
				}

				image {
					width: 7vw;
					height: 7vw;
					z-index: 9;
				}
			}
		}
	}
}

.list {
	width: 100%;
	border-bottom: solid 26upx #f1f1f1;

	.li {
		width: 92%;
		height: 100upx;
		padding: 0 4%;
		border-bottom: solid 1upx #e7e7e7;
		display: flex;
		align-items: center;

		&.noborder {
			border-bottom: 0;
		}

		.icon {
			flex-shrink: 0;
			width: 50upx;
			height: 50upx;

			image {
				width: 50upx;
				height: 50upx;
			}
		}

		.text {
			padding-left: 20upx;
			width: 100%;
			color: #666;
		}

		.to {
			flex-shrink: 0;
			width: 40upx;
			height: 40upx;
		}
	}
}

.login-text {
	font-size: 45rpx !important;
	color: #ffffff !important;
}

.login-text-tip {
	font-size: 27rpx !important;
	color: #fff !important;

}
</style>
