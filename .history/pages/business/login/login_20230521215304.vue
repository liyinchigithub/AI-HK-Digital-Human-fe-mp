<template>
	<view class="loginContent">
		<view class="wrap">
			<view class="top"></view>
			<view class="content">
				<!-- <view class="title">登录</view> -->
				<!-- <view class="tips">未注册的手机号验证后自动创建账号</view> -->
				<view class="logo">
					<u--image :showLoading="true" :src="logoSrc" width="100px" height="100px"></u--image>
				</view>
				<view class="wexin_login_button">
					<u-button type="primary" @click="getUserInfo" text="微信登录"></u-button>
				</view>
				<view class="alternative">
					<!-- <view class="password">密码登录</view>
				<view class="issue">遇到问题</view> -->
				</view>
			</view>
			<view class="buttom">
				<!-- 	<view class="loginType">
				<view class="phone item" @click="goto('/pages/business/login/mobileLogin')">
					<view class="icon">
						<u-icon size="70" name="phone-fill" color="rgb(83,194,64)"></u-icon>
					</view>
					手机号
				</view>
				<view class="QQ item" @click="goto('/pages/business/login/mobileLogin')">
					<view class="icon">
						<u-icon size="70" name="qq-fill" color="rgb(17,183,233)"></u-icon>
					</view>
					QQ
				</view>
			</view> -->
				<view class="hint">
					登录代表同意<br>
					<text class="link" style="color: blue;"
						@click="goto('/pages/business/articlesAgreement/articlesAgreement')">用户协议、隐私政策，</text>
					并授权使用您的账号信息（如昵称、头像、收获地址）以便您统一管理
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
				logoSrc: "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/498fe04a-ba2f-46a1-81e4-fb2b6436bfca.jpeg",
				openid: "",
				session_key: "",
				setData: {

				},
				tipsContent: '为了及时获取订单状态，您是否想接收订单状态的消息提醒？', // 弹框提示内容，
				buttonConfirmText: '去开启消息提醒',
				buttonCancelText: '不需要提醒',
				maskShow: false,
				pushClientid: "", // uniPush 客户端标识
			}
		},
		computed: {

		},
		created() {
			// 判断是否已授权登录过

		},
		methods: {
			// 微信授权登录
			getOpenID() {
				// 显示遮罩
				this.maskShow = true
				// 重写this
				var that = this;
				// uni.login({
				//   provider: 'weixin', //使用微信登录
				//   success: function (loginRes) {
				//     console.log("loginRes.authResult：",loginRes.authResult);
				//   }
				// });
				uni.login({
					provider: 'weixin',
					success: async (wxcode) => {
						console.log("wxcode：", wxcode); // 获取code对象
						// 调用云函数
						var callFunctionResult = await uniCloud.callFunction({
							name: "getOpenID", // 云函数名
							data: {
								"code": wxcode.code
							} // 云函数参数（传递给云函数的入参）
						})
						// 云函数调用结果（返回一个object）
						console.log("callFunctionResult", callFunctionResult)
						// 
						that.openid = callFunctionResult.result.openid
						that.session_key = callFunctionResult.result.session_key
						console.log("openid", that.openid)
						console.log("session_key", that.session_key)
						// 本地缓存openID
						uni.setStorageSync("openID", that.openid)
						// 本地缓存openID
						uni.setStorageSync("session_key", that.session_key)

						// TODO 允许订阅消息

					},
					fail: (error) => {
						uni.showToast({
							title: "授权失败：" + error
						})
						console.log()
					}
				});
			},
			// 授权（获取用户信息）
			getUserInfo() {
				// 获取openid
				this.$options.methods.getOpenID();
				// 显示loading
				uni.showLoading({
					title: '处理中...'
				})
				console.log("this.$options.methods.getOpenID() 后")
				// 重写this
				var that = this;
				// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
				// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
				// https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html
				wx.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						that.setData = {
							userInfo: res.userInfo, // 用户信息对象
							rawData: res.rawData, //不包括敏感信息的原始数据字符串，用于计算签名
							signature: res
								.signature, // 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，详见 用户数据的签名验证和加解密
							encryptedData: res.encryptedData, // 包括敏感数据在内的完整用户信息的加密数据，详见 用户数据的签名验证和加解密
							iv: res.iv, // 加密算法的初始向量，详见 用户数据的签名验证和加解密
							hasUserInfo: true
						}
						console.log("setData:" + JSON.stringify(that.setData));
						// 存储用户信息到本地缓存
						uni.setStorageSync('setData', that.setData);
						// 存储用户信息到本地缓存
						uni.setStorageSync('userInfo', that.setData.userInfo);
						// 存储signature到本地缓存
						uni.setStorageSync('signature', that.setData.signature);
						// 存储encryptedData到本地缓存
						uni.setStorageSync('encryptedData', that.setData.encryptedData);
						// 隐藏loading
						uni.hideLoading();


					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
							title: "为了更好的功能体验，请先登录授权！",
							icon: "none"
						})
						console.log("请点击授权进行登录！");
					},
					complete() {
						//  判断是否是新用户,新用户 则新增一条用户数据
						uniCloud.callFunction({
								name: "getUser",
								data: {
									"openID": uni.getStorageSync("openID"),
								}
							})
							.then(res => {
								console.log("getUserInfo getUser:", res.result.data)
								console.log('uni.getStorageSync("openID")', uni.getStorageSync("openID"))

								// uni-app客户端获取push客户端标记
								// uni.getPushClientId({
								// 	success: (res) => {
								// 		let push_clientid = res.cid
								// 		that.pushClientid = res.cid
								// 		console.log('客户端推送标识:', push_clientid)

								// 	},
								// 	fail(err) {
								// 		console.log(err)
								// 	}
								// })
								// 判断是否返回空数组，空数组说明新用户
								if (res.result.data.length === 0) {
									console.log("插入一条数据", {
										"openID": uni.getStorageSync("openID"), // 微信openID
										"nickName": uni.getStorageSync("setData").userInfo
											.nickName, // 微信昵称
										"avatarUrl": uni.getStorageSync("setData").userInfo
											.avatarUrl, // 微信头像
										"pushClientid": that.pushClientid, //uni push 客户端标识
										// "gender": that.setData.userInfo.gender, // 微信性别
										// "language": that.setData.userInfo.language, // 微信语言
										// "city": that.setData.userInfo.city, // 微信城市
										// "province": that.setData.userInfo.province, // 微信省份
										// "country": that.setData.userInfo.country, // 微信国家
										"username": uni.getStorageSync("setData").userInfo.nickName,
										// "phone": that.setData.userInfo.phone,
										"level": 1,
										"is_block_user": 0,
										"isEnable": 1
									})
									console.log('uni.getStorageSync("setData"):', uni.getStorageSync(
										"setData"))
									// 插入一条新的记录
									uniCloud.callFunction({
											name: "addUser",
											data: {
												"openID": uni.getStorageSync("openID"), // 微信openID
												"nickName": uni.getStorageSync("setData").userInfo
													.nickName, // 微信昵称
												"avatarUrl": uni.getStorageSync("setData").userInfo
													.avatarUrl, // 微信头像
												"pushClientid": that.pushClientid, //uni push 客户端标识
												// "gender": that.setData.userInfo.gender, // 微信性别
												// "language": that.setData.userInfo.language, // 微信语言
												// "city": that.setData.userInfo.city, // 微信城市
												// "province": that.setData.userInfo.province, // 微信省份
												// "country": that.setData.userInfo.country, // 微信国家
												"username": uni.getStorageSync("setData").userInfo
													.nickName,
												// "phone": that.setData.userInfo.phone,
												"level": 1,
												"is_block_user": 0,
												"isEnable": 1
											}
										})
										.then(res2 => {
											console.log("新增一条用户数据：", res2);
										}) // success
										.catch((err) => {// fail
											console.log("getUser addUser err:", err)
										}).finally(()=>{
											console.log(`that.openID :${uni.getStorageSync("openID")}`)
											// 查询用户ID
											uniCloud.callFunction({
												name: "getUser",
												data: {
													"openID": uni.getStorageSync("openID")
												},
												success: (res3) => {
													console.log(
														`getUser user res.data.result:${res3.result.data}`
													)
													uni.setStorageSync("userID", res3.result.data[0].userID)
											
												}
											})
											
										}) 
								} else {
									console.log("已有数据不再插入");
									uni.setStorageSync("userID", res.result.data[0].userID)
								}
								// 
								console.log(res);
								


							}) // success
							.catch((err) => {
								console.log(err);
							}) // fail
						// 显示遮罩
						that.maskShow = false
						
						// 跳转首页
						uni.switchTab({
							url: "/pages/home/home"
						})

					}
				})

			},
			//
			addUser() {
				var that = this
				uniCloud.callFunction({
					name: "addUser",
					data: {
						"openID": that.openid, // 微信openID
						"nickName": that.setData.userInfo.nickName, // 微信昵称
						"avatarUrl": that.setData.userInfo.avatarUrl, // 微信头像
						// "gender": that.setData.userInfo.gender, // 微信性别
						// "language": that.setData.userInfo.language, // 微信语言
						// "city": that.setData.userInfo.city, // 微信城市
						// "province": that.setData.userInfo.province, // 微信省份
						// "country": that.setData.userInfo.country, // 微信国家
						"username": that.setData.userInfo.nickName,
						"phone": that.setData.userInfo.phone,
						"level": 1,
						"is_block_user": 0,
						"isEnable": 1
					},
					success: (res) => {
						console.log("res.result.data:", res.result.data)
						// 路由跳转（进入首页）


					}
				})
			},
			// 路由跳转
			goto(url) {
				uni.navigateTo({
					animationType: 'slide-in-bottom', // 窗口动画
					animationDuration: 200,
					url: url // 路由跳转页面
				})
			},

		},
		onLoad() {
			// 当前页面
			console.log(`当前页面:login`)
		},
		beforeDestroy() {


		}
	};
</script>

<style>
	.wexin_login_button {
		color: green;
		margin-top: 10%;
		margin-left: 5%;
		margin-right: 5%;
	}

	.title {
		color: black;
		align-content: center;
		margin-top: 7%;
		margin-left: 35%;
		margin-right: 5%;
		margin-bottom: 2%;
	}

	.logo {
		color: black;
		align-content: center;
		margin-top: 30%;
		margin-left: 35%;
		margin-right: 5%;
		margin-bottom: 2%;
	}

	.hint {
		font-size: 10px;
		color: #c8c9cc;
		margin-top: 4%;
		margin-left: 5%;
		margin-right: 5%;
		margin-bottom: 2%;
	}
</style>