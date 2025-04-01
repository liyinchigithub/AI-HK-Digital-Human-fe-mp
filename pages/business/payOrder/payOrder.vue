<template>
	<!-- 支付页面 -->
	<view>
		<view>
			<!-- 遮罩层 -->
			<u-overlay :show="maskShow" @click="maskShow = false"></u-overlay>
			<!-- uni-pay 组件（隐藏） -->
			<!-- https://uniapp.dcloud.net.cn/uniCloud/uni-pay.html#组件方法 -->
			<!-- 其他参数 :debug="true" :adpid="adpid" return-url="/pages/business/orderDetail/orderDetail" -->
			<uni-pay ref="uniPay" v-show="false" @mounted="onMounted" @success="onSuccess" @fail="onFail"
				@create="onCreate" @cancel="onCancel" return-url="/pages/business/order/order?orderStatus=1"></uni-pay>
			<view class="">
				<uni-card class="card">
					<u-row gutter="12" style="margin-top: 10rpx;margin-bottom: 50rpx;">
						<u-col span="5" style="font-size: 50rpx;color: black;">
							<u--image :showLoading="true" :src="goodsInfo.image.url" width="200rpx"
								height="200rpx"></u--image>
						</u-col>
						<u-col span="8" style="font-size: 50rpx;color: black;">
							{{ goodsInfo.title }}
						</u-col>
					</u-row>
				</uni-card>
				<uni-card class="card">
					<u-row gutter="12">
						<u-col span="6">
							<text style="font-size: 30rpx;">数量：</text>
						</u-col>
						<u-col span="6" offset="0">
							<!-- 默认1个，todo 购物车 -->
							<text style="font-size: 30rpx;">x{{ orderGoodsCount }}</text>
						</u-col>
					</u-row>
				</uni-card>
				<uni-card class="card">
					<u-row gutter="12">
						<!-- 占位 -->
						<u-divider text=" "></u-divider>
					</u-row>
					<u-row gutter="12">
						<u-col span="6">
							<text style="margin-bottom: 100rpx;font-size: 40rpx;color:#c8c9cc;">原价：</text>
						</u-col>
						<u-col span="6" offset="0">
							<text style="margin-bottom: 100rpx;font-size: 40rpx;color:#c8c9cc;">¥{{
								goodsInfo.originalPrice }}元</text>
						</u-col>
					</u-row>
					<u-row gutter="12">
						<!-- 占位 -->
						<u-divider text=" "></u-divider>
					</u-row>
					<u-row gutter="12">
						<u-col span="6">
							<text style="margin-bottom: 100rpx;font-size: 40rpx;color:#c8c9cc;">优惠：</text>
						</u-col>
						<u-col span="6" offset="0">
							<!-- 原价减去现价 -->
							<text style="margin-bottom: 100rpx;font-size: 40rpx;color:#c8c9cc;">¥{{
								goodsInfo.originalPrice - goodsInfo.favourPrice }}元</text>
						</u-col>
					</u-row>
					<u-row gutter="12">
						<!-- 占位 -->
						<u-divider text=" "></u-divider>
					</u-row>
					<u-row gutter="12">
						<u-col span="6">
							<text style="margin-bottom: 100rpx;font-size: 40rpx;color: orange;">应付：</text>
						</u-col>
						<u-col span="6" offset="0">
							<text style="margin-bottom: 100rpx;border: 10rpx;font-size: 40rpx;color: orange;">¥{{
								(goodsInfo.favourPrice) * 1 }}元</text>
						</u-col>
					</u-row>
					<u-row gutter="12">
						<!-- 占位 -->
						<u-divider text=" "></u-divider>
					</u-row>
				</uni-card>
			</view>
			<!-- 服务条款及规则 -->
			<view class="" @click="goto('/pages/business/articlesAgreement/articlesAgreement')">
				<view style="text-align: center;">
					点击确认支付即表示您已同意<text style="color: blue;">《服务条款及规则》</text>
				</view>
			</view>
			<!-- 确认支付 -->
			<view class="navigation">
				<u-button type="primary" :ripple="true" size="large" @click="payOrder()">确认支付
				</u-button>
			</view>
		</view>
		<!-- 返回顶部 -->
		<view class="wrap">
			<u-back-top :scroll-top="scrollTop" :mode="mode" :icon-style="iconStyle"></u-back-top>
		</view>
	</view>
</template>

<script>
import {
	mapActions
} from "vuex";
export default {
	name: "orderDetail",
	data() {
		return {
			//支付字段
			total_fee: 1, // 支付金额，单位分 100 = 1元（0.01）
			order_no: "", // 业务系统订单号（即你自己业务系统的订单表的订单号）
			out_trade_no: "", // 插件支付单号
			description: "测试订单", // 支付描述
			type: "goods", // 支付回调类型 如 recharge 代表余额充值 goods 代表商品订单（可自定义，任意英文单词都可以，只要你在 uni-pay-co/notify/目录下创建对应的 xxx.js文件进行编写对应的回调逻辑即可）
			custom: {
				// orderGoodsID: "",
				// orderGoodsCount: 1,
				// originalPrice:0,
				// favourPrice:0,
				// amountPayable:0,
				// actuallyPaid:0,
			},
			// 商品信息
			goodsInfo: "",
			orderGoodsCount: 1, // 商品数量
			orderGoodsID: "", // 商品ID
			originalPrice: 0, // 原价
			favourPrice: 0, // 现价
			amountPayable: 0, // 应付金额
			actuallyPaid: 0, // 实际金额
			orderDiscountAmount: 0, // 优惠金额
			discountMethod: 0, // 优惠方式
			submitOrderData: "", // 提交订单时数据
			// 返回顶部
			scrollTop: 0,
			mode: "square",
			iconStyle: {
				fontSize: "40rpx",
				color: "#1296db",
				backgroundColor: "#fffff",
			},
			orderID: "", // 支付订单ID
			reservationID: "", // 预约记录ID
			payResult: 0, // 支付结果（用于传给支付结果页，展示支付成功还是失败） 0-未支付、1支付成功、2支付失败
			// 订单状态文字
			maskShow: false, // 遮罩
			payResultInfo: "", // 支付结果信息
			sharerOpenID: "", // 商品分享者ID（邀请者）
		};
	},
	methods: {
		...mapActions(["setNavigationBarTitle"]),
		// 返回顶部
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		goto(url) {
			uni.navigateTo({
				url: url,
				animationType: "slide-in-right",
				animationDuration: 300,
			});


		},
		// 
		/**
		 * 	description uni-pay
		 *  组件方法 => https://uniapp.dcloud.net.cn/uniCloud/uni-pay.html#组件方法
		 *  通过 let res = await this.$refs.uniPay.xxx(); 方式调用，
		 *  详情调用方式参考下方的【前端完整示例代码】
		 * 	方法名					说明
			open				    发起支付 - 打开支付收银台弹窗 查看详情
			createOrder				直接发起支付（无收银台） 查看详情
			getOrder				查询订单 查看详情
			refund					发起退款（此接口需要权限才可以访问） 查看详情
			getRefund				查询退款 查看详情
			closeOrder				关闭订单 查看详情
			getPayProviderFromCloud	获取支持的支付供应商 查看详情
			getProviderAppId	    获取支付配置内的appid（主要用于获取微信公众号的appid，用以获取code） 查看详情
			getOpenid				根据code获取openid （主要用于微信公众号code换取openid） 查看详情
		 * */
		async open() {
			// this.order_no = Date.now() + this.orderGoodsID + uni.getStorageSync("openID"); // 模拟生成订单号
			console.log("this.order_no：", this.order_no)
			this.out_trade_no = `${this.order_no}-${Math.floor(Math.random() * (10 - 1)) + 1}`; // 模拟生成插件支付单号
			// 打开支付收银台
			this.payResultInfo = await this.$refs.uniPay.open({
				total_fee: this.total_fee * 100, // 支付金额，单位分 100 = 1元
				order_no: this.order_no, // 业务系统订单号（即你自己业务系统的订单表的订单号）
				out_trade_no: this.out_trade_no, // 插件支付单号
				description: this.goodsInfo.title, // 支付描述
				// type 订单类型 goods：订单付款 recharge：余额充值付款 vip：vip充值付款 等等，可自定义，主要用于判断走哪个回调逻辑（如商品付款和余额充值的回调逻辑肯定是不一样的）
				type: this.type, // 支付回调类型goods.js、recharge.js 如果填 recharge 则支付成功后就会执行 recharge.js 内的代码逻辑
				// 自定义参数
				custom: {
					orderGoodsID: this.goodsInfo,
					orderGoodsCount: 1,
					originalPrice: this.originalPrice,
					favourPrice: this.favourPrice,
					amountPayable: this.amountPayable,
					sharerOpenID: this.sharerOpenID
				}, // 自定义数据

			});
			//
			console.log("open() payResultInfo:", this.payResultInfo)
			// 查询订单
			// this.getOrderInfo=await this.$refs.uniPay.getOrder({
			// 	out_trade_no: this.out_trade_no, // 插件支付单号
			// 	await_notify: false, // 是否需要等待异步通知执行完成，若为了响应速度，可以设置为false，若需要等待异步回调执行完成，则设置为true
			// });
			// console.log("open() getOrderInfo:",this.getOrderInfo)

		},
		// 确认支付
		payOrder() {
			// 创建订单，订单状态为待付款（支付成功后recharge.js更改订单状态）
			this.createOrder()
			// TODO 判断是否预约单，如果是预约单，支付成功-生成一条预约记录
			if (false) {
				// 插入一条预约记录（支付成功后才进行插入）
				this.addReservationRecord() //  插入记录回调中创建订单
				// this.goto(`/pages/business/payOrderResult/payOrderResult?orderNumber=${this.orderNumber}`)
			}
		},
		// 监听事件 - 支付订单创建成功（此时用户还未支付）
		onCreate(res) {
			console.log('uni-pay create: ', res);
			// 如果只是想生成支付二维码，不需要组件自带的弹窗，则在这里可以获取到支付二维码 qr_code_image
		},
		// 监听事件 - 支付成功
		onSuccess(res) {
			// toast
			uni.showToast({
				title: "支付成功"
			})
			console.log('uni-pay success: ', res);
			if (res.user_order_success) {
				// 代表用户已付款，且你自己写的回调成功并正确执行了
				console.log("uni-pay onSuccess 支付成功1")
				// 页面跳转
				this.goto("/uni_modules/uni-pay/pages/success/success")
				// 向用户申请模版消息权限
				this.getSubscribe()
			} else {
				// 代表用户已付款，但你自己写的回调执行成功（通常是因为你的回调代码有问题）
				console.log("uni-pay onSuccess 支付成功2")
			}
		},
		onFail(res) {
			console.log('uni-pay onFail: ', res);
			console.log("onFail 支付失败");
			// toast
			uni.showToast({
				title: "支付失败"
			})
			// 页面跳转
			this.goto("/pages/business/order/order?orderStatus=1")
		},
		// 支付取消的回调
		onCancel(res) {
			console.log('uni-pay onCancel: ', res);
			// toast
			uni.showToast({
				title: "取消支付"
			})
			// todo 生成一条待付款订单
		},
		// 支付组件加载完毕后执行
		onMounted(insideData) {
			this.init();
		},
		// 初始化
		async init() {
			// this.productList[0].checked = true;
			// this.productid = this.productList[0].productid;
			// this.disabled = false;
			// if (this.$refs.uniPay && this.$refs.uniPay.appleiapRestore) {
			// 	// ios内购支付漏单重试
			// 	this.$refs.uniPay.appleiapRestore();
			// }
		},
		// 插入一条预约记录（支付成功后才进行插入）
		addReservationRecord() {
			var that = this;
			uniCloud.callFunction({
				name: "addReservationRecord",
				data: {
					openID: uni.getStorageSync("openID"), // 微信openID
					userID: uni.getStorageSync("userID"), // 用户ID
					expectedAppointmentDateTime: (new Date(uni.getStorageSync("submitOrderData")
						.expectedAppointmentDateTime)).valueOf(), // 期望预约日期时间
					actualServiceDateTime: uni.getStorageSync("submitOrderData")
						.actualServiceDateTime, // 实际上门服务日期时间
					paymentMethod: uni.getStorageSync("submitOrderData")
						.paymentMethod, // 支付方式：1-计次卡、2-时长卡、3-期限卡、4-账户余额、5-微信支付
					cardID: uni.getStorageSync("orderSubmitSelectCardInfo")._id, // 会员卡id
					cardNumber: uni.getStorageSync("submitOrderData").cardNumber, // 会员卡编号
					isDone: false, // 是否完成
					isEnable: true, // 是否启用
				},
				success: (res) => {
					console.log("submit:", res.result.data);
					that.reservationID = (res.result.data).id;
					console.log("addReservationRecord reservationID：", that.reservationID);


					uni.showToast({
						title: '加载中',
						mask: true,
						duration: 2000,
					});

				},
			});
		},
		// 生成随机位数随机整数
		randomNum(n) {
			var res = "";
			for (var i = 0; i < n; i++) {
				res += Math.floor(Math.random() * 10);
			}
			return res;
		},
		// 创建订单（支付成功后进行插入）
		createOrder() {
			var that = this;
			// 生成订单编码（调微信支付用）（生成规则时间戳+部分微信openid）
			that.order_no = Date.now() + uni.getStorageSync("openID").substr(-15); // 模拟生成订单号
			// 创建订单（状态为“待付款”）
			uniCloud.callFunction({
				name: "order",
				data: {
					methods: "createOrder",
					orderType: 1, // 订单类型（1-普通商品订单、2-服务商品订单）
					orderNo: that.order_no, // 订单编号（微信支付参数）用户支付成功test.js、recharge.js、更改对应订单编号的订单支付状态
					orderGoodsCount: that.orderGoodsCount, // 商品数量
					orderGoodsID: that.orderGoodsID, // 商品ID
					openID: uni.getStorageSync("openID"), // 微信用户ID
					userID: uni.getStorageSync("userID"), // 用户ID
					sharerOpenID: that.sharerOpenID, // 用户ID
				},
				success: (res) => {
					console.log("createOrder res:", res);
					console.log("createOrder orderID：", res.result.data);
					that.orderID = res.result.data.id
					// TODO 调用微信支付
					/**
					 * https://uniapp.dcloud.net.cn/uniCloud/uni-pay.html#
					 * https://uniapp.dcloud.net.cn/uniCloud/uni-pay.html#config
					 * 
					 * 发起支付（唤起收银台，如果只有一种支付方式，则收银台不会弹出来，会直接使用此支付方式）
					 * 在调用此api前，你应该先创建自己的业务系统订单，并获得订单号 order_no，把order_no当参数传给此api，而示例中为了简化跟支付插件无关的代码，这里直接已时间戳生成了order_no
					 */
					that.open();
					// // 支付结果（用于传给支付结果页，展示支付成功还是失败） 0-未支付、1支付成功、2支付失败
					// that.payResult = 1
					// // 缓存订单号
					// uni.setStorageSync("orderID", that.orderID)

					// // 跳转支付结果页
					// uni.navigateTo({
					// 	url: `/pages/business/payOrderResult/payOrderResult?orderID=${that.orderID}&reservationID=${that.reservationID}&payResult=${that.payResult}`,
					// })
				},
			});
		},
		// 时间戳转年月日
		getYMDHMS(timestamp) {
			var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			var Y = date.getFullYear() + "-";
			var M =
				(date.getMonth() + 1 < 10 ?
					"0" + (date.getMonth() + 1) :
					date.getMonth() + 1) + "-";
			var D =
				(date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
			var h =
				(date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
			var m =
				(date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
				":";
			var s =
				date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

			var strDate = Y + M + D + h + m + s;
			return strDate;
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
	},
	created() {

	},
	//添加控件依赖
	components: {},
	onLoad(options) {
		// 当前页面
		console.log(`当前页面:payOrder`);
		// 获取路由传入参数（其实在上个页面已缓存起来）
		this.submitOrderData = uni.getStorageSync("submitOrderData");
		// 师傅ID
		this.workerID = options.workerID;
		console.log(`payOrder 师傅ID：${this.workerID}`);
		// TODO 处理单个商品和多个商品
		this.orderGoodsID = options.goodsID;
		console.log(`payOrder orderGoodsID：${this.orderGoodsID}`);
		// 处理所选商品数组
		// 如果是多个商品时
		if (options.selectedGoods) {
			const selectedGoods = JSON.parse(decodeURIComponent(options.selectedGoods));
			console.log(`pay order所选商品数组-多个商品：${selectedGoods}`);
			this.goodsInfo = selectedGoods;

			// 计算总价
			this.total_fee = selectedGoods.reduce((total, goods) => {
				return total + goods.price * goods.quantity;
			}, 0);
		} else {
			// 如果是单个商品时
			this.goodsInfo = JSON.parse(decodeURIComponent(options.selectedGoods));
			console.log(`pay order所选商品数组-单个商品：${options.selectedGoods}`);
			this.goodsInfo = selectedGoods;

			// 计算总价
			this.total_fee = selectedGoods.price * selectedGoods.quantity;
		}
		// 请求商品信息，计算应付金额 TODO 
		uniCloud.callFunction({
			name: "goods",
			data: {
				"methods": "getGoodsDetail",
				"goodsID": this.goodsID,
				"isEnable": true
			},
			success: (res) => {
				// 商品信息
				this.goodsInfo = res.result.data[0]
				// 应付金额（现价 ）
				this.total_fee = this.goodsInfo.favourPrice;
				console.log(`pay Order getGoodsDetail res:${JSON.stringify(res.result.data[0])}`)
			}
		});
		this.sharerOpenID = uni.getStorageSync("sharerInfo")["sharerOpenID"];

		// 判断是否为空
		if (this.sharerOpenID == undefined || this.sharerOpenID == "") {
			console.log("sharerOpenID 为空，该商品无人分享")
		} else {
			console.log("sharerOpenID 不为空，分享者ID为：" + this.sharerOpenID)
		}


	},
	watch: {

	}
};
</script>

<style lang="scss">
.huaxian {
	font-size: 30rpx;
	color: #82848a;
	text-decoration: line-through
}

.od-top-status {
	// position: relative;
	height: 250rpx;
	background: #34beff;
	margin-left: 2%;
	margin-right: 2%;
	margin-bottom: 2%;
	border-radius: 15rpx;
}

.title {
	position: absolute;
	margin-top: 2%;
	margin-left: 15%;
	color: #fff;
	font-size: 60rpx;
	// font-weight: bold
}

.icon {
	position: absolute;
	right: .4rem;
	-webkit-transform: translateY(-50%);
	transform: translateY(-50%);
	width: 80%;
	height: 100rpx;
}

.good-info {
	margin-top: 5%;
	margin-left: 10%;
	color: #000000;
	font-size: 30rpx;
}

.order-info {
	// position: relative;
	height: 250rpx;
	background: #ffffff;
	margin-left: 2%;
	margin-right: 2%;
	border-radius: 15rpx;
}

image {
	width: 300rpx;
	height: 300rpx;
	margin-right: 10rpx;
}

// 轮播图
.wrap {
	padding: 40rpx;
}

.payButton {
	text-align: right;
}

.content {
	display: flex;
	flex-direction: column;
	align-items: left;
	justify-content: center;

	.logo {
		width: 100%;
		min-height: 100rpx;
	}

	.uni-card {
		width: 95%;
		border-radius: 100rpx;
		text-align: left;
		color: #333;
		font-size: 30rpx;
		// text-align: justify;
		white-space: pre-wrap;
		line-height: 1.6;
	}

	.foot {
		color: #fff;
		margin: 20rpx 0;
	}
}

.navigation {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	/* #ifdef H5 */
	left: var(--window-left);
	right: var(--window-right);
	/* #endif */
	background-color: #ffffff;
	height: 120upx;
	box-shadow: -2px 0 24px rgba(255, 255, 255, 0.8);

	.uni-tabbar-border {
		background-color: rgba(0, 0, 0, 0.33);
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
	}
}
</style>