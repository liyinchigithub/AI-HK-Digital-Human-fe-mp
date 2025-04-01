<template>
	<view class="loginContent">
		<view class="wrap">
			<view class="top"></view>
			<view class="content">
				<view class="logo">
					<u--image :showLoading="true" :src="logoSrc" width="100px" height="100px"></u--image>
				</view>

				<!-- 修改手机号输入框 -->
				<view class="input-group">
					<text class="input-label">手机号</text>
					<u--input v-model="phone" placeholder="请输入手机号" class="input-item" />
				</view>

				<!-- 修改验证码输入框 -->
				<view class="input-group">
					<text class="input-label">验证码</text>
					<view class="captcha-wrapper">
						<u--input v-model="captcha" placeholder="请输入验证码" class="input-item"
							customStyle="width: 400rpx; margin-right: 20rpx;"></u--input>
						<u-button @click="sendCaptcha" :customStyle="{
						width: '220rpx',
						height: '60rpx',
						lineHeight: '60rpx',
						fontSize: '28rpx'
					}" :text="countdown > 0 ? `${countdown}秒后获取` : '获取验证码'" :disabled="countdown > 0" size="mini" color="#71d5a1">
						</u-button>
					</view>
				</view>

				<view class="login-button">
					<u-button @click="submitLogin" color="#71d5a1" shape="circle" text="手机号登录"></u-button>
				</view>
			</view>

			<view class="buttom">
				<view class="hint">
					登录代表您同意<br>
					<text class="link" style="color: #9aceb3;"
						@click="goto('/pages/business/serviceAgreement/serviceAgreement')">服务协议、</text>
					<text class="link" style="color: #9aceb3;"
						@click="goto('/pages/business/privacyPolicy/privacyPolicy')">隐私政策，</text>
					并授权使用您的账号信息（如昵称、头像、地址）以便为您提供服务
				</view>
			</view>
		</view>
		<u-overlay :show="maskShow"></u-overlay>
	</view>
</template>

<script>
export default {
	name: "login",
	data() {
		return {
			logoSrc: "",
			phone: "13344556677",
			captcha: "112233",
			maskShow: false
		}
	},
	onLoad() {
		this.getBasicInforMation();
	},
	methods: {
		async submitLogin() {
			if (!this.phone || !this.captcha) {
				uni.showToast({ title: '请填写完整信息', icon: 'none' });
				return;
			}

			try {
				const res = await uni.request({
					url: 'https://homechat-effassits-popgjiyphu.cn-hangzhou.fcapp.run/open/login',
					method: 'POST',
					header: {
						'Content-Type': 'application/json'
					},
					data: {
						phone: this.phone,
						captcha: this.captcha
					}
				});
				console.log("res[1].data:" + JSON.stringify(res[1].data));
				// 判断登录是否成功
				if (res[1].data.code === 0) {
						uni.setStorageSync('token', res[1].data.data);
						uni.switchTab({ url: '/pages/home/home' });
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: '登录失败: ' + (res.data.message || '未知业务错误'),
							icon: 'none'
						});
					}
			} catch (error) {
				// 增强错误信息显示
				uni.showToast({
					title: `网络异常: ${error.errMsg || '未知错误'}`,
					icon: 'none'
				});
				console.error('登录请求错误:', error);
			}
		},

		async sendCaptcha() {
			if (!this.phone) {
				uni.showToast({ title: '请先输入手机号', icon: 'none' });
				return;
			}

			try {
				const res = await uni.request({
					url: 'YOUR_CAPTCHA_API_ENDPOINT',
					method: 'POST',
					data: { phone: this.phone }
				});

				if (res.statusCode === 200) {
					uni.showToast({ title: '验证码已发送' });
				}
			} catch (error) {
				uni.showToast({ title: '验证码发送失败', icon: 'none' });
			}
		},

		goto(url) {
			uni.navigateTo({
				animationType: 'slide-in-bottom',
				animationDuration: 200,
				url: url
			})
		},

		getBasicInforMation() {
			uniCloud.callFunction({
				name: "getBasicInformation",
				data: { "isEnable": true },
				success: (res) => {
					this.logoSrc = res.result.data[0].logo.url;
				}
			});
		}
	}
};
</script>

<style>
.login-button {
	margin-top: 10%;
	margin-left: 5%;
	margin-right: 5%;
	width: 90%;
}

/* 新增输入框组样式 */
.input-group {
	width: 80%;
	margin: 20rpx auto;
}

.input-label {
	display: block;
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
}

/* 新增验证码容器样式 */
.captcha-wrapper {
	display: flex;
	align-items: center;
	width: 100%;
}

/* 调整输入框宽度 */
.input-item {
	width: auto !important;
	flex: 1;
}

/* 新增父容器约束 */
.content {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.captcha-wrapper {
  display: flex;
  align-items: center;
  gap: 10rpx; /* 添加间距 */
}

.logo {
	margin-top: 30%;
	margin-left: 0%;
	margin-right: 5%;
	margin-bottom: 2%;
}

.hint {
	font-size: 20rpx;
	color: #c8c9cc;
	margin-top: 10%;
	margin-left: 10%;
	margin-right: 10%;
	margin-bottom: 2%;
}
</style>