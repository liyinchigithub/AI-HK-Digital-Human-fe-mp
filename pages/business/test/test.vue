<!-- 单元测试页面 -->
<template>
	<view class="content">
		测试支付
		<button @click="open()">唤起收银台支付</button>
		<uni-pay ref="uniPay"></uni-pay>
		第一种方式
		<updateFile></updateFile>
		第二种方式
		<button type="default" @click="updateFile">上传</button>
		<!-- <image :src="src" mode=""></image> -->
		微信模版消息
		<button @click="getSubscribe()">微信模版消息</button>
		--------------------------------------------------
		新版授权登录（获取昵称和头像
		<button class="box-img" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
		新版授权登录（获取昵称和头像）
		</button>
		<image :src="formData.userInfo.avatar" mode="aspectFill"></image>
		<input v-model="formData.userInfo.name" type="nickname" class="weui-input" placeholder="请输入昵称" @blur="onNickname"/>
		--------------------------------------------------
		新版授权登录（获取昵称和头像）
		<view>
			<button class="loginBtn" open-type="getUserInfo" @getuserinfo="wxGetUserInfo">授权登陆</button>
		</view>

	</view>
</template>

<script>
	import updateFile from "../../../components/updateFile/updateFile.vue";
	export default {
		components: {
			updateFile: updateFile
		},
		data() {
			return {
				src: "",
				//支付字段
				total_fee: 1, // 支付金额，单位分 100 = 1元（0.01）
				order_no: "234234234", // 业务系统订单号（即你自己业务系统的订单表的订单号）
				out_trade_no: "", // 插件支付单号
				description: "测试订单", // 支付描述
				type: "test", // 支付回调类型 如 recharge 代表余额充值 goods 代表商品订单（可自定义，任意英文单词都可以，只要你在 uni-pay-co/notify/目录下创建对应的 xxx.js文件进行编写对应的回调逻辑即可）
				custom: {
					a: "a",
					b: 1
				},
				// 新版 微信授权获取用户昵称和头像
				formData: {
					userInfo: {
						avatar: ""
					}
				}
			}
		},
		onLoad: (options) => { //option为object类型，会序列化上个页面传递的参数
			console.log(options) //打印出上个页面传递的参数。
		},
		methods: {
			// 微信支付-uniapp 接入demo示例
			/**
			 * https://uniapp.dcloud.net.cn/uniCloud/uni-pay.html#
			 * https://uniapp.dcloud.net.cn/uniCloud/uni-pay.html#config
			 * 
			 * 发起支付（唤起收银台，如果只有一种支付方式，则收银台不会弹出来，会直接使用此支付方式）
			 * 在调用此api前，你应该先创建自己的业务系统订单，并获得订单号 order_no，把order_no当参数传给此api，而示例中为了简化跟支付插件无关的代码，这里直接已时间戳生成了order_no
			 */
			open() {
				this.order_no = `test` + Date.now(); // 模拟生成订单号
				this.out_trade_no = `${this.order_no}-1`; // 模拟生成插件支付单号
				// 打开支付收银台
				this.$refs.uniPay.open({
					total_fee: this.total_fee, // 支付金额，单位分 100 = 1元
					order_no: this.order_no, // 业务系统订单号（即你自己业务系统的订单表的订单号）
					out_trade_no: this.out_trade_no, // 插件支付单号
					description: this.description, // 支付描述
					type: this.type, // 支付回调类型goods.js、recharge.js 如果填 recharge 则支付成功后就会执行 recharge.js 内的代码逻辑
					custom: this.custom, // 自定义数据
				});
			},
			// 上传文件
			updateFile() {
				//前端代码
				uni.chooseImage({
					count: 1,
					success: async (res) => {
						console.log(res);
						if (res.tempFilePaths.length > 0) {
							let filePath = res.tempFilePaths[0];
							//进行上传操作
							// promise方式
							const result = await uniCloud.uploadFile({
								filePath: filePath,
								cloudPath: 'a.jpg',
								success: (e) => {
									console.log(e)
									console.log(e.fileID)
									this.src = e.fileID
								},
								fail: () => {},
								// 上传进度
								onUploadProgress: (progressEvent) => {
									console.log(progressEvent);
									var percentCompleted = Math.round(
										(progressEvent.loaded * 100) / progressEvent.total
									);
								}
							});

						}
					}
				});
			},
			// 新版微信授权
			wxGetUserInfo() {
				let m = this;
				m.tologin("weixin");
			},
			tologin(provider) {
				let m = this;
				uni.login({
					provider: provider,
					// #ifdef MP-ALIPAY
					scopes: 'auth_user', //支付宝小程序需设置授权类型
					// #endif
					success: (res) => {
						m.loginVal = res;
						m.getUserInfo((res1) => {
							let params = {
								"code": m.loginVal.code,
								"rawData": res1.rawData,
								"nickName": res1.userInfo.nickName,
								"gender": res1.userInfo.gender,
								"avatarUrl": res1.userInfo.avatarUrl,
								"signature": res1.signature,
								"encryptedData": res1.encryptedData,
								"iv": res1.iv,
								"language": res1.userInfo.language,
								"city": res1.userInfo.city,
								"province": res1.userInfo.province,
								"country": res1.userInfo.country,
							}
							m.apiJscode2session(params)
						})
					},
					fail: (err) => {}
				});
			},
			async apiJscode2session(params) {
				const co1 = uniCloud.importObject("col");
				let res = await co1.wxjscode2session(params);
				debugger
			},
			getUserInfo(suc) {
				suc = suc || function() {}

				uni.getUserInfo({
					provider: "weixin",
					success: (result) => {
						suc(result);
					},
				})
				// uni.getUserInfo({
				// 	provider: "weixin",
				// 	success: (result) => {
				// 		suc(result);
				// 	},
				// 	fail: (error) => {

				// 	}
				// });
			},
			// 请求云函数-发送模版消息
			sendMessage() {
				uniCloud.callFunction({
					name: "sendSubscriptionIDMessage",
					data: {
						"openId": "oTDxt5Rg2FLfsGHXY9BJ2lsBmog4",
						"data": {
							"character_string1": {
								"value": "12317239817239813"
							},
							"name4": {
								"value": "商品名称"
							},
							"amount2": {
								"value": "1"
							},
							"phrase8": {
								"value": "已支付"
							},
							"date3": {
								"value": "2023-06-12 10:00:00"
							}
						},
						"teampleName": "订单支付成功通知"
					},
					success(res) {
						console.log(res)
					}
				})
			},
			// 向用户申请模版消息权限（允许/拒绝）
			getSubscribe() {
				var tmplIds = ['iOWPa9J4g-uRHrZUG62wxhWqsb0YU265UToPTV7eZGQ'] //模板ID
				uni.requestSubscribeMessage({
					tmplIds: tmplIds,
					success: (res) => { //用户点击确定
						for (let key in res) {
							if (res[key] == "accept") {
								uni.showToast({
									title: '已允许消息推送'
								})
								this.sendMessage()
							} else {

							}
						}
					},
					fail: (errMessage) => {
						console.log("订阅消息 失败 ", errMessage);
					},
				})
			},
			onChooseAvatar(e) {
				console.log(e, '---onChooseAvatar');
				this.formData.userInfo.avatar = e.detail.avatarUrl
			},
		},
		mounted() {
			let m = this;
		},


	}
</script>


<style>

</style>