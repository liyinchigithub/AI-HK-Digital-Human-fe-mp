<template>
	<!-- 支付页面 -->
	<view>
		<view>
			<!-- 遮罩层 -->
			<u-overlay :show="maskShow" @click="maskShow = false"></u-overlay>
			<!-- 内容 -->
			<view class="">
				<uni-card class="card">
					<u-row gutter="12" style="margin-top: 10rpx;margin-bottom: 50rpx;">
						<u-col span="6" style="font-size: 50rpx;color: black;">
						<u--image :showLoading="true" :src="goodsInfo.image.url" width="40rpx" height="40rpx"></u--image>
						</u-col>
						<u-col span="6" style="font-size: 50rpx;color: black;">
						{{goodsInfo.title}}
						</u-col>
					</u-row>
					<u-row gutter="12" style="margin-top: 10rpx;margin-bottom: 50rpx;">
						<u-col span="6" style="font-size: 50rpx;color: black;">
						原价：
						{{goodsInfo.originalPrice}}
						</u-col>
						<u-col span="6" style="font-size: 50rpx;color: black;">
						现价：
						{{goodsInfo.currentPrice}}
						</u-col>
					</u-row>
				</uni-card>
				<uni-card class="card">
					<u-row gutter="12" style="margin-top: 10rpx;margin-bottom: 50rpx;">
						<u-col span="6" style="font-size: 50rpx;color: black;">
							微信支付：
						</u-col>
						<u-col span="6" offset="0" style="border: 10rpx;font-size: 45rpx;color: orange;">
							{{ amountPayable }}元
						</u-col>
					</u-row>
				</uni-card>
				<uni-card class="card">
					<u-row gutter="12" style="margin-top: 10rpx;margin-bottom: 50rpx;">
						<u-col span="6" style="font-size: 50rpx;color: black;">
							优惠金额：
						</u-col>
						<u-col span="6" offset="0" style="border: 10rpx;font-size: 45rpx;color: orange;">
							{{ cardDiscountAmount }}元
						</u-col>
					</u-row>
				</uni-card>
				<uni-card class="card">
					<u-row gutter="12" style="margin-top: 10rpx;margin-bottom: 50rpx;">
						<u-col span="6" style="font-size: 50rpx;color: black;">
							商品数量：
						</u-col>
						<u-col span="6" offset="0" style="border: 10rpx;font-size: 45rpx;color: orange;">
							{{ goodsCount }}
						</u-col>
					</u-row>
				</uni-card>
		<!-- 		<uni-card class="card">
					<u-row gutter="12" style="margin-top: 10rpx;margin-bottom: 50rpx;">
						<u-col span="6" style="font-size: 50rpx;color: black;">
							预约日期时间：
						</u-col>
						<u-col span="6" offset="0" style="border: 10rpx;font-size: 45rpx;color: orange;">
							{{ appointmentTime }}小时
						</u-col>
					</u-row>
				</uni-card> -->
			</view>
			<!-- 服务条款及规则 -->
			<view class="" @click="goto('/pages/business/articlesAgreement/articlesAgreement')">
				<view style="text-align: center;">
					点击确认支付即表示您已同意<text style="color: blue;">《服务条款及规则》</text>
				</view>
			</view>
			<!-- 确认支付 -->
			<view class="navigation">
				<!-- TODO 调用微信支付 -->
				<u-button type="primary" shape="circle" :ripple="true" size="default" @click="payOrder()">确认支付
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
				goodsInfo:"",
				goodsCount:1,// 商品数量
				goodsID:"",// 商品ID
				amountPayable: 0, // 应付金额
				appointmentTime: 0, // 使用时长
				cardDiscountAmount: 0, // 会员卡优惠金额
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
			payOrder() {
				// TODO 调用微信支付

				// TODO 订单编号
				this.orderNumber = String((new Date()).valueOf())
				// TODO 实际支付金额
				this.actualAmountPaid = 0
				// TODO 如果支付成功
				if (true) {
					// 插入一条预约记录（支付成功后才进行插入）
					this.addReservationRecord() //  插入记录回调中创建订单
					// this.goto(`/pages/payOrderResult/payOrderResult?orderNumber=${this.orderNumber}`)
				} else {

				}
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
						actualServiceDateTime: uni.getStorageSync("submitOrderData").actualServiceDateTime, // 实际上门服务日期时间
						paymentMethod: uni.getStorageSync("submitOrderData").paymentMethod, // 支付方式：1-计次卡、2-时长卡、3-期限卡、4-账户余额、5-微信支付
						cardID: uni.getStorageSync("orderSubmitSelectCardInfo")._id, // 会员卡id
						cardNumber: uni.getStorageSync("submitOrderData").cardNumber, // 会员卡编号
						isDone: false, // 是否完成
						isEnable: true, // 是否启用
					},
					success: (res) => {
						console.log("submit:", res.result.data);
						that.reservationID = (res.result.data).id;
						console.log("addReservationRecord reservationID：", that.reservationID);
						// 插入一条订单录（支付成功后才进行插入）
						this.createOrder({
							"orderStatus": 2,
							"actualAmountPaid": this.actualAmountPaid,
							"orderNumber": this.orderNumber
						}) // 1-待支付、2-已支付、3-退款中、4-已退款

						uni.showToast({
							title: '加载中',
							mask: true,
							duration: 2000,
						});

					},
				});
			},
			// 创建订单（支付成功后进行插入）
			createOrder(params) {
				var that = this;
				// TODO 判断支付是否成功？支付回调、沙盒支付
				uniCloud.callFunction({
					name: "order",
					data: {
						// TODO 补充记录微信支付回调参数？？？
						method: "createOrder",
						goodsName: uni.getStorageSync("submitOrderData").goodsName, // 商品名称
						goodsCount:this.goodsCount,// 商品数量
						goodsID: this.goodsID, // 商品ID
						orderNumber: params.orderNumber, // 订单编号
						orderType: uni.getStorageSync("submitOrderData").orderType, // 订单类型
						orderStatus: params.orderStatus, // 订单状态：1-已付款、2-退款中、3-已退款、4-已完成、5-待评价
						amountPayable: uni.getStorageSync("submitOrderData").amountPayable, // 应付金额
						actualAmountPaid: uni.getStorageSync("submitOrderData").actualAmountPaid, // TODO 实际支付金额（获取微信支付回调金额）
						discountAmount: uni.getStorageSync("submitOrderData").discountAmount, // 优惠金额
						reservationID: that.reservationID, // 预约记录ID
						openID: uni.getStorageSync("openID"), // 微信用户ID
						userID: uni.getStorageSync("userID"), // 用户ID
						expectedAppointmentDateTime: uni.getStorageSync("submitOrderData").expectedAppointmentDateTime, // 期望预约日期时间
						actualServiceDateTime: uni.getStorageSync("submitOrderData").actualServiceDateTime, // 实际上门服务日期时间
						isEnable: true, // 是否启用
					},
					success: (res) => {
						console.log("createOrder orderID：", res.result.data);
						that.orderID = res.result.data.id
						//  显示成功toast
						uni.showToast({
							title: 'TODO调用微信支付'
						});
						// 支付结果（用于传给支付结果页，展示支付成功还是失败） 0-未支付、1支付成功、2支付失败
						that.payResult = 1
						// 缓存订单号
						uni.setStorageSync("orderID", that.orderID)
						// 判断是否使用会员卡支付、会员卡类型
						// TODO 该会员卡在支付页支付时，扣除会员卡可用小时appointmentTime小时
						// TODO 该会员卡在支付页支付时，扣除会员卡可用次数1次
						// 跳转支付结果页
						uni.navigateTo({
							url: `/pages/payOrderResult/payOrderResult?orderID=${that.orderID}&reservationID=${that.reservationID}&payResult=${that.payResult}`,
						})
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
		},
		//添加控件依赖
		components: {},
		onLoad(options) {
			// 当前页面
			console.log(`当前页面:payOrder`);
			// 获取路由传入参数（其实在上个页面已缓存起来）
			this.submitOrderData = uni.getStorageSync("submitOrderData");
			// 商品ID
			this.goodsID=uni.getStorageSync("goodsID");
			console.log(`商品ID：${this.goodsID}`);
			// 请求商品信息
			uniCloud.callFunction({
				name:"goods",
				data:{
					"method":"getGoodsDetail",
					"_id": this.goodsID,
					"isEnable":true
				},
				success:(res)=>{
					this.goodsInfo=res.result.data[0]
					
					console.log(`pay Order getGoodsDetail res:${JSON.stringify(res.result.data[0])}`)
				}
			});
			
		},
		watch: {

		}
	};
</script>

<style lang="scss">
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
		height: 50px;
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