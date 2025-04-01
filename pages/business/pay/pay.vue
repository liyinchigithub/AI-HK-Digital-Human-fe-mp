<template>
	<view class="app">
		<!-- 暂无用，使用uni-pay组件，即商品详情点击下单购买按钮调起uni-pay 2.0的open() -->
		<view>
			<view class="label">支付单号：</view>
			<view><input v-model="out_trade_no" /></view>
		</view>
		<view>
			<view class="label">支付金额（单位分，100=1元）：</view>
			<view><input v-model.number="total_fee" /></view>
		</view>
		<button @click="open">唤起收银台支付</button>
		<view class="tips">支付前，让用户自己选择微信还是支付宝</view>
		<!-- #ifdef MP-WEIXIN || H5 || APP -->
		<button @click="createOrder('wxpay')">直接发起微信支付</button>
		<!-- #endif -->
		<!-- #ifdef MP-ALIPAY || H5 || APP -->
		<button @click="createOrder('alipay')">直接发起支付宝支付</button>
		<!-- #endif -->
		
		<button @click="createQRcode('wxpay')">生成独立支付二维码</button>
		<view class="tips">用于把生成的二维码放到自己写的页面中（组件不会弹窗，请从日志中查看二维码base64值）</view>
		
		<button @click="getOrder">查询支付状态</button>
		<!--
		<button @click="refund">发起退款</button>
		<view class="tips">发起退款需要admin权限，本示例未对接登录功能</view>
		<button @click="getRefund">查询退款状态</button>
		<button @click="closeOrder">关闭订单</button>
		-->
		<!-- #ifdef H5 -->
		<button v-if="h5Env === 'h5-weixin'" @click="getWeiXinJsCode('snsapi_base')">公众号获取openid示例</button>
		<!-- #endif -->
		<!-- 统一支付组件 -->
		<uni-pay ref="uniPay" :adpid="adpid" return-url="/pages/order-detail/order-detail" logo="/static/logo.png" @success="onSuccess" @create="onCreate"></uni-pay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				total_fee: 1, // 支付金额，单位分 100 = 1元
				order_no: "20221027011000101001010", // 业务系统订单号（即你自己业务系统的订单表的订单号）
				out_trade_no: "2022102701100010100101001", // 插件支付单号
				description: "测试订单", // 支付描述
				type: "test", // 支付回调类型 如 recharge 代表余额充值 goods 代表商品订单（可自定义，任意英文单词都可以，只要你在 uni-pay-co/notify/目录下创建对应的 xxx.js文件进行编写对应的回调逻辑即可）
				//qr_code: true, // 是否强制使用扫码支付
				openid:"", // 微信公众号需要
				custom:{
					a: "a",
					b: 1
				},
				adpid: "1000000001", // uni-ad的广告位id
			}
		},
		onLoad(options={}) {
			if (options.code && options.state) {
				// 获取微信公众号的openid
				setTimeout(() => {
					this.getOpenid({
						provider: "wxpay",
						code: options.code
					});
				}, 300);
			}
		},
		methods: {
			/**
			 * 发起支付（唤起收银台，如果只有一种支付方式，则收银台不会弹出来，会直接使用此支付方式）
			 * 在调用此api前，你应该先创建自己的业务系统订单，并获得订单号 order_no，把order_no当参数传给此api，而示例中为了简化跟支付插件无关的代码，这里直接已时间戳生成了order_no
			 */
			open() {
				this.order_no = `test`+Date.now();
				this.out_trade_no = `${this.order_no}-1`;
				// 打开支付收银台
				this.$refs.uniPay.open({
					total_fee: this.total_fee, // 支付金额，单位分 100 = 1元
					order_no: this.order_no, // 业务系统订单号（即你自己业务系统的订单表的订单号）
					out_trade_no: this.out_trade_no, // 插件支付单号
					description: this.description, // 支付描述
					type: this.type, // 支付回调类型
					qr_code: this.qr_code, // 是否强制使用扫码支付
					openid: this.openid, // 微信公众号需要
					custom: this.custom, // 自定义数据
				});
			},
			/**
			 * 发起支付（不唤起收银台，手动指定支付方式）
			 * 在调用此api前，你应该先创建自己的业务系统订单，并获得订单号 order_no，把order_no当参数传给此api，而示例中为了简化跟支付插件无关的代码，这里直接已时间戳生成了order_no
			 */
			createOrder(provider){
				this.order_no = `test`+Date.now();
				this.out_trade_no = `${this.order_no}-1`;
				// 发起支付
				this.$refs.uniPay.createOrder({
					provider: provider, // 支付供应商
					total_fee: this.total_fee, // 支付金额，单位分 100 = 1元
					order_no: this.order_no, // 业务系统订单号（即你自己业务系统的订单表的订单号）
					out_trade_no: this.out_trade_no, // 插件支付单号
					description: this.description, // 支付描述
					type: this.type, // 支付回调类型
					qr_code: this.qr_code, // 是否强制使用扫码支付
					openid: this.openid, // 微信公众号需要
					custom: this.custom, // 自定义数据
				});
			},
			/**
			 * 生成支付独立二维码（只返回支付二维码）
			 * 在调用此api前，你应该先创建自己的业务系统订单，并获得订单号 order_no，把order_no当参数传给此api，而示例中为了简化跟支付插件无关的代码，这里直接已时间戳生成了order_no
			 */
			createQRcode(provider){
				this.order_no = `test`+Date.now();
				this.out_trade_no = `${this.order_no}-1`;
				// 发起支付
				this.$refs.uniPay.createOrder({
					provider: provider, // 支付供应商
					total_fee: this.total_fee, // 支付金额，单位分 100 = 1元
					order_no: this.order_no, // 业务系统订单号（即你自己业务系统的订单表的订单号）
					out_trade_no: this.out_trade_no, // 插件支付单号
					description: this.description, // 支付描述
					type: this.type, // 支付回调类型
					qr_code: true, // 是否强制使用扫码支付
					cancel_popup: true, // 配合qr_code:true使用，是否只生成支付二维码，没有二维码弹窗
					openid: this.openid, // 微信公众号需要
					custom: this.custom, // 自定义数据
				});
			},
			// 查询支付状态
			async getOrder() {
				let res = await this.$refs.uniPay.getOrder({
					out_trade_no: this.out_trade_no, // 插件支付单号
					await_notify: true
				});
				if (res) {
					let obj = {
						"-1": "已关闭",
						"1": "已支付",
						"0": "未支付",
						"2": "已部分退款",
						"3": "已全额退款"
					};
					uni.showToast({
						title: obj[res.status] || res.errMsg,
						icon: "none"
					});
				}
			},
			// 发起退款
			async refund() {
				let res = await this.$refs.uniPay.refund({
					out_trade_no: this.out_trade_no, // 插件支付单号
				});
				if (res) {
					uni.showToast({
						title: res.errMsg,
						icon: "none"
					});
				}
			},
			// 查询退款状态
			async getRefund() {
				let res = await this.$refs.uniPay.getRefund({
					out_trade_no: this.out_trade_no, // 插件支付单号
				});
				if (res) {
					uni.showModal({
						content: res.errMsg,
						showCancel: false
					});
				}
			},
			// 关闭订单
			async closeOrder() {
				let res = await this.$refs.uniPay.closeOrder({
					out_trade_no: this.out_trade_no, // 插件支付单号
				});
				if (res) {
					uni.showModal({
						content: res.errMsg,
						showCancel: false
					});
				}
			},
			// 获取公众号code
			async getWeiXinJsCode(scope="snsapi_base") {
				let res = await this.$refs.uniPay.getProviderAppId({
					provider: "wxpay",
					provider_pay_type: "jsapi"
				});
				if (res.appid) {
					let appid = res.appid;
					let redirect_uri = window.location.href.split("?")[0];
					let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`;
					window.location.href = url;
				}
				
			},
			// 获取公众号openid
			async getOpenid(data) {
				let res = await this.$refs.uniPay.getOpenid(data);
				if (res) {
					this.openid = res.openid;
					uni.showToast({
						title: "已获取到openid，可以开始支付",
						icon: "none"
					});
				}
			},
			// 监听事件 - 支付订单创建成功（此时用户还未支付）
			onCreate(res){
				console.log('create: ', res);
				// 如果只是想生成支付二维码，不需要组件自带的弹窗，则在这里可以获取到支付二维码 qr_code_image
			},
			// 监听事件 - 支付成功
			onSuccess(res){
				console.log('success: ', res);
				if (res.user_order_success) {
					// 代表用户已付款，且你自己写的回调成功并正确执行了
					
				} else {
					// 代表用户已付款，但你自己写的回调执行成功（通常是因为你的回调代码有问题）
	
				}
			}
		}, 
		computed: {
			h5Env(){
				// #ifdef H5
				let ua = window.navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == 'micromessenger' && (ua.match(/miniprogram/i) == 'miniprogram')) {
					// 微信小程序
					return "mp-weixin";
				}
				if (ua.match(/MicroMessenger/i) == 'micromessenger') {
					// 微信公众号
					return "h5-weixin";
				}
				if (ua.match(/alipay/i) == 'alipay' && ua.match(/miniprogram/i) == 'miniprogram') {
					return "mp-alipay";
				}
				if (ua.match(/alipay/i) == 'alipay') {
					return "h5-alipay";
				}
				// 外部 H5
				return "h5";
				// #endif
			}
		},
	}
</script>

<style lang="scss" scoped>
	.app{
		padding: 30rpx;
	}
	input {
		border: 1px solid #f3f3f3;
		padding: 10rpx;
	}

	button {
		margin-top: 20rpx;
	}
	
	.label{
		margin: 10rpx 0;
	}
	
	.tips{
		margin-top: 20rpx;
		font-size: 24rpx;
		color: #565656;
	}
	
</style>

